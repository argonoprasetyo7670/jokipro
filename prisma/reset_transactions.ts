import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL!,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Memulai penghapusan data transaksi...');

  try {
    const deletes = [
      prisma.agentLog.deleteMany(),
      prisma.agentDraft.deleteMany(),
      prisma.notification.deleteMany(),
      prisma.review.deleteMany(),
      prisma.dispute.deleteMany(),
      prisma.message.deleteMany(),
      prisma.order.deleteMany(),
      prisma.bid.deleteMany(),
      prisma.task.deleteMany(),
    ];

    await prisma.$transaction(deletes);

    console.log('✅ Semua data transaksi berhasil dihapus!');
  } catch (error) {
    console.error('❌ Terjadi kesalahan saat menghapus data:', error);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main();
