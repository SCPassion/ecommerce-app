"use server";

import { stripe } from "@/lib/stripe";
import { CartItem } from "@/store/cart-store";
import { redirect } from "next/navigation";

export async function checkoutAction(formData: FormData): Promise<void> {
  const itemsJson = formData.get("items") as string;
  const items = JSON.parse(itemsJson);

  // Convert the items selected to the format required by Stripe
  const line_items = items.map((item: CartItem) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.name,
      },
      unit_amount: item.price,
    },
    quantity: item.quantity,
  }));

  console.log("Line items for Stripe:", line_items);
  // Create a checkout session with Stripe, stripe need to know where to redirect the user after payment
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items,
    mode: "payment",
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
  });

  // Redirect the user to the checkout session URL
  redirect(session.url!);
}
