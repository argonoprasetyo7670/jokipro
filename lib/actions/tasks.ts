"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { taskSchema } from "@/lib/schemas/tasks";
import { uploadFileToMinio } from "@/lib/s3";

export async function createTaskAction(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Anda harus login untuk membuat tugas" };
    }

    // Validate textual data
    const rawData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      budget: formData.get("budget"),
      deadline: formData.get("deadline") as string,
    };

    const validatedData = taskSchema.parse(rawData);

    // Handle File Upload to MinIO CDN
    let attachmentUrl = null;
    const file = formData.get("file") as File | null;

    if (file && file.size > 0) {
      try {
        console.log(`[MinIO UPLOAD] Uploading file ${file.name}`);
        attachmentUrl = await uploadFileToMinio(file);
      } catch (err) {
        console.error("Gagal mengupload file ke MinIO CDN:", err);
        return { error: "Gagal mengupload file lampiran." };
      }
    }

    // Save to Database
    const task = await prisma.task.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        category: validatedData.category,
        budget: validatedData.budget,
        deadline: validatedData.deadline,
        clientId: session.user.id,
        status: "OPEN",
        attachment: attachmentUrl
      },
    });

    revalidatePath("/dashboard/tasks");
    revalidatePath("/dashboard");

    return { success: true, taskId: task.id };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.issues[0].message };
    }
    console.error("Create task error:", error);
    return { error: "Terjadi kesalahan saat menyimpan tugas" };
  }
}
