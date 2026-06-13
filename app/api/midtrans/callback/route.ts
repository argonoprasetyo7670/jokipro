import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifySignature } from "@/lib/midtrans";

/**
 * Midtrans Webhook Notification Handler
 * 
 * Supports 2 modes:
 * 1. Direct dari Midtrans → verifikasi signature SHA512
 * 2. Via JennaBot proxy   → verifikasi header `x-webhook-secret`
 * 
 * Flow: EduTasky → Midtrans → JennaBot → EduTasky (this endpoint)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
    } = body;

    // --- AUTH: Verify request source ---
    const webhookSecret = req.headers.get("x-webhook-secret");
    const expectedSecret = process.env.WEBHOOK_SECRET;

    if (webhookSecret && expectedSecret) {
      // Mode 2: Via JennaBot — verify secret header
      if (webhookSecret !== expectedSecret) {
        console.error("[MIDTRANS_CALLBACK] Invalid webhook secret");
        return NextResponse.json(
          { error: "Invalid webhook secret" },
          { status: 403 }
        );
      }
      // Secret valid — proceed without Midtrans signature check
    } else if (signature_key) {
      // Mode 1: Direct dari Midtrans — verify SHA512 signature
      if (!verifySignature(order_id, status_code, gross_amount, signature_key)) {
        console.error("[MIDTRANS_CALLBACK] Invalid Midtrans signature for order:", order_id);
        return NextResponse.json(
          { error: "Invalid signature" },
          { status: 403 }
        );
      }
    } else {
      // No auth method provided
      console.error("[MIDTRANS_CALLBACK] No authentication provided");
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Find order by midtransId
    const order = await prisma.order.findUnique({
      where: { midtransId: order_id },
      include: {
        task: { select: { id: true, title: true, status: true } },
      },
    });

    if (!order) {
      console.error("[MIDTRANS_CALLBACK] Order not found:", order_id);
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Process based on transaction status
    if (
      transaction_status === "capture" ||
      transaction_status === "settlement"
    ) {
      // For capture, check fraud status
      if (transaction_status === "capture" && fraud_status !== "accept") {
        console.warn("[MIDTRANS_CALLBACK] Fraud detected:", order_id);
        return NextResponse.json({ status: "fraud_detected" });
      }

      // Payment successful → ESCROW_HOLD
      if (order.status === "PENDING_PAYMENT") {
        await prisma.$transaction(async (tx) => {
          // Update order to ESCROW_HOLD
          await tx.order.update({
            where: { id: order.id },
            data: {
              status: "ESCROW_HOLD",
              paidAt: new Date(),
            },
          });

          // Update task to IN_PROGRESS (worker can start working)
          if (order.task.status !== "IN_PROGRESS") {
            await tx.task.update({
              where: { id: order.task.id },
              data: { status: "IN_PROGRESS" },
            });
          }

          // Notify worker: payment received, start working
          await tx.notification.create({
            data: {
              userId: order.workerId,
              title: "Pembayaran Diterima! 💰",
              message: `Client telah melakukan pembayaran untuk tugas "${order.task.title}". Silakan mulai mengerjakan tugas.`,
              link: `/dashboard/orders/${order.id}`,
            },
          });

          // Notify client: payment confirmed
          await tx.notification.create({
            data: {
              userId: order.clientId,
              title: "Pembayaran Berhasil ✅",
              message: `Pembayaran Anda untuk tugas "${order.task.title}" telah dikonfirmasi. Worker akan segera mulai mengerjakan tugas.`,
              link: `/dashboard/orders/${order.id}`,
            },
          });
        });
      }
    } else if (
      transaction_status === "cancel" ||
      transaction_status === "deny" ||
      transaction_status === "expire"
    ) {
      // Payment failed/expired — reset snap token so client can retry
      if (order.status === "PENDING_PAYMENT") {
        await prisma.order.update({
          where: { id: order.id },
          data: {
            snapToken: null,
            midtransId: null,
          },
        });
      }
    } else if (transaction_status === "refund" || transaction_status === "partial_refund") {
      // Refund
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "REFUNDED" },
      });
    }

    // Return 200 OK
    return NextResponse.json({ status: "ok" });
  } catch (error: any) {
    console.error("[MIDTRANS_CALLBACK] Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
