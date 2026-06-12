"use client";

import { useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import { IconCamera, IconLoader2 } from "@tabler/icons-react";
import { updateAvatarAction } from "@/lib/actions/profile";
import Image from "next/image";

interface ProfileAvatarProps {
  initials: string;
  imageUrl?: string | null;
}

export function ProfileAvatar({ initials, imageUrl }: ProfileAvatarProps) {
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Hanya file gambar yang diperbolehkan");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Ukuran gambar maksimal 2MB");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    startTransition(async () => {
      try {
        await updateAvatarAction(formData);
        toast.success("Foto profil berhasil diperbarui");
      } catch (error: any) {
        toast.error(error.message || "Gagal mengunggah foto profil");
      }
      
      // Reset input so the same file can be selected again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    });
  };

  return (
    <div className="relative">
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold border-4 border-card shadow-xl overflow-hidden relative">
        {imageUrl ? (
          <img src={imageUrl} alt="Avatar" className="w-full h-full object-cover" />
        ) : (
          initials
        )}
        
        {isPending && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
            <IconLoader2 className="animate-spin text-white" size={24} />
          </div>
        )}
      </div>
      
      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={fileInputRef}
        onChange={handleFileChange}
        disabled={isPending}
      />
      
      <button 
        onClick={() => fileInputRef.current?.click()}
        disabled={isPending}
        className="absolute -bottom-1 -right-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary flex items-center justify-center text-white shadow-lg hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <IconCamera size={14} />
      </button>
    </div>
  );
}
