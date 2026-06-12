import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  name: string;
  image?: string | null;
  gradient?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
  xl: "h-24 w-24 text-3xl",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function UserAvatar({
  name,
  image,
  gradient = "from-violet-500 to-indigo-600",
  size = "md",
  className,
}: UserAvatarProps) {
  return (
    <Avatar className={cn(sizeClasses[size], className)}>
      {image && <AvatarImage src={image} alt={name} />}
      <AvatarFallback
        className={cn(
          "bg-gradient-to-br text-white font-bold border-0",
          gradient,
          sizeClasses[size]
        )}
      >
        {getInitials(name)}
      </AvatarFallback>
    </Avatar>
  );
}
