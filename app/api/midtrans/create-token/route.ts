import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { createSnapTransaction, generateMidtransOrderId } from "@/lib/midtrans";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "CLIENT") {
      return NextResponse.json(
        { error: "Hanya Client yang dapat melakukan pembayaran" },
        { status: 403 }
      );
    }

    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json(
        { error: "Order ID wajib diisi" },
        { status: 400 }
      );
    }

    // Fetch order with validation
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        task: { select: { title: true } },
        client: { select: { name: true, email: true } },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Pesanan tidak ditemukan" },
        { status: 404 }
      );
    }

    if (order.clientId !== session.user.id) {
      return NextResponse.json(
        { error: "Anda tidak memiliki akses ke pesanan ini" },
        { status: 403 }
      );
    }

    if (order.status !== "PENDING_PAYMENT") {
      return NextResponse.json(
        { error: "Pesanan ini sudah dibayar atau tidak memerlukan pembayaran" },
        { status: 400 }
      );
    }

    // If snap token already exists and hasn't expired, reuse it
    if (order.snapToken) {
      return NextResponse.json({ token: order.snapToken });
    }

    // Generate unique Midtrans order ID
    const midtransId = generateMidtransOrderId(order.id);

    // Create Snap transaction
    const { token } = await createSnapTransaction({
      midtransOrderId: midtransId,
      amount: order.amount,
      clientName: order.client.name || "Client",
      clientEmail: order.client.email,
      taskTitle: order.task.title,
    });

    // Save midtransId and snapToken to database
    await prisma.order.update({
      where: { id: orderId },
      data: {
        midtransId,
        snapToken: token,
      },
    });

    return NextResponse.json({ token });
  } catch (error: any) {
    console.error("[MIDTRANS_CREATE_TOKEN]", error);
    return NextResponse.json(
      { error: error.message || "Gagal membuat token pembayaran" },
      { status: 500 }
    );
  }
}
