import React, { useEffect, useState } from "react";
import { useApiFetcher } from "../hooks/useApiFetcher";
import { useAuth } from "../context/AuthContext";
import PriceChart from "./PriceChart";
import { Loader } from "./Loader";
import { useNavigate } from "react-router-dom";
import { ProductService } from "../apis/product/product";

const amazonIcon =
  "https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg";
const flipkartIcon =
  "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/flipkart-icon.png";

interface Product {
  productImageUrl: string;
  productTitle: string;
  targetPrice: string;
  productUrl: string;
  productId: string;
}

const formatINR = (price: string | number): string => {
  const amount = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
};

const Dashboard: React.FC = () => {
  const { authToken, isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const { data, error, loading, fetchData: fetchProducts } = useApiFetcher();
  const { data: deleteResponse, fetchData: fetchDelete } = useApiFetcher();
  const [showChartFor, setShowChartFor] = useState<Product | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthLoading) return;

    if (!authToken) {
      navigate("/login");
      return;
    }

    fetchProducts(
      ProductService.getProduct().url,
      ProductService.getProduct().options
    );
  }, [authToken, isAuthLoading, fetchProducts, navigate]);

  useEffect(() => {
    if (deleteResponse !== null && deleteResponse?.status === 200) {
      const { url, options } = ProductService.getProduct();
      fetchProducts(url, options);
    }
  }, [deleteResponse]);

  const handleDelete = async (productId: string, targetPrice: string) => {
    if (!authToken) return;
    try {
      const deleteRequest = ProductService.deleteProduct(
        productId,
        targetPrice
      );
      fetchDelete(deleteRequest.url, deleteRequest.options);
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };

  if (isAuthLoading || loading) return <Loader />;
  if (error)
    return (
      <p className="text-center text-red-500 dark:text-red-400">
        Failed to load products.
      </p>
    );
  if (!data || data.status !== 200 || !data.body) return null;

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 pt-4 md:pt-6 pb-10">
        <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 py-4 transition-colors duration-300">
          <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
            Your Tracked Products
          </h1>
        </div>

        {data.body.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-8">
            No products added yet. Start tracking a product to see it here.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {data.body.map((product: Product) => (
              <div
                key={product.productId + product.targetPrice}
                className="bg-white dark:bg-gray-800 shadow-md dark:shadow-gray-700/30 rounded-2xl p-4 flex flex-col h-full relative transition-colors duration-300 hover:shadow-lg dark:hover:shadow-gray-700/50"
              >
                <div className="absolute top-3 right-3">
                  <button
                    onClick={() =>
                      setOpenMenuId(
                        openMenuId === product.productId + product.targetPrice
                          ? null
                          : product.productId + product.targetPrice
                      )
                    }
                    className="text-xl font-bold text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
                  >
                    ⋮
                  </button>

                  {openMenuId === product.productId + product.targetPrice && (
                    <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-lg rounded-md z-10">
                      <button
                        onClick={() => {
                          handleDelete(product.productId, product.targetPrice);
                          setOpenMenuId(null);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-red-50 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <img
                    src={
                      product.productId.startsWith("amazon")
                        ? amazonIcon
                        : product.productId.startsWith("flipkart")
                        ? flipkartIcon
                        : undefined
                    }
                    alt="platform"
                    className="w-6 h-6 absolute top-0 left-0 m-2 z-10 bg-white dark:bg-gray-800 rounded-sm p-0.5"
                  />
                  <img
                    src={product.productImageUrl}
                    alt={product.productTitle}
                    className="w-full h-48 object-contain mb-4 bg-gray-50 dark:bg-gray-700 rounded-lg transition-colors duration-300"
                  />
                </div>
                <a
                  href={product?.productUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200">
                    {product.productTitle}
                  </h3>
                </a>

                <div className="mt-auto">
                  <p className="text-red-600 dark:text-red-400 font-semibold">
                    Your set target price: {formatINR(product.targetPrice)}
                  </p>
                  <button
                    onClick={() => setShowChartFor(product)}
                    className="mt-1 text-sm text-blue-600 dark:text-blue-400 hover:underline transition-colors duration-200"
                  >
                    View Price History
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showChartFor && (
        <div className="fixed inset-0 bg-black bg-opacity-40 dark:bg-black dark:bg-opacity-60 flex items-center justify-center z-50 transition-colors duration-300">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-11/12 md:w-2/3 lg:w-1/2 p-6 relative transition-colors duration-300">
            <button
              onClick={() => setShowChartFor(null)}
              className="absolute top-2 right-4 text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white text-xl font-bold transition-colors duration-200"
            >
              ×
            </button>
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
              {showChartFor.productTitle} - Price History
            </h2>
            <PriceChart productId={showChartFor.productId} />
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
