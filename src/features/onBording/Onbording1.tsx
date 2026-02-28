import { useState } from "react";
import type { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Image as ImageIcon } from "lucide-react"; 
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// 1. Import the hook correctly
import { useOnboarding } from "./OnboardingContext"; // Check your path!

// --- Validation Utils ---
const validateCambodianPhone = (phone: string): boolean => {
  const cleaned = phone.replace(/[+855\s-()]/g, '');
  return /^\d{8,9}$/.test(cleaned);
};

const onboardingSchema = z.object({
  restaurantName: z.string().min(1, "Restaurant name is required"),
  phone: z.string()
    .min(8, "Phone number must have 8-9 digits")
    .max(9, "Phone number must not exceed 9 digits")
    .refine(validateCambodianPhone, "Only 8-9 digits are allowed"),
  contactInfo: z.string().min(1, "Contact info is required"),
  address: z.string().min(5, "Address must be at least 5 characters"),
});

type OnboardingData = z.infer<typeof onboardingSchema>;

const Onbording1 = () => {
  const navigate = useNavigate();
  
  // 2. Get the global state and setter
  const { step1, setStep1 } = useOnboarding();

  // Local state for image preview (initialize with context image if exists)
  const [coverImage, setCoverImage] = useState<File | null>(step1.coverImage);
  const [imageError, setImageError] = useState("");

  // 3. Initialize Form with Default Values from Context
  // This ensures data persists when clicking "Back" from Step 2
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<OnboardingData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      restaurantName: step1.restaurantName,
      phone: step1.phone,
      contactInfo: step1.contactInfo,
      address: step1.address,
    }
  });

  // Watch phone for the controlled input
  const phoneValue = watch('phone');

  // Handle phone input
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/[^0-9]/g, '');
    value = value.slice(0, 9);
    setValue('phone', value); // Update react-hook-form
  };

  const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      const input = e.currentTarget;
      if (input.selectionStart === 0) e.preventDefault();
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImage(file);
      setImageError("");
      // Optional: Save to context immediately if you want
      // setStep1({ coverImage: file }); 
    }
  };

  // 4. Handle Submit - SAVE TO CONTEXT (Not Firebase yet)
  const onSubmit = (data: OnboardingData) => {
    if (!coverImage) {
      setImageError("Cover image is required");
      return;
    }

    // A. Save data to the Context (Global Store)
    setStep1({
      restaurantName: data.restaurantName,
      phone: data.phone,
      contactInfo: data.contactInfo,
      address: data.address,
      coverImage: coverImage // Saving the file object
    });

    // B. Navigate to next step
    console.log("Step 1 Saved, moving to Step 2");
    navigate("/onbording2");
  };

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden font-sans text-gray-800">
      <form onSubmit={handleSubmit(onSubmit)} className="relative z-10 px-8 py-8 max-w-7xl mx-auto h-screen flex flex-col">
        <div className="text-3xl font-bold mb-8">Restaurant Registration (Step 1/3)</div>
        <div className="bg-white rounded-[3rem] shadow-xl p-12 flex-1 flex flex-col md:flex-row gap-16 items-start">
            
            <div className="w-full md:w-1/2 flex flex-col gap-6">
                
                {/* Restaurant Name */}
                <div className="flex flex-col gap-2">
                    <label className="font-medium text-gray-700">Restaurant Name</label>
                    <input 
                        type="text" 
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        {...register("restaurantName")}
                    />
                    {errors.restaurantName && <span className="text-red-500 text-sm">{errors.restaurantName.message}</span>}
                </div>

                {/* Phone */}
                <div className="flex flex-col gap-2">
                    <label className="font-medium text-gray-700">Phone Number</label>
                    <div className="flex items-center border border-gray-300 rounded-xl focus-within:ring-2 focus-within:ring-yellow-400">
                        <span className="px-4 py-3 font-medium text-gray-700 rounded-l-xl" style={{ backgroundColor: '#FFB300' }}>+855</span>
                        <input 
                            type="text" 
                            inputMode="numeric"
                            placeholder="XX XXX XXX"
                            maxLength={9}
                            className="flex-1 px-4 py-3 focus:outline-none"
                            onChange={handlePhoneChange}
                            onKeyDown={handlePhoneKeyDown}
                            value={phoneValue} // Use the watched value
                        />
                    </div>
                    {errors.phone && <span className="text-red-500 text-sm">{errors.phone.message}</span>}
                </div>

                {/* Contact Info */}
                <div className="flex flex-col gap-2">
                    <label className="font-medium text-gray-700">Contact Email / Messenger / Telegram</label>
                    <input 
                        type="text" 
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        {...register("contactInfo")}
                    />
                    {errors.contactInfo && <span className="text-red-500 text-sm">{errors.contactInfo.message}</span>}
                </div>

                {/* Address */}
                <div className="flex flex-col gap-2">
                    <label className="font-medium text-gray-700">Address</label>
                    <input 
                        type="text" 
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        {...register("address")}
                    />
                    {errors.address && <span className="text-red-500 text-sm">{errors.address.message}</span>}
                </div>

            </div>

            {/* Image Upload */}
            <div className="w-full md:w-1/2 flex flex-col gap-2">
                 <label className="font-medium text-gray-700">Restaurant Cover</label>
                 <label className={`flex flex-col items-center justify-center w-full h-80 bg-[#FFF8E1] rounded-2xl cursor-pointer hover:bg-[#FFF3CD] transition-colors border-2 ${imageError ? 'border-red-500' : 'border-transparent border-dashed'}`}>
                    {coverImage ? (
                        <div className="w-full h-full relative">
                            {/* Note: URL.createObjectURL is needed to preview a File object */}
                            <img src={URL.createObjectURL(coverImage)} alt="Cover Preview" className="w-full h-full object-cover rounded-2xl" />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-4 text-gray-800">
                             <div className="bg-black text-white p-2 rounded-lg"><ImageIcon size={32} /></div>
                             <span className="font-medium">Upload Picture</span>
                        </div>
                    )}
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                 </label>
                 {imageError && <span className="text-red-500 text-sm text-center">{imageError}</span>}
            </div>

        </div>
        
        <div className="flex justify-end mt-8">
            <button
              type="submit"
              className="bg-[#FFC107] hover:bg-[#FFB300] text-black font-bold py-3 px-16 rounded-full shadow-lg text-lg transition-transform hover:scale-105"
            >
              Next Step
            </button>
        </div>
      </form>
    </div>
  );
};

export default Onbording1;