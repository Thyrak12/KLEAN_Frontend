import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface Step1Data {
  restaurantName: string;
  phone: string;
  contactInfo: string;
  address: string;
  coverImage: File | null;
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
  coverImage: null,
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
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [step1, setStep1State] = useState<Step1Data>(defaultStep1);
  const [step2, setStep2State] = useState<Step2Data>(defaultStep2);
  const [step3, setStep3State] = useState<Step3Data>(defaultStep3);

  const setStep1 = (data: Partial<Step1Data>) =>
    setStep1State((prev) => ({ ...prev, ...data }));

  const setStep2 = (data: Partial<Step2Data>) =>
    setStep2State((prev) => ({ ...prev, ...data }));

  const setStep3 = (data: Partial<Step3Data>) =>
    setStep3State((prev) => ({ ...prev, ...data }));

  return (
    <OnboardingContext.Provider value={{ step1, setStep1, step2, setStep2, step3, setStep3 }}>
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
