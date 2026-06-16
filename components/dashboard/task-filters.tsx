"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { IconSearch, IconFilter } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { IconInput } from "@/components/icon-input";
import { AnimatedCard } from "@/components/motion";

const categories = ["Semua", "Programming", "Penulisan", "Desain", "Tugas Kuliah", "Presentasi", "Data Entry"];

export function TaskFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentQuery = searchParams.get("q") || "";
  const currentCat = searchParams.get("cat") || "Semua";

  const [query, setQuery] = useState(currentQuery);

  // Sync state if URL changes directly
  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const updateFilters = useCallback((newQuery: string, newCat: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (newQuery) {
      params.set("q", newQuery);
    } else {
      params.delete("q");
    }

    if (newCat && newCat !== "Semua") {
      params.set("cat", newCat);
    } else {
      params.delete("cat");
    }

    router.push(`${pathname}?${params.toString()}`);
  }, [pathname, router, searchParams]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query !== currentQuery) {
        updateFilters(query, currentCat);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query, currentQuery, currentCat, updateFilters]);

  return (
    <>
      {/* Search & Filters */}
      <AnimatedCard className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <IconInput
            icon={IconSearch}
            placeholder="Cari tugas berdasarkan judul, kategori..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-12 rounded-xl gap-2">
          <IconFilter size={18} />
          Filter
        </Button>
      </AnimatedCard>

      {/* Category pills */}
      <AnimatedCard className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat, i) => {
          const isActive = currentCat === cat;
          return (
            <Button
              key={cat}
              onClick={() => updateFilters(query, cat)}
              variant={isActive ? "default" : "outline"}
              size="sm"
              className={`flex-shrink-0 rounded-full transition-all ${
                isActive ? "shadow-lg shadow-primary/25 bg-brand-gradient border-transparent" : "hover:border-primary/50"
              }`}
            >
              {cat}
            </Button>
          );
        })}
      </AnimatedCard>
    </>
  );
}
