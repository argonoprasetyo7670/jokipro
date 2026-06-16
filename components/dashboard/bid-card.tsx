"use client";

import { useState } from "react";
import { UserAvatar } from "@/components/user-avatar";
import { Button } from "@/components/ui/button";
import { IconStarFilled, IconPaperclip, IconCheck } from "@tabler/icons-react";
import { acceptBidAction } from "@/lib/actions/bids";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { formatDateWIB, formatTimeWIB, formatDateLongWIB } from "@/lib/utils";

interface BidCardProps {
  bid: {
    id: string;
    workerId: string;
    workerName: string;
    workerImage: string | null;
    workerRating: number;
    workerCompleted: number;
    amount: number;
    deadline: string | Date;
    estimatedDays: number;
    coverLetter: string;
    attachment: string | null;
    status: string;
  };
  userRole: string;
  taskStatus: string;
}

export function BidCard({ bid, userRole, taskStatus }: BidCardProps) {
  const [isAccepting, setIsAccepting] = useState(false);

  const formattedAmount = new Intl.NumberFormat("id-ID", { 
    style: "currency", 
    currency: "IDR" 
  }).format(bid.amount);

  const handleAcceptBid = async () => {
    setIsAccepting(true);
    try {
      await acceptBidAction(bid.id);
      toast.success("Worker berhasil dipilih!");
    } catch (error: any) {
      toast.error(error.message || "Gagal menyetujui penawaran");
    } finally {
      setIsAccepting(false);
    }
  };

  return (
    <div className={`p-4 sm:p-6 transition-colors ${bid.status === "ACCEPTED" ? "bg-emerald-500/5" : "hover:bg-accent/30"}`}>
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Worker Info */}
        <div className="flex items-center gap-4 sm:w-1/3 shrink-0">
          <Link href={`/dashboard/workers/${bid.workerId}`} className="shrink-0">
            <UserAvatar name={bid.workerName} size="lg" className="hover:ring-2 hover:ring-primary transition-all" />
          </Link>
          <div className="min-w-0">
            <Link href={`/dashboard/workers/${bid.workerId}`} className="hover:underline">
              <h4 className="font-semibold text-sm truncate">{bid.workerName}</h4>
            </Link>
            <div className="flex items-center gap-3 mt-1">
              <span className="flex items-center text-xs text-muted-foreground">
                <IconStarFilled size={12} className="text-amber-400 mr-1" />
                {bid.workerRating.toFixed(1)}
              </span>
              <span className="text-xs text-muted-foreground">{bid.workerCompleted} tugas</span>
            </div>
            {bid.status === "ACCEPTED" && (
              <Badge className="mt-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 shadow-none border-0 text-[10px] h-5">
                <IconCheck size={12} className="mr-1" /> Terpilih
              </Badge>
            )}
            {bid.status === "REJECTED" && (
              <Badge variant="outline" className="mt-2 text-muted-foreground text-[10px] h-5">
                Ditolak
              </Badge>
            )}
          </div>
        </div>

        {/* Bid Details (Truncated) */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {bid.coverLetter}
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-3">
            <span className="text-sm font-bold text-primary">{formattedAmount}</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              Deadline: {formatDateWIB(bid.deadline)}, {formatTimeWIB(bid.deadline)} WIB
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 shrink-0 sm:items-end justify-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="w-full sm:w-auto text-xs">
                Lihat Detail
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Detail Penawaran</DialogTitle>
                <DialogDescription>
                  Surat lamaran lengkap dari {bid.workerName}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                {/* Worker quick profile */}
                <Link
                  href={`/dashboard/workers/${bid.workerId}`}
                  className="flex items-center gap-3 p-3 rounded-xl bg-accent/50 hover:bg-accent transition-colors"
                >
                  <UserAvatar name={bid.workerName} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{bid.workerName}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-0.5">
                        <IconStarFilled size={10} className="text-amber-400" />
                        {bid.workerRating.toFixed(1)}
                      </span>
                      <span>·</span>
                      <span>{bid.workerCompleted} tugas selesai</span>
                    </div>
                  </div>
                  <span className="text-xs text-primary font-medium">Lihat Profil →</span>
                </Link>

                <div className="flex items-center justify-between p-4 bg-accent/50 rounded-xl">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Harga Penawaran</p>
                    <p className="font-bold text-primary text-lg">{formattedAmount}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground mb-1">Deadline Pengerjaan</p>
                    <p className="font-semibold text-sm">{formatDateLongWIB(bid.deadline)}</p>
                    <p className="text-xs text-muted-foreground">{formatTimeWIB(bid.deadline)} WIB</p>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-2">Pesan / Cover Letter</h4>
                  <div className="p-4 bg-background border rounded-xl text-sm leading-relaxed whitespace-pre-wrap max-h-[250px] overflow-y-auto">
                    {bid.coverLetter}
                  </div>
                </div>

                {bid.attachment && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Lampiran Pendukung</h4>
                    <a 
                      href={bid.attachment} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-3 w-full rounded-xl bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors"
                    >
                      <IconPaperclip size={16} />
                      Buka Lampiran Pekerja
                    </a>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          {userRole === "CLIENT" && taskStatus === "OPEN" && bid.status === "PENDING" && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  size="sm"
                  className="w-full sm:w-auto rounded-xl bg-brand-gradient text-white text-xs hover:opacity-90 shadow-lg shadow-primary/25"
                >
                  Pilih Worker
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Konfirmasi Pemilihan Worker</AlertDialogTitle>
                  <AlertDialogDescription>
                    Anda akan memilih <strong>{bid.workerName}</strong> untuk mengerjakan tugas ini dengan kesepakatan harga <strong>{formattedAmount}</strong>.
                    <br/><br/>
                    Setelah memilih, status tugas akan berubah menjadi &quot;Dalam Pengerjaan&quot;, tagihan baru akan dibuat, dan pelamar lainnya akan otomatis ditolak. Lanjutkan?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel disabled={isAccepting}>Batal</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={(e) => {
                      e.preventDefault();
                      handleAcceptBid();
                    }}
                    disabled={isAccepting}
                    className="bg-brand-gradient text-white"
                  >
                    {isAccepting ? "Memproses..." : "Ya, Pilih Worker Ini"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </div>
  );
}
