"use client"; // This component needs client-side interactivity
import { useState } from "react";
import { products, Product } from "../lib/products";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { useCart } from "../context/CartContext"; // Import useCart
import CartModal from "../components/CartModal"; // Import CartModal
import GawaKamayHeadline from "../components/GawaKamayHeadline"; // Import GawaKamayHeadline
import PreorderInfo from "../components/PreorderInfo"; // Import PreorderInfo

export default function Home() {
  const { addToCart, getTotalItems } = useCart(); // Use the cart context
  const [quantities, setQuantities] = useState<{ [key: string]: number }>(
    products.reduce((acc, product) => ({ ...acc, [product.id]: 0 }), {})
  );
  const [message, setMessage] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false); // State for cart modal

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

  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-yellow-200 via-purple-300 to-green-200 dark:from-yellow-700 dark:via-purple-800 dark:to-green-700 font-sans p-4">
      <header className="w-full max-w-4xl flex justify-between items-center py-4 px-2">
        <h1 className="text-2xl font-bold text-black dark:text-white">Filipino Desserts</h1>
        <div className="flex items-center space-x-4">
          <button onClick={() => setIsCartOpen(true)} className="relative p-2 rounded-full hover:bg-white/20 dark:hover:bg-zinc-700/50">
            <img src="/images/cart-black.png" alt="Cart" className="w-6 h-6 dark:invert" />
            {getTotalItems() > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {getTotalItems()}
              </span>
            )}
          </button>
          <SignedIn>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
          <SignedOut>
            <SignInButton />
          </SignedOut>
        </div>
      </header>
      <GawaKamayHeadline /> {/* Integrated GawaKamayHeadline */}
      <main className="w-full max-w-4xl py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Our Delicious Filipino Desserts</h1>

        {message && (
          <div className={`p-4 mb-4 text-center rounded-md ${message.includes("successfully") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
            {message}
          </div>
        )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white/30 dark:bg-zinc-800/30 rounded-lg shadow-lg backdrop-blur-md border border-white/20 dark:border-zinc-700/50 overflow-hidden flex flex-col">
                <div className="w-full h-48 flex items-center justify-center bg-gray-200 text-gray-700 text-center font-bold">
                  {product.name}
                </div>
                <div className="p-4 flex-grow flex flex-col">
                  <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                  <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-3 flex-grow">{product.description}</p>
                  <div className="flex items-center justify-between mt-auto pt-2 gap-2 flex-wrap">
                    <p className="text-lg font-bold">£{product.price.toFixed(2)}</p>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(product.id, (quantities[product.id] - 1).toString())}
                        disabled={quantities[product.id] <= 0}
                        className="p-1 px-3 bg-gray-200 dark:bg-zinc-700 rounded-md hover:bg-gray-300 dark:hover:bg-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{quantities[product.id]}</span>
                      <button
                        type="button"
                        onClick={() => handleQuantityChange(product.id, (quantities[product.id] + 1).toString())}
                        className="p-1 px-3 bg-gray-200 dark:bg-zinc-700 rounded-md hover:bg-gray-300 dark:hover:bg-zinc-600"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddToCart(product, quantities[product.id])}
                      className="py-2 px-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-md hover:from-blue-600 hover:to-cyan-600 whitespace-nowrap"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        <PreorderInfo /> {/* Integrated PreorderInfo */}
      </main>
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
}
