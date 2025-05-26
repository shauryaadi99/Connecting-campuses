import React, { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "../lib/utils";

const lostAndFoundItems = [
  {
    id: 1,
    title: "Lost: Black Wallet",
    description: "Lost near the main library on May 15.",
    imageUrl:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80",
    contact: "john.doe@college.edu",
    whatsapp: "1234567890",
  },
  {
    id: 2,
    title: "Found: Casio Calculator",
    description: "Found in Room B101, belongs to a 2nd-year student.",
    imageUrl:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
    contact: "jane.smith@college.edu",
    whatsapp: "1987654321",
  },
  {
    id: 3,
    title: "Lost: Blue Water Bottle",
    description: "Left in the gym on May 14.",
    imageUrl:
      "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=600&q=80",
    contact: "alex.lee@college.edu",
    whatsapp: "1122334455",
  },
  {
    id: 4,
    title: "Found: Silver Keychain",
    description: "Found near cafeteria entrance.",
    imageUrl:
      "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
    contact: "maria.garcia@college.edu",
    whatsapp: "2233445566",
  },
  {
    id: 5,
    title: "Lost: Red Backpack",
    description: "Last seen in the auditorium.",
    imageUrl:
      "https://images.unsplash.com/photo-1514474959185-1472c5d4aee5?auto=format&fit=crop&w=600&q=80",
    contact: "samuel.kim@college.edu",
    whatsapp: "3344556677",
  },
  {
    id: 6,
    title: "Lost: Samsung Galaxy Phone",
    description: "Lost in the canteen during lunch hours.",
    imageUrl:
      "https://images.unsplash.com/photo-1510552776732-03e61cf4b144?auto=format&fit=crop&w=600&q=80",
    contact: "tina.fernandez@college.edu",
    whatsapp: "4455667788",
  },
  {
    id: 7,
    title: "Found: Green Notebook",
    description: "Found in the CS department corridor.",
    imageUrl:
      "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80",
    contact: "raj.kapoor@college.edu",
    whatsapp: "5566778899",
  },
  {
    id: 8,
    title: "Lost: AirPods Case",
    description: "Dropped near the bus stop around 5 PM.",
    imageUrl:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    contact: "lisa.morris@college.edu",
    whatsapp: "6677889900",
  },
  {
    id: 9,
    title: "Found: Black Umbrella",
    description: "Found inside Room A203 after the rain.",
    imageUrl:
      "https://images.unsplash.com/photo-1615791390607-28f5d31e5fd0?auto=format&fit=crop&w=600&q=80",
    contact: "aarav.sharma@college.edu",
    whatsapp: "7788990011",
  },
  {
    id: 10,
    title: "Lost: ID Card",
    description: "Dropped between hostel and admin block.",
    imageUrl:
      "https://images.unsplash.com/photo-1523966211575-eb4a01e7dd53?auto=format&fit=crop&w=600&q=80",
    contact: "nina.joseph@college.edu",
    whatsapp: "8899001122",
  },
];

const WhatsappIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 24 24"
    className="w-7 h-7 text-green-500"
    aria-hidden="true"
  >
    <path d="M20.52 3.48A11.815 11.815 0 0012 0C5.373 0 0 5.373 0 12c0 2.11.554 4.088 1.52 5.82L0 24l6.29-1.56a11.82 11.82 0 005.71 1.44c6.627 0 12-5.373 12-12 0-1.93-.547-3.726-1.48-5.4zM12 21.82a9.77 9.77 0 01-5.25-1.5l-.38-.23-3.7.92.99-3.61-.25-.37A9.782 9.782 0 012.22 12c0-5.42 4.4-9.82 9.82-9.82 2.62 0 5.08 1.02 6.93 2.88a9.755 9.755 0 012.88 6.94c0 5.42-4.4 9.82-9.82 9.82zm5.42-7.62c-.29-.15-1.7-.84-1.96-.94-.26-.1-.44-.15-.63.15s-.72.94-.89 1.13c-.16.19-.32.21-.6.07-.29-.15-1.23-.45-2.35-1.45-.87-.78-1.46-1.75-1.63-2.04-.17-.29-.02-.45.13-.6.14-.14.3-.36.44-.54.14-.18.19-.31.29-.52.1-.21.05-.39-.03-.54-.08-.15-.63-1.52-.87-2.08-.23-.54-.47-.47-.63-.47-.16 0-.35-.02-.54-.02-.19 0-.5.07-.76.37-.26.29-1 1-1 2.45s1.03 2.83 1.17 3.03c.14.21 2.01 3.06 4.88 4.28.68.29 1.21.46 1.62.59.68.21 1.3.18 1.79.11.55-.08 1.7-.69 1.94-1.35.24-.66.24-1.23.17-1.35-.07-.11-.26-.18-.55-.32z" />
  </svg>
);

