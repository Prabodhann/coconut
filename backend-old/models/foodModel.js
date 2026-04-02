import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },       // Cloudinary URL
  cloudinaryId: { type: String, required: false }, // public_id for deletion
  category: { type: String, required: true },
});

const foodModel = mongoose.models.food || mongoose.model('food', foodSchema);
export default foodModel;
