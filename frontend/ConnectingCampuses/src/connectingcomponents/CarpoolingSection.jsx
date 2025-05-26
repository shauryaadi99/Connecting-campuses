import React from "react";
import carpoolPosts from "./carpoolPosts.js";

export default function CarpoolingSection() {
  const posts = carpoolPosts.slice(0, 6);

  const getPhoneNumberFromEmail = (email) => {
    return "919876543210";
  };

  return (
    <section id="carpooling" className="bg-white py-16">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        <h2 className="text-4xl font-bold text-center text-slate-800 mb-12">
          🚗 Carpooling Board
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {posts.map((post) => {
            const phone = getPhoneNumberFromEmail(post.userEmail);
            return (
              <div
                key={post.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 transition-transform duration-300 hover:scale-105 hover:shadow-xl"
              >
                <p className="flex items-center justify-between mb-2 text-sm text-slate-600">
                  <span>
                    <strong>User:</strong> {post.userEmail}
                  </span>
                  <a
                    href={`https://wa.me/${phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Chat on WhatsApp"
                    className="text-green-600 hover:text-green-800 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="22"
                      height="22"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M20.52 3.478a11.838 11.838 0 00-16.74 0 11.852 11.852 0 00-3.57 8.39c0 2.096.546 4.142 1.58 5.953L2 22l4.275-1.338a11.825 11.825 0 005.95 1.58h.003a11.854 11.854 0 008.29-3.572 11.839 11.839 0 000-16.72zm-7.53 16.04a9.648 9.648 0 01-4.897-1.44l-.35-.213-3.188 1 1.05-3.1-.226-.357a9.633 9.633 0 01-1.45-4.84c0-5.34 4.35-9.688 9.7-9.688 2.6 0 5.04 1.015 6.868 2.84a9.678 9.678 0 012.852 6.863 9.647 9.647 0 01-9.745 9.625zm5.4-6.92c-.3-.15-1.772-.873-2.045-.973-.272-.1-.47-.15-.67.15-.2.3-.77.973-.945 1.17-.174.2-.35.224-.65.075-.3-.15-1.26-.464-2.4-1.48-.89-.79-1.49-1.76-1.66-2.06-.174-.3-.018-.46.13-.61.13-.13.3-.35.45-.525.15-.174.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.67-1.6-.92-2.19-.242-.575-.5-.5-.67-.51-.174-.025-.37-.025-.57-.025-.2 0-.525.075-.8.375-.275.3-1.05 1.03-1.05 2.5s1.08 2.9 1.23 3.1c.15.2 2.12 3.24 5.15 4.54.72.31 1.28.495 1.72.63.72.22 1.38.19 1.9.115.58-.086 1.77-.72 2.02-1.42.25-.7.25-1.3.175-1.43-.075-.13-.275-.2-.57-.35z" />
                    </svg>
                  </a>
                </p>
                <p className="mb-1"><strong>From:</strong> {post.from}</p>
                <p className="mb-1"><strong>To:</strong> {post.to}</p>
                <p className="mb-1"><strong>Date:</strong> {post.date}</p>
                <p className="mb-1"><strong>Time:</strong> {post.time}</p>
                <p className="mb-1"><strong>Seats:</strong> {post.seatsAvailable}</p>
                {post.note && (
                  <p className="text-slate-500 italic mt-2">"{post.note}"</p>
                )}
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
