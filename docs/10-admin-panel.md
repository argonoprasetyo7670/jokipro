# 🛡️ Fitur 10: Admin Panel

## Deskripsi

Admin memiliki akses khusus untuk mengelola seluruh platform: verifikasi worker, manage users, resolve disputes, dan melihat statistik platform.

## File Terkait

| File | Fungsi |
|------|--------|
| `lib/actions/admin.ts` | Admin Actions: `getPendingWorkersAction`, `verifyWorkerAction` |
| `lib/services/dashboard.ts` | `getAdminDashboardData()` — statistik platform |
| `app/dashboard/page.tsx` | Overview admin (role-based rendering) |
| `app/dashboard/users/` | Kelola pengguna |
| `app/dashboard/clients/` | Kelola client |
| `app/dashboard/disputes/` | Kelola dispute |
| `app/dashboard/admin-keren/` | Panel admin khusus |
| `components/dashboard/admin-overview.tsx` | Komponen overview admin |
| `components/admin/worker-verification-dialog.tsx` | Dialog verifikasi worker |
| `components/admin/dispute-resolution-dialog.tsx` | Dialog resolusi dispute |

## Dashboard Admin — Statistik

**Service:** `getAdminDashboardData()`

Data yang ditampilkan:

| Metrik | Sumber |
|--------|--------|
| Total Users | `prisma.user.count()` |
| Total Transaksi | `prisma.order.aggregate({ _sum: { amount } })` |
| Open Disputes | `prisma.dispute.count({ where: { status: "OPEN" } })` |
| Platform Profit | `prisma.order.aggregate({ _sum: { platformFee } })` |
| Recent Disputes | 5 dispute terbaru dengan detail task & reporter |

## Admin Actions

### 1. Fetch Pending Workers

```typescript
export async function getPendingWorkersAction() {
  // Validasi: Harus ADMIN
  const workers = await prisma.workerProfile.findMany({
    where: { kycStatus: "PENDING" },
    include: { user: { select: { name, email, image, createdAt } } },
    orderBy: { createdAt: "asc" },
  });
  return workers;
}
```

### 2. Verify Worker (Approve/Reject)

```typescript
export async function verifyWorkerAction(
  workerProfileId: string,
  status: "APPROVED" | "REJECTED",
  rejectionNote?: string
) {
  // Validasi: Harus ADMIN
  // Jika REJECTED, catatan penolakan wajib diisi

  await prisma.workerProfile.update({
    where: { id: workerProfileId },
    data: {
      kycStatus: status,
      verifiedAt: new Date(),
      rejectionNote: status === "REJECTED" ? rejectionNote : null,
    },
  });
}
```

### 3. Resolve Dispute

Lihat detail lengkap di [05-dispute-resolution.md](./05-dispute-resolution.md).

## Sidebar Navigation (Admin)

```typescript
const adminNav = [
  { url: "/dashboard", title: "Overview", icon: IconLayoutDashboard },
  { url: "/dashboard/users", title: "Kelola Pengguna", icon: IconUsers },
  { url: "/dashboard/tasks", title: "Kelola Tugas", icon: IconListSearch },
  { url: "/dashboard/disputes", title: "Dispute", icon: IconAlertCircle },
];
```

## Route Protection (Admin Only)

```typescript
// auth.config.ts
const adminOnlyRoutes = [
  "/dashboard/clients",
  "/dashboard/users",
  "/dashboard/admin-keren"
];

if (adminOnlyRoutes.some(route => nextUrl.pathname.startsWith(route))) {
  if (role !== "ADMIN") return Response.redirect(new URL("/dashboard", nextUrl));
}
```

## Diagram Alur Admin

```
Admin Login
    ↓
Dashboard Overview (statistik)
    ├── Total Users
    ├── Total Transaksi
    ├── Open Disputes
    └── Platform Profit
    
Kelola Pengguna (/dashboard/users)
    └── Verifikasi Worker KYC
        ├── Approve → Worker bisa bid
        └── Reject (+ catatan) → Worker ditolak

Kelola Dispute (/dashboard/disputes)
    └── Resolve Dispute
        ├── Favor Client → Refund
        └── Favor Worker → Release
```
