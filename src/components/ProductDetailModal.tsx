"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Product } from "@/lib/products";
import { useCart } from "@/context/CartContext";

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState<number>(1);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    if (quantity > 0) {
      addToCart(product, quantity);
      setQuantity(1); // Reset quantity after adding to cart
      onClose(); // Close modal after adding
    } else {
      // Optionally show a message
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center items-center backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-zinc-800 rounded-lg shadow-xl p-6 w-11/12 md:w-2/3 lg:w-1/2 max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()} // Prevent modal from closing when clicking inside
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-zinc-500 hover:text-zinc-700 dark:text-zinc-300 dark:hover:text-zinc-100 text-2xl font-bold"
        >
          &times;
        </button>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-1/2">
            <Image
              src={product.imageUrl}
              alt={product.name}
              width={400}
              height={300}
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>
          <div className="md:w-1/2 flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2 text-black dark:text-white">
                {product.name}
              </h2>
              <p className="text-xl font-semibold mb-4 text-black dark:text-white">
                £{product.price.toFixed(2)}
              </p>
              <p className="text-zinc-600 dark:text-zinc-400 mb-4">
                {product.description}
              </p>
            </div>
            <div className="flex items-center gap-2 mt-4">
                <div className="flex items-center space-x-2">
                    <button
                        type="button"
                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                        className="p-1 px-3 bg-gray-200 dark:bg-zinc-700 rounded-md hover:bg-gray-300 dark:hover:bg-zinc-600"
                    >
                        -
                    </button>
                    <span className="w-8 text-center">{quantity}</span>
                    <button
                        type="button"
                        onClick={() => setQuantity(prev => prev + 1)}
                        className="p-1 px-3 bg-gray-200 dark:bg-zinc-700 rounded-md hover:bg-gray-300 dark:hover:bg-zinc-600"
                    >
                        +
                    </button>
                </div>
                <button
                    onClick={handleAddToCart}
                    className="py-2 px-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-md hover:from-blue-600 hover:to-cyan-600 whitespace-nowrap"
                >
                    Add to Cart
                </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
