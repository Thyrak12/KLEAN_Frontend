import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, Star, User, Loader2 } from "lucide-react";
import { fetchReviews, type Review } from "../features/reviews/reviewService";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={22}
          strokeWidth={1.5}
          className={
            i <= rating
              ? "fill-amber-400 text-amber-400"
              : "fill-none text-amber-400"
          }
        />
      ))}
    </div>
  );
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 604800)} weeks ago`;
  return `${Math.floor(diffInSeconds / 2592000)} months ago`;
}

type SortOption = "newest" | "oldest" | "highest" | "lowest";

export default function FeedbackMonitor() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [showSortMenu, setShowSortMenu] = useState(false);

  // Fetch reviews on mount
  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    setLoading(true);
    try {
      const data = await fetchReviews();
      setReviews(data);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = reviews
    .filter(
      (f) =>
        f.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.comment.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "highest":
          return b.rating - a.rating;
        case "lowest":
          return a.rating - b.rating;
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "newest":
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  // Calculate stats
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="text-3xl font-bold text-gray-900">Feedback Monitor</div>
          {loading && <Loader2 size={24} className="text-amber-400 animate-spin" />}
        </div>

        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="flex items-center">
            {showSearch && (
              <input
                type="text"
                placeholder="Search feedback..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 mr-2 w-56 transition-all"
                autoFocus
              />
            )}
            <button
              onClick={() => {
                setShowSearch(!showSearch);
                if (showSearch) setSearchQuery("");
              }}
              className="p-2.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
            >
              <Search size={18} className="text-gray-600" />
            </button>
          </div>

          {/* Sort */}
          <div className="relative">
            <button
              onClick={() => setShowSortMenu(!showSortMenu)}
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors"
            >
              <SlidersHorizontal size={18} className="text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Sort</span>
            </button>

            {showSortMenu && (
              <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-10 py-1 overflow-hidden">
                {(
                  [
                    { value: "newest", label: "Newest First" },
                    { value: "oldest", label: "Oldest First" },
                    { value: "highest", label: "Highest Rating" },
                    { value: "lowest", label: "Lowest Rating" },
                  ] as { value: SortOption; label: string }[]
                ).map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortBy(option.value);
                      setShowSortMenu(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                      sortBy === option.value
                        ? "bg-amber-50 text-amber-700 font-medium"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">Total Reviews</div>
          <div className="text-2xl font-bold text-gray-900">{reviews.length}</div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">Average Rating</div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900">{avgRating}</span>
            <Star size={20} className="fill-amber-400 text-amber-400" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="text-sm text-gray-500 mb-1">5-Star Reviews</div>
          <div className="text-2xl font-bold text-green-600">
            {reviews.filter((r) => r.rating === 5).length}
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={48} className="text-amber-400 animate-spin" />
        </div>
      )}

      {/* Feedback List */}
      {!loading && (
        <div className="space-y-4">
          {filtered.map((review) => (
            <div
              key={review.id}
              className="bg-white border border-gray-200 rounded-2xl px-6 py-5 flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Avatar */}
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center mt-1">
                <User size={24} className="text-gray-500" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="font-semibold text-gray-900 text-base">
                    {review.user_name}
                  </span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                  {review.comment}
                </p>
              </div>

              {/* Rating & Time */}
              <div className="flex-shrink-0 flex flex-col items-end gap-1 ml-4">
                <StarRating rating={review.rating} />
                <span className="text-xs text-gray-500 mt-1">
                  {formatTimeAgo(new Date(review.createdAt))}
                </span>
              </div>
            </div>
          ))}

          {filtered.length === 0 && !loading && (
            <div className="text-center py-16 text-gray-400">
              <Search size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No feedback found</p>
              <p className="text-sm mt-1">
                {reviews.length === 0 
                  ? "Click 'Seed Reviews' to add sample data"
                  : "Try a different search term"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
