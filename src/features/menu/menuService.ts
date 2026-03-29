import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
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
  PromotionScope,
  PromotionBenefitType,
  PromotionComputedStatus,
} from "../../types/menu";

const normalizeScope = (value: unknown): PromotionScope => {
  if (value === "overall" || value === "menu_item") return value;
  // backward compatibility
  if (value === "restaurant") return "overall";
  if (value === "menu_discount") return "menu_item";
  return "overall";
};

const toPromotionType = (scope: PromotionScope): "restaurant" | "menu_discount" => {
  return scope === "menu_item" ? "menu_discount" : "restaurant";
};

const normalizeBenefitType = (value: unknown, docData: Record<string, unknown>): PromotionBenefitType => {
  if (value === "percentage" || value === "non_discount") return value;

  // backward compatibility
  const oldOfferType = docData.offer_type;
  if (oldOfferType === "percentage") return "percentage";

  const discountValue = Number(docData.discount_value || 0);
  if (discountValue > 0) return "percentage";

  return "non_discount";
};

const toDateValue = (value: unknown): Date => {
  if (!value) return new Date();

  if (value instanceof Date) return value;

  if (typeof value === "object" && value !== null && "toDate" in value) {
    const timestampLike = value as { toDate: () => Date };
    return timestampLike.toDate();
  }

  return new Date(value as string | number);
};

const computePromotionStatus = (
  isPublished: boolean,
  startAt: Date,
  endAt: Date
): PromotionComputedStatus => {
  if (!isPublished) return "draft";
  const now = new Date();

  if (now < startAt) return "scheduled";
  if (now > endAt) return "expired";
  return "active";
};

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
  const promotionsSnapshot = await getDocs(promotionsRef);

  const deletePromises = promotionsSnapshot.docs
    .filter((promotionDoc) => {
      const data = promotionDoc.data();
      return data.menuItemId === id || data.menu_item_id === id;
    })
    .map((promotionDoc) => deleteDoc(promotionDoc.ref));
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
  
  return snapshot.docs.map((promotionDoc) => {
    const data = promotionDoc.data();

    const scope = normalizeScope(data.scope ?? data.promotion_type);
    const promotionType = toPromotionType(scope);
    const benefitType = normalizeBenefitType(data.benefitType, data);
    const benefitValue = Number(data.benefitValue ?? data.discount_value ?? 0) || 0;
    const benefitText = String(data.benefitText ?? data.offer_details ?? "");
    const startAt = toDateValue(data.startAt ?? data.start_date);
    const endAt = toDateValue(data.endAt ?? data.end_date);
    const isPublished =
      typeof data.isPublished === "boolean"
        ? data.isPublished
        : data.status === "inactive"
          ? false
          : true;

    const computedStatus = computePromotionStatus(isPublished, startAt, endAt);

    return {
      id: promotionDoc.id,
      restaurant_id: userId,
      scope,
      promotion_type: promotionType,
      title: data.title || "",
      description: data.description || "",
      image: data.image || "",
      benefitType,
      benefitValue: benefitType === "percentage" ? benefitValue : undefined,
      benefitText: benefitType === "non_discount" ? benefitText : undefined,
      discount_value: benefitType === "percentage" ? benefitValue : undefined,
      menuItemId: data.menuItemId || data.menu_item_id || undefined,
      menu_item_id: data.menuItemId || data.menu_item_id || undefined,
      startAt,
      endAt,
      start_date: startAt,
      end_date: endAt,
      isPublished,
      status: computedStatus,
      created_at: toDateValue(data.created_at),
      updated_at: toDateValue(data.updated_at),
    };
  });
}

