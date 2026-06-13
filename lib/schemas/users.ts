import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  role: z.enum(["ADMIN", "CLIENT", "WORKER"], { error: "Role wajib dipilih" }),
});

export const updateUserSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
  role: z.enum(["ADMIN", "CLIENT", "WORKER"], { error: "Role wajib dipilih" }),
  phone: z.string().optional().or(z.literal("")),
});
