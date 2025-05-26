"use client";
import React from "react";
import { LayoutGrid } from "./layout-grid";

export default function LayoutGridDemo() {
  return (
    <div className="h-screen py-20 w-full">
      <LayoutGrid cards={cards} />
    </div>
  );
}

const SkeletonOne = () => (
  <div>
    <p className="font-bold md:text-4xl text-xl text-white">House in the woods</p>
    <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
      A serene and tranquil retreat, this house in the woods offers a peaceful escape from the hustle and bustle of city life.
    </p>
  </div>
);

const SkeletonTwo = () => (
  <div>
    <p className="font-bold md:text-4xl text-xl text-white">House above the clouds</p>
    <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
      Perched high above the world, this house offers breathtaking views and a unique living experience.
    </p>
  </div>
);

const SkeletonThree = () => (
  <div>
    <p className="font-bold md:text-4xl text-xl text-white">Greens all over</p>
    <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
      A house surrounded by greenery and nature’s beauty.
    </p>
  </div>
);

const SkeletonFour = () => (
  <div>
    <p className="font-bold md:text-4xl text-xl text-white">Rivers are serene</p>
    <p className="font-normal text-base my-4 max-w-lg text-neutral-200">
      A house by the river is a place of peace and tranquility.
    </p>
  </div>
);

const cards = [
  {
    id: 1,
    content: <SkeletonOne />,
    className: "md:col-span-2",
    thumbnail: "https://images.unsplash.com/photo-1476231682828-37e571bc172f?q=80",
  },
  {
    id: 2,
    content: <SkeletonTwo />,
    className: "col-span-1",
    thumbnail: "https://images.unsplash.com/photo-1464457312035-3d7d0e0c058e?q=80",
  },
  {
    id: 3,
    content: <SkeletonThree />,
    className: "col-span-1",
    thumbnail: "https://images.unsplash.com/photo-1588880331179-bc9b93a8cb5e?q=80",
  },
  {
    id: 4,
    content: <SkeletonFour />,
    className: "md:col-span-2",
    thumbnail: "https://images.unsplash.com/photo-1475070929565-c985b496cb9f?q=80",
  },
];
