import {
  collection,
  doc,
  getDocs,
  getDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import type { Restaurant, RestaurantListItem } from "../../types/restaurant";

/**
 * Fetch all restaurants from Firestore
 * Returns full restaurant data
 */
export async function getAllRestaurants(): Promise<Restaurant[]> {
  try {
    const restaurantsRef = collection(db, "restaurants");
    const q = query(restaurantsRef, orderBy("restaurantName"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        uid: doc.id,
        restaurantName: data.restaurantName || "",
        phone: data.phone || "",
        contactInfo: data.contactInfo || "",
        address: data.address || "",
        coverImageUrl: data.coverImageUrl,
        category: data.category || "",
        ambience: data.ambience,
        amenities: data.amenities,
        pricing: data.pricing,
        affordability: data.affordability,
        spending: data.spending,
        targetCustomers: data.targetCustomers,
        offersFixedSets: data.offersFixedSets,
        avgSetPrice: data.avgSetPrice,
        dinerTypes: data.dinerTypes,
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      } as Restaurant;
    });
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    throw error;
  }
}

/**
 * Fetch all restaurants as simplified list items for admin view
 * Includes email from the associated user document
 */
export async function getAllRestaurantsForAdmin(): Promise<RestaurantListItem[]> {
  try {
    const restaurants = await getAllRestaurants();
    
    // Fetch corresponding user emails
    const listItems: RestaurantListItem[] = [];
    
    for (const restaurant of restaurants) {
      try {
        // Get email from users collection using the same uid
        const userRef = doc(db, "users", restaurant.uid);
        const userSnap = await getDoc(userRef);
        const email = userSnap.exists() ? userSnap.data().email || "" : "";
        
        listItems.push({
          id: restaurant.uid,
          name: restaurant.restaurantName,
          email: email,
          phone: restaurant.phone,
          address: restaurant.address,
          category: restaurant.category,
          createdAt: restaurant.createdAt,
        });
      } catch (err) {
        console.error(`Error fetching user data for ${restaurant.uid}:`, err);
        // Still include the restaurant even if user fetch fails
        listItems.push({
          id: restaurant.uid,
          name: restaurant.restaurantName,
          email: "",
          phone: restaurant.phone,
          address: restaurant.address,
          category: restaurant.category,
          createdAt: restaurant.createdAt,
        });
      }
    }
    
    return listItems;
  } catch (error) {
    console.error("Error fetching restaurants for admin:", error);
    throw error;
  }
}

/**
 * Get a single restaurant by ID
 */
export async function getRestaurantById(uid: string): Promise<Restaurant | null> {
  try {
    const docRef = doc(db, "restaurants", uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    return {
      uid: docSnap.id,
      restaurantName: data.restaurantName || "",
      phone: data.phone || "",
      contactInfo: data.contactInfo || "",
      address: data.address || "",
      coverImageUrl: data.coverImageUrl,
      category: data.category || "",
      ambience: data.ambience,
      amenities: data.amenities,
      pricing: data.pricing,
      affordability: data.affordability,
      spending: data.spending,
      targetCustomers: data.targetCustomers,
      offersFixedSets: data.offersFixedSets,
      avgSetPrice: data.avgSetPrice,
      dinerTypes: data.dinerTypes,
      createdAt: data.createdAt?.toDate(),
      updatedAt: data.updatedAt?.toDate(),
    } as Restaurant;
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    throw error;
  }
}

/**
 * Delete a restaurant by ID
 * Note: This only deletes the restaurant document, not the user account
 */
export async function deleteRestaurant(uid: string): Promise<void> {
  try {
    const docRef = doc(db, "restaurants", uid);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting restaurant:", error);
    throw error;
  }
}
