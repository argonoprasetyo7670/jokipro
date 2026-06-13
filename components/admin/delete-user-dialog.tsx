"use client";

import { useState, useTransition } from "react";
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
import { Button } from "@/components/ui/button";
import { deleteUserAction } from "@/lib/actions/admin";
import { toast } from "sonner";
import { IconTrash, IconLoader2, IconAlertTriangle } from "@tabler/icons-react";

interface DeleteUserDialogProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    role: string;
  };
}

export function DeleteUserDialog({ user }: DeleteUserDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    startTransition(async () => {
      try {
        const result = await deleteUserAction(user.id);

        if (result && "error" in result) {
          toast.error(result.error);
          return;
        }

        toast.success(`Pengguna "${user.name || user.email}" berhasil dihapus.`);
        setIsOpen(false);
      } catch (error: any) {
        toast.error(error.message || "Gagal menghapus pengguna");
      }
    });
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
        >
          <IconTrash size={15} />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-950/50 flex items-center justify-center">
              <IconAlertTriangle size={20} className="text-red-600" />
            </div>
            Hapus Pengguna?
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-3">
            <span className="block">
              Anda akan menghapus akun pengguna berikut:
            </span>
            <span className="block p-3 rounded-xl bg-muted/50 border">
              <span className="block font-medium text-foreground">
                {user.name || "Tanpa Nama"}
              </span>
              <span className="block text-xs mt-0.5">{user.email}</span>
              <span className="inline-flex mt-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-muted text-muted-foreground">
                {user.role}
              </span>
            </span>
            <span className="block text-red-600 dark:text-red-400 text-xs font-medium">
              ⚠️ Tindakan ini tidak dapat dibatalkan. Semua data terkait
              (profil, pesanan, pesan, dll.) akan ikut terhapus.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Batal</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isPending ? (
              <>
                <IconLoader2 size={16} className="mr-2 animate-spin" />
                Menghapus...
              </>
            ) : (
              "Ya, Hapus Pengguna"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
