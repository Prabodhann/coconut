import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  addFood,
  listFood,
  removeFood,
} from '../controllers/foodController.js';

const router = express.Router();

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'foodImage') {
      cb(null, true);
    } else {
      cb(new Error('Unexpected field'));
    }
  },
});

// Get all food items
router.get('/list', listFood);

// Add a new food item
router.post('/add', upload.single('foodImage'), addFood);

// Update a food item
router.post('/remove', removeFood);

export default router;
