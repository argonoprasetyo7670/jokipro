import Link from "next/link";
import { notFound } from "next/navigation";
import {
  IconArrowLeft,
  IconStarFilled,
  IconMapPin,
  IconShieldCheck,
  IconCalendarEvent,
  IconClock,
  IconChecks,
  IconLink,
  IconBriefcase,
  IconCash
} from "@tabler/icons-react";
import { Card, CardContent } from "@/components/ui/card";
import { SkillTag } from "@/components/status-badge";
import { UserAvatar } from "@/components/user-avatar";
import { PageTransition, AnimatedCard } from "@/components/motion";
import { InviteWorkerDialog } from "@/components/dashboard/invite-worker-dialog";
import { getWorkerById } from "@/lib/services/workers";

export default async function WorkerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const worker = await getWorkerById(id);

  console.log({ worker });

  if (!worker) {
    notFound();
  }

  return (
    <PageTransition className="space-y-6">
      {/* Back */}
      <AnimatedCard>
        <Link
          href="/dashboard/workers"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <IconArrowLeft size={16} />
          Kembali ke Daftar Worker
        </Link>
      </AnimatedCard>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Sidebar (Profile Info & Action) */}
        <div className="space-y-6">
          <AnimatedCard>
            <Card className="border-border/50 relative overflow-hidden">
              <div className="h-24 bg-gradient-to-r from-violet-600 to-indigo-600 absolute top-0 left-0 right-0 z-0" />
              <CardContent className="p-6 pt-12 relative z-10 flex flex-col items-center text-center">
                <UserAvatar name={worker.name} image={worker.image} size="xl" className="border-4 border-card mb-4 shadow-xl" />

                <h1 className="text-xl font-bold tracking-tight flex items-center gap-1.5">
                  {worker.name}
                  {worker.verified && <IconShieldCheck size={20} className="text-blue-400" />}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">{worker.title}</p>

                <div className="flex items-center justify-center gap-4 mt-4 text-xs font-medium">
                  <span className="flex items-center gap-1 text-amber-400">
                    <IconStarFilled size={14} />
                    {worker.rating} <span className="text-muted-foreground">({worker.reviews})</span>
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <IconMapPin size={14} />
                    {worker.location}
                  </span>
                </div>

                <InviteWorkerDialog workerName={worker.name} workerId={worker.id} />
              </CardContent>
            </Card>
          </AnimatedCard>

          <AnimatedCard>
            <Card className="border-border/50">
              <CardContent className="p-6">
                <div className="grid grid-cols-3 gap-3 sm:gap-4">
                  <div className="rounded-xl bg-accent/50 p-3 sm:p-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-base sm:text-lg font-bold">
                      <IconStarFilled size={16} className="text-amber-400" />
                      {worker.rating}
                    </div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground mt-1">Rating</div>
                  </div>
                  <div className="rounded-xl bg-accent/50 p-3 sm:p-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-base sm:text-lg font-bold">
                      <IconBriefcase size={16} className="text-primary" />
                      {worker.tasksCompleted}
                    </div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground mt-1">Total Tugas</div>
                  </div>
                  <div className="rounded-xl bg-accent/50 p-3 sm:p-4 text-center">
                    <div className="flex items-center justify-center gap-1 text-base sm:text-lg font-bold">
                      <IconCash size={16} className="text-emerald-400" />
                      <span className="truncate">{worker.totalTransaction}</span>
                    </div>
                    <div className="text-[10px] sm:text-xs text-muted-foreground mt-1">Transaksi</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </AnimatedCard>
        </div>

        {/* Main Content (Bio, Skills, Reviews) */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatedCard>
            <Card className="border-border/50">
              <CardContent className="p-6">
                <h2 className="font-semibold text-lg mb-4">Tentang Saya</h2>
                <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {worker.bio}
                </div>

                <h3 className="font-semibold mt-6 mb-3">Keahlian (Skills)</h3>
                <div className="flex flex-wrap gap-2">
                  {worker.skills.map((skill) => (
                    <SkillTag key={skill} skill={skill} />
                  ))}
                </div>
              </CardContent>
            </Card>
          </AnimatedCard>

          <AnimatedCard>
            <Card className="border-border/50">
              <div className="p-6 border-b border-border/50">
                <h2 className="font-semibold text-lg">Portofolio & Karya</h2>
              </div>
              <div className="p-6 grid sm:grid-cols-2 gap-6">
                {worker.portfolioUrls.length > 0 ? (
                  worker.portfolioUrls.map((url, idx) => {
                    const isPdf = url.toLowerCase().endsWith('.pdf');
                    const isImage = url.toLowerCase().match(/\.(jpeg|jpg|gif|png|webp)$/) != null;

                    return (
                      <div key={idx} className="flex flex-col gap-3 p-4 rounded-xl border border-border/50 bg-accent/10">
                        <div className="font-semibold text-sm flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <IconLink size={16} className="text-muted-foreground" />
                            Lampiran Portofolio {idx + 1}
                          </span>
                          <a href={url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">Buka Penuh</a>
                        </div>

                        <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border/50 bg-muted/30 flex items-center justify-center">
                          {isPdf ? (
                            <iframe src={`${url}#toolbar=0`} className="w-full h-full" title={`Portfolio ${idx + 1}`} />
                          ) : isImage ? (
                            <img src={url} alt={`Portfolio ${idx + 1}`} className="w-full h-full object-cover" />
                          ) : (
                            <div className="text-sm text-muted-foreground p-4 text-center">Format file tidak dapat dipratinjau.<br /><br /><a href={url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Unduh File</a></div>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-2 text-sm text-muted-foreground p-8 text-center border rounded-xl border-dashed">
                    Worker belum menambahkan portofolio.
                  </div>
                )}
              </div>
            </Card>
          </AnimatedCard>

          <AnimatedCard>
            <Card className="border-border/50">
              <div className="p-6 border-b border-border/50">
                <h2 className="font-semibold text-lg">Ulasan Client ({worker.reviews})</h2>
              </div>
              <div className="divide-y divide-border/50">
                {worker.recentReviews.length > 0 ? (
                  worker.recentReviews.map((review, idx) => (
                    <div key={idx} className="p-6">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <UserAvatar name={review.client} size="sm" />
                          <span className="font-semibold text-sm">{review.client}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{review.date}</span>
                      </div>
                      <div className="flex items-center gap-0.5 text-amber-400 mb-3">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <IconStarFilled key={i} size={12} className={i < review.rating ? "text-amber-400" : "text-muted/30"} />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        "{review.comment}"
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-muted-foreground text-sm">
                    Belum ada ulasan untuk worker ini.
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-border/50 text-center">
                <button className="text-sm font-semibold text-primary hover:underline">Lihat Semua Ulasan</button>
              </div>
            </Card>
          </AnimatedCard>
        </div>
      </div>
    </PageTransition>
  );
}
