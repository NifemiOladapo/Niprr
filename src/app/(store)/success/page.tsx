"use client";

import { Button } from "@/components/ui/button";
import { useBasketStore } from "@/store/store";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

type VerificationState = "loading" | "success" | "failed";

const SuccessPage = () => {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");
  const reference = searchParams.get("reference");
  const clearBasket = useBasketStore((state) => state.clearBasket);
  const [state, setState] = useState<VerificationState>("loading");

  useEffect(() => {
    console.log(reference, "thats refer value");
    if (!reference) {
      setState("failed");
      return;
    }

    let cancelled = false;

    const verify = async () => {
      try {
        const res = await fetch(
          `/api/paystack/verify?reference=${encodeURIComponent(reference)}`,
        );
        const data = await res.json();
        if (!cancelled) {
          if (data.status === "success") {
            setState("success");
            clearBasket();
          } else {
            setState("failed");
          }
        }
      } catch (err) {
        console.error("Error verifying transaction", err);
        if (!cancelled) setState("failed");
      }
    };

    verify();
    return () => {
      cancelled = true;
    };
  }, [reference, clearBasket]);

  if (state === "loading") {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-600">Confirming your payment...</p>
      </div>
    );
  }

  if (state === "failed") {
    return (
      <div className="p-4 flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-12 rounded-xl shadow-lg max-w-2xl w-full mx-4 text-center">
          <h1 className="text-xl font-bold mb-4">
            We couldn&apos;t confirm your payment
          </h1>
          <p className="text-gray-600 mb-6">
            If you completed payment, it may still be processing — check your
            order history in a few minutes. Otherwise, nothing was charged.
          </p>
          <div className="flex flex-col gap-4 justify-center sm:flex-row">
            <Button asChild variant={"outline"}>
              <Link href={"/basket"}>Return to Basket</Link>
            </Button>
            <Button asChild variant={"outline"}>
              <Link href={"/orders"}>View Orders</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

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
            {/* <Button asChild variant={"outline"}>
              <Link href={"/"}>Continue Shipping</Link>
            </Button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
