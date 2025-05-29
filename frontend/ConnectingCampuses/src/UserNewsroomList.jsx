import React, { useEffect, useState } from "react";
import axios from "axios";

const USER_API_ENDPOINT = "http://localhost:3000/api/college-events/";

const NewsroomDashboard = () => {
  const [newsroomEvents, setNewsroomEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    category: "",
    club: "",
    title: "",
    photo: null,
    description: "",
    date: "",
  });

  const fetchEvents = async () => {
    try {
      const res = await axios.get(USER_API_ENDPOINT);
      setNewsroomEvents(res.data);
    } catch (err) {
      console.error("Failed to fetch events:", err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, photo: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    Object.entries(formData).forEach(([key, val]) => {
      if (val) form.append(key, val);
    });

    try {
      await axios.post(USER_API_ENDPOINT, form, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setShowForm(false);
      setFormData({
        category: "",
        club: "",
        title: "",
        photo: null,
        description: "",
        date: "",
      });
      fetchEvents(); // Refresh list
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };
  
 const getImageSrc = (photo) => {
  if (!photo?.data?.data || !photo?.contentType) return '';

  const blob = new Blob([new Uint8Array(photo.data.data)], {
    type: photo.contentType,
  });

  return URL.createObjectURL(blob); // fast & browser-native
};

  
  return (
    <div className="p-6 pt-40">
      <h2 className="text-2xl font-bold mb-4">Newsroom Events</h2>
      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded"
      >
        {showForm ? "Cancel" : "Add New Event"}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 border p-4 mb-6">
          <input
            type="text"
            name="category"
            placeholder="Category"
            value={formData.category}
            onChange={handleInputChange}
            className="border p-2 w-full"
            required
            />
          <input
            type="text"
            name="club"
            placeholder="Club"
            value={formData.club}
            onChange={handleInputChange}
            className="border p-2 w-full"
            required
            />
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleInputChange}
            className="border p-2 w-full"
            required
            />
          <textarea
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleInputChange}
            className="border p-2 w-full"
            />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className="border p-2 w-full"
            required
            />
          <input
            type="file"
            name="photo"
            accept="image/*"
            onChange={handleFileChange}
            className="border p-2 w-full"
            />
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded"
            >
            Submit
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {newsroomEvents.map((event) => {
        console.log("Event photo structure:", event.photo);
          const imgSrc = getImageSrc(event.photo);
          return (
            <div
              key={event._id}
              className="border p-4 rounded shadow-sm bg-white"
            >
              {imgSrc ? (
                <img
                  src={imgSrc}
                  alt={event.title}
                  className="w-full h-48 object-cover mb-3"
                />
              ) : (
                <div className="w-full h-48 bg-gray-200 mb-3 flex items-center justify-center text-gray-500">
                  No image
                </div>
              )}
              <h3 className="text-xl font-semibold">{event.title}</h3>
              <p className="text-gray-600">{event.description}</p>
              <p className="text-sm text-gray-500">
                {new Date(event.date).toLocaleDateString()} - {event.club}
              </p>
              <span className="text-xs bg-blue-100 px-2 py-1 rounded">
                {event.category}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NewsroomDashboard;
