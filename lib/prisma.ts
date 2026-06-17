import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
    pool: Pool | undefined;
};

// Cache Pool di globalThis supaya HMR tidak bikin pool baru terus-terusan
const pool =
    globalForPrisma.pool ??
    new Pool({
        connectionString: process.env.DATABASE_URL!,
        connectionTimeoutMillis: 10000,
        // Di Vercel (production), 1 koneksi per instance sudah cukup
        max: process.env.NODE_ENV === "production" ? 1 : 3,
        // Tutup koneksi lebih cepat (5 detik) di production agar segera dikembalikan
        idleTimeoutMillis: process.env.NODE_ENV === "production" ? 5000 : 10000,
    });

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.pool = pool;
}

function createPrismaClient() {
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
