"use client";

import { kv } from "@/lib/kv"; // This import is not directly used in the client component, but keeping it for type reference if needed
import { useState, useEffect, FormEvent } from "react";
import Image from "next/image";

type Order = {
  id: string; // Add id to the Order type
  guestName: string;
  contactInfo: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    imageUrl: string;
  }>;
  total: number;
  status: "unpaid" | "paid";
  createdAt: string;
};

export default function AdminPage() {
  const [password, setPassword] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [message, setMessage] = useState<string | null>(null);

  const fetchOrders = async () => {
    if (!isAuthenticated) return;
    try {
      // In a real app, this would be an API route that fetches orders securely
      // For simplicity here, we'll fetch from an API route that uses the password
      const response = await fetch("/api/admin/orders", {
        method: "POST", // Using POST to send password securely
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (response.ok) {
        const fetchedOrders: Order[] = await response.json();
        setOrders(fetchedOrders);
      } else {
        setMessage("Failed to fetch orders.");
        setIsAuthenticated(false); // Auth failed or expired
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setMessage("An error occurred while fetching orders.");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated]); // Refetch when authenticated state changes

  const handleAuthSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      // Authenticate with a simple check against an API route
      // In a real app, you'd use a more robust authentication system
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        setIsAuthenticated(true);
        setMessage("Authentication successful!");
      } else {
        setMessage("Authentication failed. Invalid password.");
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Auth error:", error);
      setMessage("An error occurred during authentication.");
    }
  };

  const handleMarkPaid = async (orderId: string) => {
    setMessage(null);
    try {
      const response = await fetch("/api/admin/mark-paid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, orderId }),
      });

      if (response.ok) {
        setMessage("Order marked as paid!");
        fetchOrders(); // Refresh orders
      } else {
        const errorData = await response.json();
        setMessage(`Failed to mark order as paid: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error marking order as paid:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    setMessage(null);
    try {
      const response = await fetch("/api/admin/delete-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, orderId }),
      });

      if (response.ok) {
        setMessage("Order deleted successfully!");
        fetchOrders(); // Refresh orders
      } else {
        const errorData = await response.json();
        setMessage(`Failed to delete order: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      setMessage("An error occurred. Please try again.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-black p-4">
        <div className="bg-white dark:bg-zinc-800 p-8 rounded-lg shadow-md w-full max-w-sm text-center">
          <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
          {message && (
            <div className={`p-3 mb-4 rounded-md ${message.includes("successful") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
              {message}
            </div>
          )}
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
              <label htmlFor="adminPassword" className="sr-only">
                Password
              </label>
              <input
                type="password"
                id="adminPassword"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full p-2 border border-zinc-300 rounded-md shadow-sm bg-zinc-100 dark:bg-zinc-700 dark:border-zinc-600"
                placeholder="Enter admin password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans dark:bg-black p-8">
      <main className="w-full max-w-6xl mx-auto py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Admin Dashboard - Unpaid Orders</h1>

        {message && (
          <div className={`p-3 mb-4 rounded-md ${message.includes("successful") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
            {message}
          </div>
        )}

        {orders.filter(order => order.status === "unpaid").length === 0 ? (
          <p className="text-center text-zinc-600 dark:text-zinc-400">No unpaid orders found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orders.filter(order => order.status === "unpaid").map((order, index) => (
              <div key={order.id} className="bg-white dark:bg-zinc-800 rounded-lg shadow-md p-6 flex flex-col">
                <h2 className="text-2xl font-semibold mb-4">Order from {order.guestName}</h2>
                <p className="text-zinc-600 dark:text-zinc-400 mb-2">Contact: {order.contactInfo}</p>
                <p className="text-zinc-600 dark:text-zinc-400 mb-2">Ordered On: {new Date(order.createdAt).toLocaleString()}</p>
                <p className="text-lg font-bold mb-4">Total: ${order.total.toFixed(2)}</p>

                <div className="flex-grow">
                  <h3 className="text-xl font-semibold mb-2">Items:</h3>
                  <ul className="space-y-2">
                    {order.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center gap-3">
                        <Image src={item.imageUrl} alt={item.name} width={40} height={40} className="rounded" />
                        <span>{item.name} x {item.quantity} (${(item.price * item.quantity).toFixed(2)})</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleMarkPaid(order.id)}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                  >
                    Mark as Paid
                  </button>
                  <button
                    onClick={() => handleDeleteOrder(order.id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                  >
                    Delete Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
