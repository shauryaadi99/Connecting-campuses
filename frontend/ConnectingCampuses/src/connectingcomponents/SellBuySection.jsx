"use client";
import React from "react";
import Slider from "react-slick";
import { LayoutGrid } from "../components/ui/layout-grid";
import { useEffect, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const SellBuySection = () => {
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768); // Tailwind md breakpoint
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Show first 7 cards
  const visibleCards = cards.slice(0, 7);

  // Settings for react-slick carousel
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <div id="sellbuy" className="h-screen py-7 w-full bg-gray-900 flex flex-col">
      <h2 className="text-4xl font-extrabold text-white text-center mb-8">
        College Buy Bonanza 🎉
      </h2>

      <div className="flex-grow mb-0 ">
        {isMobile ? (
          <Slider {...settings}>
            {visibleCards.map((card) => (
              <div key={card.id} className="px-4">
                <div
                  className={`bg-zinc-800 mb-0 rounded-lg p-6 flex flex-col items-center`}
                >
                  {card.thumbnail && (
                    <img
                      src={card.thumbnail}
                      alt=""
                      className="w-full h-48 object-cover rounded-md mb-0"
                    />
                  )}
                  {card.content}
                </div>
              </div>
            ))}
          </Slider>
        ) : (
          <LayoutGrid cards={visibleCards} />
        )}
      </div>

      <div className="flex justify-center mt-0 ">
        <button
          onClick={() => (window.location.href = "/sellbuy")} // simpler than router here
          className="bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6  text-white inline-block"
        >
          <span className="absolute inset-0 overflow-hidden rounded-full">
            <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </span>
          <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-0.5 px-4 ring-1 ring-white/10 ">
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

const cards = [
  {
    id: 1,
    content: (
      <div>
        <p className="font-bold md:text-4xl text-xl text-white">
          HP Laptop (i5, 8GB RAM)
        </p>
        <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
          Lightly used, perfect for college assignments and online classes.
        </p>
        <p className="text-white font-semibold">Price: ₹22,000</p>
        <p className="text-neutral-300 text-sm">
          Seller: ananya.patel@college.edu
        </p>
      </div>
    ),
    className: "md:col-span-2",
    thumbnail:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    content: (
      <div>
        <p className="font-bold md:text-4xl text-xl text-white">
          Mountain Bike
        </p>
        <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
          Sturdy bike, barely used. Great for campus commuting.
        </p>
        <p className="text-white font-semibold">Price: ₹6,500</p>
        <p className="text-neutral-300 text-sm">
          Seller: rahul.singh@college.edu
        </p>
      </div>
    ),
    className: "col-span-1",
    thumbnail:
      "https://images.unsplash.com/photo-1508780709619-79562169bc64?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 3,
    content: (
      <div>
        <p className="font-bold md:text-4xl text-xl text-white">
          Casio Scientific Calculator
        </p>
        <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
          Almost new, required for engineering exams.
        </p>
        <p className="text-white font-semibold">Price: ₹400</p>
        <p className="text-neutral-300 text-sm">
          Seller: megha.sharma@college.edu
        </p>
      </div>
    ),
    className: "col-span-1",
    thumbnail:
      "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 4,
    content: (
      <div>
        <p className="font-bold md:text-4xl text-xl text-white">
          Guitar (Yamaha F310)
        </p>
        <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
          Well-maintained, includes bag and picks.
        </p>
        <p className="text-white font-semibold">Price: ₹4,200</p>
        <p className="text-neutral-300 text-sm">
          Seller: arjun.verma@college.edu
        </p>
      </div>
    ),
    className: "md:col-span-2",
    thumbnail:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 5,
    content: (
      <div>
        <p className="font-bold md:text-4xl text-xl text-white">
          Reference Books (CSE)
        </p>
        <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
          Includes Data Structures, Algorithms, and DBMS books.
        </p>
        <p className="text-white font-semibold">Price: ₹900</p>
        <p className="text-neutral-300 text-sm">
          Seller: priya.kumar@college.edu
        </p>
      </div>
    ),
    className: "col-span-1",
    thumbnail:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 6,
    content: (
      <div>
        <p className="font-bold md:text-4xl text-xl text-white">
          Noise Cancelling Headphones
        </p>
        <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
          Sony WH-1000XM4, excellent condition.
        </p>
        <p className="text-white font-semibold">Price: ₹12,500</p>
        <p className="text-neutral-300 text-sm">
          Seller: sachin.joshi@college.edu
        </p>
      </div>
    ),
    className: "col-span-1",
    thumbnail:
      "https://images.unsplash.com/photo-1511367461989-f85a21fda167?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 7,
    content: (
      <div>
        <p className="font-bold md:text-4xl text-xl text-white">
          Wireless Mouse
        </p>
        <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
          Logitech MX Master 3, ergonomic design, works with multiple devices.
        </p>
        <p className="text-white font-semibold">Price: ₹1,800</p>
        <p className="text-neutral-300 text-sm">
          Seller: nikhil.sharma@college.edu
        </p>
      </div>
    ),
    className: "col-span-1",
    thumbnail:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 8,
    content: (
      <div>
        <p className="font-bold md:text-4xl text-xl text-white">
          Android Smartphone
        </p>
        <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
          Samsung Galaxy M32, 6GB RAM, 128GB storage, good battery life.
        </p>
        <p className="text-white font-semibold">Price: ₹9,500</p>
        <p className="text-neutral-300 text-sm">
          Seller: kavya.rao@college.edu
        </p>
      </div>
    ),
    className: "md:col-span-2",
    thumbnail:
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 9,
    content: (
      <div>
        <p className="font-bold md:text-4xl text-xl text-white">Desk Lamp</p>
        <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
          LED adjustable desk lamp, perfect for late-night study sessions.
        </p>
        <p className="text-white font-semibold">Price: ₹700</p>
        <p className="text-neutral-300 text-sm">
          Seller: anil.kumar@college.edu
        </p>
      </div>
    ),
    className: "col-span-1",
    thumbnail:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 10,
    content: (
      <div>
        <p className="font-bold md:text-4xl text-xl text-white">
          Bluetooth Speaker
        </p>
        <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
          JBL Flip 5, waterproof, powerful sound for outdoor hangouts.
        </p>
        <p className="text-white font-semibold">Price: ₹3,200</p>
        <p className="text-neutral-300 text-sm">
          Seller: meera.patel@college.edu
        </p>
      </div>
    ),
    className: "col-span-1",
    thumbnail:
      "https://images.unsplash.com/photo-1570813097043-8d1a8587ebf0?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 11,
    content: (
      <div>
        <p className="font-bold md:text-4xl text-xl text-white">Backpack</p>
        <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
          Durable hiking backpack with multiple compartments, great for daily
          use.
        </p>
        <p className="text-white font-semibold">Price: ₹1,900</p>
        <p className="text-neutral-300 text-sm">
          Seller: raj.singh@college.edu
        </p>
      </div>
    ),
    className: "col-span-1",
    thumbnail:
      "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 12,
    content: (
      <div>
        <p className="font-bold md:text-4xl text-xl text-white">
          Portable Charger
        </p>
        <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
          Anker PowerCore 10000mAh, compact and fast charging power bank.
        </p>
        <p className="text-white font-semibold">Price: ₹1,400</p>
        <p className="text-neutral-300 text-sm">
          Seller: simran.kapoor@college.edu
        </p>
      </div>
    ),
    className: "col-span-1",
    thumbnail:
      "https://images.unsplash.com/photo-1580894894519-2f2067f9b2e3?auto=format&fit=crop&w=600&q=80",
  },
];
export default SellBuySection;
