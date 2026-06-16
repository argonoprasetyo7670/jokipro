"use client";

import { useState } from "react";
import Link from "next/link";
import {
  IconCash,
  IconArrowUpRight,
  IconArrowDownLeft,
  IconClock,
  IconShieldCheck,
  IconCheck,
  IconSearch,
  IconWallet,
  IconReceipt,
  IconArrowRight,
  IconReceiptRefund,
} from "@tabler/icons-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserAvatar } from "@/components/user-avatar";
import { PageHeader } from "@/components/page-header";
import { PageTransition, AnimatedCard } from "@/components/motion";
import { formatRupiah, formatDateWIB, formatDateTimeWIB } from "@/lib/utils";
import type { WalletData, WalletTransaction } from "@/lib/services/wallet";

// Payment status config
const PAYMENT_STATUS: Record<
  string,
  { label: string; color: string; bg: string; icon: React.ReactNode }
> = {
  PENDING_PAYMENT: {
    label: "Menunggu Bayar",
    color: "text-amber-700 dark:text-amber-400",
    bg: "bg-amber-100 dark:bg-amber-950/50",
    icon: <IconClock size={12} />,
  },
  ESCROW_HOLD: {
    label: "Escrow",
    color: "text-blue-700 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-950/50",
    icon: <IconShieldCheck size={12} />,
  },
  RELEASED: {
    label: "Selesai",
    color: "text-emerald-700 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-950/50",
    icon: <IconCheck size={12} />,
  },
  REFUNDED: {
    label: "Refund",
    color: "text-red-700 dark:text-red-400",
    bg: "bg-red-100 dark:bg-red-950/50",
    icon: <IconReceiptRefund size={12} />,
  },
};

