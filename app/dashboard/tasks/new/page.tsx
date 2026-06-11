"use client";

import { useState, useTransition } from "react";
import { IconUpload, IconCalendar, IconCash, IconCategory, IconFileText, IconArrowLeft, IconLoader2 } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { IconInput } from "@/components/icon-input";
import { PageTransition, AnimatedCard } from "@/components/motion";
import { createTaskAction } from "@/lib/actions/tasks";
import { taskSchema } from "@/lib/schemas/tasks";

const categories = [
  "Programming", "Penulisan / Makalah", "Desain Grafis", "Tugas Kuliah",
  "Skripsi / Thesis", "Presentasi", "Data Entry", "Lainnya",
];

export default function NewTaskPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<z.infer<typeof taskSchema>>({
    // @ts-ignore: Zod v4 vs Hookform resolver type mismatch
    resolver: zodResolver(taskSchema) as any,
    defaultValues: {
      title: "",
      description: "",
      category: "",
      budget: "" as any,
      deadline: "" as any,
    },
  });

  const onSubmit = (data: z.infer<typeof taskSchema>) => {
    setErrorMsg("");
    startTransition(async () => {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("budget", data.budget.toString());
      formData.append("deadline", data.deadline.toISOString());
      if (file) {
        formData.append("file", file);
      }

      const result = await createTaskAction(formData);

      if (result?.error) {
        setErrorMsg(result.error);
      } else if (result?.success) {
        router.push("/dashboard");
      }
    });
  };

  return (
    <PageTransition className="max-w-2xl mx-auto space-y-6">
      {/* Back */}
      <AnimatedCard>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <IconArrowLeft size={16} />
          Kembali ke Dashboard
        </Link>
      </AnimatedCard>

      <AnimatedCard>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Buat Tugas Baru</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Isi detail tugas Anda, dan worker profesional akan segera mengajukan penawaran.
        </p>
        {errorMsg && (
          <div className="mt-4 p-3 bg-destructive/15 text-destructive rounded-xl text-sm font-medium">
            {errorMsg}
          </div>
        )}
      </AnimatedCard>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Detail */}
        <AnimatedCard>
          <Card className="border-border/50">
            <CardContent className="p-4 sm:p-6 space-y-5">
              <h2 className="font-semibold flex items-center gap-2">
                <IconFileText size={20} className="text-primary" />
                Detail Tugas
              </h2>

              <div>
                <Label htmlFor="title">Judul Tugas</Label>
                <Input
                  id="title"
                  {...register("title")}
                  placeholder="Contoh: Tugas Algoritma & Pemrograman — Implementasi BFS"
                  className={`mt-2 rounded-xl h-12 bg-background ${errors.title ? "border-destructive" : ""}`}
                />
                {errors.title && <p className="text-xs text-destructive mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <Label htmlFor="description">Deskripsi & Instruksi</Label>
                <Textarea
                  id="description"
                  {...register("description")}
                  rows={6}
                  placeholder="Jelaskan tugas secara detail: apa yang harus dikerjakan, format yang diharapkan, referensi, dll."
                  className={`mt-2 rounded-xl bg-background resize-none ${errors.description ? "border-destructive" : ""}`}
                />
                {errors.description && <p className="text-xs text-destructive mt-1">{errors.description.message}</p>}
              </div>

              <div>
                <Label className="flex items-center gap-1 mb-2">
                  <IconCategory size={16} />
                  Kategori
                </Label>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {categories.map((cat) => (
                          <Button
                            key={cat}
                            type="button"
                            variant={field.value === cat ? "default" : "outline"}
                            size="sm"
                            onClick={() => field.onChange(cat)}
                            className={`rounded-xl text-xs h-10 ${errors.category && !field.value ? "border-destructive" : ""}`}
                          >
                            {cat}
                          </Button>
                        ))}
                      </div>
                      {errors.category && <p className="text-xs text-destructive mt-1">{errors.category.message}</p>}
                    </div>
                  )}
                />
              </div>
            </CardContent>
          </Card>
        </AnimatedCard>

        {/* Budget & Deadline */}
        <AnimatedCard>
          <Card className="border-border/50">
            <CardContent className="p-4 sm:p-6 space-y-5">
              <h2 className="font-semibold flex items-center gap-2">
                <IconCash size={20} className="text-emerald-500" />
                Budget & Deadline
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budget">Budget (Rp)</Label>
                  <div className="relative mt-2">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">Rp</span>
                    <Input
                      id="budget"
                      type="number"
                      {...register("budget")}
                      placeholder="150000"
                      className={`pl-10 rounded-xl h-12 bg-background ${errors.budget ? "border-destructive" : ""}`}
                    />
                  </div>
                  {errors.budget ? (
                    <p className="text-xs text-destructive mt-1">{errors.budget.message}</p>
                  ) : (
                    <p className="text-[11px] text-muted-foreground mt-1.5">
                      Worker bisa menawar lebih tinggi atau rendah dari budget ini.
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Controller
                    name="deadline"
                    control={control}
                    render={({ field }) => (
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "mt-2 rounded-xl h-12 justify-start text-left font-normal bg-background",
                              !field.value && "text-muted-foreground",
                              errors.deadline && "border-destructive"
                            )}
                          >
                            <IconCalendar className="mr-2 h-4 w-4" />
                            {field.value ? format(new Date(field.value), "PPP", { locale: id }) : <span>Pilih tanggal</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                          />
                        </PopoverContent>
                      </Popover>
                    )}
                  />
                  {errors.deadline && <p className="text-xs text-destructive mt-1">{errors.deadline.message}</p>}
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimatedCard>

        {/* File upload */}
        <AnimatedCard>
          <Card className="border-border/50">
            <CardContent className="p-4 sm:p-6 space-y-4">
              <h2 className="font-semibold flex items-center gap-2">
                <IconUpload size={20} className="text-amber-500" />
                Lampiran File (CDN)
              </h2>

              <Label 
                htmlFor="file-upload"
                className="block border-2 border-dashed border-border rounded-xl p-6 sm:p-8 text-center hover:border-primary/30 transition-colors cursor-pointer"
              >
                <input 
                  id="file-upload" 
                  type="file" 
                  className="hidden" 
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <IconUpload size={32} className="mx-auto text-muted-foreground mb-3" />
                <p className="text-sm font-medium">
                  {file ? file.name : "Klik untuk upload atau drag & drop"}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  File akan diunggah ke cdn.jennabot.pro
                </p>
              </Label>
            </CardContent>
          </Card>
        </AnimatedCard>

        {/* Submit */}
        <AnimatedCard className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2">
          <p className="text-xs text-muted-foreground">
            Tugas akan terbit dan notifikasi akan dikirim.
          </p>
          <Button
            type="submit"
            disabled={isPending}
            className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold px-8 h-12 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all disabled:opacity-70"
          >
            {isPending ? (
              <>
                <IconLoader2 className="mr-2 h-5 w-5 animate-spin" />
                Memproses...
              </>
            ) : (
              "Publikasikan Tugas"
            )}
          </Button>
        </AnimatedCard>
      </form>
    </PageTransition>
  );
}
