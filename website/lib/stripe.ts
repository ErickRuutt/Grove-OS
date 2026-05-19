import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is not set");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2026-04-22.dahlia",
});

export const EXPORT_PRICE_CENTS = 2900; // $29.00
export const EXPORT_PRODUCT_NAME = "Brain Protocol Export";
