import React, { useEffect, useState } from "react";
import { url } from "../../assets/assets";
import api from "../../services/api";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Pencil, Upload, X } from "lucide-react";
import SkeletonList from "../../components/SkeletonList/SkeletonList";

import { FoodItem } from "../../types";
import { FOOD_CATEGORIES } from "../../constants";

const List: React.FC = () => {
  const [list, setList] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Edit Modal State
  const [editingItem, setEditingItem] = useState<FoodItem | null>(null);
  const [editData, setEditData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });
  const [editImage, setEditImage] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  // Filter State
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const allCategories = ["All", ...new Set(list.map((item) => item.category))];

  const toggleCategory = (cat: string) => {
    if (cat === "All") {
      setSelectedCategories([]);
    } else {
      setSelectedCategories((prev) =>
        prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
      );
    }
  };

  const filteredList = list.filter(
    (item) =>
      selectedCategories.length === 0 ||
      selectedCategories.includes(item.category),
  );

  const openEditModal = (item: FoodItem) => {
    setEditingItem(item);
    setEditData({
      name: item.name,
      description: item.description,
      price: String(item.price),
      category: item.category,
    });
    setEditImage(null);
  };

  const handleEditImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setEditImage(reader.result as string);
      };
    }
  };

  const submitEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!editingItem) return;
    setIsUpdating(true);
    try {
      const payload: Record<string, unknown> = {
        id: editingItem._id,
        name: editData.name,
        description: editData.description,
        price: Number(editData.price),
        category: editData.category,
      };
      if (editImage) {
        payload.imageData = editImage;
      }

      const response = await api.post(`${url}/api/food/edit`, payload);
      if (response.data.success) {
        toast.success(response.data.message);
        setEditingItem(null);
        await fetchList();
      } else {
        toast.error(response.data.message || "Error updating item");
      }
    } catch {
      toast.error("Network error while updating");
    } finally {
      setIsUpdating(false);
    }
  };

  const fetchList = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`${url}/api/food/list`);
      if (response.data.success) {
        setList(response.data.data);
      } else {
        toast.error("Error fetching food list");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setIsLoading(false);
    }
  };

  const removeFood = async (foodId: string) => {
    try {
      const response = await api.post(`${url}/api/food/remove`, {
        id: foodId,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error("Error removing food item");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error occurred while removing food item");
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  if (isLoading) {
    return <SkeletonList />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="max-w-5xl mx-auto w-full"
    >
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-100 dark:border-slate-800 overflow-hidden transition-colors">
        <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50/50 dark:bg-slate-950/50 transition-colors">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors">
              Food Inventory
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1 transition-colors">
              Manage all available meals
            </p>
          </div>
          <div className="px-4 py-1.5 bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 text-sm font-bold rounded-full shadow-sm border border-orange-200 dark:border-orange-500/30 transition-colors">
            {filteredList.length} Items
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-slate-950 px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex items-center gap-3 overflow-x-auto custom-scrollbar">
          {allCategories.map((cat) => {
            const isActive =
              cat === "All"
                ? selectedCategories.length === 0
                : selectedCategories.includes(cat);
            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  isActive
                    ? "bg-slate-800 text-white dark:bg-orange-500 dark:text-white shadow-md border-transparent"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100 dark:bg-slate-900 dark:border-slate-700 dark:text-gray-400 dark:hover:bg-slate-800"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredList.map((item, index) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                key={item._id || index}
                className="bg-white dark:bg-slate-950 rounded-xl overflow-hidden border border-gray-100 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group flex flex-col"
              >
                <div className="w-full h-56 relative overflow-hidden bg-gray-100 dark:bg-slate-800 border-b border-gray-100 dark:border-slate-800">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-md font-bold text-gray-900 dark:text-gray-100 border border-gray-200/50 dark:border-slate-700/50 transition-colors">
                    ₹{item.price}
                  </div>
                </div>

                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-xl text-gray-900 dark:text-gray-100 mb-2 truncate transition-colors">
                    {item.name}
                  </h3>

                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3 mb-5 leading-relaxed flex-1 transition-colors">
                    {item.description || "No description provided."}
                  </p>

                  <div className="pt-4 mt-auto border-t border-gray-100 dark:border-slate-800 flex justify-between items-center transition-colors">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-gray-300 transition-colors">
                      {item.category}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-2 text-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-blue-100 dark:hover:border-blue-500/20"
                        title="Edit Item"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => removeFood(item._id)}
                        className="p-2 text-red-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer border border-transparent hover:border-red-100 dark:hover:border-red-500/20"
                        title="Remove Item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredList.length === 0 && (
            <div className="py-16 text-center border-2 border-dashed border-gray-200 dark:border-slate-800 rounded-xl transition-colors">
              <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">
                No items match your filter!
              </p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {editingItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-gray-100 dark:border-slate-800 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-gray-50 dark:bg-slate-950">
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                  Edit Item
                </h3>
                <button
                  onClick={() => setEditingItem(null)}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 overflow-y-auto custom-scrollbar">
                <form onSubmit={submitEdit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Image (Optional Edit)
                    </label>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-200 dark:border-slate-700 flex-shrink-0 bg-gray-50 dark:bg-slate-800">
                        <img
                          src={editImage || editingItem.image}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <label className="flex-1 flex flex-col items-center justify-center py-3 px-4 border-2 border-dashed border-gray-300 dark:border-slate-700 rounded-xl hover:bg-gray-50 dark:hover:bg-slate-800 hover:border-orange-500 dark:hover:border-orange-500 transition-all cursor-pointer group">
                        <Upload
                          size={20}
                          className="text-gray-400 group-hover:text-orange-500 mb-1 transition-colors"
                        />
                        <span className="text-sm text-gray-500 dark:text-gray-400 group-hover:text-orange-600 dark:group-hover:text-orange-400">
                          Click to upload new image
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleEditImageUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Item Name
                    </label>
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) =>
                        setEditData({ ...editData, name: e.target.value })
                      }
                      className="w-full px-4 py-2 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none dark:text-gray-100 transition-all shadow-sm"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Description
                    </label>
                    <textarea
                      rows="3"
                      value={editData.description}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none dark:text-gray-100 transition-all resize-none shadow-sm"
                      required
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Category
                      </label>
                      <select
                        value={editData.category}
                        onChange={(e) =>
                          setEditData({ ...editData, category: e.target.value })
                        }
                        className="w-full px-4 py-2.5 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none dark:text-gray-100 transition-all shadow-sm cursor-pointer"
                      >
                        {FOOD_CATEGORIES.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Price
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-gray-500 dark:text-gray-400">
                          ₹
                        </span>
                        <input
                          type="number"
                          min="0"
                          value={editData.price}
                          onChange={(e) =>
                            setEditData({ ...editData, price: e.target.value })
                          }
                          className="w-full pl-8 pr-4 py-2 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none dark:text-gray-100 transition-all shadow-sm"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="w-full mt-6 py-3 px-4 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold rounded-lg shadow-sm hover:shadow transition-all"
                  >
                    {isUpdating ? "Saving Changes..." : "Save Changes"}
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default List;
