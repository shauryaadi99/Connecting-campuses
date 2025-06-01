"use client";
import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import axios from "axios";
import { LayoutGrid } from "../components/ui/layout-grid";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// Replace with your actual endpoint
import { USER_API_ENDPOINT } from "../../constants";
import { getImageSrc } from "../SellBuyPage";

const SellBuySection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [marketItems, setMarketItems] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const fetchListings = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${USER_API_ENDPOINT}/api/sellbuys/listings`);

      const listingsWithImages = res.data.map((item) => ({
        ...item,
        imageSrc: getImageSrc(item.photo),
      }));

      setMarketItems(listingsWithImages.slice(0, 7)); // ✅ use image-enabled listings
    } catch (err) {
      setError("Failed to load listings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
        {item.imageSrc && (
          <img
            src={item.imageSrc}
            alt={item.title}
            className="w-full h-48 object-cover rounded-md mb-0"
          />
        )}
        <div>
          <p className="font-bold md:text-4xl text-xl text-white">
            {item.title}
          </p>
          <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
            {item.description}
          </p>
          <p className="text-white font-semibold">Price: ₹{item.price}</p>
          <p className="text-neutral-300 text-sm">Seller: {item.email}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div
      id="sellbuy"
      className="h-screen py-7 w-full bg-gray-900 flex flex-col overflow-y-auto"
    >
      <h2 className="text-4xl font-extrabold text-white text-center mb-8">
        College Buy Bonanza 🎉
      </h2>

      <div className="flex-grow mb-0">
        {loading ? (
          <div className="flex justify-center items-center h-full w-full py-10">
            <div className="flex flex-col items-center gap-6">
              <div className="w-16 h-16 border-[5px] border-cyan-400 border-t-transparent rounded-full animate-spin relative">
                <div className="absolute inset-1 rounded-full bg-cyan-400 opacity-20 blur-sm animate-pulse" />
              </div>
              <p className="text-cyan-300 font-medium text-lg animate-pulse tracking-wide">
                Fetching your marketplace…
              </p>
            </div>
          </div>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : isMobile ? (
          <>
            <div className="w-full overflow-x-auto no-scrollbar">
              <div
                className="flex space-x-4 snap-x snap-mandatory px-4 pb-6 overflow-x-auto no-scrollbar"
                onScroll={(e) => {
                  const scrollLeft = e.target.scrollLeft;
                  const cardWidth = e.target.clientWidth;
                  const index = Math.round(scrollLeft / cardWidth);
                  setCurrentSlide(index);
                }}
              >
                {" "}
                {marketItems.map((item, index) => (
                  <div
                    key={item._id || item.id}
                    className="min-w-full snap-center bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl shadow-xl p-5 border border-zinc-700 relative overflow-hidden"
                  >
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500 opacity-20 rounded-full blur-2xl" />
                    <div className="relative z-10">
                      {item.imageSrc && (
                        <img
                          src={item.imageSrc}
                          alt={item.title}
                          className="w-full h-48 object-cover rounded-xl mb-4 shadow-lg border border-zinc-700"
                        />
                      )}
                      <h3 className="text-white font-bold text-2xl mb-1 tracking-tight">
                        {item.title}
                      </h3>
                      <p className="text-neutral-300 text-sm leading-relaxed mb-4 line-clamp-4">
                        {item.description}
                      </p>
                      <p className="text-cyan-400 font-semibold text-lg">
                        ₹{item.price}
                      </p>
                      <p className="text-neutral-400 text-xs mt-1">
                        Seller: {item.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dots centered below cards */}
            <div className="flex justify-center mt-2 mb-6 space-x-2">
              {marketItems.map((_, index) => (
                <span
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "bg-cyan-400 scale-110"
                      : "bg-gray-500 opacity-50"
                  }`}
                ></span>
              ))}
            </div>
          </>
        ) : (
          <LayoutGrid
            cards={marketItems.map((item) => ({
              id: item._id || item.id,
              content: (
                <div>
                  <p className="font-bold md:text-4xl text-xl text-white">
                    {item.title}
                  </p>
                  <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
                    {item.description}
                  </p>
                  <p className="text-white font-semibold">
                    Price: ₹{item.price}
                  </p>
                  <p className="text-neutral-300 text-sm">
                    Seller: {item.email}
                  </p>
                </div>
              ),
              className: "col-span-1",
              thumbnail: item.imageSrc,
            }))}
          />
        )}
      </div>

      <div className="flex justify-center px-4">
        <button
          onClick={() => (window.location.href = "/sellbuy")}
          className="bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6 text-white"
        >
          <span className="absolute inset-0 overflow-hidden rounded-full">
            <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </span>
          <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-1.5 px-5 ring-1 ring-white/10">
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
    </div>
  );
};

export default SellBuySection;
