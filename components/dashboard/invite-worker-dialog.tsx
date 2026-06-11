"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { IconSend, IconLoader2 } from "@tabler/icons-react";

interface InviteWorkerDialogProps {
  workerName: string;
  workerId: string;
}

export function InviteWorkerDialog({ workerName, workerId }: InviteWorkerDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsOpen(false);
    }, 1500);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-500/25 mt-6">
          Tawarkan Pekerjaan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tawarkan Pekerjaan</DialogTitle>
          <DialogDescription>
            Kirim undangan pekerjaan privat (private task) secara langsung kepada {workerName}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <Label htmlFor="title" className="text-xs">Judul Pekerjaan</Label>
            <Input id="title" required placeholder="Contoh: Pembuatan Website E-Commerce" className="mt-1.5 rounded-xl h-10" />
          </div>
          <div>
            <Label htmlFor="budget" className="text-xs">Estimasi Budget (Rp)</Label>
            <Input id="budget" type="number" required placeholder="500000" className="mt-1.5 rounded-xl h-10" />
          </div>
          <div>
            <Label htmlFor="deadline" className="text-xs">Deadline / Batas Waktu</Label>
            <Input id="deadline" type="date" required className="mt-1.5 rounded-xl h-10" />
          </div>
          <div>
            <Label htmlFor="description" className="text-xs">Deskripsi Pekerjaan</Label>
            <Textarea id="description" required rows={4} placeholder="Jelaskan detail spesifik pekerjaan yang Anda inginkan..." className="mt-1.5 rounded-xl resize-none" />
          </div>
          <div className="pt-4">
            <Button type="submit" disabled={isLoading} className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold hover:from-violet-500 hover:to-indigo-500 gap-2">
              {isLoading ? <IconLoader2 className="animate-spin" size={16} /> : <IconSend size={16} />}
              Kirim Tawaran
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
