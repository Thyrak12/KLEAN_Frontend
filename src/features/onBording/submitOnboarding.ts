import type { NavigateFunction } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, db, storage } from "../../config/firebase";
import type { Step1Data, Step2Data, Step3Data } from "./OnboardingContext";
import emailjs from "@emailjs/browser";
import toast from "react-hot-toast";

// EmailJS Configuration
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || "YOUR_SERVICE_ID";
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || "YOUR_TEMPLATE_ID";
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || "YOUR_PUBLIC_KEY";

// Initialize EmailJS with your public key
emailjs.init(EMAILJS_PUBLIC_KEY);

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
  console.log(user?.email);
  if (!user) {
    alert("You must be logged in to save.");
    return;
  }

  setStep3(step3Values);

  // 1. Upload cover image (if provided, otherwise keep existing URL)
  let coverImageUrl = step1.coverImageUrl || ""; // Use existing URL if available
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
    address: step1.address,
    location: step1.address, // For compatibility with RestaurantRequest type
    latitude: step1.latitude,
    longitude: step1.longitude,
    googleMapLink: step1.googleMapLink,
    description: step1.description,
    openHour: step1.openHour,
    closeHour: step1.closeHour,
    // also store openingHours for admin compatibility (combined HH:MM-HH:MM)
    openingHours: step1.openHour && step1.closeHour ? `${step1.openHour} - ${step1.closeHour}` : step1.openHour || step1.closeHour || "",
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

  // 5. Send confirmation email to restaurant owner
  try {
    console.log("Sending email to:", user.email);
    console.log("EmailJS Config:", { 
      serviceId: EMAILJS_SERVICE_ID, 
      templateId: EMAILJS_TEMPLATE_ID,
      publicKey: EMAILJS_PUBLIC_KEY ? "Set" : "Not Set"
    });
    
    const emailResponse = await emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        to_email: user.email,
        to_name: step1.restaurantName,
        restaurant_name: step1.restaurantName,
        owner_email: user.email,
        reply_to: user.email,
        message: `Thank you for registering "${step1.restaurantName}" on DineFlow! 

Your restaurant registration request has been submitted successfully and is currently under review by our admin team.

What happens next:
• Our team will review your restaurant details within 1-2 business days
• You will receive an email notification once your restaurant is approved
• After approval, you'll have full access to manage your restaurant dashboard

If you have any questions, please don't hesitate to contact our support team.`,
        status: "Pending Approval",
      },
      EMAILJS_PUBLIC_KEY
    );
    console.log("Email sent successfully!", emailResponse);
  } catch (err) {
    console.error("Failed to send confirmation email:", err);
    // Don't throw - email failure shouldn't block the onboarding process
  }

  // 6. Show success toast notification
  toast.success(
    "🎉 Registration submitted successfully!\n\nPlease check your email for confirmation. Your request is pending admin approval (1-2 business days).",
    {
      duration: 6000,
      style: {
        background: "#10B981",
        color: "#fff",
        padding: "16px",
        borderRadius: "12px",
        fontSize: "14px",
        maxWidth: "400px",
      },
      iconTheme: {
        primary: "#fff",
        secondary: "#10B981",
      },
    }
  );

  // Refresh user data to ensure AuthContext has latest role info
  if (refreshUserData) {
    console.log("Refreshing user data...");
    await refreshUserData();
    console.log("User data refreshed");
  }
  
  console.log("Navigating to pending approval page...");
  navigate("/dashboard");
}
