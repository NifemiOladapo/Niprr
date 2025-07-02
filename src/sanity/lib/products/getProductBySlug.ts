import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getProductBySlug = async (slug: string) => {
  const GET__PRODUCT__BY__SLUG = defineQuery(`
    *[_type == "product" &&  slug.current match $slug ] | order(name asc)[0] `);
  try {
    const product = await sanityFetch({
      query: GET__PRODUCT__BY__SLUG,
      params: {
        slug,
      },
    });
    return product.data || null;
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return null;
  }
};
