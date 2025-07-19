import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getMyOrders = async (userId: string) => {
  if (!userId) {
    throw new Error("user id not provided");
  }
  const MY__ORDERS__QUERY = defineQuery(`
    *[_type == "order"  && clerkUserId == $userId ] | order(orderDate desc){
      ...,
      products[]{
        ...,
        product->
      }
    } `);
  try {
    const orders = await sanityFetch({
      query: MY__ORDERS__QUERY,
      params: { userId },
    });
    return orders.data || [];
  } catch (error) {
    console.error("Error fetching your orders:", error);
    return [];
  }
};
