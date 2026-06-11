import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AdminOverview } from "@/components/dashboard/admin-overview";
import { ClientOverview } from "@/components/dashboard/client-overview";
import { WorkerOverview } from "@/components/dashboard/worker-overview";
import { getAdminDashboardData, getClientDashboardData, getWorkerDashboardData } from "@/lib/services/dashboard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session?.user?.id) {
    redirect("/login");
  }

  const role = session.user.role || "CLIENT";
  const userName = session.user.name || "Pengguna";
  const userId = session.user.id;

  if (role === "ADMIN") {
    const data = await getAdminDashboardData();
    return <AdminOverview userName={userName} data={data} />;
  }

  if (role === "WORKER") {
    const data = await getWorkerDashboardData(userId);
    return <WorkerOverview userName={userName} data={data} />;
  }

  // Default to CLIENT
  const data = await getClientDashboardData(userId);
  return <ClientOverview userName={userName} data={data} />;
}
