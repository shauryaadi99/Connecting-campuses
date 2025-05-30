import React, {
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
} from "react";
import {
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
  IconX,
  IconTrash,
} from "@tabler/icons-react";
import Linkify from "react-linkify";
import { cn } from "../../lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "../../hooks/use-outside-click";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { USER_API_ENDPOINT } from "../../../constants";
import { useLocation } from "react-router-dom"; // ✅ Add this at the top

const getImageSrc = (photo) => {
  if (!photo?.data?.data || !photo?.contentType) return "";

  const blob = new Blob([new Uint8Array(photo.data.data)], {
    type: photo.contentType,
  });

  return URL.createObjectURL(blob); // fast & browser-native
};

export const CarouselContext = createContext({
  onCardClose: () => {},
  currentIndex: 0,
});

export const Carousel = ({ items, initialScroll = 0 }) => {
  const user = useAuth();
  const carouselRef = React.useRef(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll;
      checkScrollability();
    }
  }, [initialScroll]);

  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const isMobile = () => {
    // Safe check for window during SSR
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768;
  };

  const handleCardClose = (index) => {
    if (carouselRef.current) {
      const cardWidth = isMobile() ? 230 : 384; // md:w-96
      const gap = isMobile() ? 4 : 8;
      const scrollPosition = (cardWidth + gap) * index;

      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    }
  };

  return (
    <CarouselContext.Provider
      value={{ onCardClose: handleCardClose, currentIndex }}
    >
      <div className="relative w-full">
        <div
          className="flex w-full overflow-x-scroll overscroll-x-auto scroll-smooth py-10 [scrollbar-width:none] md:py-20"
          ref={carouselRef}
          onScroll={checkScrollability}
        >
          <div
            className={cn(
              "absolute right-0 z-[1000] h-auto w-[5%] overflow-hidden bg-gradient-to-l"
            )}
          ></div>

          <div
            className={cn(
              "flex flex-row justify-start gap-4 pl-4",
              "mx-auto max-w-7xl" // removed comment for clarity
            )}
          >
            {items.map((item, index) => (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    delay: 0.2 * index,
                    ease: "easeOut",
                    once: true,
                  },
                }}
                key={"card" + index}
                className="rounded-3xl last:pr-[5%] md:last:pr-[33%]"
              >
                {item}
              </motion.div>
            ))}
          </div>
        </div>
        <div className="mr-10 flex justify-end gap-2">
          <button
            className="relative z-40 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 disabled:opacity-50"
            onClick={scrollLeft}
            disabled={!canScrollLeft}
          >
            <IconArrowNarrowLeft className="h-6 w-6 text-gray-500" />
          </button>
          <button
            className="relative z-40 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 disabled:opacity-50"
            onClick={scrollRight}
            disabled={!canScrollRight}
          >
            <IconArrowNarrowRight className="h-6 w-6 text-gray-500" />
          </button>
        </div>
      </div>
    </CarouselContext.Provider>
  );
};

