"use client";

import {
  IconClock,
  IconAlertTriangle,
  IconEdit,
  IconShieldCheck,
} from "@tabler/icons-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageTransition, AnimatedCard, MotionDiv } from "@/components/motion";

// Mock — in production this comes from getWorkerProfile()
const mockStatus: "PENDING" | "REJECTED" = "PENDING";
const mockRejectionNote = "CV Anda belum lengkap. Mohon upload CV dalam format PDF yang mencantumkan pengalaman dan keahlian. Juga pastikan foto KTP/KTM sudah jelas.";

export default function VerificationPendingPage() {
  const status = mockStatus;

  return (
    <PageTransition className="max-w-lg mx-auto space-y-6 py-8 sm:py-16">
      <AnimatedCard className="text-center">
        {status === "PENDING" ? (
          <>
            {/* Animated clock */}
            <MotionDiv
              animate={{ scale: [1, 1.05, 1], rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex"
            >
              <div className="w-20 h-20 rounded-full bg-amber-500/10 border-2 border-amber-500/20 flex items-center justify-center mx-auto">
                <IconClock size={40} className="text-amber-400" />
              </div>
            </MotionDiv>

            <h1 className="text-xl sm:text-2xl font-bold mt-6">
              Menunggu Verifikasi
            </h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto leading-relaxed">
              Data profil Anda sedang direview oleh tim admin EduTasky. Proses verifikasi biasanya memakan waktu <strong>1x24 jam</strong> di hari kerja.
            </p>
          </>
        ) : (
          <>
            <div className="w-20 h-20 rounded-full bg-rose-500/10 border-2 border-rose-500/20 flex items-center justify-center mx-auto">
              <IconAlertTriangle size={40} className="text-rose-400" />
            </div>

            <h1 className="text-xl sm:text-2xl font-bold mt-6">
              Verifikasi Ditolak
            </h1>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto leading-relaxed">
              Maaf, data profil Anda belum memenuhi syarat. Silakan perbaiki dan submit ulang.
            </p>
          </>
        )}
      </AnimatedCard>

      {/* Status Card */}
      <AnimatedCard>
        <Card className={`border-2 ${status === "PENDING" ? "border-amber-500/20" : "border-rose-500/20"}`}>
          <CardContent className="p-4 sm:p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${status === "PENDING" ? "bg-amber-400 animate-pulse" : "bg-rose-400"}`} />
              <span className="font-semibold text-sm">
                Status: {status === "PENDING" ? "Sedang Direview" : "Ditolak"}
              </span>
            </div>

            {status === "REJECTED" && mockRejectionNote && (
              <div className="rounded-xl bg-rose-500/5 border border-rose-500/20 p-4">
                <h3 className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-2">
                  Alasan Penolakan
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {mockRejectionNote}
                </p>
              </div>
            )}

            <div className="rounded-xl bg-accent/50 p-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                Yang sudah Anda submit
              </h3>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <IconShieldCheck size={14} className="text-emerald-400" />
                  Data Pendidikan
                </li>
                <li className="flex items-center gap-2">
                  <IconShieldCheck size={14} className="text-emerald-400" />
                  CV
                </li>
                <li className="flex items-center gap-2">
                  <IconShieldCheck size={14} className="text-emerald-400" />
                  Keahlian (5 skill)
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </AnimatedCard>

      {/* Actions */}
      <AnimatedCard className="flex flex-col gap-3">
        {status === "REJECTED" && (
          <Link href="/dashboard/worker-onboarding">
            <Button className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold h-12 hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-500/25 gap-2">
              <IconEdit size={18} />
              Edit & Submit Ulang
            </Button>
          </Link>
        )}
        <Link href="/dashboard">
          <Button variant="outline" className="w-full rounded-xl h-12">
            Kembali ke Dashboard
          </Button>
        </Link>
      </AnimatedCard>
    </PageTransition>
  );
}
