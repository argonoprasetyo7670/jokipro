"use client"

import * as React from "react"
import type { Session } from "next-auth"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import { NavUser } from "@/components/nav-user"
import {
  IconLayoutDashboard,
  IconListSearch,
  IconPlus,
  IconPackage,
  IconUsers,
  IconAlertCircle,
  IconUser,
  IconRobot
} from "@tabler/icons-react"
import Image from "next/image"

type NavItem = { title: string; url: string; icon: React.ElementType }

const adminNav: NavItem[] = [
  { url: "/dashboard", title: "Overview", icon: IconLayoutDashboard },
  { url: "/dashboard/users", title: "Kelola Pengguna", icon: IconUsers },
  { url: "/dashboard/tasks", title: "Kelola Tugas", icon: IconListSearch },
  { url: "/dashboard/disputes", title: "Dispute", icon: IconAlertCircle },
  { url: "/dashboard/admin-keren/agent", title: "AI Agent", icon: IconRobot },
]

const clientNav: NavItem[] = [
  { url: "/dashboard", title: "Overview", icon: IconLayoutDashboard },
  { url: "/dashboard/my-tasks", title: "Tugas Saya", icon: IconListSearch },
  { url: "/dashboard/orders", title: "Pesanan Saya", icon: IconPackage },
  { url: "/dashboard/workers", title: "Cari Worker", icon: IconUsers },
  { url: "/dashboard/profile", title: "Profil", icon: IconUser },
]

const workerNav: NavItem[] = [
  { url: "/dashboard", title: "Overview", icon: IconLayoutDashboard },
  { url: "/dashboard/tasks", title: "Cari Tugas", icon: IconListSearch },
  { url: "/dashboard/orders", title: "Pesanan Saya", icon: IconPackage },
  { url: "/dashboard/profile", title: "Profil", icon: IconUser },
]

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  session: Session | null;
}

export function AppSidebar({ session, ...props }: AppSidebarProps) {
  const pathname = usePathname()
  const { setOpenMobile, isMobile } = useSidebar()

  const userRole = session?.user?.role || "CLIENT"
  const navItems = userRole === "ADMIN" ? adminNav : userRole === "WORKER" ? workerNav : clientNav

  const userData = {
    name: session?.user?.name || "Guest",
    email: session?.user?.email || "",
    avatar: session?.user?.image || "",
    role: userRole,
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="border-sidebar-border pt-4 pb-0">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="hover:bg-transparent active:bg-transparent">
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center">
                  <Image src="/logo.png" alt="EduTasky Logo" width={32} height={32} className="object-contain drop-shadow-md" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="text-xl font-bold tracking-tight">
                    Edu<span className="text-sidebar-primary">Tasky</span>
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-2 pt-4">
        <SidebarMenu>
          {navItems.map((item) => {
            const isActive = pathname === item.url;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  isActive={isActive}
                  className="rounded-lg transition-colors"
                >
                  <Link href={item.url} onClick={() => { if (isMobile) setOpenMobile(false) }}>
                    <item.icon className="shrink-0 size-5" />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
