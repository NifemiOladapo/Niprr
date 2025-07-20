import { Metadata } from "@/actions/createCheckoutSession";
import stripe from "@/lib/stripe";
import { client } from "@/sanity/lib/backendClient";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const sig = headersList.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "No Signature" }, { status: 400 });
  }
  const webhookSecret = process.env.STRIPE__WEBHOOK__SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: "Stripe webhook is not set" },
      { status: 400 }
    );
  }
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.log("Webhook signature error", err);

    return NextResponse.json(
      { error: `Webhook Error: ${err}` },
      { status: 400 }
    );
  }
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    try {
      const order = await createOrderInSanity(session);
      // console.log("order created in sanity", order);
    } catch (err) {
      console.log("error while creating order", err);

      return NextResponse.json(
        { error: "Error creating order" },
        { status: 400 }
      );
    }
  }
  return NextResponse.json({ received: true });
}

const createOrderInSanity = async (session: Stripe.Checkout.Session) => {
  const {
    id,
    amount_total,
    currency,
    metadata,
    payment_intent,
    customer,
    total_details,
  } = session;
  const { orderNumber, customerName, customerEmail, clerkUserId } =
    // @ts-expect-error could not yet fiure out error cause

    metadata as Metadata;
  const lineItemsWithProduct = await stripe.checkout.sessions.listLineItems(
    id,
    { expand: ["data.price.product"] }
  );
  const sanityProducts = lineItemsWithProduct.data.map((item) => ({
    _key: crypto.randomUUID(),
    product: {
      _type: "reference",
      _ref: (item.price?.product as Stripe.Product)?.metadata?.id,
    },
    quantity: item.quantity || 0,
  }));
  const order = await client.create({
    _type: "order",
    orderNumber,
    stripeCheckoutSessionId: id,
    stripePaymentIntentId: payment_intent,
    customerName,
    stripeCustomerId: customer,
    clerkUserId,
    email: customerEmail,
    currency,
    amountDiscount: total_details?.amount_discount
      ? total_details.amount_discount / 100
      : 0,
    products: sanityProducts,
    totalPrice: amount_total ? amount_total / 100 : 0,
    status: "paid",
    orderDate: new Date().toISOString(),
  });
  return order;
};
