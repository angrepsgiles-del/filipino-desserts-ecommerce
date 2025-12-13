import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { kv } from "@/lib/kv"; // Import KV for order persistence

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-11-17.clover", // Use a recent API version
});

export async function POST(req: NextRequest) {
  try {
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
    await kv.set(orderId, JSON.stringify(orderDetails));


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
    await kv.set(orderId, JSON.stringify(updatedOrderDetails));


    return NextResponse.json({ sessionUrl: session.url }, { status: 200 });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json({ error: "Failed to create checkout session." }, { status: 500 });
  }
}
