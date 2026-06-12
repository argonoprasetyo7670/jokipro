"use client";

import { useState, useTransition } from "react";
import { IconAlertTriangle, IconLoader2, IconScale } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { createDisputeAction } from "@/lib/actions/disputes";
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

interface DisputeModalProps {
  taskId: string;
  disabled?: boolean;
}

export function DisputeModal({ taskId, disabled }: DisputeModalProps) {
  const [isPending, startTransition] = useTransition();
  const [reason, setReason] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    if (reason.length < 10) {
      toast.error("Alasan sengketa minimal 10 karakter");
      return;
    }

    const formData = new FormData();
    formData.append("taskId", taskId);
    formData.append("reason", reason);

    startTransition(async () => {
      try {
        await createDisputeAction(formData);
        toast.success("Sengketa berhasil diajukan! Menunggu peninjauan Admin.");
        setIsOpen(false);
      } catch (error: any) {
        toast.error(error.message || "Gagal mengajukan sengketa");
      }
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-full mt-4 h-10 border-rose-500/30 text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
          disabled={disabled}
        >
          <IconAlertTriangle size={16} className="mr-2" />
          Ajukan Sengketa
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-rose-600">
            <IconScale size={20} />
            Pengajuan Sengketa (Dispute)
          </AlertDialogTitle>
          <AlertDialogDescription>
            Apakah Anda mengalami masalah dengan pesanan ini? Jelaskan alasan Anda mengajukan sengketa secara detail. Tim Admin kami akan meninjau percakapan dan mengambil keputusan final.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="py-4 space-y-3">
          <Textarea
            placeholder="Jelaskan masalahnya di sini..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            disabled={isPending}
            rows={4}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground">
            Sengketa akan menghentikan sementara proses pembayaran hingga masalah diselesaikan.
          </p>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleSubmit} 
            disabled={isPending || reason.length < 10}
            className="bg-rose-600 hover:bg-rose-700 text-white"
          >
            {isPending ? <IconLoader2 className="animate-spin mr-2" size={16} /> : null}
            Kirim Laporan
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
