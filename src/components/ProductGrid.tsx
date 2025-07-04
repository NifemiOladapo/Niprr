"use client"

import { Product } from "../../sanity.types";
import ProductThumbnail from "./ProductThumbnail";
import { AnimatePresence, motion } from "framer-motion";

const ProductGrid = ({ products }: { products: Product[] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
      {products.map((product) => (
        <AnimatePresence key={product._id}>
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            // transition={{ duration: 0.3 }}
            className="flex justify-center"
          >
            <ProductThumbnail key={product._id} product={product} />
          </motion.div>
        </AnimatePresence>
      ))}
    </div>
  );
};

export default ProductGrid;
