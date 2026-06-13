# 🔔 Fitur 08: Notification System

## Deskripsi

EduTasky menggunakan sistem notifikasi berbasis database. Notifikasi dikirim secara otomatis saat terjadi event penting (bid baru, hasil dikirim, dispute, dll). User dapat melihat notifikasi via dropdown di header dashboard.

## File Terkait

| File | Fungsi |
|------|--------|
| `lib/actions/notifications.ts` | Server Actions: get, count, mark as read |
| `components/notification-dropdown.tsx` | Dropdown UI notifikasi di header |

## Database Model

```prisma
model Notification {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation("UserNotifications", ...)
  title     String
  message   String   @db.Text
  isRead    Boolean  @default(false)
  link      String?  // URL redirect saat notifikasi diklik
  createdAt DateTime @default(now())
}
```

## Server Actions

### Ambil Notifikasi

```typescript
export async function getNotifications() {
  // Ambil 20 notifikasi terbaru untuk user yang login
  return prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}
```

### Hitung Notifikasi Belum Dibaca

```typescript
export async function getUnreadNotificationCount() {
  return prisma.notification.count({
    where: { userId: session.user.id, isRead: false },
  });
}
```

### Tandai Satu Notifikasi Dibaca

```typescript
export async function markNotificationAsRead(id: string) {
  await prisma.notification.update({
    where: { id, userId: session.user.id },
    data: { isRead: true },
  });
}
```

### Tandai Semua Dibaca

```typescript
export async function markAllNotificationsAsRead() {
  await prisma.notification.updateMany({
    where: { userId: session.user.id, isRead: false },
    data: { isRead: true },
  });
}
```

## Kapan Notifikasi Dikirim?

| Event | Penerima | Title | Sumber |
|-------|----------|-------|--------|
| Worker mengirim bid baru | Client | "Penawaran Baru Diterima" | `bids.ts` |
| Client menerima bid | Worker | "Penawaran Diterima! 🎉" | `bids.ts` |
| Worker submit hasil | Client | "Hasil Kerja Dikirim 📦" | `orders.ts` |
| Client accept hasil | Worker | "Tugas Selesai! 🎉" | `orders.ts` |
| Client minta revisi | Worker | "Revisi Diminta 🔄" | `orders.ts` |
| Pesan baru di chat | Lawan bicara | "Pesan Baru: {task title}" | `orders.ts` |
| Dispute diajukan | Pihak lawan | "Sengketa Diajukan 🚨" | `disputes.ts` |
| Dispute diselesaikan | Kedua pihak | "Sengketa Diselesaikan..." | `disputes.ts` |
| Review diterima | Reviewee | "Ulasan Baru Diterima 🌟" | `reviews.ts` |

## Komponen UI

### NotificationDropdown (`components/notification-dropdown.tsx`)

- Ditampilkan di header dashboard (semua role)
- Menampilkan badge jumlah unread
- Dropdown berisi daftar notifikasi (max 20)
- Klik notifikasi → tandai dibaca + redirect ke link
- Tombol "Tandai Semua Dibaca"

## Catatan Teknis

- Notifikasi selalu dibuat dalam **transaction** bersama aksi utama
- Link opsional — mengarahkan ke halaman terkait (misal order detail)
- Pesan chat dipotong menjadi 50 karakter untuk notifikasi
- Max 20 notifikasi ditampilkan di dropdown
- Notifikasi **tidak real-time** (perlu page refresh/revalidation) — belum ada WebSocket
