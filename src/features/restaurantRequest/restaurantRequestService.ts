import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  query,
  where,
  limit,
  updateDoc,
  deleteDoc,
  Query,
  QueryConstraint,
  serverTimestamp,
  writeBatch,
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

// Approve restaurant request
export async function approveRestaurantRequest(requestId: string): Promise<void> {
  try {
    const requestRef = doc(db, COLLECTION_NAME, requestId);
    const requestSnap = await getDoc(requestRef);

    if (!requestSnap.exists()) {
      throw new Error("Restaurant request not found");
    }

    const requestData = requestSnap.data() as RestaurantRequest & {
      uid?: string;
      userId?: string;
    };

    const ownerIdFromRequest = requestData.ownerId || requestData.uid || requestData.userId;

    if (!ownerIdFromRequest) {
      throw new Error("Invalid restaurant request: missing ownerId/uid/userId");
    }

    let resolvedOwnerId = ownerIdFromRequest;

    // Validate owner ID against users collection. Some old requests may store non-UID IDs.
    const ownerUserRef = doc(db, "users", resolvedOwnerId);
    const ownerUserSnap = await getDoc(ownerUserRef);

    if (!ownerUserSnap.exists()) {
      const requestEmail = requestData.email?.trim().toLowerCase();
      if (!requestEmail) {
        throw new Error(
          `Owner user not found for ownerId '${resolvedOwnerId}', and request email is missing`
        );
      }

      const usersByEmail = await getDocs(
        query(collection(db, "users"), where("email", "==", requestEmail), limit(1))
      );

      if (usersByEmail.empty) {
        throw new Error(
          `Owner user not found for ownerId '${resolvedOwnerId}' and no user matched email '${requestEmail}'`
        );
      }

      resolvedOwnerId = usersByEmail.docs[0].id;
    }

    const restaurantRef = doc(db, "restaurants", resolvedOwnerId);
    const userRef = doc(db, "users", resolvedOwnerId);

    const batch = writeBatch(db);

    const {
      status: _status,
      rejectionReason: _rejectionReason,
      updatedAt: _requestUpdatedAt,
      ...requestFieldsWithoutStatus
    } = requestData as RestaurantRequest & {
      uid?: string;
      userId?: string;
      updatedAt?: unknown;
      rejectionReason?: string;
    };

    batch.set(
      restaurantRef,
      {
        ...requestFieldsWithoutStatus,
        uid: resolvedOwnerId,
        ownerId: resolvedOwnerId,
        address: requestData.location || (requestFieldsWithoutStatus as { address?: string }).address || "",
        contactInfo:
          requestData.email ||
          requestData.phone ||
          (requestFieldsWithoutStatus as { contactInfo?: string }).contactInfo ||
          "",
        fromRequestId: requestId,
        approvedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    batch.set(
      userRef,
      {
        role: "restaurant_owner",
        onboardingCompleted: true,
        uid: resolvedOwnerId,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    batch.update(requestRef, {
      status: "approved",
      ownerId: resolvedOwnerId,
      updatedAt: serverTimestamp(),
    });

    await batch.commit();
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
