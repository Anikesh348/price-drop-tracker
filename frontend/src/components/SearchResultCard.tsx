import { Loader } from "./Loader";
import React, { useState } from "react";

export const SearchResultCard = ({
  product,
  handleProtectedAction,
  loading,
}: {
  product: {
    image_url: string;
    title: string;
    price: string;
    product_url: string;
  };
  handleProtectedAction: (targetPrice: string, productUrl: string) => void;
  loading: boolean;
}) => {
  const [targetPrice, setTargetPrice] = useState("");

  const handleTrack = (productUrl: string) => {
    if (targetPrice !== "") {
      handleProtectedAction(targetPrice, productUrl);
      setTargetPrice("");
    }
  };

  return (
    <div className="glass-card border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-500 transition-all">
      <img
        src={product.image_url}
        alt={product.title}
        className="w-full sm:w-20 h-20 object-contain rounded-lg flex-shrink-0 bg-white dark:bg-gray-800"
      />

      <div className="flex flex-col flex-grow min-w-0">
        <a href={product?.product_url} target="_blank" rel="noreferrer">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors mb-1 line-clamp-2">
            {product.title}
          </h2>
        </a>
        <p className="text-base font-bold text-blue-600 dark:text-blue-400">
          ₹{product.price}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto sm:ml-auto flex-shrink-0">
        <input
          type="number"
          placeholder="Target"
          value={targetPrice}
          onChange={(e) => setTargetPrice(e.target.value)}
          className="
            px-3 py-2 text-sm rounded-lg
            border border-gray-200 dark:border-gray-600
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-white
            placeholder-gray-500 dark:placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition
            sm:w-24
          "
        />
        <button
          onClick={() => handleTrack(product.product_url)}
          disabled={!targetPrice || loading}
          type="button"
          className="
            bg-gradient-to-r from-blue-600 to-purple-600
            text-white font-semibold text-sm rounded-lg
            px-4 py-2
            hover:shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
            transition-all flex items-center justify-center min-w-fit
          "
        >
          {loading ? (
            <div className="w-4 h-4">
              <Loader />
            </div>
          ) : (
            "Track"
          )}
        </button>
      </div>
    </div>
  );
};
