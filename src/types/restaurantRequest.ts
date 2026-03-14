// TypeScript interface for Restaurant Request
export interface RestaurantRequest {
  id?: string; // Firestore document ID
  ownerId: string;
  restaurantName: string;
  description: string;
  location: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  googleMapLink?: string;
  contactInfo?: string;
  coverImageUrl?: string;
  openHour?: string;
  closeHour?: string;
  openingHours?: string;
  status: "pending" | "approved" | "rejected";
  createdAt: number; // timestamp in milliseconds
  updatedAt?: number; // timestamp in milliseconds
  cuisineType?: string;
  seatingCapacity?: number;
  phone?: string;
  email?: string;
  documents?: string[]; // URLs or file references
  rejectionReason?: string; // if status is rejected
}

export type RestaurantRequestStatus = "pending" | "approved" | "rejected";
