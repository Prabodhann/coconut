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
    name: 'Greek Salad',
    description: 'A high-end, vibrant Greek Salad with fresh olives, feta cheese, cucumbers, tomatoes, and red onions, drizzled with olive oil.',
    price: 250,
    category: 'Salad',
    imagePath: '/Users/babumac/.gemini/antigravity/brain/b39380a7-3ea2-4f52-944f-cd967e85d041/greek_salad_premium_1775247800286.png'
  },
  {
    name: 'Paneer Kathi Roll',
    description: 'Gourmet Paneer Kathi Roll wrapped in a flaky paratha, filled with spicy marinated paneer cubes, onions, and green chutney.',
    price: 180,
    category: 'Rolls',
    imagePath: '/Users/babumac/.gemini/antigravity/brain/b39380a7-3ea2-4f52-944f-cd967e85d041/paneer_kathi_roll_gourmet_1775247818581.png'
  },
  {
    name: 'Veg Manchurian',
    description: 'Authentic Veg Manchurian balls in a rich, dark soy-based gravy with finely chopped ginger, garlic, and green onions.',
    price: 220,
    category: 'Chinese',
    imagePath: '/Users/babumac/.gemini/antigravity/brain/b39380a7-3ea2-4f52-944f-cd967e85d041/veg_manchurian_batch2_1775247892369.png'
  },
  {
    name: 'Veg Hakka Noodles',
    description: 'Delicious Veg Hakka Noodles stir-fried with colorful bell peppers, carrots, and cabbage, seasoned with soy sauce.',
    price: 200,
    category: 'Noodles',
    imagePath: '/Users/babumac/.gemini/antigravity/brain/b39380a7-3ea2-4f52-944f-cd967e85d041/veg_hakka_noodles_batch2_1775247904651.png'
  },
  {
    name: 'Dal Makhani',
    description: 'Rich and creamy Dal Makhani slow-cooked and topped with fresh cream, served in traditional style.',
    price: 320,
    category: 'Pure Veg',
    imagePath: '/Users/babumac/.gemini/antigravity/brain/b39380a7-3ea2-4f52-944f-cd967e85d041/dal_makhani_batch2_1775247921969.png'
  },
  {
    name: 'Red Velvet Cake Slice',
    description: 'Stunning slice of Red Velvet Cake with deep red cocoa layers and thick, smooth cream cheese frosting.',
    price: 150,
    category: 'Cake',
    imagePath: '/Users/babumac/.gemini/antigravity/brain/b39380a7-3ea2-4f52-944f-cd967e85d041/red_velvet_cake_batch3_1775247951712.png'
  },
  {
    name: 'Chocolate Lava Cake',
    description: 'Decadent Chocolate Lava Cake with a molten center oozing out, perfect for dessert lovers.',
    price: 180,
    category: 'Deserts',
    imagePath: '/Users/babumac/.gemini/antigravity/brain/b39380a7-3ea2-4f52-944f-cd967e85d041/chocolate_lava_cake_batch3_1775247966501.png'
  },
  {
    name: 'Falafel Wrap',
    description: 'Fresh Falafel Wrap in warm pita bread, filled with crispy falafel balls, hummus, and tahini.',
    price: 160,
    category: 'Rolls',
    imagePath: '/Users/babumac/.gemini/antigravity/brain/b39380a7-3ea2-4f52-944f-cd967e85d041/falafel_wrap_batch3_1775247983417.png'
  },
  {
    name: 'Arabiata Pasta',
    description: 'Authentic Penne Arabiata Pasta with a spicy tomato sauce, fresh basil, and parmesan.',
    price: 280,
    category: 'Pasta',
    imagePath: '/Users/babumac/.gemini/antigravity/brain/b39380a7-3ea2-4f52-944f-cd967e85d041/arabiata_pasta_batch4_1775248013338.png'
  },
  {
    name: 'Classic Club Sandwich',
    description: 'Triple-decker Club Sandwich with layers of grilled protein, lettuce, tomato, and mayo, served with fries.',
    price: 240,
    category: 'Sandwich',
    imagePath: '/Users/babumac/.gemini/antigravity/brain/b39380a7-3ea2-4f52-944f-cd967e85d041/club_sandwich_batch4_1775248029229.png'
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
