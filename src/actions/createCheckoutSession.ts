"use server";

import stripe from "@/lib/stripe";
import { Product } from "../../sanity.types";
import { imageUrl } from "@/lib/imageUrls";

export interface Metadata {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  clerkUserId: string;
}
export interface GroupedBasketItem {
  product: Product;
  quantity: number;
}

export const createCheckoutSession = async (
  items: GroupedBasketItem[],
  metadata: Metadata
) => {
  try {
    const itemWithoutPrice = items.find((item) => !item.product.price);
    if (itemWithoutPrice) throw new Error("Some produts do not have price");
    const customers = await stripe.customers.list({
      email: metadata.customerEmail,
      limit: 1,
    });
    let customerId: string | undefined;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_creation: customerId ? undefined : "always",
      customer_email: !customerId ? metadata.customerEmail : undefined,
      metadata: {
        orderNumber: metadata.orderNumber,
        customerName: metadata.customerName,
        customerEmail: metadata.customerEmail,
        clerkUserId: metadata.clerkUserId,
      },
      mode: "payment",
      allow_promotion_codes: true,
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?session_id={CHECKOUT_SESSION_iD}&orderNumber=${metadata.orderNumber}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/basket`,
      line_items: items.map((item) => ({
        quantity: item.quantity,
        price_data: {
          currency: "usd",
          unit_amount: Math.round(item.product.price! * 100),
          product_data: {
            name: item.product.name || "Unnamed Product",
            description: `Produt ID: ${item.product._id}`,
            metadata: { id: item.product._id },
            images: item.product.image
              ? [imageUrl(item.product.image).url()]
              : undefined,
          },
        },
      })),
    });
    return session.url;
  } catch (error) {
    console.error("Error creating checkout session", error);
    throw error;
  }
};
