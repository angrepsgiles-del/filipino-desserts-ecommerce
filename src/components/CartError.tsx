"use client";

import { useCart } from "@/context/CartContext";

const CartError = () => {
    const { error } = useCart();

    if (!error) return null;

    return (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg z-50">
            {error}
        </div>
    );
};

export default CartError;
