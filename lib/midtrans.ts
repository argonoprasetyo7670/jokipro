import crypto from "crypto";

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY || "";
const MIDTRANS_CLIENT_KEY = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "";
const IS_PRODUCTION = process.env.MIDTRANS_IS_PRODUCTION === "true";

const SNAP_BASE_URL = IS_PRODUCTION
  ? "https://app.midtrans.com/snap/v1"
  : "https://app.sandbox.midtrans.com/snap/v1";

/**
 * Generate unique Midtrans order ID
 * Format: EDT-{shortOrderId}-{timestamp}
 */
export function generateMidtransOrderId(orderId: string): string {
  const shortId = orderId.slice(0, 8);
  const timestamp = Date.now();
  return `EDTKSY-${shortId}-${timestamp}`;
}

/**
 * Create Midtrans Snap transaction and get the token
 * Uses direct HTTP fetch instead of midtrans-client npm package
 */
export async function createSnapTransaction(params: {
  midtransOrderId: string;
  amount: number;
  clientName: string;
  clientEmail: string;
  taskTitle: string;
}): Promise<{ token: string; redirect_url: string }> {
  const { midtransOrderId, amount, clientName, clientEmail, taskTitle } = params;

  const payload = {
    transaction_details: {
      order_id: midtransOrderId,
      gross_amount: Math.round(amount), // Midtrans requires integer
    },
    item_details: [
      {
        id: midtransOrderId,
        price: Math.round(amount),
        quantity: 1,
        name: taskTitle.length > 50 ? taskTitle.slice(0, 47) + "..." : taskTitle,
      },
    ],
    customer_details: {
      first_name: clientName,
      email: clientEmail,
    },
    callbacks: {
      finish: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard/orders`,
    },
  };

  // Base64 encode server key for Basic auth
  const authString = Buffer.from(`${MIDTRANS_SERVER_KEY}:`).toString("base64");

  const response = await fetch(`${SNAP_BASE_URL}/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Basic ${authString}`,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error("[MIDTRANS] Snap API Error:", errorData);
    throw new Error(`Midtrans API Error: ${response.status}`);
  }

  const data = await response.json();
  return {
    token: data.token,
    redirect_url: data.redirect_url,
  };
}

/**
 * Verify Midtrans webhook notification signature
 * Signature = SHA512(order_id + status_code + gross_amount + serverKey)
 */
export function verifySignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  signatureKey: string
): boolean {
  const payload = orderId + statusCode + grossAmount + MIDTRANS_SERVER_KEY;
  const expectedSignature = crypto
    .createHash("sha512")
    .update(payload)
    .digest("hex");
  return expectedSignature === signatureKey;
}
