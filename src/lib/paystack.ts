const PAYSTACK_BASE_URL = "https://api.paystack.co";

function getSecretKey(): string {
  const key = process.env.PAYSTACK_SECRET_KEY;
  if (!key) {
    throw new Error("PAYSTACK_SECRET_KEY is not set in the environment");
  }
  return key;
}

export interface PaystackInitializePayload {
  email: string;
  amount: number; // in the smallest currency unit (kobo for NGN)
  currency?: string;
  reference?: string;
  callback_url?: string;
  metadata?: Record<string, unknown>;
}

export interface PaystackInitializeResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export const initializeTransaction = async (
  payload: PaystackInitializePayload,
): Promise<PaystackInitializeResponse> => {
  const res = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getSecretKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: payload.email,
      amount: String(Math.round(payload.amount)),
      currency: payload.currency,
      reference: payload.reference,
      callback_url: payload.callback_url,
      // Paystack expects metadata as a stringified JSON object
      metadata: payload.metadata ? JSON.stringify(payload.metadata) : undefined,
    }),
    cache: "no-store",
  });

  const json = (await res.json()) as PaystackInitializeResponse & {
    message: string;
  };

  if (!res.ok || !json.status) {
    throw new Error(
      json.message || "Failed to initialize Paystack transaction",
    );
  }

  return json;
};

export interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    status: "success" | "failed" | "abandoned";
    reference: string;
    amount: number;
    currency: string;
    paid_at: string | null;
    metadata: string | Record<string, unknown> | null | "";
    customer: {
      email: string;
      customer_code: string;
    };
    [key: string]: unknown;
  };
}

export const verifyTransaction = async (
  reference: string,
): Promise<PaystackVerifyResponse> => {
  const res = await fetch(
    `${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`,
    {
      method: "GET",
      headers: { Authorization: `Bearer ${getSecretKey()}` },
      cache: "no-store",
    },
  );

  const json = (await res.json()) as PaystackVerifyResponse;
  console.log("this is verify result:",json)

  if (!res.ok || !json.status) {
    throw new Error(json.message || "Failed to verify Paystack transaction");
  }

  return json;
};
