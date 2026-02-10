import { Plus, Pencil, Trash2, ChevronRight } from "lucide-react";



interface PromotionItem {
  id: number;
  name: string;
  originalPrice: number;
  discountedPrice: number;
  discountLabel: string;
  image: string;
}
interface MenuItem {
  id: number;
  name: string;
  price: number;
  image: string;
}

const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Noodle Soup",
    price: 10,
    image:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=300&fit=crop",
  },
  {
    id: 2,
    name: "Fried Noodle",
    price: 8,
    image:
      "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=300&h=300&fit=crop",
  },
  {
    id: 3,
    name: "Shrimp Soup",
    price: 6,
    image:
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300&h=300&fit=crop",
  },
  {
    id: 4,
    name: "Spaghetti",
    price: 7,
    image:
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=300&h=300&fit=crop",
  },
  {
    id: 5,
    name: "Grilled Chicken",
    price: 12,
    image:
      "https://images.unsplash.com/photo-1604908177520-1c1b1b1b1b1b?w=300&h=300&fit=crop",
  },
  {
    id: 6,
    name: "Beef Steak",
    price: 15,
    image:
      "https://images.unsplash.com/photo-1604908177520-1c1b1b1b1b1b?w=300&h=300&fit=crop",
  },
  {
    id: 7,
    name: "Salmon Sushi",
    price: 18,
    image:
      "https://images.unsplash.com/photo-1604908177520-1c1b1b1b1b1b?w=300&h=300&fit=crop",
  },
];



const promotionItems: PromotionItem[] = [
  {
    id: 1,
    name: "Noodle Soup",
    originalPrice: 10,
    discountedPrice: 8,
    discountLabel: "20% Off",
    image:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=300&h=300&fit=crop",
  },
  {
    id: 2,
    name: "Fried Noodle",
    originalPrice: 10,
    discountedPrice: 8,
    discountLabel: "20% Off",
    image:
      "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=300&h=300&fit=crop",
  },
  {
    id: 3,
    name: "Shrimp Soup",
    originalPrice: 10,
    discountedPrice: 8,
    discountLabel: "20% Off",
    image:
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=300&h=300&fit=crop",
  },
  {
    id: 4,
    name: "Spaghetti",
    originalPrice: 10,
    discountedPrice: 8,
    discountLabel: "20% Off",
    image:
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=300&h=300&fit=crop",
  },
];

// ── Menu Card ──────────────────────────────────────────────
function MenuCard({ item }: { item: MenuItem }) {
    
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col items-center gap-3 w-[200px]">
      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 shadow-md">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>
      <h4 className="text-base font-semibold text-gray-900 text-center">
        {item.name}
      </h4>
      <span className="text-lg font-bold text-gray-800">{item.price}$</span>
      <div className="flex items-center gap-2 mt-1">
        <button className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-white text-xs font-semibold px-3 py-1.5 rounded-md transition-colors">
          <Pencil size={13} />
          Edit
        </button>
        <button className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded-md transition-colors">
          <Trash2 size={13} />
          Delete
        </button>
      </div>
    </div>
  );
}


// ── Promotion Card ─────────────────────────────────────────
function PromotionCard({ item }: { item: PromotionItem }) {
  return (
    <div className="relative bg-white rounded-2xl shadow-sm p-5 flex flex-col items-center gap-3 w-[200px]">
      {/* Discount badge */}
      <span className="absolute top-3 left-3 bg-amber-400 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
        {item.discountLabel}
      </span>

      <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-100 shadow-md">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
        />
      </div>
      <h4 className="text-base font-semibold text-gray-900 text-center">
        {item.name}
      </h4>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-400 line-through">
          {item.originalPrice}$
        </span>
        <span className="text-lg font-bold text-gray-800">
          {item.discountedPrice}$
        </span>
      </div>
      <div className="flex items-center gap-2 mt-1">
        <button className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-500 text-white text-xs font-semibold px-3 py-1.5 rounded-md transition-colors">
          <Pencil size={13} />
          Edit
        </button>
        <button className="flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold px-3 py-1.5 rounded-md transition-colors">
          <Trash2 size={13} />
          Delete
        </button>
      </div>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────
export default function MenuPromotion() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-8">
        <div className="text-3xl font-bold text-gray-900">Menu & Promotion</div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 border-2 border-amber-400 text-gray-900 font-semibold px-5 py-2.5 rounded-full hover:bg-amber-50 transition-colors">
            Create Promotion
            <Plus size={18} />
          </button>
          <button className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-white font-semibold px-5 py-2.5 rounded-full transition-colors">
            Create Menu
            <Plus size={18} />
          </button>
        </div>
      </div>

      {/* ── Menu Section ── */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Menu</h2>
          <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors">
            View all <ChevronRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-5">
          {menuItems.map((item) => (
            <MenuCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      {/* ── Promotion Section ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Promotion</h2>
          <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 transition-colors">
            View all <ChevronRight size={16} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-5">
          {promotionItems.map((item) => (
            <PromotionCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
