import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getProductsByCategory = async (categorySlug: string) => {
  const PRODUCTS__BY__CATEGORY__QUERY = defineQuery(`
    *[_type == "product" && references(*[_type == "category" && slug.current == $categorySlug]._id)] | order(name asc) `);
  try {
    const products = await sanityFetch({
      query: PRODUCTS__BY__CATEGORY__QUERY,
      params: {
        categorySlug,
      },
    });
    return products.data || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};