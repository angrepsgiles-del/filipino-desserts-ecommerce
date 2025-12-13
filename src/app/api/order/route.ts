import { kv } from "@/lib/kv";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const order = await req.json();

    if (!order.guestName || !order.contactInfo || !order.items || order.items.length === 0) {
      return NextResponse.json({ error: "Missing required order information." }, { status: 400 });
    }

    const orderId = `order:${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Store the order with an 'unpaid' status
    await kv.set(orderId, JSON.stringify(order));

    return NextResponse.json({ message: "Order placed successfully!", orderId }, { status: 200 });
  } catch (error) {
    console.error("Error placing order:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
