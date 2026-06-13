# 📦 Fitur 04: Order & Workspace

## Deskripsi

Setelah bid diterima, **Order** otomatis dibuat. Order menjadi "workspace" dimana Worker dan Client berkomunikasi via chat, Worker submit hasil kerja, dan Client review hasilnya.

## File Terkait

| File | Fungsi |
|------|--------|
| `lib/actions/orders.ts` | Server Actions: sendMessage, submitWork, acceptResult, requestRevision |
| `app/dashboard/orders/` | Halaman daftar order & detail order |
| `components/dashboard/order-actions.tsx` | Tombol aksi order (submit, accept, revisi) |
| `components/dashboard/order-chat.tsx` | Komponen chat dalam workspace |

## Database Model

```prisma
model Order {
  id          String        @id @default(cuid())
  taskId      String        @unique
  task        Task          @relation(...)
  bidId       String        @unique
  bid         Bid           @relation(...)
  clientId    String
  client      User          @relation("ClientOrders", ...)
  workerId    String
  worker      User          @relation("WorkerOrders", ...)
  amount      Float         // Nilai deal akhir (dari Bid)
  platformFee Float         // Komisi platform (5%)
  status      PaymentStatus @default(PENDING_PAYMENT)
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
}

model Message {
  id         String   @id @default(cuid())
  taskId     String
  task       Task     @relation(...)
  senderId   String
  sender     User     @relation("SentMessages", ...)
  content    String   @db.Text
  attachment String?
  createdAt  DateTime @default(now())
}
```

## Payment Status Flow

```
PENDING_PAYMENT → ESCROW_HOLD → RELEASED
                               → REFUNDED (via dispute)
```

| Status | Deskripsi |
|--------|-----------|
| `PENDING_PAYMENT` | Menunggu Client bayar |
| `ESCROW_HOLD` | Uang ditahan sistem, Worker mulai kerja |
| `RELEASED` | Dana dicairkan ke Worker (tugas selesai) |
| `REFUNDED` | Dana dikembalikan ke Client (dispute/cancel) |

## Fitur dalam Workspace

### 1. Chat / Messaging

**Action:** `sendMessageAction(formData)`

```
User ketik pesan + lampiran opsional
        ↓
Validasi: Harus login + bagian dari order (client/worker)
        ↓
Upload attachment ke MinIO (max 10MB, prefix: "messages/")
        ↓
Transaction:
  1. Simpan pesan ke Message table
  2. Kirim Notification ke penerima
        ↓
Revalidate order page
```

Notifikasi pesan dipotong menjadi 50 karakter pertama + "..." jika terlalu panjang.

### 2. Submit Work (Worker)

**Action:** `submitWorkAction(orderId)`

Mengubah status tugas dari `IN_PROGRESS` → `IN_REVIEW`.

```
Worker klik "Submit Hasil"
        ↓
Validasi: Harus Worker + tugas status IN_PROGRESS
        ↓
Transaction:
  1. Update Task → status: IN_REVIEW
  2. Kirim Notification ke Client ("Hasil Kerja Dikirim 📦")
  3. Auto-post system message di chat
        ↓
Revalidate paths
```

### 3. Accept Result (Client)

**Action:** `acceptResultAction(orderId)`

Mengubah status tugas dari `IN_REVIEW` → `COMPLETED` dan release pembayaran.

```
Client klik "Terima Hasil"
        ↓
Validasi: Harus Client + tugas status IN_REVIEW
        ↓
Transaction:
  1. Update Task → status: COMPLETED
  2. Update Order → status: RELEASED
  3. Kirim Notification ke Worker ("Tugas Selesai! 🎉")
  4. Auto-post system message di chat
        ↓
Revalidate paths
```

### 4. Request Revision (Client)

**Action:** `requestRevisionAction(orderId, note)`

Mengubah status tugas dari `IN_REVIEW` → `IN_PROGRESS` (kembali dikerjakan).

```
Client isi catatan revisi + klik "Minta Revisi"
        ↓
Validasi: Harus Client + catatan wajib diisi + tugas status IN_REVIEW
        ↓
Transaction:
  1. Update Task → status: IN_PROGRESS
  2. Kirim Notification ke Worker ("Revisi Diminta 🔄")
  3. Auto-post system message dengan catatan revisi
        ↓
Revalidate paths
```

## Lifecycle Order Lengkap

```
Bid Accepted
    ↓
Order Created (PENDING_PAYMENT)
    ↓
[Pembayaran - belum implementasi]
    ↓
Worker Mengerjakan (IN_PROGRESS)
    ↓
Worker Submit Hasil (IN_REVIEW)
    ↓
┌── Client Accept → COMPLETED + RELEASED ──→ Review
├── Client Revisi → IN_PROGRESS (loop)
└── Dispute → IN_DISPUTE → Admin Resolve
```

## Akses Halaman

| Halaman | Role |
|---------|------|
| `/dashboard/orders` | CLIENT + WORKER |
| `/dashboard/orders/[id]` | Hanya Client/Worker yang terkait order tersebut |
