import { useState } from "react";
import type { ChangeEvent } from "react";
import { doc, setDoc } from "firebase/firestore"; 
import { auth, db } from "../../config/firebase"; 
import { useNavigate } from "react-router-dom";
import { Image as ImageIcon } from "lucide-react"; // Remove Link import

const Onbording1 = () => {
  const [restaurantName, setRestaurantName] = useState("");
  const [phone, setPhone] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [address, setAddress] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  
  const navigate = useNavigate();

  const handleSaveDetails = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (!user) return; 

    try {
      // In a real app, you would upload the image to storage here first
      await setDoc(doc(db, "users", user.uid), {
        restaurantName: restaurantName, // Changed from fullName
        phone: phone,
        contactInfo: contactInfo,
        address: address,
        email: user.email,
        role: "restaurant_owner", // Assuming this is for restaurants
        createdAt: new Date(),
        // coverImageUrl: ... 
      });

      navigate("/onbording2");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCoverImage(e.target.files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden font-sans text-gray-800">
      
      {/* Background Decor - Yellow Wave (Bottom Left) */}
      {/* <div className="absolute bottom-0 left-0 pointer-events-none z-0">
        <svg width="500" height="400" viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 400V120C0 120 80 20 200 60C320 100 400 200 500 160V400H0Z" fill="#FFC107" fillOpacity="0.3" />
          <path d="M0 400V180C0 180 60 80 180 120C300 160 380 260 500 220V400H0Z" fill="#FFC107" fillOpacity="0.5" />
          <path d="M0 400V250C0 250 50 150 160 200C270 250 350 320 450 280V400H0Z" fill="#FFC107" fillOpacity="0.8" />
          <path d="M0 400V320C0 320 40 240 140 280C240 320 320 370 400 340V400H0Z" fill="#FFC107" />
        </svg>
      </div> */}

      <div className="relative z-10 px-12 py-8 max-w-7xl mx-auto h-screen flex flex-col">
        <div className="text-3xl font-bold mb-8">Restaurant Registration</div>
        <div className="bg-white rounded-[3rem] shadow-xl p-12 flex-1 flex flex-col md:flex-row gap-16 items-start">
            
            {/* Left Column: Form Fields */}
            <div className="w-full md:w-1/2 flex flex-col gap-6">
                
                {/* Restaurant Name */}
                <div className="flex flex-col gap-2">
                    <label className="font-medium text-gray-700">Restaurant Name</label>
                    <input 
                        type="text" 
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        value={restaurantName}
                        onChange={(e) => setRestaurantName(e.target.value)}
                    />
                </div>

                {/* Phone Number */}
                <div className="flex flex-col gap-2">
                    <label className="font-medium text-gray-700">Phone Number</label>
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="+855"
                            className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </div>
                </div>

                {/* Contact Email / Messenger ... */}
                <div className="flex flex-col gap-2">
                    <label className="font-medium text-gray-700">Contact Email / Messenger / Telegram / WhatsApp</label>
                    <input 
                        type="text" 
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        value={contactInfo}
                        onChange={(e) => setContactInfo(e.target.value)}
                    />
                </div>

                {/* Address */}
                <div className="flex flex-col gap-2">
                    <label className="font-medium text-gray-700">Address</label>
                    <input 
                        type="text" 
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </div>

            </div>

            {/* Right Column: Image Upload */}
            <div className="w-full md:w-1/2 flex flex-col gap-2">
                 <label className="font-medium text-gray-700">Restaurant Cover</label>
                 <label className="flex flex-col items-center justify-center w-full h-80 bg-[#FFF8E1] rounded-2xl cursor-pointer hover:bg-[#FFF3CD] transition-colors border-2 border-transparent border-dashed">
                    
                    {coverImage ? (
                        <div className="w-full h-full relative">
                            <img 
                                src={URL.createObjectURL(coverImage)} 
                                alt="Cover Preview" 
                                className="w-full h-full object-cover rounded-2xl" 
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 text-white font-medium rounded-2xl">Change Picture</div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-4 text-gray-800">
                             <div className="bg-black text-white p-2 rounded-lg">
                                <ImageIcon size={32} color="white" fill="white" />
                             </div>
                             <span className="font-medium">Upload Picture</span>
                        </div>
                    )}
                    
                    <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                         onChange={handleImageUpload}
                    />
                 </label>
            </div>

        </div>
        
        {/* Next Button - Floating or Bottom Right */}
        <div className="flex justify-end mt-8">
            <button 
                onClick={handleSaveDetails}
                className="bg-[#FFC107] hover:bg-[#FFB300] text-black font-bold py-3 px-16 rounded-full shadow-lg text-lg transition-transform hover:scale-105" 
            >
                Next
            </button>
        </div>

      </div>
    </div>
  );
};


export default Onbording1;