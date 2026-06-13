# 🚨 Fitur 05: Dispute Resolution

## Deskripsi

Fitur sengketa (dispute) memungkinkan Client atau Worker mengajukan komplain jika terjadi masalah selama pengerjaan tugas. Admin bertanggung jawab untuk meninjau dan menyelesaikan sengketa.

## File Terkait

| File | Fungsi |
|------|--------|
| `lib/actions/disputes.ts` | Server Actions: `createDisputeAction`, `resolveDisputeAction` |
| `app/dashboard/disputes/` | Halaman daftar & detail dispute (Admin) |
| `components/dashboard/dispute-modal.tsx` | Modal pengajuan dispute (Client/Worker) |
| `components/admin/dispute-resolution-dialog.tsx` | Dialog resolusi dispute (Admin) |

## Database Model

```prisma
model Dispute {
  id         String        @id @default(cuid())
  taskId     String        @unique
  task       Task          @relation(...)
  reporterId String
  reporter   User          @relation("ReportedDisputes", ...)
  reason     String        @db.Text
  status     DisputeStatus @default(OPEN)
  adminNotes String?       @db.Text   // Keputusan admin
  createdAt  DateTime      @default(now())
  updatedAt  DateTime      @updatedAt
}
```

## Dispute Status

| Status | Deskripsi |
|--------|-----------|
| `OPEN` | Sengketa baru diajukan, menunggu review admin |
| `RESOLVED_CLIENT` | Admin memutuskan memihak Client (refund) |
| `RESOLVED_WORKER` | Admin memutuskan memihak Worker (release) |

## Alur Pengajuan Dispute

**Action:** `createDisputeAction(formData)`

```
Client/Worker isi alasan sengketa (min 10 karakter)
        ↓
Validasi:
  - Harus login
  - Harus bagian dari order (client/worker)
  - Tugas harus status IN_PROGRESS atau IN_REVIEW
  - Belum pernah ada dispute untuk tugas ini
        ↓
Transaction:
  1. Create Dispute (status: OPEN)
  2. Update Task → status: IN_DISPUTE
  3. Kirim Notification ke pihak lawan ("Sengketa Diajukan 🚨")
        ↓
Revalidate order page
```

### Validasi Pengajuan

```typescript
const createDisputeSchema = z.object({
  taskId: z.string().min(1, "ID Tugas tidak valid"),
  reason: z.string().min(10, "Alasan sengketa minimal 10 karakter"),
});
```

## Alur Resolusi Dispute (Admin)

**Action:** `resolveDisputeAction(formData)`

```
Admin pilih resolusi (FAVOR_CLIENT / FAVOR_WORKER) + tulis catatan
        ↓
Validasi:
  - Harus login + role ADMIN
  - Dispute harus status OPEN
  - Catatan putusan wajib diisi
        ↓
Transaction berdasarkan resolusi:
```

### Resolusi: Favor Client (Dana Refund)

```
1. Update Dispute → status: RESOLVED_CLIENT + adminNotes
2. Update Task → status: CANCELLED
3. Update Order → status: REFUNDED
4. Notify Client: "Sengketa Diselesaikan (Memihak Anda)"
5. Notify Worker: "Sengketa Diselesaikan - Uang dikembalikan ke Client"
```

### Resolusi: Favor Worker (Dana Release)

```
1. Update Dispute → status: RESOLVED_WORKER + adminNotes
2. Update Task → status: COMPLETED
3. Update Order → status: RELEASED
4. Notify Worker: "Sengketa Diselesaikan (Memihak Anda) - Dana dicairkan"
5. Notify Client: "Sengketa Diselesaikan - Dana dicairkan ke Worker"
```

### Validasi Resolusi

```typescript
const resolveDisputeSchema = z.object({
  disputeId: z.string().min(1),
  resolution: z.enum(["FAVOR_CLIENT", "FAVOR_WORKER"]),
  adminNotes: z.string().min(1, "Catatan putusan admin wajib diisi"),
});
```

## Diagram Flow

```
         Client / Worker
              │
        Ajukan Dispute
              │
     Task → IN_DISPUTE
              │
         Admin Review
          ┌───┴───┐
   FAVOR_CLIENT  FAVOR_WORKER
       │              │
   CANCELLED      COMPLETED
    REFUNDED       RELEASED
```

## Rules & Batasan

| Rule | Detail |
|------|--------|
| Siapa bisa ajukan | Client atau Worker yang terlibat di order |
| Kapan bisa ajukan | Saat tugas status `IN_PROGRESS` atau `IN_REVIEW` |
| Duplikasi | Satu tugas hanya bisa punya satu dispute |
| Siapa resolve | Hanya Admin |
| Wajib catatan | Admin harus mengisi catatan putusan |
