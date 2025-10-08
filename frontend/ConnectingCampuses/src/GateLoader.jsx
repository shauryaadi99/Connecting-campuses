import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function GateLoader({ children }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Simulate cinematic load (3.5s)
    const timer = setTimeout(() => setIsLoaded(true), 3500);
    return () => clearTimeout(timer);
  }, []);

  const title = "Connecting Campuses".split("");

  return (
    <div className="relative w-full h-full">
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-b from-black via-gray-950 to-gray-900 text-white overflow-hidden"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* ✨ Animated radial glow */}
            <motion.div
              className="absolute w-[500px] h-[500px] bg-purple-500/30 blur-[180px] rounded-full"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1.2, opacity: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />

            {/* 🚪 Left Gate */}
            <motion.div
              className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-gray-950 via-gray-900 to-gray-800 shadow-2xl"
              initial={{ x: 0 }}
              animate={{ x: "-110%" }}
              transition={{ delay: 2.3, duration: 1.3, ease: [0.65, 0, 0.35, 1] }}
            />
            {/* 🚪 Right Gate */}
            <motion.div
              className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gray-950 via-gray-900 to-gray-800 shadow-2xl"
              initial={{ x: 0 }}
              animate={{ x: "110%" }}
              transition={{ delay: 2.3, duration: 1.3, ease: [0.65, 0, 0.35, 1] }}
            />

            {/* 🌟 Title Animation */}
            <motion.div
              className="relative z-10 text-center"
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            >
              <motion.h1
                className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 tracking-[0.12em]"
                style={{
                  fontSize: "clamp(1.8rem, 6vw, 4rem)",
                  textShadow:
                    "0 0 20px rgba(255,255,255,0.25), 0 0 40px rgba(147,51,234,0.25)",
                }}
              >
                {title.map((char, i) => (
                  <motion.span
                    key={i}
                    className="inline-block"
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{
                      delay: i * 0.05,
                      type: "spring",
                      stiffness: 200,
                      damping: 12,
                    }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </motion.h1>

              <motion.p
                className="mt-4 text-gray-300 text-sm sm:text-base md:text-lg tracking-wider"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 1 }}
              >
                Empowering students, digitally ✨
              </motion.p>
            </motion.div>

            {/* 🎈 Floating Particles */}
            {[...Array(25)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute bg-white/20 rounded-full"
                style={{
                  width: Math.random() * 5 + 2,
                  height: Math.random() * 5 + 2,
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  filter: "blur(1px)",
                }}
                animate={{
                  y: [0, -60],
                  opacity: [0.3, 1, 0],
                  x: [0, Math.random() * 40 - 20],
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "easeInOut",
                }}
              />
            ))}

            {/* 💫 Shimmer line (like a flash before gate opens) */}
            <motion.div
              className="absolute bottom-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-400/70 to-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0], scaleX: [0, 1.5, 0] }}
              transition={{
                delay: 2,
                duration: 0.8,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🌐 Main App fades in */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoaded ? 1 : 0 }}
        transition={{ duration: 1 }}
      >
        {children}
      </motion.div>
    </div>
  );
}
