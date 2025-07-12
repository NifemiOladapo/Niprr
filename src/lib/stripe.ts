import Stripe from "stripe"

if (!process.env.STRIPE__SECRET__KEY) {
    throw new Error("STRIPE__SECRET__KEY is not set")
}

const stripe = new Stripe(process.env.STRIPE__SECRET__KEY, {
    apiVersion: "2025-06-30.basil"
})

export default stripe