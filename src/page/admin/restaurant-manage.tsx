import { useState } from "react";
import { Search } from "lucide-react";

const mockRestaurants = [
  { id: 10001, name: "Omakase", email: "Omakase@gmail.com", phone: "0118822342" },
  { id: 10002, name: "Uncle Hai", email: "Unclehai@gmail.com", phone: "0118844322" },
  { id: 10003, name: "XiaoGe", email: "Xiaoge@gmail.com", phone: "0908652390" },
  { id: 10004, name: "Burger King", email: "burgerking@gmail.com", phone: "012003344" },
  { id: 10002, name: "Pasta Corner", email: "pastacorner@gmail.com", phone: "012009944" },
  { id: 10005, name: "Kuyteav Tep", email: "kuyteavtep@gmail.com", phone: "098667743" },
  { id: 10006, name: "Sakura buffet", email: "sakura@gmail.com", phone: "088506790" },
  { id: 10007, name: "Romdoul", email: "romdoul@gmail.com", phone: "088234433" },
  { id: 10008, name: "Khmer River", email: "khmerriver@gmail.com", phone: "097090988" },
  { id: 10009, name: "Pasta Master", email: "pastamaster@gmail.com", phone: "097880099" },
  { id: 10010, name: "Carl Jr", email: "carljr@gmail.com", phone: "077723090" },
  { id: 10011, name: "Pizza Hut", email: "pizzahut@gmail.com", phone: "088112233" },
  { id: 10012, name: "Domino", email: "domino@gmail.com", phone: "099223344" },
  { id: 10013, name: "Sushi Bar", email: "sushibar@gmail.com", phone: "077334455" },
  { id: 10014, name: "Noodle House", email: "noodlehouse@gmail.com", phone: "088445566" },
  { id: 10015, name: "Taco Bell", email: "tacobell@gmail.com", phone: "099556677" },
  { id: 10016, name: "Subway", email: "subway@gmail.com", phone: "077667788" },
  { id: 10017, name: "Popeyes", email: "popeyes@gmail.com", phone: "088778899" },
  { id: 10018, name: "Wendy's", email: "wendys@gmail.com", phone: "099889900" },
  { id: 10019, name: "Chipotle", email: "chipotle@gmail.com", phone: "077990011" },
];

const PAGE_SIZE = 10;

export default function AdminRestaurantManage() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("Newest");

  // Filter by search
  const filtered = mockRestaurants.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()) ||
      r.phone.includes(search) ||
      String(r.id).includes(search)
  );

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "Newest") return b.id - a.id;
    if (sortBy === "Oldest") return a.id - b.id;
    return a.name.localeCompare(b.name);
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated = sorted.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleRemove = (id: number) => {
    alert(`Remove restaurant ${id}`);
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
              <th className="py-3 px-4 text-left font-semibold">Restaurant ID</th>
              <th className="py-3 px-4 text-left font-semibold">Restaurant Name</th>
              <th className="py-3 px-4 text-left font-semibold">Email</th>
              <th className="py-3 px-4 text-left font-semibold">Phone Number</th>
              <th className="py-3 px-4 text-center font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((restaurant, index) => (
              <tr
                key={`${restaurant.id}-${index}`}
                className={`border-b border-gray-100 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-amber-50 transition-colors`}
              >
                <td className="py-3 px-4 text-gray-700">{restaurant.id}</td>
                <td className="py-3 px-4 text-gray-700">{restaurant.name}</td>
                <td className="py-3 px-4 text-gray-700">{restaurant.email}</td>
                <td className="py-3 px-4 text-gray-700">{restaurant.phone}</td>
                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => handleRemove(restaurant.id)}
                    className="bg-red-400 hover:bg-red-500 text-white text-xs font-semibold px-4 py-1.5 rounded-md transition-colors"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
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
    </div>
  );
}
