import { useState } from "react";
import { Plus, Pencil, Trash2, ChevronRight, Search, Loader2, Store, Tag, Filter, X } from "lucide-react";
import { useMenu } from "../features/menu/MenuContext";
import type { MenuItem, Promotion, CreateMenuItemInput, CreatePromotionInput, MenuCategory, PromotionType } from "../types/menu";
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
  const isMenuDiscount = promotion.promotion_type === "menu_discount";
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

  // Restaurant-wide promotion card
  if (!isMenuDiscount) {
    return (
      <div className="relative bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-sm p-5 w-[280px] flex-shrink-0 border border-amber-200">
        {/* Status badge */}
        <span
          className={`absolute top-3 right-3 ${getStatusColor(
            promotion.status
          )} text-white text-xs font-bold px-2 py-1 rounded-full capitalize`}
        >
          {promotion.status}
        </span>

        {/* Type badge */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-10 h-10 rounded-full bg-amber-400 flex items-center justify-center">
            <Store size={20} className="text-white" />
          </div>
          <span className="text-xs font-semibold text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
            Restaurant Promo
          </span>
        </div>

        <h4 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          {promotion.title}
        </h4>
        <p className="text-sm text-gray-600 line-clamp-3 mb-4">
          {promotion.description}
        </p>

        {/* Date range */}
        <div className="text-xs text-gray-500 mb-4">
          {new Date(promotion.start_date).toLocaleDateString()} - {new Date(promotion.end_date).toLocaleDateString()}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(promotion)}
            className="flex-1 flex items-center justify-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-white text-xs font-semibold px-3 py-2 rounded-md transition-colors"
          >
            <Pencil size={13} />
            Edit
          </button>
          <button
            onClick={() => onDelete(promotion)}
            className="flex-1 flex items-center justify-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-3 py-2 rounded-md transition-colors"
          >
            <Trash2 size={13} />
            Delete
          </button>
        </div>
      </div>
    );
  }

  // Menu discount card
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
      <div className="flex items-center gap-1">
        <Tag size={12} className="text-amber-500" />
        <span className="text-xs text-amber-600 font-medium">Menu Discount</span>
      </div>
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

  // Menu filters
  const [showMenuFilters, setShowMenuFilters] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<MenuCategory | "all">("all");
  const [priceRange, setPriceRange] = useState<"all" | "under10" | "10to20" | "20to50" | "over50">("all");

  // Promotion filters
  const [showPromoFilters, setShowPromoFilters] = useState(false);
  const [promoTypeFilter, setPromoTypeFilter] = useState<PromotionType | "all">("all");
  const [promoStatusFilter, setPromoStatusFilter] = useState<"all" | "active" | "inactive" | "scheduled" | "expired">("all");

  // Count active filters
  const menuFilterCount = [categoryFilter !== "all", priceRange !== "all"].filter(Boolean).length;
  const promoFilterCount = [promoTypeFilter !== "all", promoStatusFilter !== "all"].filter(Boolean).length;

  // Filtered items
  const filteredMenuItems = menuItems.filter((item) => {
    // Search filter
    if (!item.item_name.toLowerCase().includes(menuSearch.toLowerCase())) return false;
    
    // Category filter
    if (categoryFilter !== "all" && item.category !== categoryFilter) return false;
    
    // Price range filter
    if (priceRange !== "all") {
      switch (priceRange) {
        case "under10":
          if (item.price >= 10) return false;
          break;
        case "10to20":
          if (item.price < 10 || item.price >= 20) return false;
          break;
        case "20to50":
          if (item.price < 20 || item.price >= 50) return false;
          break;
        case "over50":
          if (item.price < 50) return false;
          break;
      }
    }
    
    return true;
  });

  const filteredPromotions = promotions.filter((promo) => {
    const menuItem = promo.menu_item_id ? getMenuItemById(promo.menu_item_id) : undefined;
    
    // Search filter
    const matchesSearch = 
      promo.title.toLowerCase().includes(promotionSearch.toLowerCase()) ||
      promo.description.toLowerCase().includes(promotionSearch.toLowerCase()) ||
      menuItem?.item_name.toLowerCase().includes(promotionSearch.toLowerCase());
    if (!matchesSearch) return false;
    
    // Type filter
    if (promoTypeFilter !== "all" && promo.promotion_type !== promoTypeFilter) return false;
    
    // Status filter
    if (promoStatusFilter !== "all" && promo.status !== promoStatusFilter) return false;
    
    return true;
  });

  // Clear filters
  const clearMenuFilters = () => {
    setCategoryFilter("all");
    setPriceRange("all");
  };

  const clearPromoFilters = () => {
    setPromoTypeFilter("all");
    setPromoStatusFilter("all");
  };

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
            {/* Filter Button */}
            <button
              onClick={() => setShowMenuFilters(!showMenuFilters)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-full text-sm transition-colors ${
                showMenuFilters || menuFilterCount > 0
                  ? "bg-amber-400 border-amber-400 text-white"
                  : "border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Filter size={16} />
              Filter
              {menuFilterCount > 0 && (
                <span className="bg-white text-amber-500 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {menuFilterCount}
                </span>
              )}
            </button>
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
        
        {/* Menu Filter Panel */}
        {showMenuFilters && (
          <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex flex-wrap items-center gap-4">
            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as MenuCategory | "all")}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-amber-400"
              >
                <option value="all">All Categories</option>
                {MENU_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Price:</span>
              <select
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value as typeof priceRange)}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-amber-400"
              >
                <option value="all">All Prices</option>
                <option value="under10">Under $10</option>
                <option value="10to20">$10 - $20</option>
                <option value="20to50">$20 - $50</option>
                <option value="over50">Over $50</option>
              </select>
            </div>

            {/* Clear Filters */}
            {menuFilterCount > 0 && (
              <button
                onClick={clearMenuFilters}
                className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 ml-auto"
              >
                <X size={14} />
                Clear filters
              </button>
            )}
          </div>
        )}
        
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
            {/* Filter Button */}
            <button
              onClick={() => setShowPromoFilters(!showPromoFilters)}
              className={`flex items-center gap-2 px-4 py-2 border rounded-full text-sm transition-colors ${
                showPromoFilters || promoFilterCount > 0
                  ? "bg-amber-400 border-amber-400 text-white"
                  : "border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
            >
              <Filter size={16} />
              Filter
              {promoFilterCount > 0 && (
                <span className="bg-white text-amber-500 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {promoFilterCount}
                </span>
              )}
            </button>
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

        {/* Promotion Filter Panel */}
        {showPromoFilters && (
          <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex flex-wrap items-center gap-4">
            {/* Type Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Type:</span>
              <select
                value={promoTypeFilter}
                onChange={(e) => setPromoTypeFilter(e.target.value as PromotionType | "all")}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-amber-400"
              >
                <option value="all">All Types</option>
                <option value="restaurant">Restaurant Promo</option>
                <option value="menu_discount">Menu Discount</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Status:</span>
              <select
                value={promoStatusFilter}
                onChange={(e) => setPromoStatusFilter(e.target.value as typeof promoStatusFilter)}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-amber-400"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="scheduled">Scheduled</option>
                <option value="expired">Expired</option>
              </select>
            </div>

            {/* Clear Filters */}
            {promoFilterCount > 0 && (
              <button
                onClick={clearPromoFilters}
                className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 ml-auto"
              >
                <X size={14} />
                Clear filters
              </button>
            )}
          </div>
        )}

        <div className={`flex gap-5 pb-4 ${showAllPromotions ? "flex-wrap" : "overflow-x-auto"}`}>
          {displayedPromotions.length > 0 ? (
            displayedPromotions.map((promo) => (
              <PromotionCard
                key={promo.id}
                promotion={promo}
                menuItem={promo.menu_item_id ? getMenuItemById(promo.menu_item_id) : undefined}
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
