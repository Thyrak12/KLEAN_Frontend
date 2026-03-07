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
export type PromotionType = "restaurant" | "menu_discount";

export interface Promotion {
  id: string;
  restaurant_id: string;
  title: string;
  description: string;
  start_date: Date;
  end_date: Date;
  status: PromotionStatus;
  promotion_type: PromotionType;
  menu_item_id?: string; // Optional - only for menu_discount type
  discount_percentage?: number; // Only for menu_discount type
  created_at: Date;
  updated_at: Date;
}

export type PromotionStatus = "active" | "inactive" | "scheduled" | "expired";

export interface CreatePromotionInput {
  title: string;
  description: string;
  start_date: Date;
  end_date: Date;
  status: PromotionStatus;
  promotion_type: PromotionType;
  menu_item_id?: string; // Optional - only for menu_discount type
  discount_percentage?: number; // Only for menu_discount type
}

export interface UpdatePromotionInput extends Partial<CreatePromotionInput> {
  id: string;
}
