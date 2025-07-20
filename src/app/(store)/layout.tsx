import type { Metadata } from "next";
import "../globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/Header";
import { SanityLive } from "@/sanity/lib/live";
import { draftMode } from "next/headers";
import { DisableDraftMode } from "@/components/DisableDraftMode";
import { VisualEditing } from "next-sanity";

export const metadata: Metadata = {
  title: "Nippr — Shop Smarter, Faster",
  description:
    "Discover and shop quality products with ease on Nippr. Fast, secure checkout and a smooth shopping experience — every time.",
  keywords: [
    "Nippr",
    "online shopping",
    "e-commerce",
    "buy products online",
    "secure checkout",
    "shop electronics",
    "fashion store",
    "affordable products",
    "fast delivery",
    "online marketplace",
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider dynamic>
      <html lang="en">
        <body>
          {(await draftMode()).isEnabled && (
            <>
              <DisableDraftMode />
              <VisualEditing />
            </>
          )}
          <main>
            <Header />
            {children}
          </main>
          <SanityLive />
        </body>
      </html>
    </ClerkProvider>
  );
}