const LostAndFoundCard = React.memo(({ item, index, hovered, setHovered }) => {
  // WhatsApp link format:
  const whatsappLink = `https://wa.me/${item.whatsapp}?text=Hi%20I%20am%20inquiring%20about%20your%20${encodeURIComponent(
    item.title
  )}`;

  return (
    <div
      onMouseEnter={() => setHovered(index)}
      onMouseLeave={() => setHovered(null)}
      tabIndex={0}
      role="article"
      aria-label={`${item.title} - Contact: ${item.contact}`}
      className={cn(
        "rounded-lg relative overflow-hidden bg-gray-100 dark:bg-neutral-900 transition-all duration-300 ease-out cursor-pointer w-full h-60 md:h-96",
        hovered !== null && hovered !== index && "blur-sm scale-[0.98]"
      )}
    >
      {/* Image */}
      <img
        src={item.imageUrl}
        alt={item.title}
        className="object-cover w-full h-full absolute inset-0"
        loading="lazy"
      />

      {/* Hover overlay */}
      <div
        className={cn(
          "absolute inset-0 bg-black/70 text-white flex flex-col justify-between p-6 transition-opacity duration-300",
          hovered === index ? "opacity-100" : "opacity-0"
        )}
      >
        <div>
          <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
          <p className="mb-1">{item.description}</p>
          <p className="text-sm font-mono opacity-80">Posted by: {item.contact}</p>
        </div>

        <div className="flex justify-end">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Chat with ${item.contact} on WhatsApp`}
            className="bg-green-600 hover:bg-green-700 rounded-full p-2 shadow-lg transition-colors"
          >
            <WhatsappIcon />
          </a>
        </div>
      </div>
    </div>
  );
});

LostAndFoundCard.displayName = "LostAndFoundCard";

const LostAndFound = () => {
  const [hovered, setHovered] = useState(null);

  // Show only first 6 items here
  const previewItems = lostAndFoundItems.slice(0, 6);

  return (
    <section
      id="lostfound"
      className="w-full min-h-screen py-10 px-4 md:px-10 bg-gradient-to-br from-orange-50 via-white to-orange-100 font-sans"
    >
      <h2 className="text-5xl font-extrabold text-orange-700 mb-14 text-center drop-shadow-lg tracking-tight animate-fadeIn">
        Lost &amp; Found
      </h2>

      <div className="w-full max-w-full grid grid-cols-1 md:grid-cols-3 gap-8 mx-auto px-4 md:px-0">
        {previewItems.map((item, index) => (
          <LostAndFoundCard
            key={item.id}
            item={item}
            index={index}
            hovered={hovered}
            setHovered={setHovered}
          />
        ))}
      </div>

      <div className="mt-14 text-center max-w-5xl mx-auto">
        <Link
          to="/lostfound"
          className="text-orange-700 hover:text-orange-900 font-bold text-xl transition-colors duration-300 underline-offset-4 hover:underline"
        >
          See All Lost &amp; Found Items &rarr;
        </Link>
      </div>
    </section>
  );
};


export default LostAndFound;
