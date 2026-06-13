"use client";

import { useRef, useTransition } from "react";
import { IconSend, IconLoader2, IconCalendarEvent } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createBidAction } from "@/lib/actions/bids";
import { bidSchema } from "@/lib/schemas/bids";
import { toast } from "sonner";
import { validateFileSize } from "@/lib/validate-file";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface BidFormProps {
  taskId: string;
}

// Get minimum datetime string (now + 1 hour)
function getMinDatetime(): string {
  const now = new Date();
  now.setHours(now.getHours() + 1);
  return now.toISOString().slice(0, 16); // "YYYY-MM-DDTHH:mm"
}

export function BidForm({ taskId }: BidFormProps) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<z.infer<typeof bidSchema>>({
    resolver: zodResolver(bidSchema as any),
    defaultValues: {
      taskId: taskId,
      amount: "" as unknown as number,
      deadline: "" as unknown as Date,
      coverLetter: "",
    },
  });

  const onSubmit = (data: z.infer<typeof bidSchema>, e?: React.BaseSyntheticEvent) => {
    if (!e) return;
    const formData = new FormData(e.target);

    // Client-side file size validation
    const attachment = formData.get("attachment") as File | null;
    if (attachment && attachment.size > 0) {
      const fileError = validateFileSize([attachment]);
      if (fileError) {
        toast.error(fileError);
        return;
      }
    }

    startTransition(async () => {
      try {
        await createBidAction(formData);
        toast.success("Penawaran berhasil dikirim!");
        reset();
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" encType="multipart/form-data">
          <input type="hidden" {...register("taskId")} />
          <div>
            <Label className="text-xs" htmlFor="amount">Harga Penawaran (Rp)</Label>
            <Input 
              id="amount"
              type="number" 
              placeholder="200000" 
              disabled={isPending}
              className={`mt-1.5 rounded-xl h-10 bg-background ${errors.amount ? "border-red-500" : ""}`} 
              {...register("amount")}
            />
            {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount.message}</p>}
          </div>

          <div>
            <Label className="text-xs flex items-center gap-1" htmlFor="deadline">
              <IconCalendarEvent size={14} />
              Deadline Pengerjaan
            </Label>
            <Input 
              id="deadline"
              type="datetime-local" 
              min={getMinDatetime()}
              disabled={isPending}
              className={`mt-1.5 rounded-xl h-10 bg-background ${errors.deadline ? "border-red-500" : ""}`} 
              {...register("deadline")}
            />
            <p className="text-[10px] text-muted-foreground mt-1">Pilih tanggal dan jam deadline Anda bisa menyelesaikan tugas ini.</p>
            {errors.deadline && <p className="text-xs text-red-500 mt-1">{errors.deadline.message}</p>}
          </div>

          <div>
            <Label className="text-xs" htmlFor="coverLetter">Pesan / Cover Letter</Label>
            <Textarea 
              id="coverLetter"
              rows={3} 
              placeholder="Jelaskan kenapa Anda cocok untuk tugas ini..." 
              disabled={isPending}
              className={`mt-1.5 rounded-xl bg-background resize-none ${errors.coverLetter ? "border-red-500" : ""}`} 
              {...register("coverLetter")}
            />
            {errors.coverLetter && <p className="text-xs text-red-500 mt-1">{errors.coverLetter.message}</p>}
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
