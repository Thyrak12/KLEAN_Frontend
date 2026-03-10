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
  refreshUserData?: () => Promise<void>;
}

export async function submitOnboarding({
  step1,
  step2,
  step3Values,
  setStep3,
  navigate,
  refreshUserData,
}: SubmitOnboardingParams) {
  const user = auth.currentUser;
  if (!user) {
    alert("You must be logged in to save.");
    return;
  }

  setStep3(step3Values);

  // 1. Upload cover image (if provided)
  let coverImageUrl = "";
  if (step1.coverImage) {
    try {
      const imageRef = ref(storage, `restaurant_covers/${user.uid}_${Date.now()}`);
      await uploadBytes(imageRef, step1.coverImage);
      coverImageUrl = await getDownloadURL(imageRef);
    } catch (err) {
      console.error("Image upload failed:", err);
      throw new Error("Failed to upload cover image. Check Firebase Storage rules.");
    }
  }

  // 2. Build data objects
  const userData = {
    uid: user.uid,
    email: user.email,
    role: "pending_owner",
    createdAt: new Date(),
    onboardingCompleted: true,
  };

  // Create restaurant request (pending approval) instead of restaurant
  const restaurantRequestData = {
    uid: user.uid,
    ownerId: user.uid,
    email: user.email,
    restaurantName: step1.restaurantName,
    phone: step1.phone,
    contactInfo: step1.contactInfo,
    latitude: step1.latitude,
    longitude: step1.longitude,
    googleMapLink: step1.googleMapLink,
    coverImageUrl,
    category: step2.category,
    cuisineType: step2.category, // For compatibility
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
    // Request status fields
    status: "pending" as const,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  // 3. Save user data
  try {
    await setDoc(doc(db, "users", user.uid), userData, { merge: true });
  } catch (err) {
    console.error("Failed to write to 'users' collection:", err);
    throw new Error("Failed to save user data. Check Firestore rules for 'users' collection.");
  }

  // 4. Save restaurant request (pending approval)
  try {
    await setDoc(doc(db, "restaurantRequests", user.uid), restaurantRequestData, { merge: true });
  } catch (err) {
    console.error("Failed to write to 'restaurantRequests' collection:", err);
    throw new Error("Failed to save restaurant request. Check Firestore rules for 'restaurantRequests' collection.");
  }

  console.log("User Data:", userData);
  console.log("Restaurant Request Data:", restaurantRequestData);
  console.log("Onboarding submission completed successfully - awaiting admin approval");
  
  // Refresh user data to ensure AuthContext has latest role info
  if (refreshUserData) {
    console.log("Refreshing user data...");
    await refreshUserData();
    console.log("User data refreshed");
  }
  
  console.log("Navigating to dashboard...");
  navigate("/");
}
