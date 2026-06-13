"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  IconRobot,
  IconBolt,
  IconCoin,
  IconCheck,
  IconX,
  IconPlayerPlay,
  IconClock,
  IconBrain,
  IconChartBar,
  IconCode,
  IconPencil,
  IconChartDots,
} from "@tabler/icons-react";
import { approveAgentDraft, rejectAgentDraft } from "@/lib/actions/agent";
import { toast } from "sonner";

interface AgentProfileInfo {
  key: string;
  name: string;
  email: string;
  bio: string;
  specializations: string[];
  skills: string[];
  pricing: Record<string, number>;
  university: string;
  major: string;
}

interface Props {
  stats: {
    totalLogs: number;
    totalCost: number;
    totalTokens: number;
    successCount: number;
    failedCount: number;
    successRate: number;
  };
  recentLogs: any[];
  pendingDrafts: number;
  drafts: any[];
  agentProfiles: AgentProfileInfo[];
  globalConfig: {
    maxConcurrentTasksPerAgent: number;
    autoBid: boolean;
    autoSubmit: boolean;
    autoRevise: boolean;
    llmModel: string;
  };
}

const agentIcons: Record<string, any> = {
  coding: IconCode,
  writing: IconPencil,
  data: IconChartDots,
};

const agentColors: Record<string, string> = {
  coding: "text-blue-500 bg-blue-500/10",
  writing: "text-emerald-500 bg-emerald-500/10",
  data: "text-amber-500 bg-amber-500/10",
};

