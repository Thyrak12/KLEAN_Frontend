import { useState } from "react";
import { Search, ChevronLeft, ChevronRight, Check, X } from "lucide-react";

const mockRequests = [
  { id: 10002, name: "Omakase", owner: "Jack", email: "Omakase@gmail.com", phone: "0118822342" },
  { id: 10002, name: "Uncle Hai", owner: "Jack", email: "Unclehai@gmail.com", phone: "0118844322" },
  { id: 10002, name: "XiaoGe", owner: "Jack", email: "Xiaoge@gmail.com", phone: "0908652390" },
  { id: 10002, name: "Burger King", owner: "Jack", email: "burgerking@gmail.com", phone: "012003344" },
  { id: 10002, name: "Pasta Corner", owner: "Jack", email: "pastacorner@gmail.com", phone: "012009944" },
  { id: 10002, name: "Kuyteav Tep", owner: "Jack", email: "kuyteavtep@gmail.com", phone: "098667743" },
  { id: 10002, name: "Sakura buffet", owner: "Jack", email: "sakura@gmail.com", phone: "088506790" },
  { id: 10002, name: "Romdoul", owner: "Jack", email: "romdoul@gmail.com", phone: "088234433" },
  { id: 10002, name: "Khmer River", owner: "Jack", email: "khmerriver@gmail.com", phone: "097090988" },
  { id: 10002, name: "Pasta Master", owner: "Jack", email: "pastamaster@gmail.com", phone: "097880099" },
  { id: 10002, name: "Carl Jr", owner: "Jack", email: "carljr@gmail.com", phone: "077723090" },
  { id: 10002, name: "Sushi World", owner: "Jack", email: "sushiworld@gmail.com", phone: "088112233" },
  { id: 10002, name: "Noodle King", owner: "Jack", email: "noodleking@gmail.com", phone: "099223344" },
];

const PAGE_SIZE = 11;

export default function AdminRestaurantRequests() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("Newest");

  // Filter
  const filtered = mockRequests.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.owner.toLowerCase().includes(search.toLowerCase()) ||
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

  const handleAccept = (name: string) => {
    alert(`Accepted request from ${name}`);
  };

  const handleReject = (name: string) => {
    alert(`Rejected request from ${name}`);
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
        Restaurant Request
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
              <th className="py-3 px-4 text-left font-semibold text-xs">Restaurant ID</th>
              <th className="py-3 px-4 text-left font-semibold text-xs">Restaurant Name</th>
              <th className="py-3 px-4 text-left font-semibold text-xs">Owner Name</th>
              <th className="py-3 px-4 text-left font-semibold text-xs">Email</th>
              <th className="py-3 px-4 text-left font-semibold text-xs">Phone Number</th>
              <th className="py-3 px-4 text-center font-semibold text-xs">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((request, index) => (
              <tr
                key={`${request.name}-${index}`}
                className={`border-b border-gray-100 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-amber-50 transition-colors`}
              >
                <td className="py-2.5 px-4 text-gray-700 text-xs">{request.id}</td>
                <td className="py-2.5 px-4 text-gray-700 text-xs">{request.name}</td>
                <td className="py-2.5 px-4 text-gray-700 text-xs">{request.owner}</td>
                <td className="py-2.5 px-4 text-gray-700 text-xs">{request.email}</td>
                <td className="py-2.5 px-4 text-gray-700 text-xs">{request.phone}</td>
                <td className="py-2.5 px-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleAccept(request.name)}
                      className="w-7 h-7 flex items-center justify-center rounded bg-amber-400 hover:bg-amber-500 text-white transition-colors"
                      title="Accept"
                    >
                      <Check size={14} strokeWidth={3} />
                    </button>
                    <button
                      onClick={() => handleReject(request.name)}
                      className="w-7 h-7 flex items-center justify-center rounded bg-amber-400 hover:bg-red-500 text-white transition-colors"
                      title="Reject"
                    >
                      <X size={14} strokeWidth={3} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end mt-4 gap-1">
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
