import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import {
  IconCamera,
  IconStarFilled,
  IconBriefcase,
  IconCash,
  IconEdit
} from "@tabler/icons-react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { PageTransition, AnimatedCard } from "@/components/motion";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { ProfileAvatar } from "@/components/dashboard/profile-avatar";
import { formatRupiah } from "@/lib/utils";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const userId = session.user.id;
  
  const userData = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      workerProfile: true,
      clientProfile: true,
      _count: {
        select: {
          postedTasks: true,
          workerOrders: true,
        }
      }
    }
  });

  if (!userData) {
    redirect("/login");
  }

  const isWorker = userData.role === "WORKER";
  const joinDate = new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(userData.createdAt);
  const initial = userData.name ? userData.name.substring(0, 2).toUpperCase() : "JP";

  // Calculate stats based on role
  let totalTasks = 0;
  let totalSpent = "Rp 0";
  let rating = 0;

  if (isWorker) {
    totalTasks = userData._count.workerOrders;
    // Calculate total earned for worker
    const orders = await prisma.order.findMany({
      where: { workerId: userId, status: "RELEASED" },
      select: { amount: true, platformFee: true }
    });
    const earned = orders.reduce((sum, order) => sum + (order.amount - order.platformFee), 0);
    totalSpent = formatRupiah(earned);
    rating = userData.workerProfile?.rating || 0;
  } else {
    totalTasks = userData._count.postedTasks;
    const orders = await prisma.order.aggregate({
      where: { clientId: userId }, // include all orders, even ESCROW_HOLD
      _sum: { amount: true }
    });
    totalSpent = formatRupiah(orders._sum.amount || 0);
    rating = userData.clientProfile?.rating || 0;
  }

  const formattedUser = {
    name: userData.name || "",
    email: userData.email,
    phone: userData.phone || "",
    role: userData.role,
    kycStatus: userData.workerProfile?.kycStatus || "NONE",
    bio: userData.workerProfile?.bio || "",
    skills: userData.workerProfile?.skills || [],
    joinDate,
    rating,
    totalTasks,
    totalSpent
  };
  return (
    <PageTransition className="max-w-3xl mx-auto space-y-6">
      <AnimatedCard>
        <PageHeader title="Profil Saya" description="Kelola informasi akun dan preferensi Anda." />
      </AnimatedCard>

      {/* Profile Card */}
      <AnimatedCard>
        <Card className="border-border/50 overflow-hidden">
          {/* Banner */}
          <div className="h-28 sm:h-32 bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-700 relative">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Ccircle%20cx%3D%221%22%20cy%3D%221%22%20r%3D%221%22%20fill%3D%22rgba(255%2C255%2C255%2C0.05)%22%2F%3E%3C%2Fsvg%3E')] bg-repeat" />
          </div>

          <CardContent className="px-4 sm:px-6 pb-6">
            {/* Avatar */}
            <div className="relative -mt-12 sm:-mt-14 mb-4 flex items-end gap-4">
              <ProfileAvatar initials={initial} imageUrl={userData.image} />
              <div className="pb-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-bold">{formattedUser.name || formattedUser.email}</h2>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-lg bg-primary/10 text-primary">
                    {formattedUser.role}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Bergabung sejak {formattedUser.joinDate}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              <div className="rounded-xl bg-accent/50 p-3 sm:p-4 text-center">
                <div className="flex items-center justify-center gap-1 text-base sm:text-lg font-bold">
                  <IconStarFilled size={16} className="text-amber-400" />
                  {formattedUser.rating}
                </div>
                <div className="text-[10px] sm:text-xs text-muted-foreground mt-1">Rating</div>
              </div>
              <div className="rounded-xl bg-accent/50 p-3 sm:p-4 text-center">
                <div className="flex items-center justify-center gap-1 text-base sm:text-lg font-bold">
                  <IconBriefcase size={16} className="text-primary" />
                  {formattedUser.totalTasks}
                </div>
                <div className="text-[10px] sm:text-xs text-muted-foreground mt-1">Total Tugas</div>
              </div>
              <div className="rounded-xl bg-accent/50 p-3 sm:p-4 text-center">
                <div className="flex items-center justify-center gap-1 text-base sm:text-lg font-bold">
                  <IconCash size={16} className="text-emerald-400" />
                  <span className="truncate">{formattedUser.totalSpent}</span>
                </div>
                <div className="text-[10px] sm:text-xs text-muted-foreground mt-1">{isWorker ? "Pendapatan" : "Transaksi"}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </AnimatedCard>

      {/* Edit Form */}
      <AnimatedCard>
        <Card className="border-border/50">
          <CardContent className="p-4 sm:p-6 space-y-5">
            <h2 className="font-semibold flex items-center gap-2 mb-6">
              <IconEdit size={20} className="text-primary" />
              Pengaturan Profil
            </h2>

            <ProfileForm user={formattedUser} />

          </CardContent>
        </Card>
      </AnimatedCard>
    </PageTransition>
  );
}
