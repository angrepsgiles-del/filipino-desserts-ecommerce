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
  let stripe: Stripe;
  let kvClient;
  let webhookSecret: string | undefined;
  try {
    stripe = getStripe();
    kvClient = getKv();
    webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) throw new Error("STRIPE_WEBHOOK_SECRET is not set.");
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "Missing Stripe-Signature header or Webhook Secret" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session;
      // Retrieve order from your database based on session.metadata or session.id
      // For now, let's assume session.metadata.orderId holds our order ID
      const orderId = session.metadata?.orderId; // You would set this in your Checkout Session creation

      if (orderId) {
        try {
          // Fetch the order from KV
          const orderString = await kvClient.get(orderId);
          if (orderString) {
            const order = JSON.parse(orderString as string);
            order.status = "paid"; // Mark as paid
            await kvClient.set(orderId, JSON.stringify(order));
            console.log(`Order ${orderId} marked as paid.`);
          } else {
            console.warn(`Order ${orderId} not found in KV.`);
          }
        } catch (kvError) {
          console.error(`Error updating order ${orderId} in KV:`, kvError);
        }
      }
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  return NextResponse.json({ received: true }, { status: 200 });
}
