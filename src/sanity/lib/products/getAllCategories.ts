import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getAllCategories = async () => {
  const ALL__CATEGORIES__QUERY = defineQuery(`
    *[_type == "category"] | order(name asc) `);
  try {
    const products = await sanityFetch({
      query: ALL__CATEGORIES__QUERY,
    });
    return products.data || [];
  } catch (error) {
    console.error("Error fetching all categories:", error);
    return [];
  }
};
