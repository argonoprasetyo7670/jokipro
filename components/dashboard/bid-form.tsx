"use client";

import { useRef, useTransition } from "react";
import { IconSend, IconLoader2 } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createBidAction } from "@/lib/actions/bids";
import { toast } from "sonner";

interface BidFormProps {
  taskId: string;
}

export function BidForm({ taskId }: BidFormProps) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.append("taskId", taskId);

    startTransition(async () => {
      try {
        await createBidAction(formData);
        toast.success("Penawaran berhasil dikirim!");
        if (formRef.current) {
          formRef.current.reset();
        }
      } catch (error: any) {
        toast.error(error.message || "Gagal mengirim penawaran");
      }
    });
  };

  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardContent className="p-4 sm:p-6 space-y-4">
        <div>
          <h3 className="font-semibold text-sm">Ajukan Penawaran</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Tertarik mengerjakan tugas ini? Ajukan penawaran Anda.
          </p>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
          <div>
            <Label className="text-xs" htmlFor="amount">Harga Penawaran (Rp)</Label>
            <Input 
              id="amount"
              name="amount"
              type="number" 
              placeholder="200000" 
              required
              min="10000"
              disabled={isPending}
              className="mt-1.5 rounded-xl h-10 bg-background" 
            />
          </div>

          <div>
            <Label className="text-xs" htmlFor="estimatedDays">Estimasi Pengerjaan (Hari)</Label>
            <Input 
              id="estimatedDays"
              name="estimatedDays"
              type="number" 
              placeholder="2" 
              required
              min="1"
              disabled={isPending}
              className="mt-1.5 rounded-xl h-10 bg-background" 
            />
          </div>

          <div>
            <Label className="text-xs" htmlFor="coverLetter">Pesan / Cover Letter</Label>
            <Textarea 
              id="coverLetter"
              name="coverLetter"
              rows={3} 
              placeholder="Jelaskan kenapa Anda cocok untuk tugas ini..." 
              required
              minLength={10}
              disabled={isPending}
              className="mt-1.5 rounded-xl bg-background resize-none" 
            />
          </div>

          <div>
            <Label className="text-xs" htmlFor="attachment">Lampiran Pendukung (Opsional)</Label>
            <p className="text-[10px] text-muted-foreground mb-1.5">Unggah CV, portofolio, atau referensi (PDF/Gambar, maks 5MB).</p>
            <Input 
              id="attachment"
              name="attachment"
              type="file" 
              accept="image/*,.pdf"
              disabled={isPending}
              className="rounded-xl h-10 bg-background file:bg-primary/10 file:text-primary file:border-0 file:rounded-md file:px-3 file:py-1 file:mr-3 file:text-xs file:font-medium hover:file:bg-primary/20 transition-colors cursor-pointer" 
            />
          </div>

          <Button 
            type="submit"
            disabled={isPending}
            className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-500/25 gap-2"
          >
            {isPending ? (
              <IconLoader2 size={16} className="animate-spin" />
            ) : (
              <IconSend size={16} />
            )}
            {isPending ? "Mengirim..." : "Kirim Penawaran"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
