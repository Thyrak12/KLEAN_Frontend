import { useState } from "react";
import {
  Search,
  Users,
  X,
  CalendarDays,
  ChevronDown,
  Clock,
} from "lucide-react";

/* ───────── types ───────── */
type TabKey = "find" | "schedule" | "history";

interface Reservation {
  id: number;
  guest: string;
  phone: string;
  guests: number;
  table: string;
  description: string;
  status: string;
  date: string;
  time: string;
}

/* ───────── mock data ───────── */
const allStatuses = ["Accepted", "Pending", "Rejected", "Completed"];

const statusColors: Record<string, string> = {
  Accepted: "bg-amber-400",
  Pending: "bg-blue-400",
  Rejected: "bg-red-400",
  Completed: "bg-green-500",
};

const mockReservations: Reservation[] = [
  {
    id: 1,
    guest: "Andrew Salgado",
    phone: "+855 12345678",
    guests: 5,
    table: "T 10",
    description: "Birthday celebration",
    status: "Accepted",
    date: "2026-02-14",
    time: "18:00 - 20:00",
  },
  {
    id: 2,
    guest: "Sokha Ly",
    phone: "+855 98765432",
    guests: 2,
    table: "T 3",
    description: "Business meeting",
    status: "Pending",
    date: "2026-02-15",
    time: "12:00 - 13:30",
  },
  {
    id: 3,
    guest: "Maria Chen",
    phone: "+855 77788899",
    guests: 8,
    table: "T 15",
    description: "Family dinner",
    status: "Completed",
    date: "2026-02-10",
    time: "19:00 - 21:00",
  },
  {
    id: 4,
    guest: "John Smith",
    phone: "+855 11223344",
    guests: 3,
    table: "T 7",
    description: "Casual lunch",
    status: "Rejected",
    date: "2026-02-12",
    time: "11:30 - 13:00",
  },
  {
    id: 5,
    guest: "Dara Pich",
    phone: "+855 99887766",
    guests: 4,
    table: "T 5",
    description: "Anniversary",
    status: "Accepted",
    date: "2026-02-20",
    time: "18:30 - 20:30",
  },
];

/* ───────── tab definition ───────── */
const tabs: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: "find", label: "Find Reservation", icon: Search },
  { key: "schedule", label: "Reservation Schedule", icon: Users },
  { key: "history", label: "Reservation History", icon: Users },
];

/* ═══════════════════════════════════════════
   Component
   ═══════════════════════════════════════════ */