export function AgentDashboardClient({
  stats,
  recentLogs,
  pendingDrafts,
  drafts,
  agentProfiles,
  globalConfig,
}: Props) {
  const [isRunning, setIsRunning] = useState(false);
  const [draftList, setDraftList] = useState(drafts);

  async function handleRunAgent() {
    setIsRunning(true);
    try {
      const res = await fetch("/api/agent/run", { method: "POST" });
      const data = await res.json();
      if (data.success) {
        toast.success("Multi-Agent cycle selesai!", {
          description: `Scanned: ${data.result.summary.scanned} | Bid: ${data.result.summary.bidded} | Executed: ${data.result.summary.executed}`,
        });
        window.location.reload();
      } else {
        toast.error("Agent gagal", { description: data.error });
      }
    } catch {
      toast.error("Gagal menjalankan agent");
    }
    setIsRunning(false);
  }

  async function handleApprove(draftId: string) {
    try {
      await approveAgentDraft(draftId);
      setDraftList((prev) => prev.filter((d) => d.id !== draftId));
      toast.success("Draft disetujui dan dieksekusi!");
    } catch (err: any) {
      toast.error(err.message || "Gagal menyetujui draft");
    }
  }

  async function handleReject(draftId: string) {
    const note = prompt("Catatan penolakan:");
    if (!note) return;
    try {
      await rejectAgentDraft(draftId, note);
      setDraftList((prev) => prev.filter((d) => d.id !== draftId));
      toast.success("Draft ditolak");
    } catch (err: any) {
      toast.error(err.message || "Gagal menolak draft");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <IconRobot className="text-primary" /> Multi-Agent System
          </h1>
          <p className="text-muted-foreground mt-1">
            {agentProfiles.length} agent terspesialisasi aktif
          </p>
        </div>
        <Button onClick={handleRunAgent} disabled={isRunning} className="gap-2">
          <IconPlayerPlay size={18} />
          {isRunning ? "Menjalankan..." : "Run All Agents"}
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <IconChartBar className="text-primary" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.totalLogs}</p>
                <p className="text-xs text-muted-foreground">Total Actions</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                <IconCheck className="text-green-500" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.successRate.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">Success Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <IconBrain className="text-amber-500" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{(stats.totalTokens / 1000).toFixed(1)}K</p>
                <p className="text-xs text-muted-foreground">Tokens Used</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-violet-500/10 flex items-center justify-center">
                <IconCoin className="text-violet-500" size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">${stats.totalCost.toFixed(4)}</p>
                <p className="text-xs text-muted-foreground">LLM Cost</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Agent Profiles */}
      <div>
        <h2 className="text-lg font-semibold mb-3">🤖 Agent Terspesialisasi</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {agentProfiles.map((agent) => {
            const Icon = agentIcons[agent.key] || IconRobot;
            const colorClass = agentColors[agent.key] || "text-gray-500 bg-gray-500/10";
            const [textColor, bgColor] = colorClass.split(" ");

            return (
              <Card key={agent.key} className="relative overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl ${bgColor} flex items-center justify-center`}>
                      <Icon className={textColor} size={24} />
                    </div>
                    <div>
                      <CardTitle className="text-base">{agent.name}</CardTitle>
                      <CardDescription className="text-xs">{agent.university} — {agent.major}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p className="text-xs text-muted-foreground line-clamp-2">{agent.bio}</p>
                  <div>
                    <p className="text-xs font-medium mb-1.5">Spesialisasi:</p>
                    <div className="flex flex-wrap gap-1">
                      {agent.specializations.map((s) => (
                        <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="border-t pt-2">
                    <p className="text-xs font-medium mb-1">Pricing:</p>
                    {Object.entries(agent.pricing).map(([cat, price]) => (
                      <div key={cat} className="flex justify-between text-xs">
                        <span className="text-muted-foreground">{cat}</span>
                        <span className="font-medium">Rp {new Intl.NumberFormat("id-ID").format(price)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Global Config + Pending Drafts */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <IconBolt size={18} /> Konfigurasi Global
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Model LLM</span>
              <Badge variant="secondary">{globalConfig.llmModel}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Max Concurrent / Agent</span>
              <span className="font-medium">{globalConfig.maxConcurrentTasksPerAgent}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Auto Bid</span>
              <Badge variant={globalConfig.autoBid ? "default" : "secondary"}>{globalConfig.autoBid ? "ON" : "OFF"}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Auto Submit</span>
              <Badge variant={globalConfig.autoSubmit ? "default" : "secondary"}>{globalConfig.autoSubmit ? "ON" : "OFF"}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Auto Revisi</span>
              <Badge variant={globalConfig.autoRevise ? "default" : "secondary"}>{globalConfig.autoRevise ? "ON" : "OFF"}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <IconClock size={18} /> Draft Menunggu Review
              {pendingDrafts > 0 && <Badge className="ml-auto">{pendingDrafts}</Badge>}
            </CardTitle>
            <CardDescription>Draft bid & hasil yang perlu di-approve admin</CardDescription>
          </CardHeader>
          <CardContent>
            {draftList.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">Tidak ada draft menunggu review 🎉</p>
            ) : (
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {draftList.map((draft) => {
                  const agentKey = (draft.analysis as any)?.agentKey;
                  const agentName = (draft.analysis as any)?.agentName;
                  return (
                    <div key={draft.id} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Badge variant={draft.type === "BID" ? "default" : "secondary"}>
                            {draft.type === "BID" ? "📝 Bid" : "📦 Hasil"}
                          </Badge>
                          {agentName && (
                            <span className="text-xs text-muted-foreground">oleh {agentName}</span>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(draft.createdAt).toLocaleString("id-ID")}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-3">
                        {draft.content.substring(0, 200)}...
                      </p>
                      <div className="flex gap-2">
                        <Button size="sm" className="gap-1" onClick={() => handleApprove(draft.id)}>
                          <IconCheck size={14} /> Approve
                        </Button>
                        <Button size="sm" variant="outline" className="gap-1" onClick={() => handleReject(draft.id)}>
                          <IconX size={14} /> Reject
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">📋 Recent Agent Logs</CardTitle>
          <CardDescription>30 aktivitas terakhir dari semua agent</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground">Waktu</th>
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground">Action</th>
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-2 px-2 font-medium text-muted-foreground">Details</th>
                  <th className="text-right py-2 px-2 font-medium text-muted-foreground">Tokens</th>
                  <th className="text-right py-2 px-2 font-medium text-muted-foreground">Cost</th>
                </tr>
              </thead>
              <tbody>
                {recentLogs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-8 text-muted-foreground">
                      Belum ada aktivitas agent
                    </td>
                  </tr>
                ) : (
                  recentLogs.map((log) => (
                    <tr key={log.id} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="py-2 px-2 text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" })}
                      </td>
                      <td className="py-2 px-2">
                        <Badge variant="outline" className="text-xs">{log.action}</Badge>
                      </td>
                      <td className="py-2 px-2">
                        <Badge
                          variant={log.status === "SUCCESS" ? "default" : log.status === "FAILED" ? "destructive" : "secondary"}
                          className="text-xs"
                        >
                          {log.status}
                        </Badge>
                      </td>
                      <td className="py-2 px-2 text-xs max-w-xs truncate">{log.details}</td>
                      <td className="py-2 px-2 text-xs text-right">
                        {log.tokens ? `${(log.tokens / 1000).toFixed(1)}K` : "—"}
                      </td>
                      <td className="py-2 px-2 text-xs text-right">
                        {log.cost ? `$${log.cost.toFixed(4)}` : "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
