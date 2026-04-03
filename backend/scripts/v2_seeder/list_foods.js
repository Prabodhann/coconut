import 'dotenv/config';
import mongoose from 'mongoose';
import fs from 'fs';

async function listFoods() {
  try {
    const uri = process.env.MONGODB_URI;
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');

    const foodSchema = new mongoose.Schema({
      name: String,
      description: String,
      price: Number,
      image: String,
      category: String,
    });

    const Food = mongoose.model('Food', foodSchema, 'foods');

    const foods = await Food.find({});
    console.log(`📦 Found ${foods.length} food items`);
    
    const output = foods.map(food => `- ${food.name} (${food.category}): ${food.description}`).join('\n');
    fs.writeFileSync('foods_inventory.txt', output);
    console.log('✅ Inventory saved to foods_inventory.txt');

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error listing foods:', error);
  }
}

listFoods();
