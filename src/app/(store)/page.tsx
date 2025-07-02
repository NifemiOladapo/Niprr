import Banner from "@/components/Banner";
import ProductsView from "@/components/ProductsView";
import { getAllCategories } from "@/sanity/lib/products/getAllCategories";
import { getAllProducts } from "@/sanity/lib/products/getAllProducts";

export default async function Home() {
  const products = await getAllProducts();
  const categories = await getAllCategories();
  return (
      <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 p-4">
        <Banner />
        <ProductsView products={products} categories={categories}/>
      </div>
  );
}
