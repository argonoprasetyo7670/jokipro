"use client";

import { useState, useTransition } from "react";
import { IconLoader2, IconScale, IconCheck, IconX } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { resolveDisputeAction } from "@/lib/actions/disputes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface DisputeResolutionDialogProps {
  disputeId: string;
  taskTitle: string;
  reporterName: string;
}

export function DisputeResolutionDialog({ disputeId, taskTitle, reporterName }: DisputeResolutionDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [adminNotes, setAdminNotes] = useState("");
  const [resolution, setResolution] = useState<"FAVOR_CLIENT" | "FAVOR_WORKER" | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!resolution) {
      toast.error("Silakan pilih resolusi sengketa");
      return;
    }
    if (adminNotes.length < 5) {
      toast.error("Catatan putusan minimal 5 karakter");
      return;
    }

    const formData = new FormData();
    formData.append("disputeId", disputeId);
    formData.append("resolution", resolution);
    formData.append("adminNotes", adminNotes);

    startTransition(async () => {
      try {
        await resolveDisputeAction(formData);
        toast.success("Sengketa berhasil diselesaikan!");
        setIsOpen(false);
      } catch (error: any) {
        toast.error(error.message || "Gagal menyelesaikan sengketa");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90">
          <IconScale size={16} className="mr-2" />
          Selesaikan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Putusan Sengketa</DialogTitle>
          <DialogDescription>
            Tugas: <strong>{taskTitle}</strong><br />
            Pelapor: <strong>{reporterName}</strong><br /><br />
            Pilih pihak mana yang memenangkan sengketa ini berdasarkan bukti dari ruang chat.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-5">
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              className={`flex-1 h-20 flex-col gap-2 border-2 ${
                resolution === "FAVOR_CLIENT" ? "border-rose-500 bg-rose-500/10 text-rose-700" : "hover:bg-accent"
              }`}
              onClick={() => setResolution("FAVOR_CLIENT")}
            >
              <IconX size={24} className={resolution === "FAVOR_CLIENT" ? "text-rose-500" : "text-muted-foreground"} />
              <div className="flex flex-col items-center">
                <span className="font-semibold">Menangkan Client</span>
                <span className="text-[10px] opacity-80">(Batal & Refund)</span>
              </div>
            </Button>
            <Button
              type="button"
              variant="outline"
              className={`flex-1 h-20 flex-col gap-2 border-2 ${
                resolution === "FAVOR_WORKER" ? "border-emerald-500 bg-emerald-500/10 text-emerald-700" : "hover:bg-accent"
              }`}
              onClick={() => setResolution("FAVOR_WORKER")}
            >
              <IconCheck size={24} className={resolution === "FAVOR_WORKER" ? "text-emerald-500" : "text-muted-foreground"} />
              <div className="flex flex-col items-center">
                <span className="font-semibold">Menangkan Worker</span>
                <span className="text-[10px] opacity-80">(Selesai & Cairkan)</span>
              </div>
            </Button>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Catatan Putusan (Admin Notes)</label>
            <Textarea
              placeholder="Jelaskan alasan putusan ini kepada kedua belah pihak..."
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              disabled={isPending}
              rows={4}
              className="resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setIsOpen(false)} disabled={isPending}>
            Batal
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isPending || !resolution || adminNotes.length < 5}
            className="bg-primary text-primary-foreground hover:bg-primary/90 min-w-[120px]"
          >
            {isPending ? <IconLoader2 className="animate-spin mr-2" size={16} /> : null}
            Kirim Putusan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
