"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export const onboardingSchema = z.object({
  bio: z.string().min(10, "Bio minimal 10 karakter"),
  skills: z.string().min(2, "Harap masukkan keahlian Anda"),
  university: z.string().min(2, "Universitas/Instansi wajib diisi"),
  major: z.string().min(2, "Jurusan wajib diisi"),
  educationLevel: z.string().min(2, "Tingkat pendidikan wajib diisi"),
  graduationYear: z.coerce.number().min(1950, "Tahun tidak valid").max(2100, "Tahun tidak valid"),
  portfolioUrl: z.string().url("Link portofolio tidak valid").optional().or(z.literal("")),
});

export async function submitWorkerOnboardingAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "Unauthorized" };
  }

  const userId = session.user.id;
  
  // Only WORKER role should do this
  if (session.user.role !== "WORKER") {
    return { error: "Aksi tidak diizinkan." };
  }

  const rawData = {
    bio: formData.get("bio")?.toString() || "",
    skills: formData.get("skills")?.toString() || "",
    university: formData.get("university")?.toString() || "",
    major: formData.get("major")?.toString() || "",
    educationLevel: formData.get("educationLevel")?.toString() || "",
    graduationYear: formData.get("graduationYear")?.toString() || "",
    portfolioUrl: formData.get("portfolioUrl")?.toString() || "",
  };

  const parsed = onboardingSchema.safeParse(rawData);

  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const data = parsed.data;
  
  // Convert comma-separated string to array
  const skillsArray = data.skills.split(",").map((s) => s.trim()).filter(Boolean);

  // Handle File Uploads
  const cvFile = formData.get("cvFile") as File | null;
  const portfolioFiles = formData.getAll("portfolioFiles") as File[];
  
  let cvUrl = null;
  const uploadedPortfolioFiles: string[] = [];

  try {
    const { uploadFileToMinio } = await import("@/lib/s3");

    // Upload CV
    if (cvFile && cvFile.size > 0) {
      if (cvFile.size > 5 * 1024 * 1024) return { error: "Ukuran CV maksimal 5MB" };
      cvUrl = await uploadFileToMinio(cvFile, "cvs");
    } else {
      return { error: "CV wajib diunggah" };
    }

    // Upload Portfolio Files
    for (const pf of portfolioFiles) {
      if (pf && pf.size > 0) {
        if (pf.size > 10 * 1024 * 1024) return { error: "Ukuran file portofolio maksimal 10MB per file" };
        const url = await uploadFileToMinio(pf, "portfolios");
        uploadedPortfolioFiles.push(url);
      }
    }
  } catch (err: any) {
    console.error("Upload error:", err);
    return { error: "Gagal mengunggah file. Silakan coba lagi." };
  }

  try {
    await prisma.workerProfile.upsert({
      where: { userId },
      update: {
        bio: data.bio,
        skills: skillsArray,
        university: data.university,
        major: data.major,
        educationLevel: data.educationLevel,
        graduationYear: data.graduationYear,
        portfolioUrl: data.portfolioUrl || null,
        cvUrl: cvUrl,
        portfolioFiles: uploadedPortfolioFiles,
        kycStatus: "PENDING", // Ensure it stays pending for admin review
      },
      create: {
        userId,
        bio: data.bio,
        skills: skillsArray,
        university: data.university,
        major: data.major,
        educationLevel: data.educationLevel,
        graduationYear: data.graduationYear,
        portfolioUrl: data.portfolioUrl || null,
        cvUrl: cvUrl,
        portfolioFiles: uploadedPortfolioFiles,
        kycStatus: "PENDING",
      },
    });

    return { success: true };
  } catch (error: any) {
    console.error("Onboarding error:", error);
    return { error: "Terjadi kesalahan pada sistem. Silakan coba lagi." };
  }
}
