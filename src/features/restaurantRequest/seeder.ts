import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../config/firebase";
import { seederRestaurantRequests } from "./seederData";
import { auth } from "../../config/firebase";
import { doc, getDoc } from "firebase/firestore";

const COLLECTION_NAME = "restaurantRequests";

export interface SeedFailure {
  restaurantName: string;
  code?: string;
  message: string;
}

export interface SeedResult {
  successCount: number;
  failureCount: number;
  failures: SeedFailure[];
}

/**
 * Seeds the restaurantRequests collection with sample data
 * Run this once to populate the database with test data
 * 
 * Usage in browser console:
 * import { seedRestaurantRequests } from '@/features/restaurantRequest/seeder'
 * await seedRestaurantRequests()
 */
export async function seedRestaurantRequests(): Promise<SeedResult> {
  try {
    console.log("🌱 Starting restaurant requests seeding...");
    console.log(`📊 Total requests to seed: ${seederRestaurantRequests.length}`);
    console.log(`🔗 Firebase DB initialized:`, db ? "✅ Yes" : "❌ No");

    const currentUser = auth.currentUser;
    if (!currentUser) {
      throw new Error("You must be logged in to seed data.");
    }

    let currentUserRole: string | null = null;
    try {
      const userDoc = await getDoc(doc(db, "users", currentUser.uid));
      currentUserRole = userDoc.exists() ? (userDoc.data().role as string | null) : null;
    } catch {
      currentUserRole = null;
    }

    const isSuperAdmin = currentUserRole === "super_admin";
    console.log(`👤 Auth UID: ${currentUser.uid}`);
    console.log(`🛡️ Role: ${currentUserRole ?? "unknown"}`);
    console.log(`🧩 Mode: ${isSuperAdmin ? "original seed data" : "rules-safe seed data"}`);
    
    if (!db) {
      throw new Error("Firebase database not initialized. Check firebase.ts config.");
    }
    
    let successCount = 0;
    let failureCount = 0;
    const failures: SeedFailure[] = [];
    
    for (const request of seederRestaurantRequests) {
      try {
        console.log(`⏳ Processing: ${request.restaurantName}...`);

        const payload = isSuperAdmin
          ? {
              ...request,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            }
          : {
              ...request,
              ownerId: currentUser.uid,
              status: "pending" as const,
              rejectionReason: undefined,
              createdAt: serverTimestamp(),
              updatedAt: serverTimestamp(),
            };
        
        const docRef = await addDoc(collection(db, COLLECTION_NAME), payload);
        
        console.log(`✅ Added: ${request.restaurantName} (ID: ${docRef.id})`);
        successCount++;
      } catch (error) {
        failureCount++;
        const firebaseError = error as { code?: string; message?: string };
        const errorMsg = firebaseError.message || String(error);
        const errorCode = firebaseError.code;
        failures.push({
          restaurantName: request.restaurantName,
          code: errorCode,
          message: errorMsg,
        });
        console.error(
          `❌ Failed to add ${request.restaurantName}: ${errorCode ? `${errorCode} - ` : ""}${errorMsg}`
        );
      }
    }
    
    console.log(`\n📈 Seeding Summary:`);
    console.log(`   ✅ Success: ${successCount}/${seederRestaurantRequests.length}`);
    console.log(`   ❌ Failed: ${failureCount}/${seederRestaurantRequests.length}`);
    
    if (successCount > 0) {
      console.log("🎉 Seeding completed! Check Firestore console to verify.");
      return { successCount, failureCount, failures };
    }

    const firstFailure = failures[0];
    throw new Error(
      `No documents were added. ${firstFailure?.code ? `${firstFailure.code}: ` : ""}${firstFailure?.message || "Check Firestore rules/permissions."}`
    );
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`\n❌ Seeding failed:`, errorMsg);
    throw error;
  }
}

/**
 * Seeds a single restaurant request
 */
export async function seedSingleRequest(restaurantName: string): Promise<string> {
  try {
    const request = seederRestaurantRequests.find(
      (r) => r.restaurantName === restaurantName
    );

    if (!request) {
      throw new Error(`Restaurant "${restaurantName}" not found in seeder data`);
    }

    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...request,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log(`✅ Added: ${request.restaurantName} (${docRef.id})`);
    return docRef.id;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`❌ Failed to seed ${restaurantName}: ${errorMsg}`);
    throw error;
  }
}

/**
 * Gets list of available restaurants in seeder data
 */
export function getAvailableSeeds(): string[] {
  return seederRestaurantRequests.map((r) => r.restaurantName);
}
