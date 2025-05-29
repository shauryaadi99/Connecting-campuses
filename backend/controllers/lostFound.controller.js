import LostFoundItem from "../models/LostFoundItem.model.js";

// Add new lost/found item
export const addItem = async (req, res) => {
  try {
    const { title, description, contact, whatsapp, date } = req.body;

    if (!title || !description || !contact || !whatsapp || !date) {
      return res
        .status(400)
        .json({ message: "Please fill in all required fields." });
    }

    const itemDate = new Date(date);
    const today = new Date();

    if (itemDate > today) {
      return res.status(400).json({ message: "Date cannot be in the future." });
    }

    const file = req.file; // multer provides this
    const photo = file
      ? {
          data: file.buffer,
          contentType: file.mimetype,
        }
      : null;

    const newItem = new LostFoundItem({
      title,
      description,
      contact,
      whatsapp,
      date: itemDate,
      photo,
    });

    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    console.error("Error adding lost/found item:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

// Get all lost/found items
export const getItems = async (req, res) => {
  try {
    const items = await LostFoundItem.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    console.error("Error fetching lost/found items:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};

// Delete lost/found item by id
export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    await LostFoundItem.findByIdAndDelete(id);
    res.json({ message: "Item deleted successfully." });
  } catch (error) {
    console.error("Error deleting lost/found item:", error);
    res.status(500).json({ message: "Server error, please try again later." });
  }
};
