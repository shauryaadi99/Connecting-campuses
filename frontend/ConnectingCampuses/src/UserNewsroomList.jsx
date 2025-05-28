import React, { useEffect, useState } from "react";
import { Carousel, Card } from "./components/ui/apple-cards-carousel";
import { useAuth } from "./context/AuthContext";
import axios from "axios";
import { USER_API_ENDPOINT } from "../constants";

const UserNewsroomList = () => {
  const [events, setEvents] = useState([]);
  const [openCardIndex, setOpenCardIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const { user } = useAuth();

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const res = await axios.get(
          `${USER_API_ENDPOINT}/api/college-events/by-user/${user.email}`,
          { withCredentials: true }
        );

        const userEvents = res.data.map((event) => ({
          ...event,
          content: (
            <div className="p-6 text-gray-700 dark:text-gray-200">
              {event.description || "No description provided."}
            </div>
          ),
        }));

        setEvents(userEvents);
      } catch (error) {
        console.error("Failed to fetch user events:", error);
      }
    };

    if (user?.email) {
      fetchMyEvents();
    }
  }, [user]);

  return (
    <div className="pt-24 min-h-screen py-10 bg-gray-50 dark:bg-gray-900 w-full relative">
      <h2 className="text-2xl md:text-4xl font-extrabold text-center text-neutral-900 dark:text-white mb-6">
        My Listings ✨
      </h2>

      {events.length === 0 ? (
        <div className="text-center text-gray-600 dark:text-gray-300 mt-10">
          No events found for your account.
        </div>
      ) : isMobile ? (
        <Carousel
          items={events.map((card, i) => (
            <Card
              key={card._id || i}
              card={card}
              index={i}
              isOpen={openCardIndex === i}
              onOpen={() => setOpenCardIndex(i)}
              onClose={() => setOpenCardIndex(null)}
            />
          ))}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 md:px-8">
          {events.map((card, index) => (
            <div
              key={index}
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
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserNewsroomList;
