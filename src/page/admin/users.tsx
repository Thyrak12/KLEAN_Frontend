import { useEffect, useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../config/firebase";

interface AdminUser {
  id: string;
  firstName: string;
  email: string;
  role: string;
  createdAt?: number;
}

const PAGE_SIZE = 11;

export default function AdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("Newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);

        const querySnapshot = await getDocs(collection(db, "users"));
        const fetchedUsers: AdminUser[] = querySnapshot.docs.map((docSnap) => {
          const data = docSnap.data() as {
            displayName?: string;
            firstName?: string;
            name?: string;
            username?: string;
            email?: string;
            role?: string;
            createdAt?: { toMillis?: () => number } | string | number;
          };

          const resolvedCreatedAt =
            typeof data.createdAt === "number"
              ? data.createdAt
              : typeof data.createdAt === "string"
                ? Date.parse(data.createdAt)
                : data.createdAt?.toMillis?.();

          return {
            id: docSnap.id,
            firstName:
              data.displayName ||
              data.firstName ||
              data.name ||
              data.username ||
              data.email?.split("@")[0] ||
              "Unknown",
            email: data.email || "-",
            role: data.role || "unknown",
            createdAt: Number.isNaN(resolvedCreatedAt) ? 0 : resolvedCreatedAt,
          };
        });

        setUsers(fetchedUsers);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        const firebaseError = err as { code?: string; message?: string };
        setError(
          `Failed to load users${firebaseError.code ? ` (${firebaseError.code})` : ""}: ${firebaseError.message ?? "Unknown error"}`
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter
  const filtered = users.filter(
    (u) =>
      u.firstName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  // Sort
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "Newest") return (b.createdAt || 0) - (a.createdAt || 0);
    if (sortBy === "Oldest") return (a.createdAt || 0) - (b.createdAt || 0);
    return a.firstName.localeCompare(b.firstName);
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated = sorted.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleRemove = (id: string) => {
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

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      {loading && (
        <div className="mb-4 p-3 bg-gray-100 text-gray-600 rounded text-sm">
          Loading users...
        </div>
      )}

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
              <th className="py-3 px-6 text-left font-semibold">Role</th>
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
                <td className="py-3 px-6 text-gray-700 capitalize">{user.role.replaceAll("_", " ")}</td>
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
