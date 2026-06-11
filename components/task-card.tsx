import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { CategoryBadge, UrgencyBadge, SkillTag } from "@/components/status-badge";
import {
  IconClock,
  IconStarFilled,
  IconCash,
  IconArrowRight,
  IconBookmark,
} from "@tabler/icons-react";

export interface TaskData {
  id: string;
  title: string;
  category: string;
  budget: string;
  deadline: string;
  urgency: "high" | "medium" | "low";
  bids: number;
  client: { name: string; rating: number };
  description: string;
  tags: string[];
}

interface TaskCardProps {
  task: TaskData;
  className?: string;
}

export function TaskCard({ task, className }: TaskCardProps) {
  return (
    <Link href={`/dashboard/tasks/${task.id}`}>
      <Card
        className={cn(
          "group border-border/50 bg-card hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300",
          className
        )}
      >
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            {/* Main content */}
            <div className="flex-1 min-w-0">
              {/* Tags row */}
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <CategoryBadge category={task.category} />
                <UrgencyBadge urgency={task.urgency} />
              </div>

              {/* Title */}
              <h3 className="font-semibold text-sm sm:text-base group-hover:text-primary transition-colors line-clamp-1">
                {task.title}
              </h3>

              {/* Description */}
              <p className="text-xs sm:text-sm text-muted-foreground mt-1.5 line-clamp-2">
                {task.description}
              </p>

              {/* Skill tags */}
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                {task.tags.map((tag) => (
                  <SkillTag key={tag} skill={tag} />
                ))}
              </div>
            </div>

            {/* Right side info */}
            <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-2 sm:text-right flex-shrink-0">
              <div className="text-base sm:text-lg font-bold text-primary">{task.budget}</div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <IconClock size={14} />
                {task.deadline}
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <IconStarFilled size={14} className="text-amber-400" />
                {task.client.rating} · {task.client.name}
              </div>
              <div className="text-xs text-muted-foreground">
                {task.bids} penawaran
              </div>
            </div>
          </div>

          {/* Bottom action bar */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <IconCash size={14} /> Budget Client
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => e.preventDefault()}
                className="p-1.5 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
              >
                <IconBookmark size={16} />
              </button>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary group-hover:gap-2 transition-all">
                Lihat Detail <IconArrowRight size={14} />
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
