"use client"; // This component needs client-side interactivity
import { useState, useRef } from "react";
import Link from "next/link";
import { products, Product } from "../lib/products";
import { useCart } from "../context/CartContext"; // Import useCart
import GawaKamayHeadline from "../components/GawaKamayHeadline"; // Import GawaKamayHeadline
import PreorderInfo from "../components/PreorderInfo"; // Import PreorderInfo
import ProductDetailModal from "../components/ProductDetailModal"; // Import ProductDetailModal

import styles from './panghimagas.module.css';

export default function Home() {
  const { addToCart } = useCart(); // Use the cart context
  const [quantities, setQuantities] = useState<{ [key: string]: number }>(
    products.reduce((acc, product) => ({ ...acc, [product.id]: 0 }), {})
  );
  const [toast, setToast] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null); // State for selected product
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false); // State for product detail modal

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
      setToast({ type: "success", text: `${quantity}x ${product.name} added. go to cart →` });
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
      toastTimeoutRef.current = setTimeout(() => {
        setToast(null);
      }, 3000);
      setQuantities((prev) => ({ ...prev, [product.id]: 0 }));
    } else {
      setToast({ type: "error", text: "Please select a quantity greater than 0." });
      if (toastTimeoutRef.current) {
        clearTimeout(toastTimeoutRef.current);
      }
      toastTimeoutRef.current = setTimeout(() => {
        setToast(null);
      }, 3000);
    }
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-gradient-to-br from-yellow-200 via-purple-300 to-green-200 dark:from-yellow-700 dark:via-purple-800 dark:to-green-700 font-sans p-4">

      <GawaKamayHeadline /> {/* Integrated GawaKamayHeadline */}
      <main className="w-full max-w-4xl py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Our Panghimagas - Desserts </h1>

        {toast && (
          <div className={`fixed top-5 left-1/2 -translate-x-1/2 p-4 rounded-md shadow-lg text-white z-50 ${toast.type === "success" ? "bg-green-500" : "bg-red-500"}`}>
            {toast.text.includes("go to cart") ? (
              <p>
                {toast.text.split("go to cart")[0]}
                <Link href="/cart" className="font-bold underline ml-2">
                  go to cart →
                </Link>
              </p>
            ) : (
              toast.text
            )}
          </div>
        )}

        <div className={styles.liquidFrame}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className={`${styles.liquidCard} bg-white/30 dark:bg-zinc-800/30 rounded-lg shadow-lg backdrop-blur-md overflow-hidden flex flex-col cursor-pointer`} onClick={() => handleProductClick(product)}>
                <div className="w-full h-48 flex items-center justify-center bg-gray-200 text-gray-700 text-center font-bold">
                  {product.name}
                </div>
                <div className="p-4 flex-grow flex flex-col">
                  <h2 className="text-xl font-extrabold mb-2 text-zinc-900 dark:text-white">{product.name}</h2>
                  <p className="text-zinc-800 dark:text-zinc-400 text-sm mb-3 flex-grow">{product.shortDescription}</p>
                  <div className="flex items-center justify-between mt-auto pt-2 gap-2 flex-wrap">
                    <p className="text-lg text-zinc-900 font-extrabold dark:text-white">£{product.price.toFixed(2)}</p>
                    <div className="flex items-center space-x-2">
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleQuantityChange(product.id, (quantities[product.id] - 1).toString()); }}
                        disabled={quantities[product.id] <= 0}
                        className="p-1 px-3 bg-gray-200 dark:bg-zinc-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:animate-pulse hover:bg-gradient-to-r hover:from-yellow-300 hover:to-red-400 active:ring-4 active:ring-red-200/70 active:scale-[0.98]"
                      >
                        -
                      </button>
                      <span className="w-fit text-center text-zinc-900 dark:text-zinc-100 font-extrabold bg-white/40 dark:bg-black/20 rounded px-2 py-0.5">
                        {quantities[product.id]}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleQuantityChange(product.id, (quantities[product.id] + 1).toString()); }}
                        className="p-1 px-3 bg-gray-200 dark:bg-zinc-700 rounded-md hover:animate-pulse hover:bg-gradient-to-r hover:from-yellow-300 hover:to-red-400 active:ring-4 active:ring-red-200/70 active:scale-[0.98]"
                      >
                        +
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); handleAddToCart(product, quantities[product.id]); }}
                      className="py-2 px-4 bg-gradient-to-r from-yellow-400 to-amber-500 text-zinc-900 rounded-md hover:animate-pulse hover:from-yellow-500 hover:to-amber-600 active:ring-4 active:ring-red-200/70 active:scale-[0.98] whitespace-nowrap"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <PreorderInfo /> {/* Integrated PreorderInfo */}
      </main>
      <ProductDetailModal
        product={selectedProduct}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
      />
    </div>
  );
}