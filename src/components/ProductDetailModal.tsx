"use client";

import React from "react";
import Image from "next/image";
import { Product } from "@/lib/products";

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
  if (!isOpen || !product) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center backdrop-blur-sm"
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
            {/* Add to cart functionality might be added here too */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
