import { defineQuery } from "next-sanity";
import { sanityFetch } from "../live";

export const getActiveSale = async () => {
  const ACTIVE__SALE__QUERY = defineQuery(`*[
        _type == "sale" && isActive == true  ] | order(validFrom desc)[0] 
    `);
  try {
    const activeSale = await sanityFetch({
      query: ACTIVE__SALE__QUERY,
    });
    return activeSale ? activeSale.data : null;
  } catch (error) {
    console.error("Error fetching sale:", error);
    return null;
  }
};
