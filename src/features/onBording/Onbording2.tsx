import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, DollarSign } from "lucide-react";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebase";

const CATEGORY_OPTIONS = [
  "BBQ", "Buffet", "Café", "Chinese", "Fast Food", "Fine Dining",
  "Italian", "Japanese", "Khmer", "Korean", "Seafood", "Thai", "Vegetarian",
];

const AMBIENCE_OPTIONS = [
  "Romantic", "Casual", "Family-Friendly", "Outdoor", "Rooftop",
  "Cozy", "Modern", "Traditional", "Lively", "Quiet",
];

const AMENITY_OPTIONS = [
  "Wifi", "Air Conditioning", "Pet Friendly",
  "Smoking Area", "Parking", "Live Band", "EV Charge",
];

// Reusable price row
const PriceRow = ({
  label,
  minVal,
  maxVal,
  onMinChange,
  onMaxChange,
}: {
  label: string;
  minVal: string;
  maxVal: string;
  onMinChange: (v: string) => void;
  onMaxChange: (v: string) => void;
}) => (
  <div className="mb-5">
    <p className="text-sm text-gray-500 mb-2">{label}</p>
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <div className="flex items-center bg-[#FFF8E1] rounded-full px-3 py-2 w-24">
          <input
            type="number"
            className="bg-transparent w-full outline-none text-sm"
            value={minVal}
            onChange={(e) => onMinChange(e.target.value)}
          />
        </div>
        <div className="bg-[#FFF8E1] rounded-full p-1.5">
          <DollarSign size={16} className="text-gray-600" />
        </div>
        <span className="text-sm text-gray-500">Min</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center bg-[#FFF8E1] rounded-full px-3 py-2 w-24">
          <input
            type="number"
            className="bg-transparent w-full outline-none text-sm"
            value={maxVal}
            onChange={(e) => onMaxChange(e.target.value)}
          />
        </div>
        <div className="bg-[#FFF8E1] rounded-full p-1.5">
          <DollarSign size={16} className="text-gray-600" />
        </div>
        <span className="text-sm text-gray-500">Max</span>
      </div>
    </div>
  </div>
);

const Register2 = () => {
  const navigate = useNavigate();

  const [category, setCategory] = useState("");
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [ambience, setAmbience] = useState<string[]>([]);
  const [ambienceOpen, setAmbienceOpen] = useState(false);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  // Pricing state
  const [mainDishMin, setMainDishMin] = useState("");
  const [mainDishMax, setMainDishMax] = useState("");
  const [beverageMin, setBeverageMin] = useState("");
  const [beverageMax, setBeverageMax] = useState("");
  const [signatureMin, setSignatureMin] = useState("");
  const [signatureMax, setSignatureMax] = useState("");
  const [bestSellingMin, setBestSellingMin] = useState("");
  const [bestSellingMax, setBestSellingMax] = useState("");
  const [groupSpendMin, setGroupSpendMin] = useState("");
  const [groupSpendMax, setGroupSpendMax] = useState("");

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const toggleAmbience = (tag: string) => {
    setAmbience((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleNext = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await setDoc(doc(db, "users", user.uid), {
        category,
        ambience,
        amenities: selectedAmenities,
        pricing: {
          mainDish: { min: mainDishMin, max: mainDishMax },
          beverage: { min: beverageMin, max: beverageMax },
          signature: { min: signatureMin, max: signatureMax },
          bestSelling: { min: bestSellingMin, max: bestSellingMax },
          groupSpend: { min: groupSpendMin, max: groupSpendMax },
        },
        onboardingCompleted: true,
      }, { merge: true });

      navigate("/");
    } catch (error) {
      console.error("Error saving onboarding data:", error);
    }
  };

  const handleBack = () => {
    navigate("/onbording1");
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

      <div className="relative z-10 px-12 py-8 max-w-7xl mx-auto min-h-screen flex flex-col">
        <div className="text-3xl font-bold mb-8">Restaurant Registration</div>

        <div className="bg-white rounded-[3rem] shadow-xl p-12 flex-1 flex flex-col md:flex-row gap-16 items-start">
          {/* Left Column */}
          <div className="w-full md:w-1/2 flex flex-col gap-8">
            {/* Restaurant Category */}
            <div>
              <h3 className="font-bold text-lg mb-3">Restaurant Category</h3>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setCategoryOpen(!categoryOpen)}
                  className="w-full md:w-[320px] border border-gray-300 rounded-full px-5 py-3 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <span className={category ? "text-gray-800" : "text-gray-400"}>
                    {category || "e.g BBQ"}
                  </span>
                  <ChevronDown size={20} className="text-gray-500" />
                </button>
                {categoryOpen && (
                  <div className="absolute z-20 mt-1 w-full md:w-[320px] bg-white border border-gray-200 rounded-2xl shadow-lg max-h-52 overflow-y-auto">
                    {CATEGORY_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          setCategory(opt);
                          setCategoryOpen(false);
                        }}
                        className={`w-full text-left px-5 py-2.5 hover:bg-yellow-50 text-sm ${
                          category === opt ? "bg-yellow-100 font-medium" : ""
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Ambience Tags */}
            <div>
              <h3 className="font-bold text-lg mb-3">Ambience Tags</h3>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setAmbienceOpen(!ambienceOpen)}
                  className="w-full md:w-[320px] border border-gray-300 rounded-full px-5 py-3 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <span className={ambience.length ? "text-gray-800" : "text-gray-400"}>
                    {ambience.length ? ambience.join(", ") : "(select multiple)"}
                  </span>
                  <ChevronDown size={20} className="text-gray-500" />
                </button>
                {ambienceOpen && (
                  <div className="absolute z-20 mt-1 w-full md:w-[320px] bg-white border border-gray-200 rounded-2xl shadow-lg max-h-52 overflow-y-auto">
                    {AMBIENCE_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => toggleAmbience(opt)}
                        className={`w-full text-left px-5 py-2.5 hover:bg-yellow-50 text-sm flex items-center gap-2 ${
                          ambience.includes(opt) ? "bg-yellow-100 font-medium" : ""
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded border flex items-center justify-center text-xs ${
                            ambience.includes(opt)
                              ? "bg-yellow-400 border-yellow-500 text-white"
                              : "border-gray-300"
                          }`}
                        >
                          {ambience.includes(opt) && "✓"}
                        </span>
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Amenities / Features */}
            <div>
              <h3 className="font-bold text-lg mb-3">Amenities / Features</h3>
              <div className="flex flex-wrap gap-2">
                {AMENITY_OPTIONS.map((amenity) => (
                  <button
                    key={amenity}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                      selectedAmenities.includes(amenity)
                        ? "bg-[#FFC107] border-[#FFC107] text-black font-medium"
                        : "bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {amenity}
                    {selectedAmenities.includes(amenity) && " ✓"}
                  </button>
                ))}
              </div>
              {/* Second row duplicated to match design */}
              {/* <div className="flex flex-wrap gap-2 mt-2">
                {AMENITY_OPTIONS.map((amenity) => (
                  <button
                    key={`row2-${amenity}`}
                    type="button"
                    onClick={() => toggleAmenity(amenity)}
                    className={`px-4 py-2 rounded-full text-sm border transition-colors ${
                      selectedAmenities.includes(amenity)
                        ? "bg-[#FFC107] border-[#FFC107] text-black font-medium"
                        : "bg-gray-100 border-gray-200 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {amenity}
                    {selectedAmenities.includes(amenity) && " ✓"}
                  </button>
                ))}
              </div> */}
            </div>
          </div>

          {/* Right Column - Menu Pricing Structure */}
          <div className="w-full md:w-1/2">
            <h3 className="font-bold text-lg mb-6">Menu Pricing Structure</h3>

            <PriceRow
              label="Approximate price range of your main dishes"
              minVal={mainDishMin}
              maxVal={mainDishMax}
              onMinChange={setMainDishMin}
              onMaxChange={setMainDishMax}
            />
            <PriceRow
              label="Price Range of beverage"
              minVal={beverageMin}
              maxVal={beverageMax}
              onMinChange={setBeverageMin}
              onMaxChange={setBeverageMax}
            />
            <PriceRow
              label="Average price of your signature dishes or best-selling items"
              minVal={signatureMin}
              maxVal={signatureMax}
              onMinChange={setSignatureMin}
              onMaxChange={setSignatureMax}
            />
            <PriceRow
              label="Average price of your signature dishes or best-selling items"
              minVal={bestSellingMin}
              maxVal={bestSellingMax}
              onMinChange={setBestSellingMin}
              onMaxChange={setBestSellingMax}
            />
            <PriceRow
              label="For medium groups (4-6 people), what is the usual total spending?"
              minVal={groupSpendMin}
              maxVal={groupSpendMax}
              onMinChange={setGroupSpendMin}
              onMaxChange={setGroupSpendMax}
            />
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={handleBack}
            className="bg-white border border-gray-300 text-black font-bold py-3 px-12 rounded-full shadow text-lg hover:bg-gray-50 transition-colors"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="bg-[#FFC107] hover:bg-[#FFB300] text-black font-bold py-3 px-16 rounded-full shadow-lg text-lg transition-transform hover:scale-105"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register2;
