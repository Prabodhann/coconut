import foodModel from '../models/foodModel.js';
import cloudinary from '../config/cloudinary.js';

// ── List all food items ───────────────────────────────────────────────────────
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.error('listFood error:', error);
    res.json({ success: false, message: 'Error fetching food list' });
  }
};

// ── Add a new food item ───────────────────────────────────────────────────────
const addFood = async (req, res) => {
  const { name, description, price, category, imageData } = req.body;

  if (!imageData) {
    return res.status(400).json({ success: false, message: 'Image is required' });
  }

  try {
    // Upload base64 image to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(imageData, {
      folder: 'coconut/foods',
      transformation: [
        { width: 800, height: 800, crop: 'limit' },
        { quality: 'auto', fetch_format: 'auto' },
      ],
    });

    const food = new foodModel({
      name,
      description,
      price: Number(price),
      category,
      image: uploadResult.secure_url,
      cloudinaryId: uploadResult.public_id,
    });

    await food.save();
    res.json({ success: true, message: 'Food Added' });
  } catch (error) {
    console.error('addFood error:', error);
    res.status(500).json({ success: false, message: 'Error adding food item' });
  }
};

// ── Remove a food item ────────────────────────────────────────────────────────
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    if (!food) {
      return res.json({ success: false, message: 'Food not found' });
    }

    // Delete image from Cloudinary if we have the public_id
    if (food.cloudinaryId) {
      await cloudinary.uploader.destroy(food.cloudinaryId);
    }

    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: 'Food Removed' });
  } catch (error) {
    console.error('removeFood error:', error);
    res.json({ success: false, message: 'Error removing food item' });
  }
};

export { listFood, addFood, removeFood };
