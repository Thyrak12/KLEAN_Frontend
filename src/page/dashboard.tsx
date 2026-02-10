import TotalMenu from "../components/totalmanu";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

// Mock data for the area chart (Food Popularity)
const foodPopularityData = [
  { year: "2016", Micha: 80, Baycha: 120, Pizza: 200 },
  { year: "2017", Micha: 100, Baycha: 180, Pizza: 280 },
  { year: "2018", Micha: 140, Baycha: 220, Pizza: 350 },
  { year: "2019", Micha: 180, Baycha: 300, Pizza: 707 },
];

// Mock data for the donut chart (Reviews / Projects by account)
const reviewsData = [
  { name: "KFC", value: 25 },
  { name: "FIAT-Chrysler LLC", value: 20 },
  { name: "KLM", value: 15 },
  { name: "Aeroflot", value: 12 },
  { name: "Lukoil", value: 10 },
  { name: "American Express", value: 10 },
  { name: "Daimler", value: 8 },
];

const DONUT_COLORS = [
  "#E53935", // KFC - red
  "#8E24AA", // FIAT - purple
  "#FDD835", // KLM - yellow
  "#43A047", // Aeroflot - green
  "#1E88E5", // Lukoil - blue
  "#FB8C00", // American Express - orange
  "#00ACC1", // Daimler - teal
];

export default function Dashboard() {
  return (
    <div className="max-h-screen bg-gray-100 p-6">
      {/* Title */}
      <div className="text-3xl font-bold text-gray-900 mb-8">DashBoard</div>

      {/* Stat Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <TotalMenu label="Total Menu" count={30} />
        <TotalMenu label="Total Promotion" count={10} />
        <TotalMenu label="Total Rating" count={4.5} />
      </div>

      {/* Summary Section */}
      <h2 className="text-xl font-bold text-gray-900 mb-4">Summary</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Food Popularity Area Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Food Popularity
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={foodPopularityData}>
              <defs>
                <linearGradient id="colorPizza" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorBaycha" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F97316" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#F97316" stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="colorMicha" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="year" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="Pizza"
                stackId="1"
                stroke="#3B82F6"
                fill="url(#colorPizza)"
              />
              <Area
                type="monotone"
                dataKey="Baycha"
                stackId="1"
                stroke="#F97316"
                fill="url(#colorBaycha)"
              />
              <Area
                type="monotone"
                dataKey="Micha"
                stackId="1"
                stroke="#10B981"
                fill="url(#colorMicha)"
              />
            </AreaChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className="flex items-center gap-6 mt-4 justify-center">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-orange-400 inline-block" />
              <span className="text-sm text-gray-600">Micha</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
              <span className="text-sm text-gray-600">Baycha</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500 inline-block" />
              <span className="text-sm text-gray-600">Pizza</span>
            </div>
          </div>
        </div>

        {/* Reviews Donut Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Reviews</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={reviewsData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={2}
                dataKey="value"
              >
                {reviewsData.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={DONUT_COLORS[index % DONUT_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend
                layout="horizontal"
                verticalAlign="bottom"
                align="center"
                iconType="circle"
                iconSize={10}
                formatter={(value: string) => (
                  <span className="text-sm text-gray-600">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}