import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../config/firebase";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Step1Data {
  restaurantName: string;
  phone: string;
  contactInfo: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  googleMapLink: string;
  coverImage: File | null;
  coverImageUrl?: string; // For pre-loading existing image URL
}

export interface Step2Data {
  category: string;
  ambience: string[];
  amenities: string[];
  mainDishMin: string;
  mainDishMax: string;
  beverageMin: string;
  beverageMax: string;
  signatureMin: string;
  signatureMax: string;
  bestSellingMin: string;
  bestSellingMax: string;
  groupSpendMin: string;
  groupSpendMax: string;
}

export interface Step3Data {
  affordability: string;
  spending: string;
  targetCustomers: string[];
  offersFixedSets: "yes" | "no" | "";
  avgSetPrice: string;
  dinerTypes: string[];
}

// ── Defaults ──────────────────────────────────────────────────────────────────

const defaultStep1: Step1Data = {
  restaurantName: "",
  phone: "",
  contactInfo: "",
  address: "",
  latitude: null,
  longitude: null,
  googleMapLink: "",
  coverImage: null,
  coverImageUrl: "",
};

const defaultStep2: Step2Data = {
  category: "",
  ambience: [],
  amenities: [],
  mainDishMin: "",
  mainDishMax: "",
  beverageMin: "",
  beverageMax: "",
  signatureMin: "",
  signatureMax: "",
  bestSellingMin: "",
  bestSellingMax: "",
  groupSpendMin: "",
  groupSpendMax: "",
};

const defaultStep3: Step3Data = {
  affordability: "",
  spending: "",
  targetCustomers: [],
  offersFixedSets: "",
  avgSetPrice: "",
  dinerTypes: [],
};

// ── Context ───────────────────────────────────────────────────────────────────

interface OnboardingContextValue {
  step1: Step1Data;
  setStep1: (data: Partial<Step1Data>) => void;
  step2: Step2Data;
  setStep2: (data: Partial<Step2Data>) => void;
  step3: Step3Data;
  setStep3: (data: Partial<Step3Data>) => void;
  isResubmission: boolean;
  setIsResubmission: (value: boolean) => void;
  loadPreviousRequest: (userId: string) => Promise<boolean>;
  resetOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [step1, setStep1State] = useState<Step1Data>(defaultStep1);
  const [step2, setStep2State] = useState<Step2Data>(defaultStep2);
  const [step3, setStep3State] = useState<Step3Data>(defaultStep3);
  const [isResubmission, setIsResubmission] = useState(false);

  const setStep1 = (data: Partial<Step1Data>) =>
    setStep1State((prev) => ({ ...prev, ...data }));

  const setStep2 = (data: Partial<Step2Data>) =>
    setStep2State((prev) => ({ ...prev, ...data }));

  const setStep3 = (data: Partial<Step3Data>) =>
    setStep3State((prev) => ({ ...prev, ...data }));

  const resetOnboarding = () => {
    setStep1State(defaultStep1);
    setStep2State(defaultStep2);
    setStep3State(defaultStep3);
    setIsResubmission(false);
  };

  const loadPreviousRequest = async (userId: string): Promise<boolean> => {
    try {
      const requestDoc = await getDoc(doc(db, "restaurantRequests", userId));
      if (!requestDoc.exists()) return false;

      const data = requestDoc.data();
      
      // Load Step 1 data
      setStep1State({
        restaurantName: data.restaurantName || "",
        phone: data.phone || "",
        contactInfo: data.contactInfo || "",
        address: data.address || data.location || "",
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        googleMapLink: data.googleMapLink || "",
        coverImage: null,
        coverImageUrl: data.coverImageUrl || "",
      });

      // Load Step 2 data
      const pricing = data.pricing || {};
      setStep2State({
        category: data.category || data.cuisineType || "",
        ambience: data.ambience || [],
        amenities: data.amenities || [],
        mainDishMin: pricing.mainDish?.min?.toString() || "",
        mainDishMax: pricing.mainDish?.max?.toString() || "",
        beverageMin: pricing.beverage?.min?.toString() || "",
        beverageMax: pricing.beverage?.max?.toString() || "",
        signatureMin: pricing.signature?.min?.toString() || "",
        signatureMax: pricing.signature?.max?.toString() || "",
        bestSellingMin: pricing.bestSelling?.min?.toString() || "",
        bestSellingMax: pricing.bestSelling?.max?.toString() || "",
        groupSpendMin: pricing.groupSpend?.min?.toString() || "",
        groupSpendMax: pricing.groupSpend?.max?.toString() || "",
      });

      // Load Step 3 data
      setStep3State({
        affordability: data.affordability || "",
        spending: data.spending || "",
        targetCustomers: data.targetCustomers || [],
        offersFixedSets: data.offersFixedSets ? "yes" : (data.offersFixedSets === false ? "no" : ""),
        avgSetPrice: data.avgSetPrice?.toString() || "",
        dinerTypes: data.dinerTypes || [],
      });

      setIsResubmission(true);
      return true;
    } catch (err) {
      console.error("Error loading previous request:", err);
      return false;
    }
  };

  return (
    <OnboardingContext.Provider value={{ 
      step1, setStep1, 
      step2, setStep2, 
      step3, setStep3,
      isResubmission, setIsResubmission,
      loadPreviousRequest,
      resetOnboarding
    }}>
      {children}
    </OnboardingContext.Provider>
  );
}

// ── Hook ──────────────────────────────────────────────────────────────────────

// eslint-disable-next-line react-refresh/only-export-components
export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx) throw new Error("useOnboarding must be used within <OnboardingProvider>");
  return ctx;
}
