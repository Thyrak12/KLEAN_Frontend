import { useState } from "react";
import { Plus, Pencil, Trash2, ChevronRight, Search, Loader2 } from "lucide-react";
import { useMenu } from "../features/menu/MenuContext";
import type { MenuItem, Promotion, CreateMenuItemInput, CreatePromotionInput } from "../types/menu";
import { MENU_CATEGORIES } from "../types/menu";
import MenuItemModal from "../components/MenuItemModal";
import PromotionModal from "../components/PromotionModal";
import ConfirmModal from "../components/ConfirmModal";

// ── Menu Card ──────────────────────────────────────────────
function MenuCard({
  item,
  onEdit,
  onDelete,
}: {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
  onDelete: (item: MenuItem) => void;
}) {
  const categoryLabel = MENU_CATEGORIES.find((c) => c.value === item.category)?.label || item.category;

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col items-center gap-3 w-[200px] flex-shrink-0">
      {/* Availability badge */}
      {!item.available && (
        <span className="absolute top-3 right-3 bg-gray-400 text-white text-xs font-bold px-2 py-1 rounded-full">
          Unavailable
        </span>
      )}

      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 shadow-md">
        <img
          src={item.image || "https://via.placeholder.com/150?text=No+Image"}
          alt={item.item_name}
          className="w-full h-full object-cover"
        />
      </div>
      <h4 className="text-base font-semibold text-gray-900 text-center">
        {item.item_name}
      </h4>
      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
        {categoryLabel}
      </span>
      <span className="text-lg font-bold text-gray-800">${item.price}</span>
      <div className="flex items-center gap-2 mt-1">
        <button
          onClick={() => onEdit(item)}
          className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-white text-xs font-semibold px-3 py-1.5 rounded-md transition-colors"
        >
          <Pencil size={13} />
          Edit
        </button>
        <button
          onClick={() => onDelete(item)}
          className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded-md transition-colors"
        >
          <Trash2 size={13} />
          Delete
        </button>
      </div>
    </div>
  );
}

// ── Promotion Card ─────────────────────────────────────────
function PromotionCard({
  promotion,
  menuItem,
  onEdit,
  onDelete,
}: {
  promotion: Promotion;
  menuItem?: MenuItem;
  onEdit: (promotion: Promotion) => void;
  onDelete: (promotion: Promotion) => void;
}) {
  const originalPrice = menuItem?.price || 0;
  const discountedPrice = originalPrice * (1 - (promotion.discount_percentage || 0) / 100);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "inactive":
        return "bg-gray-400";
      case "scheduled":
        return "bg-blue-500";
      case "expired":
        return "bg-red-400";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="relative bg-white rounded-2xl shadow-sm p-5 flex flex-col items-center gap-3 w-[200px] flex-shrink-0">
      {/* Discount badge */}
      <span className="absolute top-3 left-3 bg-amber-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
        {promotion.discount_percentage}% Off
      </span>

      {/* Status badge */}
      <span
        className={`absolute top-3 right-3 ${getStatusColor(
          promotion.status
        )} text-white text-xs font-bold px-2 py-1 rounded-full capitalize`}
      >
        {promotion.status}
      </span>

      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 shadow-md mt-4">
        <img
          src={menuItem?.image || "https://via.placeholder.com/150?text=No+Image"}
          alt={menuItem?.item_name || "Promotion"}
          className="w-full h-full object-cover"
        />
      </div>
      <h4 className="text-base font-semibold text-gray-900 text-center">
        {menuItem?.item_name || "Unknown Item"}
      </h4>
      <p className="text-xs text-gray-500 text-center line-clamp-2">
        {promotion.title}
      </p>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-400 line-through">
          ${originalPrice.toFixed(2)}
        </span>
        <span className="text-lg font-bold text-gray-800">
          ${discountedPrice.toFixed(2)}
        </span>
      </div>
      <div className="flex items-center gap-2 mt-1">
        <button
          onClick={() => onEdit(promotion)}
          className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-white text-xs font-semibold px-3 py-1.5 rounded-md transition-colors"
        >
          <Pencil size={13} />
          Edit
        </button>
        <button
          onClick={() => onDelete(promotion)}
          className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded-md transition-colors"
        >
          <Trash2 size={13} />
          Delete
        </button>
      </div>
    </div>
  );
}

