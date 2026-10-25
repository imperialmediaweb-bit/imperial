// Linkul de dezabonare de la reamintirile analizei: semnat, ca nimeni să nu poată
// dezabona pe altcineva ghicind adrese.

import { createHmac } from "crypto";
import { siteConfig } from "./site";

const secret = () => process.env.CRON_SECRET || process.env.ANTHROPIC_API_KEY || "imperial";

export function stopToken(email: string): string {
  return createHmac("sha256", secret()).update(`analiza-stop:${email.toLowerCase()}`).digest("hex").slice(0, 24);
}

export function stopUrl(email: string): string {
  return `${siteConfig.url}/api/analiza/dezabonare?e=${encodeURIComponent(email.toLowerCase())}&t=${stopToken(email)}`;
}
