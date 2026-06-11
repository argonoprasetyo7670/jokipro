import { getAvailableWorkers } from "@/lib/services/workers";
import { WorkersClient } from "@/components/dashboard/workers-client";

export default async function WorkersPage() {
  const workers = await getAvailableWorkers();

  return <WorkersClient initialWorkers={workers} />;
}