export const Card = ({
  card,
  index,
  isOpen,
  onOpen,
  onClose,
  showDelete,
  onDelete,
}) => {
  const { user } = useAuth(); // fixed: no destructuring here
  const location = useLocation(); // ✅ Get current path
  const pathname = location.pathname;
  const imageSrc = getImageSrc(card.photo);
  const isListingView = pathname === "/newsroom"; // or whatever the route is

  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const { onCardClose, currentIndex } = useContext(CarouselContext);

  function onKeyDown(event) {
    if (event.key === "Escape") {
      handleClose();
    }
  }
  useEffect(() => {
    const shouldBeOpen = isListingView ? isOpen : open;

    if (shouldBeOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", onKeyDown);
    }

    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, isOpen, isListingView]);

  useOutsideClick(containerRef, () => handleClose());

  const handleOpen = () => {
    if (isListingView) {
      onOpen?.(); // inform parent to open
    } else {
      setOpen(true);
    }
  };

  const handleClose = () => {
    if (isListingView) {
      onClose?.(); // inform parent to close
    } else {
      setOpen(false);
      onCardClose(index); // only in carousel
    }
  };

  // Delete button handler
  const handleDeleteClick = async (e) => {
    e.stopPropagation();
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?"
    );
    if (!confirmed) return;

    if (!card._id) return;
    // console.log("Deleting event with ID:", card._id);

    try {
      // Call the DELETE endpoint
      await axios.delete(
        `${USER_API_ENDPOINT}/api/college-events/${card._id}`,
        {
          withCredentials: true,
        }
      );

      // Notify parent to remove from state
      if (onDelete) {
        onDelete(card._id);
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete the event. Please try again.");
    }
  };

  const canDelete = user?.email && user.email === card.email;
  const canShowTrash = canDelete && pathname === "/newsroom"; // ✅ Conditional check here  // console.log("User email:", user?.email);
  // console.log("Card email:", card.email);
  // console.log("Card rendered with canDelete:", canDelete);

  return (
    <>
      <AnimatePresence>
        {(isListingView ? isOpen : open) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              ref={containerRef}
              layout
              layoutId={card.title ? `card-${card.title}` : undefined}
              className="relative z-[60] mx-auto w-full max-w-4xl max-h-[85vh] overflow-y-auto rounded-3xl bg-white p-6 font-sans md:p-10 dark:bg-neutral-900"
            >
              {" "}
              <button
                className="absolute top-4 right-4 z-[70] flex h-8 w-8 items-center justify-center rounded-full bg-black dark:bg-white"
                onClick={handleClose}
              >
                <IconX className="h-6 w-6 text-white dark:text-black" />
              </button>
              {/* User email */}
              <motion.p className="text-sm font-medium text-black dark:text-white">
                {card?.email}
              </motion.p>
              {/* Title */}
              <motion.p
                layoutId={card.title ? `title-${card.title}` : undefined}
                className="mt-2 text-2xl font-semibold text-neutral-700 md:text-5xl dark:text-white"
              >
                {card.title}
              </motion.p>
              {/* Club name */}
              {card.club && (
                <motion.p className="mt-1 text-lg font-medium text-neutral-600 dark:text-neutral-300">
                  {card.club}
                </motion.p>
              )}
              <div className="py-10 text-white">
                <Linkify
                  componentDecorator={(href, text, key) => (
                    <a
                      href={href}
                      key={key}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline text-blue-400 break-words"
                    >
                      {text}
                    </a>
                  )}
                >
                  {card.content}
                </Linkify>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <motion.div
        layout
        layoutId={card.title ? `card-${card.title}` : undefined}
        onClick={handleOpen}
        className="relative z-10 flex h-80 w-56 flex-col items-start justify-start overflow-hidden rounded-3xl bg-gray-100 md:h-[40rem] md:w-96 dark:bg-neutral-900"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleOpen();
          }
        }}
      >
        {/* Delete button - only show if user owns this card */}
        {canShowTrash && (
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click
              handleDeleteClick(e);
            }}
            className="absolute top-3 right-3 z-50 flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white shadow-md transition-all duration-200 hover:scale-105 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1"
            title="Delete event"
          >
            <IconTrash className="h-5 w-5" stroke={2} />
          </button>
        )}

        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-full bg-gradient-to-b from-black/50 via-transparent to-transparent" />
        <div className="relative z-40 flex h-full w-full flex-col items-start justify-start p-4 md:p-8 text-left space-y-1">
          {/* Email */}
          {card.email && (
            <motion.p
              layoutId={card.email ? `email-${card.email}` : undefined} // fixed undefined layout
              className="w-full truncate text-xs font-medium text-white md:text-sm"
              title={card.email}
            >
              {card.email}
            </motion.p>
          )}

          {/* Title */}
          {card.title && (
            <motion.p
              layoutId={card.title ? `title-${card.title}` : undefined} // fixed undefined layout
              className="w-full truncate font-sans text-base font-semibold text-white md:text-2xl"
              title={card.title}
            >
              {card.title}
            </motion.p>
          )}

          {/* Club */}
          {card.club && (
            <motion.p
              layoutId={card.club ? `club-${card.club}` : undefined} // fixed undefined layout
              className="w-full truncate text-xs font-medium text-white md:text-sm"
              title={card.club}
            >
              {card.club}
            </motion.p>
          )}
        </div>
        <BlurImage
          src={imageSrc}
          alt={card.title}
          // Removed invalid fill="true" prop from img
          className="absolute inset-0 z-10 object-cover"
        />
      </motion.div>
    </>
  );
};

export const BlurImage = ({ height, width, src, className, alt, ...rest }) => {
  const [isLoading, setLoading] = useState(true);

  return (
    <img
      className={cn(
        "h-full w-full object-cover transition duration-300",
        isLoading
          ? "blur-sm grayscale scale-105"
          : "blur-0 grayscale-0 scale-100",
        className
      )}
      onLoad={() => setLoading(false)}
      src={src}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      alt={alt || "Image"}
      {...rest}
    />
  );
};
