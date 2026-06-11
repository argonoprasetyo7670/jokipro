import { prisma } from "@/lib/prisma";
import { WorkerTable } from "./worker-table";

export default async function AdminWorkersPage() {
  const workers = await prisma.workerProfile.findMany({
    include: {
      user: {
        select: { name: true, email: true, image: true, createdAt: true },
      },
    },
    orderBy: [
      { kycStatus: "asc" }, // PENDING first
      { createdAt: "desc" },
    ],
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Verifikasi Worker</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review dan verifikasi data worker yang mendaftar.
        </p>
      </div>

      <WorkerTable workers={JSON.parse(JSON.stringify(workers))} />
    </div>
  );
}
