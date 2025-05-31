import React, { useState, useEffect } from "react";

const ImagePickerTest = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);

  // Revoke the blob URL when component unmounts or preview changes
  useEffect(() => {
    if (previewURL) {
      return () => URL.revokeObjectURL(previewURL);
    }
  }, [previewURL]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      console.log("No file selected");
      return;
    }

    console.log("File picked:", file);
    setSelectedImage(file);

    const url = URL.createObjectURL(file);
    setPreviewURL(url);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result;
      try {
        localStorage.setItem("pickedImage", base64data);
        console.log("Image saved to localStorage");
      } catch (err) {
        console.error("Failed to save image to localStorage", err);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setPreviewURL(null);
    localStorage.removeItem("pickedImage");
    console.log("Image removed from localStorage");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white px-4">
      <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg space-y-6 text-center">
        <h1 className="text-2xl font-bold">Image Picker Test</h1>

        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="text-white bg-gray-700 p-2 rounded w-full"
        />

        {previewURL && (
          <div>
            <p className="mb-2">Preview:</p>
            <img
              src={previewURL}
              alt="Picked"
              className="max-w-full rounded mb-4"
            />
            <button
              onClick={handleRemoveImage}
              className="bg-red-500 hover:bg-red-600 transition-colors px-4 py-2 rounded"
            >
              Remove Image
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImagePickerTest;
