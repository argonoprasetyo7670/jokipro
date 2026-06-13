import { prisma } from "@/lib/prisma";
import { IconSearch, IconFilter } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/page-header";
import { TaskCard } from "@/components/task-card";
import { TaskFilters } from "@/components/dashboard/task-filters";
import { PageTransition, AnimatedCard } from "@/components/motion";
import { formatRupiah, formatDateMediumWIB } from "@/lib/utils";

const categories = ["Semua", "Programming", "Penulisan", "Desain", "Tugas Kuliah", "Presentasi", "Data Entry"];

export default async function TasksPage({ searchParams }: { searchParams: Promise<{ q?: string, cat?: string }> }) {
  const params = await searchParams;
  const query = params.q || "";
  const category = params.cat || "";

  const whereClause: any = { status: "OPEN" };

  if (query) {
    whereClause.OR = [
      { title: { contains: query, mode: "insensitive" } },
      { description: { contains: query, mode: "insensitive" } },
    ];
  }

  if (category && category !== "Semua") {
    whereClause.category = category;
  }

  const dbTasks = await prisma.task.findMany({
    where: whereClause,
    include: {
      client: {
        include: { workerProfile: true }
      },
      _count: {
        select: { bids: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  const tasks = dbTasks.map(t => ({
    id: t.id,
    title: t.title,
    category: t.category,
    budget: formatRupiah(t.budget),
    deadline: formatDateMediumWIB(t.deadline),
    urgency: "medium" as const, // can be calculated based on deadline proximity
    bids: t._count.bids,
    client: { 
      id: t.client.id,
      name: t.client.name || t.client.email || "Unknown", 
      rating: 5.0 // assuming default 5.0 for clients for now
    },
    description: t.description,
    tags: [t.category], // we don't have tags in schema, use category
  }));

  return (
    <PageTransition className="space-y-6">
      <AnimatedCard>
        <PageHeader
          title="Cari Tugas"
          description="Temukan tugas yang cocok dengan keahlian Anda."
        />
      </AnimatedCard>

      {/* Search & Category Filters Component */}
      <TaskFilters />

      {/* Task Cards */}
      <div className="grid gap-4">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <AnimatedCard key={task.id}>
              <TaskCard task={task as any} />
            </AnimatedCard>
          ))
        ) : (
          <div className="text-center py-12 border-2 border-dashed rounded-xl text-muted-foreground">
            Belum ada tugas yang tersedia saat ini.
          </div>
        )}
      </div>
    </PageTransition>
  );
}
