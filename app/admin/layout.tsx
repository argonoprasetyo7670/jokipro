"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconUsers,
  IconLayoutDashboard,
  IconShieldCheck,
  IconArrowLeft,
} from "@tabler/icons-react";
import { ThemeToggle } from "@/components/theme-toggle";

const adminNav = [
  { href: "/admin", label: "Overview", icon: IconLayoutDashboard },
  { href: "/admin/workers", label: "Verifikasi Worker", icon: IconShieldCheck },
  { href: "/admin/users", label: "Semua User", icon: IconUsers },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 bg-sidebar border-r border-sidebar-border flex-col">
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-sidebar-border">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-lg font-bold tracking-tight">
              Admin<span className="text-rose-500">Panel</span>
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {adminNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-rose-500 text-white shadow-lg shadow-rose-500/25"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent"
                }`}
              >
                <item.icon size={20} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Back to app */}
        <div className="p-3 border-t border-sidebar-border">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-sidebar-accent transition-colors"
          >
            <IconArrowLeft size={20} />
            Kembali ke App
          </Link>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 border-b border-border bg-background/80 backdrop-blur-xl flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
          <h1 className="text-lg font-semibold">Admin Panel</h1>
          <ThemeToggle size="sm" />
        </header>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
