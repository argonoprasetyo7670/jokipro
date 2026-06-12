"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
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
import { updateProfileAction, profileSchema } from "@/lib/actions/profile";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

export function ProfileForm({ user }: { user: any }) {
  const [isPending, startTransition] = useTransition();
  const [newSkill, setNewSkill] = useState("");
  const isWorker = user.role === "WORKER";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema as any),
    defaultValues: {
      name: user.name || "",
      phone: user.phone || "",
      bio: user.bio || "",
      skills: user.skills || [],
    },
  });

  const skills = watch("skills") || [];

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setValue("skills", [...skills, newSkill.trim()], { shouldValidate: true });
      setNewSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setValue("skills", skills.filter((s) => s !== skillToRemove), { shouldValidate: true });
  };

  const onSubmit = (data: z.infer<typeof profileSchema>, e?: React.BaseSyntheticEvent) => {
    if (!e) return;
    const formData = new FormData(e.target);
    
    // Replace skills in formData
    formData.delete("skills");
    data.skills?.forEach((skill) => formData.append("skills", skill));

    startTransition(async () => {
      try {
        await updateProfileAction(formData);
        toast.success("Profil berhasil diperbarui!");
      } catch (err: any) {
        toast.error(err.message || "Gagal memperbarui profil");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Nama Lengkap</Label>
          <IconInput id="name" icon={IconUser} className={`mt-2 ${errors.name ? "border-red-500" : ""}`} {...register("name")} />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <IconInput id="email" icon={IconMail} type="email" defaultValue={user.email} className="mt-2" disabled />
          <p className="text-[10px] text-muted-foreground mt-1">Email tidak dapat diubah (digunakan untuk login).</p>
        </div>
        <div>
          <Label htmlFor="phone">No. Telepon</Label>
          <IconInput id="phone" icon={IconPhone} type="tel" className={`mt-2 ${errors.phone ? "border-red-500" : ""}`} {...register("phone")} />
          {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
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
              rows={4} 
              className={`mt-2 rounded-xl resize-none ${errors.bio ? "border-red-500" : ""}`} 
              placeholder="Ceritakan pengalaman dan keahlian Anda..."
              {...register("bio")}
            />
            {errors.bio && <p className="text-xs text-red-500 mt-1">{errors.bio.message}</p>}
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
