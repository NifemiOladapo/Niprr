import { getActiveSale } from "@/sanity/lib/sales/getActiveSale";

const Banner = async () => {
  const sale = await getActiveSale();
  if (!sale?.isActive) {
    return null;
  }
  return (
    <div className="bg-gradient-to-r from-red-600 to-black text-white px-6 py-10 mx-4 mt-2 mb-4 rounded-lg shadow-lg w-full">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex-1">
          <h2 className="text-3xl font-extrabold mb-4 text-left sm:text-5xl">
            {sale.title}
          </h2>
          <p className="text-left text-xl font-semibold mb-6 sm:text-3xl">
            {sale.description}
          </p>
          <div className="flex">
            <div className="bg-white text-black py-4 px-6 rounded-full shadow-md transform transition duration-300 hover:scale-105">
              <span className="font-bold text-base sm:text-xl">
                Use code:{" "}
                <span className="text-red-600">{sale.couponCode}</span>
              </span>
              <span className="ml-2 font-bold text-base sm:text-2xl">
                for {sale.discountAmount}% OFF
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
