import 'dotenv/config';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

// ── Cloudinary config ─────────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── MongoDB connection ───────────────────────────────────────────────────────
const uri = process.env.MONGODB_URI;

const foodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  cloudinaryId: { type: String },
  category: { type: String, required: true },
});

const Food = mongoose.model('Food', foodSchema, 'foods');

const items = [
  {
    name: 'Classic Veggie Burger',
    description: 'Delicious classic veggie burger with a thick plant-based patty, melted cheese, fresh lettuce, tomato, and red onions with a side of crispy fries.',
    price: 280,
    category: 'Sandwich',
    imagePath: '/Users/babumac/.gemini/antigravity/brain/b39380a7-3ea2-4f52-944f-cd967e85d041/classic_veggie_burger_v1_1775248310095.png'
  },
  {
    name: 'Spicy Bean Burger',
    description: 'Spicy black bean burger with a crispy patty, jalapenos, spicy mayo, and avocado slices in a whole wheat bun.',
    price: 300,
    category: 'Sandwich',
    imagePath: '/Users/babumac/.gemini/antigravity/brain/b39380a7-3ea2-4f52-944f-cd967e85d041/spicy_bean_burger_v1_1775248328275.png'
  },
  {
    name: 'Margherita Pizza',
    description: 'Classic Margherita Pizza with thin crust, fresh tomato sauce, mozzarella, and basil leaves, wood-fired to perfection.',
    price: 350,
    category: 'Pure Veg',
    imagePath: '/Users/babumac/.gemini/antigravity/brain/b39380a7-3ea2-4f52-944f-cd967e85d041/margherita_pizza_v1_1775248342836.png'
  },
  {
    name: 'Farmhouse Pizza',
    description: 'Loaded Farmhouse Pizza with mushrooms, bell peppers, onions, tomatoes, and extra mozzarella cheese.',
    price: 450,
    category: 'Pure Veg',
    imagePath: '/Users/babumac/.gemini/antigravity/brain/b39380a7-3ea2-4f52-944f-cd967e85d041/farmhouse_pizza_v1_1775248381005.png'
  },
  {
    name: 'Paneer Tikka Pizza',
    description: 'Indo-Italian fusion Paneer Tikka Pizza with marinated paneer cubes, capsicum, and onions.',
    price: 480,
    category: 'Pure Veg',
    imagePath: '/Users/babumac/.gemini/antigravity/brain/b39380a7-3ea2-4f52-944f-cd967e85d041/paneer_tikka_pizza_v1_1775248396369.png'
  },
  {
    name: 'Gobi Manchurian',
    description: 'Crispy Gobi Manchurian tossed in a spicy, tangy, and slightly sweet Indo-Chinese sauce, garnished with spring onions.',
    price: 220,
    category: 'Chinese',
    imagePath: '/Users/babumac/.gemini/antigravity/brain/b39380a7-3ea2-4f52-944f-cd967e85d041/gobi_manchurian_v1_1775248410593.png'
  },
];

async function seed() {
  try {
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');

    for (const item of items) {
      console.log(`📤 Uploading ${item.name}...`);
      
      const uploadResult = await cloudinary.uploader.upload(item.imagePath, {
        folder: 'coconut/foods',
        transformation: [
          { width: 800, height: 800, crop: 'limit' },
          { quality: 'auto', fetch_format: 'auto' },
        ],
      });

      const food = new Food({
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        image: uploadResult.secure_url,
        cloudinaryId: uploadResult.public_id,
      });

      await food.save();
      console.log(`✅ Saved ${item.name} to DB`);
    }

    console.log('\n🎉 Seeding complete!');
    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  }
}

seed();
