"use client";

import { useState, useTransition } from "react";
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
import { createUserAction } from "@/lib/actions/admin";
import { toast } from "sonner";
import { IconPlus, IconLoader2 } from "@tabler/icons-react";

export function CreateUserDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "" as "ADMIN" | "CLIENT" | "WORKER" | "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.role) {
      toast.error("Role wajib dipilih");
      return;
    }

    startTransition(async () => {
      try {
        const result = await createUserAction({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role as "ADMIN" | "CLIENT" | "WORKER",
        });

        if (result && "error" in result) {
          toast.error(result.error);
          return;
        }

        toast.success("Pengguna berhasil ditambahkan!");
        setIsOpen(false);
        setFormData({ name: "", email: "", password: "", role: "" });
      } catch (error: any) {
        toast.error(error.message || "Gagal menambahkan pengguna");
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="h-9 rounded-xl gap-2 bg-brand-gradient hover:from-violet-700 hover:to-indigo-700 text-white shadow-md shadow-primary/20 transition-all duration-200">
          <IconPlus size={16} />
          Tambah Pengguna
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Tambah Pengguna Baru</DialogTitle>
          <DialogDescription>
            Buat akun pengguna baru untuk platform Edutasky.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          <div className="space-y-2">
            <Label htmlFor="create-name">Nama Lengkap</Label>
            <Input
              id="create-name"
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
            <Label htmlFor="create-email">Email</Label>
            <Input
              id="create-email"
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
            <Label htmlFor="create-password">Password</Label>
            <Input
              id="create-password"
              type="password"
              placeholder="Minimal 8 karakter"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
              minLength={8}
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="create-role">Role</Label>
            <Select
              value={formData.role}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  role: value as "ADMIN" | "CLIENT" | "WORKER",
                })
              }
            >
              <SelectTrigger id="create-role" className="h-10">
                <SelectValue placeholder="Pilih role pengguna" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
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
              className="flex-1 bg-brand-gradient hover:from-violet-700 hover:to-indigo-700 text-white"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <IconLoader2 size={16} className="mr-2 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Tambah Pengguna"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
