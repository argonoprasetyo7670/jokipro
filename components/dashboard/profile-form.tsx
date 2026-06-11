"use client";

import { useState, useTransition } from "react";
import {
  IconUser,
  IconMail,
  IconPhone,
  IconShieldCheck,
  IconDeviceFloppy,
  IconX
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IconInput } from "@/components/icon-input";
import { updateProfileAction } from "@/lib/actions/profile";

export function ProfileForm({ user }: { user: any }) {
  const [isPending, startTransition] = useTransition();
  const [skills, setSkills] = useState<string[]>(user.skills || []);
  const [newSkill, setNewSkill] = useState("");
  const isWorker = user.role === "WORKER";

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    // Append all skills to form data
    skills.forEach(skill => formData.append("skills", skill));

    startTransition(async () => {
      try {
        await updateProfileAction(formData);
        alert("Profil berhasil diperbarui!");
      } catch (err: any) {
        alert(err.message || "Gagal memperbarui profil");
      }
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nama Lengkap</Label>
          <IconInput id="name" name="name" icon={IconUser} defaultValue={user.name} className="mt-2" required />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <IconInput id="email" icon={IconMail} type="email" defaultValue={user.email} className="mt-2" disabled />
          <p className="text-[10px] text-muted-foreground mt-1">Email tidak dapat diubah (digunakan untuk login).</p>
        </div>
        <div>
          <Label htmlFor="phone">No. Telepon</Label>
          <IconInput id="phone" name="phone" icon={IconPhone} type="tel" defaultValue={user.phone} className="mt-2" />
        </div>
        <div>
          <Label>Status Verifikasi</Label>
          <div className="flex items-center gap-2 h-[42px] px-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 mt-2">
            <IconShieldCheck size={18} className="text-emerald-400" />
            <span className="text-sm text-emerald-400 font-medium">
              {user.kycStatus === "APPROVED" ? "Terverifikasi (KYC)" : "Akun Aktif"}
            </span>
          </div>
        </div>
      </div>

      {isWorker && (
        <>
          <div>
            <Label htmlFor="bio">Bio / Tentang Saya</Label>
            <Textarea 
              id="bio" 
              name="bio"
              rows={4} 
              defaultValue={user.bio} 
              className="mt-2 rounded-xl resize-none" 
              placeholder="Ceritakan pengalaman dan keahlian Anda..."
            />
          </div>

          <div className="space-y-4 pt-2">
            <Label>Keahlian (Skills)</Label>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 text-sm pl-3 pr-2 py-1.5 rounded-xl bg-primary/10 text-primary font-medium"
                >
                  {skill}
                  <button 
                    type="button" 
                    onClick={() => handleRemoveSkill(skill)}
                    className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                  >
                    <IconX size={14} />
                  </button>
                </span>
              ))}
            </div>
            
            <div className="flex gap-2">
              <input 
                type="text" 
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                className="flex h-10 w-full md:w-64 rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Tambah keahlian baru..."
              />
              <Button type="button" variant="secondary" onClick={handleAddSkill} className="rounded-xl">
                Tambah
              </Button>
            </div>
          </div>
        </>
      )}

      <div className="pt-4 border-t border-border/50">
        <Button 
          type="submit" 
          disabled={isPending}
          className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-500/25 gap-2 w-full sm:w-auto"
        >
          <IconDeviceFloppy size={18} />
          {isPending ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>
    </form>
  );
}
