import React, { useEffect, useState } from "react";
import axios from "axios"; // Axios with credentials
import { Label } from "./components/ui/label";
import { Input } from "./components/ui/input";
import { cn } from "./lib/utils";
import { useAuth } from "./context/AuthContext";
import { USER_API_ENDPOINT } from "../constants";

export const Loader = () => (
  <div className="flex flex-col justify-center items-center min-h-[40vh] space-y-4">
    <div className="relative w-16 h-16">
      <div className="absolute w-full h-full border-4 border-t-transparent border-cyan-400 rounded-full animate-spin" />
      <div className="absolute inset-2 border-4 border-t-transparent border-indigo-400 rounded-full animate-spin-slow" />
    </div>
    <p className="text-cyan-400 text-lg font-semibold tracking-wide animate-pulse">
      Loading listings, please wait...
    </p>
  </div>
);

export const getImageSrc = (photo) => {
  if (!photo?.data?.data || !photo?.contentType) return "";

  const byteArray = new Uint8Array(photo.data.data); // Convert to typed array
  const blob = new Blob([byteArray], { type: photo.contentType }); // Create blob
  return URL.createObjectURL(blob); // Return object URL
};
const SellBuyPage = () => {
  const [search, setSearch] = useState("");
  const { user } = useAuth();
  const [category, setCategory] = useState("All Categories");
  const [priceRange, setPriceRange] = useState(25000);
  const [sortOption, setSortOption] = useState("Newest First");
  const [showForm, setShowForm] = useState(false);
  const [marketItems, setMarketItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newListing, setNewListing] = useState({
    title: "",
    price: "",
    category: "",
    description: "",
    whatsappNumber: "",
    email: user?.email || "",
  });
  const [imageFile, setImageFile] = useState(null);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${USER_API_ENDPOINT}/api/sellbuys/listings`);

      const listingsWithImages = res.data.map((item) => ({
        ...item,
        imageSrc: getImageSrc(item.photo), // generate src here
      }));
      console.log("Fetched listings:", listingsWithImages);

      setMarketItems(listingsWithImages); // update state
    } catch (err) {
      setError("Failed to load listings.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchListings();
  }, []);

  const parsePrice = (priceStr) => {
    if (priceStr == null) return 0;
    return Number(String(priceStr).replace(/[^0-9]/g, ""));
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

  // Before submitting, format properly (example)

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      alert("Please upload an image.");
      return;
    }

    // Spinner Loader Component

    const formatWhatsApp = (num) => {
      const cleaned = num.replace(/\D/g, "");
      return cleaned.startsWith("91") ? cleaned : `91${cleaned}`;
    };

    const formData = new FormData();
    formData.append("title", newListing.title);
    formData.append("price", newListing.price);
    formData.append("category", newListing.category);
    formData.append("description", newListing.description);
    formData.append(
      "whatsappNumber",
      formatWhatsApp(newListing.whatsappNumber)
    );
    formData.append("email", user.email);
    formData.append("file", imageFile);
    try {
      const res = await axios.post(
        `${USER_API_ENDPOINT}/api/sellbuys/listings`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      alert("Listing created successfully!");
      setMarketItems((prev) => [res.data.data, ...prev]);
      setShowForm(false);
      setNewListing({
        title: "",
        price: "",
        category: "",
        description: "",
        whatsappNumber: "",
        email: user?.email || "",
      });
      setImageFile(null);
      fetchListings(); // Refresh listings
    } catch (error) {
      console.error(
        "Failed to submit listing:",
        error.response?.data || error.message
      );
      alert(
        `Failed to create listing. Reason: ${
          error.response?.data?.error || "Unknown error"
        }`
      );
    }
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
            className="bg-gray-900 rounded-2xl shadow-2xl p-4 sm:p-6 w-full max-w-md sm:max-w-lg max-h-[95vh] flex flex-col text-gray-100 custom-scrollbar"
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
                <Label
                  htmlFor="photo"
                  className="text-sm font-semibold text-gray-300 mb-2 block"
                >
                  Upload Image*
                </Label>

                <label htmlFor="photo" className="w-full cursor-pointer">
                  <div className="flex items-center justify-center w-full p-4 bg-gray-800 text-gray-300 border border-gray-600 rounded-lg shadow-sm hover:bg-gray-700 transition">
                    <div className="flex flex-col items-center space-y-2">
                      <svg
                        className="w-8 h-8 text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                      <span className="text-sm">
                        Tap to upload or drag and drop
                      </span>
                    </div>
                  </div>
                </label>

                <input
                  id="photo"
                  type="file"
                  accept="image/*"
                  required
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    console.log("Picked file:", file);
                    setImageFile(file);
                  }}
                  className="hidden"
                />

                {imageFile && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-400 mb-1">
                      Selected image:
                    </p>
                    <img
                      src={URL.createObjectURL(imageFile)}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded border border-gray-600"
                    />
                  </div>
                )}
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
            {loading
              ? "Loading listings..."
              : `Showing ${sortedProducts.length} product(s)`}
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

        {error && <p className="text-red-500 mb-4">{error}</p>}

        {loading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProducts.map((product) => (
              <div
                key={product._id}
                className="relative bg-gray-900 rounded-lg shadow-md p-4 hover:scale-[1.02] transition-transform duration-300 hover:shadow-xl"
              >
                {/* 🗑 Delete Button - Top Right */}
                {user?.email === product.email && (
                  <button
                    onClick={async () => {
                      try {
                        await axios.delete(
                          `${USER_API_ENDPOINT}/api/sellbuys/listings/${product._id}`,
                          {
                            withCredentials: true,
                          }
                        );
                        setMarketItems((prev) =>
                          prev.filter((item) => item._id !== product._id)
                        );
                      } catch {
                        alert("Failed to delete listing.");
                      }
                    }}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-400 z-10"
                    title="Delete listing"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                )}
                {product.imageSrc && (
                  <img
                    src={product.imageSrc}
                    alt={product.title}
                    className="w-full h-48 object-cover rounded"
                  />
                )}
                <h3 className="text-lg font-semibold mt-2">{product.title}</h3>
                <p className="text-blue-400 font-bold">₹{product.price}</p>
                <p className="text-sm text-gray-300">{product.description}</p>
                <p className="text-sm text-gray-300 mb-8">
                  Posted by: {product.email}
                </p>{" "}
                {/* Give space at bottom */}
                {/* 📲 WhatsApp Icon - Bottom Right */}
                {product.whatsappNumber && (
                  <a
                    href={`https://wa.me/${product.whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-3 right-3 text-green-400 hover:text-green-300"
                    title="Contact on WhatsApp"
                  >
                    <svg
                      height="24"
                      width="24"
                      viewBox="0 0 58 58"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill="#2CB742"
                        d="M0,58l4.988-14.963C2.457,38.78,1,33.812,1,28.5C1,12.76,13.76,0,29.5,0S58,12.76,58,28.5 S45.24,57,29.5,57c-4.789,0-9.299-1.187-13.26-3.273L0,58z"
                      />
                      <path
                        fill="#FFFFFF"
                        d="M47.683,37.985c-1.316-2.487-6.169-5.331-6.169-5.331c-1.098-0.626-2.423-0.696-3.049,0.42
                  c0,0-1.577,1.891-1.978,2.163c-1.832,1.241-3.529,1.193-5.242-0.52l-3.981-3.981l-3.981-3.981
                  c-1.713-1.713-1.761-3.41-0.52-5.242c0.272-0.401,2.163-1.978,2.163-1.978c1.116-0.627,1.046-1.951,0.42-3.049
                  c0,0-2.844-4.853-5.331-6.169c-1.058-0.56-2.357-0.364-3.203,0.482l-1.758,1.758c-5.577,5.577-2.831,11.873,2.746,17.45
                  l5.097,5.097l5.097,5.097c5.577,5.577,11.873,8.323,17.45,2.746l1.758-1.758C48.048,40.341,48.243,39.042,47.683,37.985z"
                      />
                    </svg>
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
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
