"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EditUserDialog } from "@/components/admin/edit-user-dialog";
import { DeleteUserDialog } from "@/components/admin/delete-user-dialog";
import { CreateUserDialog } from "@/components/admin/create-user-dialog";
import { formatDateWIB } from "@/lib/utils";
import {
  IconSearch,
  IconShieldCheck,
  IconUser,
  IconBriefcase,
  IconUsers,
} from "@tabler/icons-react";

interface UserWithProfile {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  phone: string | null;
  createdAt: Date;
  workerProfile: {
    id: string;
    kycStatus: string;
    university: string | null;
    major: string | null;
  } | null;
  clientProfile: {
    id: string;
    companyName: string | null;
  } | null;
}

const ROLE_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; icon: React.ReactNode }
> = {
  ADMIN: {
    label: "Admin",
    color: "text-violet-700 dark:text-violet-400",
    bg: "bg-violet-100 dark:bg-violet-950/50",
    icon: <IconShieldCheck size={12} />,
  },
  CLIENT: {
    label: "Client",
    color: "text-blue-700 dark:text-blue-400",
    bg: "bg-blue-100 dark:bg-blue-950/50",
    icon: <IconUser size={12} />,
  },
  WORKER: {
    label: "Worker",
    color: "text-emerald-700 dark:text-emerald-400",
    bg: "bg-emerald-100 dark:bg-emerald-950/50",
    icon: <IconBriefcase size={12} />,
  },
};

const KYC_CONFIG: Record<string, { label: string; color: string; bg: string }> =
  {
    PENDING: {
      label: "Pending",
      color: "text-amber-700 dark:text-amber-400",
      bg: "bg-amber-100 dark:bg-amber-950/50",
    },
    APPROVED: {
      label: "Verified",
      color: "text-emerald-700 dark:text-emerald-400",
      bg: "bg-emerald-100 dark:bg-emerald-950/50",
    },
    REJECTED: {
      label: "Ditolak",
      color: "text-red-700 dark:text-red-400",
      bg: "bg-red-100 dark:bg-red-950/50",
    },
  };

export function UserTable({ users }: { users: UserWithProfile[] }) {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      !search ||
      user.name?.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());

    const matchesRole = roleFilter === "ALL" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const roleCounts = {
    ALL: users.length,
    ADMIN: users.filter((u) => u.role === "ADMIN").length,
    CLIENT: users.filter((u) => u.role === "CLIENT").length,
    WORKER: users.filter((u) => u.role === "WORKER").length,
  };

  return (
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <IconUsers size={20} className="text-violet-500" />
              Semua Pengguna
            </h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Total {users.length} pengguna terdaftar di platform.
            </p>
          </div>
          <CreateUserDialog />
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <div className="relative flex-1 max-w-sm">
            <IconSearch
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id="user-search"
              placeholder="Cari nama atau email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 rounded-xl"
            />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger
              id="role-filter"
              className="w-[180px] h-9 rounded-xl"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">
                Semua Role ({roleCounts.ALL})
              </SelectItem>
              <SelectItem value="ADMIN">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-violet-500" />
                  Admin ({roleCounts.ADMIN})
                </span>
              </SelectItem>
              <SelectItem value="CLIENT">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  Client ({roleCounts.CLIENT})
                </span>
              </SelectItem>
              <SelectItem value="WORKER">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  Worker ({roleCounts.WORKER})
                </span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      {filteredUsers.length === 0 ? (
        <div className="p-12 text-center flex flex-col items-center justify-center text-muted-foreground">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <IconSearch size={24} />
          </div>
          <p className="font-medium text-foreground">
            Tidak ada pengguna ditemukan
          </p>
          <p className="text-sm mt-1">
            {search
              ? `Tidak ditemukan hasil untuk "${search}"`
              : "Belum ada pengguna terdaftar."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground bg-muted/50 uppercase">
              <tr>
                <th className="px-6 py-4 font-medium">Pengguna</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Detail</th>
                <th className="px-6 py-4 font-medium">Terdaftar</th>
                <th className="px-6 py-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((user) => {
                const roleConfig = ROLE_CONFIG[user.role] || ROLE_CONFIG.CLIENT;
                const kycStatus = user.workerProfile?.kycStatus;
                const kycConfig = kycStatus ? KYC_CONFIG[kycStatus] : null;

                return (
                  <tr
                    key={user.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    {/* User info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full overflow-hidden bg-muted/50 shrink-0 flex items-center justify-center">
                          {user.image ? (
                            <img
                              src={user.image}
                              alt={user.name || "User"}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-xs font-bold text-muted-foreground">
                              {user.name?.charAt(0)?.toUpperCase() || "U"}
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-foreground">
                            {user.name || "Tanpa Nama"}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role badge */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${roleConfig.bg} ${roleConfig.color}`}
                      >
                        {roleConfig.icon}
                        {roleConfig.label}
                      </span>
                    </td>

                    {/* Detail */}
                    <td className="px-6 py-4">
                      {user.role === "WORKER" && kycConfig ? (
                        <div className="space-y-1">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${kycConfig.bg} ${kycConfig.color}`}
                          >
                            KYC: {kycConfig.label}
                          </span>
                          {user.workerProfile?.university && (
                            <div className="text-xs text-muted-foreground">
                              {user.workerProfile.university}
                            </div>
                          )}
                        </div>
                      ) : user.role === "CLIENT" &&
                        user.clientProfile?.companyName ? (
                        <div className="text-xs text-muted-foreground">
                          {user.clientProfile.companyName}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-muted-foreground text-xs">
                      {formatDateWIB(user.createdAt)}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <EditUserDialog user={user} />
                        <DeleteUserDialog user={user} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer */}
      {filteredUsers.length > 0 && (
        <div className="px-6 py-3 border-t bg-muted/20 text-xs text-muted-foreground">
          Menampilkan {filteredUsers.length} dari {users.length} pengguna
        </div>
      )}
    </div>
  );
}
