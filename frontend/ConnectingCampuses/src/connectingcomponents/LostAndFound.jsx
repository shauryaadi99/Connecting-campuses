import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { cn } from "../lib/utils";

import { USER_API_ENDPOINT } from "../../constants";
import { getImageSrc } from "../SellBuyPage";

const WhatsappIcon = () => (
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
);

const LostAndFoundCard = React.memo(({ item, index, hovered, setHovered }) => {
  const whatsappLink = `https://wa.me/${
    item.whatsapp
  }?text=Hi%20I%20am%20inquiring%20about%20your%20${encodeURIComponent(
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
      {item.imageSrc?.trim() ? (
        <img
          src={item.imageSrc}
          alt={item.title}
          className="object-cover w-full h-full absolute inset-0"
          loading="lazy"
        />
      ) : null}

      <div
        className={cn(
          "absolute inset-0 bg-black/70 text-white flex flex-col justify-between p-6 transition-opacity duration-300",
          hovered === index ? "opacity-100" : "opacity-0"
        )}
      >
        <div>
          <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
          <p className="mb-1">{item.description}</p>
          <p className="text-sm font-mono opacity-80">
            Posted by: {item.contact}
          </p>
        </div>

        <div className="flex justify-end">
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Chat with ${item.contact} on WhatsApp`}
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
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true); // 🌀 Loader state

  const fetchItems = async () => {
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
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const previewItems = items.slice(0, 6);

  return (
    <section
      id="lostfound"
      className="w-full min-h-screen py-10 px-4 md:px-10 bg-gradient-to-br from-orange-50 via-white to-orange-100 font-sans"
    >
      <h2 className="text-5xl font-extrabold text-orange-700 mb-14 text-center drop-shadow-lg tracking-tight animate-fadeIn">
        Lost &amp; Found
      </h2>

      {loading ? (
        <div className="w-full flex justify-center items-center py-20">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 border-[6px] border-orange-400 border-t-transparent rounded-full animate-spin relative">
              <div className="absolute inset-1 rounded-full bg-orange-300 opacity-20 blur-sm animate-pulse" />
            </div>
            <p className="text-lg font-semibold text-orange-600 animate-pulse">
              Finding your items...
            </p>
          </div>
        </div>
      ) : (
        <>
          <div className="w-full max-w-full grid grid-cols-1 md:grid-cols-3 gap-8 mx-auto px-4 md:px-0">
            {previewItems.map((item, index) => (
              <LostAndFoundCard
                key={item._id || item.title + index}
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
        </>
      )}
    </section>
  );
};

export default LostAndFound;
