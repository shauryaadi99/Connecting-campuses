import React, { useState } from "react";

const ImagePickerTest = () => {
  const [preview, setPreview] = useState(null);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      console.log("No file selected");
      return;
    }

    console.log("File picked:", file);

    const previewURL = URL.createObjectURL(file);
    setPreview(previewURL);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result;
      console.log("Base64 string:", base64data);

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
    <div className="max-w-md mx-auto h-screen flex flex-col justify-center items-center p-6 bg-gray-800 rounded-lg shadow-lg text-white font-sans">
      <h2 className="text-2xl font-bold mb-4 text-center">Image Picker Test</h2>

      <input
        id="image-input"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <label
        htmlFor="image-input"
        className="bg-blue-500 hover:bg-blue-600 transition-colors duration-200 text-white py-2 px-6 rounded cursor-pointer mb-6"
      >
        Pick Image from Device
      </label>

      {preview && (
        <div className="w-full text-center">
          <p className="mb-2">Preview:</p>
          <img
            src={preview}
            alt="Picked"
            className="max-w-full rounded"
            onLoad={() => URL.revokeObjectURL(preview)}
          />
        </div>
      )}
    </div>
  );
};

export default ImagePickerTest;