export function WalletContent({ data }: { data: WalletData }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const isClient = data.role === "CLIENT";

  const filteredTransactions = data.transactions.filter((tx) => {
    const matchesSearch =
      !search ||
      tx.taskTitle.toLowerCase().includes(search.toLowerCase()) ||
      tx.otherPartyName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || tx.paymentStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <PageTransition className="space-y-6">
      <AnimatedCard>
        <PageHeader
          title={isClient ? "Riwayat Pengeluaran" : "Riwayat Pendapatan"}
          description={
            isClient
              ? "Pantau semua pengeluaran Anda untuk tugas di EduTasky."
              : "Pantau semua pendapatan dari tugas yang Anda kerjakan."
          }
        />
      </AnimatedCard>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <AnimatedCard>
          <Card className="border-border/50 overflow-hidden">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white shrink-0">
                  <IconWallet size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                    {isClient ? "Total Pengeluaran" : "Pendapatan Bersih"}
                  </p>
                  <p className="text-sm sm:text-lg font-bold truncate">
                    {formatRupiah(data.summary.totalNet)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimatedCard>

        <AnimatedCard>
          <Card className="border-border/50 overflow-hidden">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shrink-0">
                  <IconCheck size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                    Transaksi Selesai
                  </p>
                  <p className="text-sm sm:text-lg font-bold">
                    {data.summary.completedCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimatedCard>

        <AnimatedCard>
          <Card className="border-border/50 overflow-hidden">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white shrink-0">
                  <IconShieldCheck size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                    Dalam Escrow
                  </p>
                  <p className="text-sm sm:text-lg font-bold">
                    {data.summary.escrowCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimatedCard>

        <AnimatedCard>
          <Card className="border-border/50 overflow-hidden">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shrink-0">
                  <IconClock size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                    Menunggu Bayar
                  </p>
                  <p className="text-sm sm:text-lg font-bold">
                    {data.summary.pendingCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </AnimatedCard>
      </div>

      {/* Platform Fee Info (Worker only) */}
      {!isClient && data.summary.totalPlatformFee > 0 && (
        <AnimatedCard>
          <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 text-sm">
            <IconReceipt size={18} className="text-blue-500 shrink-0" />
            <div>
              <span className="text-muted-foreground">
                Total biaya platform (5%):{" "}
              </span>
              <span className="font-semibold text-foreground">
                {formatRupiah(data.summary.totalPlatformFee)}
              </span>
              <span className="text-muted-foreground">
                {" "}dari total{" "}
              </span>
              <span className="font-semibold text-foreground">
                {formatRupiah(data.summary.totalAmount)}
              </span>
            </div>
          </div>
        </AnimatedCard>
      )}

      {/* Transaction List */}
      <AnimatedCard>
        <Card className="border-border/50 overflow-hidden">
          {/* Header */}
          <div className="p-5 border-b">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h2 className="font-semibold flex items-center gap-2">
                <IconReceipt size={18} className="text-primary" />
                Riwayat Transaksi
              </h2>
              <div className="flex gap-2">
                <div className="relative flex-1 sm:w-56">
                  <IconSearch
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    id="tx-search"
                    placeholder="Cari tugas..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-8 h-8 text-xs rounded-lg"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger
                    id="tx-status-filter"
                    className="w-[150px] h-8 text-xs rounded-lg"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Semua Status</SelectItem>
                    <SelectItem value="PENDING_PAYMENT">Menunggu Bayar</SelectItem>
                    <SelectItem value="ESCROW_HOLD">Escrow</SelectItem>
                    <SelectItem value="RELEASED">Selesai</SelectItem>
                    <SelectItem value="REFUNDED">Refund</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Transactions */}
          {filteredTransactions.length === 0 ? (
            <div className="p-12 text-center flex flex-col items-center justify-center text-muted-foreground">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <IconReceipt size={24} />
              </div>
              <p className="font-medium text-foreground">
                {search
                  ? "Tidak ada transaksi ditemukan"
                  : "Belum ada transaksi"}
              </p>
              <p className="text-sm mt-1">
                {search
                  ? `Tidak ditemukan hasil untuk "${search}"`
                  : isClient
                  ? "Transaksi akan muncul setelah Anda memilih worker untuk tugas."
                  : "Transaksi akan muncul setelah penawaran Anda diterima."}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {filteredTransactions.map((tx) => (
                <TransactionRow
                  key={tx.id}
                  tx={tx}
                  isClient={isClient}
                />
              ))}
            </div>
          )}

          {/* Footer */}
          {filteredTransactions.length > 0 && (
            <div className="px-5 py-3 border-t bg-muted/20 text-xs text-muted-foreground">
              Menampilkan {filteredTransactions.length} dari{" "}
              {data.transactions.length} transaksi
            </div>
          )}
        </Card>
      </AnimatedCard>
    </PageTransition>
  );
}

function TransactionRow({
  tx,
  isClient,
}: {
  tx: WalletTransaction;
  isClient: boolean;
}) {
  const status = PAYMENT_STATUS[tx.paymentStatus] || PAYMENT_STATUS.PENDING_PAYMENT;

  return (
    <Link
      href={`/dashboard/orders/${tx.orderId}`}
      className="flex items-center gap-3 sm:gap-4 p-4 sm:px-5 hover:bg-accent/30 transition-colors group"
    >
      {/* Icon */}
      <div
        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
          tx.paymentStatus === "RELEASED"
            ? isClient
              ? "bg-red-500/10 text-red-500"
              : "bg-emerald-500/10 text-emerald-500"
            : tx.paymentStatus === "REFUNDED"
            ? "bg-amber-500/10 text-amber-500"
            : "bg-muted text-muted-foreground"
        }`}
      >
        {tx.paymentStatus === "RELEASED" ? (
          isClient ? (
            <IconArrowUpRight size={20} />
          ) : (
            <IconArrowDownLeft size={20} />
          )
        ) : tx.paymentStatus === "REFUNDED" ? (
          <IconReceiptRefund size={20} />
        ) : (
          <IconClock size={20} />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium text-sm truncate group-hover:text-primary transition-colors">
            {tx.taskTitle}
          </span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <UserAvatar
            name={tx.otherPartyName}
            image={tx.otherPartyImage}
            size="xs"
          />
          <span className="text-xs text-muted-foreground truncate">
            {isClient ? "Worker" : "Client"}: {tx.otherPartyName}
          </span>
          <span className="text-xs text-muted-foreground hidden sm:inline">
            · {formatDateWIB(tx.createdAt)}
          </span>
        </div>
      </div>

      {/* Amount & Status */}
      <div className="text-right shrink-0 flex flex-col items-end gap-1.5">
        <span
          className={`text-sm font-bold ${
            tx.paymentStatus === "RELEASED"
              ? isClient
                ? "text-red-500"
                : "text-emerald-500"
              : "text-foreground"
          }`}
        >
          {isClient ? "- " : "+ "}
          {formatRupiah(tx.netAmount)}
        </span>
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${status.bg} ${status.color}`}
        >
          {status.icon}
          {status.label}
        </span>
      </div>

      <IconArrowRight
        size={14}
        className="text-muted-foreground/50 group-hover:text-primary shrink-0 hidden sm:block transition-colors"
      />
    </Link>
  );
}
