import React, { useState, useMemo, useEffect } from "react";
import { Label } from "./components/ui/label";
import { Input } from "./components/ui/input";
import { cn } from "./lib/utils";
import { useAuth } from "./context/AuthContext";
import { USER_API_ENDPOINT } from "../constants";
import axios from "axios";
import { getImageSrc } from "./SellBuyPage";

// Sample data
const Loader = ({ message = "Loading, please wait..." }) => (
  <div className="fixed inset-0 flex flex-col justify-center items-center bg-black bg-opacity-80 z-50">
    <svg
      className="animate-spin h-14 w-14 text-cyan-400"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-label="Loading spinner"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
      />
    </svg>
    <p className="mt-4 text-cyan-300 text-lg font-semibold">{message}</p>
  </div>
);


const WhatsappIcon = () => (
  <svg
  xmlns="http://www.w3.org/2000/svg"
  fill="currentColor"
  viewBox="0 0 24 24"
  className="w-6 h-6 text-white"
  aria-hidden="true"
  >
    <path d="M20.52 3.48A11.815 11.815 0 0012 0C5.373 0 0 5.373 0 12c0 2.11.554 4.088 1.52 5.82L0 24l6.29-1.56a11.82 11.82 0 005.71 1.44c6.627 0 12-5.373 12-12 0-1.93-.547-3.726-1.48-5.4zM12 21.82a9.77 9.77 0 01-5.25-1.5l-.38-.23-3.7.92.99-3.61-.25-.37A9.782 9.782 0 012.22 12c0-5.42 4.4-9.82 9.82-9.82 2.62 0 5.08 1.02 6.93 2.88a9.755 9.755 0 012.88 6.94c0 5.42-4.4 9.82-9.82 9.82zm5.42-7.62c-.29-.15-1.7-.84-1.96-.94-.26-.1-.44-.15-.63.15s-.72.94-.89 1.13c-.16.19-.32.21-.6.07-.29-.15-1.23-.45-2.35-1.45-.87-.78-1.46-1.75-1.63-2.04-.17-.29-.02-.45.13-.6.14-.14.3-.36.44-.54.14-.18.19-.31.29-.52.1-.21.05-.39-.03-.54-.08-.15-.63-1.52-.87-2.08-.23-.54-.47-.47-.63-.47-.16 0-.35-.02-.54-.02-.19 0-.5.07-.76.37-.26.29-1 1-1 2.45s1.03 2.83 1.17 3.03c.14.21 2.01 3.06 4.88 4.28.68.29 1.21.46 1.62.59.68.21 1.3.18 1.79.11.55-.08 1.7-.69 1.94-1.35.24-.66.24-1.23.17-1.35-.07-.11-.26-.18-.55-.32z" />
  </svg>
);

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

