import Image from "next/image";
import { products } from "../lib/products";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black p-4">
      <main className="w-full max-w-4xl py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Our Delicious Filipino Desserts</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white dark:bg-zinc-800 rounded-lg shadow-md overflow-hidden">
              <Image
                src={product.imageUrl}
                alt={product.name}
                width={300}
                height={200}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-3">{product.description}</p>
                <p className="text-lg font-bold text-right">${product.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
