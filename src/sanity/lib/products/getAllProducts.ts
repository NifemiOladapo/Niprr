import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getAllProducts = async () => {
  const ALL__PRODUCTS__QUERY = defineQuery(`
    *[_type == "product"] | order(name asc) `);
  try {
    const products = await sanityFetch({
      query: ALL__PRODUCTS__QUERY,
    });
    return products.data || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};
