import Carpool from '../models/Carpool.model.js';

export const createCarpool = async (req, res) => {
  try {
    const {
      pickupLocation,
      dropLocation,
      travelDate,
      departureTime,
      seatsAvailable,
      additionalNotes,
      contactNumber,
      email
    } = req.body;

    const carpool = new Carpool({
      pickupLocation,
      dropLocation,
      travelDate,
      departureTime,
      seatsAvailable,
      additionalNotes,
      contactNumber,
      email
    });

    await carpool.save();
    res.status(201).json({ message: 'Carpool listing created successfully', carpool });
  } catch (error) {
    res.status(400).json({ message: 'Failed to create carpool listing', error: error.message });
  }
};

export const getAllCarpools = async (req, res) => {
  try {
    const carpools = await Carpool.find().sort({ travelDate: 1 });
    res.status(200).json(carpools);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching carpool listings', error: error.message });
  }
};

export const deleteCarpoolById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Carpool.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: 'Carpool listing not found' });
    }

    res.status(200).json({ message: 'Carpool listing deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting carpool listing', error: error.message });
  }
};
