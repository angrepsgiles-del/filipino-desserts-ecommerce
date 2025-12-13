"use client";
import { useCart } from "../../context/CartContext";

const CartPage = () => {
  const { cart, getTotalPrice } = useCart();

  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-yellow-200 via-purple-300 to-green-200 dark:from-yellow-700 dark:via-purple-800 dark:to-green-700 font-sans p-4">
      <main className="w-full max-w-4xl py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Your Cart</h1>
        <div className="bg-white/30 dark:bg-zinc-800/30 rounded-lg shadow-lg backdrop-blur-md border border-white/20 dark:border-zinc-700/50 p-6">
          {cart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div>
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between items-center mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">{item.name}</h2>
                    <p className="text-zinc-600 dark:text-zinc-400">
                      {item.quantity} x £{item.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="text-lg font-bold">
                    £{(item.quantity * item.price).toFixed(2)}
                  </p>
                </div>
              ))}
              <hr className="my-4" />
              <div className="flex justify-between items-center">
                <p className="text-xl font-bold">Total:</p>
                <p className="text-xl font-bold">£{getTotalPrice().toFixed(2)}</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CartPage;
