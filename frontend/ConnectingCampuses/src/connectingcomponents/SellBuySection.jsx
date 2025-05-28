"use client";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import axios from "axios";
import { LayoutGrid } from "../components/ui/layout-grid";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Replace with your actual endpoint
import { USER_API_ENDPOINT } from "../../constants";

const SellBuySection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [marketItems, setMarketItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${USER_API_ENDPOINT}/api/sellbuys/listings`);
        setMarketItems(res.data.slice(0, 7)); // Slice first 7
      } catch (err) {
        setError("Failed to load listings.");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  const renderCard = (item) => (
    <div key={item._id || item.id} className="px-4">
      <div className="bg-zinc-800 mb-0 rounded-lg p-6 flex flex-col items-center">
        {item.imageUrl && (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-48 object-cover rounded-md mb-0"
          />
        )}
        <div>
          <p className="font-bold md:text-4xl text-xl text-white">{item.title}</p>
          <p className="font-normal text-base my-4 max-w-lg text-neutral-200">{item.description}</p>
          <p className="text-white font-semibold">Price: ₹{item.price}</p>
          <p className="text-neutral-300 text-sm">Seller: {item.email}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div id="sellbuy" className="h-screen py-7 w-full bg-gray-900 flex flex-col">
      <h2 className="text-4xl font-extrabold text-white text-center mb-8">
        College Buy Bonanza 🎉
      </h2>

      <div className="flex-grow mb-0">
        {loading ? (
          <p className="text-white text-center">Loading...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : isMobile ? (
          <Slider {...settings}>{marketItems.map(renderCard)}</Slider>
        ) : (
          <LayoutGrid
            cards={marketItems.map((item) => ({
              id: item._id || item.id,
              content: (
                <div>
                  <p className="font-bold md:text-4xl text-xl text-white">{item.title}</p>
                  <p className="font-normal text-base my-4 max-w-lg text-neutral-200">{item.description}</p>
                  <p className="text-white font-semibold">Price: ₹{item.price}</p>
                  <p className="text-neutral-300 text-sm">Seller: {item.email}</p>
                </div>
              ),
              className: "col-span-1",
              thumbnail: item.imageUrl,
            }))}
          />
        )}
      </div>

      <div className="flex justify-center mt-0">
        <button
          onClick={() => (window.location.href = "/sellbuy")}
          className="bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6 text-white inline-block"
        >
          <span className="absolute inset-0 overflow-hidden rounded-full">
            <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </span>
          <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-0.5 px-4 ring-1 ring-white/10">
            <span>Show more</span>
            <svg fill="none" height="16" viewBox="0 0 24 24" width="16" xmlns="http://www.w3.org/2000/svg">
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
    </div>
  );
};

export default SellBuySection;
