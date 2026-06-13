"use client";

import { useEffect, useState } from "react";
import { IconBell, IconCheck, IconChecks } from "@tabler/icons-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { 
  getNotifications, 
  getUnreadNotificationCount, 
  markNotificationAsRead, 
  markAllNotificationsAsRead 
} from "@/lib/actions/notifications";
import { formatDistanceToNow } from "date-fns";
import { id } from "date-fns/locale";
import Link from "next/link";
import { cn } from "@/lib/utils";

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  isRead: boolean;
  link: string | null;
  createdAt: Date;
};

export function NotificationDropdown() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Smart polling: only when tab is visible, pause when hidden
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    async function loadCount() {
      if (document.hidden) return; // Skip if tab not visible
      try {
        const count = await getUnreadNotificationCount();
        setUnreadCount(count);
      } catch {}
    }

    function startPolling() {
      loadCount(); // Immediate check when becoming visible
      interval = setInterval(loadCount, 60_000); // Every 60s
    }

    function stopPolling() {
      if (interval) { clearInterval(interval); interval = null; }
    }

    function handleVisibility() {
      if (document.hidden) { stopPolling(); } else { startPolling(); }
    }

    startPolling();
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      stopPolling();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  // Load full notifications when popover opens
  useEffect(() => {
    if (!isOpen) return;
    async function loadNotifications() {
      setIsLoading(true);
      try {
        const [data, count] = await Promise.all([
          getNotifications(),
          getUnreadNotificationCount(),
        ]);
        setNotifications(data);
        setUnreadCount(count);
      } catch {}
      setIsLoading(false);
    }
    loadNotifications();
  }, [isOpen]);

  const handleMarkAsRead = async (id: string) => {
    await markNotificationAsRead(id);
    setNotifications((prev) => 
      prev.map((n) => n.id === id ? { ...n, isRead: true } : n)
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  const handleMarkAllAsRead = async () => {
    await markAllNotificationsAsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="relative p-2 rounded-lg hover:bg-accent transition-colors">
          <IconBell size={20} className="text-muted-foreground" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-background">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 sm:w-96 p-0" align="end">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h4 className="font-semibold text-sm">Notifikasi</h4>
          {unreadCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-auto px-2 py-1 text-xs text-primary hover:bg-primary/10"
              onClick={handleMarkAllAsRead}
            >
              <IconChecks size={14} className="mr-1" /> Tandai semua dibaca
            </Button>
          )}
        </div>
        
        <div className="max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col divide-y divide-border/50">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-start gap-3 p-4">
                  <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3.5 w-3/4" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-2.5 w-16" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length > 0 ? (
            <div className="flex flex-col divide-y divide-border/50">
              {notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={cn(
                    "flex items-start gap-3 p-4 transition-colors hover:bg-accent/50",
                    !notification.isRead && "bg-primary/5"
                  )}
                  onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                >
                  <div className="mt-1 flex-shrink-0">
                    <div className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full",
                      notification.isRead ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary"
                    )}>
                      <IconBell size={16} />
                    </div>
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn("text-sm font-medium leading-none", !notification.isRead && "text-foreground")}>
                        {notification.link ? (
                          <Link href={notification.link} className="hover:underline">
                            {notification.title}
                          </Link>
                        ) : (
                          notification.title
                        )}
                      </p>
                      {!notification.isRead && (
                        <span className="flex h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-0.5" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {notification.message}
                    </p>
                    <p className="text-[10px] text-muted-foreground/80 pt-1">
                      {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true, locale: id })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center flex flex-col items-center justify-center text-muted-foreground">
              <div className="bg-accent h-12 w-12 rounded-full flex items-center justify-center mb-3">
                <IconCheck size={24} className="text-muted-foreground/50" />
              </div>
              <p className="text-sm font-medium">Belum ada notifikasi</p>
              <p className="text-xs mt-1">Saat ini Anda tidak memiliki notifikasi baru.</p>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
