import Link from "next/link";
import { Product } from "../../sanity.types";
import Image from "next/image";
import { imageUrl } from "@/lib/imageUrls";

const ProductThumbnail = ({ product }: { product: Product }) => {
  const isOutOfStock = product.stock !== undefined   && product.stock <= 0;

  return (
    <Link
      href={`/product/${product.slug?.current}`}
      className={`group flex flex-col rounded-lg border border-gray-200 shadow-md transition-all duration-200 overflow-hidden ${isOutOfStock && "opacity-50"}`}
    >
      <div className="relative w-full h-full overflow-hidden aspect-square">
        {product.image && (
          <Image
            className="object-contain transition-transform duration-300 group-hover:scale-125"
            src={imageUrl(product.image).url()}
            alt={product.name || "Product iamge"}
            fill
            sizes="(max-width:768px) 100vw, (max-width: 120px) 50 vw, 33vw"
          />
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <span className="text-white font-bold text-lg">Out of stock</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800 truncate">
          {product.name}
        </h2>
        <p className="mt-2 text-sm text-gray-600 line-clamp-2">
          {product.description
            ?.map((block) =>
              block._type === "block"
                ? block.children?.map((child) => child.text).join("")
                : ""
            )
            .join(" ") || "No description available."}
        </p>
        <p className="mt-2 text-lg font-bold text-gray-900">
          ${product.price?.toFixed(2)}
        </p>
      </div>
    </Link>
  );
};

export default ProductThumbnail;
