import { useState, useEffect, useRef } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import type { MenuItem, CreateMenuItemInput } from "../types/menu";
import { MENU_CATEGORIES } from "../types/menu";
import { useMenu } from "../features/menu/MenuContext";
import { auth } from "../config/firebase";

interface MenuItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateMenuItemInput) => Promise<void>;
  menuItem?: MenuItem | null;
  mode: "create" | "edit";
}

// Use string for price internally to avoid the "012" issue
interface FormDataInternal {
  item_name: string;
  description: string;
  price: string;
  category: string;
  image: string;
}

export default function MenuItemModal({
  isOpen,
  onClose,
  onSubmit,
  menuItem,
  mode,
}: MenuItemModalProps) {
  const { uploadImage } = useMenu();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<FormDataInternal>({
    item_name: "",
    description: "",
    price: "",
    category: "main_course",
    image: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (menuItem && mode === "edit") {
      setFormData({
        item_name: menuItem.item_name,
        description: menuItem.description,
        price: menuItem.price.toString(),
        category: menuItem.category,
        image: menuItem.image || "",
      });
    } else {
      setFormData({
        item_name: "",
        description: "",
        price: "",
        category: "main_course",
        image: "",
      });
    }
    setErrors({});
  }, [menuItem, mode, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.item_name.trim()) {
      newErrors.item_name = "Item name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    const priceNum = parseFloat(formData.price);
    if (formData.price === "" || isNaN(priceNum) || priceNum < 0) {
      newErrors.price = "Please enter a valid price (0 or greater)";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Check if user is authenticated before submitting
    if (!auth.currentUser) {
      setErrors((prev) => ({ ...prev, submit: "You must be logged in to create menu items. Please refresh the page and try again." }));
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    try {
      // Convert string price to number for submission
      const submitData: CreateMenuItemInput = {
        item_name: formData.item_name,
        description: formData.description,
        price: parseFloat(formData.price) || 0,
        category: formData.category as CreateMenuItemInput["category"],
        image: formData.image,
      };
      await onSubmit(submitData);
      onClose();
    } catch (error) {
      console.error("Error submitting menu item:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to save menu item. Please try again.";
      setErrors((prev) => ({ ...prev, submit: errorMessage }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, image: "Please select an image file" }));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: "Image size must be less than 5MB" }));
      return;
    }

    setIsUploading(true);
    try {
      const imageUrl = await uploadImage(file);
      setFormData((prev) => ({ ...prev, image: imageUrl }));
      setErrors((prev) => ({ ...prev, image: "" }));
    } catch (error) {
      console.error("Failed to upload image:", error);
      setErrors((prev) => ({ ...prev, image: "Failed to upload image. Please try again." }));
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="bg-white rounded-2xl shadow-lg max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">
            {mode === "create" ? "Create Menu Item" : "Edit Menu Item"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Image Upload */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Image
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            {formData.image ? (
              <div className="relative w-full">
                <div className="w-full h-40 rounded-xl overflow-hidden border-2 border-gray-200">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://via.placeholder.com/300x160?text=Image+Error";
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="absolute bottom-3 right-3 flex items-center gap-2 px-3 py-2 bg-white/90 hover:bg-white border border-gray-300 rounded-lg shadow-sm transition-colors disabled:opacity-50"
                >
                  {isUploading ? (
                    <Loader2 size={16} className="text-gray-600 animate-spin" />
                  ) : (
                    <Upload size={16} className="text-gray-600" />
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    {isUploading ? "Uploading..." : "Change"}
                  </span>
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-full h-40 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-amber-400 hover:bg-amber-50/30 transition-colors disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <Loader2 size={32} className="text-amber-400 animate-spin" />
                    <span className="text-sm text-gray-500">Uploading...</span>
                  </>
                ) : (
                  <>
                    <Upload size={32} className="text-gray-400" />
                    <span className="text-sm font-medium text-gray-600">Click to upload image</span>
                    <span className="text-xs text-gray-400">PNG, JPG up to 5MB</span>
                  </>
                )}
              </button>
            )}
            {errors.image && (
              <p className="text-red-500 text-sm mt-1">{errors.image}</p>
            )}
          </div>

          {/* Item Name */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Item Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="item_name"
              value={formData.item_name}
              onChange={handleChange}
              placeholder="Enter item name"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.item_name
                  ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                  : "border-gray-300 focus:border-amber-400 focus:ring-amber-100"
              }`}
            />
            {errors.item_name && (
              <p className="text-red-500 text-sm mt-1">{errors.item_name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter item description"
              rows={3}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 resize-none ${
                errors.description
                  ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                  : "border-gray-300 focus:border-amber-400 focus:ring-amber-100"
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Price and Category Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Price */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Price ($) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                inputMode="decimal"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.price
                    ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-300 focus:border-amber-400 focus:ring-amber-100"
                }`}
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">{errors.price}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 bg-white ${
                  errors.category
                    ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-300 focus:border-amber-400 focus:ring-amber-100"
                }`}
              >
                {MENU_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-red-500 text-sm mt-1">{errors.category}</p>
              )}
            </div>
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{errors.submit}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-3 bg-amber-400 hover:bg-amber-500 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? "Saving..."
                : mode === "create"
                ? "Create Menu Item"
                : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
