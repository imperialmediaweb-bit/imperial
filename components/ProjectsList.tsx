"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter } from "lucide-react";
import { ProjectCard } from "@/components/Projects";
import { importedProjects } from "@/lib/projects-data";
import { sortProjectsNewestFirst } from "@/lib/project-overrides";

const sortedProjects = sortProjectsNewestFirst(importedProjects);

const SPAN_CYCLE = [
  { col: "lg:col-span-8", row: "lg:row-span-2", big: true },
  { col: "lg:col-span-4", row: "lg:row-span-1", big: false },
  { col: "lg:col-span-4", row: "lg:row-span-1", big: false },
  { col: "lg:col-span-4", row: "lg:row-span-1", big: false },
  { col: "lg:col-span-4", row: "lg:row-span-1", big: false },
];

const FALLBACK_GRADIENTS = [
  "from-brand-orange via-pink-500 to-brand-purple",
  "from-brand-purple to-indigo-600",
  "from-amber-500 to-brand-orange",
  "from-emerald-500 to-teal-600",
  "from-brand-orange to-amber-500",
  "from-pink-500 via-brand-purple to-indigo-500",
];

export function ProjectsListClient() {
  const [activeCat, setActiveCat] = useState<string>("Toate");
  const [search, setSearch] = useState("");

  const allCats = useMemo(() => {
    const set = new Set<string>();
    sortedProjects.forEach((p) =>
      p.categories.forEach((c) => set.add(c))
    );
    return ["Toate", ...Array.from(set).sort()];
  }, []);

  const catCounts = useMemo(() => {
    const counts: Record<string, number> = {
      Toate: sortedProjects.length,
    };
    sortedProjects.forEach((p) => {
      p.categories.forEach((c) => {
        counts[c] = (counts[c] ?? 0) + 1;
      });
    });
    return counts;
  }, []);

  const filtered = useMemo(() => {
    return sortedProjects.filter((p) => {
      const matchesCat =
        activeCat === "Toate" || p.categories.includes(activeCat);
      const matchesSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.categories.some((c) =>
          c.toLowerCase().includes(search.toLowerCase())
        );
      return matchesCat && matchesSearch;
    });
  }, [activeCat, search]);

  return (
    <>
      {/* FILTER BAR sticky */}
      <div className="sticky top-16 z-30 border-y border-bg-border/60 bg-bg/85 backdrop-blur-xl sm:top-20">
        <div className="container-app py-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative lg:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-subtle" />
              <input
                type="text"
                placeholder="Caută proiect..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-full border border-bg-border bg-bg-soft/60 py-2 pl-9 pr-4 text-sm text-text placeholder:text-text-subtle outline-none transition focus:border-brand-orange focus:bg-bg-soft"
              />
            </div>

            <div className="flex flex-1 flex-wrap items-center gap-2 overflow-x-auto">
              <Filter className="hidden h-4 w-4 text-text-subtle lg:inline" />
              {allCats.map((c) => {
                const active = activeCat === c;
                return (
                  <button
                    key={c}
                    onClick={() => setActiveCat(c)}
                    className={`group inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                      active
                        ? "border-brand-orange bg-orange-gradient text-white shadow-glow-orange"
                        : "border-bg-border bg-white/5 text-text-muted hover:border-brand-orange/60 hover:text-text"
                    }`}
                  >
                    {c}
                    <span
                      className={`rounded-full px-1.5 text-[10px] ${
                        active
                          ? "bg-white/20 text-white"
                          : "bg-bg-soft text-text-subtle"
                      }`}
                    >
                      {catCounts[c] ?? 0}
                    </span>
                  </button>
                );
              })}
            </div>

            <p className="text-xs text-text-subtle">
              <span className="font-semibold text-text">
                {filtered.length}
              </span>{" "}
              / {sortedProjects.length}
            </p>
          </div>
        </div>
      </div>

      <section className="relative pb-24 pt-12">
        <div className="container-app">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center gap-4 py-20 text-center"
              >
                <div className="grid h-16 w-16 place-items-center rounded-full bg-bg-card">
                  <Search className="h-6 w-6 text-text-subtle" />
                </div>
                <p className="text-text-muted">
                  Niciun proiect găsit. Încearcă alt filtru.
                </p>
                <button
                  onClick={() => {
                    setActiveCat("Toate");
                    setSearch("");
                  }}
                  className="btn-ghost"
                >
                  Resetează filtrele
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                layout
                className="grid auto-rows-[220px] gap-4 lg:grid-cols-12 lg:auto-rows-[260px]"
              >
                {filtered.map((p, idx) => {
                  const span = SPAN_CYCLE[idx % SPAN_CYCLE.length];
                  const grad =
                    FALLBACK_GRADIENTS[idx % FALLBACK_GRADIENTS.length];
                  return (
                    <ProjectCard
                      key={p.key}
                      p={p}
                      idx={idx}
                      span={span}
                      grad={grad}
                    />
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </>
  );
}