// ── Main Page ───────────────────────────────────────────────
export default function MenuPromotion() {
  const {
    menuItems,
    promotions,
    createMenuItem,
    updateMenuItem,
    deleteMenuItem,
    createPromotion,
    updatePromotion,
    deletePromotion,
    getMenuItemById,
    loading,
  } = useMenu();

  // Modal states
  const [menuModalOpen, setMenuModalOpen] = useState(false);
  const [promotionModalOpen, setPromotionModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  // Edit states
  const [editingMenuItem, setEditingMenuItem] = useState<MenuItem | null>(null);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);

  // Delete states
  const [deletingMenuItem, setDeletingMenuItem] = useState<MenuItem | null>(null);
  const [deletingPromotion, setDeletingPromotion] = useState<Promotion | null>(null);

  // Search/filter
  const [menuSearch, setMenuSearch] = useState("");
  const [promotionSearch, setPromotionSearch] = useState("");
  const [showAllMenus, setShowAllMenus] = useState(false);
  const [showAllPromotions, setShowAllPromotions] = useState(false);

  // Filtered items
  const filteredMenuItems = menuItems.filter((item) =>
    item.item_name.toLowerCase().includes(menuSearch.toLowerCase())
  );

  const filteredPromotions = promotions.filter((promo) => {
    const menuItem = getMenuItemById(promo.menu_item_id);
    return (
      promo.title.toLowerCase().includes(promotionSearch.toLowerCase()) ||
      menuItem?.item_name.toLowerCase().includes(promotionSearch.toLowerCase())
    );
  });

  // Display items (limited or all)
  const displayedMenuItems = showAllMenus ? filteredMenuItems : filteredMenuItems.slice(0, 6);
  const displayedPromotions = showAllPromotions ? filteredPromotions : filteredPromotions.slice(0, 6);

  // Handlers for Menu Items
  const handleCreateMenu = () => {
    setEditingMenuItem(null);
    setMenuModalOpen(true);
  };

  const handleEditMenu = (item: MenuItem) => {
    setEditingMenuItem(item);
    setMenuModalOpen(true);
  };

  const handleDeleteMenuClick = (item: MenuItem) => {
    setDeletingMenuItem(item);
    setDeletingPromotion(null);
    setConfirmModalOpen(true);
  };

  const handleMenuSubmit = async (data: CreateMenuItemInput) => {
    if (editingMenuItem) {
      await updateMenuItem({ id: editingMenuItem.id, ...data });
    } else {
      await createMenuItem(data);
    }
  };

  // Handlers for Promotions
  const handleCreatePromotion = () => {
    setEditingPromotion(null);
    setPromotionModalOpen(true);
  };

  const handleEditPromotion = (promo: Promotion) => {
    setEditingPromotion(promo);
    setPromotionModalOpen(true);
  };

  const handleDeletePromotionClick = (promo: Promotion) => {
    setDeletingPromotion(promo);
    setDeletingMenuItem(null);
    setConfirmModalOpen(true);
  };

  const handlePromotionSubmit = async (data: CreatePromotionInput) => {
    if (editingPromotion) {
      await updatePromotion({ id: editingPromotion.id, ...data });
    } else {
      await createPromotion(data);
    }
  };

  // Confirm delete handler
  const handleConfirmDelete = async () => {
    if (deletingMenuItem) {
      await deleteMenuItem(deletingMenuItem.id);
    } else if (deletingPromotion) {
      await deletePromotion(deletingPromotion.id);
    }
    setConfirmModalOpen(false);
    setDeletingMenuItem(null);
    setDeletingPromotion(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <span className="text-3xl font-bold text-gray-900">Menu & Promotion</span>
          {loading && (
            <Loader2 size={24} className="text-amber-400 animate-spin" />
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleCreatePromotion}
            disabled={loading}
            className="flex items-center gap-2 border-2 border-amber-400 text-gray-900 font-semibold px-5 py-2.5 rounded-full hover:bg-amber-50 transition-colors disabled:opacity-50"
          >
            Create Promotion
            <Plus size={18} />
          </button>
          <button
            onClick={handleCreateMenu}
            disabled={loading}
            className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-white font-semibold px-5 py-2.5 rounded-full transition-colors disabled:opacity-50"
          >
            Create Menu
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* ── Menu Section ── */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Menu ({filteredMenuItems.length})
          </h2>
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search menu..."
                value={menuSearch}
                onChange={(e) => setMenuSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
            <button
              onClick={() => setShowAllMenus(!showAllMenus)}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showAllMenus ? "Show less" : "View all"} <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <div className={`flex gap-5 pb-4 ${showAllMenus ? "flex-wrap" : "overflow-x-auto"}`}>
          {displayedMenuItems.length > 0 ? (
            displayedMenuItems.map((item) => (
              <MenuCard
                key={item.id}
                item={item}
                onEdit={handleEditMenu}
                onDelete={handleDeleteMenuClick}
              />
            ))
          ) : (
            <div className="w-full text-center py-8 text-gray-500">
              No menu items found. Create your first menu item!
            </div>
          )}
        </div>
      </div>

      {/* ── Promotion Section ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Promotion ({filteredPromotions.length})
          </h2>
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search promotions..."
                value={promotionSearch}
                onChange={(e) => setPromotionSearch(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-amber-400"
              />
            </div>
            <button
              onClick={() => setShowAllPromotions(!showAllPromotions)}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showAllPromotions ? "Show less" : "View all"} <ChevronRight size={16} />
            </button>
          </div>
        </div>
        <div className={`flex gap-5 pb-4 ${showAllPromotions ? "flex-wrap" : "overflow-x-auto"}`}>
          {displayedPromotions.length > 0 ? (
            displayedPromotions.map((promo) => (
              <PromotionCard
                key={promo.id}
                promotion={promo}
                menuItem={getMenuItemById(promo.menu_item_id)}
                onEdit={handleEditPromotion}
                onDelete={handleDeletePromotionClick}
              />
            ))
          ) : (
            <div className="w-full text-center py-8 text-gray-500">
              No promotions found. Create your first promotion!
            </div>
          )}
        </div>
      </div>

      {/* ── Modals ── */}
      <MenuItemModal
        isOpen={menuModalOpen}
        onClose={() => setMenuModalOpen(false)}
        onSubmit={handleMenuSubmit}
        menuItem={editingMenuItem}
        mode={editingMenuItem ? "edit" : "create"}
      />

      <PromotionModal
        isOpen={promotionModalOpen}
        onClose={() => setPromotionModalOpen(false)}
        onSubmit={handlePromotionSubmit}
        promotion={editingPromotion}
        menuItems={menuItems}
        mode={editingPromotion ? "edit" : "create"}
      />

      <ConfirmModal
        isOpen={confirmModalOpen}
        onClose={() => {
          setConfirmModalOpen(false);
          setDeletingMenuItem(null);
          setDeletingPromotion(null);
        }}
        onConfirm={handleConfirmDelete}
        title={deletingMenuItem ? "Delete Menu Item?" : "Delete Promotion?"}
        message={
          deletingMenuItem
            ? `Are you sure you want to delete "${deletingMenuItem.item_name}"? This will also delete all related promotions.`
            : `Are you sure you want to delete the promotion "${deletingPromotion?.title}"?`
        }
        isLoading={loading}
      />
    </div>
  );
}
