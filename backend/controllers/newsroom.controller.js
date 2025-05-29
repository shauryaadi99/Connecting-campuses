import NewsroomEvent from "../models/newsroom.model.js";

// Create a new newsroom event (with image upload)
const createNewsroomEvent = async (req, res) => {
  try {
    const { category, club, title, description, date, email } = req.body;

    const event = new NewsroomEvent({
      category,
      club,
      title,
      description,
      date,
      email,
    });

    // Attach image if uploaded
    if (req.file) {
      event.photo = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    const savedEvent = await event.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error("Error saving event:", error);
    res.status(400).json({ error: error.message });
  }
};

// Get all newsroom events
const getAllNewsroomEvents = async (req, res) => {
  try {
    const events = await NewsroomEvent.find().sort({ date: -1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all events by email (creator)
const getNewsroomEventsByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const events = await NewsroomEvent.find({ email }).sort({ date: -1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update newsroom event (with optional image update)
const updateNewsroomEvent = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // If a new image is uploaded, include it
    if (req.file) {
      updateData.photo = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    const event = await NewsroomEvent.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!event) return res.status(404).json({ error: "Newsroom event not found" });
    res.status(200).json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete newsroom event
const deleteNewsroomEvent = async (req, res) => {
  try {
    const event = await NewsroomEvent.findByIdAndDelete(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Newsroom event not found" });
    }

    res.status(200).json({ message: "Newsroom event deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Serve event photo
const getEventPhoto = async (req, res) => {
  try {
    const event = await NewsroomEvent.findById(req.params.id);
    if (!event || !event.photo?.data) {
      return res.status(404).send("Image not found");
    }

    res.contentType(event.photo.contentType);
    res.send(event.photo.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {
  createNewsroomEvent,
  getAllNewsroomEvents,
  updateNewsroomEvent,
  deleteNewsroomEvent,
  getNewsroomEventsByEmail,
  getEventPhoto,
};
