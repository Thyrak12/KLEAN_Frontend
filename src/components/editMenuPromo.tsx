import { useState } from "react";
import { X } from "lucide-react";

interface FormData {
  name: string;
  startDate: string;
  endDate: string;
  promotionType: string;
  menu: string;
}

const promotionTypes = ["20% off", "30% off", "50% off", "Buy 1 Get 1"];
const menuOptions = ["Noodle soup", "Fried noodle", "Shrimp soup", "Spaghetti", "Grilled chicken"];

export default function EditMenuPromo() {
  const [formData, setFormData] = useState<FormData>({
    name: "New Year Promotion",
    startDate: "30 Nov, 2025",
    endDate: "02 Dec, 2025",
    promotionType: "20% off",
    menu: "Noodle soup",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add API call here
  };

  const handleClose = () => {
    console.log("Close modal");
    // Handle modal close
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full overflow-hidden">
        {/* Close Button */}
        <div className="relative">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 bg-white rounded-full p-1 hover:bg-gray-100 transition-colors"
          >
            <X size={24} className="text-gray-700" />
          </button>

          {/* Food Image */}
          <div className="w-full h-64 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&h=400&fit=crop"
              alt="Noodle soup"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-8">
          {/* Name Field */}
          <div className="mb-6">
            <label className="block text-gray-900 font-semibold mb-2">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              placeholder="Promotion name"
            />
          </div>

          {/* Start Date Field */}
          <div className="mb-6">
            <label className="block text-gray-900 font-semibold mb-2">Start date</label>
            <div className="relative">
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              />
            </div>
          </div>

          {/* End Date Field */}
          <div className="mb-6">
            <label className="block text-gray-900 font-semibold mb-2">End date</label>
            <div className="relative">
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100"
              />
            </div>
          </div>

          {/* Promotion Type Dropdown */}
          <div className="mb-6">
            <label className="block text-gray-900 font-semibold mb-2">Promotion type</label>
            <select
              name="promotionType"
              value={formData.promotionType}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 appearance-none cursor-pointer"
            >
              {promotionTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          {/* Menu Dropdown */}
          <div className="mb-8">
            <label className="block text-gray-900 font-semibold mb-2">Menu</label>
            <select
              name="menu"
              value={formData.menu}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 appearance-none cursor-pointer"
            >
              {menuOptions.map((menu) => (
                <option key={menu} value={menu}>
                  {menu}
                </option>
              ))}
            </select>
          </div>

          {/* Edit Button */}
          <button
            type="submit"
            className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold py-3 px-6 rounded-full transition-colors shadow-md"
          >
            Edit
          </button>
        </form>
      </div>
    </div>
  );
}
