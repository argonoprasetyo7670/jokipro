import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(10, "Judul tugas minimal 10 karakter"),
  description: z.string().min(30, "Deskripsi minimal 30 karakter"),
  category: z.string().min(1, "Kategori harus dipilih"),
  budget: z.coerce.number().min(10000, "Budget minimal Rp 10.000"),
  deadline: z.coerce.date().refine((date) => date > new Date(), {
    message: "Deadline harus di masa depan",
  }),
});
