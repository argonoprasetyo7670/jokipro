# 📋 EduTasky.id — Dokumentasi Fitur

## Tentang Project

**EduTasky** adalah marketplace jasa pengerjaan tugas (bantuan tugas) berbasis web. Platform ini menghubungkan **Client** (pemilik tugas) dengan **Worker** (pengerjak tugas) melalui sistem **bidding transparan**, **escrow payment**, dan **dispute resolution**.

## Tech Stack

| Layer            | Teknologi                                        |
| ---------------- | ------------------------------------------------ |
| **Framework**    | Next.js 16 (App Router)                          |
| **Language**     | TypeScript                                       |
| **Styling**      | Tailwind CSS v4 + shadcn/ui + Radix UI           |
| **Auth**         | NextAuth v5 (beta) — Credentials + Google OAuth  |
| **Database**     | PostgreSQL via Prisma ORM v7                     |
| **File Storage** | MinIO (S3-compatible) via `@aws-sdk/client-s3`   |
| **Validation**   | Zod v4                                           |
| **Forms**        | React Hook Form                                  |
| **Animation**    | Framer Motion + Custom CSS Animations            |
| **Icons**        | Tabler Icons React                               |
| **Toast**        | Sonner                                           |
| **Pkg Manager**  | pnpm                                             |

## Tiga Role Pengguna

| Role       | Deskripsi                                             |
| ---------- | ----------------------------------------------------- |
| **CLIENT** | Memposting tugas, menerima bid, review hasil          |
| **WORKER** | Mengajukan bid, mengerjakan tugas, submit hasil       |
| **ADMIN**  | Verifikasi worker, kelola dispute, monitoring platform |

## Daftar Dokumentasi Fitur

| No  | Dokumen                                                   | Deskripsi                                    |
| --- | --------------------------------------------------------- | -------------------------------------------- |
| 01  | [Autentikasi](./01-authentication.md)                     | Login, register, Google OAuth, session        |
| 02  | [Task Management](./02-task-management.md)                | CRUD tugas, validasi, file attachment         |
| 03  | [Bidding System](./03-bidding-system.md)                  | Pengajuan & penerimaan penawaran             |
| 04  | [Order & Workspace](./04-order-workspace.md)              | Manajemen pesanan, chat, submit hasil        |
| 05  | [Dispute Resolution](./05-dispute-resolution.md)          | Pengajuan & penyelesaian sengketa            |
| 06  | [Review & Rating](./06-review-rating.md)                  | Sistem ulasan dan rating pengguna            |
| 07  | [Worker Onboarding & KYC](./07-worker-onboarding-kyc.md)  | Proses onboarding dan verifikasi worker      |
| 08  | [Notification System](./08-notification-system.md)        | Notifikasi real-time berbasis database       |
| 09  | [Profile Management](./09-profile-management.md)          | Kelola profil & avatar pengguna              |
| 10  | [Admin Panel](./10-admin-panel.md)                        | Dashboard admin, verifikasi, statistik       |
| 11  | [File Upload (MinIO)](./11-file-upload.md)                | Sistem upload file via MinIO/S3              |
| 12  | [Authorization & Middleware](./12-authorization.md)       | Route protection, role-based access control  |

## Business Flow

```
Client Posting Tugas
        ↓
Workers Mengajukan Bid
        ↓
Client Accept Bid → Order Dibuat (PENDING_PAYMENT)
        ↓
Worker Mengerjakan (IN_PROGRESS)
        ↓
Worker Submit Hasil (IN_REVIEW)
        ↓
   Client Review
   ├── Accept → COMPLETED + Dana RELEASED
   ├── Revisi → Kembali ke IN_PROGRESS
   └── Dispute → IN_DISPUTE → Admin Resolve
```

## Menjalankan Project

```bash
# Install dependencies
pnpm install

# Jalankan database migration
pnpm dlx prisma migrate dev

# Seed database (opsional)
pnpm seed

# Jalankan development server
pnpm dev
```
