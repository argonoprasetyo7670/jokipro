import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getWalletData } from "@/lib/services/wallet";
import { WalletContent } from "@/components/dashboard/wallet-content";

export const metadata = {
  title: "Riwayat Transaksi | Edutasky",
};

export default async function WalletPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const role = session.user.role as string;

  if (role !== "CLIENT" && role !== "WORKER") {
    redirect("/dashboard");
  }

  const data = await getWalletData(session.user.id, role);

  return <WalletContent data={data} />;
}
