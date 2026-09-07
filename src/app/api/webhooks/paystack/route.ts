import { Metadata } from "@/actions/createCheckoutSession";
import { verifyTransaction } from "@/lib/paystack";
import { client } from "@/sanity/lib/backendClient";
import crypto from "crypto";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs"; // needed for the crypto module

interface CartMetadata extends Metadata {
  items: {
    id: string;
    name: string;
    price?: number;
    quantity: number;
  }[];
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("x-paystack-signature");

  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    return NextResponse.json(
      { error: "Paystack secret key is not set" },
      { status: 400 },
    );
  }
  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  // Paystack signs webhooks with HMAC-SHA512 (not SHA256) of the raw body
  const expectedSignature = crypto
    .createHmac("sha512", secret)
    .update(body)
    .digest("hex");

  const signatureIsValid =
    expectedSignature.length === signature.length &&
    crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(signature),
    );

  if (!signatureIsValid) {
    console.log("Paystack webhook signature mismatch");
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(body);

  if (event.event === "charge.success") {
    try {
      await createOrderInSanity(event.data.reference);
    } catch (err) {
      console.log("error while creating order", err);
      return NextResponse.json(
        { error: "Error creating order" },
        { status: 400 },
      );
    }
  }

  return NextResponse.json({ received: true });
}

const createOrderInSanity = async (reference: string) => {
  // Re-verify against Paystack directly instead of trusting the webhook
  // payload alone — this is Paystack's own recommended defense against a
  // tampered or replayed event, and gives us the authoritative amount/status.
  const verified = await verifyTransaction(reference);
  const { data } = verified;

  if (data.status !== "success") {
    throw new Error(
      `Transaction ${reference} is not successful (status: ${data.status})`,
    );
  }

  // Paystack retries undelivered webhooks for up to 72 hours, so guard
  // against creating a duplicate order for the same transaction.
  const existingOrder = await client.fetch(
    `*[_type == "order" && paystackReference == $reference][0]{_id}`,
    { reference },
  );
  if (existingOrder) return existingOrder;

  const rawMetadata = data.metadata;
  const metadata: CartMetadata =
    typeof rawMetadata === "string"
      ? JSON.parse(rawMetadata)
      : // : (rawMetadata as CartMetadata);
        rawMetadata;

  const { orderNumber, customerName, customerEmail, clerkUserId, items } =
    metadata;

  const sanityProducts = (items ?? []).map((item) => ({
    _key: crypto.randomUUID(),
    product: {
      _type: "reference",
      _ref: item.id,
    },
    quantity: item.quantity || 0,
  }));

  const order = await client.create({
    _type: "order",
    orderNumber,
    paystackReference: data.reference,
    paystackTransactionId: data.id,
    customerName,
    paystackCustomerCode: data.customer?.customer_code,
    clerkUserId,
    email: customerEmail,
    currency: data.currency,
    amountDiscount: 0,
    products: sanityProducts,
    totalPrice: data.amount ? data.amount / 100 : 0,
    status: "paid",
    orderDate: data.paid_at ?? new Date().toISOString(),
  });
  console.log("thisis the creatd order:", order);
  return order;
};
