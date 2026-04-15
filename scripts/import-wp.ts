/**
 * WordPress → Next.js migration script
 *
 * Reads imperialmedia.WordPress.2026-04-15.xml, extracts all `webex_projects`
 * entries, downloads the first image from each into /public/projects/,
 * and writes lib/projects.ts with all project data.
 *
 * Usage:
 *   npx tsx scripts/import-wp.ts
 */

import fs from "node:fs";
import path from "node:path";
import https from "node:https";

const XML_PATH = path.resolve("imperialmedia.WordPress.2026-04-15.xml");
const OUT_IMG_DIR = path.resolve("public/projects");
const OUT_DATA = path.resolve("lib/projects-data.ts");

// --- Helpers ---------------------------------------------------------------

function cdata(s: string): string {
  const m = s.match(/<!\[CDATA\[([\s\S]*?)\]\]>/);
  return m ? m[1].trim() : s.trim();
}

function decodeEntities(s: string): string {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 60);
}

async function download(url: string, dest: string): Promise<boolean> {
  return new Promise((resolve) => {
    const req = https.get(
      url,
      {
        timeout: 15000,
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept:
            "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9,ro;q=0.8",
          Referer: "https://www.imperial-media.ro/",
        },
      },
      (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
          const loc = res.headers.location;
          if (loc) {
            download(loc, dest).then(resolve);
            return;
          }
        }
        if (res.statusCode !== 200) {
          console.warn(`  ✗ HTTP ${res.statusCode}: ${url}`);
          resolve(false);
          return;
        }
        const fileStream = fs.createWriteStream(dest);
        res.pipe(fileStream);
        fileStream.on("finish", () => {
          fileStream.close();
          resolve(true);
        });
        fileStream.on("error", () => resolve(false));
      }
    );
    req.on("error", (e) => {
      console.warn(`  ✗ ${url} → ${e.message}`);
      resolve(false);
    });
    req.on("timeout", () => {
      req.destroy();
      resolve(false);
    });
  });
}

// --- Main ------------------------------------------------------------------

type Project = {
  key: string;
  title: string;
  slug: string;
  categories: string[];
  image: string | null; // local path like "/projects/foo.jpg"
  wpImages: string[]; // original WP image URLs (browser can load them directly)
  externalUrl?: string;
  excerpt?: string; // prima frază din conținut
  content?: string; // HTML complet al proiectului
};

