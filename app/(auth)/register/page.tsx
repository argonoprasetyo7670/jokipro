"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import {
  IconBrandGoogle,
  IconMail,
  IconLock,
  IconUser,
  IconBriefcase,
  IconCode,
  IconCheck,
  IconEye,
  IconEyeOff,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { IconInput } from "@/components/icon-input";
import { PageTransition, MotionDiv, fadeInUp } from "@/components/motion";
import { loginWithGoogleAction, registerAction, registerSchema } from "@/lib/actions/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

type Role = "CLIENT" | "WORKER";

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema as any),
    defaultValues: { name: "", email: "", password: "", role: undefined },
  });

  const selectedRole = watch("role");

  const onSubmit = (data: z.infer<typeof registerSchema>) => {
    setError(null);
    startTransition(true);
    registerAction(data)
      .then((result) => {
        if (result?.error) {
          setError(result.error);
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        startTransition(false);
      });
  };

  return (
    <PageTransition className="w-full max-w-md space-y-0">
      {/* Mobile logo */}
      <MotionDiv variants={fadeInUp} className="flex items-center gap-2 mb-8 lg:hidden">
        <Image src="/logo.png" alt="JokiPro Logo" width={32} height={32} className="w-8 h-8 rounded-lg object-contain" />
        <span className="text-lg font-bold">
          Joki<span className="text-primary">Pro</span>
        </span>
      </MotionDiv>

      <MotionDiv variants={fadeInUp}>
        <h2 className="text-2xl font-bold tracking-tight">Buat Akun Baru</h2>
        <p className="text-muted-foreground text-sm mt-2">
          Bergabung dengan ribuan pengguna JokiPro.
        </p>
      </MotionDiv>

      {/* Role Selection */}
      <MotionDiv variants={fadeInUp} className="pt-8 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setValue("role", "CLIENT", { shouldValidate: true })}
          className={`relative flex flex-col items-center gap-2 rounded-xl border-2 p-5 transition-all duration-200 ${
            selectedRole === "CLIENT"
              ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
              : "border-border hover:border-primary/30 bg-card"
          }`}
        >
          {selectedRole === "CLIENT" && (
            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
              <IconCheck size={12} className="text-white" />
            </div>
          )}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/10 to-indigo-500/10 flex items-center justify-center">
            <IconBriefcase size={20} className="text-primary" />
          </div>
          <span className="font-semibold text-sm">Client</span>
          <span className="text-[11px] text-muted-foreground text-center leading-tight">
            Saya butuh bantuan mengerjakan tugas
          </span>
        </button>

        <button
          type="button"
          onClick={() => setValue("role", "WORKER", { shouldValidate: true })}
          className={`relative flex flex-col items-center gap-2 rounded-xl border-2 p-5 transition-all duration-200 ${
            selectedRole === "WORKER"
              ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
              : "border-border hover:border-primary/30 bg-card"
          }`}
        >
          {selectedRole === "WORKER" && (
            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
              <IconCheck size={12} className="text-white" />
            </div>
          )}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 flex items-center justify-center">
            <IconCode size={20} className="text-emerald-500" />
          </div>
          <span className="font-semibold text-sm">Worker</span>
          <span className="text-[11px] text-muted-foreground text-center leading-tight">
            Saya ingin mengerjakan tugas & menghasilkan uang
          </span>
        </button>
      </MotionDiv>
      {errors.role && (
        <MotionDiv variants={fadeInUp}>
          <p className="text-xs text-red-500 text-center">{errors.role.message}</p>
        </MotionDiv>
      )}

      {/* Google OAuth */}
      <MotionDiv variants={fadeInUp} className="pt-6">
        <form action={loginWithGoogleAction}>
          <Button type="submit" variant="outline" className="w-full h-12 rounded-xl gap-3 text-sm font-medium">
            <IconBrandGoogle size={20} />
            Daftar dengan Google
          </Button>
        </form>
      </MotionDiv>

      <MotionDiv variants={fadeInUp} className="relative py-6">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-4 text-xs text-muted-foreground">
          atau daftar dengan email
        </span>
      </MotionDiv>

      {/* Form */}
      <MotionDiv variants={fadeInUp}>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="p-3 text-sm bg-red-50 text-red-500 rounded-lg border border-red-200">
              {error}
            </div>
          )}
          <div>
            <Label htmlFor="name">Nama Lengkap</Label>
            <IconInput
              id="name"
              icon={IconUser}
              type="text"
              placeholder="John Doe"
              className={`mt-2 ${errors.name ? "border-red-500" : ""}`}
              {...register("name")}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <IconInput
              id="email"
              icon={IconMail}
              type="email"
              placeholder="nama@email.com"
              className={`mt-2 ${errors.email ? "border-red-500" : ""}`}
              {...register("email")}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <IconInput 
              id="password" 
              icon={IconLock} 
              type={showPassword ? "text" : "password"} 
              placeholder="Min. 8 karakter" 
              className={`mt-2 ${errors.password ? "border-red-500" : ""}`}
              rightIcon={showPassword ? IconEyeOff : IconEye}
              onRightIconClick={() => setShowPassword(!showPassword)}
              {...register("password")}
            />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          <Button
            type="submit"
            disabled={!selectedRole || isPending}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:hover:scale-100"
          >
            {isPending ? "Mendaftar..." : selectedRole ? `Daftar Sebagai ${selectedRole === "CLIENT" ? "Client" : "Worker"}` : "Pilih Role Terlebih Dahulu"}
          </Button>
        </form>
      </MotionDiv>

      <MotionDiv variants={fadeInUp} className="pt-6 space-y-4">
        <p className="text-center text-xs text-muted-foreground leading-relaxed">
          Dengan mendaftar, Anda menyetujui{" "}
          <a href="#" className="text-primary hover:underline">Terms of Service</a> dan{" "}
          <a href="#" className="text-primary hover:underline">Privacy Policy</a> kami.
        </p>
        <p className="text-center text-sm text-muted-foreground">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-primary font-medium hover:underline">Masuk</Link>
        </p>
      </MotionDiv>
    </PageTransition>
  );
}