export async function createPromotion(input: CreatePromotionInput): Promise<Promotion> {
  const userId = getUserId();
  const promoRef = collection(db, "restaurants", userId, "promotions");

  const scope = input.scope ?? normalizeScope(input.promotion_type);
  const promotionType = toPromotionType(scope);
  const benefitType = input.benefitType ?? (input.offer_type === "percentage" ? "percentage" : "non_discount");
  const benefitValue =
    input.benefitValue ?? input.discount_value ?? 0;
  const benefitText = input.benefitText ?? input.offer_details ?? "";
  const menuItemId = input.menuItemId ?? input.menu_item_id;
  const startAt = input.startAt ?? input.start_date ?? new Date();
  const endAt = input.endAt ?? input.end_date ?? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const isPublished =
    typeof input.isPublished === "boolean"
      ? input.isPublished
      : input.status === "inactive"
        ? false
        : true;

  const computedStatus = computePromotionStatus(isPublished, startAt, endAt);
  
  const docRef = await addDoc(promoRef, {
    restaurant_id: userId,
    scope,
    promotion_type: promotionType,
    title: input.title,
    description: input.description,
    image: input.image || "",
    benefitType,
    benefitValue: benefitType === "percentage" ? benefitValue : null,
    benefitText: benefitType === "non_discount" ? benefitText : "",
    discount_value: benefitType === "percentage" ? benefitValue : 0,
    menuItemId: scope === "menu_item" ? menuItemId || null : null,
    menu_item_id: scope === "menu_item" ? menuItemId || null : null,
    startAt,
    endAt,
    start_date: startAt,
    end_date: endAt,
    isPublished,
    status: computedStatus,
    created_at: serverTimestamp(),
    updated_at: serverTimestamp(),
  });

  return {
    id: docRef.id,
    restaurant_id: userId,
    scope,
    promotion_type: promotionType,
    title: input.title,
    description: input.description,
    image: input.image,
    benefitType,
    benefitValue: benefitType === "percentage" ? benefitValue : undefined,
    benefitText: benefitType === "non_discount" ? benefitText : undefined,
    menuItemId: scope === "menu_item" ? menuItemId : undefined,
    startAt,
    endAt,
    isPublished,
    status: computedStatus,
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
  
  if (input.scope !== undefined) updateData.scope = input.scope;
  if (input.promotion_type !== undefined) updateData.scope = normalizeScope(input.promotion_type);
  if (input.title !== undefined) updateData.title = input.title;
  if (input.description !== undefined) updateData.description = input.description;
  if (input.image !== undefined) updateData.image = input.image;
  if (input.benefitType !== undefined) updateData.benefitType = input.benefitType;
  if (input.offer_type !== undefined) updateData.benefitType = input.offer_type;
  if (input.benefitValue !== undefined) updateData.benefitValue = input.benefitValue;
  if (input.discount_value !== undefined) updateData.benefitValue = input.discount_value;

  const syncedDiscount =
    input.benefitValue ??
    input.discount_value;
  if (syncedDiscount !== undefined) {
    updateData.discount_value = syncedDiscount;
  }
  if (input.benefitText !== undefined) updateData.benefitText = input.benefitText;
  if (input.offer_details !== undefined) updateData.benefitText = input.offer_details;
  if (input.menuItemId !== undefined) updateData.menuItemId = input.menuItemId;
  if (input.menu_item_id !== undefined) updateData.menuItemId = input.menu_item_id;
  if (input.startAt !== undefined) updateData.startAt = input.startAt;
  if (input.start_date !== undefined) updateData.startAt = input.start_date;
  if (input.endAt !== undefined) updateData.endAt = input.endAt;
  if (input.end_date !== undefined) updateData.endAt = input.end_date;
  if (input.isPublished !== undefined) updateData.isPublished = input.isPublished;
  if (input.status !== undefined) updateData.isPublished = input.status !== "inactive";

  const updateStart = input.startAt ?? input.start_date;
  const updateEnd = input.endAt ?? input.end_date;
  const updatePublished = input.isPublished ?? (input.status !== undefined ? input.status !== "inactive" : undefined);

  const finalScopeForType =
    input.scope ??
    (input.promotion_type !== undefined ? normalizeScope(input.promotion_type) : undefined);
  if (finalScopeForType !== undefined) {
    updateData.promotion_type = toPromotionType(finalScopeForType);
  }

  if (updateStart || updateEnd || updatePublished !== undefined) {
    const currentDoc = await getDoc(docRef);
    const currentData = currentDoc.data() || {};
    const finalStart = updateStart ?? toDateValue(currentData.startAt ?? currentData.start_date);
    const finalEnd = updateEnd ?? toDateValue(currentData.endAt ?? currentData.end_date);
    const finalPublished =
      updatePublished ??
      (typeof currentData.isPublished === "boolean"
        ? currentData.isPublished
        : currentData.status === "inactive"
          ? false
          : true);

    updateData.status = computePromotionStatus(finalPublished, finalStart, finalEnd);
  }
  
  await updateDoc(docRef, updateData);
  
  // Fetch the updated document
  const updatedDoc = await getDoc(docRef);
  const data = updatedDoc.data();
  
  return {
    id: input.id,
    restaurant_id: userId,
    scope: normalizeScope(data?.scope ?? data?.promotion_type),
    promotion_type: toPromotionType(normalizeScope(data?.scope ?? data?.promotion_type)),
    title: data?.title,
    description: data?.description || "",
    image: data?.image || "",
    benefitType: normalizeBenefitType(data?.benefitType, data || {}),
    benefitValue:
      normalizeBenefitType(data?.benefitType, data || {}) === "percentage"
        ? Number(data?.benefitValue ?? data?.discount_value ?? 0)
        : undefined,
    benefitText:
      normalizeBenefitType(data?.benefitType, data || {}) === "non_discount"
        ? String(data?.benefitText ?? data?.offer_details ?? "")
        : undefined,
    discount_value:
      normalizeBenefitType(data?.benefitType, data || {}) === "percentage"
        ? Number(data?.benefitValue ?? data?.discount_value ?? 0)
        : undefined,
    menuItemId: data?.menuItemId || data?.menu_item_id || undefined,
    menu_item_id: data?.menuItemId || data?.menu_item_id || undefined,
    startAt: toDateValue(data?.startAt ?? data?.start_date),
    endAt: toDateValue(data?.endAt ?? data?.end_date),
    start_date: toDateValue(data?.startAt ?? data?.start_date),
    end_date: toDateValue(data?.endAt ?? data?.end_date),
    isPublished:
      typeof data?.isPublished === "boolean"
        ? data.isPublished
        : data?.status === "inactive"
          ? false
          : true,
    status: computePromotionStatus(
      typeof data?.isPublished === "boolean"
        ? data.isPublished
        : data?.status === "inactive"
          ? false
          : true,
      toDateValue(data?.startAt ?? data?.start_date),
      toDateValue(data?.endAt ?? data?.end_date)
    ),
    created_at: data?.created_at?.toDate() || new Date(),
    updated_at: data?.updated_at?.toDate() || new Date(),
  };
}

export async function deletePromotion(id: string): Promise<void> {
  const userId = getUserId();
  const docRef = doc(db, "restaurants", userId, "promotions", id);
  await deleteDoc(docRef);
}
