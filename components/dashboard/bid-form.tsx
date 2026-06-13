"use client";

import { useState, useTransition } from "react";
import { IconSend, IconLoader2, IconCalendar } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { createBidAction } from "@/lib/actions/bids";
import { toast } from "sonner";
import { validateFileSize } from "@/lib/validate-file";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { bidSchema } from "@/lib/schemas/bids";
import * as z from "zod";

interface BidFormProps {
  taskId: string;
}

export function BidForm({ taskId }: BidFormProps) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    control,
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

    // Ensure deadline is submitted as ISO string
    if (data.deadline) {
      formData.set("deadline", new Date(data.deadline).toISOString());
    }

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

          {/* Deadline — Calendar + Time Picker */}
          <div>
            <Label className="text-xs flex items-center gap-1">
              <IconCalendar size={14} />
              Deadline Pengerjaan
            </Label>
            <Controller
              name="deadline"
              control={control}
              render={({ field }) => {
                const selectedDate = field.value ? new Date(field.value) : undefined;
                const hours = selectedDate ? selectedDate.getHours().toString().padStart(2, "0") : "23";
                const minutes = selectedDate ? selectedDate.getMinutes().toString().padStart(2, "0") : "59";

                const updateTime = (h: string, m: string) => {
                  if (!selectedDate) return;
                  const newDate = new Date(selectedDate);
                  newDate.setHours(parseInt(h), parseInt(m), 0, 0);
                  field.onChange(newDate);
                };

                return (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          "w-full mt-1.5 rounded-xl h-10 justify-start text-left font-normal bg-background text-sm",
                          !field.value && "text-muted-foreground",
                          errors.deadline && "border-red-500"
                        )}
                        disabled={isPending}
                      >
                        <IconCalendar className="mr-2 h-4 w-4 shrink-0" />
                        {field.value
                          ? format(new Date(field.value), "dd MMM yyyy, HH:mm", { locale: localeId })
                          : "Pilih tanggal & waktu"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          if (!date) return;
                          const h = selectedDate ? selectedDate.getHours() : 23;
                          const m = selectedDate ? selectedDate.getMinutes() : 59;
                          date.setHours(h, m, 0, 0);
                          field.onChange(date);
                        }}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      />
                      {/* Time Picker */}
                      <div className="border-t px-3 py-3 flex items-center gap-2">
                        <IconCalendar size={14} className="text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">Jam:</span>
                        <select
                          value={hours}
                          onChange={(e) => updateTime(e.target.value, minutes)}
                          disabled={!selectedDate}
                          className="h-8 rounded-md border bg-background px-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          {Array.from({ length: 24 }, (_, i) => (
                            <option key={i} value={i.toString().padStart(2, "0")}>
                              {i.toString().padStart(2, "0")}
                            </option>
                          ))}
                        </select>
                        <span className="text-sm font-bold text-muted-foreground">:</span>
                        <select
                          value={minutes}
                          onChange={(e) => updateTime(hours, e.target.value)}
                          disabled={!selectedDate}
                          className="h-8 rounded-md border bg-background px-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          {Array.from({ length: 12 }, (_, i) => (
                            <option key={i * 5} value={(i * 5).toString().padStart(2, "0")}>
                              {(i * 5).toString().padStart(2, "0")}
                            </option>
                          ))}
                        </select>
                        <span className="text-[10px] text-muted-foreground ml-1">WIB</span>
                      </div>
                    </PopoverContent>
                  </Popover>
                );
              }}
            />
            {/* Hidden input for form submission */}
            <input type="hidden" name="deadline" value={
              // We need the Controller value to be serialized for FormData
              ""
            } />
            <p className="text-[10px] text-muted-foreground mt-1">Pilih tanggal dan jam kapan Anda bisa menyelesaikan tugas ini.</p>
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
