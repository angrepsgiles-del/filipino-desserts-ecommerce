"use client"; // This component needs client-side interactivity
import Image from "next/image";
import { useState, FormEvent } from "react";
import { products } from "../lib/products";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { useCart } from "../context/CartContext"; // Import useCart

export default function Home() {
  const { addToCart } = useCart(); // Use the cart context
  const [quantities, setQuantities] = useState<{ [key: string]: number }>(
    products.reduce((acc, product) => ({ ...acc, [product.id]: 0 }), {})
  );
  const [guestName, setGuestName] = useState<string>("");
  const [contactInfo, setContactInfo] = useState<string>("");
  const [message, setMessage] = useState<string | null>(null);

  const handleQuantityChange = (productId: string, value: string) => {
    const quantity = parseInt(value, 10);
    setQuantities((prev) => ({
      ...prev,
      [productId]: isNaN(quantity) ? 0 : quantity,
    }));
  };

  const handleAddToCart = (product: Product, quantity: number) => {
    if (quantity > 0) {
      addToCart(product, quantity);
      setMessage(`${quantity}x ${product.name} added to cart!`);
      // Reset quantity after adding to cart
      setQuantities((prev) => ({ ...prev, [product.id]: 0 }));
    } else {
      setMessage("Please select a quantity greater than 0.");
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setMessage(null);

    const orderedItems = Object.entries(quantities)
      .filter(([, quantity]) => quantity > 0)
      .map(([productId, quantity]) => {
        const product = products.find((p) => p.id === productId);
        return product ? { ...product, quantity } : null;
      })
      .filter(Boolean);

    if (orderedItems.length === 0) {
      setMessage("Please select at least one item to order.");
      return;
    }

    if (!guestName.trim() || !contactInfo.trim()) {
      setMessage("Please provide your name and contact information.");
      return;
    }

    const order = {
      guestName,
      contactInfo,
      items: orderedItems,
      total: orderedItems.reduce((sum, item) => sum + (item?.price || 0) * (item?.quantity || 0), 0),
      status: "unpaid",
      createdAt: new Date().toISOString(),
    };

    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(order),
      });

      if (response.ok) {
        setMessage("Order placed successfully! We will contact you soon.");
        setQuantities(
          products.reduce((acc, product) => ({ ...acc, [product.id]: 0 }), {})
        );
        setGuestName("");
        setContactInfo("");
      } else {
        const errorData = await response.json();
        setMessage(`Failed to place order: ${errorData.error || response.statusText}`);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      setMessage("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-yellow-200 via-purple-300 to-green-200 dark:from-yellow-700 dark:via-purple-800 dark:to-green-700 font-sans p-4">
      <header className="w-full max-w-4xl flex justify-between items-center py-4 px-2">
        <h1 className="text-2xl font-bold text-black dark:text-white">Filipino Desserts</h1>
        <div>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton />
          </SignedOut>
        </div>
      </header>
      <main className="w-full max-w-4xl py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Our Delicious Filipino Desserts</h1>

        {message && (
          <div className={`p-4 mb-4 text-center rounded-md ${message.includes("successfully") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white/30 dark:bg-zinc-800/30 rounded-lg shadow-lg backdrop-blur-md border border-white/20 dark:border-zinc-700/50 overflow-hidden flex flex-col">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4 flex-grow flex flex-col">
                  <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-3 flex-grow">{product.description}</p>
                  <div className="flex items-center justify-between mt-auto pt-2">
                    <p className="text-lg font-bold">${product.price.toFixed(2)}</p>
                    <input
                      type="number"
                      min="0"
                      value={quantities[product.id]}
                      onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                      className="w-20 p-2 border border-zinc-300 rounded-md text-center bg-zinc-100 dark:bg-zinc-700 dark:border-zinc-600"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddToCart(product, quantities[product.id])}
                      className="ml-2 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-6 bg-white dark:bg-zinc-800 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Your Information</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="guestName" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Your Name
                </label>
                <input
                  type="text"
                  id="guestName"
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="mt-1 block w-full p-2 border border-zinc-300 rounded-md shadow-sm bg-zinc-100 dark:bg-zinc-700 dark:border-zinc-600"
                  required
                />
              </div>
              <div>
                <label htmlFor="contactInfo" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Contact Information (Email or Phone)
                </label>
                <input
                  type="text"
                  id="contactInfo"
                  value={contactInfo}
                  onChange={(e) => setContactInfo(e.target.value)}
                  className="mt-1 block w-full p-2 border border-zinc-300 rounded-md shadow-sm bg-zinc-100 dark:bg-zinc-700 dark:border-zinc-600"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="mt-6 w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Place Order
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
