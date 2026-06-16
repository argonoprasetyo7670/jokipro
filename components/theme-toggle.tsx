"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { IconSun, IconMoon } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  size?: "sm" | "default";
}

export function ThemeToggle({ className, size = "default" }: ThemeToggleProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "rounded-xl border-border/50",
          size === "sm" ? "h-8 w-8" : "h-10 w-10",
          className
        )}
      >
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={cn(
        "rounded-xl border-border/50 transition-all hover:scale-105",
        size === "sm" ? "h-8 w-8" : "h-10 w-10",
        className
      )}
    >
      {theme === "dark" ? (
        <IconSun size={size === "sm" ? 16 : 18} className="text-amber-400" />
      ) : (
        <IconMoon size={size === "sm" ? 16 : 18} className="text-secondary" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
