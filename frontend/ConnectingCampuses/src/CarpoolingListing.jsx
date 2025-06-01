import React, { useState, useEffect } from "react";
import axios from "axios";
import { Label } from "./components/ui/label";
import { Input } from "./components/ui/input";
import { cn } from "./lib/utils";
import { useAuth } from "./context/AuthContext";
import { USER_API_ENDPOINT } from "../constants";

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

export default function CarpoolingListing() {
  const [sortOrder, setSortOrder] = useState("newest");
  const [posts, setPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

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

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${USER_API_ENDPOINT}/api/carpools`, { withCredentials: true })
      .then((res) => setPosts(res.data))
      .catch((err) => console.error("Error fetching carpools:", err.message))
      .finally(() => setLoading(false));
  }, []);

  const sortedPosts = [...posts].sort((a, b) =>
    sortOrder === "newest"
      ? new Date(b.travelDate) - new Date(a.travelDate)
      : new Date(a.travelDate) - new Date(b.travelDate)
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      await axios.delete(`${USER_API_ENDPOINT}/api/carpools/${postId}`, {
        withCredentials: true,
      });
      setPosts((prev) => prev.filter((p) => p._id !== postId));
    } catch (err) {
      console.error(
        "Failed to delete post:",
        err.response?.data || err.message
      );
      alert("Failed to delete the post. Please try again.");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      pickupLocation: newPost.from,
      dropLocation: newPost.to,
      travelDate: newPost.date,
      departureTime: newPost.time,
      seatsAvailable: parseInt(newPost.seatsAvailable, 10),
      additionalNotes: newPost.note,
      contactNumber: newPost.phoneNumber,
      email: newPost.userEmail, // Match schema
    };

    try {
      const res = await axios.post(
        `${USER_API_ENDPOINT}/api/carpools`,
        payload,
        {
          withCredentials: true,
        }
      );
      setPosts([res.data, ...posts]);
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
    } catch (err) {
      console.error("Error creating post:", err.response?.data || err.message);
    }
  };

  return (
    <div className="pt-24 px-4 sm:px-6 lg:px-8 bg-gray-50 min-h-screen mb-4 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <h2 className="text-3xl font-bold text-slate-800">
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
              className="border border-slate-300 rounded px-3 py-2 shadow-sm text-sm"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {loading ? (
          <Loader />
        ) : sortedPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedPosts
              .filter((post) => post != null)
              .map((post) => (
                <div
                  key={post._id}
                  className="relative bg-white text-gray-900 rounded-2xl border border-slate-200 shadow-md p-5 hover:shadow-xl transition-transform duration-300 hover:scale-[1.02]"
                >
                  {user?.email && post.email === user.email && (
                    <button
                      onClick={() => handleDeletePost(post._id)}
                      className="absolute top-3 right-3 text-red-600 hover:text-red-800"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
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

                  <div className="mb-3 text-sm text-slate-600">
                    <strong>User:</strong> {post.email || "Anonymous"}
                  </div>

                  <p className="mb-1">
                    <strong>From:</strong> {post.pickupLocation}
                  </p>
                  <p className="mb-1">
                    <strong>To:</strong> {post.dropLocation}
                  </p>
                  <p className="mb-1">
                    <strong>Date:</strong>{" "}
                    {new Date(post.travelDate).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>

                  <p className="mb-1">
                    <strong>Time:</strong> {post.departureTime}
                  </p>
                  <p className="mb-1">
                    <strong>Seats:</strong> {post.seatsAvailable}
                  </p>

                  {post.additionalNotes && (
                    <p className="text-slate-500 italic mt-2 text-sm">
                      "{post.additionalNotes}"
                    </p>
                  )}

                  <a
                    href={`https://wa.me/${post.phoneNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Chat on WhatsApp"
                    className="absolute bottom-3 right-3 hover:scale-110 transition-transform"
                  >
                    <svg
                      height="32"
                      width="32"
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
                </div>
              ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 text-sm mt-10">
            No carpool posts available.
          </p>
        )}
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 z-50 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full p-5 shadow-2xl hover:from-indigo-600 hover:to-blue-700 focus:ring-4 focus:ring-indigo-400"
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

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center px-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-gray-900 rounded-2xl shadow-2xl p-6 w-full max-w-lg max-h-[95vh] overflow-y-auto text-gray-100 custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold mb-5">
              🚗 Create a New Carpool Listing
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-5">
              {[
                {
                  name: "from",
                  label: "Pickup Location*",
                  placeholder: "e.g., Bangalore",
                },
                {
                  name: "to",
                  label: "Drop Location*",
                  placeholder: "e.g., Hyderabad",
                },
                { name: "date", label: "Travel Date*", type: "date" },
                { name: "time", label: "Departure Time*", type: "time" },
                {
                  name: "seatsAvailable",
                  label: "Seats Available*",
                  type: "number",
                  placeholder: "Number of seats",
                },
                {
                  name: "note",
                  label: "Additional Notes",
                  placeholder: "e.g., Luggage space available",
                },
                {
                  name: "phoneNumber",
                  label: "Contact Number*",
                  type: "tel",
                  placeholder: "+91 98765 43210",
                },
                {
                  name: "userEmail",
                  label: "Your Email",
                  type: "email",
                  readOnly: true,
                },
              ].map(({ name, label, ...rest }) => (
                <LabelInputContainer key={name}>
                  <Label htmlFor={name}>{label}</Label>
                  <Input
                    name={name}
                    value={newPost[name]}
                    onChange={handleInputChange}
                    required={label.includes("*")}
                    className={`bg-gray-800 text-gray-100 placeholder-gray-400 border-gray-700 ${
                      rest.readOnly ? "cursor-not-allowed text-gray-400" : ""
                    }`}
                    {...rest}
                  />
                </LabelInputContainer>
              ))}

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-md bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold shadow-lg hover:brightness-110 transition"
                >
                  Add Post →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const LabelInputContainer = ({ children }) => (
  <div className="flex flex-col space-y-1 w-full">{children}</div>
);
