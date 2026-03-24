// Menu Item Types
export interface MenuItem {
  id: string;
  restaurant_id: string;
  item_name: string;
  description: string;
  price: number;
  category: MenuCategory;
  image?: string;
  created_at: Date;
  updated_at: Date;
}

export type MenuCategory =
  | "appetizer"
  | "main_course"
  | "dessert"
  | "beverage"
  | "side_dish"
  | "soup"
  | "salad"
  | "special";

export const MENU_CATEGORIES: { value: MenuCategory; label: string }[] = [
  { value: "appetizer", label: "Appetizer" },
  { value: "main_course", label: "Main Course" },
  { value: "dessert", label: "Dessert" },
  { value: "beverage", label: "Beverage" },
  { value: "side_dish", label: "Side Dish" },
  { value: "soup", label: "Soup" },
  { value: "salad", label: "Salad" },
  { value: "special", label: "Special" },
];

export interface CreateMenuItemInput {
  item_name: string;
  description: string;
  price: number;
  category: MenuCategory;
  image?: string;
}

export interface UpdateMenuItemInput extends Partial<CreateMenuItemInput> {
  id: string;
}

// Promotion Types
export type PromotionScope = "overall" | "menu_item";
export type PromotionBenefitType = "percentage" | "non_discount";
export type PromotionComputedStatus = "draft" | "scheduled" | "active" | "expired";

// Backward-compatible aliases (legacy)
export type PromotionType = "restaurant" | "menu_discount";
export type RestaurantOfferType = "percentage" | "non_discount";

export interface Promotion {
  id: string;
  restaurant_id?: string;
  // 1. Scope (WHERE)
  scope: PromotionScope;

  // 2. Content
  title: string;
  description: string;
  image?: string;

  // 3. Benefit (WHAT)
  benefitType: PromotionBenefitType;
  benefitValue?: number; // for percentage
  benefitText?: string; // for non-discount

  // 4. Target (ONLY if menu_item)
  menuItemId?: string;

  // 5. Time
  startAt: Date;
  endAt: Date;

  // 6. Publishing
  isPublished: boolean;

  // 7. System computed (optional cache)
  status?: PromotionComputedStatus;

  // Optional metadata
  created_at: Date;
  updated_at: Date;

  // Legacy fields (compatibility only)
  promotion_type?: PromotionType;
  offer_type?: RestaurantOfferType;
  menu_item_id?: string;
  discount_value?: number;
  offer_details?: string;
  start_date?: Date;
  end_date?: Date;
}

export type PromotionStatus = "active" | "inactive" | "scheduled" | "expired";

export interface CreatePromotionInput {
  // 1. Scope (WHERE)
  scope: PromotionScope;

  // 2. Content
  title: string;
  description: string;
  image?: string;

  // 3. Benefit (WHAT)
  benefitType: PromotionBenefitType;
  benefitValue?: number; // for percentage
  benefitText?: string; // for non-discount

  // 4. Target (ONLY if menu_item)
  menuItemId?: string;

  // 5. Time
  startAt: Date;
  endAt: Date;

  // 6. Publishing
  isPublished: boolean;

  // Legacy fields (compatibility only)
  promotion_type?: PromotionType;
  offer_type?: RestaurantOfferType;
  menu_item_id?: string;
  discount_value?: number;
  offer_details?: string;
  start_date?: Date;
  end_date?: Date;
  status?: PromotionComputedStatus | "inactive";
}

export interface UpdatePromotionInput extends Partial<CreatePromotionInput> {
  id: string;
}
