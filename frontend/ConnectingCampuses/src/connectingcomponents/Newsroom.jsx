"use client";
import React, { useEffect, useState } from "react";
import { Carousel, Card } from "../components/ui/apple-cards-carousel";
import { toast } from "react-hot-toast";
import axios from "axios";
import { USER_API_ENDPOINT } from "../../constants";

const Newsroom = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true); // 🔹 Loader state

  useEffect(() => {
    const fetchNewsroomEvents = async () => {
      try {
        const response = await axios.get(
          `${USER_API_ENDPOINT}/api/college-events/`
        );
        const firstSix = response.data.slice(0, 6);
        setEvents(firstSix);
      } catch (err) {
        console.error("Error fetching events:", err);
        toast.error("Failed to load newsroom events");
      } finally {
        setLoading(false); // ✅ Stop loading after fetch
      }
    };

    fetchNewsroomEvents();
  }, []);

  const cards = events.map((event, index) => (
    <Card
      key={event._id || event.title + index}
      index={index}
      card={{
        category: event.category || "General",
        title: event.title,
        photo: event.photo || "",
        email: event.email,
        club: event.club,
        content: event.description,
      }}
    />
  ));

  return (
    <section id="newsroom">
      <div className="w-full h-full py-3 md:px-0">
        <div className="w-full mb-[-2rem] px-4 sm:px-6 lg:px-8 flex justify-center">
          <h2
            className="text-center text-4xl md:text-5xl font-extrabold text-gray-600 font-sans tracking-tight drop-shadow-sm 
              transition duration-300 ease-in-out hover:text-orange-500 hover:scale-105 hover:drop-shadow-md cursor-pointer"
          >
            Newsroom
          </h2>
        </div>

        <div className="w-full flex flex-col justify-between items-center min-h-[500px] px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex flex-col justify-center items-center flex-grow py-10">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-500 animate-spin" />
                <div className="absolute inset-1 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 blur-sm opacity-30 animate-pulse" />
              </div>
              <div className="text-lg font-semibold text-gray-600 animate-pulse">
                Loading Newsroom...
              </div>
            </div>
          ) : (
            <>
              <div className="w-full">
                <Carousel items={cards} />
              </div>

              <div className="mt-6">
                <button
                  type="button"
                  onClick={() => (window.location.href = "/newsroom")}
                  className="relative overflow-hidden group text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2 shadow-2xl shadow-zinc-900"
                >
                  <span className="absolute inset-0 rounded-lg bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative z-10 flex space-x-2 items-center justify-center">
                    <span>Show more</span>
                    <svg
                      fill="none"
                      height="16"
                      viewBox="0 0 24 24"
                      width="16"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10.75 8.75L14.25 12L10.75 15.25"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                      />
                    </svg>
                  </div>
                  <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Newsroom;
