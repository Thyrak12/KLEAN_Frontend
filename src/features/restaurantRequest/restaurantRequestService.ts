import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  setDoc,
  Query,
  QueryConstraint,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import type { RestaurantRequest, RestaurantRequestStatus } from "../../types/restaurantRequest";

const COLLECTION_NAME = "restaurantRequests";

// Add a new restaurant request
export async function createRestaurantRequest(
  requestData: Omit<RestaurantRequest, "id" | "createdAt" | "updatedAt">
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...requestData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error creating restaurant request:", error);
    throw error;
  }
}

// Get a single restaurant request by ID
export async function getRestaurantRequest(
  requestId: string
): Promise<RestaurantRequest | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, requestId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        ...data,
        createdAt: data.createdAt?.toMillis?.() || data.createdAt,
        updatedAt: data.updatedAt?.toMillis?.() || data.updatedAt,
      } as RestaurantRequest;
    }
    return null;
  } catch (error) {
    console.error("Error getting restaurant request:", error);
    throw error;
  }
}

// Get all restaurant requests with optional filters
export async function getAllRestaurantRequests(
  filters?: QueryConstraint[]
): Promise<RestaurantRequest[]> {
  try {
    let q: Query;

    if (filters && filters.length > 0) {
      q = query(collection(db, COLLECTION_NAME), ...filters);
    } else {
      q = query(collection(db, COLLECTION_NAME));
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toMillis?.() || data.createdAt,
        updatedAt: data.updatedAt?.toMillis?.() || data.updatedAt,
      } as RestaurantRequest;
    });
  } catch (error) {
    console.error("Error getting restaurant requests:", error);
    throw error;
  }
}

// Get restaurant requests by owner ID
export async function getRequestsByOwnerId(
  ownerId: string
): Promise<RestaurantRequest[]> {
  return getAllRestaurantRequests([where("ownerId", "==", ownerId)]);
}

// Get restaurant requests by status
export async function getRequestsByStatus(
  status: RestaurantRequestStatus
): Promise<RestaurantRequest[]> {
  return getAllRestaurantRequests([where("status", "==", status)]);
}

// Update restaurant request status
export async function updateRequestStatus(
  requestId: string,
  status: RestaurantRequestStatus,
  rejectionReason?: string
): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, requestId);
    const updateData: any = {
      status,
      updatedAt: serverTimestamp(),
    };

    if (rejectionReason && status === "rejected") {
      updateData.rejectionReason = rejectionReason;
    }

    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error("Error updating restaurant request status:", error);
    throw error;
  }
}

// Update restaurant request details
export async function updateRestaurantRequest(
  requestId: string,
  updateData: Partial<RestaurantRequest>
): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, requestId);
    const { id, createdAt, ...dataToUpdate } = updateData;

    await updateDoc(docRef, {
      ...dataToUpdate,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating restaurant request:", error);
    throw error;
  }
}

// Delete restaurant request
export async function deleteRestaurantRequest(requestId: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, requestId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error deleting restaurant request:", error);
    throw error;
  }
}

// Approve restaurant request - Creates restaurant and updates user role
export async function approveRestaurantRequest(requestId: string): Promise<void> {
  try {
    // 1. Get the request data
    const request = await getRestaurantRequest(requestId);
    if (!request) {
      throw new Error("Restaurant request not found");
    }

    // 2. Create restaurant document (clone from request, without status fields)
    const {
      id,
      status,
      rejectionReason,
      createdAt,
      updatedAt,
      ...restaurantData
    } = request;

    // Create restaurant with owner's UID as document ID
    const restaurantDocRef = doc(db, "restaurants", request.ownerId);
    await setDoc(restaurantDocRef, {
      ...restaurantData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // 3. Update user role from pending_owner to restaurant_owner
    const userDocRef = doc(db, "users", request.ownerId);
    await updateDoc(userDocRef, {
      role: "restaurant_owner",
      approvedAt: serverTimestamp(),
    });

    // 4. Update request status to approved
    await updateRequestStatus(requestId, "approved");

    console.log(`Approved restaurant: ${request.restaurantName} for owner: ${request.ownerId}`);
  } catch (error) {
    console.error("Error approving restaurant request:", error);
    throw error;
  }
}

// Reject restaurant request
export async function rejectRestaurantRequest(
  requestId: string,
  reason: string
): Promise<void> {
  return updateRequestStatus(requestId, "rejected", reason);
}
