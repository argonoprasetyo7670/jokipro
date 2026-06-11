"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

const profileSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  phone: z.string().optional(),
  bio: z.string().optional(),
  skills: z.array(z.string()).optional(),
});

export async function updateProfileAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;
  const role = session.user.role;

  // Extract skills array from FormData since it might be multiple entries
  const skills = formData.getAll("skills").map(String).filter(Boolean);

  const rawData = {
    name: formData.get("name") as string,
    phone: formData.get("phone") as string,
    bio: formData.get("bio") as string,
    skills,
  };

  const parsed = profileSchema.safeParse(rawData);

  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  const { name, phone, bio, skills: parsedSkills } = parsed.data;

  // Update User Base Data
  await prisma.user.update({
    where: { id: userId },
    data: { name, phone },
  });

  // If WORKER, update WorkerProfile
  if (role === "WORKER") {
    await prisma.workerProfile.upsert({
      where: { userId },
      update: { bio, skills: parsedSkills },
      create: {
        userId,
        bio,
        skills: parsedSkills || [],
      },
    });
  }

  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard");
}

export async function updateAvatarAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;
  const file = formData.get("file") as File;

  if (!file || file.size === 0) {
    throw new Error("Pilih gambar terlebih dahulu");
  }

  // Validate file type
  if (!file.type.startsWith("image/")) {
    throw new Error("Hanya file gambar yang diperbolehkan");
  }

  // Use the S3 helper to upload (we'll need to import it)
  // Let's lazy load the import or add it at the top
  const { uploadFileToMinio } = await import("@/lib/s3");
  
  const imageUrl = await uploadFileToMinio(file, "avatars");

  // Update user database
  await prisma.user.update({
    where: { id: userId },
    data: { image: imageUrl },
  });

  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard");
  return { success: true, imageUrl };
}
