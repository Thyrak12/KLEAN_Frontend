import {
  collection,
  doc,
  getDocs,
  addDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db, auth } from "../../config/firebase";

export interface Review {
  id: string;
  restaurant_id: string;
  user_id: string;
  user_name: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export interface CreateReviewInput {
  user_id: string;
  user_name: string;
  rating: number;
  comment: string;
}

// Helper to get current user ID
const getUserId = (): string => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");
  return user.uid;
};

// Fetch all reviews for the current restaurant
export async function fetchReviews(): Promise<Review[]> {
  const userId = getUserId();
  const reviewsRef = collection(db, "restaurants", userId, "reviews");
  const q = query(reviewsRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      restaurant_id: userId,
      user_id: data.user_id || "",
      user_name: data.user_name || "Anonymous",
      rating: data.rating || 0,
      comment: data.comment || "",
      createdAt: data.createdAt instanceof Timestamp 
        ? data.createdAt.toDate() 
        : new Date(data.createdAt),
    };
  });
}

// Create a review (for seeding purposes)
export async function createReview(input: CreateReviewInput): Promise<Review> {
  const userId = getUserId();
  const reviewsRef = collection(db, "restaurants", userId, "reviews");

  const docRef = await addDoc(reviewsRef, {
    restaurant_id: userId,
    user_id: input.user_id,
    user_name: input.user_name,
    rating: input.rating,
    comment: input.comment,
    createdAt: serverTimestamp(),
  });

  return {
    id: docRef.id,
    restaurant_id: userId,
    user_id: input.user_id,
    user_name: input.user_name,
    rating: input.rating,
    comment: input.comment,
    createdAt: new Date(),
  };
}

// Delete a review
export async function deleteReview(reviewId: string): Promise<void> {
  const userId = getUserId();
  const docRef = doc(db, "restaurants", userId, "reviews", reviewId);
  await deleteDoc(docRef);
}

// Seed reviews from JSON data
export async function seedReviews(reviews: CreateReviewInput[]): Promise<void> {
  for (const review of reviews) {
    await createReview(review);
  }
}

// Clear all reviews (useful before re-seeding)
export async function clearAllReviews(): Promise<void> {
  const userId = getUserId();
  const reviewsRef = collection(db, "restaurants", userId, "reviews");
  const snapshot = await getDocs(reviewsRef);
  
  const deletePromises = snapshot.docs.map((doc) => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
}
