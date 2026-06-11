"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  IconArrowLeft,
  IconStarFilled,
  IconClock,
  IconCash,
  IconShieldCheck,
  IconMessageCircle,
  IconPaperclip,
  IconSend,
  IconUser,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CategoryBadge, SkillTag } from "@/components/status-badge";
import { UserAvatar } from "@/components/user-avatar";
import { PageTransition, AnimatedCard } from "@/components/motion";

// Mock task data
const task = {
  id: "1",
  title: "Tugas Algoritma & Struktur Data — Implementasi Graph BFS/DFS",
  category: "Programming",
  budget: "Rp 200.000",
  deadline: "15 Juni 2026",
  status: "OPEN",
  description: `Butuh bantuan implementasi algoritma BFS dan DFS menggunakan Python.

**Requirement:**
- Implementasi BFS (Breadth-First Search) dan DFS (Depth-First Search)
- Menggunakan bahasa Python 3.x
- Harus ada visualisasi output (bisa text-based atau matplotlib)
- Laporan penjelasan dalam format PDF (min. 5 halaman)
- Source code harus well-documented dengan komentar yang jelas

**Input yang akan disediakan:**
- Adjacency list / matrix untuk graph
- Template laporan (akan dikirim setelah worker terpilih)

**Format Output:**
- File .py untuk source code
- File .pdf untuk laporan`,
  tags: ["Python", "Algoritma", "Struktur Data", "Graph"],
  client: { name: "Andi Pratama", rating: 4.8, totalTasks: 15, joinDate: "Jan 2026" },
  bids: [
    {
      id: "b1",
      worker: { name: "Ahmad Fauzi", rating: 4.9, completedTasks: 45, verified: true },
      amount: "Rp 180.000", estimasi: "2 hari",
      message: "Saya berpengalaman di bidang algoritma dan sudah sering mengerjakan tugas sejenis. Saya bisa selesaikan dalam 2 hari dengan kualitas terjamin.",
    },
    {
      id: "b2",
      worker: { name: "Siti Nurhaliza", rating: 5.0, completedTasks: 32, verified: true },
      amount: "Rp 200.000", estimasi: "1 hari",
      message: "Lulusan Teknik Informatika ITB. Spesialisasi di graph theory dan algorithmic problem solving. Bisa express 1 hari.",
    },
    {
      id: "b3",
      worker: { name: "Budi Santoso", rating: 4.7, completedTasks: 18, verified: false },
      amount: "Rp 150.000", estimasi: "3 hari",
      message: "Mahasiswa S2 Ilmu Komputer. Saya siap mengerjakan tugas ini dengan harga lebih terjangkau. Termasuk penjelasan detail di laporan.",
    },
    {
      id: "b4",
      worker: { name: "Diana Kusuma", rating: 4.8, completedTasks: 27, verified: true },
      amount: "Rp 220.000", estimasi: "2 hari",
      message: "Pengajar programming di Binus. Saya akan memberikan solusi dengan pendekatan edukatif sehingga Anda bisa menjelaskan saat ditanya dosen.",
    },
  ],
};

