import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { db, storage, auth } from "../../config/firebase";
import type {
  MenuItem,
  Promotion,
  CreateMenuItemInput,
  UpdateMenuItemInput,
  CreatePromotionInput,
  UpdatePromotionInput,
  MenuCategory,
  PromotionStatus,
  PromotionType,
} from "../../types/menu";

// Helper to get current user ID
const getUserId = (): string => {
  const user = auth.currentUser;
  if (!user) throw new Error("User not authenticated");
  return user.uid;
};

// ═══════════════════════════════════════════════════════════════
// IMAGE UPLOAD
// ═══════════════════════════════════════════════════════════════

export async function uploadMenuImage(file: File): Promise<string> {
  const userId = getUserId();
  const fileName = `menu_items/${userId}/${Date.now()}_${file.name}`;
  const imageRef = ref(storage, fileName);
  
  await uploadBytes(imageRef, file);
  return getDownloadURL(imageRef);
}

export async function deleteMenuImage(imageUrl: string): Promise<void> {
  try {
    // Extract path from URL and delete
    const imageRef = ref(storage, imageUrl);
    await deleteObject(imageRef);
  } catch (error) {
    console.warn("Failed to delete image:", error);
  }
}

// ═══════════════════════════════════════════════════════════════
// MENU ITEMS CRUD
// ═══════════════════════════════════════════════════════════════

export async function fetchMenuItems(): Promise<MenuItem[]> {
  const userId = getUserId();
  const menuRef = collection(db, "restaurants", userId, "menu_items");
  const snapshot = await getDocs(menuRef);
  
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    restaurant_id: userId,
    item_name: doc.data().item_name,
    description: doc.data().description || "",
    price: doc.data().price || 0,
    category: doc.data().category as MenuCategory,
    image: doc.data().image || "",
    created_at: doc.data().created_at?.toDate() || new Date(),
    updated_at: doc.data().updated_at?.toDate() || new Date(),
  }));
}

export async function createMenuItem(input: CreateMenuItemInput): Promise<MenuItem> {
  const userId = getUserId();
  const menuRef = collection(db, "restaurants", userId, "menu_items");
  
  const docRef = await addDoc(menuRef, {
    restaurant_id: userId,
    item_name: input.item_name,
    description: input.description,
    price: input.price,
    category: input.category,
    image: input.image || "",
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  });

  return {
    id: docRef.id,
    restaurant_id: userId,
    item_name: input.item_name,
    description: input.description,
    price: input.price,
    category: input.category,
    image: input.image,
    created_at: new Date(),
    updated_at: new Date(),
  };
}

export async function updateMenuItem(input: UpdateMenuItemInput): Promise<MenuItem> {
  const userId = getUserId();
  const docRef = doc(db, "restaurants", userId, "menu_items", input.id);
  
  const updateData: Record<string, unknown> = {
    updated_at: serverTimestamp(),
  };
  
  if (input.item_name !== undefined) updateData.item_name = input.item_name;
  if (input.description !== undefined) updateData.description = input.description;
  if (input.price !== undefined) updateData.price = input.price;
  if (input.category !== undefined) updateData.category = input.category;
  if (input.image !== undefined) updateData.image = input.image;
  
  await updateDoc(docRef, updateData);
  
  // Fetch the updated document
  const updatedDoc = await getDoc(docRef);
  const data = updatedDoc.data();
  
  return {
    id: input.id,
    restaurant_id: userId,
    item_name: data?.item_name,
    description: data?.description || "",
    price: data?.price || 0,
    category: data?.category as MenuCategory,
    image: data?.image || "",
    created_at: data?.created_at?.toDate() || new Date(),
    updated_at: data?.updated_at?.toDate() || new Date(),
  };
}

