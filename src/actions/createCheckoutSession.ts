"use server";

import { initializeTransaction } from "@/lib/paystack";
import { Product } from "../../sanity.types";

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

// Paystack amounts are in the smallest unit of the currency (kobo for NGN).
// Assumes item.product.price is already a Naira amount — see note above
// if your Sanity prices are in USD.
const CHECKOUT_CURRENCY = "NGN";

export const createCheckoutSession = async (
  items: GroupedBasketItem[],
  metadata: Metadata,
) => {
  try {
    const itemWithoutPrice = items.find((item) => !item.product.price);
    if (itemWithoutPrice) throw new Error("Some products do not have a price");
    console.log(items);
    const totalAmount = items.reduce(
      (sum, item) => sum + (item.product.price ?? 0) * item.quantity,
      0,
    );
    // Paystack's hosted checkout only shows a single total, not itemised
    // line items like Stripe Checkout did — so we carry the cart contents
    // through in metadata and read them back in the webhook to build the
    // Sanity order.
    const cartMetadata = {
      orderNumber: metadata.orderNumber,
      customerName: metadata.customerName,
      customerEmail: metadata.customerEmail,
      clerkUserId: metadata.clerkUserId,
      items: items.map((item) => ({
        id: item.product._id,
        name: item.product.name ?? "Unnamed Product",
        price: item.product.price,
        quantity: item.quantity,
      })),
    };

    const session = await initializeTransaction({
      email: metadata.customerEmail,
      amount: Math.round(totalAmount * 100),
      currency: CHECKOUT_CURRENCY,
      reference: metadata.orderNumber, // already a UUID — valid Paystack reference
      callback_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success?orderNumber=${metadata.orderNumber}`,
      metadata: cartMetadata,
    });

    return session.data.authorization_url;
  } catch (error) {
    console.error("Error creating checkout session", error);
    throw error;
  }
};
