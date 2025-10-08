import React, { useState, useEffect } from "react";
import Linkify from "react-linkify";
import { Carousel, Card } from "./components/ui/apple-cards-carousel";
import { Label } from "./components/ui/label";
import { Input } from "./components/ui/input";
import axios from "axios";
import { USER_API_ENDPOINT } from "../constants";
import { cn } from "./lib/utils";
import { useAuth } from "./context/AuthContext";

const getImageSrc = (photo) => {
  if (!photo?.data?.data || !photo?.contentType) return "";

  const blob = new Blob([new Uint8Array(photo.data.data)], {
    type: photo.contentType,
  });

  return URL.createObjectURL(blob);
};

const DummyContent = ({ description, photo }) => {
  return (
    <div className="bg-[#F5F5F7] dark:bg-neutral-800 p-10 md:p-16 rounded-3xl mb-6 max-w-5xl mx-auto">
      <p className="text-neutral-600 dark:text-neutral-400 text-base md:text-2xl font-sans leading-relaxed custom-scrollbar">
        <Linkify
          componentDecorator={(href, text, key) => (
            <a
              href={href}
              key={key}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline break-words"
            >
              {text}
            </a>
          )}
        >
          {description}
        </Linkify>
      </p>
    </div>
  );
};

const categories = ["All", "Workshop", "Cultural", "Technical", "Podcast"];
const sortOrders = ["Newest First", "Oldest First"];

const NewsroomListing = () => {
  const [events, setEvents] = useState([]);
  const [openCardIndex, setOpenCardIndex] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedClub, setSelectedClub] = useState("All");
  const [sortOrder, setSortOrder] = useState("Newest First");
  const [search, setSearch] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageURL, setImageURL] = useState(null);

  const [newEvent, setNewEvent] = useState({
    category: "",
    club: "",
    title: "",
    date: "",
    email: user?.email || "",
    description: "",
    file: null,
  });

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setNewEvent((prev) => ({
      ...prev,
      email: user?.email || "",
    }));
  }, [user]);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(
          `${USER_API_ENDPOINT}/api/college-events/`,
          {
            withCredentials: true,
          }
        );

        const mappedEvents = res.data.map((event) => ({
          ...event,
          content: (
            <DummyContent description={event.description} photo={event.photo} />
          ),
        }));

        setEvents(mappedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    return () => {
      if (imageURL) URL.revokeObjectURL(imageURL);
    };
  }, [imageURL]);

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
    .sort((a, b) =>
      sortOrder === "Newest First"
        ? new Date(b.date) - new Date(a.date)
        : new Date(a.date) - new Date(b.date)
    );

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

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageURL(url);
      setSelectedFile(file);
    }
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

    if (!selectedFile) {
      alert("Please upload an event image.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("category", newEvent.category);
      formData.append("club", newEvent.club);
      formData.append("title", newEvent.title);
      formData.append("date", newEvent.date);
      formData.append("email", newEvent.email);
      formData.append("description", newEvent.description);

      const response = await axios.post(
        `${USER_API_ENDPOINT}/api/college-events/`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const savedEvent = {
        ...response.data,
        content: (
          <DummyContent
            description={response.data.description}
            photo={response.data.photo}
          />
        ),
      };

      setEvents((prev) => [...prev, savedEvent]);
      setIsModalOpen(false);
      setNewEvent({
        category: "",
        club: "",
        title: "",
        date: "",
        email: user?.email || "",
        description: "",
      });
      setImageURL(null);
      setSelectedFile(null);
    } catch (error) {
      alert(
        error.response?.data?.message || error.message || "Failed to add event"
      );
    }
  };

  const handleDeleteEvent = async (id) => {
    try {
      await axios.delete(`${USER_API_ENDPOINT}/api/college-events/${id}`, {
        withCredentials: true,
      });
      setEvents((prev) => prev.filter((event) => event._id !== id));
    } catch (error) {
      console.error("Delete failed", error);
      alert("Failed to delete event");
    }
  };

  return (
    <div className="pt-24 min-h-screen py-10 bg-gray-50 dark:bg-gray-900 w-full relative">
      {isLoading ? (
        <div className="fixed inset-0 z-50 bg-white dark:bg-black flex flex-col justify-center items-center">
          <div className="w-16 h-16 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-xl text-gray-700 dark:text-gray-200 font-semibold animate-pulse">
            Loading Newsroom Events...
          </p>
        </div>
      ) : (
        <>
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
                          isOpen={false}
                          onOpen={() => setSelectedEvent(card)}
                          showDelete={card.email === user?.email}
                          onDelete={() => handleDeleteEvent(card._id)}
                          isListing={!isMobile}
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

                    {/* <LabelInputContainer>
                <Label htmlFor="src">Image URL</Label>
                <Input
                  id="src"
                  name="src"
                  type="url"
                  value={newEvent.src}
                  onChange={handleInputChange}
                  placeholder="https://example.com/image.jpg"
                />
              </LabelInputContainer> */}
                    <div className="w-full">
                      <label
                        htmlFor="file"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Event Image
                      </label>
                      <div className="relative flex items-center justify-between rounded-lg border border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-2 shadow-sm transition focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">
                        <input
                          id="file"
                          name="file"
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="block w-full text-sm text-gray-900 dark:text-gray-100 file:mr-4 file:py-2 file:px-4
                 file:rounded-lg file:border-0 file:text-sm file:font-semibold
                 file:bg-indigo-50 file:text-indigo-700
                 hover:file:bg-indigo-100
                 dark:file:bg-zinc-700 dark:file:text-white
                 dark:hover:file:bg-zinc-600"
                        />
                      </div>
                    </div>

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
            {selectedEvent && (
              <div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 transition-all duration-300 px-4"
                onClick={() => setSelectedEvent(null)}
              >
                <div
                  className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 shadow-2xl rounded-xl p-6 sm:p-8 w-full max-w-xl max-h-[90vh] overflow-y-auto relative custom-scrollbar"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    className="absolute top-3 right-3 text-gray-500 dark:text-gray-300 hover:text-red-500"
                    onClick={() => setSelectedEvent(null)}
                  >
                    ✕
                  </button>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {selectedEvent.title}
                  </h3>

                  {/* Club */}
                  {selectedEvent.club && (
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      <strong>Club:</strong> {selectedEvent.club}
                    </p>
                  )}

                  {/* Email */}
                  {selectedEvent.email && (
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      <strong>Posted by:</strong> {selectedEvent.email}
                    </p>
                  )}

                  {/* Date */}
                  {selectedEvent.date && (
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      <strong>Date:</strong>{" "}
                      {new Date(selectedEvent.date).toLocaleDateString(
                        undefined,
                        {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                  )}

                  {/* Description / Content */}
                  <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line leading-relaxed">
                    {selectedEvent.content}
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const LabelInputContainer = ({ children }) => (
  <div className="flex flex-col space-y-1">{children}</div>
);

export default NewsroomListing;