async function main() {
  if (!fs.existsSync(XML_PATH)) {
    console.error("XML file not found:", XML_PATH);
    process.exit(1);
  }
  if (!fs.existsSync(OUT_IMG_DIR)) fs.mkdirSync(OUT_IMG_DIR, { recursive: true });

  const xml = fs.readFileSync(XML_PATH, "utf-8");
  // Split by <item>
  const items = xml.split(/<item>/).slice(1);

  const projects: Project[] = [];
  let imgCount = 0;

  for (const raw of items) {
    // Only webex_projects
    if (!raw.includes("<wp:post_type><![CDATA[webex_projects]]>")) continue;
    // Only published
    if (!raw.includes("<wp:status><![CDATA[publish]]>")) continue;

    const titleM = raw.match(/<title>([\s\S]*?)<\/title>/);
    const nameM = raw.match(/<wp:post_name>([\s\S]*?)<\/wp:post_name>/);
    const contentM = raw.match(
      /<content:encoded>([\s\S]*?)<\/content:encoded>/
    );

    const title = decodeEntities(cdata(titleM?.[1] ?? "")).trim();
    const slug = cdata(nameM?.[1] ?? slugify(title));
    if (!title) continue;

    // Categories
    const catRe = /<category domain="webex_projects_cats"[^>]*>([\s\S]*?)<\/category>/g;
    const categories: string[] = [];
    let catMatch;
    while ((catMatch = catRe.exec(raw)) !== null) {
      categories.push(decodeEntities(cdata(catMatch[1])));
    }

    // Extract image URLs from content
    const content = contentM?.[1] ?? "";
    const imgs: string[] = [];
    const imgRe = /<img[^>]*\ssrc=["']([^"']+)["'][^>]*>/g;
    let imgMatch;
    while ((imgMatch = imgRe.exec(content)) !== null) {
      const src = imgMatch[1].replace(/&amp;/g, "&");
      // Skip tiny thumbs
      if (/-\d+x\d+\.(png|jpe?g|webp)$/i.test(src)) {
        // Prefer full version if we already have
      }
      if (/\.(png|jpe?g|webp)(\?|$)/i.test(src)) imgs.push(src);
    }

    // External URL (first external link that's not imperial-media.ro)
    const linkRe = /<a[^>]*\shref=["'](https?:\/\/[^"']+)["'][^>]*>/g;
    let externalUrl: string | undefined;
    let linkMatch;
    while ((linkMatch = linkRe.exec(content)) !== null) {
      const href = linkMatch[1];
      if (!/imperial-media\.ro/i.test(href)) {
        externalUrl = href;
        break;
      }
    }

    // Pick best image (prefer non-thumbnail sized)
    const bestImg =
      imgs.find((u) => !/-\d+x\d+\.(png|jpe?g|webp)$/i.test(u)) ?? imgs[0];

    let localPath: string | null = null;
    if (bestImg) {
      const ext = (bestImg.match(/\.(png|jpe?g|webp)/i)?.[1] ?? "jpg").toLowerCase();
      const fileName = `${slug}.${ext}`;
      const destPath = path.join(OUT_IMG_DIR, fileName);
      if (!fs.existsSync(destPath)) {
        console.log(`  ↓ ${title} → ${fileName}`);
        const ok = await download(bestImg, destPath);
        if (ok) {
          imgCount++;
          localPath = `/projects/${fileName}`;
        }
      } else {
        localPath = `/projects/${fileName}`;
      }
    }

    // Extract excerpt: first <p> text (strip HTML)
    const firstPara = content.match(/<p>([\s\S]*?)<\/p>/);
    const excerpt = firstPara
      ? decodeEntities(firstPara[1].replace(/<[^>]+>/g, "")).trim().slice(0, 200)
      : undefined;

    // Clean content: remove CDATA + empty anchor tags (social icons without href)
    let cleanContent = content.trim();
    // Elimină CDATA wrapper dacă a rămas
    cleanContent = cleanContent.replace(/^<!\[CDATA\[/, "").replace(/\]\]>$/, "");
    // Elimină <a target=blank fără href (butoanele sociale din Elementor export)
    cleanContent = cleanContent.replace(
      /<a\s+target="_blank"[^>]*rel="noopener"[^>]*>[\s\S]*?<\/a>/g,
      ""
    );
    // Normalizează whitespace excessiv
    cleanContent = cleanContent.replace(/\n\s+\n/g, "\n").replace(/\t+/g, " ").trim();

    projects.push({
      key: slug,
      title,
      slug,
      categories,
      image: localPath,
      wpImages: imgs.filter((u) => !/-\d+x\d+\.(png|jpe?g|webp)$/i.test(u)).length
        ? imgs.filter((u) => !/-\d+x\d+\.(png|jpe?g|webp)$/i.test(u))
        : imgs,
      externalUrl,
      excerpt,
      content: cleanContent,
    });
  }

  console.log(
    `\n✓ Parsed ${projects.length} projects, downloaded ${imgCount} images`
  );

  // Write data file
  const data = `// Auto-generated by scripts/import-wp.ts — DO NOT EDIT MANUALLY
// Run \`npx tsx scripts/import-wp.ts\` to regenerate.

export type ImportedProject = {
  key: string;
  title: string;
  slug: string;
  categories: string[];
  image: string | null;
  wpImages: string[];
  externalUrl?: string;
  excerpt?: string;
  content?: string;
};

export const importedProjects: ImportedProject[] = ${JSON.stringify(projects, null, 2)};
`;
  fs.writeFileSync(OUT_DATA, data, "utf-8");
  console.log(`✓ Wrote ${OUT_DATA}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