export default function TaskDetailPage() {
  const { data: session } = useSession();
  const userRole = session?.user?.role || "CLIENT";

  return (
    <PageTransition className="space-y-6">
      {/* Back */}
      <AnimatedCard>
        <Link
          href="/dashboard/tasks"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <IconArrowLeft size={16} />
          Kembali ke Daftar Tugas
        </Link>
      </AnimatedCard>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Task Header */}
          <AnimatedCard>
            <Card className="border-border/50">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <CategoryBadge category={task.category} />
                  <Badge variant="outline" className="text-xs font-semibold bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/10">
                    Terbuka
                  </Badge>
                </div>

                <h1 className="text-lg sm:text-xl font-bold tracking-tight">{task.title}</h1>

                <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <IconCash size={16} className="text-emerald-400" />
                    <strong className="text-foreground">{task.budget}</strong>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <IconClock size={16} />
                    {task.deadline}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <IconMessageCircle size={16} />
                    {task.bids.length} penawaran
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mt-4">
                  {task.tags.map((tag) => (
                    <SkillTag key={tag} skill={tag} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </AnimatedCard>

          {/* Description */}
          <AnimatedCard>
            <Card className="border-border/50">
              <CardContent className="p-4 sm:p-6">
                <h2 className="font-semibold mb-4">Deskripsi & Instruksi</h2>
                <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {task.description}
                </div>
              </CardContent>
            </Card>
          </AnimatedCard>

          {/* Bids */}
          <AnimatedCard>
            <Card className="border-border/50">
              <div className="p-4 sm:p-6 border-b border-border/50">
                <h2 className="font-semibold">Penawaran ({task.bids.length})</h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Bandingkan penawaran dari worker dan pilih yang terbaik.
                </p>
              </div>

              <div className="divide-y divide-border/50">
                {task.bids.map((bid) => (
                  <div key={bid.id} className="p-4 sm:p-6 hover:bg-accent/30 transition-colors">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <UserAvatar name={bid.worker.name} size="md" className="hidden sm:flex" />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-sm">{bid.worker.name}</span>
                          {bid.worker.verified && <IconShieldCheck size={16} className="text-blue-400" />}
                          <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                            <IconStarFilled size={12} className="text-amber-400" />
                            {bid.worker.rating}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            · {bid.worker.completedTasks} tugas selesai
                          </span>
                        </div>

                        <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                          {bid.message}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 mt-3">
                          <span className="text-sm font-bold text-primary">{bid.amount}</span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <IconClock size={14} />
                            Estimasi: {bid.estimasi}
                          </span>
                        </div>
                      </div>

                      {userRole === "CLIENT" && (
                        <Button
                          size="sm"
                          className="flex-shrink-0 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-500/25"
                        >
                          Pilih Worker
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </AnimatedCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Client Info */}
          <AnimatedCard>
            <Card className="border-border/50">
              <CardContent className="p-4 sm:p-6">
                <h3 className="font-semibold text-sm mb-4">Informasi Client</h3>
                <div className="flex items-center gap-3 mb-4">
                  <UserAvatar name={task.client.name} gradient="from-amber-500 to-orange-500" size="lg" />
                  <div>
                    <div className="font-semibold text-sm">{task.client.name}</div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <IconStarFilled size={12} className="text-amber-400" />
                      {task.client.rating} · {task.client.totalTasks} tugas
                    </div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  <IconUser size={14} className="inline mr-1" />
                  Bergabung sejak {task.client.joinDate}
                </div>
              </CardContent>
            </Card>
          </AnimatedCard>

          {/* Quick Bid (Only for Worker) */}
          {userRole === "WORKER" && (
            <AnimatedCard>
              <Card className="border-primary/30 bg-primary/5">
                <CardContent className="p-4 sm:p-6 space-y-4">
                  <div>
                    <h3 className="font-semibold text-sm">Ajukan Penawaran</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Tertarik mengerjakan tugas ini? Ajukan penawaran Anda.
                    </p>
                  </div>

                  <div>
                    <Label className="text-xs">Harga Penawaran (Rp)</Label>
                    <Input type="number" placeholder="200000" className="mt-1.5 rounded-xl h-10 bg-background" />
                  </div>

                  <div>
                    <Label className="text-xs">Estimasi Pengerjaan</Label>
                    <Input type="text" placeholder="2 hari" className="mt-1.5 rounded-xl h-10 bg-background" />
                  </div>

                  <div>
                    <Label className="text-xs">Pesan / Cover Letter</Label>
                    <Textarea rows={3} placeholder="Jelaskan kenapa Anda cocok untuk tugas ini..." className="mt-1.5 rounded-xl bg-background resize-none" />
                  </div>

                  <Button className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-500/25 gap-2">
                    <IconSend size={16} />
                    Kirim Penawaran
                  </Button>
                </CardContent>
              </Card>
            </AnimatedCard>
          )}

          {/* Attachments */}
          <AnimatedCard>
            <Card className="border-border/50">
              <CardContent className="p-4 sm:p-6 space-y-3">
                <h3 className="font-semibold text-sm">Lampiran</h3>
                <div className="space-y-2">
                  {[
                    { name: "template_laporan.pdf", size: "2.1 MB" },
                    { name: "contoh_graph.py", size: "4.5 KB" },
                  ].map((file) => (
                    <div key={file.name} className="flex items-center gap-3 p-3 rounded-xl bg-accent/50 text-sm">
                      <IconPaperclip size={16} className="text-muted-foreground flex-shrink-0" />
                      <span className="truncate text-xs">{file.name}</span>
                      <span className="text-[10px] text-muted-foreground flex-shrink-0 ml-auto">{file.size}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </AnimatedCard>
        </div>
      </div>
    </PageTransition>
  );
}
