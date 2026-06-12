"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { IconCheck, IconRefresh, IconSend, IconLoader2, IconAlertTriangle } from "@tabler/icons-react";
import { submitWorkAction, acceptResultAction, requestRevisionAction } from "@/lib/actions/orders";
import { DisputeModal } from "@/components/dashboard/dispute-modal";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface OrderActionsProps {
  orderId: string;
  taskId: string;
  taskStatus: string;
  userRole: string;
}

export function OrderActions({ orderId, taskId, taskStatus, userRole }: OrderActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [revisionNote, setRevisionNote] = useState("");
  const [showRevision, setShowRevision] = useState(false);

  const handleSubmitWork = () => {
    startTransition(async () => {
      try {
        await submitWorkAction(orderId);
        toast.success("Hasil kerja berhasil dikirim untuk direview!");
      } catch (error: any) {
        toast.error(error.message);
      }
    });
  };

  const handleAcceptResult = () => {
    startTransition(async () => {
      try {
        await acceptResultAction(orderId);
        toast.success("Hasil kerja diterima! Tugas selesai.");
      } catch (error: any) {
        toast.error(error.message);
      }
    });
  };

  const handleRequestRevision = () => {
    if (!revisionNote.trim()) {
      toast.error("Catatan revisi wajib diisi");
      return;
    }
    startTransition(async () => {
      try {
        await requestRevisionAction(orderId, revisionNote);
        toast.success("Permintaan revisi terkirim");
        setRevisionNote("");
        setShowRevision(false);
      } catch (error: any) {
        toast.error(error.message);
      }
    });
  };

  // Worker: IN_PROGRESS → can submit work
  if (userRole === "WORKER" && taskStatus === "IN_PROGRESS") {
    return (
      <div className="space-y-4">
        <div className="p-4 border rounded-2xl bg-card space-y-3">
          <h3 className="font-semibold text-sm">Selesaikan Pekerjaan</h3>
          <p className="text-xs text-muted-foreground">
            Pastikan semua file hasil kerja sudah dikirim melalui chat sebelum menandai tugas selesai.
          </p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="w-full h-11 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-500/25" disabled={isPending}>
                <IconSend size={16} className="mr-2" />
                Submit Hasil Kerja
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Konfirmasi Submit Hasil</AlertDialogTitle>
                <AlertDialogDescription>
                  Anda akan mengirimkan hasil kerja untuk direview oleh Client. Pastikan semua file dan dokumen sudah dikirim melalui chat. Lanjutkan?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={(e) => { e.preventDefault(); handleSubmitWork(); }} className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white">
                  {isPending ? <IconLoader2 className="animate-spin mr-2" size={16} /> : null}
                  Ya, Submit Hasil
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        <DisputeModal taskId={taskId} disabled={isPending} />
      </div>
    );
  }

  // Worker: IN_REVIEW → waiting
  if (userRole === "WORKER" && taskStatus === "IN_REVIEW") {
    return (
      <div className="space-y-4">
        <div className="p-4 border rounded-2xl bg-amber-500/5 border-amber-500/20 space-y-2">
          <h3 className="font-semibold text-sm text-amber-600 dark:text-amber-400">Menunggu Review Client</h3>
          <p className="text-xs text-muted-foreground">
            Hasil kerja Anda sedang ditinjau oleh Client. Anda akan mendapat notifikasi jika diterima atau diminta revisi.
          </p>
        </div>
        <DisputeModal taskId={taskId} disabled={isPending} />
      </div>
    );
  }

  // Client: IN_REVIEW → can accept or request revision
  if (userRole === "CLIENT" && taskStatus === "IN_REVIEW") {
    return (
      <div className="space-y-4">
        <div className="p-4 border rounded-2xl bg-card space-y-3">
          <h3 className="font-semibold text-sm">Review Hasil Kerja</h3>
          <p className="text-xs text-muted-foreground">
            Worker telah mengirimkan hasil. Periksa dan pilih tindakan.
          </p>

          {!showRevision ? (
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 h-11 rounded-xl border-amber-200 text-amber-600 hover:bg-amber-50 hover:text-amber-700"
                onClick={() => setShowRevision(true)}
                disabled={isPending}
              >
                <IconRefresh size={16} className="mr-2" /> Minta Revisi
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="flex-1 h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white" disabled={isPending}>
                    <IconCheck size={16} className="mr-2" /> Terima Hasil
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Terima Hasil Kerja?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Setelah diterima, tugas akan ditandai sebagai selesai dan dana akan dicairkan ke Worker. Tindakan ini tidak dapat dibatalkan.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={(e) => { e.preventDefault(); handleAcceptResult(); }} className="bg-emerald-600 text-white hover:bg-emerald-700">
                      {isPending ? <IconLoader2 className="animate-spin mr-2" size={16} /> : null}
                      Ya, Terima & Cairkan Dana
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ) : (
            <div className="space-y-3 animate-in slide-in-from-bottom-2">
              <Textarea
                placeholder="Jelaskan apa yang perlu diperbaiki..."
                value={revisionNote}
                onChange={(e) => setRevisionNote(e.target.value)}
                rows={3}
                className="resize-none rounded-xl"
              />
              <div className="flex gap-2">
                <Button variant="ghost" className="flex-1" onClick={() => setShowRevision(false)} disabled={isPending}>
                  Batal
                </Button>
                <Button variant="destructive" className="flex-1" onClick={handleRequestRevision} disabled={isPending}>
                  {isPending ? <IconLoader2 className="animate-spin mr-2" size={16} /> : null}
                  Kirim Permintaan Revisi
                </Button>
              </div>
            </div>
          )}
        </div>
        <DisputeModal taskId={taskId} disabled={isPending} />
      </div>
    );
  }

  // Client: IN_PROGRESS → waiting
  if (userRole === "CLIENT" && taskStatus === "IN_PROGRESS") {
    return (
      <div className="space-y-4">
        <div className="p-4 border rounded-2xl bg-blue-500/5 border-blue-500/20 space-y-2">
          <h3 className="font-semibold text-sm text-blue-600 dark:text-blue-400">Dalam Pengerjaan</h3>
          <p className="text-xs text-muted-foreground">
            Worker sedang mengerjakan tugas Anda. Gunakan chat untuk berkomunikasi dan mengirim instruksi tambahan.
          </p>
        </div>
        <DisputeModal taskId={taskId} disabled={isPending} />
      </div>
    );
  }

  // IN_DISPUTE
  if (taskStatus === "IN_DISPUTE") {
    return (
      <div className="p-4 border rounded-2xl bg-rose-500/5 border-rose-500/20 space-y-2">
        <h3 className="font-semibold text-sm text-rose-600 dark:text-rose-400 flex items-center gap-2">
          <IconAlertTriangle size={16} /> Pesanan Bersengketa
        </h3>
        <p className="text-xs text-muted-foreground">
          Sengketa telah diajukan untuk pesanan ini. Proses pembayaran dihentikan sementara hingga Admin memberikan putusan final.
        </p>
      </div>
    );
  }

  // COMPLETED
  if (taskStatus === "COMPLETED") {
    return (
      <div className="p-4 border rounded-2xl bg-emerald-500/5 border-emerald-500/20 space-y-2">
        <h3 className="font-semibold text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
          <IconCheck size={16} /> Tugas Selesai
        </h3>
        <p className="text-xs text-muted-foreground">
          Tugas ini telah diselesaikan dan dana telah dicairkan ke Worker.
        </p>
      </div>
    );
  }

  return null;
}
