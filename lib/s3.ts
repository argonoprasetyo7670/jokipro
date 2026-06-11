import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: "auto", // MinIO doesn't strictly require a specific region unless configured
  endpoint: process.env.MINIO_ENDPOINT,
  credentials: {
    accessKeyId: process.env.MINIO_ACCESS_KEY || "",
    secretAccessKey: process.env.MINIO_SECRET_KEY || "",
  },
  forcePathStyle: true, // IMPORTANT for MinIO compatibility (uses /bucket/key instead of bucket.endpoint/key)
});

export async function uploadFileToMinio(file: File, prefix: string = "tasks"): Promise<string> {
  const bucketName = process.env.MINIO_BUCKET;
  
  if (!bucketName) {
    throw new Error("MINIO_BUCKET is not configured in .env");
  }

  const fileBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(fileBuffer);
  
  // Clean filename: remove spaces and special chars, prepend timestamp
  const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
  const objectKey = `${prefix}/${Date.now()}-${cleanFileName}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: objectKey,
    Body: buffer,
    ContentType: file.type || "application/octet-stream",
    // ACL: "public-read", // Uncomment this if your bucket doesn't have a default public policy
  });

  await s3Client.send(command);

  // Return the public URL
  // Format: endpoint/bucket/key
  const endpoint = process.env.MINIO_ENDPOINT?.replace(/\/$/, ""); // Remove trailing slash if any
  return `${endpoint}/${bucketName}/${objectKey}`;
}
