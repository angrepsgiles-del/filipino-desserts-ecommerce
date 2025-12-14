import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@vercel/kv"; // Import createClient for KV

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set.");
  }
  return new Stripe(key, { apiVersion: "2025-11-17.clover" });
}

function getKv() {
  const url = process.env.KV_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) {
    throw new Error("Missing Upstash Redis environment variables (KV_URL, KV_REST_API_TOKEN).");
  }
  return createClient({ url, token });
}

export async function POST(req: NextRequest) {
  try {
    let stripe: Stripe;
    try {
      stripe = getStripe();
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    let kvClient;
    try {
      kvClient = getKv();
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    const { items, guestName, contactInfo } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No items in cart." }, { status: 400 });
    }

    // Generate a unique orderId and save order details to KV
    const orderId = `order:${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const orderDetails = {
      guestName: guestName || "Guest", // Fallback to Guest if not provided (though should be from form)
      contactInfo: contactInfo || "N/A",
      items,
      total: items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0),
      status: "pending", // Initially pending until confirmed by webhook
      createdAt: new Date().toISOString(),
      stripeSessionId: null, // Will be updated after session creation
    };
    await kvClient.set(orderId, JSON.stringify(orderDetails));


    // Convert cart items to Stripe line_items format
    const line_items = items.map((item: any) => ({
      price_data: {
        currency: "gbp",
        product_data: {
          name: item.name,
          images: [item.imageUrl], // Use product image
        },
        unit_amount: Math.round(item.price * 100), // Price in cents
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${req.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`, // Redirect after successful payment
      cancel_url: `${req.nextUrl.origin}/`, // Redirect if payment is cancelled (back to home for now)
      metadata: {
        orderId: orderId, // Pass our generated order ID to Stripe
      },
    });

    // Update order in KV with Stripe Session ID
    const updatedOrderDetails = { ...orderDetails, stripeSessionId: session.id };
    await kvClient.set(orderId, JSON.stringify(updatedOrderDetails));


    return NextResponse.json({ sessionUrl: session.url }, { status: 200 });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json({ error: "Failed to create checkout session." }, { status: 500 });
  }
}
