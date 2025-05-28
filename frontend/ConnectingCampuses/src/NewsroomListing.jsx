import React, { useState, useEffect } from "react";
import { Carousel, Card } from "./components/ui/apple-cards-carousel";
import { Label } from "./components/ui/label";
import { Input } from "./components/ui/input";
import axios from "axios";
import { USER_API_ENDPOINT } from "../constants";

import { cn } from "./lib/utils";
import { useAuth } from "./context/AuthContext";

const DummyContent = ({ description }) => (
  <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-8 md:p-14 rounded-3xl mb-4">
    <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans max-w-3xl mx-auto">
      <span className="font-bold text-neutral-700 dark:text-neutral-200">
        {description}
      </span>{" "}
    </p>
    <img
      src="https://assets.aceternity.com/macbook.png"
      alt="Macbook mockup"
      height="500"
      width="500"
      className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-contain"
    />
  </div>
);

const categories = ["All", "Workshop", "Cultural", "Technical", "Podcast"];
const sortOrders = ["Newest First", "Oldest First"];

const NewsroomListing = () => {
  const [events, setEvents] = useState([]);
  const [openCardIndex, setOpenCardIndex] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedClub, setSelectedClub] = useState("All");
  const [sortOrder, setSortOrder] = useState("Newest First");
  const [search, setSearch] = useState("");
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [newEvent, setNewEvent] = useState({
    category: "",
    club: "",
    title: "",
    src: "",
    date: "",
    email: user?.email || "",
    description: "",
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update email if user changes (important)
  useEffect(() => {
    setNewEvent((prev) => ({
      ...prev,
      email: user?.email || "",
    }));
  }, [user]);

  // Fetch events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await axios.get(
          `${USER_API_ENDPOINT}/api/college-events/`,
          {
            withCredentials: true,
          }
        );

        const mappedEvents = res.data.map((event) => ({
          ...event,
          content: <DummyContent description={event.description} />,
        }));

        setEvents(mappedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  const clubs = ["All", ...new Set(events.map((item) => item.club))];

  const resetFilters = () => {
    setSelectedCategory("All");
    setSelectedClub("All");
    setSortOrder("Newest First");
    setSearch("");
  };

  const filteredCards = events
    .filter((card) => {
      return (
        (selectedCategory === "All" || card.category === selectedCategory) &&
        (selectedClub === "All" || card.club === selectedClub) &&
        (search === "" ||
          card.title.toLowerCase().includes(search.toLowerCase()))
      );
    })
    .sort((a, b) => {
      return sortOrder === "Newest First"
        ? new Date(b.date) - new Date(a.date)
        : new Date(a.date) - new Date(b.date);
    });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenModal = () => {
    if (!user) {
      alert("Please log in to add a Newsroom event.");
      return;
    }
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (
      !newEvent.category ||
      !newEvent.club ||
      !newEvent.title ||
      !newEvent.date
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const response = await axios.post(
        `${USER_API_ENDPOINT}/api/college-events/`,
        newEvent,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      const savedEvent = {
        ...response.data,
        content: <DummyContent description={response.data.description} />,
      };

      setEvents((prev) => [...prev, savedEvent]);

      setIsModalOpen(false);
      setNewEvent({
        category: "",
        club: "",
        title: "",
        src: "",
        date: "",
        email: user?.email || "",
        description: "",
      });
    } catch (error) {
      alert(
        error.response?.data?.message || error.message || "Failed to add event"
      );
    }
  };

  // Optional: Implement event delete handler or remove from props below
  const handleDeleteEvent = async (id) => {
    try {
      await axios.delete(`${USER_API_ENDPOINT}/api/college-events/${id}`, {
        withCredentials: true,
      });
      setEvents((prev) => prev.filter((event) => event._id !== id));
    } catch (error) {
      alert("Failed to delete event");
    }
  };

  return (
    <div className="pt-24 h-full py-10 bg-gray-50 dark:bg-gray-900 w-full relative">
      <h2 className="text-2xl md:text-4xl font-extrabold text-center text-neutral-900 dark:text-white mb-4">
        College Newsroom 📰
      </h2>

      <div className="flex flex-col md:flex-row gap-8 px-4 md:px-6">
        {/* Sidebar Filters */}
        <div className="w-full md:w-1/5 md:pr-6 mb-6 md:mb-0">
          <div className="sticky top-4 space-y-4 bg-gray-900 text-white p-4 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold">Filters</h2>
            <button
              onClick={resetFilters}
              className="text-sm underline text-red-400 hover:text-red-300"
            >
              Reset All
            </button>

            <input
              type="text"
              placeholder="Search events..."
              className="w-full p-2 mt-2 bg-gray-800 rounded"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <div className="mt-4">
              <label className="block mb-1">Category</label>
              <select
                className="w-full p-2 bg-gray-800 rounded"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              <label className="block mb-1">Club</label>
              <select
                className="w-full p-2 bg-gray-800 rounded"
                value={selectedClub}
                onChange={(e) => setSelectedClub(e.target.value)}
              >
                {clubs.map((club) => (
                  <option key={club}>{club}</option>
                ))}
              </select>
            </div>

            <div className="mt-4">
              <label className="block mb-1">Sort By</label>
              <select
                className="w-full p-2 bg-gray-800 rounded"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              >
                {sortOrders.map((sort) => (
                  <option key={sort}>{sort}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Cards Display */}
        <div className="w-full md:w-4/5">
          {filteredCards.length === 0 ? (
            <div className="text-center text-gray-600 dark:text-gray-300 mt-10">
              No events found.
            </div>
          ) : isMobile ? (
            <Carousel
              items={filteredCards.map((card, index) => (
                <Card
                  key={card._id || index}
                  card={card}
                  index={index}
                  isOpen={openCardIndex === index}
                  onOpen={() => setOpenCardIndex(index)}
                  onClose={() => setOpenCardIndex(null)}
                  showDelete={card.email === user?.email}
                  onDelete={() => handleDeleteEvent(card._id)}
                />
              ))}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCards.map((card, index) => (
                <div
                  key={card._id || index}
                  className={`transform scale-95 hover:scale-100 transition-transform duration-300 relative ${
                    openCardIndex === index ? "z-50" : "z-10"
                  } mb-8`}
                >
                  <Card
                    card={card}
                    index={index}
                    isOpen={openCardIndex === index}
                    onOpen={() => setOpenCardIndex(index)}
                    onClose={() => setOpenCardIndex(null)}
                    showDelete={card.email === user?.email}
                    onDelete={() => handleDeleteEvent(card._id)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Add Button */}
      <button
        onClick={handleOpenModal}
        className="fixed bottom-8 right-8 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-full p-5 shadow-2xl hover:from-indigo-600 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:ring-opacity-50 active:scale-95 cursor-pointer transition duration-300 ease-in-out z-30"
        title="Add New Event"
        style={{
          boxShadow: "0 8px 15px rgba(59, 130, 246, 0.5)",
          animation: "pulse 2.5s infinite",
        }}
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
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 transition-all duration-300 px-4"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 shadow-2xl rounded-xl p-6 sm:p-8 w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto relative transform transition-all duration-300 custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white tracking-tight">
              ✨ Add New Event
            </h3>
            <form className="space-y-4" onSubmit={handleFormSubmit}>
              <LabelInputContainer>
                <Label htmlFor="category">Category*</Label>
                <Input
                  id="category"
                  name="category"
                  type="text"
                  value={newEvent.category}
                  onChange={handleInputChange}
                  placeholder="Workshop, Seminar, etc."
                  required
                />
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="club">Club*</Label>
                <Input
                  id="club"
                  name="club"
                  type="text"
                  value={newEvent.club}
                  onChange={handleInputChange}
                  placeholder="Club name"
                  required
                />
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="title">Title*</Label>
                <Input
                  id="title"
                  name="title"
                  type="text"
                  value={newEvent.title}
                  onChange={handleInputChange}
                  placeholder="Event title"
                  required
                />
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="src">Image URL</Label>
                <Input
                  id="src"
                  name="src"
                  type="url"
                  value={newEvent.src}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  name="description"
                  value={newEvent.description}
                  onChange={handleInputChange}
                  placeholder="Add a brief event description..."
                  rows={3}
                  className="w-full p-2 mt-1 border rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                />
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="date">Date*</Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={newEvent.date}
                  onChange={handleInputChange}
                  required
                />
              </LabelInputContainer>

              <LabelInputContainer>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={newEvent.email}
                  placeholder={user?.email || "User email"}
                  readOnly
                  className="cursor-not-allowed bg-gray-100 dark:bg-zinc-800"
                />
              </LabelInputContainer>

              <div className="flex justify-end space-x-3 pt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm rounded-md font-medium text-gray-700 dark:text-gray-200 bg-gray-200 dark:bg-zinc-700 hover:bg-gray-300 dark:hover:bg-zinc-600 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="group/btn relative block h-10 px-5 rounded-md bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 text-sm font-semibold text-white shadow-md ring-1 ring-purple-200 hover:ring-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const LabelInputContainer = ({ children }) => (
  <div className="flex flex-col space-y-1">{children}</div>
);

export default NewsroomListing;
