"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { verifyWorkerAction } from "@/lib/actions/admin";
import { toast } from "sonner";
import { IconCheck, IconX, IconExternalLink, IconSchool, IconBriefcase } from "@tabler/icons-react";
import Image from "next/image";

interface WorkerVerificationDialogProps {
  worker: any; // Using any for simplicity here, but could be strongly typed
}

export function WorkerVerificationDialog({ worker }: WorkerVerificationDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [rejectionNote, setRejectionNote] = useState("");
  const [isRejecting, setIsRejecting] = useState(false);

  const handleVerify = (status: "APPROVED" | "REJECTED") => {
    if (status === "REJECTED" && !rejectionNote.trim()) {
      toast.error("Alasan penolakan wajib diisi");
      return;
    }

    startTransition(async () => {
      try {
        await verifyWorkerAction(worker.id, status, status === "REJECTED" ? rejectionNote : undefined);
        toast.success(status === "APPROVED" ? "Worker berhasil disetujui" : "Worker telah ditolak");
        setIsOpen(false);
      } catch (error: any) {
        toast.error(error.message || "Gagal memverifikasi worker");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 rounded-lg text-xs">
          Verifikasi
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Verifikasi Pendaftaran Worker</DialogTitle>
          <DialogDescription>
            Tinjau profil, CV, dan Portofolio dari kandidat ini sebelum memberikan persetujuan.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Header Profil */}
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-muted/50 shrink-0">
              {worker.user.image ? (
                <Image src={worker.user.image} alt={worker.user.name || "User"} width={64} height={64} className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xl font-bold bg-primary/10 text-primary">
                  {worker.user.name?.charAt(0) || "W"}
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-lg">{worker.user.name}</h3>
              <p className="text-sm text-muted-foreground">{worker.user.email}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {worker.skills.map((skill: string) => (
                  <span key={skill} className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Edukasi */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl border bg-muted/20">
            <div>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1"><IconSchool size={14} /> Universitas / Instansi</p>
              <p className="text-sm font-medium">{worker.university || "-"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1"><IconBriefcase size={14} /> Jurusan</p>
              <p className="text-sm font-medium">{worker.major || "-"} ({worker.educationLevel})</p>
            </div>
          </div>

          {/* Bio */}
          <div>
            <h4 className="text-sm font-semibold mb-2">Bio Singkat</h4>
            <p className="text-sm text-muted-foreground bg-muted/30 p-4 rounded-xl leading-relaxed">
              {worker.bio}
            </p>
          </div>

          {/* Dokumen */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Dokumen Pendukung</h4>
            <div className="flex flex-col gap-3">
              {worker.cvUrl && (
                <a 
                  href={worker.cvUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl border hover:bg-muted/30 transition-colors"
                >
                  <span className="text-sm font-medium flex items-center gap-2">
                    <IconCheck size={16} className="text-emerald-500" />
                    CV.pdf
                  </span>
                  <IconExternalLink size={16} className="text-muted-foreground" />
                </a>
              )}

              {worker.portfolioFiles?.length > 0 && worker.portfolioFiles.map((file: string, i: number) => (
                <a 
                  key={i}
                  href={file} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl border hover:bg-muted/30 transition-colors"
                >
                  <span className="text-sm font-medium flex items-center gap-2">
                    <IconCheck size={16} className="text-blue-500" />
                    Portofolio_{i+1}
                  </span>
                  <IconExternalLink size={16} className="text-muted-foreground" />
                </a>
              ))}

              {worker.portfolioUrl && (
                <a 
                  href={worker.portfolioUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl border hover:bg-muted/30 transition-colors"
                >
                  <span className="text-sm font-medium text-primary hover:underline truncate max-w-[300px]">
                    {worker.portfolioUrl}
                  </span>
                  <IconExternalLink size={16} className="text-muted-foreground shrink-0" />
                </a>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t flex flex-col gap-3">
            {!isRejecting ? (
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 h-11"
                  onClick={() => setIsRejecting(true)}
                  disabled={isPending}
                >
                  <IconX size={18} className="mr-2" /> Tolak
                </Button>
                <Button 
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-11"
                  onClick={() => handleVerify("APPROVED")}
                  disabled={isPending}
                >
                  <IconCheck size={18} className="mr-2" /> Setujui Worker
                </Button>
              </div>
            ) : (
              <div className="space-y-3 animate-in slide-in-from-bottom-2">
                <Textarea 
                  placeholder="Alasan mengapa pendaftaran worker ini ditolak..." 
                  value={rejectionNote}
                  onChange={(e) => setRejectionNote(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => setIsRejecting(false)} className="flex-1" disabled={isPending}>
                    Batal
                  </Button>
                  <Button variant="destructive" onClick={() => handleVerify("REJECTED")} className="flex-1" disabled={isPending}>
                    Konfirmasi Penolakan
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
