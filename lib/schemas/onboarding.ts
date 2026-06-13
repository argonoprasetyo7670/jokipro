import { z } from "zod";

export const onboardingSchema = z.object({
  bio: z.string().min(10, "Bio minimal 10 karakter"),
  skills: z.string().min(2, "Harap masukkan keahlian Anda"),
  university: z.string().min(2, "Universitas/Instansi wajib diisi"),
  major: z.string().min(2, "Jurusan wajib diisi"),
  educationLevel: z.string().min(2, "Tingkat pendidikan wajib diisi"),
  graduationYear: z.coerce.number().min(1950, "Tahun tidak valid").max(2100, "Tahun tidak valid"),
  portfolioUrl: z.string().url("Link portofolio tidak valid").optional().or(z.literal("")),
});
