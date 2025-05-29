import SellBuy from "../models/sellbuylistings.model.js";

export const createListing = async (req, res) => {
  try {
    const {
      title,
      price,
      category,
      description,
      whatsappNumber,
      email
    } = req.body;

    // req.file is the uploaded file
    const file = req.file;

    const newListing = new SellBuy({
      title,
      price,
      category,
      description,
      whatsappNumber,
      email,
      photo: file
        ? {
            data: file.buffer,      // buffer of file data
            contentType: file.mimetype,
          }
        : null,
    });

    const savedListing = await newListing.save();

    res.status(201).json({
      message: 'Listing created successfully',
      data: savedListing,
    });
  } catch (error) {
    res.status(400).json({
      message: 'Failed to create listing',
      error: error.message,
    });
  }
};
export const getAllListings = async (req, res) => {
  try {
    const listings = await SellBuy.find().sort({ createdAt: -1 });
    res.status(200).json(listings);
  } catch (error) {
    res.status(500).json({
      message: 'Error retrieving listings',
      error: error.message,
    });
  }
};

export const deleteListingById = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSellBuy = await SellBuy.findByIdAndDelete(id);

    if (!deletedSellBuy) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    res.status(200).json({ message: 'Listing deleted successfully' });
  } catch (error) {
    res.status(500).json({
      message: 'Failed to delete listing',
      error: error.message,
    });
  }
};
