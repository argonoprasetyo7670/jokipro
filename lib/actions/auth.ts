"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function loginWithGoogleAction() {
  await signIn("google", { redirectTo: "/dashboard" });
}

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(1, "Password wajib diisi"),
});

export const registerSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  role: z.enum(["CLIENT", "WORKER"], { error: "Role wajib dipilih" }),
});

export async function registerAction(data: z.infer<typeof registerSchema>) {
  try {
    const parsed = registerSchema.safeParse(data);
    if (!parsed.success) {
      return { error: parsed.error.issues[0].message };
    }

    const { name, email, password, role } = parsed.data;
    // Removed manual check since Zod handles it

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "Email sudah terdaftar." };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Create user and profile in a transaction
    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          passwordHash,
          role: role as "CLIENT" | "WORKER",
        },
      });

      if (role === "CLIENT") {
        await tx.clientProfile.create({
          data: { userId: user.id },
        });
      } else if (role === "WORKER") {
        await tx.workerProfile.create({
          data: { userId: user.id },
        });
      }
    });

    // Auto login after registration
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Email atau password salah." };
        default:
          return { error: "Terjadi kesalahan saat login." };
      }
    }
    throw error;
  }
}

export async function loginAction(data: z.infer<typeof loginSchema>) {
  try {
    const parsed = loginSchema.safeParse(data);
    if (!parsed.success) {
      return { error: parsed.error.issues[0].message };
    }

    const { email, password } = parsed.data;
    console.log("Attempting login with:", { email, hasPassword: !!password });
    await signIn("credentials", {
      email,
      password,
      redirectTo: "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Email atau password salah." };
        default:
          return { error: "Terjadi kesalahan saat login." };
      }
    }
    throw error;
  }
}