export default function Reservation() {
  const [activeTab, setActiveTab] = useState<TabKey>("find");

  /* ── filter state ── */
  const [guest, setGuest] = useState("");
  const [phone, setPhone] = useState("");
  const [guestsCount, setGuestsCount] = useState("");
  const [table, setTable] = useState("");
  const [description, setDescription] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  /* ── results ── */
  const [results, setResults] = useState<Reservation[] | null>(null);

  /* ── helpers ── */
  const toggleStatus = (s: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const removeStatus = (s: string) =>
    setSelectedStatuses((prev) => prev.filter((x) => x !== s));

  const clearFilters = () => {
    setGuest("");
    setPhone("");
    setGuestsCount("");
    setTable("");
    setDescription("");
    setSelectedStatuses([]);
    setDate("");
    setTime("");
    setResults(null);
  };

  const handleSearch = () => {
    const filtered = mockReservations.filter((r) => {
      if (guest && !r.guest.toLowerCase().includes(guest.toLowerCase()))
        return false;
      if (phone && !r.phone.includes(phone)) return false;
      if (guestsCount && r.guests !== Number(guestsCount)) return false;
      if (table && !r.table.toLowerCase().includes(table.toLowerCase()))
        return false;
      if (
        description &&
        !r.description.toLowerCase().includes(description.toLowerCase())
      )
        return false;
      if (
        selectedStatuses.length > 0 &&
        !selectedStatuses.includes(r.status)
      )
        return false;
      if (date && r.date !== date) return false;
      return true;
    });
    setResults(filtered);
  };

  /* ═══════════════════ render ═══════════════════ */
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      {/* Title */}
      <div className="text-3xl font-bold text-gray-900 mb-6">Reservation</div>

      {/* ── Tabs ── */}
      <div className="flex gap-4 mb-6">
        {tabs.map(({ key, label, icon: Icon }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex flex-col items-center justify-center gap-2 w-44 py-4 rounded-2xl border transition-all ${
                isActive
                  ? "bg-amber-400 text-white border-amber-400 shadow-md"
                  : "bg-white text-gray-600 border-gray-200 hover:border-amber-300 hover:bg-amber-50"
              }`}
            >
              <Icon size={28} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-sm font-semibold">{label}</span>
            </button>
          );
        })}
      </div>

      {/* ── Tab content ── */}
      {activeTab === "find" && (
        <>
          {/* Filter Card */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Filter</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-5">
              {/* Guest */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Guest
                </label>
                <input
                  type="text"
                  value={guest}
                  onChange={(e) => setGuest(e.target.value)}
                  placeholder="Andrew Salgado"
                  className="w-full rounded-lg bg-amber-50 border-none px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="5"
                  className="w-full rounded-lg bg-amber-50 border-none px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              {/* Phone number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Phone number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+855 *********"
                  className="w-full rounded-lg bg-amber-50 border-none px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Status
                </label>
                <div className="relative">
                  <div
                    onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                    className="w-full rounded-lg bg-amber-50 px-4 py-3 text-sm text-gray-800 cursor-pointer flex items-center gap-2 flex-wrap min-h-[44px]"
                  >
                    {selectedStatuses.map((s) => (
                      <span
                        key={s}
                        className={`inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-xs font-semibold text-white ${statusColors[s]}`}
                      >
                        {s}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeStatus(s);
                          }}
                          className="hover:opacity-80"
                        >
                          <X size={12} />
                        </button>
                      </span>
                    ))}
                    <ChevronDown
                      size={16}
                      className="ml-auto text-gray-500 flex-shrink-0"
                    />
                  </div>

                  {showStatusDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg py-1">
                      {allStatuses.map((s) => (
                        <button
                          key={s}
                          onClick={() => toggleStatus(s)}
                          className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center gap-2 ${
                            selectedStatuses.includes(s)
                              ? "bg-amber-50 text-amber-700 font-medium"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <span
                            className={`w-2.5 h-2.5 rounded-full ${statusColors[s]}`}
                          />
                          {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Guests */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Guests
                </label>
                <input
                  type="number"
                  value={guestsCount}
                  onChange={(e) => setGuestsCount(e.target.value)}
                  placeholder="5"
                  className="w-full rounded-lg bg-amber-50 border-none px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              {/* empty spacer for alignment */}
              <div />

              {/* Table */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Table
                </label>
                <input
                  type="text"
                  value={table}
                  onChange={(e) => setTable(e.target.value)}
                  placeholder="T 10"
                  className="w-full rounded-lg bg-amber-50 border-none px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>

              {/* Date & Time row */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full rounded-lg bg-amber-50 border-none px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400 appearance-none"
                    />
                    <CalendarDays
                      size={16}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                    />
                  </div>
                </div>

                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Time
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      placeholder="HH.MM - HH.MM"
                      className="w-full rounded-lg bg-amber-50 border-none px-4 py-3 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                    <Clock
                      size={16}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={clearFilters}
                className="px-8 py-2.5 rounded-full border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Clear
              </button>
              <button
                onClick={handleSearch}
                className="px-8 py-2.5 rounded-full bg-amber-400 text-sm font-semibold text-white hover:bg-amber-500 transition-colors shadow-sm"
              >
                Search
              </button>
            </div>
          </div>

          {/* Search Results */}
          {results !== null && (
            <div className="mt-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Results ({results.length})
              </h2>

              {results.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400">
                  <Search size={48} className="mx-auto mb-3 opacity-50" />
                  <p className="font-medium">No reservations found</p>
                  <p className="text-sm mt-1">Try adjusting your filters</p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
                  <table className="w-full text-sm">
                    <thead className="bg-amber-400 text-white">
                      <tr>
                        <th className="text-left px-5 py-3 font-semibold">
                          Guest
                        </th>
                        <th className="text-left px-5 py-3 font-semibold">
                          Phone
                        </th>
                        <th className="text-center px-5 py-3 font-semibold">
                          Guests
                        </th>
                        <th className="text-left px-5 py-3 font-semibold">
                          Table
                        </th>
                        <th className="text-left px-5 py-3 font-semibold">
                          Status
                        </th>
                        <th className="text-left px-5 py-3 font-semibold">
                          Date
                        </th>
                        <th className="text-left px-5 py-3 font-semibold">
                          Time
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                      {results.map((r) => (
                        <tr
                          key={r.id}
                          className="hover:bg-amber-50/40 transition-colors"
                        >
                          <td className="px-5 py-3.5 font-medium text-gray-900">
                            {r.guest}
                          </td>
                          <td className="px-5 py-3.5 text-gray-600">
                            {r.phone}
                          </td>
                          <td className="px-5 py-3.5 text-center text-gray-600">
                            {r.guests}
                          </td>
                          <td className="px-5 py-3.5 text-gray-600">
                            {r.table}
                          </td>
                          <td className="px-5 py-3.5">
                            <span
                              className={`inline-block px-3 py-0.5 rounded-full text-xs font-semibold text-white ${statusColors[r.status]}`}
                            >
                              {r.status}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-gray-600">
                            {r.date}
                          </td>
                          <td className="px-5 py-3.5 text-gray-600">
                            {r.time}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      )}

      {/* ── Reservation Schedule tab ── */}
      {activeTab === "schedule" && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Upcoming Reservations
          </h2>
          <div className="overflow-hidden rounded-2xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-amber-400 text-white">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold">Guest</th>
                  <th className="text-center px-5 py-3 font-semibold">
                    Guests
                  </th>
                  <th className="text-left px-5 py-3 font-semibold">Table</th>
                  <th className="text-left px-5 py-3 font-semibold">
                    Description
                  </th>
                  <th className="text-left px-5 py-3 font-semibold">Status</th>
                  <th className="text-left px-5 py-3 font-semibold">Date</th>
                  <th className="text-left px-5 py-3 font-semibold">Time</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {mockReservations
                  .filter(
                    (r) => r.status === "Accepted" || r.status === "Pending"
                  )
                  .map((r) => (
                    <tr
                      key={r.id}
                      className="hover:bg-amber-50/40 transition-colors"
                    >
                      <td className="px-5 py-3.5 font-medium text-gray-900">
                        {r.guest}
                      </td>
                      <td className="px-5 py-3.5 text-center text-gray-600">
                        {r.guests}
                      </td>
                      <td className="px-5 py-3.5 text-gray-600">{r.table}</td>
                      <td className="px-5 py-3.5 text-gray-600">
                        {r.description}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-block px-3 py-0.5 rounded-full text-xs font-semibold text-white ${statusColors[r.status]}`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-600">{r.date}</td>
                      <td className="px-5 py-3.5 text-gray-600">{r.time}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Reservation History tab ── */}
      {activeTab === "history" && (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Reservation History
          </h2>
          <div className="overflow-hidden rounded-2xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-amber-400 text-white">
                <tr>
                  <th className="text-left px-5 py-3 font-semibold">Guest</th>
                  <th className="text-center px-5 py-3 font-semibold">
                    Guests
                  </th>
                  <th className="text-left px-5 py-3 font-semibold">Table</th>
                  <th className="text-left px-5 py-3 font-semibold">
                    Description
                  </th>
                  <th className="text-left px-5 py-3 font-semibold">Status</th>
                  <th className="text-left px-5 py-3 font-semibold">Date</th>
                  <th className="text-left px-5 py-3 font-semibold">Time</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {mockReservations
                  .filter(
                    (r) => r.status === "Completed" || r.status === "Rejected"
                  )
                  .map((r) => (
                    <tr
                      key={r.id}
                      className="hover:bg-amber-50/40 transition-colors"
                    >
                      <td className="px-5 py-3.5 font-medium text-gray-900">
                        {r.guest}
                      </td>
                      <td className="px-5 py-3.5 text-center text-gray-600">
                        {r.guests}
                      </td>
                      <td className="px-5 py-3.5 text-gray-600">{r.table}</td>
                      <td className="px-5 py-3.5 text-gray-600">
                        {r.description}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-block px-3 py-0.5 rounded-full text-xs font-semibold text-white ${statusColors[r.status]}`}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-600">{r.date}</td>
                      <td className="px-5 py-3.5 text-gray-600">{r.time}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
