"use client";

import { useState } from "react";
import { IconCreditCard, IconLoader2, IconShieldCheck } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

declare global {
  interface Window {
    snap: {
      pay: (
        token: string,
        options: {
          onSuccess?: (result: any) => void;
          onPending?: (result: any) => void;
          onError?: (result: any) => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}

interface PaymentButtonProps {
  orderId: string;
  amount: number;
}

export function PaymentButton({ orderId, amount }: PaymentButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const formatRupiah = (num: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);

  const loadSnapScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (window.snap) {
        resolve();
        return;
      }

      const script = document.createElement("script");
      const isProduction = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true";
      script.src = isProduction
        ? "https://app.midtrans.com/snap/snap.js"
        : "https://app.sandbox.midtrans.com/snap/snap.js";
      script.setAttribute(
        "data-client-key",
        process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || ""
      );
      script.onload = () => resolve();
      script.onerror = () => reject(new Error("Gagal memuat Midtrans"));
      document.head.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setIsLoading(true);
    try {
      // 1. Load Snap.js
      await loadSnapScript();

      // 2. Get Snap token from our API
      const res = await fetch("/api/midtrans/create-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal membuat token pembayaran");
      }

      // 3. Open Snap popup
      window.snap.pay(data.token, {
        onSuccess: () => {
          toast.success("Pembayaran berhasil! Worker akan segera mulai mengerjakan.");
          // Reload to update status
          window.location.reload();
        },
        onPending: () => {
          toast.info("Pembayaran sedang diproses. Silakan selesaikan pembayaran Anda.");
        },
        onError: (result: any) => {
          console.error("Payment error:", result);
          toast.error("Pembayaran gagal. Silakan coba lagi.");
        },
        onClose: () => {
          toast.info("Popup pembayaran ditutup. Anda dapat mencoba membayar kembali.");
        },
      });
    } catch (error: any) {
      console.error("Payment error:", error);
      toast.error(error.message || "Terjadi kesalahan saat memproses pembayaran");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-2xl bg-card space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white">
          <IconCreditCard size={20} />
        </div>
        <div>
          <h3 className="font-semibold text-sm">Pembayaran Diperlukan</h3>
          <p className="text-xs text-muted-foreground">
            Bayar untuk memulai pengerjaan tugas
          </p>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-muted/50 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Total Pembayaran</span>
          <span className="font-bold text-lg text-foreground">{formatRupiah(amount)}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-emerald-600 dark:text-emerald-400">
          <IconShieldCheck size={12} />
          Dana ditahan aman di escrow hingga tugas selesai
        </div>
      </div>

      <Button
        id="payment-button"
        onClick={handlePayment}
        disabled={isLoading}
        className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-500/25 text-sm font-semibold"
      >
        {isLoading ? (
          <>
            <IconLoader2 className="animate-spin mr-2" size={18} />
            Memproses...
          </>
        ) : (
          <>
            <IconCreditCard size={18} className="mr-2" />
            Bayar Sekarang — {formatRupiah(amount)}
          </>
        )}
      </Button>

      <p className="text-[10px] text-center text-muted-foreground">
        Pembayaran diproses melalui Midtrans (BCA, BRI, Mandiri, GoPay, OVO, dll)
      </p>
    </div>
  );
}
