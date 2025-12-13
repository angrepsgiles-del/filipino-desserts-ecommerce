import React from 'react';

const PreorderInfo = () => {
  return (
    <div className="w-full max-w-4xl p-6 my-8 rounded-lg shadow-lg
                    bg-white/30 dark:bg-zinc-800/30 backdrop-blur-md
                    border border-white/20 dark:border-zinc-700/50
                    bg-gradient-to-br from-purple-200 via-pink-200 to-red-200
                    dark:from-purple-800 dark:via-pink-800 dark:to-red-800
                    text-black dark:text-white">
      <p className="text-lg mb-4">
        baked in small batches, inspired by filipino classics, and made to be eaten fresh — not warehoused, not rushed.
      </p>
      <h3 className="text-xl font-bold mb-2">Why preorder?</h3>
      <p className="text-lg">
        We bake to order so nothing sits around pretending to be fresh. Preorder windows open weekly. Once it’s gone, it’s gone.
      </p>
    </div>
  );
};

export default PreorderInfo;
