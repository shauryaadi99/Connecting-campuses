import React from "react";
import {
  Heart,
  Linkedin,
  Instagram,
  Github,
  TreePalm,
  Home,
} from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 py-10 text-sm text-gray-500 animate-fadeInUp">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Left: Logo and Tagline */}
        <div className="text-center md:text-left">
          <h3 className="text-2xl font-extrabold text-orange-500 tracking-wide">
            <a href="/">Connecting Campuses</a>
          </h3>
          <p className="mt-1 text-gray-500">
            Empowering students, digitally ✨
          </p>
        </div>

        {/* Center: Social Icons */}
        <div className="flex justify-center flex-wrap gap-6">
          <a
            href="/"
            className="text-gray-400 hover:text-orange-500 transition-transform transform hover:scale-125 duration-300"
          >
            <Home size={28} strokeWidth={1.8} />
          </a>

          <a
            href="https://www.linkedin.com/in/shauryaaditya99/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-gray-400 hover:text-blue-500 transition-transform transform hover:scale-125 duration-300"
          >
            <Linkedin size={28} strokeWidth={1.8} />
          </a>
          <a
            href="https://www.instagram.com/vermibites"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-gray-400 hover:text-pink-600 transition-transform transform hover:scale-125 duration-300"
          >
            <Instagram size={28} strokeWidth={1.8} />
          </a>
          <a
            href="https://github.com/shauryaadi99/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-gray-400 hover:text-black transition-transform transform hover:scale-125 duration-300"
          >
            <Github size={28} strokeWidth={1.8} />
          </a>
          <a
            href="https://linktr.ee/Shaurya_Aditya_Verma"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Linktree"
            className="text-gray-400 hover:text-green-500 transition-transform transform hover:scale-125 duration-300"
          >
            <TreePalm size={28} strokeWidth={1.8} />
          </a>
        </div>

        {/* Right: Copyright */}
        <div className="text-center md:text-right">
          <p className="flex justify-center md:justify-end items-center gap-1 text-gray-500">
            Made with <Heart size={16} className="text-red-500" /> by Shaurya
          </p>
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()}{" "}
            <span className="font-medium text-gray-600">
              Connecting Campuses
            </span>
            . All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
