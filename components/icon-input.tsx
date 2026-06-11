import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { forwardRef } from "react";

interface IconInputProps extends React.ComponentProps<typeof Input> {
  icon: React.ElementType;
  iconSize?: number;
  rightIcon?: React.ElementType;
  onRightIconClick?: () => void;
}

export const IconInput = forwardRef<HTMLInputElement, IconInputProps>(
  ({ icon: Icon, iconSize = 18, rightIcon: RightIcon, onRightIconClick, className, ...props }, ref) => {
    return (
      <div className="relative">
        <Icon
          size={iconSize}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
        <Input
          ref={ref}
          className={cn("pl-11 rounded-xl h-12 bg-card", RightIcon && "pr-11", className)}
          {...props}
        />
        {RightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <RightIcon size={iconSize} />
          </button>
        )}
      </div>
    );
  }
);
IconInput.displayName = "IconInput";
