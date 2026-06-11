"use client";

import { useState, useTransition } from "react";
import {
  IconCheck,
  IconX,
  IconEye,
  IconClock,
  IconShieldCheck,
  IconAlertTriangle,
  IconSchool,
  IconCode,
  IconFileText,
  IconLink,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { UserAvatar } from "@/components/user-avatar";
import { approveWorker, rejectWorker } from "@/lib/actions/worker";
import { useRouter } from "next/navigation";

interface Worker {
  id: string;
  userId: string;
  bio: string | null;
  skills: string[];
  kycStatus: string;
  university: string | null;
  major: string | null;
  educationLevel: string | null;
  graduationYear: number | null;
  cvUrl: string | null;
  portfolioUrl: string | null;
  rejectionNote: string | null;
  createdAt: string;
  user: { name: string | null; email: string; image: string | null; createdAt: string };
}

const statusConfig: Record<string, { label: string; icon: React.ElementType; className: string }> = {
  PENDING: { label: "Menunggu", icon: IconClock, className: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  APPROVED: { label: "Verified", icon: IconShieldCheck, className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  REJECTED: { label: "Ditolak", icon: IconAlertTriangle, className: "bg-rose-500/10 text-rose-400 border-rose-500/20" },
};

const tabs = ["Semua", "Pending", "Verified", "Ditolak"];

export function WorkerTable({ workers }: { workers: Worker[] }) {
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [activeTab, setActiveTab] = useState("Semua");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const filteredWorkers = workers.filter((w) => {
    if (activeTab === "Pending") return w.kycStatus === "PENDING";
    if (activeTab === "Verified") return w.kycStatus === "APPROVED";
    if (activeTab === "Ditolak") return w.kycStatus === "REJECTED";
    return true;
  });

  const handleApprove = (profileId: string) => {
    startTransition(async () => {
      await approveWorker(profileId);
      setSelectedWorker(null);
      router.refresh();
    });
  };

  const handleReject = (profileId: string) => {
    if (!rejectReason.trim()) return;
    startTransition(async () => {
      await rejectWorker(profileId, rejectReason);
      setSelectedWorker(null);
      setShowRejectForm(false);
      setRejectReason("");
      router.refresh();
    });
  };

  return (
    <>
      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <Button
            key={tab}
            variant={activeTab === tab ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 rounded-full ${activeTab === tab ? "shadow-lg shadow-primary/25" : ""}`}
          >
            {tab}
            {tab === "Pending" && workers.filter((w) => w.kycStatus === "PENDING").length > 0 && (
              <span className="ml-1.5 w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center">
                {workers.filter((w) => w.kycStatus === "PENDING").length}
              </span>
            )}
          </Button>
        ))}
      </div>

      {/* Worker List */}
      <div className="space-y-3">
        {filteredWorkers.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="p-8 text-center text-muted-foreground text-sm">
              Tidak ada worker untuk ditampilkan.
            </CardContent>
          </Card>
        ) : (
          filteredWorkers.map((worker) => {
            const config = statusConfig[worker.kycStatus] || statusConfig.PENDING;
            const StatusIcon = config.icon;
            return (
              <Card key={worker.id} className="border-border/50 hover:border-primary/20 transition-all">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center gap-4">
                    <UserAvatar name={worker.user.name || "?"} size="md" />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-sm">{worker.user.name || "Tanpa Nama"}</span>
                        <Badge variant="outline" className={`text-[10px] gap-1 ${config.className}`}>
                          <StatusIcon size={12} />
                          {config.label}
                        </Badge>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {worker.user.email}
                        {worker.university && ` · ${worker.university}`}
                        {worker.major && ` — ${worker.major}`}
                      </div>
                      {worker.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {worker.skills.slice(0, 4).map((s) => (
                            <span key={s} className="text-[10px] px-2 py-0.5 rounded-md bg-accent text-accent-foreground">{s}</span>
                          ))}
                          {worker.skills.length > 4 && (
                            <span className="text-[10px] text-muted-foreground">+{worker.skills.length - 4} lainnya</span>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 rounded-lg"
                        onClick={() => { setSelectedWorker(worker); setShowRejectForm(false); }}
                      >
                        <IconEye size={16} />
                      </Button>
                      {worker.kycStatus === "PENDING" && (
                        <>
                          <Button
                            size="icon"
                            className="h-8 w-8 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white"
                            onClick={() => handleApprove(worker.id)}
                            disabled={isPending}
                          >
                            <IconCheck size={16} />
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 rounded-lg border-rose-500/30 text-rose-400 hover:bg-rose-500/10"
                            onClick={() => { setSelectedWorker(worker); setShowRejectForm(true); }}
                          >
                            <IconX size={16} />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Detail Modal/Drawer */}
      {selectedWorker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedWorker(null)} />
          <Card className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto border-border/50 z-10">
            <CardContent className="p-5 sm:p-6 space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <UserAvatar name={selectedWorker.user.name || "?"} size="lg" />
                  <div>
                    <div className="font-bold">{selectedWorker.user.name}</div>
                    <div className="text-xs text-muted-foreground">{selectedWorker.user.email}</div>
                  </div>
                </div>
                <Button variant="outline" size="icon" className="h-8 w-8 rounded-lg" onClick={() => setSelectedWorker(null)}>
                  <IconX size={16} />
                </Button>
              </div>

              {/* Education */}
              <div className="rounded-xl bg-accent/50 p-4 space-y-1.5">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <IconSchool size={14} /> Pendidikan
                </h3>
                <p className="text-sm font-medium">{selectedWorker.university || "-"}</p>
                <p className="text-xs text-muted-foreground">
                  {selectedWorker.major} · {selectedWorker.educationLevel}
                  {selectedWorker.graduationYear && ` · Lulus ${selectedWorker.graduationYear}`}
                </p>
              </div>

              {/* Bio */}
              <div className="rounded-xl bg-accent/50 p-4 space-y-1.5">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <IconFileText size={14} /> Bio
                </h3>
                <p className="text-sm text-muted-foreground">{selectedWorker.bio || "-"}</p>
              </div>

              {/* Portfolio */}
              <div className="rounded-xl bg-accent/50 p-4 space-y-1.5">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <IconLink size={14} /> Portfolio
                </h3>
                {selectedWorker.portfolioUrl ? (
                  <a href={selectedWorker.portfolioUrl} target="_blank" className="text-sm text-primary hover:underline break-all">
                    {selectedWorker.portfolioUrl}
                  </a>
                ) : (
                  <p className="text-sm text-muted-foreground">Tidak ada</p>
                )}
              </div>

              {/* Skills */}
              <div className="rounded-xl bg-accent/50 p-4 space-y-2">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <IconCode size={14} /> Keahlian
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedWorker.skills.map((s) => (
                    <span key={s} className="text-xs px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-medium">{s}</span>
                  ))}
                </div>
              </div>

              {/* Reject Form */}
              {showRejectForm && (
                <div className="rounded-xl border-2 border-rose-500/20 bg-rose-500/5 p-4 space-y-3">
                  <Label className="text-xs text-rose-400 font-semibold">Alasan Penolakan</Label>
                  <Textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Tuliskan alasan mengapa worker ini ditolak..."
                    rows={3}
                    className="rounded-xl resize-none bg-background"
                  />
                  <Button
                    onClick={() => handleReject(selectedWorker.id)}
                    disabled={!rejectReason.trim() || isPending}
                    className="w-full rounded-xl bg-rose-500 text-white hover:bg-rose-400"
                  >
                    <IconX size={16} className="mr-2" />
                    {isPending ? "Memproses..." : "Tolak Worker"}
                  </Button>
                </div>
              )}

              {/* Actions */}
              {selectedWorker.kycStatus === "PENDING" && !showRejectForm && (
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleApprove(selectedWorker.id)}
                    disabled={isPending}
                    className="flex-1 rounded-xl bg-emerald-500 text-white hover:bg-emerald-400 gap-2"
                  >
                    <IconCheck size={16} />
                    {isPending ? "Memproses..." : "Approve"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowRejectForm(true)}
                    className="flex-1 rounded-xl border-rose-500/30 text-rose-400 hover:bg-rose-500/10 gap-2"
                  >
                    <IconX size={16} />
                    Reject
                  </Button>
                </div>
              )}

              {selectedWorker.kycStatus === "REJECTED" && selectedWorker.rejectionNote && (
                <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
                  <h3 className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-1.5">Alasan Penolakan Sebelumnya</h3>
                  <p className="text-sm text-muted-foreground">{selectedWorker.rejectionNote}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
