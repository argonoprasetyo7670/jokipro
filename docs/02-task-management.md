# 📝 Fitur 02: Task Management

## Deskripsi

Fitur manajemen tugas memungkinkan **Client** untuk membuat tugas baru, dan **Worker** untuk melihat daftar tugas yang tersedia. Admin dapat melihat dan mengelola seluruh tugas.

## File Terkait

| File | Fungsi |
|------|--------|
| `lib/actions/tasks.ts` | Server Action: `createTaskAction` |
| `lib/schemas/tasks.ts` | Zod validation schema untuk tugas |
| `app/dashboard/tasks/` | Halaman browse & detail tugas |
| `app/dashboard/my-tasks/` | Halaman tugas milik Client |
| `components/dashboard/task-filters.tsx` | Filter & search tugas |
| `components/task-card.tsx` | Komponen kartu tugas |

## Database Model

```prisma
model Task {
  id          String     @id @default(cuid())
  clientId    String
  client      User       @relation("ClientTasks", ...)
  title       String
  category    String
  description String     @db.Text
  attachment  String?    // URL file lampiran di MinIO
  deadline    DateTime
  budget      Float      // Budget ekspektasi dari Client
  status      TaskStatus @default(OPEN)
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt
  bids        Bid[]
  order       Order?
  messages    Message[]
  dispute     Dispute?
  reviews     Review[]
}
```

## Task Status Flow

```
OPEN → IN_PROGRESS → IN_REVIEW → COMPLETED
                                → CANCELLED
                  → IN_DISPUTE  → COMPLETED / CANCELLED
```

| Status | Deskripsi |
|--------|-----------|
| `OPEN` | Masih menerima penawaran (bid) dari worker |
| `IN_PROGRESS` | Sudah ada worker yang mengerjakan |
| `IN_REVIEW` | Worker sudah submit hasil, menunggu review client |
| `COMPLETED` | Selesai, dana dicairkan |
| `CANCELLED` | Dibatalkan |
| `IN_DISPUTE` | Terjadi sengketa, menunggu keputusan admin |

## Validasi Task (Zod Schema)

```typescript
const taskSchema = z.object({
  title: z.string().min(10, "Judul tugas minimal 10 karakter"),
  description: z.string().min(30, "Deskripsi minimal 30 karakter"),
  category: z.string().min(1, "Kategori harus dipilih"),
  budget: z.coerce.number().min(10000, "Budget minimal Rp 10.000"),
  deadline: z.coerce.date().refine((date) => date > new Date(), {
    message: "Deadline harus di masa depan",
  }),
});
```

## Alur Pembuatan Tugas

```
Client isi form (title, description, category, budget, deadline, file)
        ↓
Validasi session (harus login)
        ↓
Validasi data via taskSchema
        ↓
Upload file ke MinIO (jika ada, prefix: "tasks/")
        ↓
Simpan ke database (status: OPEN)
        ↓
Revalidate /dashboard/tasks dan /dashboard
        ↓
Return { success: true, taskId }
```

## Kategori Tugas

Kategori yang ditampilkan di landing page (bisa dikembangkan):

| Kategori | Emoji |
|----------|-------|
| Tugas Kuliah | 📚 |
| Skripsi & Thesis | 🎓 |
| Programming | 💻 |
| Desain Grafis | 🎨 |
| Data Entry | 📊 |
| Penulisan Artikel | ✍️ |
| Tugas Sekolah | 📝 |
| Presentasi | 📽️ |

## Akses Halaman

| Halaman | Role |
|---------|------|
| `/dashboard/tasks` | Worker (browse tugas OPEN) + Admin (kelola semua) |
| `/dashboard/tasks/new` | CLIENT only |
| `/dashboard/tasks/[id]` | Semua role (detail tugas) |
| `/dashboard/my-tasks` | CLIENT only (tugas yang diposting sendiri) |