const LostAndFoundListing = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingItems, setIsLoadingItems] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");
  const [items, setItems] = useState([]);
  const [imageFile, setImageFile] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    photo: null, // ✅ new key
    contact: user?.email || "",
    whatsapp: "",
    date: "",
  });

  useEffect(() => {
    if (user?.email) {
      setNewItem((prev) => ({ ...prev, contact: user.email }));
    }
  }, [user]);

  const handleOpenModal = () => {
    if (!user) {
      alert("Please log in to add a lost/found item.");
      return;
    }
    setIsModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({ ...prev, [name]: value }));
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (
      !newItem.title ||
      !newItem.description ||
      !newItem.contact ||
      !newItem.whatsapp ||
      !newItem.date
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", newItem.title);
      formData.append("description", newItem.description);
      formData.append("contact", newItem.contact);
      formData.append("whatsapp", newItem.whatsapp);
      formData.append("date", newItem.date);
      formData.append("file", imageFile);

      const res = await axios.post(
        `${USER_API_ENDPOINT}/api/l-f-items/`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setItems((prevItems) => [...prevItems, res.data]);
      setIsModalOpen(false);
      setImageFile(null);
      fetchItems();
      setNewItem({
        title: "",
        description: "",
        photo: null,
        contact: user?.email || "",
        whatsapp: "",
        date: "",
      });
    } catch (error) {
      console.error("Failed to add item:", error);
      alert("Error submitting item. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchItems = async () => {
    setIsLoadingItems(true);
    try {
      const res = await axios.get(`${USER_API_ENDPOINT}/api/l-f-items/`);
      const itemsWithImages = res.data.map((item) => ({
        ...item,
        imageSrc: getImageSrc(item.photo),
      }));
      setItems(itemsWithImages);
    } catch (error) {
      console.error("Failed to fetch items:", error);
    } finally {
      setIsLoadingItems(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const filteredItems = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize to midnight

    const filtered = items.filter((item) => {
      const itemDate = new Date(item.date || item.createdAt || 0);
      itemDate.setHours(0, 0, 0, 0);
      return (
        (item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
        itemDate <= today
      );
    });

    // 🔽 Apply sort order
    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.date || a.createdAt || 0);
      const dateB = new Date(b.date || b.createdAt || 0);
      return sortOrder === "newest"
        ? dateB - dateA // descending
        : dateA - dateB; // ascending
    });

    return sorted;
  }, [items, searchQuery, sortOrder]); // <-- Include sortOrder as a dependency

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (!confirmed) return;

    console.log("Attempting to delete item with ID:", id);

    try {
      await axios.delete(`${USER_API_ENDPOINT}/api/l-f-items/${id}`, {
        withCredentials: true, // include cookies or session tokens
      });

      console.log("Item deleted successfully");
      alert("Item deleted successfully!");

      setItems((prev) => prev.filter((item) => (item._id || item.id) !== id));
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete the item. Please try again.");
    }
  };

  return (
    <>
      <div className="overflow-x-hidden">
        <h1 className="text-3xl sm:text-4xl md:text-5xl leading-tight font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 mb-12 text-center drop-shadow-[0_4px_12px_rgba(255,255,255,0.1)] mt-28 hover:scale-105 transition-transform duration-300 cursor-pointer px-4">
          Lost Something? We’ve Got Your Back!
        </h1>
      </div>

      <main className="flex flex-col lg:flex-row gap-8 p-4 sm:p-6 bg-gradient-to-br from-orange-50 via-white to-orange-100 min-h-[80vh] custom-scrollbar">
        <aside className="w-full lg:w-80 p-4 sm:p-6 bg-gradient-to-br from-zinc-800 via-zinc-900 to-black shadow-lg rounded-xl mb-6 lg:mb-0 border border-zinc-700 transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl">
          <h2 className="text-2xl font-bold mb-6 text-white text-center">
            🔍 Filter Items
          </h2>

          <input
            type="text"
            placeholder="Search by title or description"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2.5 mb-6 border border-zinc-600 rounded-md bg-zinc-800 text-white placeholder-zinc-400 shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-600 transition duration-300"
          />

          <div className="mb-2">
            <label className="block mb-2 font-semibold text-zinc-300">
              Sort by Date:
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full p-2.5 border border-zinc-600 rounded-md bg-zinc-800 text-white shadow-inner focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-600 transition duration-300"
            >
              <option value="newest">📅 Newest First</option>
              <option value="oldest">🕰️ Oldest First</option>
            </select>
          </div>
        </aside>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 flex-1">
          {isLoadingItems ? (
            <Loader />
          ) : filteredItems.length === 0 ? (
            <p className="text-center col-span-full text-gray-500">
              No items found matching your criteria or all items have future
              dates.
            </p>
          ) : (
            filteredItems.map((item, index) => {
              const whatsappLink = `https://wa.me/${
                item.whatsapp
              }?text=Hi%2C%20I'm%20inquiring%20about%20your%20item:%20${encodeURIComponent(
                item.title
              )}`;

              const key = item._id || item.id || `${item.title}-${index}`;

              return (
                <article
                  key={key}
                  className="rounded-lg relative overflow-hidden bg-gray-100 w-full h-56 sm:h-64 md:h-72 lg:h-96 shadow-md"
                >
                  {/* Trash Button if user is owner */}
                  {item.contact === user?.email && (
                    <button
                      onClick={() => handleDelete(key)}
                      className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-md z-10"
                      aria-label="Delete this item"
                      title="Delete item"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                      </svg>
                    </button>
                  )}

                  {item.imageSrc?.trim() ? (
                    <img
                      src={item.imageSrc}
                      alt={item.title}
                      className="object-cover w-full h-full absolute inset-0"
                      loading="lazy"
                    />
                  ) : null}

                  <div className="absolute inset-0 bg-black/70 text-white flex flex-col justify-between p-4 sm:p-6 opacity-100">
                    <div>
                      <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3 truncate">
                        {item.title}
                      </h3>
                      <p className="mb-1 text-sm sm:text-base line-clamp-3">
                        {item.description}
                      </p>
                      <p className="text-xs sm:text-sm font-mono opacity-80 mt-1 break-words">
                        Posted by: {item.contact}
                      </p>
                      <p className="text-xs sm:text-sm italic opacity-80 mt-1">
                        Date: {formatDate(item.date)}
                      </p>
                    </div>
                    <div className="flex justify-end">
                      <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-green-600 hover:bg-green-700 rounded-full p-2 transition"
                        aria-label={`Contact ${item.contact} on WhatsApp`}
                      >
                        <WhatsappIcon />
                      </a>
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </section>

        <button
          onClick={handleOpenModal}
          className="fixed bottom-6 right-6 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full p-4 sm:p-5 shadow-2xl hover:from-indigo-600 hover:to-blue-700 transition duration-300 z-30"
          title="Add New Lost/Found Item"
          style={{
            animation: "pulse 2.5s infinite",
            boxShadow: "0 8px 15px rgba(59, 130, 246, 0.5)",
          }}
          aria-label="Add new lost or found item"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 sm:h-7 w-6 sm:w-7"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          <style>{`
  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
      box-shadow: 0 8px 15px rgba(59, 130, 246, 0.5);
    }
    50% {
      transform: scale(1.1);
      box-shadow: 0 12px 20px rgba(59, 130, 246, 0.7);
    }
  }
`}</style>
        </button>

        {isModalOpen && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 px-4 py-6 sm:px-0"
            onClick={() => setIsModalOpen(false)}
          >
            <div
              className="bg-white dark:bg-zinc-900 p-6 sm:p-8 rounded-xl max-w-lg w-full max-h-screen overflow-auto shadow-2xl custom-scrollbar"
              onClick={(e) => e.stopPropagation()}
              style={{ WebkitOverflowScrolling: "touch" }} // smooth scrolling on iOS
            >
              <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white text-center sm:text-left">
                📝 Add Lost/Found Item
              </h3>
              <form onSubmit={handleFormSubmit} className="space-y-5">
                <LabelInputContainer>
                  <Label htmlFor="title">Title*</Label>
                  <Input
                    name="title"
                    value={newItem.title}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter a clear and concise title"
                    className="w-full"
                  />
                </LabelInputContainer>

                <LabelInputContainer>
                  <Label htmlFor="description">Description*</Label>
                  <Input
                    name="description"
                    value={newItem.description}
                    onChange={handleInputChange}
                    required
                    placeholder="Provide a short description"
                    className="w-full"
                  />
                </LabelInputContainer>

                <LabelInputContainer>
                  <Label
                    htmlFor="photo"
                    className="text-sm font-semibold text-gray-300 mb-2 block"
                  >
                    Upload Image*
                  </Label>

                  <label className="flex items-center justify-center w-full p-4 bg-gray-800 text-gray-300 border border-gray-600 rounded-lg shadow-sm hover:bg-gray-700 transition cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      required
                      onChange={(e) => setImageFile(e.target.files[0])}
                      className="hidden"
                    />
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
                        Click to upload or drag and drop
                      </span>
                    </div>
                  </label>

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
                  <Label htmlFor="contact">Contact Email*</Label>
                  <Input
                    name="contact"
                    type="email"
                    value={newItem.contact}
                    onChange={handleInputChange}
                    required
                    readOnly
                    placeholder={user?.email}
                    className="cursor-not-allowed w-full"
                  />
                </LabelInputContainer>
                <LabelInputContainer>
                  <Label htmlFor="date">Date Lost/Found*</Label>
                  <Input
                    name="date"
                    type="date"
                    value={newItem.date}
                    onChange={handleInputChange}
                    required
                    className="w-full"
                  />
                </LabelInputContainer>

                <LabelInputContainer>
                  <Label htmlFor="whatsapp">WhatsApp Number*</Label>
                  <Input
                    name="whatsapp"
                    type="tel"
                    value={newItem.whatsapp}
                    onChange={handleInputChange}
                    required
                    placeholder="9876543210"
                    pattern="[6-9]{1}[0-9]{9}"
                    maxLength={10}
                    className="w-full"
                  />
                </LabelInputContainer>

                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="group/btn relative block h-10 px-5 rounded-md bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold shadow-lg hover:brightness-110 transition"
                  >
                    Add Item → <BottomGradient />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default LostAndFoundListing;
