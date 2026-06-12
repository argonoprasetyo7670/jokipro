"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { IconMail, IconLock, IconBrandGoogle, IconLoader2, IconEye, IconEyeOff } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { IconInput } from "@/components/icon-input";
import { PageTransition, MotionDiv, fadeInUp } from "@/components/motion";
import { loginAction, loginWithGoogleAction, loginSchema } from "@/lib/actions/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema as any),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (data: z.infer<typeof loginSchema>) => {
    setError(null);
    startTransition(async () => {
      const result = await loginAction(data);
      if (result?.error) {
        setError(result.error);
      }
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
        <h2 className="text-2xl font-bold tracking-tight">Selamat Datang Kembali</h2>
        <p className="text-muted-foreground text-sm mt-2">
          Masuk ke akun JokiPro Anda untuk melanjutkan.
        </p>
      </MotionDiv>

      {/* Google OAuth */}
      <MotionDiv variants={fadeInUp} className="pt-8">
        <form action={loginWithGoogleAction}>
          <Button type="submit" variant="outline" className="w-full h-12 rounded-xl gap-3 text-sm font-medium">
            <IconBrandGoogle size={20} />
            Masuk dengan Google
          </Button>
        </form>
      </MotionDiv>

      <MotionDiv variants={fadeInUp} className="relative py-8">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-4 text-xs text-muted-foreground">
          atau masuk dengan email
        </span>
      </MotionDiv>

      {/* Form */}
      <MotionDiv variants={fadeInUp}>
        <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
          {error && (
            <div className="p-3 text-sm bg-red-50 text-red-500 rounded-lg border border-red-200">
              {error}
            </div>
          )}
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
            <div className="flex items-center justify-between mb-2">
              <Label htmlFor="password">Password</Label>
              <a href="#" className="text-xs text-primary hover:underline">
                Lupa password?
              </a>
            </div>
            <IconInput
              id="password"
              icon={IconLock}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={errors.password ? "border-red-500" : ""}
              rightIcon={showPassword ? IconEyeOff : IconEye}
              onRightIconClick={() => setShowPassword(!showPassword)}
              {...register("password")}
            />
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:pointer-events-none"
          >
            {isPending ? <IconLoader2 className="w-5 h-5 animate-spin" /> : "Masuk"}
          </Button>
        </form>
      </MotionDiv>

      <MotionDiv variants={fadeInUp} className="pt-8">
        <p className="text-center text-sm text-muted-foreground">
          Belum punya akun?{" "}
          <Link href="/register" className="text-primary font-medium hover:underline">
            Daftar Gratis
          </Link>
        </p>
      </MotionDiv>
    </PageTransition>
  );
}
