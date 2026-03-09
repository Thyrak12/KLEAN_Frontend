import { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, Check, X, Eye, MapPin, Clock, Phone, Mail, User, Utensils, FileText } from "lucide-react";
import type { RestaurantRequest } from "../../types/restaurantRequest";
import {
  getRequestsByStatus,
  approveRestaurantRequest,
  rejectRestaurantRequest,
} from "../../features/restaurantRequest/restaurantRequestService";

// Extended display interface for UI
interface DisplayRequest extends RestaurantRequest {
  requestDate?: string;
  openingHours?: string;
}

const PAGE_SIZE = 11;

export default function AdminRestaurantRequests() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("Newest");
  const [selectedRequest, setSelectedRequest] = useState<DisplayRequest | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [requests, setRequests] = useState<DisplayRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch pending requests from Firestore
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        setError(null);
        const pendingRequests = await getRequestsByStatus("pending");
        setRequests(pendingRequests as DisplayRequest[]);
      } catch (err) {
        console.error("Error fetching requests:", err);
        setError("Failed to fetch restaurant requests");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const openModal = (request: DisplayRequest) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedRequest(null);
    setIsModalOpen(false);
  };

  // Filter requests
  const filtered = requests.filter(
    (r) =>
      r.restaurantName.toLowerCase().includes(search.toLowerCase()) ||
      r.ownerId.toLowerCase().includes(search.toLowerCase()) ||
      r.email?.toLowerCase().includes(search.toLowerCase()) ||
      r.phone?.includes(search) ||
      r.id?.includes(search)
  );

  // Sort requests
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "Newest")
      return (b.createdAt || 0) - (a.createdAt || 0);
    if (sortBy === "Oldest")
      return (a.createdAt || 0) - (b.createdAt || 0);
    return a.restaurantName.localeCompare(b.restaurantName);
  });

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const paginated = sorted.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleAccept = async (request: DisplayRequest) => {
    try {
      if (request.id) {
        await approveRestaurantRequest(request.id);
        alert(`Approved request from ${request.restaurantName}`);
        setRequests(requests.filter((r) => r.id !== request.id));
        closeModal();
      }
    } catch (err) {
      console.error("Error approving request:", err);
      alert("Failed to approve request");
    }
  };

  const handleReject = async (request: DisplayRequest) => {
    const reason = prompt("Enter rejection reason:");
    if (reason) {
      try {
        if (request.id) {
          await rejectRestaurantRequest(request.id, reason);
          alert(`Rejected request from ${request.restaurantName}`);
          setRequests(requests.filter((r) => r.id !== request.id));
          closeModal();
        }
      } catch (err) {
        console.error("Error rejecting request:", err);
        alert("Failed to reject request");
      }
    }
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

      {/* Error State */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading requests...</div>
        </div>
      )}

      {/* Empty State */}
      {!loading && filtered.length === 0 && !error && (
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">No pending restaurant requests</div>
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
                key={`${request.restaurantName}-${index}`}
                className={`border-b border-gray-100 ${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-amber-50 transition-colors`}
              >
                <td className="py-2.5 px-4 text-gray-700 text-xs">{request.id || "-"}</td>
                <td className="py-2.5 px-4 text-gray-700 text-xs">{request.restaurantName}</td>
                <td className="py-2.5 px-4 text-gray-700 text-xs">{request.ownerId}</td>
                <td className="py-2.5 px-4 text-gray-700 text-xs">{request.email || "-"}</td>
                <td className="py-2.5 px-4 text-gray-700 text-xs">{request.phone || "-"}</td>
                <td className="py-2.5 px-4 text-center">
                  <button
                    onClick={() => openModal(request)}
                    className="px-3 py-1.5 flex items-center justify-center gap-1.5 rounded-lg bg-amber-400 hover:bg-amber-500 text-white text-xs font-medium transition-colors"
                    title="View Details"
                  >
                    <Eye size={14} />
                    View Details
                  </button>
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

      {/* Restaurant Details Modal */}
      {isModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto m-4">
            {/* Modal Header */}
            <div className="bg-amber-400 text-white px-6 py-4 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Restaurant Request Details</h2>
                <button
                  onClick={closeModal}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-amber-500 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="text-amber-100 text-sm mt-1">Review the details before accepting or rejecting</p>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Basic Info Section */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Utensils size={20} className="text-amber-500" />
                    {selectedRequest.restaurantName}
                  </h3>
                  {selectedRequest.cuisineType && (
                    <span className="inline-block mt-1 px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                      {selectedRequest.cuisineType}
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                    <User size={14} /> Owner ID
                  </label>
                  <p className="text-sm text-gray-900 font-medium">{selectedRequest.ownerId}</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500">Request ID</label>
                  <p className="text-sm text-gray-900 font-medium">#{selectedRequest.id || "-"}</p>
                </div>

                {selectedRequest.email && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                      <Mail size={14} /> Email
                    </label>
                    <p className="text-sm text-gray-900">{selectedRequest.email}</p>
                  </div>
                )}

                {selectedRequest.phone && (
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                      <Phone size={14} /> Phone Number
                    </label>
                    <p className="text-sm text-gray-900">{selectedRequest.phone}</p>
                  </div>
                )}
              </div>

              {/* Address/Location Section */}
              <div className="border-t pt-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                    <MapPin size={14} /> Location
                  </label>
                  <p className="text-sm text-gray-900">{selectedRequest.location}</p>
                </div>
              </div>

              {/* Description Section */}
              <div className="border-t pt-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                    <FileText size={14} /> Description
                  </label>
                  <p className="text-sm text-gray-700 leading-relaxed">{selectedRequest.description}</p>
                </div>
              </div>

              {/* Additional Details */}
              {(selectedRequest.openingHours || selectedRequest.seatingCapacity) && (
                <div className="border-t pt-4 grid grid-cols-2 gap-4">
                  {selectedRequest.openingHours && (
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                        <Clock size={14} /> Opening Hours
                      </label>
                      <p className="text-sm text-gray-900">{selectedRequest.openingHours}</p>
                    </div>
                  )}

                  {selectedRequest.seatingCapacity && (
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-gray-500">Seating Capacity</label>
                      <p className="text-sm text-gray-900">{selectedRequest.seatingCapacity} seats</p>
                    </div>
                  )}

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-gray-500">Request Date</label>
                    <p className="text-sm text-gray-900">
                      {selectedRequest.createdAt
                        ? new Date(selectedRequest.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })
                        : "-"}
                    </p>
                  </div>
                </div>
              )}

              {/* Documents Section */}
              {selectedRequest.documents && selectedRequest.documents.length > 0 && (
                <div className="border-t pt-4">
                  <label className="text-xs font-medium text-gray-500 mb-2 block">Submitted Documents</label>
                  <div className="flex flex-wrap gap-2">
                    {selectedRequest.documents.map((doc, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs rounded-lg flex items-center gap-1"
                      >
                        <FileText size={12} />
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer - Action Buttons */}
            <div className="border-t px-6 py-4 flex items-center justify-end gap-3 bg-gray-50 rounded-b-2xl">
              <button
                onClick={closeModal}
                className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleReject(selectedRequest)}
                className="px-5 py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors flex items-center gap-2"
              >
                <X size={16} />
                Reject Request
              </button>
              <button
                onClick={() => handleAccept(selectedRequest)}
                className="px-5 py-2.5 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors flex items-center gap-2"
              >
                <Check size={16} />
                Accept Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
