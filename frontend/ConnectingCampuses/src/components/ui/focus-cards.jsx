"use client";

import React, { useState } from "react";
import { cn } from "../../lib/utils";

const cardsData = [
  {
    title: "Exploring the Future of AI",
    src: "https://source.unsplash.com/random/800x600?technology&sig=1",
  },
  {
    title: "Designing with Purpose",
    src: "https://source.unsplash.com/random/800x600?design&sig=2",
  },
  {
    title: "Adventures in the Wild",
    src: "https://source.unsplash.com/random/800x600?nature&sig=3",
  },
  {
    title: "Minimalist Workspace Setup",
    src: "https://source.unsplash.com/random/800x600?workspace&sig=4",
  },
  {
    title: "Creative Coding Projects",
    src: "https://source.unsplash.com/random/800x600?coding&sig=5",
  },
  {
    title: "Urban Exploration",
    src: "https://source.unsplash.com/random/800x600?city&sig=6",
  },
  {
    title: "Capturing Moments",
    src: "https://source.unsplash.com/random/800x600?photography&sig=7",
  },
];

export const Card = React.memo(({ card, index, hovered, setHovered }) => (
  <div
    onMouseEnter={() => setHovered(index)}
    onMouseLeave={() => setHovered(null)}
    className={cn(
      "rounded-lg relative bg-gray-100 dark:bg-neutral-900 overflow-hidden h-60 md:h-96 w-full transition-all duration-300 ease-out",
      hovered !== null && hovered !== index && "blur-sm scale-[0.98]"
    )}
  >
    <img
      src={card.src}
      alt={card.title}
      className="object-cover absolute inset-0 w-full h-full"
    />
    <div
      className={cn(
        "absolute inset-0 bg-black/50 flex items-end py-8 px-4 transition-opacity duration-300",
        hovered === index ? "opacity-100" : "opacity-0"
      )}
    >
      <div className="text-xl md:text-2xl font-medium bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-200">
        {card.title}
      </div>
    </div>
  </div>
));

Card.displayName = "Card";

export function FocusCards() {
  const [hovered, setHovered] = useState(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto md:px-8 w-full">
      {cardsData.map((card, index) => (
        <Card
          key={card.title}
          card={card}
          index={index}
          hovered={hovered}
          setHovered={setHovered}
        />
      ))}
    </div>
  );
}
