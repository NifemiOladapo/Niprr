import { verifyTransaction } from "@/lib/paystack";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const reference = req.nextUrl.searchParams.get("reference");

  if (!reference) {
    return NextResponse.json(
      { status: "failed", error: "No reference provided" },
      { status: 400 }
    );
  }

  try {
    const verified = await verifyTransaction(reference);
    return NextResponse.json({ status: verified.data.status });
  } catch (error) {
    console.error("Error verifying transaction", error);
    return NextResponse.json({ status: "failed" }, { status: 500 });
  }
}