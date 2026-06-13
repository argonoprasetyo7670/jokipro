# 📁 Fitur 11: File Upload (MinIO/S3)

## Deskripsi

EduTasky menggunakan **MinIO** (S3-compatible object storage) untuk menyimpan semua file yang diupload pengguna: lampiran tugas, CV, portfolio, attachment bid, avatar, dan file chat.

## File Terkait

| File | Fungsi |
|------|--------|
| `lib/s3.ts` | S3 client config + `uploadFileToMinio()` utility |
| `.env` | Environment variables untuk MinIO |

## Konfigurasi S3 Client

```typescript
const s3Client = new S3Client({
  region: "auto",
  endpoint: process.env.MINIO_ENDPOINT,
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY || "",
    secretAccessKey: process.env.MINIO_SECRET_KEY || "",
  },
  forcePathStyle: true, // Penting untuk MinIO (gunakan /bucket/key)
});
```

> `forcePathStyle: true` diperlukan karena MinIO menggunakan format URL `endpoint/bucket/key` bukan `bucket.endpoint/key` seperti AWS S3.

## Environment Variables

```env
MINIO_ENDPOINT=http://your-minio-server:9000
MINIO_ACCESS_KEY=your-access-key
MINIO_SECRET_KEY=your-secret-key
MINIO_BUCKET=EduTasky
```

## Fungsi Upload

```typescript
export async function uploadFileToMinio(
  file: File, 
  prefix: string = "tasks"
): Promise<string> {
  const fileBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(fileBuffer);
  
  // Clean filename + timestamp untuk unique key
  const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const objectKey = `${prefix}/${Date.now()}-${cleanFileName}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
    Body: buffer,
    ContentType: file.type || "application/octet-stream",
  });

  await s3Client.send(command);

  // Return public URL: endpoint/bucket/key
  return `${endpoint}/${bucketName}/${objectKey}`;
}
```

## Prefix per Fitur

| Prefix | Fitur | Max Size | Sumber |
|--------|-------|----------|--------|
| `tasks/` | Lampiran tugas | Tidak dibatasi | `lib/actions/tasks.ts` |
| `bids/` | Lampiran penawaran | 5MB | `lib/actions/bids.ts` |
| `cvs/` | CV Worker | 5MB | `lib/actions/onboarding.ts` |
| `portfolios/` | File portfolio Worker | 10MB/file | `lib/actions/onboarding.ts` |
| `messages/` | Lampiran chat | 10MB | `lib/actions/orders.ts` |
| `avatars/` | Foto profil | Tidak dibatasi | `lib/actions/profile.ts` |

## Naming Convention

Format nama file di MinIO:
```
{prefix}/{timestamp}-{clean_filename}
```

Contoh:
```
tasks/1718192000000-Tugas_Pemrograman.pdf
cvs/1718192000000-CV_Andi_Pratama.pdf
avatars/1718192000000-profile_photo.jpg
```

## Cara Pemanggilan

### Import Langsung

```typescript
import { uploadFileToMinio } from "@/lib/s3";
const url = await uploadFileToMinio(file, "tasks");
```

### Lazy Import (untuk menghindari edge runtime issue)

```typescript
const { uploadFileToMinio } = await import("@/lib/s3");
const url = await uploadFileToMinio(file, "bids");
```

> Beberapa Server Actions menggunakan lazy import untuk menghindari masalah kompatibilitas dengan edge runtime.

## Error Handling

Setiap fitur yang menggunakan upload memiliki try-catch sendiri:

```typescript
try {
  attachmentUrl = await uploadFileToMinio(file);
} catch (err) {
  console.error("Gagal mengupload file:", err);
  return { error: "Gagal mengupload file lampiran." };
}
```

## URL Format

URL publik yang dihasilkan:
```
{MINIO_ENDPOINT}/{MINIO_BUCKET}/{objectKey}
```

Contoh:
```
http://minio.example.com:9000/EduTasky/tasks/1718192000000-tugas.pdf
```
