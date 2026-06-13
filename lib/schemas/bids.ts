import { z } from "zod";

export const bidSchema = z.object({
  taskId: z.string().min(1, "Task ID is required"),
  amount: z.coerce.number().min(10000, "Harga penawaran minimal Rp 10.000"),
  deadline: z.coerce.date({ required_error: "Deadline wajib diisi" }).refine(
    (date) => date > new Date(),
    "Deadline harus di masa depan"
  ),
  coverLetter: z.string().min(10, "Pesan minimal 10 karakter"),
});
