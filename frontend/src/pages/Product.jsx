import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/cartSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Product = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // Mock product data - thay bằng API call thực
  useEffect(() => {
    const mockProduct = {
      id: productId || 1,
      name: "Bamboo Toothbrush Set",
      price: 15.99,
      image: "https://via.placeholder.com/400x400?text=Bamboo+Toothbrush",
      category: "personal-care",
      description:
        "Eco-friendly bamboo toothbrush set made from sustainable bamboo. BPA-free bristles and naturally biodegradable handle.",
      features: [
        "100% Biodegradable",
        "Eco-Friendly Packaging",
        "Soft Bristles",
        "Sustainable Bamboo",
      ],
      inStock: true,
      rating: 4.5,
      reviews: 128,
    };

    setProduct(mockProduct);
    setLoading(false);
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(
        addToCart({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: parseInt(quantity),
        }),
      );
      toast.success("Added to cart!", {
        position: "bottom-right",
        autoClose: 2000,
      });
      setQuantity(1);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-gray-600">Product not found</div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <ToastContainer />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="flex justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-full max-w-md h-auto rounded-lg shadow-lg"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-start gap-4">
          {/* Category */}
          <div className="text-sm text-green-600 font-semibold">
            {product.category.replace("-", " ").toUpperCase()}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex text-yellow-400">
              {"★".repeat(Math.floor(product.rating))}
              {"☆".repeat(5 - Math.floor(product.rating))}
            </div>
            <span className="text-sm text-gray-600">
              {product.rating} ({product.reviews} reviews)
            </span>
          </div>

          {/* Price */}
          <div className="text-3xl font-bold text-green-600">
            ${product.price.toFixed(2)}
          </div>

          {/* Description */}
          <p className="text-gray-700 leading-relaxed text-lg">
            {product.description}
          </p>

          {/* Features */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Features:</h3>
            <ul className="space-y-2">
              {product.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2 text-gray-700">
                  <span className="text-green-600 font-bold">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Stock Status */}
          <div className="py-3 px-4 bg-green-50 rounded-lg">
            {product.inStock ? (
              <p className="text-green-700 font-semibold">✓ In Stock</p>
            ) : (
              <p className="text-red-700 font-semibold">Out of Stock</p>
            )}
          </div>

          {/* Quantity & Add to Cart */}
          <div className="flex gap-4 items-center pt-4">
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-gray-600 hover:bg-gray-100">
                −
              </button>
              <input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                className="w-16 text-center border-l border-r border-gray-300 py-2 outline-none"
                min="1"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 text-gray-600 hover:bg-gray-100">
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`flex-1 py-3 px-6 rounded-lg font-semibold text-white transition ${
                product.inStock
                  ? "bg-green-600 hover:bg-green-700 cursor-pointer"
                  : "bg-gray-400 cursor-not-allowed"
              }`}>
              {product.inStock ? "Add to Cart" : "Out of Stock"}
            </button>
          </div>

          {/* Additional Info */}
          <div className="pt-6 border-t border-gray-200 space-y-2 text-sm text-gray-600">
            <p>✓ Free shipping on orders over $50</p>
            <p>✓ 30-day money-back guarantee</p>
            <p>✓ Eco-friendly packaging</p>
          </div>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="mt-16 pt-8 border-t border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Related Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((item) => (
            <div
              key={item}
              className="border rounded-lg overflow-hidden hover:shadow-lg transition">
              <img
                src={`https://via.placeholder.com/300x300?text=Product+${item}`}
                alt={`Related ${item}`}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 truncate">
                  Product {item}
                </h3>
                <p className="text-green-600 font-bold mt-2">$19.99</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Product;
