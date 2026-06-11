"use client";

import {
  IconUser,
  IconMail,
  IconPhone,
  IconCamera,
  IconShieldCheck,
  IconStarFilled,
  IconBriefcase,
  IconCash,
  IconEdit,
  IconDeviceFloppy,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IconInput } from "@/components/icon-input";
import { PageHeader } from "@/components/page-header";
import { PageTransition, AnimatedCard } from "@/components/motion";

const user = {
  name: "John Doe", email: "johndoe@example.com", phone: "+62 812 3456 7890",
  role: "CLIENT", joinDate: "Januari 2026", rating: 4.9, totalTasks: 15, totalSpent: "Rp 2.4 Jt",
  bio: "Mahasiswa Teknik Informatika semester 6. Sering membutuhkan bantuan untuk tugas-tugas yang bersamaan deadline-nya.",
};

const skills = ["React", "Next.js", "Python", "UI/UX Design", "Technical Writing"];

export default function ProfilePage() {
  return (
    <PageTransition className="max-w-3xl mx-auto space-y-6">
      <AnimatedCard>
        <PageHeader title="Profil Saya" description="Kelola informasi akun dan preferensi Anda." />
      </AnimatedCard>

      {/* Profile Card */}
      <AnimatedCard>
        <Card className="border-border/50 overflow-hidden">
          {/* Banner */}
          <div className="h-28 sm:h-32 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-700 relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Ccircle%20cx%3D%221%22%20cy%3D%221%22%20r%3D%221%22%20fill%3D%22rgba(255%2C255%2C255%2C0.05)%22%2F%3E%3C%2Fsvg%3E')] bg-repeat" />
          </div>

          <CardContent className="px-4 sm:px-6 pb-6">
            {/* Avatar */}
            <div className="relative -mt-12 sm:-mt-14 mb-4 flex items-end gap-4">
              <div className="relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-2xl sm:text-3xl font-bold border-4 border-card shadow-xl">
                  JD
                </div>
                <button className="absolute -bottom-1 -right-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary flex items-center justify-center text-white shadow-lg hover:bg-primary/80 transition-colors">
                  <IconCamera size={14} />
                </button>
              </div>
              <div className="pb-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-bold">{user.name}</h2>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-primary/10 text-primary">
                    {user.role}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Bergabung sejak {user.joinDate}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <div className="rounded-xl bg-accent/50 p-3 sm:p-4 text-center">
                <div className="flex items-center justify-center gap-1 text-base sm:text-lg font-bold">
                  <IconStarFilled size={16} className="text-amber-400" />
                  {user.rating}
                </div>
                <div className="text-[10px] sm:text-xs text-muted-foreground mt-1">Rating</div>
              </div>
              <div className="rounded-xl bg-accent/50 p-3 sm:p-4 text-center">
                <div className="flex items-center justify-center gap-1 text-base sm:text-lg font-bold">
                  <IconBriefcase size={16} className="text-primary" />
                  {user.totalTasks}
                </div>
                <div className="text-[10px] sm:text-xs text-muted-foreground mt-1">Total Tugas</div>
              </div>
              <div className="rounded-xl bg-accent/50 p-3 sm:p-4 text-center">
                <div className="flex items-center justify-center gap-1 text-base sm:text-lg font-bold">
                  <IconCash size={16} className="text-emerald-400" />
                  {user.totalSpent}
                </div>
                <div className="text-[10px] sm:text-xs text-muted-foreground mt-1">Transaksi</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </AnimatedCard>

      {/* Edit Form */}
      <AnimatedCard>
        <Card className="border-border/50">
          <CardContent className="p-4 sm:p-6 space-y-5">
            <h2 className="font-semibold flex items-center gap-2">
              <IconEdit size={20} className="text-primary" />
              Informasi Pribadi
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nama Lengkap</Label>
                <IconInput id="name" icon={IconUser} defaultValue={user.name} className="mt-2" />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <IconInput id="email" icon={IconMail} type="email" defaultValue={user.email} className="mt-2" />
              </div>
              <div>
                <Label htmlFor="phone">No. Telepon</Label>
                <IconInput id="phone" icon={IconPhone} type="tel" defaultValue={user.phone} className="mt-2" />
              </div>
              <div>
                <Label>Verifikasi</Label>
                <div className="flex items-center gap-2 h-12 px-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 mt-2">
                  <IconShieldCheck size={18} className="text-emerald-400" />
                  <span className="text-sm text-emerald-400 font-medium">Email Terverifikasi</span>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" rows={3} defaultValue={user.bio} className="mt-2 rounded-xl resize-none" />
            </div>

            <Button className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-semibold hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-500/25 gap-2">
              <IconDeviceFloppy size={18} />
              Simpan Perubahan
            </Button>
          </CardContent>
        </Card>
      </AnimatedCard>

      {/* Skills */}
      <AnimatedCard>
        <Card className="border-border/50">
          <CardContent className="p-4 sm:p-6 space-y-4">
            <h2 className="font-semibold">Keahlian / Skills</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center text-sm px-3 py-1.5 rounded-xl bg-primary/10 text-primary font-medium"
                >
                  {skill}
                </span>
              ))}
              <Button variant="outline" size="sm" className="rounded-xl border-dashed text-muted-foreground hover:text-primary hover:border-primary">
                + Tambah Skill
              </Button>
            </div>
          </CardContent>
        </Card>
      </AnimatedCard>
    </PageTransition>
  );
}
