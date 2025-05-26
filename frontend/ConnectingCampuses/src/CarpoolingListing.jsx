import React, { useState } from "react";
import carpoolPosts from "./connectingcomponents/carpoolPosts";
import { Label } from "./components/ui/label";
import { Input } from "./components/ui/input";
import { cn } from "./lib/utils";
import { useAuth } from "./context/AuthContext"; // optional if you're using auth

export default function CarpoolingListing() {
  const [sortOrder, setSortOrder] = useState("newest");
  const [posts, setPosts] = useState([...carpoolPosts]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth(); // optional
  const [newPost, setNewPost] = useState({
    from: "",
    to: "",
    date: "",
    time: "",
    seatsAvailable: "",
    note: "",
    userEmail: user?.email || "",
    phoneNumber: "919876543210",
  });

  const sortedPosts = [...posts].sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleInputChange = (e) =>
    setNewPost({ ...newPost, [e.target.name]: e.target.value });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const postWithId = { ...newPost, id: Date.now().toString() };
    setPosts([postWithId, ...posts]);
    setIsModalOpen(false);
    setNewPost({
      from: "",
      to: "",
      date: "",
      time: "",
      seatsAvailable: "",
      note: "",
      userEmail: user?.email || "",
      phoneNumber: "919876543210",
    });
  };

  return (
    <div className="pt-24 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen mb-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
            🚗 Carpooling Board
          </h2>
          <div className="flex items-center w-full sm:w-auto">
            <label htmlFor="sort" className="mr-3 font-medium text-slate-700">
              Sort by Date:
            </label>
            <select
              id="sort"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full sm:w-auto border border-slate-300 rounded px-3 py-2 shadow-sm text-sm"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {sortedPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-md p-5 hover:shadow-xl transition-transform duration-300 hover:scale-[1.02]"
            >
              <div className="flex items-start justify-between mb-3 text-sm text-slate-600">
                <div className="break-all">
                  <strong>User:</strong> {post.userEmail}
                </div>
                <a
                  href={`https://wa.me/${post.phoneNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Chat on WhatsApp"
                  className="text-green-600 hover:text-green-800 transition-colors ml-2 shrink-0"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.52 3.48a11.84 11.84 0 00-16.74 0 11.85 11.85 0 00-3.57 8.39c0 2.1.55 4.14 1.58 5.95L2 22l4.28-1.34a11.83 11.83 0 005.95 1.58h.003a11.85 11.85 0 008.29-3.57 11.84 11.84 0 000-16.72zm-7.53 16.04a9.65 9.65 0 01-4.9-1.44l-.35-.21-3.19 1 1.05-3.1-.23-.36a9.63 9.63 0 01-1.45-4.84c0-5.34 4.35-9.69 9.7-9.69 2.6 0 5.04 1.01 6.87 2.84a9.68 9.68 0 012.85 6.86 9.65 9.65 0 01-9.75 9.62zm5.4-6.92c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.53.15-.17.2-.3.3-.5.1-.2.05-.38-.03-.53-.07-.15-.67-1.6-.92-2.19-.24-.57-.5-.5-.67-.51-.17-.02-.37-.02-.57-.02-.2 0-.53.08-.8.38-.28.3-1.05 1.03-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.12 3.24 5.15 4.54.72.31 1.28.5 1.72.63.72.22 1.38.19 1.9.12.58-.08 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.43-.07-.13-.27-.2-.57-.35z" />
                  </svg>
                </a>
              </div>
              <p className="mb-1">
                <strong>From:</strong> {post.from}
              </p>
              <p className="mb-1">
                <strong>To:</strong> {post.to}
              </p>
              <p className="mb-1">
                <strong>Date:</strong> {post.date}
              </p>
              <p className="mb-1">
                <strong>Time:</strong> {post.time}
              </p>
              <p className="mb-1">
                <strong>Seats:</strong> {post.seatsAvailable}
              </p>
              {post.note && (
                <p className="text-slate-500 italic mt-2 text-sm">
                  "{post.note}"
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Floating Add Button */}
      <button
        onClick={handleOpenModal}
        className="fixed bottom-8 right-8 z-50 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full p-5 shadow-2xl hover:from-indigo-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:ring-opacity-50 active:scale-95 transition duration-300 ease-in-out animate-pulse"
        title="Add New Carpool Post"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center px-4 sm:px-6"
          onClick={handleCloseModal}
        >
          <div
            className="bg-gray-900 rounded-2xl shadow-2xl p-4 sm:p-6 w-full max-w-md sm:max-w-lg max-h-[95vh] flex flex-col transition-all duration-300 text-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl sm:text-2xl font-bold mb-5 text-white">
              🚗 Create a New Carpool Listing
            </h3>

            <form
              onSubmit={handleFormSubmit}
              className="space-y-5 overflow-y-auto flex-grow pr-2"
              style={{ maxHeight: "calc(95vh - 120px)" }} // leave space for header + buttons
            >
              <LabelInputContainer>
                <Label htmlFor="from" className="text-gray-300">
                  Pickup Location*
                </Label>
                <Input
                  name="from"
                  value={newPost.from}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Bangalore"
                  className="bg-gray-800 text-gray-100 placeholder-gray-400 border-gray-700 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="to" className="text-gray-300">
                  Drop Location*
                </Label>
                <Input
                  name="to"
                  value={newPost.to}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Hyderabad"
                  className="bg-gray-800 text-gray-100 placeholder-gray-400 border-gray-700 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </LabelInputContainer>

              <div className="grid sm:grid-cols-2 gap-4">
                <LabelInputContainer>
                  <Label htmlFor="date" className="text-gray-300">
                    Travel Date*
                  </Label>
                  <Input
                    name="date"
                    type="date"
                    value={newPost.date}
                    onChange={handleInputChange}
                    required
                    className="bg-gray-800 text-gray-100 placeholder-gray-400 border-gray-700 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </LabelInputContainer>

                <LabelInputContainer>
                  <Label htmlFor="time" className="text-gray-300">
                    Departure Time*
                  </Label>
                  <Input
                    name="time"
                    type="time"
                    value={newPost.time}
                    onChange={handleInputChange}
                    required
                    className="bg-gray-800 text-gray-100 placeholder-gray-400 border-gray-700 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                </LabelInputContainer>
              </div>

              <LabelInputContainer>
                <Label htmlFor="seatsAvailable" className="text-gray-300">
                  Seats Available*
                </Label>
                <Input
                  name="seatsAvailable"
                  type="number"
                  value={newPost.seatsAvailable}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter number of available seats"
                  className="bg-gray-800 text-gray-100 placeholder-gray-400 border-gray-700 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="note" className="text-gray-300">
                  Additional Notes
                </Label>
                <Input
                  name="note"
                  value={newPost.note}
                  onChange={handleInputChange}
                  placeholder="e.g., Luggage space available"
                  className="bg-gray-800 text-gray-100 placeholder-gray-400 border-gray-700 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="phoneNumber" className="text-gray-300">
                  Contact Number*
                </Label>
                <Input
                  name="phoneNumber"
                  type="tel"
                  value={newPost.phoneNumber}
                  onChange={handleInputChange}
                  required
                  placeholder="+91 98765 43210"
                  className="bg-gray-800 text-gray-100 placeholder-gray-400 border-gray-700 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="userEmail" className="text-gray-300">
                  Your Email
                </Label>
                <Input
                  name="userEmail"
                  type="email"
                  value={newPost.userEmail}
                  onChange={handleInputChange}
                  readOnly
                  placeholder={user?.email || "user@example.com"}
                  className="cursor-not-allowed bg-gray-700 text-gray-400 placeholder-gray-500"
                />
              </LabelInputContainer>
            </form>

            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-gray-300 text-sm font-medium transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                form="yourFormId" // optionally add form id for clarity
                className="group/btn relative flex items-center justify-center h-10 px-5 rounded-md bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold shadow-lg hover:brightness-110 transition"
              >
                Add Post →
                <BottomGradient />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper Components
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
