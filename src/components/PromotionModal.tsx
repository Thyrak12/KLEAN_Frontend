import { useState, useEffect } from "react";
import { X, Store, Tag, Percent } from "lucide-react";
import type { Promotion, CreatePromotionInput, PromotionStatus, PromotionType, RestaurantOfferType, MenuItem } from "../types/menu";
import { auth } from "../config/firebase";

interface PromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePromotionInput) => Promise<void>;
  uploadImage: (file: File) => Promise<string>;
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

const DISCOUNT_OPTIONS = [5, 10, 15, 20, 25, 30, 40, 50];

const RESTAURANT_OFFER_TYPES: { value: RestaurantOfferType; label: string; helper: string }[] = [
  { value: "percentage", label: "Discount Percentage", helper: "e.g., 20% off total bill" },
  { value: "non_discount", label: "Non-Discount Offer", helper: "e.g., Buy 1 Free 1, Free beer, Bundle deal" },
];

export default function PromotionModal({
  isOpen,
  onClose,
  onSubmit,
  uploadImage,
  promotion,
  menuItems,
  mode,
}: PromotionModalProps) {
  const [formData, setFormData] = useState<CreatePromotionInput>({
    scope: "overall",
    title: "",
    description: "",
    benefitType: "non_discount",
    benefitValue: 0,
    benefitText: "",
    menuItemId: "",
    startAt: new Date(),
    endAt: new Date(),
    isPublished: true,
    start_date: new Date(),
    end_date: new Date(),
    status: "active",
    promotion_type: "restaurant",
    offer_type: "non_discount",
    discount_value: 0,
    offer_details: "",
    menu_item_id: "",
    image: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (promotion && mode === "edit") {
      setFormData({
        scope: promotion.scope || (promotion.promotion_type === "menu_discount" ? "menu_item" : "overall"),
        title: promotion.title,
        description: promotion.description,
        benefitType: promotion.benefitType || (promotion.offer_type === "percentage" ? "percentage" : "non_discount"),
        benefitValue: promotion.benefitValue ?? promotion.discount_value ?? 0,
        benefitText: promotion.benefitText ?? promotion.offer_details ?? "",
        menuItemId: promotion.menuItemId ?? promotion.menu_item_id ?? "",
        startAt: new Date(promotion.startAt ?? promotion.start_date ?? new Date()),
        endAt: new Date(promotion.endAt ?? promotion.end_date ?? new Date()),
        isPublished: typeof promotion.isPublished === "boolean" ? promotion.isPublished : promotion.status !== "draft",
        start_date: new Date(promotion.start_date ?? promotion.startAt ?? new Date()),
        end_date: new Date(promotion.end_date ?? promotion.endAt ?? new Date()),
        status: promotion.status,
        promotion_type: promotion.promotion_type || "restaurant",
        offer_type: promotion.offer_type === "percentage" ? "percentage" : "non_discount",
        discount_value: promotion.discount_value || 0,
        offer_details: promotion.offer_details || "",
        menu_item_id: promotion.menu_item_id || "",
        image: promotion.image || "",
      });
      setPreviewImage(promotion.image || "");
      setImageFile(null);
    } else {
      setFormData({
        scope: "overall",
        title: "",
        description: "",
        benefitType: "non_discount",
        benefitValue: 0,
        benefitText: "",
        menuItemId: "",
        startAt: new Date(),
        endAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        isPublished: true,
        start_date: new Date(),
        end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: "active",
        promotion_type: "restaurant",
        offer_type: "non_discount",
        discount_value: 0,
        offer_details: "",
        menu_item_id: "",
        image: "",
      });
      setPreviewImage("");
      setImageFile(null);
    }
    setErrors({});
  }, [promotion, mode, isOpen]);

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

    if (formData.promotion_type === "restaurant") {
      if (!formData.offer_type) {
        newErrors.offer_type = "Please select an offer type";
      }

      if (formData.offer_type === "percentage" && (!formData.discount_value || formData.discount_value <= 0)) {
        newErrors.discount_value =
          "Please enter a valid percentage value";
      }

      if (formData.offer_type === "non_discount" && !formData.offer_details?.trim()) {
        newErrors.offer_details = "Please provide offer details";
      }
    }

    if (formData.promotion_type === "restaurant" && !imageFile && !formData.image) {
      newErrors.image = "Promotion image is required for restaurant promotion";
    }

    if (formData.promotion_type === "menu_discount" && !formData.menu_item_id) {
      newErrors.menu_item_id = "Please select a menu item for discount";
    }

    if (new Date(formData.end_date ?? new Date()) <= new Date(formData.start_date ?? new Date())) {
      newErrors.end_date = "End date must be after start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    if (!auth.currentUser) {
      setErrors((prev) => ({ ...prev, submit: "You must be logged in to create promotions. Please refresh the page and try again." }));
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrl = formData.image;
      if (formData.promotion_type === "restaurant" && imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      // Clean up data based on promotion type
      const submitData: CreatePromotionInput = {
        ...formData,
        scope: formData.promotion_type === "menu_discount" ? "menu_item" : "overall",
        benefitType: formData.offer_type === "percentage" ? "percentage" : "non_discount",
        benefitValue: formData.offer_type === "percentage" ? formData.discount_value : undefined,
        benefitText: formData.offer_type === "non_discount" ? formData.offer_details : undefined,
        menuItemId: formData.promotion_type === "menu_discount" ? formData.menu_item_id : undefined,
        startAt: formData.start_date ?? new Date(),
        endAt: formData.end_date ?? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        isPublished: formData.status !== "inactive",
        image: formData.promotion_type === "restaurant" ? imageUrl : undefined,
        offer_type: formData.promotion_type === "restaurant" ? formData.offer_type : undefined,
        discount_value:
          formData.promotion_type === "restaurant" &&
          formData.offer_type === "percentage"
            ? formData.discount_value
            : undefined,
        offer_details:
          formData.promotion_type === "restaurant" &&
          formData.offer_type === "non_discount"
            ? formData.offer_details
            : undefined,
        menu_item_id: formData.promotion_type === "menu_discount" ? formData.menu_item_id : undefined,
      };
      await onSubmit(submitData);
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
    } else if (name === "discount_value") {
      const numeric = parseFloat(value) || 0;
      setFormData((prev) => ({
        ...prev,
        discount_value: numeric,
        benefitValue: numeric,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleTypeChange = (type: PromotionType) => {
    setFormData((prev) => ({
      ...prev,
      promotion_type: type,
      offer_type: type === "restaurant" ? prev.offer_type || "non_discount" : undefined,
      discount_value: type === "restaurant" ? prev.discount_value || 0 : undefined,
      offer_details: type === "restaurant" ? prev.offer_details || "" : undefined,
      menu_item_id: type === "restaurant" ? "" : prev.menu_item_id,
    }));
    setErrors((prev) => ({
      ...prev,
      menu_item_id: "",
      image: "",
      offer_type: "",
      discount_value: "",
      offer_details: "",
    }));
  };

  const selectedOfferType = RESTAURANT_OFFER_TYPES.find((item) => item.value === formData.offer_type);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, image: "Please select a valid image file" }));
      return;
    }

    setImageFile(file);
    setPreviewImage(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, image: "" }));
  };

  const clearSelectedImage = () => {
    setImageFile(null);
    setPreviewImage("");
    setFormData((prev) => ({ ...prev, image: "" }));
  };

  const selectedMenuItem = menuItems.find((item) => item.id === formData.menu_item_id);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
    >
      <div className="bg-white rounded-2xl shadow-lg max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative bg-gradient-to-br from-amber-400 to-orange-500 rounded-t-2xl p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 rounded-full p-1.5 transition-colors"
          >
            <X size={20} className="text-white" />
          </button>
          <h2 className="text-xl font-bold text-white">
            {mode === "create" ? "Create Promotion" : "Edit Promotion"}
          </h2>
          <p className="text-white/80 text-sm mt-1">
            {mode === "create" ? "Set up a new promotion for your restaurant" : "Update your promotion details"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Promotion Type Selection */}
          <div>
            <label className="block text-gray-700 font-medium mb-3">
              Promotion Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Restaurant-wide Promotion */}
              <button
                type="button"
                onClick={() => handleTypeChange("restaurant")}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  formData.promotion_type === "restaurant"
                    ? "border-amber-400 bg-amber-50"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                {formData.promotion_type === "restaurant" && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  formData.promotion_type === "restaurant" ? "bg-amber-400" : "bg-gray-100"
                }`}>
                  <Store size={24} className={formData.promotion_type === "restaurant" ? "text-white" : "text-gray-500"} />
                </div>
                <span className={`font-semibold text-sm ${
                  formData.promotion_type === "restaurant" ? "text-amber-600" : "text-gray-700"
                }`}>
                  Restaurant Promo
                </span>
                <span className="text-xs text-gray-500 text-center">
                  General announcement or offer
                </span>
              </button>

              {/* Menu Discount */}
              <button
                type="button"
                onClick={() => handleTypeChange("menu_discount")}
                className={`relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  formData.promotion_type === "menu_discount"
                    ? "border-amber-400 bg-amber-50"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                {formData.promotion_type === "menu_discount" && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-amber-400 rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  formData.promotion_type === "menu_discount" ? "bg-amber-400" : "bg-gray-100"
                }`}>
                  <Tag size={24} className={formData.promotion_type === "menu_discount" ? "text-white" : "text-gray-500"} />
                </div>
                <span className={`font-semibold text-sm ${
                  formData.promotion_type === "menu_discount" ? "text-amber-600" : "text-gray-700"
                }`}>
                  Menu Discount
                </span>
                <span className="text-xs text-gray-500 text-center">
                  % off on specific item
                </span>
              </button>
            </div>
          </div>

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
              placeholder={formData.promotion_type === "restaurant" 
                ? "e.g., Happy Hour Special, Weekend Brunch Deal" 
                : "e.g., 20% Off Salmon Sushi"}
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
              placeholder={formData.promotion_type === "restaurant"
                ? "Describe your promotion, special offers, or announcements..."
                : "Brief description of the discount..."}
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

          {/* Restaurant Promotion Image (Required) */}
          {formData.promotion_type === "restaurant" && (
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Offer Format <span className="text-red-500">*</span>
              </label>
              <select
                name="offer_type"
                value={formData.offer_type || "non_discount"}
                onChange={handleChange}
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 bg-white mb-2 ${
                  errors.offer_type
                    ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-300 focus:border-amber-400 focus:ring-amber-100"
                }`}
              >
                {RESTAURANT_OFFER_TYPES.map((offer) => (
                  <option key={offer.value} value={offer.value}>
                    {offer.label}
                  </option>
                ))}
              </select>
              {selectedOfferType && (
                <p className="text-xs text-gray-500 mb-2">{selectedOfferType.helper}</p>
              )}
              {errors.offer_type && (
                <p className="text-red-500 text-sm mb-2">{errors.offer_type}</p>
              )}

              {formData.offer_type === "percentage" && (
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Discount Percentage
                    <span className="text-red-500"> *</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="1"
                    max="100"
                    name="discount_value"
                    value={formData.discount_value || 0}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.discount_value
                        ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                        : "border-gray-300 focus:border-amber-400 focus:ring-amber-100"
                    }`}
                    placeholder="e.g., 20"
                  />
                  {errors.discount_value && (
                    <p className="text-red-500 text-sm mt-1">{errors.discount_value}</p>
                  )}
                </div>
              )}

              {formData.offer_type === "non_discount" && (
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">
                    Offer Details <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="offer_details"
                    value={formData.offer_details || ""}
                    onChange={handleChange}
                    rows={2}
                    placeholder="e.g., Buy 1 ramen free 1 ramen / Free beer with any main course"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 resize-none ${
                      errors.offer_details
                        ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                        : "border-gray-300 focus:border-amber-400 focus:ring-amber-100"
                    }`}
                  />
                  {errors.offer_details && (
                    <p className="text-red-500 text-sm mt-1">{errors.offer_details}</p>
                  )}
                </div>
              )}

              <label className="block text-gray-700 font-medium mb-2">
                Promotion Image <span className="text-red-500">*</span>
              </label>

              <div className="flex items-start gap-4">
                <div className="w-28 h-28 rounded-xl border border-gray-200 bg-gray-50 overflow-hidden flex items-center justify-center flex-shrink-0">
                  {previewImage || formData.image ? (
                    <img
                      src={previewImage || formData.image}
                      alt="Promotion preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-xs text-gray-400 text-center px-2">No image selected</span>
                  )}
                </div>

                <div className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-700 file:mr-3 file:rounded-lg file:border-0 file:bg-amber-100 file:px-3 file:py-2 file:text-amber-700 file:font-medium hover:file:bg-amber-200"
                  />
                  <p className="text-xs text-gray-500 mt-2">Upload a clear image for your overall restaurant promotion.</p>

                  {(previewImage || formData.image) && (
                    <button
                      type="button"
                      onClick={clearSelectedImage}
                      className="mt-2 text-xs text-red-500 hover:text-red-600 font-medium"
                    >
                      Remove image
                    </button>
                  )}
                </div>
              </div>

              {errors.image && (
                <p className="text-red-500 text-sm mt-2">{errors.image}</p>
              )}
            </div>
          )}

          {/* Menu Discount Specific Fields */}
          {formData.promotion_type === "menu_discount" && (
            <>
              {/* Menu Item Selection */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Select Menu Item <span className="text-red-500">*</span>
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
                  <option value="">Choose a menu item...</option>
                  {menuItems.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.item_name} - ${item.price.toFixed(2)}
                    </option>
                  ))}
                </select>
                {errors.menu_item_id && (
                  <p className="text-red-500 text-sm mt-1">{errors.menu_item_id}</p>
                )}
              </div>

              {/* Discount Percentage */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Discount Percentage
                </label>
                <div className="flex flex-wrap gap-2">
                  {DISCOUNT_OPTIONS.map((discount) => (
                    <button
                      key={discount}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          discount_value: discount,
                          benefitValue: discount,
                        }))
                      }
                      className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                        formData.discount_value === discount
                          ? "bg-amber-400 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {discount}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Preview */}
              {selectedMenuItem && formData.discount_value && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      <img
                        src={selectedMenuItem.image || "https://via.placeholder.com/64?text=Item"}
                        alt={selectedMenuItem.item_name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{selectedMenuItem.item_name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-gray-400 line-through text-sm">
                          ${selectedMenuItem.price.toFixed(2)}
                        </span>
                        <span className="text-lg font-bold text-amber-600">
                          ${(selectedMenuItem.price * (1 - (formData.discount_value || 0) / 100)).toFixed(2)}
                        </span>
                        <span className="bg-amber-400 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Percent size={10} />
                          {formData.discount_value}% OFF
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Status and Dates */}
          <div className="grid grid-cols-3 gap-3">
            {/* Status */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 bg-white text-sm"
              >
                {PROMOTION_STATUSES.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Start Date */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Start
              </label>
              <input
                type="date"
                name="start_date"
                value={formatDateForInput(formData.start_date ?? new Date())}
                onChange={handleChange}
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 text-sm"
              />
            </div>

            {/* End Date */}
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                End
              </label>
              <input
                type="date"
                name="end_date"
                value={formatDateForInput(formData.end_date ?? new Date())}
                onChange={handleChange}
                className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 text-sm ${
                  errors.end_date
                    ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-300 focus:border-amber-400 focus:ring-amber-100"
                }`}
              />
              {errors.end_date && (
                <p className="text-red-500 text-xs mt-1">{errors.end_date}</p>
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
                ? "Create Promotion"
                : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