export async function deleteMenuItem(id: string): Promise<void> {
  const userId = getUserId();
  
  // First, delete all promotions linked to this menu item
  const promotionsRef = collection(db, "restaurants", userId, "promotions");
  const q = query(promotionsRef, where("menu_item_id", "==", id));
  const promotionsSnapshot = await getDocs(q);
  
  const deletePromises = promotionsSnapshot.docs.map((doc) => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
  
  // Then delete the menu item
  const docRef = doc(db, "restaurants", userId, "menu_items", id);
  await deleteDoc(docRef);
}

// ═══════════════════════════════════════════════════════════════
// PROMOTIONS CRUD
// ═══════════════════════════════════════════════════════════════

export async function fetchPromotions(): Promise<Promotion[]> {
  const userId = getUserId();
  const promoRef = collection(db, "restaurants", userId, "promotions");
  const snapshot = await getDocs(promoRef);
  
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    restaurant_id: userId,
    title: doc.data().title,
    description: doc.data().description || "",
    start_date: doc.data().start_date?.toDate() || new Date(),
    end_date: doc.data().end_date?.toDate() || new Date(),
    status: doc.data().status as PromotionStatus,
    promotion_type: (doc.data().promotion_type as PromotionType) || "restaurant",
    menu_item_id: doc.data().menu_item_id,
    discount_percentage: doc.data().discount_percentage || 0,
    created_at: doc.data().created_at?.toDate() || new Date(),
    updated_at: doc.data().updated_at?.toDate() || new Date(),
  }));
}

export async function createPromotion(input: CreatePromotionInput): Promise<Promotion> {
  const userId = getUserId();
  const promoRef = collection(db, "restaurants", userId, "promotions");
  
  const docRef = await addDoc(promoRef, {
    restaurant_id: userId,
    title: input.title,
    description: input.description,
    start_date: input.start_date,
    end_date: input.end_date,
    status: input.status,
    promotion_type: input.promotion_type,
    menu_item_id: input.menu_item_id || null,
    discount_percentage: input.discount_percentage || 0,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  });

  return {
    id: docRef.id,
    restaurant_id: userId,
    title: input.title,
    description: input.description,
    start_date: input.start_date,
    end_date: input.end_date,
    status: input.status,
    promotion_type: input.promotion_type,
    menu_item_id: input.menu_item_id,
    discount_percentage: input.discount_percentage,
    created_at: new Date(),
    updated_at: new Date(),
  };
}

export async function updatePromotion(input: UpdatePromotionInput): Promise<Promotion> {
  const userId = getUserId();
  const docRef = doc(db, "restaurants", userId, "promotions", input.id);
  
  const updateData: Record<string, unknown> = {
    updated_at: serverTimestamp(),
  };
  
  if (input.title !== undefined) updateData.title = input.title;
  if (input.description !== undefined) updateData.description = input.description;
  if (input.start_date !== undefined) updateData.start_date = input.start_date;
  if (input.end_date !== undefined) updateData.end_date = input.end_date;
  if (input.status !== undefined) updateData.status = input.status;
  if (input.promotion_type !== undefined) updateData.promotion_type = input.promotion_type;
  if (input.menu_item_id !== undefined) updateData.menu_item_id = input.menu_item_id;
  if (input.discount_percentage !== undefined) updateData.discount_percentage = input.discount_percentage;
  
  await updateDoc(docRef, updateData);
  
  // Fetch the updated document
  const updatedDoc = await getDoc(docRef);
  const data = updatedDoc.data();
  
  return {
    id: input.id,
    restaurant_id: userId,
    title: data?.title,
    description: data?.description || "",
    start_date: data?.start_date?.toDate() || new Date(),
    end_date: data?.end_date?.toDate() || new Date(),
    status: data?.status as PromotionStatus,
    promotion_type: (data?.promotion_type as PromotionType) || "restaurant",
    menu_item_id: data?.menu_item_id,
    discount_percentage: data?.discount_percentage || 0,
    created_at: data?.created_at?.toDate() || new Date(),
    updated_at: data?.updated_at?.toDate() || new Date(),
  };
}

export async function deletePromotion(id: string): Promise<void> {
  const userId = getUserId();
  const docRef = doc(db, "restaurants", userId, "promotions", id);
  await deleteDoc(docRef);
}
