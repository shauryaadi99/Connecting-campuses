import React, { useState } from "react";

const ImagePickerTest = () => {
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return console.log("No file selected");

    console.log("File picked:", file);

    const previewURL = URL.createObjectURL(file);
    setPreview(previewURL);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result;
      localStorage.setItem("pickedImage", base64data);
      console.log("Image saved to localStorage");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-6 bg-gray-900 text-white h-screen flex flex-col items-center justify-center space-y-6">
      <h1 className="text-2xl font-bold">Image Picker Test</h1>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="text-white bg-gray-800 p-2 rounded"
      />

      {preview && (
        <div>
          <p className="mb-2 text-center">Preview:</p>
          <img src={preview} alt="Picked" className="max-w-xs rounded" />
        </div>
      )}
    </div>
  );
};

export default ImagePickerTest;
