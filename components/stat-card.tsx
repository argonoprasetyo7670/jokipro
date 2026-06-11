import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { IconArrowUpRight } from "@tabler/icons-react";

interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  icon: React.ElementType;
  gradient: string;
  className?: string;
  onClick?: () => void;
}

export function StatCard({ label, value, change, icon: Icon, gradient, className, onClick }: StatCardProps) {
  return (
    <Card 
      onClick={onClick}
      className={cn(
        "group border-border/50 bg-card hover:border-primary/20 transition-all duration-300", 
        onClick ? "cursor-pointer hover:-translate-y-1 hover:shadow-md" : "",
        className
      )}
    >
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div
            className={cn(
              "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white",
              gradient
            )}
          >
            <Icon size={20} />
          </div>
          <IconArrowUpRight
            size={16}
            className="text-muted-foreground group-hover:text-primary transition-colors"
          />
        </div>
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-xs text-muted-foreground mt-1">{label}</div>
        {change && <div className="text-xs text-emerald-400 mt-2">{change}</div>}
      </CardContent>
    </Card>
  );
}
