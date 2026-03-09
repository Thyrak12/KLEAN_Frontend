import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../../config/firebase";

export interface SuperAdminCredentials {
  email: string;
  password: string;
  displayName?: string;
}

/**
 * Creates a super admin account in Firebase Auth and Firestore.
 * Super admin is the only role that can access admin routes.
 * 
 * @param credentials - The email, password, and optional display name for the super admin
 * @returns The created user's UID
 * @throws Error if the account creation fails
 */
export async function createSuperAdmin(
  credentials: SuperAdminCredentials
): Promise<string> {
  const { email, password, displayName } = credentials;

  try {
    // Create the user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    const user = userCredential.user;

    // Create the user document in Firestore with super_admin role
    await setDoc(doc(db, "users", user.uid), {
      email: user.email,
      displayName: displayName || "Super Admin",
      role: "super_admin",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    console.log("Super admin account created successfully:", user.uid);
    return user.uid;
  } catch (error: any) {
    console.error("Failed to create super admin:", error.message);
    throw error;
  }
}

/**
 * Checks if a super admin already exists in the database.
 * This can be used to prevent creating multiple super admins.
 * 
 * @param uid - The user ID to check
 * @returns True if the user is a super admin
 */
export async function isSuperAdmin(uid: string): Promise<boolean> {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return userDoc.data().role === "super_admin";
    }
    return false;
  } catch (error) {
    console.error("Failed to check super admin status:", error);
    return false;
  }
}

/**
 * Upgrades an existing user to super admin role.
 * Use this to promote an existing account to super admin.
 * 
 * @param uid - The user ID to upgrade
 */
export async function upgradeToSuperAdmin(uid: string): Promise<void> {
  try {
    await setDoc(
      doc(db, "users", uid),
      {
        role: "super_admin",
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );
    console.log("User upgraded to super admin successfully:", uid);
  } catch (error: any) {
    console.error("Failed to upgrade user to super admin:", error.message);
    throw error;
  }
}
