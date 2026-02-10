import { useState } from "react";
import { Search, SlidersHorizontal, Star, User } from "lucide-react";

interface Feedback {
  id: number;
  name: string;
  views: string;
  comment: string;
  rating: number;
  timeAgo: string;
}

const feedbackData: Feedback[] = [
  {
    id: 1,
    name: "Prak lavymanavid",
    views: "188 views",
    comment:
      "Nice place to pick up Tube Coffee — same consistent taste you'd expect anywhere else.",
    rating: 3,
    timeAgo: "a month ago",
  },
  {
    id: 2,
    name: "Chanrat",
    views: "10m views",
    comment: "Amazon !!!",
    rating: 5,
    timeAgo: "2 months ago",
  },
  {
    id: 3,
    name: "Thyrak",
    views: "368 views",
    comment:
      "Great cafe, I love the taste. The place to sit is a bit small for long sit or work might be noisy.",
    rating: 4,
    timeAgo: "a few weeks ago",
  },
  {
    id: 4,
    name: "Chheng hab smos",
    views: "1k views",
    comment: "Best Coffee in town!\nFast, Affordable and Convenient.",
    rating: 4,
    timeAgo: "a day ago",
  },
  {
    id: 5,
    name: "Panha on the mix",
    views: "268 views",
    comment:
      "Very good place to study. But the table is abit to small only good for 1 person each.",
    rating: 4,
    timeAgo: "two days ago",
  },
  {
    id: 6,
    name: "Youdy",
    views: "302 views",
    comment:
      "Good covid safety measures are in place. Good air conditioning, and plenty of space. I had the carrot juice with Apple and it was very sweet and refreshing.",
    rating: 5,
    timeAgo: "a second ago",
  },
];

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

type SortOption = "newest" | "oldest" | "highest" | "lowest";

export default function FeedbackMonitor() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [showSortMenu, setShowSortMenu] = useState(false);

  const filtered = feedbackData
    .filter(
      (f) =>
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.comment.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "highest":
          return b.rating - a.rating;
        case "lowest":
          return a.rating - b.rating;
        case "oldest":
          return a.id - b.id;
        case "newest":
        default:
          return b.id - a.id;
      }
    });

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="text-3xl font-bold text-gray-900">Feedback Monitor</div>

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

      {/* Feedback List */}
      <div className="space-y-4">
        {filtered.map((feedback) => (
          <div
            key={feedback.id}
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
                  {feedback.name}
                </span>
                <span className="text-xs font-medium text-orange-500">
                  {feedback.views}
                </span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                {feedback.comment}
              </p>
            </div>

            {/* Rating & Time */}
            <div className="flex-shrink-0 flex flex-col items-end gap-1 ml-4">
              <StarRating rating={feedback.rating} />
              <span className="text-xs text-gray-500 mt-1">
                {feedback.timeAgo}
              </span>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <Search size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No feedback found</p>
            <p className="text-sm mt-1">Try a different search term</p>
          </div>
        )}
      </div>
    </div>
  );
}
