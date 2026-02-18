import { useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";

const mockUsers = [
  { id: 10001, firstName: "Chanrat", email: "Chanrat@gmail.com" },
  { id: 10002, firstName: "Jonhson", email: "Jonhson@gmail.com" },
  { id: 10003, firstName: "Thyrak", email: "Thyrak@gmail.com" },
  { id: 10004, firstName: "Panha", email: "Panha@gmail.com" },
  { id: 10005, firstName: "Youdy", email: "Youdy@gmail.com" },
  { id: 10006, firstName: "Chhenghab", email: "Chhenghab@gmail.com" },
  { id: 10007, firstName: "Navid", email: "Navid@gmail.com" },
  { id: 10008, firstName: "Jonathan", email: "Jonathan@gmail.com" },
  { id: 10009, firstName: "Alexa", email: "Alexa@gmail.com" },
  { id: 10010, firstName: "Sok", email: "Sok@gmail.com" },
  { id: 10011, firstName: "Sovan", email: "Sovan@gmail.com" },
  { id: 10012, firstName: "Dara", email: "Dara@gmail.com" },
  { id: 10013, firstName: "Mony", email: "Mony@gmail.com" },
  { id: 10014, firstName: "Visal", email: "Visal@gmail.com" },
  { id: 10015, firstName: "Pisey", email: "Pisey@gmail.com" },
  { id: 10016, firstName: "Rith", email: "Rith@gmail.com" },
  { id: 10017, firstName: "Srey", email: "Srey@gmail.com" },
  { id: 10018, firstName: "Nary", email: "Nary@gmail.com" },
  { id: 10019, firstName: "Kanha", email: "Kanha@gmail.com" },
  { id: 10020, firstName: "Bopha", email: "Bopha@gmail.com" },
  { id: 10021, firstName: "Kosal", email: "Kosal@gmail.com" },
  { id: 10022, firstName: "Leap", email: "Leap@gmail.com" },
];

const PAGE_SIZE = 11;

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("Newest");

  // Filter
  const filtered = mockUsers.filter(
    (u) =>
      u.firstName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      String(u.id).includes(search)
  );

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "Newest") return b.id - a.id;
    if (sortBy === "Oldest") return a.id - b.id;
    return a.firstName.localeCompare(b.firstName);
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated = sorted.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleRemove = (id: number) => {
    alert(`Remove user ${id}`);
  };

  // Build page numbers
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
        User Management
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
            placeholder="Search for user"
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
          <span className="text-sm text-gray-500">Short by :</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm bg-white font-semibold focus:outline-none focus:ring-2 focus:ring-amber-400"
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
              <th className="py-3 px-6 text-left font-semibold">User ID</th>
              <th className="py-3 px-6 text-left font-semibold">First Name</th>
              <th className="py-3 px-6 text-left font-semibold">Email</th>
              <th className="py-3 px-6 text-center font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((user, index) => (
              <tr
                key={`${user.id}-${index}`}
                className={`border-b border-gray-100 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-amber-50 transition-colors`}
              >
                <td className="py-3 px-6 text-gray-700">{user.id}</td>
                <td className="py-3 px-6 text-gray-700">{user.firstName}</td>
                <td className="py-3 px-6 text-gray-700">{user.email}</td>
                <td className="py-3 px-6 text-center">
                  <button
                    onClick={() => handleRemove(user.id)}
                    className="border border-red-400 text-red-400 hover:bg-red-400 hover:text-white text-xs font-semibold px-4 py-1 rounded transition-colors"
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
        {/* Previous */}
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className="w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-600 disabled:opacity-30"
        >
          <ChevronLeft size={16} />
        </button>

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

        {/* Next */}
        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-md text-gray-400 hover:text-gray-600 disabled:opacity-30"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
