import React, { useState, useEffect } from "react";
import axios from "axios";

import { USER_API_ENDPOINT } from "../../constants";

export default function CarpoolingSection({ user }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get(`${USER_API_ENDPOINT}/api/carpools`, { withCredentials: true })
      .then((res) => setPosts(res.data))
      .catch((err) => console.error("Error fetching carpools:", err.message));
  }, []);

  const getPhoneNumberFromEmail = (email) => {
    // This function can be customized based on how you want to extract phone number
    // For now, fallback to default number or fetch from post.phoneNumber if available
    const foundPost = posts.find((p) => p.userEmail === email);
    return foundPost?.phoneNumber || "919876543210";
  };

  const displayedPosts = posts.slice(0, 6);

  return (
    <section id="carpooling" className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <h2 className="text-4xl font-bold text-center text-slate-800 mb-12">
          🚗 Carpooling Board
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {displayedPosts.map((post) => {
            const phone = getPhoneNumberFromEmail(post.userEmail);
            return (
              <div
                key={post._id}
                className="relative bg-white rounded-2xl border border-slate-200 shadow-md p-6 transition-transform duration-300 hover:scale-105 hover:shadow-xl"
              >
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
                  href={`https://wa.me/${phone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Chat on WhatsApp"
                  className="absolute bottom-3 right-3  transition-transform"
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
            );
          })}
        </div>

        {/* Show More Button */}
        <div className="mt-12 text-center">
          <a
            href="/carpooling"
            className="inline-block px-6 py-3 bg-slate-800 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-slate-700 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
          >
            Show More Posts →
          </a>
        </div>
      </div>
    </section>
  );
}
