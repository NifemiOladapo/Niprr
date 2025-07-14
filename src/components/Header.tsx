"use client";

import {
  ClerkLoaded,
  SignedIn,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Link from "next/link";
import Form from "next/form";
import { PackageIcon, TrolleyIcon } from "@sanity/icons";
import { useBasketStore } from "@/store/store";

const Header = () => {
  const { user } = useUser();
  const itemCount = useBasketStore((state) =>
    state.items.reduce((total, item) => total + item.quantity, 0)
  );

  const createClerkPasskey = async () => {
    try {
      const res = await user?.createPasskey();
      console.log(res);
    } catch (err) {
      console.error("Error creating passkey:", err);
    }
  };
  return (
    <header className="flex w-full gap-3 lg:flex-row justify-between flex-col py-2 px-3 items-center">
      <Link
        href="/"
        className="text-2xl font-bold text-blue-500 hover:opacity-50 cursor-pointer"
      >
        Nippr
      </Link>
      <Form
        action={"/search"}
        className="mt-1 md:mt-0 flex-1 w-full text-center lg:text-left"
      >
        <input
          type="text"
          name="query"
          placeholder="Search for products"
          className="bg-gray-100 text-gray-800 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 border w-full max-w-4xl"
        />
      </Form>
      <div className="space-x-4 mt-3.5 md:mt-0 items-center flex flex-wrap justify-center lg:space-y-0 space-y-1.5 ">
        <Link
          href="/basket"
          className="flex-1 relative flex justify-center sm:justify-start sm:flex-none items-center space-x-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          <TrolleyIcon className="w-6 h-6" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
            {itemCount}
          </span>
          <span>My Basket</span>
        </Link>
        <ClerkLoaded>
          <SignedIn>
            <Link
              href={"/orders"}
              className="flex-1 relative flex justify-center sm:justify-start sm:flex-none items-center space-x-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              <PackageIcon className="w-6 h-6" />
              <span>My Orders</span>
            </Link>
          </SignedIn>

          {user ? (
            <div className="flex items-center space-x-2">
              <UserButton />
              <div className="hidden 2xl:block text-xs">
                <p className="text-gray-400">Welcome Back</p>
                <p className="font-bold">{user?.fullName}!</p>
              </div>
            </div>
          ) : (
            <SignInButton mode="modal" />
          )}
          {user?.passkeys.length === 0 && (
            <button
              onClick={createClerkPasskey}
              className="bg-white cursor-pointer hover:bg-blue-700 hover:text-white animate-pulse text-blue-500 font-bold py-2 px-4 rounded border-blue-300 border"
            >
              Create a passkey now
            </button>
          )}
        </ClerkLoaded>
      </div>
    </header>
  );
};

export default Header;
