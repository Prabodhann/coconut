/**
 * ONE-TIME MIGRATION SCRIPT
 * Moves food item images from MongoDB binary (Buffer) → Cloudinary URLs
 *
 * Run with: node scripts/migrateImagesToCloudinary.js
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import { v2 as cloudinary } from 'cloudinary';

// ── Cloudinary config ─────────────────────────────────────────────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Connect to MongoDB ────────────────────────────────────────────────────────
const uri = process.env.MONGODB_URI.includes('/food')
  ? process.env.MONGODB_URI
  : process.env.MONGODB_URI.replace(/\/[^/]*$/, '/food');

await mongoose.connect(uri);
console.log('✅ Connected to MongoDB (food database)\n');

// ── Get the foods collection directly (raw, no strict schema) ────────────────
const Food = mongoose.connection.collection('foods');

const foods = await Food.find({}).toArray();
console.log(`📦 Found ${foods.length} food items in MongoDB\n`);

let migrated = 0;
let skipped = 0;
let failed = 0;

for (const food of foods) {
  const name = food.name || food._id;

  // Already migrated — has a URL string, not a Buffer
  if (food.image && typeof food.image === 'string') {
    console.log(`⏭️  Skipping "${name}" — already has image URL`);
    skipped++;
    continue;
  }

  // No image data at all
  if (!food.imageData) {
    console.log(`⚠️  Skipping "${name}" — no imageData found`);
    skipped++;
    continue;
  }

  try {
    process.stdout.write(`🔄 Migrating "${name}"... `);

    // Convert the MongoDB Binary/Buffer to a Node.js Buffer
    const buffer = Buffer.isBuffer(food.imageData)
      ? food.imageData
      : Buffer.from(food.imageData.buffer || food.imageData);

    // Upload the buffer to Cloudinary as a data URI
    const base64 = buffer.toString('base64');
    // Try to detect image type from buffer header bytes
    let mimeType = 'image/jpeg'; // default
    if (buffer[0] === 0x89 && buffer[1] === 0x50) mimeType = 'image/png';
    else if (buffer[0] === 0x47 && buffer[1] === 0x49) mimeType = 'image/gif';
    else if (buffer[0] === 0x52 && buffer[1] === 0x49) mimeType = 'image/webp';

    const dataUri = `data:${mimeType};base64,${base64}`;

    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'coconut/foods',
      public_id: food._id.toString(),
      overwrite: true,
      resource_type: 'image',
      transformation: [
        { width: 800, height: 800, crop: 'limit' }, // cap size
        { quality: 'auto', fetch_format: 'auto' },  // auto WebP + compression
      ],
    });

    // Update MongoDB: set image URL, remove old imageData Buffer
    await Food.updateOne(
      { _id: food._id },
      {
        $set: { image: result.secure_url },
        $unset: { imageData: '' },
      }
    );

    console.log(`✅ Done (${result.secure_url.slice(0, 60)}...)`);
    migrated++;
  } catch (err) {
    console.log(`❌ Failed — ${err.message}`);
    failed++;
  }
}

console.log('\n─────────────────────────────────────────');
console.log(`✅ Migrated : ${migrated}`);
console.log(`⏭️  Skipped  : ${skipped}`);
console.log(`❌ Failed   : ${failed}`);
console.log('─────────────────────────────────────────');

await mongoose.disconnect();
console.log('\n🎉 Migration complete! MongoDB disconnected.');
process.exit(0);
