import { useState, useRef } from "react";
import type { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Image as ImageIcon } from "lucide-react"; 
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api"; 

const LIBRARIES: string[] = ["places"];

// 1. Import the hook correctly
import { useOnboarding } from "./OnboardingContext";

// --- Validation Utils ---
const validateCambodianPhone = (phone: string): boolean => {
  // Remove all non-numeric characters
  const cleaned = phone.replace(/[^0-9]/g, '');
  
  // Regex explanation:
  // ^0?              -> Optional leading 0
  // (1[0-9]|2[3-6]|3[1-689]|4[2-4]|5[2-5]|6[0-13-46-9]|7[0-16-9]|8[0-13-9]|9[0-57-9]) -> Valid Cambodian Operator Prefixes
  // \d{6,7}$         -> Followed by 6 or 7 more digits
  const cambodiaPhoneRegex = /^0?(1[0-9]|2[3-6]|3[1-689]|4[2-4]|5[2-5]|6[0-13-46-9]|7[0-16-9]|8[0-13-9]|9[0-57-9])\d{6,7}$/;

  return cambodiaPhoneRegex.test(cleaned);
};

const extractCoordinates = (url: string) => {
  // Try pattern: @lat,lng
  const atMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (atMatch) return { lat: parseFloat(atMatch[1]), lng: parseFloat(atMatch[2]) };

  // Try pattern: query=lat,lng
  const queryMatch = url.match(/query=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (queryMatch) return { lat: parseFloat(queryMatch[1]), lng: parseFloat(queryMatch[2]) };

  // Try pattern: ?q=lat,lng or &q=lat,lng
  const qMatch = url.match(/[?&]q=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (qMatch) return { lat: parseFloat(qMatch[1]), lng: parseFloat(qMatch[2]) };

  // Try pattern: !3dlat!4dlng
  const exclamationMatch = url.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
  if (exclamationMatch) return { lat: parseFloat(exclamationMatch[1]), lng: parseFloat(exclamationMatch[2]) };

  return null;
};

const onboardingSchema = z.object({
  restaurantName: z.string().min(1, "Restaurant name is required"),
  phone: z.string()
    .min(8, "Phone number must have 8-9 digits")
    .max(10, "Phone number must not exceed 9 digits")
    .refine(validateCambodianPhone, "Only 8-9 digits are allowed"),
  contactInfo: z.string().min(1, "Contact info is required"),
  address: z.string().min(1, "Address is required"),
  googleMapLink: z.string().min(1, "Google Map link is required").url("Must be a valid URL"),
});

type OnboardingData = z.infer<typeof onboardingSchema>;

const Onbording1 = () => {
  const navigate = useNavigate();
  
  // 2. Get the global state and setter
  const { step1, setStep1 } = useOnboarding();

  // Local state for image preview (initialize with context image if exists)
  const [coverImage, setCoverImage] = useState<File | null>(step1.coverImage);
  const [imageError, setImageError] = useState("");

  // Local state for coordinates from Google Places
  const [latitude, setLatitude] = useState<number | null>(step1.latitude);
  const [longitude, setLongitude] = useState<number | null>(step1.longitude);
  const [googleMapLink, setGoogleMapLink] = useState<string>(step1.googleMapLink);

  // 3. Initialize Form with Default Values from Context
  // This ensures data persists when clicking "Back" from Step 2
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm<OnboardingData>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      restaurantName: step1.restaurantName,
      phone: step1.phone,
      contactInfo: step1.contactInfo,
      googleMapLink: step1.googleMapLink,
    }
  });

  // Watch phone & address for controlled inputs
  // eslint-disable-next-line react-hooks/incompatible-library
  const phoneValue = watch('phone');
  const googleMapLinkValue = watch('googleMapLink');

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
    const mapUrl = data.googleMapLink ?? googleMapLink;
    const coords = extractCoordinates(mapUrl);

    setStep1({
      restaurantName: data.restaurantName,
      phone: data.phone,
      contactInfo: data.contactInfo,
      latitude: coords ? coords.lat : latitude,
      longitude: coords ? coords.lng : longitude,
      googleMapLink: mapUrl,
      coverImage: coverImage // Saving the file object
    });

    // B. Navigate to next step
    console.log("Step 1 Saved, moving to Step 2");
    navigate("/onbording2");
  };

  // 1. Google Maps setup
  // Use the constant array so it doesn't trigger endless re-renders
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY , 
    libraries: LIBRARIES,
  });

  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  // 2. Handle when user selects a place from the autocomplete dropdown
  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      
      if (place.formatted_address) {
        // Update the form's address field
        setValue("address", place.formatted_address, { shouldValidate: true });
        
        // Optionally auto-fill coordinates / Google Maps Link if available
        if (place.geometry?.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          setLatitude(lat);
          setLongitude(lng);
          
          const mapLink = place.url || `https://maps.google.com/?q=${lat},${lng}`;
          setGoogleMapLink(mapLink);
          setValue('googleMapLink', mapLink, { shouldValidate: true });
        }
      }
    }
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
                    {isLoaded ? (
                      <Autocomplete
                        onLoad={(autocomplete) => { autocompleteRef.current = autocomplete; }}
                        onPlaceChanged={onPlaceChanged}
                        options={{ componentRestrictions: { country: "kh" } }} // Optional: restrict to Cambodia
                      >
                        <input 
                            type="text" 
                            placeholder="Street address, city, etc."
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            {...register("address")}
                        />
                      </Autocomplete>
                    ) : (
                      // Fallback while Google script loads
                      <input 
                          type="text" 
                          placeholder="Loading Google Autocomplete..."
                          disabled
                          className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-gray-100"
                      />
                    )}
                    {errors.address && <span className="text-red-500 text-sm">{errors.address.message}</span>}
                </div>

                {/* Google Map Link */}
                <div className="flex flex-col gap-2">
                    <label className="font-medium text-gray-700">Google Map Link</label>
                    <input
                        type="url"
                        placeholder="https://maps.google.com/..."
                        className={`w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
                          errors.googleMapLink ? 'border-red-500' : 'border-gray-300'
                        }`}
                        value={googleMapLinkValue ?? ''}
                        {...register('googleMapLink')}
                        onChange={(e) => {
                          const val = e.target.value;
                          setGoogleMapLink(val);
                          setValue('googleMapLink', val, { shouldValidate: true });
                          // Try to extract coordinates
                          const coords = extractCoordinates(val);
                          if (coords) {
                            setLatitude(coords.lat);
                            setLongitude(coords.lng);
                          }
                        }}
                    />
                    {errors.googleMapLink && <span className="text-red-500 text-sm">{errors.googleMapLink.message}</span>}
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