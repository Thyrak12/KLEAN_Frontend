import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../features/auth/AuthContext";
import { useMenu } from "../features/menu/MenuContext";
import { getRestaurantById } from "../features/restaurant/restaurantService";
import { fetchReviews, type Review } from "../features/reviews/reviewService";
import { MENU_CATEGORIES } from "../types/menu";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Store,
  UtensilsCrossed,
  Megaphone,
  Star,
  MessageSquare,
  TrendingUp,
  Loader2,
} from "lucide-react";

const RATING_COLORS = ["#FDE68A", "#FCD34D", "#FBBF24", "#F59E0B", "#D97706"];

function StatCard({
  label,
  value,
  icon: Icon,
  sub,
}: {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  sub?: string;
}) {
  return (
    <div className="rounded-2xl border border-amber-100 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <div className="rounded-xl bg-amber-100 p-2 text-amber-700">
          <Icon size={18} />
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      {sub && <p className="mt-1 text-xs text-gray-500">{sub}</p>}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const { menuItems, promotions, loading: menuLoading } = useMenu();

  const [restaurantName, setRestaurantName] = useState("Your Restaurant");
  const [restaurantCategory, setRestaurantCategory] = useState("Restaurant");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadRestaurantInfo = async () => {
      if (!user?.uid) return;
      try {
        const restaurant = await getRestaurantById(user.uid);
        if (!isMounted || !restaurant) return;
        setRestaurantName(restaurant.restaurantName || "Your Restaurant");
        setRestaurantCategory(restaurant.category || "Restaurant");
      } catch (error) {
        console.error("Failed to load restaurant profile:", error);
      }
    };

    loadRestaurantInfo();

    return () => {
      isMounted = false;
    };
  }, [user?.uid]);

  useEffect(() => {
    let isMounted = true;

    const loadReviews = async () => {
      setReviewsLoading(true);
      try {
        const data = await fetchReviews();
        if (!isMounted) return;
        setReviews(data);
      } catch (error) {
        console.error("Failed to load reviews:", error);
      } finally {
        if (isMounted) setReviewsLoading(false);
      }
    };

    if (user) {
      loadReviews();
    }

    return () => {
      isMounted = false;
    };
  }, [user]);

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return total / reviews.length;
  }, [reviews]);

  const activePromotionsCount = useMemo(() => {
    return promotions.filter((promotion) => promotion.status === "active").length;
  }, [promotions]);

  const categoryData = useMemo(() => {
    const countByCategory = new Map<string, number>();

    menuItems.forEach((item) => {
      countByCategory.set(item.category, (countByCategory.get(item.category) || 0) + 1);
    });

    return MENU_CATEGORIES.map((category) => ({
      name: category.label,
      count: countByCategory.get(category.value) || 0,
    })).filter((item) => item.count > 0);
  }, [menuItems]);

  const promotionStatusData = useMemo(() => {
    const statusCount = {
      active: 0,
      scheduled: 0,
      inactive: 0,
      expired: 0,
    };

    promotions.forEach((promotion) => {
      statusCount[promotion.status] += 1;
    });

    return [
      { name: "Active", value: statusCount.active },
      { name: "Scheduled", value: statusCount.scheduled },
      { name: "Inactive", value: statusCount.inactive },
      { name: "Expired", value: statusCount.expired },
    ].filter((item) => item.value > 0);
  }, [promotions]);

  const ratingDistribution = useMemo(() => {
    const distribution = [1, 2, 3, 4, 5].map((rating) => ({
      rating: `${rating}★`,
      count: reviews.filter((review) => Math.round(review.rating) === rating).length,
    }));
    return distribution;
  }, [reviews]);

  const isLoading = menuLoading || reviewsLoading;

  return (
    <div className="min-h-screen bg-[#faf7f2] p-6">
      <div className="mb-8 rounded-3xl border border-amber-100 bg-white p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
              <Store size={14} /> Owner Dashboard
            </p>
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Welcome back, {restaurantName}
            </h1>
            <p className="mt-2 text-gray-600">
              Manage your {restaurantCategory.toLowerCase()} menu, promotions, and customer feedback from one place.
            </p>
          </div>

          {isLoading && (
            <div className="inline-flex items-center gap-2 rounded-xl bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700">
              <Loader2 size={16} className="animate-spin" />
              Syncing latest data...
            </div>
          )}
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Menu Items"
          value={menuItems.length}
          icon={UtensilsCrossed}
          sub="Across all categories"
        />
        <StatCard
          label="Total Promotions"
          value={promotions.length}
          icon={Megaphone}
          sub={`${activePromotionsCount} currently active`}
        />
        <StatCard
          label="Average Rating"
          value={averageRating ? averageRating.toFixed(1) : "0.0"}
          icon={Star}
          sub={`${reviews.length} total reviews`}
        />
        <StatCard
          label="Customer Feedback"
          value={reviews.length}
          icon={MessageSquare}
          sub="Latest customer submissions"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Menu Composition by Category</h3>
            <span className="text-xs text-gray-500">Live from your menu</span>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={categoryData.length ? categoryData : [{ name: "No data", count: 0 }]}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} interval={0} angle={-18} textAnchor="end" height={60} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Bar dataKey="count" radius={[8, 8, 0, 0]} fill="#F5A623" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Review Rating Distribution</h3>
            <span className="text-xs text-gray-500">Based on customer feedback</span>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={ratingDistribution}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={100}
                paddingAngle={3}
                dataKey="count"
                nameKey="rating"
              >
                {ratingDistribution.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={RATING_COLORS[index % RATING_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-xs text-gray-600">
            {ratingDistribution.map((item, index) => (
              <div key={item.rating} className="inline-flex items-center gap-1.5">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: RATING_COLORS[index] }}
                />
                {item.rating}: {item.count}
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Promotion Status</h3>
            <span className="text-xs text-gray-500">Track campaign lifecycle</span>
          </div>

          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={promotionStatusData.length ? promotionStatusData : [{ name: "No data", value: 0 }]}> 
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#D97706" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Owner Insights</h3>
            <TrendingUp size={18} className="text-amber-600" />
          </div>

          <div className="space-y-4 text-sm">
            <div className="rounded-xl border border-amber-100 bg-amber-50/60 p-4">
              <p className="font-semibold text-gray-800">Top focus this week</p>
              <p className="mt-1 text-gray-600">
                {menuItems.length === 0
                  ? "Add your first menu items to improve discoverability in the customer app."
                  : `You have ${menuItems.length} menu items listed. Keep item photos and prices updated.`}
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="font-semibold text-gray-800">Promotion performance</p>
              <p className="mt-1 text-gray-600">
                {activePromotionsCount > 0
                  ? `${activePromotionsCount} promotions are active now. Consider scheduling your next campaign early.`
                  : "No active promotion right now. Launch one to increase visibility and customer conversion."}
              </p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
              <p className="font-semibold text-gray-800">Customer sentiment</p>
              <p className="mt-1 text-gray-600">
                {reviews.length > 0
                  ? `Your current average rating is ${averageRating.toFixed(1)}★ from ${reviews.length} reviews.`
                  : "No reviews yet. Encourage diners to leave feedback to build trust."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}