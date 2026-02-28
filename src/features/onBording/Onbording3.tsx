import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown } from "lucide-react";
// Context
import { useOnboarding } from "./OnboardingContext";
import { submitOnboarding } from "./submitOnboarding";

const AFFORDABILITY_OPTIONS = [
  "Budget-friendly",
  "Mid-range",
  "Premium / Fine Dining",
];

const CUSTOMER_TYPE_OPTIONS = [
  "Students",
  "Families",
  "Tourists",
  "Business professionals",
  "Young adults / Couples",
  "Elderly",
];

const SPENDING_OPTIONS = [
  "Very predictable",
  "Moderately variable",
  "Highly variable",
];

const DINER_TYPE_OPTIONS = [
  "Solo Diner",
  "Couple",
  "Groups (3–6)",
  "Large Group (7+)",
  "Parties / celebrations",
];

const Onbording3 = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  // 1. GET DATA FROM ALL STEPS
  const { step1, step2, step3, setStep3 } = useOnboarding();

  // Local State for Step 3 (Initialized from Context)
  const [affordability, setAffordability] = useState(step3.affordability || "");
  const [affordabilityOpen, setAffordabilityOpen] = useState(false);
  const [spending, setSpending] = useState(step3.spending || "");
  const [targetCustomers, setTargetCustomers] = useState<string[]>(step3.targetCustomers || []);
  const [targetOpen, setTargetOpen] = useState(false);
  const [offersFixedSets, setOffersFixedSets] = useState<"yes" | "no" | "">(step3.offersFixedSets || "");
  const [avgSetPrice, setAvgSetPrice] = useState(step3.avgSetPrice || "");
  const [dinerTypes, setDinerTypes] = useState<string[]>(step3.dinerTypes || []);

  const toggleTargetCustomer = (opt: string) => {
    setTargetCustomers((prev) =>
      prev.includes(opt) ? prev.filter((t) => t !== opt) : [...prev, opt]
    );
  };

  const toggleDinerType = (type: string) => {
    setDinerTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  // 2. THE MAIN SUBMIT FUNCTION
  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      await submitOnboarding({
        step1,
        step2,
        step3Values: {
          affordability,
          spending,
          targetCustomers,
          offersFixedSets,
          avgSetPrice,
          dinerTypes,
        },
        setStep3,
        navigate,
      });
    } catch (error) {
      console.error("Error saving onboarding data:", error);
      alert("Something went wrong while saving data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    // Save current state before going back so we don't lose it
    setStep3({ affordability, spending, targetCustomers, offersFixedSets, avgSetPrice, dinerTypes });
    navigate("/onbording2");
  };

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden font-sans text-gray-800">
      
      {/* --- BACKGROUND SVGS (Keeping your original design) --- */}
      <div className="absolute bottom-0 left-0 pointer-events-none z-0">
        <svg width="500" height="400" viewBox="0 0 500 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 400V120C0 120 80 20 200 60C320 100 400 200 500 160V400H0Z" fill="#FFC107" fillOpacity="0.3"/>
          <path d="M0 400V180C0 180 60 80 180 120C300 160 380 260 500 220V400H0Z" fill="#FFC107" fillOpacity="0.5"/>
          <path d="M0 400V250C0 250 50 150 160 200C270 250 350 320 450 280V400H0Z" fill="#FFC107" fillOpacity="0.8"/>
          <path d="M0 400V320C0 320 40 240 140 280C240 320 320 370 400 340V400H0Z" fill="#FFC107"/>
        </svg>
      </div>

      <div className="relative z-10 px-12 py-8 max-w-7xl mx-auto min-h-screen flex flex-col">
        <div className="text-3xl font-bold mb-8">Restaurant Registration (Step 3/3)</div>

        <div className="bg-white rounded-[3rem] shadow-xl p-12 flex-1 flex flex-col md:flex-row gap-16 items-start">
          
          {/* Left Column */}
          <div className="w-full md:w-1/2 flex flex-col gap-8">
            {/* Affordability */}
            <div>
              <h3 className="font-bold text-lg mb-3">How would you describe the affordability level?</h3>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setAffordabilityOpen(!affordabilityOpen)}
                  className="w-full md:w-[320px] border border-gray-300 rounded-full px-5 py-3 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <span className={affordability ? "text-gray-800" : "text-gray-400"}>
                    {affordability || "Select Level"}
                  </span>
                  <ChevronDown size={20} className="text-gray-500" />
                </button>
                {affordabilityOpen && (
                  <div className="absolute z-20 mt-1 w-full md:w-[320px] bg-white border border-gray-200 rounded-2xl shadow-lg max-h-52 overflow-y-auto">
                    {AFFORDABILITY_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => { setAffordability(opt); setAffordabilityOpen(false); }}
                        className={`w-full text-left px-5 py-2.5 hover:bg-yellow-50 text-sm ${affordability === opt ? "bg-yellow-100 font-medium" : ""}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Target Customers */}
            <div>
              <h3 className="font-bold text-lg mb-3">Target Customers</h3>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setTargetOpen(!targetOpen)}
                  className="w-full md:w-[320px] border border-gray-300 rounded-full px-5 py-3 text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  <span className={targetCustomers.length ? "text-gray-800" : "text-gray-400"}>
                    {targetCustomers.length ? targetCustomers.join(", ") : "(select multiple)"}
                  </span>
                  <ChevronDown size={20} className="text-gray-500" />
                </button>
                {targetOpen && (
                  <div className="absolute z-20 mt-1 w-full md:w-[320px] bg-white border border-gray-200 rounded-2xl shadow-lg max-h-52 overflow-y-auto">
                    {CUSTOMER_TYPE_OPTIONS.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => toggleTargetCustomer(opt)}
                        className={`w-full text-left px-5 py-2.5 hover:bg-yellow-50 text-sm flex items-center gap-2 ${targetCustomers.includes(opt) ? "bg-yellow-100 font-medium" : ""}`}
                      >
                        <span className={`w-4 h-4 rounded border flex items-center justify-center text-xs ${targetCustomers.includes(opt) ? "bg-yellow-400 border-yellow-500 text-white" : "border-gray-300"}`}>
                          {targetCustomers.includes(opt) && "✓"}
                        </span>
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Fixed Sets */}
            <div>
              <h3 className="font-bold text-lg mb-3">Do you offer fixed sets or combos?</h3>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" name="fixedSets" value="yes" checked={offersFixedSets === "yes"} onChange={() => setOffersFixedSets("yes")} className="accent-yellow-500" />
                  Yes
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" name="fixedSets" value="no" checked={offersFixedSets === "no"} onChange={() => setOffersFixedSets("no")} className="accent-yellow-500" />
                  No
                </label>
              </div>
              {offersFixedSets === "yes" && (
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-sm text-gray-500">Average price per set:</span>
                  <input
                    type="text"
                    value={avgSetPrice}
                    onChange={(e) => setAvgSetPrice(e.target.value)}
                    className="border-b border-gray-400 outline-none px-2 py-1 w-32 text-sm focus:border-yellow-500"
                  />
                </div>
              )}
            </div>
            
            {/* Diner Types */}
            <div>
                <h3 className="font-bold text-lg mb-3">Common Diner Types</h3>
                <div className="grid grid-cols-2 gap-2">
                    {DINER_TYPE_OPTIONS.map((type) => (
                    <label key={type} className="flex items-center gap-3 text-sm cursor-pointer">
                        <input type="checkbox" checked={dinerTypes.includes(type)} onChange={() => toggleDinerType(type)} className="w-4 h-4 accent-yellow-500" />
                        {type}
                    </label>
                    ))}
                </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="w-full md:w-1/2 flex flex-col gap-8">
            {/* Spending Variability */}
            <div>
              <h3 className="font-bold text-lg mb-3">How variable is customer spending?</h3>
              <div className="flex flex-col gap-2">
                {SPENDING_OPTIONS.map((opt) => (
                  <label key={opt} className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="radio" name="spending" value={opt} checked={spending === opt} onChange={() => setSpending(opt)} className="accent-yellow-500" />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={handleBack}
            className="bg-white border border-gray-300 text-black font-bold py-3 px-12 rounded-full shadow text-lg hover:bg-gray-50 transition-colors"
            disabled={isLoading}
          >
            Back
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className={`
                bg-[#FFC107] hover:bg-[#FFB300] text-black font-bold py-3 px-16 rounded-full shadow-lg text-lg transition-transform hover:scale-105
                ${isLoading ? "opacity-50 cursor-not-allowed scale-100" : ""}
            `}
          >
            {isLoading ? "Saving..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onbording3;