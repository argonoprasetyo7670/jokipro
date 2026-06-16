// =============================================
// AI Agent Worker — API Route: Run Agent Cycle
// =============================================

import { NextResponse } from "next/server";
import { runAgentCycle } from "@/lib/agent/orchestrator";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

/**
 * POST /api/agent/run
 * 
 * Admin-only manual trigger to run a full agent cycle.
 * Used from the admin dashboard to process pending orders,
 * revisions, and any missed tasks.
 * 
 * Note: Normal task bidding is event-driven — triggered
 * automatically when a client creates a new task.
 */
export async function POST() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runAgentCycle();

    // Revalidate pages so client sees new bids/notifications immediately
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/tasks");
    revalidatePath("/dashboard/orders");

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("[Agent API] Cycle failed:", error);
    return NextResponse.json(
      { error: "Agent cycle failed", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
