import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const searchProductByName = async (searchParam: string) => {
  const SEARCH__PRODUCTS__BY__NAME__QUERY = defineQuery(`
    *[_type == "product" && name match $searchParam ] | order(name asc) `);
  try {
    const products = await sanityFetch({
      query: SEARCH__PRODUCTS__BY__NAME__QUERY,
      params : {
        searchParam : `*${searchParam}*`
      }
    });
    return products.data || [];
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};
