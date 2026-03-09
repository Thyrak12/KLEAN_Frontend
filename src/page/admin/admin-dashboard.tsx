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

// Mock data for User chart
const userData = [
  { year: "2016", value: 50 },
  { year: "2017", value: 120 },
  { year: "2018", value: 80 },
  { year: "2019", value: 400 },
];

// Mock data for Restaurant chart
const restaurantData = [
  { year: "2016", value: 30 },
  { year: "2017", value: 60 },
  { year: "2018", value: 100 },
  { year: "2019", value: 450 },
];

// Stat Card Component
function StatCard({ label, count }: { label: string; count: number }) {
  return (
    <div className="flex flex-col items-center">
      <span className="text-sm font-medium text-gray-700 mb-2">{label}</span>
      <div className="bg-amber-400 rounded-xl px-16 py-4 shadow-md">
        <span className="text-3xl font-bold text-white">{count}</span>
      </div>
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
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>
      <div className="flex">
        {/* Left arrow */}
        <button className="text-amber-500 hover:text-amber-600 self-center mr-2">
          <ChevronLeft size={24} />
        </button>

        {/* Chart */}
        <div className="flex-1">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={true}
                vertical={false}
                stroke="#E5E7EB"
              />
              <XAxis
                dataKey="year"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6B7280" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6B7280" }}
                ticks={[0, 200, 400]}
                domain={[0, 500]}
              />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="value"
                stroke={color}
                strokeWidth={2}
                fill={`url(#${gradientId})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Right arrow and Total */}
        <div className="flex flex-col items-center justify-between ml-2">
          <span className="text-xs text-gray-500">Total</span>
          <button className="text-amber-500 hover:text-amber-600">
            <ChevronRight size={24} />
          </button>
          <div className="text-right">
            <div className="text-sm font-semibold text-gray-700">{total}</div>
            <div className="text-xs text-gray-400">400</div>
            <div className="text-xs text-gray-400">200</div>
            <div className="text-xs text-gray-400">0</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-8">DashBoard</h1>

      {/* Stat Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard label="Total User" count={30} />
        <StatCard label="Total Restaurant" count={10} />
        <StatCard label="Total Request" count={20} />
      </div>

      {/* Summary Section */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Summary</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Chart */}
        <ChartCard
          title="User"
          data={userData}
          color="#8B5CF6"
          gradientId="userGradient"
          total={707}
        />

        {/* Restaurant Chart */}
        <ChartCard
          title="Restaurant"
          data={restaurantData}
          color="#F59E0B"
          gradientId="restaurantGradient"
          total={707}
        />
      </div>
    </div>
  );
}
