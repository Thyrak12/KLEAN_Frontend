import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { getAllRestaurantsForAdmin, deleteRestaurant } from "../../features/restaurant/restaurantService";
import type { RestaurantListItem } from "../../types/restaurant";

const PAGE_SIZE = 10;

export default function AdminRestaurantManage() {
  const [restaurants, setRestaurants] = useState<RestaurantListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("Newest");

  // Fetch restaurants from Firestore
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getAllRestaurantsForAdmin();
        setRestaurants(data);
      } catch (err: any) {
        console.error("Failed to load restaurants:", err);
        const firebaseError = err as { code?: string; message?: string };
        setError(
          firebaseError.code
            ? `Failed to load restaurants (${firebaseError.code}): ${firebaseError.message}`
            : "Failed to load restaurants. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []);

  // Filter by search
  const filtered = restaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.phone.includes(search) ||
      r.address.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase())
  );

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "Newest") return b.id.localeCompare(a.id);
    if (sortBy === "Oldest") return a.id.localeCompare(b.id);
    return a.name.localeCompare(b.name);
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated = sorted.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleRemove = async (id: string) => {
    if (!confirm(`Are you sure you want to remove restaurant "${restaurants.find(r => r.id === id)?.name}"?`)) {
      return;
    }
    
    try {
      await deleteRestaurant(id);
      // Remove from local state
      setRestaurants(restaurants.filter(r => r.id !== id));
      alert("Restaurant removed successfully");
    } catch (err) {
      console.error("Error removing restaurant:", err);
      alert("Failed to remove restaurant. Please try again.");
    }
  };

  // Build page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      for (
        let i = Math.max(2, currentPage - 1);
        i <= Math.min(totalPages - 1, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Restaurant Management
      </h1>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400"></div>
          <p className="mt-4 text-gray-600">Loading restaurants...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Main Content */}
      {!loading && !error && (
        <>
          {/* Search & Sort Row */}
          <div className="flex items-center justify-between mb-6">
            {/* Search */}
            <div className="relative w-80">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search for restaurant"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Sort by :</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
              >
                <option>Newest</option>
                <option>Oldest</option>
                <option>Name</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-amber-400 text-white">
                  <th className="py-3 px-4 text-left font-semibold">Order</th>
                  <th className="py-3 px-4 text-left font-semibold">Restaurant Name</th>
                  <th className="py-3 px-4 text-left font-semibold">Email</th>
                  <th className="py-3 px-4 text-left font-semibold">Phone Number</th>
                  <th className="py-3 px-4 text-left font-semibold">Category</th>
                  <th className="py-3 px-4 text-left font-semibold">Address</th>
                  <th className="py-3 px-4 text-left font-semibold">Joined Date</th>
                  <th className="py-3 px-4 text-center font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-500">
                      No restaurants found
                    </td>
                  </tr>
                ) : (
                  paginated.map((restaurant, index) => (
                    <tr
                      key={restaurant.id}
                      className={`border-b border-gray-100 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-amber-50 transition-colors`}
                    >
                      <td className="py-3 px-4 text-gray-700 text-xs">{(currentPage - 1) * PAGE_SIZE + index + 1}</td>
                      <td className="py-3 px-4 text-gray-700">{restaurant.name}</td>
                      <td className="py-3 px-4 text-gray-700">{restaurant.email || "N/A"}</td>
                      <td className="py-3 px-4 text-gray-700">{restaurant.phone}</td>
                      <td className="py-3 px-4 text-gray-700">{restaurant.category || "N/A"}</td>
                      <td className="py-3 px-4 text-gray-700">{restaurant.address || "N/A"}</td>
                      <td className="py-3 px-4 text-gray-700">
                        {restaurant.createdAt ? new Date(restaurant.createdAt).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => handleRemove(restaurant.id)}
                          className="bg-red-400 hover:bg-red-500 text-white text-xs font-semibold px-4 py-1.5 rounded-md transition-colors"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-end mt-4 gap-1">
            {getPageNumbers().map((page, idx) =>
              page === "..." ? (
                <span key={`dots-${idx}`} className="px-2 text-gray-400 text-sm">
                  ...
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page as number)}
                  className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                    currentPage === page
                      ? "bg-amber-400 text-white"
                      : "text-gray-600 hover:bg-amber-100"
                  }`}
                >
                  {page}
                </button>
              )
            )}
          </div>
        </>
      )}
    </div>
  );
}
