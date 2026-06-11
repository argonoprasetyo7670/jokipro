import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

type StatusType = "OPEN" | "IN_PROGRESS" | "REVIEW" | "IN_REVIEW" | "COMPLETED" | "DISPUTE" | "IN_DISPUTE" | "CANCELLED" | string;
type UrgencyType = "HIGH" | "MEDIUM" | "LOW" | string;
const statusConfig: Record<string, { label: string; className: string }> = {
  OPEN: { label: "Terbuka", className: "bg-violet-500/10 text-violet-400 border-violet-500/20 hover:bg-violet-500/10" },
  IN_PROGRESS: { label: "Dikerjakan", className: "bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/10" },
  REVIEW: { label: "Review", className: "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/10" },
  IN_REVIEW: { label: "Review", className: "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/10" },
  COMPLETED: { label: "Selesai", className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/10" },
  DISPUTE: { label: "Sengketa", className: "bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/10" },
  IN_DISPUTE: { label: "Sengketa", className: "bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/10" },
  CANCELLED: { label: "Dibatalkan", className: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20 hover:bg-zinc-500/10" },
};

const urgencyConfig: Record<UrgencyType, { label: string; className: string }> = {
  high: { label: "Urgent", className: "bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/10" },
  medium: { label: "Normal", className: "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/10" },
  low: { label: "Santai", className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/10" },
};

interface StatusBadgeProps {
  status: StatusType;
  icon?: React.ReactNode;
  className?: string;
}

export function StatusBadge({ status, icon, className }: StatusBadgeProps) {
  const config = statusConfig[status] || { label: status, className: "bg-gray-500/10 text-gray-400 border-gray-500/20" };
  return (
    <Badge variant="outline" className={cn("text-[11px] font-semibold gap-1", config.className, className)}>
      {icon}
      {config.label}
    </Badge>
  );
}

interface UrgencyBadgeProps {
  urgency: UrgencyType;
  className?: string;
}

export function UrgencyBadge({ urgency, className }: UrgencyBadgeProps) {
  const config = urgencyConfig[urgency];
  return (
    <Badge variant="outline" className={cn("text-[11px] font-semibold", config.className, className)}>
      {config.label}
    </Badge>
  );
}

interface CategoryBadgeProps {
  category: string;
  className?: string;
}

export function CategoryBadge({ category, className }: CategoryBadgeProps) {
  return (
    <Badge className={cn("text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 border-0", className)}>
      {category}
    </Badge>
  );
}

interface SkillTagProps {
  skill: string;
  className?: string;
}

export function SkillTag({ skill, className }: SkillTagProps) {
  return (
    <span className={cn("text-[11px] px-2 py-1 rounded-md bg-accent text-accent-foreground font-medium", className)}>
      {skill}
    </span>
  );
}
