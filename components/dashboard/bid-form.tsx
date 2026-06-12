"use client";

import { useRef, useTransition } from "react";
import { IconSend, IconLoader2 } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createBidAction, bidSchema } from "@/lib/actions/bids";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface BidFormProps {
  taskId: string;
}

export function BidForm({ taskId }: BidFormProps) {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

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
      estimatedDays: "" as unknown as number,
      coverLetter: "",
    },
  });

  const onSubmit = (data: z.infer<typeof bidSchema>, e?: React.BaseSyntheticEvent) => {
    if (!e) return;
    const formData = new FormData(e.target);

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
            <Label className="text-xs" htmlFor="estimatedDays">Estimasi Pengerjaan (Hari)</Label>
            <Input 
              id="estimatedDays"
              type="number" 
              placeholder="2" 
              disabled={isPending}
              className={`mt-1.5 rounded-xl h-10 bg-background ${errors.estimatedDays ? "border-red-500" : ""}`} 
              {...register("estimatedDays")}
            />
            {errors.estimatedDays && <p className="text-xs text-red-500 mt-1">{errors.estimatedDays.message}</p>}
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
