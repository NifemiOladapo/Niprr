"use client";

import { Button } from "@/components/ui/button";
import { useBasketStore } from "@/store/store";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");
  const clearBasket = useBasketStore((state) => state.clearBasket);
  useEffect(() => {
    if (orderNumber) clearBasket();
  }, [orderNumber, clearBasket]);
  return (
    <div className="p-4 flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-12 rounded-xl shadow-lg max-w-2xl w-full mx-4">
        <div className="flex justify-center mb-8">
          <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-green-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>
        <h1 className="text-xl font-bold mb-6 text-center">
          Thank you for your order
        </h1>
        <div className="border-t border-b border-gray-200 py-6 mb-6">
          <p className="text-lg text-gray-700 mb-4">
            Your order has been successfully placed and will be shipped to you
            shortly.
          </p>
          <div className="space-y-2">
            {orderNumber && (
              <p className="text-gray-600 flex items-center">
                <span>Your order number is:</span>
                <span className="font-mono text-sm text-green-600">
                  {orderNumber}
                </span>
              </p>
            )}
          </div>
        </div>
        <div className="space-y-4">
          <p className="text-gray-600">
            A confirmation email has been sent to your registered email address.
          </p>
          <div className="flex flex-col gap-4 justify-center sm:flex-row">
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link href={"/orders"}>View Order Detail</Link>
            </Button>
            <Button asChild variant={"outline"}>
              <Link href={"/"}>Continue Shipping</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
