import React, { useEffect, useState } from "react";

const ImagePickerTest = () => {
  const [imageBlobUrl, setImageBlobUrl] = useState(null);
  const [fileName, setFileName] = useState("");

  // Load image from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("test-image-blob");
    if (stored) {
      const byteArray = Uint8Array.from(atob(stored), (c) => c.charCodeAt(0));
      const blob = new Blob([byteArray], { type: "image/jpeg" });
      const url = URL.createObjectURL(blob);
      setImageBlobUrl(url);
      console.log("✅ Loaded image blob from localStorage.");
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      console.warn("⚠️ No file selected");
      return;
    }

    console.log("📂 File selected:", file.name);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      const byteString = result.split(",")[1];
      localStorage.setItem("test-image-blob", byteString);
      console.log("💾 Image stored in localStorage as base64 blob.");
      const blob = new Blob([Uint8Array.from(atob(byteString), (c) => c.charCodeAt(0))], {
        type: file.type,
      });
      const url = URL.createObjectURL(blob);
      setImageBlobUrl(url);
    };
    reader.onerror = (err) => {
      console.error("❌ Error reading file:", err);
    };

    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    localStorage.removeItem("test-image-blob");
    setImageBlobUrl(null);
    setFileName("");
    console.log("🧹 Cleared image from localStorage.");
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-10 space-y-6">
      <h1 className="text-2xl font-bold text-cyan-400">🧪 Image Picker Tester</h1>

      <label className="w-full max-w-sm">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        <div className="cursor-pointer bg-gray-800 border-2 border-dashed border-gray-600 p-6 rounded-lg text-center hover:bg-gray-700 transition">
          <p className="text-sm text-gray-300">Tap to upload or take a photo</p>
          <p className="text-xs text-gray-500 mt-1">(image/* only)</p>
        </div>
      </label>

      {fileName && <p className="text-sm text-green-400">📁 Selected file: {fileName}</p>}

      {imageBlobUrl && (
        <div className="w-full max-w-sm">
          <img
            src={imageBlobUrl}
            alt="Selected Preview"
            className="w-full h-auto rounded border border-gray-700"
          />
          <button
            onClick={clearImage}
            className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white text-sm"
          >
            Clear Image
          </button>
        </div>
      )}
    </div>
  );
};

export default ImagePickerTest;
