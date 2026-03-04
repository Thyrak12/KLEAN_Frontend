import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { Promotion, CreatePromotionInput, PromotionStatus, MenuItem } from "../types/menu";
import { auth } from "../config/firebase";

interface PromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePromotionInput) => Promise<void>;
  promotion?: Promotion | null;
  menuItems: MenuItem[];
  mode: "create" | "edit";
}

const PROMOTION_STATUSES: { value: PromotionStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "scheduled", label: "Scheduled" },
  { value: "expired", label: "Expired" },
];

const DISCOUNT_OPTIONS = [10, 15, 20, 25, 30, 40, 50];

export default function PromotionModal({
  isOpen,
  onClose,
  onSubmit,
  promotion,
  menuItems,
  mode,
}: PromotionModalProps) {
  const [formData, setFormData] = useState<CreatePromotionInput>({
    title: "",
    description: "",
    start_date: new Date(),
    end_date: new Date(),
    status: "active",
    menu_item_id: "",
    discount_percentage: 20,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (promotion && mode === "edit") {
      setFormData({
        title: promotion.title,
        description: promotion.description,
        start_date: new Date(promotion.start_date),
        end_date: new Date(promotion.end_date),
        status: promotion.status,
        menu_item_id: promotion.menu_item_id,
        discount_percentage: promotion.discount_percentage || 20,
      });
    } else {
      setFormData({
        title: "",
        description: "",
        start_date: new Date(),
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        status: "active",
        menu_item_id: menuItems[0]?.id || "",
        discount_percentage: 20,
      });
    }
    setErrors({});
  }, [promotion, mode, isOpen, menuItems]);

  const formatDateForInput = (date: Date): string => {
    return new Date(date).toISOString().split("T")[0];
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.menu_item_id) {
      newErrors.menu_item_id = "Please select a menu item";
    }

    if (new Date(formData.end_date) <= new Date(formData.start_date)) {
      newErrors.end_date = "End date must be after start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    // Check if user is authenticated before submitting
    if (!auth.currentUser) {
      setErrors((prev) => ({ ...prev, submit: "You must be logged in to create promotions. Please refresh the page and try again." }));
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Error submitting promotion:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to save promotion";
      setErrors((prev) => ({ ...prev, submit: errorMessage }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "start_date" || name === "end_date") {
      setFormData((prev) => ({ ...prev, [name]: new Date(value) }));
    } else if (name === "discount_percentage") {
      setFormData((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const selectedMenuItem = menuItems.find((item) => item.id === formData.menu_item_id);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="bg-white rounded-2xl shadow-lg max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header with Image */}
        <div className="relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 bg-white rounded-full p-1 hover:bg-gray-100 transition-colors shadow-md"
          >
            <X size={24} className="text-gray-700" />
          </button>

          {selectedMenuItem?.image ? (
            <div className="w-full h-48 overflow-hidden rounded-t-2xl">
              <img
                src={selectedMenuItem.image}
                alt={selectedMenuItem.item_name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-amber-400 to-orange-500 rounded-t-2xl flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {mode === "create" ? "New Promotion" : "Edit Promotion"}
              </span>
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Promotion Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., 50% Off Salmon Sushi"
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                errors.title
                  ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                  : "border-gray-300 focus:border-amber-400 focus:ring-amber-100"
              }`}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
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
              placeholder="Describe your promotion"
              rows={2}
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

          {/* Menu Item Selection */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Menu Item <span className="text-red-500">*</span>
            </label>
            <select
              name="menu_item_id"
              value={formData.menu_item_id}
              onChange={handleChange}
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 bg-white ${
                errors.menu_item_id
                  ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                  : "border-gray-300 focus:border-amber-400 focus:ring-amber-100"
              }`}
            >
              <option value="">Select a menu item</option>
              {menuItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.item_name} - ${item.price}
                </option>
              ))}
            </select>
            {errors.menu_item_id && (
              <p className="text-red-500 text-sm mt-1">{errors.menu_item_id}</p>
            )}
          </div>

          {/* Discount and Status Row */}
          <div className="grid grid-cols-2 gap-4">
            {/* Discount */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Discount %
              </label>
              <select
                name="discount_percentage"
                value={formData.discount_percentage}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 bg-white"
              >
                {DISCOUNT_OPTIONS.map((discount) => (
                  <option key={discount} value={discount}>
                    {discount}% Off
                  </option>
                ))}
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 bg-white"
              >
                {PROMOTION_STATUSES.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            {/* Start Date */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Start Date
              </label>
              <input
                type="date"
                name="start_date"
                value={formatDateForInput(formData.start_date)}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                End Date
              </label>
              <input
                type="date"
                name="end_date"
                value={formatDateForInput(formData.end_date)}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.end_date
                    ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-300 focus:border-amber-400 focus:ring-amber-100"
                }`}
              />
              {errors.end_date && (
                <p className="text-red-500 text-sm mt-1">{errors.end_date}</p>
              )}
            </div>
          </div>

          {/* Preview */}
          {selectedMenuItem && formData.discount_percentage && (
            <div className="bg-amber-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Price Preview:</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-gray-400 line-through">
                  ${selectedMenuItem.price}
                </span>
                <span className="text-xl font-bold text-amber-600">
                  ${(selectedMenuItem.price * (1 - (formData.discount_percentage || 0) / 100)).toFixed(2)}
                </span>
                <span className="bg-amber-400 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {formData.discount_percentage}% OFF
                </span>
              </div>
            </div>
          )}

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
                ? "Create Promotion"
                : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
