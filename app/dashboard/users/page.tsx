import { getPendingWorkersAction } from "@/lib/actions/admin";
import { WorkerVerificationDialog } from "@/components/admin/worker-verification-dialog";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export const metadata = {
  title: "Kelola Pengguna | JokiPro Admin",
};

export default async function AdminUsersPage() {
  const pendingWorkers = await getPendingWorkersAction();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Kelola Pengguna</h1>
        <p className="text-muted-foreground mt-1">
          Verifikasi worker baru dan kelola akun pengguna platform.
        </p>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Menunggu Verifikasi (Pending KYC)</h2>
              <p className="text-sm text-muted-foreground">
                Terdapat {pendingWorkers.length} worker yang menunggu persetujuan admin.
              </p>
            </div>
            {pendingWorkers.length > 0 && (
              <div className="px-3 py-1 bg-amber-500/10 text-amber-600 rounded-full text-xs font-semibold">
                {pendingWorkers.length} Pending
              </div>
            )}
          </div>
        </div>

        {pendingWorkers.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center text-muted-foreground">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 12 2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
            </div>
            <p className="font-medium text-foreground">Semua bersih!</p>
            <p className="text-sm mt-1">Tidak ada worker yang perlu diverifikasi saat ini.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground bg-muted/50 uppercase">
                <tr>
                  <th className="px-6 py-4 font-medium">Worker</th>
                  <th className="px-6 py-4 font-medium">Edukasi / Jurusan</th>
                  <th className="px-6 py-4 font-medium">Tanggal Daftar</th>
                  <th className="px-6 py-4 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {pendingWorkers.map((worker) => (
                  <tr key={worker.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{worker.user.name}</div>
                      <div className="text-xs text-muted-foreground">{worker.user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-foreground">{worker.university || "-"}</div>
                      <div className="text-xs text-muted-foreground">{worker.major || "-"}</div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {format(new Date(worker.createdAt), "dd MMM yyyy", { locale: id })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <WorkerVerificationDialog worker={worker} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
