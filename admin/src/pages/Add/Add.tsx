import React, { useState } from 'react';
import { url } from '../../assets/assets';
import api from '../../services/api';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { UploadCloud, CheckCircle } from 'lucide-react';

import { FOOD_CATEGORIES } from '../../constants';

interface FoodFormData {
  name: string;
  description: string;
  price: string;
  category: string;
}

const Add: React.FC = () => {
  const [data, setData] = useState<FoodFormData>({
    name: '',
    description: '',
    price: '',
    category: 'Salad',
  });

  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const getBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      if (!image) {
        toast.error("Please upload an image.");
        setIsSubmitting(false);
        return;
      }
      const base64Image = await getBase64(image);
      const payload = {
        name: data.name,
        description: data.description,
        price: Number(data.price),
        category: data.category,
        imageData: base64Image,
      };

      const response = await api.post(`${url}/api/food/add`, payload, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.data.success) {
        toast.success(response.data.message);
        setData({
          name: '',
          description: '',
          price: '',
          category: 'Salad',
        });
        setImage(null);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred while adding the food item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const name = event.target.name;
    const value = event.target.value;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const onImageChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setImage(event.target.files[0]);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-2xl mx-auto w-full"
    >
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 p-8 transition-colors">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors">Add New Item</h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 transition-colors">Upload a new meal to the coconut menu</p>
        </div>

        <form className="flex flex-col gap-6" onSubmit={onSubmitHandler}>
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors">Upload Image</p>
            <label htmlFor="image" className="cursor-pointer group flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-lg h-32 hover:bg-orange-50 dark:hover:bg-slate-800 hover:border-orange-400 dark:hover:border-orange-500 transition-colors relative overflow-hidden">
              {image ? (
                <img src={URL.createObjectURL(image)} alt="upload" className="h-full w-full object-cover" />
              ) : (
                <div className="flex flex-col items-center text-gray-400 dark:text-slate-500 group-hover:text-orange-500 transition-colors">
                  <UploadCloud size={32} />
                  <span className="text-sm mt-2 font-medium">Click to upload</span>
                </div>
              )}
            </label>
            <input onChange={onImageChangeHandler} type="file" id="image" accept="image/*" hidden required />
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors">Product name</p>
            <input
              name="name"
              onChange={onChangeHandler}
              value={data.name}
              type="text"
              placeholder="e.g. Classic Greek Salad"
              required
              className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-950 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
            />
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors">Product description</p>
            <textarea
              name="description"
              onChange={onChangeHandler}
              value={data.description}
              rows={4}
              placeholder="Describe the meal ingredients and taste..."
              required
              className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-950 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors">Product category</p>
              <select
                name="category"
                onChange={onChangeHandler}
                value={data.category}
                className="px-4 py-2.5 rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-950 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all cursor-pointer"
              >
                {FOOD_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors">Product Price</p>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 font-bold">₹</span>
                <input
                  type="Number"
                  name="price"
                  onChange={onChangeHandler}
                  value={data.price}
                  placeholder="299"
                  min="0"
                  required
                  className="pl-8 pr-4 py-2.5 w-full rounded-lg border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-950 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="mt-4 flex items-center justify-center gap-2 w-full md:w-auto md:ml-auto px-8 py-3 bg-slate-900 dark:bg-orange-600 hover:bg-orange-600 dark:hover:bg-orange-500 text-white font-medium rounded-lg transition-colors active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, ease: "linear", duration: 1 }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
            ) : (
              <CheckCircle size={20} />
            )}
            {isSubmitting ? 'Uploading...' : 'Add Product'}
          </button>
        </form>
      </div>
    </motion.div>
  );
};

export default Add;
