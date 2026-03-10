import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import type {
  MenuItem,
  Promotion,
  CreateMenuItemInput,
  UpdateMenuItemInput,
  CreatePromotionInput,
  UpdatePromotionInput,
} from "../../types/menu";
import * as menuService from "./menuService";
import { auth } from "../../config/firebase";
import { onAuthStateChanged } from "firebase/auth";

interface MenuContextType {
  // Menu Items
  menuItems: MenuItem[];
  createMenuItem: (input: CreateMenuItemInput) => Promise<MenuItem>;
  updateMenuItem: (input: UpdateMenuItemInput) => Promise<MenuItem>;
  deleteMenuItem: (id: string) => Promise<void>;
  getMenuItemById: (id: string) => MenuItem | undefined;

  // Promotions
  promotions: Promotion[];
  createPromotion: (input: CreatePromotionInput) => Promise<Promotion>;
  updatePromotion: (input: UpdatePromotionInput) => Promise<Promotion>;
  deletePromotion: (id: string) => Promise<void>;
  getPromotionById: (id: string) => Promotion | undefined;
  getPromotionsByMenuItem: (menuItemId: string) => Promotion[];

  // Image upload
  uploadImage: (file: File) => Promise<string>;

  // Loading & refresh
  loading: boolean;
  refreshData: () => Promise<void>;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export function MenuProvider({ children }: { children: ReactNode }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Fetch data from Firestore
  const refreshData = useCallback(async () => {
    if (!auth.currentUser) return;
    
    setLoading(true);
    try {
      const [fetchedMenuItems, fetchedPromotions] = await Promise.all([
        menuService.fetchMenuItems(),
        menuService.fetchPromotions(),
      ]);
      setMenuItems(fetchedMenuItems);
      setPromotions(fetchedPromotions);
    } catch (error) {
      console.error("Failed to fetch menu data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Listen for auth state changes and fetch data when user is authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && !initialized) {
        refreshData();
        setInitialized(true);
      } else if (!user) {
        setMenuItems([]);
        setPromotions([]);
        setInitialized(false);
      }
    });

    return () => unsubscribe();
  }, [refreshData, initialized]);

  // Image upload
  const uploadImage = useCallback(async (file: File): Promise<string> => {
    return menuService.uploadMenuImage(file);
  }, []);

  // Menu Item CRUD
  const createMenuItem = useCallback(async (input: CreateMenuItemInput): Promise<MenuItem> => {
    setLoading(true);
    try {
      const newItem = await menuService.createMenuItem(input);
      setMenuItems((prev) => [newItem, ...prev]);
      return newItem;
    } catch (error) {
      console.error("Failed to create menu item:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateMenuItem = useCallback(async (input: UpdateMenuItemInput): Promise<MenuItem> => {
    setLoading(true);
    try {
      const updatedItem = await menuService.updateMenuItem(input);
      setMenuItems((prev) =>
        prev.map((item) => (item.id === input.id ? updatedItem : item))
      );
      return updatedItem;
    } catch (error) {
      console.error("Failed to update menu item:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteMenuItem = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    try {
      await menuService.deleteMenuItem(id);
      // Remove from local state (promotions are also deleted in service)
      setPromotions((prev) => prev.filter((p) => p.menu_item_id !== id));
      setMenuItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Failed to delete menu item:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getMenuItemById = useCallback(
    (id: string): MenuItem | undefined => {
      return menuItems.find((item) => item.id === id);
    },
    [menuItems]
  );

  // Promotion CRUD
  const createPromotion = useCallback(async (input: CreatePromotionInput): Promise<Promotion> => {
    setLoading(true);
    try {
      const newPromotion = await menuService.createPromotion(input);
      setPromotions((prev) => [newPromotion, ...prev]);
      return newPromotion;
    } catch (error) {
      console.error("Failed to create promotion:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePromotion = useCallback(async (input: UpdatePromotionInput): Promise<Promotion> => {
    setLoading(true);
    try {
      const updatedPromotion = await menuService.updatePromotion(input);
      setPromotions((prev) =>
        prev.map((promo) => (promo.id === input.id ? updatedPromotion : promo))
      );
      return updatedPromotion;
    } catch (error) {
      console.error("Failed to update promotion:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletePromotion = useCallback(async (id: string): Promise<void> => {
    setLoading(true);
    try {
      await menuService.deletePromotion(id);
      setPromotions((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Failed to delete promotion:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const getPromotionById = useCallback(
    (id: string): Promotion | undefined => {
      return promotions.find((p) => p.id === id);
    },
    [promotions]
  );

  const getPromotionsByMenuItem = useCallback(
    (menuItemId: string): Promotion[] => {
      return promotions.filter((p) => p.menu_item_id === menuItemId);
    },
    [promotions]
  );

  return (
    <MenuContext.Provider
      value={{
        menuItems,
        createMenuItem,
        updateMenuItem,
        deleteMenuItem,
        getMenuItemById,
        promotions,
        createPromotion,
        updatePromotion,
        deletePromotion,
        getPromotionById,
        getPromotionsByMenuItem,
        uploadImage,
        loading,
        refreshData,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useMenu() {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error("useMenu must be used within a MenuProvider");
  }
  return context;
}


