import React, { useState } from "react";
import marketItems from "./connectingcomponents/marketItems";
import { Label } from "./components/ui/label";
import { Input } from "./components/ui/input";
import { cn } from "./lib/utils";
import { useAuth } from "./context/AuthContext";

const SellBuyPage = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [priceRange, setPriceRange] = useState(25000);
  const [sortOption, setSortOption] = useState("Newest First");
  const [showForm, setShowForm] = useState(false);
  const [newListing, setNewListing] = useState({
    title: "",
    price: "",
    category: "",
    imageUrl: "",
    description: "",
    whatsappNumber: "",
  });

  const { user } = useAuth();

  const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    return Number(priceStr.replace(/[^0-9]/g, ""));
  };

  const categories = Array.from(
    new Set(marketItems.map((item) => item.category))
  );

  const filteredProducts = marketItems.filter((item) => {
    const priceNum = parsePrice(item.price);
    return (
      item.title.toLowerCase().includes(search.toLowerCase()) &&
      (category === "All Categories" || item.category === category) &&
      priceNum <= priceRange
    );
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    const priceA = parsePrice(a.price);
    const priceB = parsePrice(b.price);

    switch (sortOption) {
      case "Price: Low to High":
        return priceA - priceB;
      case "Price: High to Low":
        return priceB - priceA;
      default:
        return 0;
    }
  });

  const resetFilters = () => {
    setSearch("");
    setCategory("All Categories");
    setPriceRange(25000);
  };

  const handleInputChange = (e) => {
    setNewListing({ ...newListing, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New Listing:", newListing);
    setShowForm(false);
    setNewListing({
      title: "",
      price: "",
      category: "",
      imageUrl: "",
      description: "",
      whatsappNumber: "",
    });
  };

  const handleSellClick = () => {
    if (!user) {
      alert("Please log in to submit a listing.");
      return;
    }
    setShowForm(true);
  };

  return (
    <div className="bg-black text-white min-h-screen p-4 flex flex-col md:flex-row py-24">
      {/* Sell Button */}
      <button
        onClick={handleSellClick}
        className="fixed bottom-6 right-6 z-50 bg-green-600 hover:bg-green-700 transition-all duration-300 text-white py-2 px-4 rounded-full shadow-lg"
      >
        + Sell / Add Listing
      </button>

      {/* Modal */}
      {showForm && user && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center px-4 sm:px-6"
          onClick={() => setShowForm(false)}
        >
          <div
            className="bg-gray-900 rounded-2xl shadow-2xl p-4 sm:p-6 w-full max-w-md sm:max-w-lg max-h-[95vh] flex flex-col text-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl sm:text-2xl font-bold mb-5 text-white">
              🛍️ Add New Listing
            </h2>

            <form
              onSubmit={handleSubmit}
              className="space-y-5 overflow-y-auto flex-grow pr-2"
              style={{ maxHeight: "calc(95vh - 120px)" }}
            >
              <LabelInputContainer>
                <Label htmlFor="title" className="text-gray-300">
                  Title*
                </Label>
                <Input
                  name="title"
                  value={newListing.title}
                  onChange={handleInputChange}
                  required
                  placeholder="Listing title"
                  className="bg-gray-800 text-gray-100"
                />
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="price" className="text-gray-300">
                  Price (₹)*
                </Label>
                <Input
                  name="price"
                  value={newListing.price}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., 1000"
                  className="bg-gray-800 text-gray-100"
                />
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="category" className="text-gray-300">
                  Category*
                </Label>
                <Input
                  name="category"
                  value={newListing.category}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Electronics"
                  className="bg-gray-800 text-gray-100"
                />
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="imageUrl" className="text-gray-300">
                  Image URL
                </Label>
                <Input
                  name="imageUrl"
                  value={newListing.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                  className="bg-gray-800 text-gray-100"
                />
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="description" className="text-gray-300">
                  Description
                </Label>
                <textarea
                  name="description"
                  value={newListing.description}
                  onChange={handleInputChange}
                  placeholder="Details about your listing"
                  className="w-full p-2 rounded bg-gray-800 text-gray-100 border border-gray-700"
                  rows={3}
                />
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="whatsappNumber" className="text-gray-300">
                  WhatsApp Number
                </Label>
                <Input
                  name="whatsappNumber"
                  value={newListing.whatsappNumber}
                  onChange={handleInputChange}
                  placeholder="e.g., 919876543210"
                  className="bg-gray-800 text-gray-100"
                />
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="userEmail" className="text-gray-300">
                  Your Email
                </Label>
                <Input
                  name="userEmail"
                  type="email"
                  value={user?.email || ""}
                  readOnly
                  className="cursor-not-allowed bg-gray-700 text-gray-400"
                />
              </LabelInputContainer>

              <div className="flex justify-end gap-3 pt-6">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white text-sm font-medium"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sidebar Filters */}
      <div className="md:w-1/5 w-full md:pr-6 mb-4 md:mb-0">
        <div className="sticky top-4 space-y-4 bg-gray-900 p-4 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold">Filters</h2>
          <button
            onClick={resetFilters}
            className="text-sm underline text-red-400 hover:text-red-300 relative"
          >
            Reset All
            <BottomGradient />
          </button>

          <input
            type="text"
            placeholder="Search products..."
            className="w-full p-2 bg-gray-800 rounded"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div>
            <label className="block mb-1">Category</label>
            <select
              className="w-full p-2 bg-gray-800 rounded"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option>All Categories</option>
              {categories.map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1">Price Range</label>
            <input
              type="range"
              min="0"
              max="25000"
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full"
            />
            <div className="text-sm mt-1">
              ₹0 - ₹{priceRange.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      {/* Product Listing */}
      <div className="md:w-4/5 w-full">
        <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-4">
          <h2 className="text-xl font-semibold mb-2 sm:mb-0">
            Showing {sortedProducts.length} product(s)
          </h2>
          <select
            className="bg-gray-800 p-2 rounded"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option>Newest First</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-gray-900 rounded-lg shadow-md p-4 hover:scale-[1.02] transition-transform duration-300 hover:shadow-xl"
            >
              <img
                src={product.imageUrl}
                alt={product.title}
                className="rounded w-full h-48 object-cover"
              />
              <h3 className="text-lg font-semibold mt-2">{product.title}</h3>
              <p className="text-blue-400 font-bold">{product.price}</p>
              <p className="text-sm text-gray-300 mb-2">
                {product.description}
              </p>
              {product.whatsappNumber && (
                <a
                  href={`https://wa.me/${product.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 text-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.52 3.48A11.87 11.87 0 0 0 3.5 20.5L2 24l3.57-1.46a11.86 11.86 0 0 0 14.95-19.06zM12 21.3a9.3 9.3 0 0 1-4.74-1.3l-.34-.2-2.53.99.93-2.46-.22-.35A9.29 9.29 0 1 1 21.3 12 9.31 9.31 0 0 1 12 21.3zm5.06-6.66c-.28-.14-1.65-.82-1.91-.91s-.45-.14-.64.14-.73.91-.9 1.1-.33.21-.61.07a7.64 7.64 0 0 1-2.25-1.38 8.47 8.47 0 0 1-1.57-1.94c-.16-.28-.02-.43.12-.57.13-.13.29-.34.43-.51s.19-.28.29-.46a.54.54 0 0 0 0-.51c-.14-.14-.64-1.55-.88-2.12s-.47-.47-.64-.48-.35 0-.54 0a1.03 1.03 0 0 0-.74.34 3.08 3.08 0 0 0-.96 2.29 5.36 5.36 0 0 0 1.14 2.91 12.41 12.41 0 0 0 4.82 4.11 13.39 13.39 0 0 0 1.29.48 3.13 3.13 0 0 0 1.43.09c.44-.06 1.36-.56 1.55-1.1s.19-1 .14-1.1-.26-.14-.54-.28z" />
                  </svg>
                  Chat on WhatsApp
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SellBuyPage;

const LabelInputContainer = ({ children, className }) => (
  <div className={cn("flex w-full flex-col space-y-1", className)}>
    {children}
  </div>
);

const BottomGradient = () => (
  <>
    <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
    <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
  </>
);
