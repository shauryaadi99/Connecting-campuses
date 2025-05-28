import NewsroomEvent from "../models/newsroom.model.js";

// Create a new newsroom event
const createNewsroomEvent = async (req, res) => {
  try {
    console.log("Received event data:", req.body);
    const event = new NewsroomEvent(req.body);
    const savedEvent = await event.save();
    console.log("Event saved:", savedEvent);
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

// Update newsroom event
const updateNewsroomEvent = async (req, res) => {
  try {
    const event = await NewsroomEvent.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!event) return res.status(404).json({ error: 'Newsroom event not found' });
    res.status(200).json(event);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete newsroom event
const deleteNewsroomEvent = async (req, res) => {
  try {
    console.log('Received delete request for ID:', req.params.id);

    const event = await NewsroomEvent.findByIdAndDelete(req.params.id);

    if (!event) {
      // console.log(`No event found with ID: ${req.params.id}`);
      return res.status(404).json({ error: 'Newsroom event not found' });
    }

    console.log(`Successfully deleted event with ID: ${req.params.id}`);
    res.status(200).json({ message: 'Newsroom event deleted successfully' });

  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: error.message });
  }
};


export {
  createNewsroomEvent,
  getAllNewsroomEvents,
  updateNewsroomEvent,
  deleteNewsroomEvent,
  getNewsroomEventsByEmail,
};