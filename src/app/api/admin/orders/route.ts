import { kv } from "@/lib/kv";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const { password } = await req.json();

  if (password !== adminPassword) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const orderKeys = await kv.keys("order:*");
    const ordersData = orderKeys.length > 0 ? await kv.mget<string[]>(...orderKeys) : [];
    const orders = ordersData.filter(Boolean).map((orderStr: string, index) => {
        const order = JSON.parse(orderStr);
        // Add the key as id to the order object for easier handling on the frontend
        return { ...order, id: orderKeys[index] };
    });

    return NextResponse.json(orders, { status: 200 });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
