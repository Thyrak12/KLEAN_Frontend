// TypeScript interface for Restaurant
export interface Restaurant {
  uid: string; // Firestore document ID (same as owner's user ID)
  restaurantName: string;
  phone: string;
  contactInfo: string;
  address: string;
  coverImageUrl?: string;
  category: string;
  ambience?: string[];
  amenities?: string[];
  pricing?: {
    mainDish?: { min: string; max: string };
    beverage?: { min: string; max: string };
    signature?: { min: string; max: string };
    bestSelling?: { min: string; max: string };
    groupSpend?: { min: string; max: string };
  };
  affordability?: string;
  spending?: string;
  targetCustomers?: string[];
  offersFixedSets?: boolean;
  avgSetPrice?: string | null;
  dinerTypes?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Simplified view for admin list display
export interface RestaurantListItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  createdAt?: Date;
}
