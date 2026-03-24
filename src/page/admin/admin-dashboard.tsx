import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebase";

// Stat Card Component
function StatCard({
  label,
  count,
  loading,
  subtitle,
}: {
  label: string;
  count: number;
  loading?: boolean;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <span className="text-sm font-medium text-gray-700 mb-2">{label}</span>
      <div className="bg-amber-400 rounded-xl px-8 py-4 shadow-md min-w-[160px]">
        {loading ? (
          <div className="h-8 w-24 bg-amber-200 animate-pulse rounded" />
        ) : (
          <span className="text-3xl font-bold text-white">{count}</span>
        )}
      </div>
      {subtitle && <div className="text-xs text-gray-500 mt-2">{subtitle}</div>}
    </div>
  );
}

// Chart Card Component
function ChartCard({
  title,
  data,
  color,
  gradientId,
  total,
}: {
  title: string;
  data: { year: string; value: number }[];
  color: string;
  gradientId: string;
  total: number;
}) {
  const hasData = data && data.length > 0 && data.some((d) => d.value > 0);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <div className="text-right">
          <div className="text-sm font-semibold text-gray-700">{total}</div>
          <div className="text-xs text-gray-400">Last 4 years</div>
        </div>
      </div>

      <div className="flex items-center">
        <div className="mr-2">
          <button className="text-amber-500 hover:text-amber-600 self-center mr-2" aria-label={`Previous ${title}`}>
            <ChevronLeft size={20} />
          </button>
        </div>

        <div className="flex-1">
          {hasData ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={data}>
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={color} stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6B7280" }} />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke={color} strokeWidth={2} fill={`url(#${gradientId})`} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-40 flex items-center justify-center text-sm text-gray-400 bg-gray-50 rounded">
              No data available for this period
            </div>
          )}
        </div>

        <div className="flex flex-col items-center justify-between ml-2">
          <button className="text-amber-500 hover:text-amber-600" aria-label={`Next ${title}`}>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [usersCount, setUsersCount] = useState(0);
  const [restaurantsCount, setRestaurantsCount] = useState(0);
  const [requestsCount, setRequestsCount] = useState(0);

  const [userChartData, setUserChartData] = useState<{ year: string; value: number }[]>([]);
  const [restaurantChartData, setRestaurantChartData] = useState<{
    year: string;
    value: number;
  }[]>([]);

  useEffect(() => {
    // Helper: build yearly data for last N years
    const buildYearlyData = (docs: any[], yearsCount = 4) => {
      const now = new Date();
      const startYear = now.getFullYear() - (yearsCount - 1);
      const years: string[] = [];
      const counts: Record<string, number> = {};
      for (let i = 0; i < yearsCount; i++) {
        const y = startYear + i;
        years.push(String(y));
        counts[String(y)] = 0;
      }

      for (const d of docs) {
        const data = d.data ? d.data() : d;
        let createdAtMillis: number | undefined;
        if (data?.createdAt?.toMillis) createdAtMillis = data.createdAt.toMillis();
        else if (typeof data?.createdAt === "number") createdAtMillis = data.createdAt;
        else if (typeof data?.createdAt === "string") createdAtMillis = Date.parse(data.createdAt);

        if (!createdAtMillis) continue;
        const yr = new Date(createdAtMillis).getFullYear();
        const yrStr = String(yr);
        if (yrStr in counts) counts[yrStr] += 1;
      }

      return years.map((y) => ({ year: y, value: counts[y] || 0 }));
    };

    // Users listener
    const unsubUsers = onSnapshot(collection(db, "users"), (snap) => {
      setUsersCount(snap.size);
      setUserChartData(buildYearlyData(snap.docs, 4));
    });

    // Restaurants listener
    const unsubRestaurants = onSnapshot(collection(db, "restaurants"), (snap) => {
      setRestaurantsCount(snap.size);
      setRestaurantChartData(buildYearlyData(snap.docs, 4));
    });

    // Restaurant requests listener
    const unsubRequests = onSnapshot(collection(db, "restaurantRequests"), (snap) => {
      setRequestsCount(snap.size);
    });

    return () => {
      unsubUsers();
      unsubRestaurants();
      unsubRequests();
    };
  }, []);

  const userTotal = userChartData.reduce((s, it) => s + it.value, 0);
  const restaurantTotal = restaurantChartData.reduce((s, it) => s + it.value, 0);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-8">DashBoard</h1>

      {/* Stat Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard label="Total User" count={usersCount} />
        <StatCard label="Total Restaurant" count={restaurantsCount} />
        <StatCard label="Total Request" count={requestsCount} />
      </div>

      {/* Summary Section */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Summary</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Chart */}
        <ChartCard
          title="User"
          data={userChartData}
          color="#8B5CF6"
          gradientId="userGradient"
          total={userTotal}
        />

        {/* Restaurant Chart */}
        <ChartCard
          title="Restaurant"
          data={restaurantChartData}
          color="#F59E0B"
          gradientId="restaurantGradient"
          total={restaurantTotal}
        />
      </div>
    </div>
  );
}
