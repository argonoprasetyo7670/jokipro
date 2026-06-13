# ⭐ Fitur 06: Review & Rating

## Deskripsi

Setelah tugas berstatus `COMPLETED`, baik Client maupun Worker dapat memberikan ulasan dan rating (1-5 bintang). Rating rata-rata dihitung ulang secara otomatis dan ditampilkan di profil pengguna.

## File Terkait

| File | Fungsi |
|------|--------|
| `lib/actions/reviews.ts` | Server Action: `submitReviewAction` |
| `components/dashboard/review-form.tsx` | Form ulasan (rating bintang + komentar) |

## Database Model

```prisma
model Review {
  id         String   @id @default(cuid())
  taskId     String
  task       Task     @relation(...)
  reviewerId String
  reviewer   User     @relation("GivenReviews", ...)
  revieweeId String
  reviewee   User     @relation("ReceivedReviews", ...)
  rating     Int      // 1-5 Bintang
  comment    String?  @db.Text
  createdAt  DateTime @default(now())

  @@unique([taskId, reviewerId])  // Satu reviewer hanya bisa review sekali per tugas
}
```

## Validasi

```typescript
const reviewSchema = z.object({
  orderId: z.string().min(1),
  rating: z.coerce.number().min(1).max(5),
  comment: z.string().optional(),
});
```

## Alur Submit Review

**Action:** `submitReviewAction(formData)`

```
User isi rating (1-5) + komentar opsional
        ↓
Validasi:
  - Harus login
  - Order harus ada + tugas status COMPLETED
  - Harus Client atau Worker dari order tersebut
  - Belum pernah review tugas ini (unique constraint: taskId + reviewerId)
        ↓
Tentukan reviewee:
  - Jika Client → reviewee = Worker
  - Jika Worker → reviewee = Client
        ↓
Transaction:
  1. Create Review (rating + comment)
  2. Kirim Notification ke reviewee ("Ulasan Baru Diterima 🌟")
  3. Hitung ulang rata-rata rating reviewee
  4. Update rating di WorkerProfile/ClientProfile
        ↓
Revalidate order page + profile page
```

## Perhitungan Rating

Rating dihitung sebagai **rata-rata** dari semua review yang diterima:

```typescript
const allReviews = await tx.review.findMany({
  where: { revieweeId },
  select: { rating: true },
});

const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
const averageRating = allReviews.length > 0 ? totalRating / allReviews.length : 0;
```

Rating disimpan di:
- `WorkerProfile.rating` (jika reviewee adalah Worker)
- `ClientProfile.rating` (jika reviewee adalah Client)

## Siapa Review Siapa?

| Reviewer | Reviewee | Kapan |
|----------|----------|-------|
| Client | Worker | Setelah tugas COMPLETED |
| Worker | Client | Setelah tugas COMPLETED |

> Kedua pihak bisa saling memberikan ulasan secara independen.

## Rules & Batasan

| Rule | Detail |
|------|--------|
| Kapan bisa review | Hanya setelah tugas status `COMPLETED` |
| Duplikasi | Satu reviewer hanya bisa review sekali per tugas (`@@unique`) |
| Rating range | 1-5 bintang |
| Komentar | Opsional |
| Rating update | Otomatis dihitung ulang setiap ada review baru |
