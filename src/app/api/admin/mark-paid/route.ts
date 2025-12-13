import { kv } from "@/lib/kv";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const { password, orderId } = await req.json();

  if (password !== adminPassword) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!orderId) {
    return NextResponse.json({ error: "Order ID is required." }, { status: 400 });
  }

  try {
    const orderString = await kv.get(orderId);
    if (!orderString) {
      return NextResponse.json({ error: "Order not found." }, { status: 404 });
    }

    const order = JSON.parse(orderString as string);
    order.status = "paid";
    await kv.set(orderId, JSON.stringify(order));

    return NextResponse.json({ message: "Order marked as paid." }, { status: 200 });
  } catch (error) {
    console.error("Error marking order as paid:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
