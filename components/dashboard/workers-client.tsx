"use client";

import { useState } from "react";
import Link from "next/link";
import { IconSearch, IconFilter, IconStarFilled, IconBriefcase, IconMapPin } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { IconInput } from "@/components/icon-input";
import { PageTransition, AnimatedCard, staggerItem } from "@/components/motion";
import { Card, CardContent } from "@/components/ui/card";
import { UserAvatar } from "@/components/user-avatar";
import { SkillTag } from "@/components/status-badge";
import { motion } from "framer-motion";
import { FormattedWorker } from "@/lib/services/workers";

export function WorkersClient({ initialWorkers }: { initialWorkers: FormattedWorker[] }) {
  const [search, setSearch] = useState("");

  const filteredWorkers = initialWorkers.filter((w) => 
    w.name.toLowerCase().includes(search.toLowerCase()) || 
    w.title.toLowerCase().includes(search.toLowerCase()) ||
    w.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <PageTransition className="space-y-6">
      <AnimatedCard>
        <PageHeader
          title="Cari Worker Terbaik"
          description="Temukan talenta profesional yang tepat untuk membantu menyelesaikan tugas Anda."
        />
      </AnimatedCard>

      {/* Search & Filters */}
      <AnimatedCard className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <IconInput
            icon={IconSearch}
            placeholder="Cari berdasarkan nama, keahlian, atau profesi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-12 rounded-xl gap-2">
          <IconFilter size={18} />
          Filter
        </Button>
      </AnimatedCard>

      {/* Worker Grid */}
      <motion.div 
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        initial="hidden"
        animate="visible"
        className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6"
      >
        {filteredWorkers.map((worker) => (
          <motion.div key={worker.id} variants={staggerItem}>
            <Link href={`/dashboard/workers/${worker.id}`}>
              <Card className="group h-full border-border/50 bg-card hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 flex flex-col cursor-pointer">
                <CardContent className="p-5 flex flex-col h-full">
                  <div className="flex items-start gap-4 mb-4">
                    <UserAvatar name={worker.name} size="lg" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-base group-hover:text-primary transition-colors truncate">
                        {worker.name}
                      </h3>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{worker.title}</p>
                      <div className="flex items-center gap-1 text-xs font-medium mt-1">
                        <IconStarFilled size={12} className="text-amber-400" />
                        {worker.rating.toFixed(1)} <span className="text-muted-foreground font-normal">({worker.reviews} ulasan)</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4 mt-auto">
                    {worker.skills.slice(0, 3).map((skill) => (
                      <SkillTag key={skill} skill={skill} />
                    ))}
                    {worker.skills.length > 3 && (
                      <span className="text-[10px] text-muted-foreground font-medium px-2 py-1 rounded-md bg-accent/50">
                        +{worker.skills.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-border/50 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <IconBriefcase size={14} />
                      {worker.tasks} Tugas
                    </div>
                    <div className="flex items-center gap-1.5">
                      <IconMapPin size={14} />
                      {worker.location}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {filteredWorkers.length === 0 && (
        <AnimatedCard className="flex flex-col items-center justify-center p-12 text-center border rounded-2xl border-dashed bg-card/50">
          <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-4">
            <IconSearch className="text-muted-foreground" size={24} />
          </div>
          <h3 className="text-lg font-semibold">Worker Tidak Ditemukan</h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-sm">
            {initialWorkers.length === 0 
              ? "Belum ada worker yang terdaftar di sistem saat ini." 
              : `Tidak ada worker yang cocok dengan kata kunci "${search}".`}
          </p>
        </AnimatedCard>
      )}
    </PageTransition>
  );
}
