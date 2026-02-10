import { useState, useRef, type ChangeEvent, type FormEvent } from "react";
import { ImageIcon, Link2, MapPin } from "lucide-react";

export default function RestaurantProfile() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    ownerName: "",
    email: "",
    phone: "",
    restaurantName: "",
    description: "",
    restaurantCategory: "",
    restaurantTable: "",
    address: "",
    mediaLink: "",
    openHour: "7",
    openMinute: "00",
    closeHour: "10",
    closeMinute: "00",
    priceMin: "7",
    priceMax: "100",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageClick = () => fileInputRef.current?.click();

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Submitted:", form);
  };

  /* ── shared styles ── */
  const inputClass =
    "w-full rounded-md border border-gray-300 px-5 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition";

  const timeBoxClass =
    "w-16 h-14 rounded-lg border-2 border-amber-400 bg-amber-50 text-center text-xl font-semibold text-gray-800 outline-none focus:ring-2 focus:ring-amber-400";

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-10">
      <div className="text-3xl font-bold text-gray-900 mb-8">
        Restaurant Profile
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-2"
      >
        {/* ═══════════════ LEFT COLUMN ═══════════════ */}
        <div className="space-y-5">
          {/* Owner Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Owner Name
            </label>
            <input
              name="ownerName"
              value={form.ownerName}
              onChange={handleChange}
              placeholder="Enter name"
              className={inputClass}
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Email
            </label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Example@gmail.com"
              className={inputClass}
            />
          </div>

          {/* Phone Number */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Phone Number
            </label>
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter phone number here"
              className={inputClass}
            />
          </div>

          {/* Restaurant Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Restaurant Name
            </label>
            <input
              name="restaurantName"
              value={form.restaurantName}
              onChange={handleChange}
              placeholder="Enter restaurant name"
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter description"
              rows={3}
              className="w-full rounded-2xl border border-gray-300 px-5 py-3 text-sm text-gray-700 placeholder-gray-400 outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition resize-none"
            />
          </div>

          {/* Restaurant Category & Table */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Restaurant Category
              </label>
              <select
                name="restaurantCategory"
                value={form.restaurantCategory}
                onChange={handleChange}
                className={inputClass + " appearance-none cursor-pointer"}
              >
                <option value="" disabled>
                  Enter restaurant type
                </option>
                <option value="fast-food">Fast Food</option>
                <option value="fine-dining">Fine Dining</option>
                <option value="cafe">Café</option>
                <option value="buffet">Buffet</option>
                <option value="casual">Casual Dining</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-1">
                Restaurant Table
              </label>
              <input
                name="restaurantTable"
                value={form.restaurantTable}
                onChange={handleChange}
                placeholder="Enter restaurant table"
                className={inputClass}
              />
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Address
            </label>
            <div className="relative">
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Enter address"
                className={inputClass + " pr-10"}
              />
              <MapPin
                size={20}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500"
              />
            </div>
          </div>
        </div>

        {/* ═══════════════ RIGHT COLUMN ═══════════════ */}
        <div className="space-y-6">
          {/* Upload Picture */}
          <div
            onClick={handleImageClick}
            className="mx-auto w-full max-w-xs h-48 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col items-center justify-center cursor-pointer hover:bg-amber-100 transition overflow-hidden"
          >
            {preview ? (
              <img
                src={preview}
                alt="Uploaded"
                className="w-full h-full object-cover"
              />
            ) : (
              <>
                <ImageIcon size={40} className="text-gray-400 mb-2" />
                <span className="text-sm text-gray-500">Upload Picture</span>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </div>

          {/* Media Link */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-1">
              Media Link
            </label>
            <div className="relative">
              <input
                name="mediaLink"
                value={form.mediaLink}
                onChange={handleChange}
                placeholder="Enter the link"
                className={inputClass + " pr-10"}
              />
              <Link2
                size={18}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>

          {/* Open / Close time */}
          <div className="flex items-end gap-8">
            {/* Open */}
            <div className="text-center">
              <span className="block text-sm font-semibold text-gray-700 mb-2">
                open
              </span>
              <div className="flex items-center gap-1">
                <input
                  name="openHour"
                  value={form.openHour}
                  onChange={handleChange}
                  maxLength={2}
                  className={timeBoxClass}
                />
                <span className="text-2xl font-bold text-gray-700">:</span>
                <input
                  name="openMinute"
                  value={form.openMinute}
                  onChange={handleChange}
                  maxLength={2}
                  className={timeBoxClass}
                />
              </div>
              <div className="flex gap-1 mt-1 text-xs text-gray-500">
                <span className="w-16 text-center">Hour</span>
                <span className="w-4" />
                <span className="w-16 text-center">Minute</span>
              </div>
            </div>

            {/* Close */}
            <div className="text-center">
              <span className="block text-sm font-semibold text-gray-700 mb-2">
                close
              </span>
              <div className="flex items-center gap-1">
                <input
                  name="closeHour"
                  value={form.closeHour}
                  onChange={handleChange}
                  maxLength={2}
                  className={timeBoxClass}
                />
                <span className="text-2xl font-bold text-gray-700">:</span>
                <input
                  name="closeMinute"
                  value={form.closeMinute}
                  onChange={handleChange}
                  maxLength={2}
                  className={timeBoxClass}
                />
              </div>
              <div className="flex gap-1 mt-1 text-xs text-gray-500">
                <span className="w-16 text-center">Hour</span>
                <span className="w-4" />
                <span className="w-16 text-center">Minute</span>
              </div>
            </div>
          </div>

          {/* Price Range */}
          <div className="">
            <span className="block text-sm font-semibold text-gray-700 mb-2">
              Price Range
            </span>
            <div className="flex items-center gap-2">
              <input
                name="priceMin"
                value={form.priceMin}
                onChange={handleChange}
                className={timeBoxClass}
              />
              <span className="text-2xl font-bold text-amber-500">$</span>

              <span className="text-xl text-gray-400 mx-1" />

              <input
                name="priceMax"
                value={form.priceMax}
                onChange={handleChange}
                className={timeBoxClass + " w-20"}
              />
              <span className="text-2xl font-bold text-amber-500">$</span>
            </div>
          </div>

          {/* Save Button */}
          <button
            type="submit"
            className="w-full rounded-2xl bg-amber-400 hover:bg-amber-500 text-black font-bold py-3 text-lg transition cursor-pointer"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
