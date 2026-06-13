# 🎓 Fitur 07: Worker Onboarding & KYC

## Deskripsi

Setiap user yang mendaftar sebagai **Worker** wajib melalui proses onboarding untuk melengkapi profil profesional mereka. Setelah onboarding, status KYC menjadi `PENDING` dan harus diverifikasi oleh Admin sebelum Worker bisa mengajukan bid.

## File Terkait

| File | Fungsi |
|------|--------|
| `lib/actions/onboarding.ts` | Server Action: `submitWorkerOnboardingAction` |
| `lib/actions/worker.ts` | Helper: `submitWorkerProfile`, `approveWorker`, `rejectWorker` |
| `lib/actions/admin.ts` | Admin Actions: `getPendingWorkersAction`, `verifyWorkerAction` |
| `app/(onboarding)/onboarding/` | Halaman onboarding worker |
| `app/dashboard/worker-onboarding/` | Alternatif halaman onboarding |
| `app/dashboard/verification-pending/` | Halaman menunggu verifikasi |
| `components/admin/worker-verification-dialog.tsx` | Dialog verifikasi worker (Admin) |

## Database Model

```prisma
model WorkerProfile {
  id             String    @id @default(cuid())
  userId         String    @unique
  user           User      @relation(...)

  bio            String?   @db.Text
  skills         String[]
  kycStatus      KycStatus @default(PENDING)
  kycDocument    String?
  rating         Float     @default(0.0)

  // Data Pendidikan
  university     String?
  major          String?
  educationLevel String?
  graduationYear Int?

  // CV & Portfolio
  cvUrl          String?
  portfolioUrl   String?
  portfolioFiles String[]

  // Verifikasi Admin
  verifiedAt     DateTime?
  rejectionNote  String?   @db.Text

  createdAt      DateTime  @default(now())
  updatedAt      DateTime  @updatedAt
}
```

## KYC Status

| Status | Deskripsi |
|--------|-----------|
| `PENDING` | Menunggu review admin |
| `APPROVED` | Disetujui, Worker bisa mulai bidding |
| `REJECTED` | Ditolak (ada catatan penolakan) |

## Alur Onboarding Worker

### 1. Auto-Redirect

Di `app/dashboard/layout.tsx`, Worker yang belum onboarding akan di-redirect:

```typescript
if (dbUser?.role === "WORKER") {
  const p = dbUser.workerProfile;
  const isOnboarded = p && p.bio && p.skills.length > 0 && p.university && p.major;
  if (!isOnboarded) {
    redirect("/onboarding/worker");
  }
}
```

### 2. Form Onboarding

```
Worker isi form:
  - Bio (min 10 karakter)
  - Skills (comma-separated)
  - Universitas/Instansi
  - Jurusan
  - Tingkat Pendidikan
  - Tahun Kelulusan
  - Link Portfolio (opsional)
  - Upload CV (wajib, max 5MB)
  - Upload Portfolio Files (opsional, max 10MB/file)
        ↓
Validasi via Zod (onboardingSchema)
        ↓
Upload files ke MinIO:
  - CV → prefix: "cvs/"
  - Portfolio → prefix: "portfolios/"
        ↓
Upsert WorkerProfile (kycStatus: PENDING)
        ↓
Redirect ke verification-pending page
```

### Validasi Onboarding

```typescript
const onboardingSchema = z.object({
  bio: z.string().min(10, "Bio minimal 10 karakter"),
  skills: z.string().min(2, "Harap masukkan keahlian Anda"),
  university: z.string().min(2, "Universitas/Instansi wajib diisi"),
  major: z.string().min(2, "Jurusan wajib diisi"),
  educationLevel: z.string().min(2, "Tingkat pendidikan wajib diisi"),
  graduationYear: z.coerce.number().min(1950).max(2100),
  portfolioUrl: z.string().url().optional().or(z.literal("")),
});
```

## Alur Verifikasi KYC (Admin)

### Fetch Pending Workers

```typescript
// Admin mendapatkan daftar worker yang menunggu verifikasi
const workers = await prisma.workerProfile.findMany({
  where: { kycStatus: "PENDING" },
  include: { user: { select: { name, email, image, createdAt } } },
  orderBy: { createdAt: "asc" },
});
```

### Approve Worker

```typescript
await prisma.workerProfile.update({
  where: { id: workerProfileId },
  data: {
    kycStatus: "APPROVED",
    verifiedAt: new Date(),
    rejectionNote: null,
  },
});
```

### Reject Worker

```typescript
// Catatan penolakan wajib diisi
await prisma.workerProfile.update({
  where: { id: workerProfileId },
  data: {
    kycStatus: "REJECTED",
    rejectionNote: reason,
    verifiedAt: null,
  },
});
```

## Flow Diagram

```
Register sebagai WORKER
        ↓
Auto-redirect ke /onboarding/worker
        ↓
Isi profil + upload CV/portfolio
        ↓
kycStatus = PENDING
        ↓
Redirect ke /verification-pending
        ↓
Admin review di /dashboard/users
   ├── APPROVED → Worker bisa bid
   └── REJECTED → Worker lihat catatan penolakan
```

## Impact KYC ke Bidding

```typescript
// Di createBidAction:
const workerProfile = await prisma.workerProfile.findUnique({
  where: { userId: session.user.id },
  select: { kycStatus: true }
});

if (!workerProfile || workerProfile.kycStatus !== "APPROVED") {
  throw new Error("Akun Anda sedang direview. Belum dapat mengirim penawaran.");
}
```
