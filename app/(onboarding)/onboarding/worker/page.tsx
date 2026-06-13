"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  IconSchool,
  IconBriefcase,
  IconCertificate,
  IconCalendarEvent,
  IconLink,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IconInput } from "@/components/icon-input";
import { Input } from "@/components/ui/input";
import { PageTransition, MotionDiv, fadeInUp } from "@/components/motion";
import { submitWorkerOnboardingAction } from "@/lib/actions/onboarding";
import { onboardingSchema } from "@/lib/schemas/onboarding";
import { toast } from "sonner";
import { validateFileSize } from "@/lib/validate-file";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

export default function WorkerOnboardingPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof onboardingSchema>>({
    resolver: zodResolver(onboardingSchema as any),
    defaultValues: {
      bio: "",
      skills: "",
      university: "",
      major: "",
      educationLevel: "",
      portfolioUrl: "",
    },
  });

  const onSubmit = (data: z.infer<typeof onboardingSchema>, e?: React.BaseSyntheticEvent) => {
    if (!e) return;
    const formData = new FormData(e.target);

    // Client-side file size validation
    const cvFile = formData.get("cvFile") as File | null;
    const portfolioFiles = formData.getAll("portfolioFiles") as File[];
    const allFiles = [cvFile, ...portfolioFiles].filter((f): f is File => f !== null && f.size > 0);
    const fileError = validateFileSize(allFiles);
    if (fileError) {
      toast.error(fileError);
      return;
    }

    startTransition(async () => {
      try {
        const res = await submitWorkerOnboardingAction(formData);
        if (res?.error) {
          toast.error(res.error);
          return;
        }
        toast.success("Profil berhasil dilengkapi! Selamat datang.");
        router.push("/dashboard");
      } catch (err: any) {
        toast.error(err.message || "Gagal menyimpan data.");
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4 sm:p-8">
      <PageTransition className="w-full max-w-2xl bg-card rounded-3xl shadow-xl border border-border/50 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 relative p-8 flex items-end">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Ccircle%20cx%3D%221%22%20cy%3D%221%22%20r%3D%221%22%20fill%3D%22rgba(255%2C255%2C255%2C0.05)%22%2F%3E%3C%2Fsvg%3E')] bg-repeat" />
          <div className="relative z-10 flex items-center gap-4 text-white">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20">
              <Image src="/logo.png" alt="Edutasky Logo" width={40} height={40} className="object-contain drop-shadow-md brightness-0 invert" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Lengkapi Profil Worker</h1>
              <p className="text-emerald-50 text-sm">Satu langkah lagi untuk mulai menerima tugas.</p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            <MotionDiv variants={fadeInUp} className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-foreground/80 border-b pb-2">
                <IconBriefcase size={20} className="text-emerald-500" />
                Informasi Profesional
              </h2>

              <div>
                <Label htmlFor="bio">Bio Singkat (Wajib)</Label>
                <Textarea
                  id="bio"
                  rows={3}
                  className={`mt-2 rounded-xl resize-none ${errors.bio ? "border-red-500" : ""}`}
                  placeholder="Ceritakan pengalaman, keahlian utama, dan mengapa klien harus memilih Anda..."
                  {...register("bio")}
                />
                {errors.bio && <p className="text-xs text-red-500 mt-1">{errors.bio.message}</p>}
              </div>

              <div>
                <Label htmlFor="skills">Keahlian / Skills (Wajib)</Label>
                <IconInput
                  id="skills"
                  icon={IconCertificate}
                  placeholder="Contoh: React, Desain Grafis, Penulisan Artikel (pisahkan dengan koma)"
                  className={errors.skills ? "border-red-500 mt-2" : "mt-2"}
                  {...register("skills")}
                />
                <p className="text-xs text-muted-foreground mt-1.5 ml-1">Gunakan koma (,) untuk memisahkan setiap keahlian.</p>
                {errors.skills && <p className="text-xs text-red-500 mt-1">{errors.skills.message}</p>}
              </div>
            </MotionDiv>

            <MotionDiv variants={fadeInUp} className="space-y-4 pt-4">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-foreground/80 border-b pb-2">
                <IconSchool size={20} className="text-indigo-500" />
                Latar Belakang Pendidikan
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="university">Instansi / Universitas (Wajib)</Label>
                  <IconInput id="university" icon={IconSchool} placeholder="Contoh: Universitas Indonesia" className={errors.university ? "border-red-500 mt-2" : "mt-2"} {...register("university")} />
                  {errors.university && <p className="text-xs text-red-500 mt-1">{errors.university.message}</p>}
                </div>
                <div>
                  <Label htmlFor="major">Jurusan / Program Studi (Wajib)</Label>
                  <IconInput id="major" icon={IconBriefcase} placeholder="Contoh: Teknik Informatika" className={errors.major ? "border-red-500 mt-2" : "mt-2"} {...register("major")} />
                  {errors.major && <p className="text-xs text-red-500 mt-1">{errors.major.message}</p>}
                </div>
                <div>
                  <Label htmlFor="educationLevel">Tingkat Pendidikan (Wajib)</Label>
                  <IconInput id="educationLevel" icon={IconCertificate} placeholder="Contoh: S1" className={errors.educationLevel ? "border-red-500 mt-2" : "mt-2"} {...register("educationLevel")} />
                  {errors.educationLevel && <p className="text-xs text-red-500 mt-1">{errors.educationLevel.message}</p>}
                </div>
                <div>
                  <Label htmlFor="graduationYear">Tahun Lulus (Wajib)</Label>
                  <IconInput id="graduationYear" type="number" icon={IconCalendarEvent} placeholder="Contoh: 2024" className={errors.graduationYear ? "border-red-500 mt-2" : "mt-2"} {...register("graduationYear")} />
                  {errors.graduationYear && <p className="text-xs text-red-500 mt-1">{errors.graduationYear.message}</p>}
                </div>
              </div>
            </MotionDiv>

            <MotionDiv variants={fadeInUp} className="space-y-4 pt-4">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-foreground/80 border-b pb-2">
                <IconLink size={20} className="text-amber-500" />
                Portofolio & Dokumen
              </h2>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cvFile">Upload CV (PDF, Max 5MB)</Label>
                  <Input id="cvFile" name="cvFile" type="file" accept=".pdf" className="mt-2 h-12 pt-3" required />
                  <p className="text-xs text-muted-foreground mt-1.5 ml-1">CV wajib diunggah untuk verifikasi admin.</p>
                </div>
                <div>
                  <Label htmlFor="portfolioFiles">Upload Portofolio Tambahan</Label>
                  <Input id="portfolioFiles" name="portfolioFiles" type="file" multiple accept=".pdf,.png,.jpg,.jpeg" className="mt-2 h-12 pt-3" />
                  <p className="text-xs text-muted-foreground mt-1.5 ml-1">Bisa lebih dari 1 file (Opsional).</p>
                </div>
              </div>

              <div>
                <Label htmlFor="portfolioUrl">Link Portofolio / GitHub (Opsional)</Label>
                <IconInput id="portfolioUrl" type="url" icon={IconLink} placeholder="https://github.com/username atau behance.net/..." className={errors.portfolioUrl ? "border-red-500 mt-2" : "mt-2"} {...register("portfolioUrl")} />
                <p className="text-xs text-muted-foreground mt-1.5 ml-1">Klien lebih percaya kepada worker yang memiliki portofolio yang dapat dilihat.</p>
                {errors.portfolioUrl && <p className="text-xs text-red-500 mt-1">{errors.portfolioUrl.message}</p>}
              </div>
            </MotionDiv>

            <div className="pt-6">
              <Button
                type="submit"
                disabled={isPending}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-500/25 transition-all disabled:opacity-50"
              >
                {isPending ? "Menyimpan Data..." : "Selesai & Masuk Dashboard"}
              </Button>
            </div>
          </form>
        </div>
      </PageTransition>
    </div>
  );
}
