"use client";

import { IconSearch, IconFilter } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { TaskCard, type TaskData } from "@/components/task-card";
import { IconInput } from "@/components/icon-input";
import { PageTransition, AnimatedCard } from "@/components/motion";

const mockTasks: TaskData[] = [
  {
    id: "1", title: "Tugas Algoritma & Struktur Data — Implementasi Graph BFS/DFS",
    category: "Programming", budget: "Rp 200.000", deadline: "3 hari lagi", urgency: "high",
    bids: 5, client: { name: "Andi P.", rating: 4.8 },
    description: "Butuh bantuan implementasi algoritma BFS dan DFS menggunakan Python. Harus ada visualisasi output dan laporan penjelasan.",
    tags: ["Python", "Algoritma", "Struktur Data"],
  },
  {
    id: "2", title: "Makalah Hukum Pidana — Analisis UU ITE Pasal 27",
    category: "Penulisan", budget: "Rp 120.000", deadline: "5 hari lagi", urgency: "medium",
    bids: 3, client: { name: "Dewi S.", rating: 4.9 },
    description: "Makalah 15-20 halaman dengan format APA. Topik mengenai penerapan UU ITE Pasal 27 dalam kasus pencemaran nama baik.",
    tags: ["Hukum", "Makalah", "APA Style"],
  },
  {
    id: "3", title: "Desain UI/UX E-Commerce App — Figma High Fidelity",
    category: "Desain", budget: "Rp 500.000", deadline: "7 hari lagi", urgency: "low",
    bids: 8, client: { name: "Rizky F.", rating: 5.0 },
    description: "Desain lengkap aplikasi e-commerce di Figma termasuk home, product detail, cart, dan checkout flow. Modern & clean style.",
    tags: ["Figma", "UI/UX", "Mobile App"],
  },
  {
    id: "4", title: "Laporan Praktikum Fisika — Gerak Parabola",
    category: "Tugas Kuliah", budget: "Rp 75.000", deadline: "2 hari lagi", urgency: "high",
    bids: 2, client: { name: "Maya R.", rating: 4.7 },
    description: "Laporan praktikum lengkap dengan analisis data, grafik menggunakan Excel, dan pembahasan. Template sudah disediakan.",
    tags: ["Fisika", "Laporan", "Excel"],
  },
  {
    id: "5", title: "Website Portfolio Personal — Next.js + Tailwind CSS",
    category: "Programming", budget: "Rp 350.000", deadline: "10 hari lagi", urgency: "low",
    bids: 12, client: { name: "Budi K.", rating: 4.6 },
    description: "Website portfolio modern dengan dark mode, animasi, responsive design. Harus deploy ke Vercel. Desain referensi akan diberikan.",
    tags: ["Next.js", "Tailwind", "React"],
  },
  {
    id: "6", title: "Presentasi PowerPoint — Strategi Digital Marketing 2026",
    category: "Presentasi", budget: "Rp 100.000", deadline: "4 hari lagi", urgency: "medium",
    bids: 4, client: { name: "Lisa A.", rating: 4.9 },
    description: "Presentasi 20 slide dengan desain premium, infografis, dan speaker notes. Topik mengenai tren digital marketing tahun 2026.",
    tags: ["PowerPoint", "Marketing", "Desain"],
  },
];

const categories = ["Semua", "Programming", "Penulisan", "Desain", "Tugas Kuliah", "Presentasi", "Data Entry"];

export default function TasksPage() {
  return (
    <PageTransition className="space-y-6">
      <AnimatedCard>
        <PageHeader
          title="Cari Tugas"
          description="Temukan tugas yang cocok dengan keahlian Anda."
        />
      </AnimatedCard>

      {/* Search & Filters */}
      <AnimatedCard className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <IconInput
            icon={IconSearch}
            placeholder="Cari tugas berdasarkan judul, kategori, atau skill..."
          />
        </div>
        <Button variant="outline" className="h-12 rounded-xl gap-2">
          <IconFilter size={18} />
          Filter
        </Button>
      </AnimatedCard>

      {/* Category pills */}
      <AnimatedCard className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat, i) => (
          <Button
            key={cat}
            variant={i === 0 ? "default" : "outline"}
            size="sm"
            className={`flex-shrink-0 rounded-full ${
              i === 0 ? "shadow-lg shadow-primary/25" : ""
            }`}
          >
            {cat}
          </Button>
        ))}
      </AnimatedCard>

      {/* Task Cards */}
      <div className="grid gap-4">
        {mockTasks.map((task) => (
          <AnimatedCard key={task.id}>
            <TaskCard task={task} />
          </AnimatedCard>
        ))}
      </div>
    </PageTransition>
  );
}
