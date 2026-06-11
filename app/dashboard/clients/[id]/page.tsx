import Link from "next/link";
import { notFound } from "next/navigation";
import {
  IconArrowLeft,
  IconMapPin,
  IconShieldCheck,
  IconCalendarEvent,
  IconChecks,
  IconListDetails,
} from "@tabler/icons-react";
import { Card, CardContent } from "@/components/ui/card";
import { UserAvatar } from "@/components/user-avatar";
import { PageTransition, AnimatedCard } from "@/components/motion";
import { getClientById } from "@/lib/services/clients";
import { formatRupiah } from "@/lib/utils";

export default async function ClientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = await getClientById(id);

  if (!client) {
    notFound();
  }

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
        {/* Left Sidebar (Profile Info & Action) */}
        <div className="space-y-6">
          <AnimatedCard>
            <Card className="border-border/50 relative overflow-hidden">
              <div className="h-24 bg-gradient-to-r from-emerald-600 to-teal-600 absolute top-0 left-0 right-0 z-0" />
              <CardContent className="p-6 pt-12 relative z-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold border-4 border-card shadow-xl overflow-hidden mb-4">
                  {client.image ? (
                    <img src={client.image} alt={client.name} className="w-full h-full object-cover" />
                  ) : (
                    client.name.substring(0, 2).toUpperCase()
                  )}
                </div>
                
                <h1 className="text-xl font-bold tracking-tight flex items-center gap-1.5">
                  {client.name}
                  {client.verified && <IconShieldCheck size={20} className="text-emerald-400" />}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">Client</p>
                
                <div className="flex items-center justify-center gap-4 mt-4 text-xs font-medium">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <IconMapPin size={14} />
                    {client.location}
                  </span>
                </div>
              </CardContent>
            </Card>
          </AnimatedCard>

          <AnimatedCard>
            <Card className="border-border/50">
              <CardContent className="p-6 space-y-4 text-sm">
                <h3 className="font-semibold text-base mb-2">Statistik Client</h3>
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <IconListDetails size={16} /> Tugas Dibuat
                  </span>
                  <span className="font-semibold">{client.totalPostedTasks}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-border/50">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <IconChecks size={16} /> Pesanan Selesai
                  </span>
                  <span className="font-semibold">{client.totalCompletedOrders}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <IconCalendarEvent size={16} /> Bergabung Sejak
                  </span>
                  <span className="font-semibold">{client.joinDate}</span>
                </div>
              </CardContent>
            </Card>
          </AnimatedCard>
        </div>

        {/* Main Content (Recent Tasks) */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatedCard>
            <Card className="border-border/50">
              <div className="p-6 border-b border-border/50">
                <h2 className="font-semibold text-lg">Riwayat Tugas (Selesai)</h2>
              </div>
              <div className="divide-y divide-border/50">
                {client.recentTasks.length > 0 ? (
                  client.recentTasks.map((task) => (
                    <div key={task.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-base mb-1">{task.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">Dikerjakan oleh {task.worker}</p>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-500 font-medium">Selesai</span>
                          <span className="text-muted-foreground">• {task.completedDate}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-emerald-400">{formatRupiah(task.budget)}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-muted-foreground text-sm">
                    Klien ini belum memiliki riwayat tugas yang selesai.
                  </div>
                )}
              </div>
            </Card>
          </AnimatedCard>
        </div>
      </div>
    </PageTransition>
  );
}
