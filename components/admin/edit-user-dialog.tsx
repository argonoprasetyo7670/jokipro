"use client";

import { useState, useTransition, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateUserAction } from "@/lib/actions/admin";
import { toast } from "sonner";
import { IconPencil, IconLoader2, IconAlertTriangle } from "@tabler/icons-react";

interface EditUserDialogProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    role: string;
    phone: string | null;
  };
}

export function EditUserDialog({ user }: EditUserDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email,
    role: user.role as "ADMIN" | "CLIENT" | "WORKER",
    phone: user.phone || "",
  });

  const roleChanged = formData.role !== user.role;

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: user.name || "",
        email: user.email,
        role: user.role as "ADMIN" | "CLIENT" | "WORKER",
        phone: user.phone || "",
      });
    }
  }, [isOpen, user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      try {
        const result = await updateUserAction(user.id, {
          name: formData.name,
          email: formData.email,
          role: formData.role,
          phone: formData.phone || undefined,
        });

        if (result && "error" in result) {
          toast.error(result.error);
          return;
        }

        toast.success("Data pengguna berhasil diperbarui!");
        setIsOpen(false);
      } catch (error: any) {
        toast.error(error.message || "Gagal memperbarui pengguna");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted/50"
        >
          <IconPencil size={15} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Edit Pengguna</DialogTitle>
          <DialogDescription>
            Perbarui data untuk{" "}
            <span className="font-medium text-foreground">
              {user.name || user.email}
            </span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          <div className="space-y-2">
            <Label htmlFor={`edit-name-${user.id}`}>Nama Lengkap</Label>
            <Input
              id={`edit-name-${user.id}`}
              placeholder="Masukkan nama lengkap"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              minLength={2}
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`edit-email-${user.id}`}>Email</Label>
            <Input
              id={`edit-email-${user.id}`}
              type="email"
              placeholder="email@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`edit-role-${user.id}`}>Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  role: value as "ADMIN" | "CLIENT" | "WORKER",
                })
              }
            >
              <SelectTrigger id={`edit-role-${user.id}`} className="h-10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-violet-500" />
                    Admin
                  </span>
                </SelectItem>
                <SelectItem value="CLIENT">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    Client
                  </span>
                </SelectItem>
                <SelectItem value="WORKER">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Worker
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>

            {roleChanged && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-400 text-xs animate-in slide-in-from-top-1">
                <IconAlertTriangle size={14} className="mt-0.5 shrink-0" />
                <span>
                  Mengubah role akan menghapus profil{" "}
                  <strong>{user.role === "CLIENT" ? "Client" : user.role === "WORKER" ? "Worker" : "Admin"}</strong>{" "}
                  lama dan membuat profil{" "}
                  <strong>{formData.role === "CLIENT" ? "Client" : formData.role === "WORKER" ? "Worker" : "Admin"}</strong>{" "}
                  baru.
                </span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor={`edit-phone-${user.id}`}>
              No. Telepon{" "}
              <span className="text-muted-foreground font-normal">
                (opsional)
              </span>
            </Label>
            <Input
              id={`edit-phone-${user.id}`}
              type="tel"
              placeholder="08xxxxxxxxxx"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="h-10"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              className="flex-1"
              onClick={() => setIsOpen(false)}
              disabled={isPending}
            >
              Batal
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <IconLoader2 size={16} className="mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Perubahan"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
