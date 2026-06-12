import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { DisputeStatus } from "@prisma/client";
import { IconScale, IconAlertTriangle, IconCheck } from "@tabler/icons-react";
import { PageTransition, AnimatedCard } from "@/components/motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DisputeResolutionDialog } from "@/components/admin/dispute-resolution-dialog";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminDisputesPage() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const openDisputes = await prisma.dispute.findMany({
    where: { status: DisputeStatus.OPEN },
    include: {
      task: {
        include: { order: true },
      },
      reporter: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const resolvedDisputes = await prisma.dispute.findMany({
    where: { status: { in: [DisputeStatus.RESOLVED_CLIENT, DisputeStatus.RESOLVED_WORKER] } },
    include: {
      task: {
        include: { order: true },
      },
      reporter: true,
    },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <PageTransition className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <IconScale className="text-primary" size={28} />
            Pusat Resolusi Sengketa
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Tinjau dan ambil keputusan untuk pesanan yang bermasalah.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <IconAlertTriangle size={20} className="text-rose-500" />
          Sengketa Aktif ({openDisputes.length})
        </h2>

        {openDisputes.length === 0 ? (
          <Card className="border-dashed bg-muted/50">
            <CardContent className="flex flex-col items-center justify-center p-12 text-center">
              <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4 text-emerald-500">
                <IconCheck size={24} />
              </div>
              <h3 className="font-semibold text-lg">Semua Aman!</h3>
              <p className="text-muted-foreground text-sm mt-1">
                Tidak ada sengketa yang perlu diselesaikan saat ini.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {openDisputes.map((dispute, index) => (
              <AnimatedCard key={dispute.id} delay={index * 0.1}>
                <Card className="border-rose-500/20 shadow-sm overflow-hidden">
                  <div className="bg-rose-500/5 px-4 py-3 border-b border-rose-500/10 flex justify-between items-center">
                    <Badge variant="outline" className="bg-rose-500/10 text-rose-600 border-rose-500/20">
                      Sengketa Terbuka
                    </Badge>
                    <span className="text-xs text-muted-foreground font-mono">
                      ID: {dispute.id.slice(-8).toUpperCase()}
                    </span>
                  </div>
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="flex-1 space-y-4">
                        <div>
                          <h3 className="font-semibold text-lg">{dispute.task.title}</h3>
                          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <span>Pelapor: <strong>{dispute.reporter.name}</strong></span>
                            <span>•</span>
                            <span>Peran: {dispute.reporter.role === "CLIENT" ? "Client" : "Worker"}</span>
                          </div>
                        </div>

                        <div className="bg-muted/50 p-4 rounded-xl border space-y-2">
                          <span className="text-xs font-semibold uppercase text-muted-foreground">Alasan Sengketa:</span>
                          <p className="text-sm leading-relaxed">{dispute.reason}</p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-3 md:w-48 justify-end">
                        {dispute.task.order && (
                          <Button variant="outline" className="w-full h-10" asChild>
                            <Link href={`/dashboard/orders/${dispute.task.order.id}`} target="_blank">
                              Lihat Chat Workspace
                            </Link>
                          </Button>
                        )}
                        <DisputeResolutionDialog 
                          disputeId={dispute.id}
                          taskTitle={dispute.task.title}
                          reporterName={dispute.reporter.name || "User"}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedCard>
            ))}
          </div>
        )}

        {resolvedDisputes.length > 0 && (
          <div className="pt-8 space-y-4">
            <h2 className="text-lg font-semibold text-muted-foreground">Riwayat Sengketa (Terbaru)</h2>
            <div className="grid gap-3">
              {resolvedDisputes.map((dispute) => (
                <Card key={dispute.id} className="opacity-75 bg-muted/30">
                  <CardContent className="p-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                    <div>
                      <h4 className="font-medium text-sm">{dispute.task.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{dispute.adminNotes}</p>
                    </div>
                    <Badge variant="secondary" className="shrink-0 bg-emerald-500/10 text-emerald-600">
                      Diselesaikan
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </PageTransition>
  );
}
