import foodModel from '../models/foodModel.js';
import fs from 'fs';

// all food list
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    // Convert image binary data to base64 strings
    const foodListWithBase64Images = foods.map((food) => ({
      ...food._doc,
      imageData: food.imageData ? food.imageData.toString('base64') : null,
    }));

    res.json({ success: true, data: foodListWithBase64Images });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: 'Error' });
  }
};

// add food
const addFood = async (req, res) => {
  const { name, description, price, category } = req.body;
  const imageFile = req.file;
  if (!imageFile) {
    return res
      .status(400)
      .json({ success: false, message: 'Image file is required' });
  }
  const imageData = fs.readFileSync(imageFile.path); // Read the image file as binary data

  const food = new foodModel({
    name,
    description,
    price,
    category,
    imageData,
  });
  try {
    await food.save();
    res.json({ success: true, message: 'Food Added' });
    // Remove the temporary uploaded file
    fs.unlinkSync(imageFile.path);
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: 'Error' });
  }
};

// delete food
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    if (!food) {
      return res.json({ success: false, message: 'Food not found' });
    }

    console.log('Food:', food); // Log the food object to see its structure

    // Check if food has an image property and it is not undefined or null
    if (food.image && typeof food.image === 'string') {
      // Construct the path to the image file
      const imagePath = `uploads/${food.image}`;

      // Check if the file exists before attempting to unlink
      if (fs.existsSync(imagePath)) {
        // Delete the image file
        fs.unlinkSync(imagePath);
      } else {
        console.log(`File not found: ${imagePath}`);
      }
    } else {
      console.log('Invalid or undefined image property:', food.image);
    }

    // Remove the food item from the database
    await foodModel.findByIdAndDelete(req.body.id);

    res.json({ success: true, message: 'Food Removed' });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: 'Error' });
  }
};

export { listFood, addFood, removeFood };
