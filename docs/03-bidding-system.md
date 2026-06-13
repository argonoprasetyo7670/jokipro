# 💰 Fitur 03: Bidding System

## Deskripsi

Sistem bidding memungkinkan **Worker** untuk mengajukan penawaran pada tugas yang berstatus `OPEN`. **Client** kemudian membandingkan penawaran dan memilih worker terbaik. Setelah bid diterima, otomatis dibuat **Order** dan tugas berpindah ke `IN_PROGRESS`.

## File Terkait

| File | Fungsi |
|------|--------|
| `lib/actions/bids.ts` | Server Actions: `createBidAction`, `acceptBidAction` |
| `components/dashboard/bid-form.tsx` | Form pengajuan bid (Worker) |
| `components/dashboard/bid-card.tsx` | Kartu penawaran (tampil di detail tugas) |

## Database Model

```prisma
model Bid {
  id            String    @id @default(cuid())
  taskId        String
  task          Task      @relation(...)
  workerId      String
  worker        User      @relation("WorkerBids", ...)
  amount        Float     // Harga yang ditawarkan worker
  coverLetter   String    @db.Text
  estimatedDays Int       // Estimasi hari penyelesaian
  attachment    String?   // Lampiran penawaran (PDF/Image)
  status        BidStatus @default(PENDING)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  order         Order?
}
```

## Bid Status

| Status | Deskripsi |
|--------|-----------|
| `PENDING` | Menunggu keputusan Client |
| `ACCEPTED` | Diterima oleh Client → Order dibuat |
| `REJECTED` | Ditolak (otomatis saat bid lain diterima) |

## Validasi Bid

```typescript
const bidSchema = z.object({
  taskId: z.string().min(1, "Task ID is required"),
  amount: z.coerce.number().min(10000, "Harga penawaran minimal Rp 10.000"),
  estimatedDays: z.coerce.number().min(1, "Estimasi waktu minimal 1 hari"),
  coverLetter: z.string().min(10, "Pesan minimal 10 karakter"),
});
```

## Alur Pengajuan Bid (Worker)

```
Worker isi form (amount, estimatedDays, coverLetter, attachment)
        ↓
Validasi: Harus login + role WORKER
        ↓
Cek KYC status: Harus APPROVED
        ↓
Validasi data via bidSchema
        ↓
Cek tugas: Harus status OPEN
        ↓
Cek: Tidak boleh bid tugas sendiri
        ↓
Cek: Belum pernah bid di tugas ini
        ↓
Upload attachment ke MinIO (opsional, prefix: "bids/", max 5MB)
        ↓
Transaction:
  1. Create Bid (status: PENDING)
  2. Kirim Notification ke Client
        ↓
Revalidate paths
        ↓
Return { success: true }
```

## Alur Accept Bid (Client)

```
Client klik "Terima Penawaran" pada salah satu bid
        ↓
Validasi: Harus login + role CLIENT
        ↓
Cek: Bid ada + tugas milik Client + tugas status OPEN
        ↓
Hitung platform fee (5% dari bid amount)
        ↓
Transaction:
  1. Update bid terpilih → status: ACCEPTED
  2. Tolak semua bid lainnya → status: REJECTED
  3. Update tugas → status: IN_PROGRESS
  4. Buat Order baru (PENDING_PAYMENT)
  5. Kirim Notification ke Worker yang terpilih
        ↓
Revalidate paths
        ↓
Return { success: true }
```

## Platform Fee

- **Besaran:** 5% dari nilai bid yang diterima
- **Perhitungan:** `platformFee = bid.amount * 0.05`
- **Contoh:** Bid Rp 1.000.000 → Fee: Rp 50.000, Worker terima: Rp 950.000

## Proteksi & Validasi

| Rule | Deskripsi |
|------|-----------|
| Role check | Hanya Worker yang bisa bid |
| KYC check | Worker harus sudah APPROVED |
| Task status | Tugas harus masih OPEN |
| Self-bid prevention | Tidak bisa bid tugas sendiri |
| Duplicate prevention | Satu worker hanya bisa bid sekali per tugas |
| Ownership check | Hanya Client pemilik tugas yang bisa accept bid |
