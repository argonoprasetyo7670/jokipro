"use client";

import { useState } from "react";
import {
  IconArrowLeft,
  IconArrowRight,
  IconSchool,
  IconFileText,
  IconCode,
  IconCheck,
  IconUpload,
  IconLink,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { IconInput } from "@/components/icon-input";
import { PageTransition, AnimatedCard, MotionDiv, fadeInUp } from "@/components/motion";

const steps = [
  { icon: IconSchool, label: "Pendidikan" },
  { icon: IconFileText, label: "CV & Portfolio" },
  { icon: IconCode, label: "Keahlian" },
  { icon: IconCheck, label: "Review" },
];

const educationLevels = ["SMA/SMK", "D3", "S1", "S2", "S3"];

const skillOptions = [
  "Programming", "Web Development", "Mobile Development", "UI/UX Design",
  "Data Science", "Machine Learning", "Penulisan Akademik", "Penulisan Kreatif",
  "Desain Grafis", "Video Editing", "Microsoft Office", "Data Entry",
  "Matematika", "Fisika", "Kimia", "Biologi", "Ekonomi", "Hukum",
  "Akuntansi", "Manajemen", "Teknik Sipil", "Teknik Elektro",
];

export default function WorkerOnboardingPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    university: "", major: "", educationLevel: "", graduationYear: "",
    bio: "", cvUrl: "", portfolioUrl: "", skills: [] as string[],
  });

  const updateForm = (key: string, value: string | string[]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleSkill = (skill: string) => {
    setForm((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const canProceed = () => {
    if (step === 0) return form.university && form.major && form.educationLevel;
    if (step === 1) return form.bio;
    if (step === 2) return form.skills.length >= 2;
    return true;
  };

  return (
    <PageTransition className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <AnimatedCard>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
          Lengkapi Profil Worker 🎯
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Data Anda akan diverifikasi oleh admin sebelum bisa menerima tugas.
        </p>
      </AnimatedCard>

      {/* Stepper */}
      <AnimatedCard>
        <div className="flex items-center justify-between">
          {steps.map((s, i) => {
            const Icon = s.icon;
            const isActive = i === step;
            const isDone = i < step;
            return (
              <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  isDone ? "bg-emerald-500 text-white" :
                  isActive ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" :
                  "bg-accent text-muted-foreground"
                }`}>
                  {isDone ? <IconCheck size={20} /> : <Icon size={20} />}
                </div>
                <span className={`text-[10px] sm:text-xs font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                  {s.label}
                </span>
                {i < steps.length - 1 && (
                  <div className="hidden" />
                )}
              </div>
            );
          })}
        </div>
        {/* Progress bar */}
        <div className="h-1.5 bg-accent rounded-full mt-4 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${((step + 1) / steps.length) * 100}%` }}
          />
        </div>
      </AnimatedCard>

      {/* Step Content */}
      <MotionDiv key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
        {step === 0 && (
          <Card className="border-border/50">
            <CardContent className="p-4 sm:p-6 space-y-5">
              <h2 className="font-semibold flex items-center gap-2">
                <IconSchool size={20} className="text-primary" />
                Riwayat Pendidikan
              </h2>

              <div>
                <Label htmlFor="university">Universitas / Sekolah</Label>
                <Input
                  id="university"
                  value={form.university}
                  onChange={(e) => updateForm("university", e.target.value)}
                  placeholder="Contoh: Universitas Indonesia"
                  className="mt-2 rounded-xl h-12"
                />
              </div>

              <div>
                <Label htmlFor="major">Jurusan / Program Studi</Label>
                <Input
                  id="major"
                  value={form.major}
                  onChange={(e) => updateForm("major", e.target.value)}
                  placeholder="Contoh: Teknik Informatika"
                  className="mt-2 rounded-xl h-12"
                />
              </div>

              <div>
                <Label>Jenjang Pendidikan</Label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mt-2">
                  {educationLevels.map((level) => (
                    <Button
                      key={level}
                      type="button"
                      variant={form.educationLevel === level ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateForm("educationLevel", level)}
                      className="rounded-xl text-xs h-10"
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="graduationYear">Tahun Lulus (kosongkan jika masih kuliah)</Label>
                <Input
                  id="graduationYear"
                  type="number"
                  value={form.graduationYear}
                  onChange={(e) => updateForm("graduationYear", e.target.value)}
                  placeholder="2025"
                  className="mt-2 rounded-xl h-12"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {step === 1 && (
          <Card className="border-border/50">
            <CardContent className="p-4 sm:p-6 space-y-5">
              <h2 className="font-semibold flex items-center gap-2">
                <IconFileText size={20} className="text-primary" />
                CV & Portfolio
              </h2>

              <div>
                <Label htmlFor="bio">Bio / Deskripsi Diri</Label>
                <Textarea
                  id="bio"
                  rows={4}
                  value={form.bio}
                  onChange={(e) => updateForm("bio", e.target.value)}
                  placeholder="Ceritakan tentang diri Anda, pengalaman, dan kenapa Anda cocok menjadi worker di JokiPro..."
                  className="mt-2 rounded-xl resize-none"
                />
              </div>

              <div>
                <Label>Upload CV (PDF)</Label>
                <div className="border-2 border-dashed border-border rounded-xl p-6 text-center hover:border-primary/30 transition-colors cursor-pointer mt-2">
                  <IconUpload size={28} className="mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm font-medium">Klik untuk upload CV</p>
                  <p className="text-xs text-muted-foreground mt-1">PDF, maks. 5MB</p>
                </div>
              </div>

              <div>
                <Label htmlFor="portfolioUrl">Link Portfolio (opsional)</Label>
                <IconInput
                  id="portfolioUrl"
                  icon={IconLink}
                  value={form.portfolioUrl}
                  onChange={(e) => updateForm("portfolioUrl", e.target.value)}
                  placeholder="https://portfolio.com/username"
                  className="mt-2"
                />
                <p className="text-[11px] text-muted-foreground mt-1.5">
                  GitHub, Behance, Dribbble, Google Drive, atau website pribadi
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card className="border-border/50">
            <CardContent className="p-4 sm:p-6 space-y-5">
              <h2 className="font-semibold flex items-center gap-2">
                <IconCode size={20} className="text-primary" />
                Pilih Keahlian
              </h2>
              <p className="text-xs text-muted-foreground">
                Pilih minimal 2 keahlian yang Anda kuasai. Ini akan membantu client menemukan Anda.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {skillOptions.map((skill) => {
                  const selected = form.skills.includes(skill);
                  return (
                    <Button
                      key={skill}
                      type="button"
                      variant={selected ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleSkill(skill)}
                      className={`rounded-xl text-xs h-10 justify-start ${selected ? "shadow-md" : ""}`}
                    >
                      {selected && <IconCheck size={14} className="mr-1" />}
                      {skill}
                    </Button>
                  );
                })}
              </div>

              <p className="text-xs text-muted-foreground">
                {form.skills.length} keahlian dipilih {form.skills.length < 2 && "(minimal 2)"}
              </p>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card className="border-border/50">
            <CardContent className="p-4 sm:p-6 space-y-5">
              <h2 className="font-semibold flex items-center gap-2">
                <IconCheck size={20} className="text-emerald-500" />
                Review Data Anda
              </h2>

              <div className="space-y-4">
                <div className="rounded-xl bg-accent/50 p-4 space-y-2">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pendidikan</h3>
                  <p className="text-sm font-medium">{form.university}</p>
                  <p className="text-xs text-muted-foreground">{form.major} · {form.educationLevel} {form.graduationYear && `· Lulus ${form.graduationYear}`}</p>
                </div>

                <div className="rounded-xl bg-accent/50 p-4 space-y-2">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Bio</h3>
                  <p className="text-sm text-muted-foreground">{form.bio || "-"}</p>
                </div>

                <div className="rounded-xl bg-accent/50 p-4 space-y-2">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Portfolio</h3>
                  <p className="text-sm text-primary">{form.portfolioUrl || "Tidak ada"}</p>
                </div>

                <div className="rounded-xl bg-accent/50 p-4 space-y-2">
                  <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Keahlian ({form.skills.length})</h3>
                  <div className="flex flex-wrap gap-2">
                    {form.skills.map((skill) => (
                      <span key={skill} className="text-xs px-2.5 py-1 rounded-lg bg-primary/10 text-primary font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </MotionDiv>

      {/* Navigation */}
      <AnimatedCard className="flex items-center justify-between pt-2">
        <Button
          variant="outline"
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 0}
          className="rounded-xl gap-2"
        >
          <IconArrowLeft size={16} />
          Kembali
        </Button>

        {step < steps.length - 1 ? (
          <Button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canProceed()}
            className="rounded-xl gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-500 hover:to-indigo-500 shadow-lg shadow-violet-500/25"
          >
            Lanjut
            <IconArrowRight size={16} />
          </Button>
        ) : (
          <Button
            className="rounded-xl gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:from-emerald-400 hover:to-teal-400 shadow-lg shadow-emerald-500/25"
          >
            <IconCheck size={16} />
            Submit untuk Verifikasi
          </Button>
        )}
      </AnimatedCard>
    </PageTransition>
  );
}
