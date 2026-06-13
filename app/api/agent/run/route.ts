// =============================================
// AI Agent Worker — API Route: Run Agent Cycle
// =============================================

import { NextRequest, NextResponse } from "next/server";
import { runAgentCycle } from "@/lib/agent/orchestrator";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

/**
 * POST /api/agent/run
 * 
 * Trigger a multi-agent cycle. Can be called by:
 * 1. Admin manually from dashboard
 * 2. Internal event trigger (task creation)
 * 3. External cron job with secret key
 */
export async function POST(request: NextRequest) {
  const cronSecret = request.headers.get("x-cron-secret");
  const isValidCron = cronSecret === process.env.AGENT_CRON_SECRET;

  if (!isValidCron) {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
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
