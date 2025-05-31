import React, { useRef, useState } from "react";

const ImagePickerTest = () => {
  const inputRef = useRef(null);
  const [preview, setPreview] = useState(null);

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      console.log("No file selected");
      return;
    }

    console.log("File picked:", file);

    // Create a URL for preview
    const previewURL = URL.createObjectURL(file);
    setPreview(previewURL);

    // Read the file as Base64 to store in localStorage
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result;
      console.log("Base64 string:", base64data);

      // Save to localStorage (limit ~5MB total)
      try {
        localStorage.setItem("pickedImage", base64data);
        console.log("Image saved to localStorage");
      } catch (error) {
        console.error("Failed to save image to localStorage", error);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      style={{
        maxWidth: 400,
        margin: "2rem auto",
        padding: "1rem",
        border: "2px solid #333",
        borderRadius: 8,
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h2>Mobile Image Picker Test</h2>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />

      <button
        onClick={handleButtonClick}
        style={{
          padding: "12px 24px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: 6,
          fontSize: 16,
          cursor: "pointer",
          marginBottom: "1rem",
        }}
      >
        Pick Image from Device
      </button>

      {preview && (
        <div>
          <p>Preview:</p>
          <img
            src={preview}
            alt="Picked"
            style={{ maxWidth: "100%", borderRadius: 8 }}
            onLoad={() => {
              // Free memory after image loads
              URL.revokeObjectURL(preview);
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ImagePickerTest;
