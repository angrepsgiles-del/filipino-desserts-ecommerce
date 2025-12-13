"use client";

import React, { useState } from "react";
import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { loadStripe } from "@stripe/stripe-js";

// Make sure to call loadStripe outside of a component’s render to avoid
// recreating the Stripe object on every render.
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const { cart, removeFromCart, updateQuantity, getTotalPrice, getTotalItems, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: cart }),
      });

      if (!response.ok) {
        throw new Error("Failed to create Stripe Checkout Session");
      }

      const { sessionUrl } = await response.json();

      // Redirect to Stripe Checkout
      window.location.href = sessionUrl;
      clearCart(); // Clear cart after redirecting to checkout
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("Failed to proceed to checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-zinc-800 rounded-lg shadow-xl p-6 w-11/12 md:w-1/2 lg:w-1/3 max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
      >
        <button onClick={onClose} className="absolute top-3 right-3 text-zinc-500 hover:text-zinc-700 dark:text-zinc-300 dark:hover:text-zinc-100 text-2xl font-bold">
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">Your Cart ({getTotalItems()} items)</h2>

        {cart.length === 0 ? (
          <p className="text-zinc-600 dark:text-zinc-400">Your cart is empty.</p>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 border-b border-zinc-200 dark:border-zinc-700 pb-4">
                <Image src={item.imageUrl} alt={item.name} width={60} height={60} className="rounded object-cover" />
                <div className="flex-grow">
                  <h3 className="text-lg font-semibold text-black dark:text-white">{item.name}</h3>
                  <p className="text-zinc-600 dark:text-zinc-400">£{item.price.toFixed(2)} x {item.quantity}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                    className="w-16 p-1 border border-zinc-300 rounded-md text-center bg-zinc-100 dark:bg-zinc-700 dark:border-zinc-600"
                  />
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <div className="pt-4 border-t border-zinc-200 dark:border-zinc-700 flex justify-between items-center text-xl font-bold text-black dark:text-white">
              <span>Total:</span>
              <span>£{getTotalPrice().toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={loading || cart.length === 0}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-md mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : "Proceed to Checkout"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartModal;

