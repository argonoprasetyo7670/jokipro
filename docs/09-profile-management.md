# 👤 Fitur 09: Profile Management

## Deskripsi

Pengguna dapat mengelola profil mereka termasuk nama, nomor telepon, bio, skills (Worker), dan avatar. Avatar diupload ke MinIO.

## File Terkait

| File | Fungsi |
|------|--------|
| `lib/actions/profile.ts` | Server Actions: `updateProfileAction`, `updateAvatarAction` |
| `app/dashboard/profile/` | Halaman profil user |
| `components/dashboard/profile-form.tsx` | Form edit profil |
| `components/dashboard/profile-avatar.tsx` | Komponen upload avatar |

## Fitur Update Profil

### Action: `updateProfileAction(formData)`

```
User edit nama, phone, bio, skills
        ↓
Validasi via profileSchema
        ↓
Update User: name, phone
        ↓
Jika WORKER → Upsert WorkerProfile: bio, skills
        ↓
Revalidate /dashboard/profile dan /dashboard
```

### Validasi Profil

```typescript
const profileSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  phone: z.string().optional(),
  bio: z.string().optional(),
  skills: z.array(z.string()).optional(),
});
```

### Data yang Bisa Diedit

| Field | User Model | Worker Only |
|-------|:---------:|:-----------:|
| Nama | ✅ | — |
| Phone | ✅ | — |
| Bio | — | ✅ |
| Skills | — | ✅ |
| Avatar | ✅ | — |

## Fitur Update Avatar

### Action: `updateAvatarAction(formData)`

```
User pilih file gambar
        ↓
Validasi:
  - File harus ada dan tidak kosong
  - File harus berformat gambar (image/*)
        ↓
Upload ke MinIO (prefix: "avatars/")
        ↓
Update User.image dengan URL baru
        ↓
Revalidate paths
        ↓
Return { success: true, imageUrl }
```

## Worker Profile Fields

Worker memiliki data tambahan yang diisi saat onboarding:

| Field | Deskripsi | Editable via Profile? |
|-------|-----------|:---------------------:|
| bio | Deskripsi diri | ✅ |
| skills | Array keahlian | ✅ |
| university | Universitas/Instansi | ❌ (hanya via onboarding) |
| major | Jurusan | ❌ |
| educationLevel | Tingkat pendidikan | ❌ |
| graduationYear | Tahun kelulusan | ❌ |
| cvUrl | URL file CV | ❌ |
| portfolioUrl | Link portfolio | ❌ |
| portfolioFiles | File portfolio | ❌ |
| rating | Rating rata-rata | 🔒 Auto-calculated |
| kycStatus | Status verifikasi | 🔒 Admin only |

## Akses

| Halaman | Role |
|---------|------|
| `/dashboard/profile` | Semua role (CLIENT, WORKER, ADMIN) |
