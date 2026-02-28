import type { NavigateFunction } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../../config/firebase";
import type { Step1Data, Step2Data, Step3Data } from "./OnboardingContext";

interface SubmitOnboardingParams {
  step1: Step1Data;
  step2: Step2Data;
  step3Values: Step3Data;
  setStep3: (data: Partial<Step3Data>) => void;
  navigate: NavigateFunction;
}

export async function submitOnboarding({
  step1,
  step2,
  step3Values,
  setStep3,
  navigate,
}: SubmitOnboardingParams) {
  const user = auth.currentUser;
  if (!user) {
    alert("You must be logged in to save.");
    return;
  }

  setStep3(step3Values);

  let coverImageUrl = "";
  if (step1.coverImage) {
    const imageRef = ref(storage, `restaurant_covers/${user.uid}_${Date.now()}`);
    await uploadBytes(imageRef, step1.coverImage);
    coverImageUrl = await getDownloadURL(imageRef);
  }

  const restaurantData = {
    uid: user.uid,
    email: user.email,
    createdAt: new Date(),
    onboardingCompleted: true,
    role: "restaurant_owner",
    restaurantName: step1.restaurantName,
    phone: step1.phone,
    contactInfo: step1.contactInfo,
    address: step1.address,
    coverImageUrl,
    category: step2.category,
    ambience: step2.ambience,
    amenities: step2.amenities,
    pricing: {
      mainDish: { min: step2.mainDishMin, max: step2.mainDishMax },
      beverage: { min: step2.beverageMin, max: step2.beverageMax },
      signature: { min: step2.signatureMin, max: step2.signatureMax },
      bestSelling: { min: step2.bestSellingMin, max: step2.bestSellingMax },
      groupSpend: { min: step2.groupSpendMin, max: step2.groupSpendMax },
    },
    affordability: step3Values.affordability,
    spending: step3Values.spending,
    targetCustomers: step3Values.targetCustomers,
    offersFixedSets: step3Values.offersFixedSets === "yes",
    avgSetPrice: step3Values.offersFixedSets === "yes" ? step3Values.avgSetPrice : null,
    dinerTypes: step3Values.dinerTypes,
  };

  await setDoc(doc(db, "users", user.uid), restaurantData, { merge: true });
  console.log("Registration Complete:", restaurantData);
  navigate("/");
}
