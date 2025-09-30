import React, { useState } from "react";

const BackgroundVideo = () => {
  // Step 1: Create a state to manage video load
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Step 2: Handler for when the video is loaded
  const handleVideoLoad = () => {
    setVideoLoaded(true);
  };

  // Create an array with the image numbers
  const imageNumbers = Array.from({ length: 12 }, (_, index) => 286 + index); // Images 286 to 297

  return (
    <div className="relative w-full min-h-screen">
      {/* Background Image Layer (until video is loaded) */}
      {!videoLoaded && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="relative w-full h-full">
            {/* Image Container */}
            <div className="absolute inset-0 w-full h-full">
              {imageNumbers.map((imgNumber, index) => (
                <img
                  key={imgNumber}
                  src={`/Screenshot%20(${imgNumber}).png`} // Corrected image name syntax
                  alt={`loading ${imgNumber}`}
                  className="absolute w-full h-full object-cover transition-opacity duration-1000"
                  style={{
                    // If it's the first image, don't animate it (opacity 1 immediately)
                    opacity: index === 0 ? 1 : 0,
                    animation: index === 0
                      ? "" // No animation for the first image
                      : `fadeInOut 15s ease-in-out ${index * 5}s infinite`, // Animation for subsequent images
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Video Layer */}
      {/* Uncomment the video part when you're ready */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          onCanPlayThrough={handleVideoLoad} // Trigger when the video is ready
        >
          <source src="/Video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div> 

      {/* Inline CSS for image fading */}
      <style>
        {`
          @keyframes fadeInOut {
            0%, 100% { opacity: 0; }
            50% { opacity: 1; }
          }
        `}
      </style>
    </div>
  );
};

export default BackgroundVideo;
