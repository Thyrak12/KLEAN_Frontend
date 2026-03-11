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
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [requestToReject, setRequestToReject] = useState<DisplayRequest | null>(null);
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
      r.email?.toLowerCase().includes(search.toLowerCase()) ||
      r.phone?.includes(search) ||
      r.location.toLowerCase().includes(search.toLowerCase()) ||
      r.cuisineType?.toLowerCase().includes(search.toLowerCase())
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
    } catch (err: unknown) {
      console.error("Error approving request:", err);
      const firebaseError = err as { code?: string; message?: string };
      if (firebaseError?.code || firebaseError?.message) {
        alert(
          `Failed to approve request${firebaseError.code ? ` (${firebaseError.code})` : ""}: ${firebaseError.message || "Unknown error"}`
        );
      } else {
        alert("Failed to approve request");
      }
    }
  };

  const handleReject = async (request: DisplayRequest) => {
    setRequestToReject(request);
    setRejectionReason("");
    setIsRejectModalOpen(true);
  };

  const confirmReject = async () => {
    if (!rejectionReason.trim()) {
      alert("Please enter a rejection reason");
      return;
    }
    
    if (requestToReject?.id) {
      try {
        await rejectRestaurantRequest(requestToReject.id, rejectionReason);
        alert(`Rejected request from ${requestToReject.restaurantName}. Email sent to owner.`);
        setRequests(requests.filter((r) => r.id !== requestToReject.id));
        setIsRejectModalOpen(false);
        setRequestToReject(null);
        setRejectionReason("");
        closeModal();
      } catch (err) {
        console.error("Error rejecting request:", err);
        alert("Failed to reject request");
      }
    }
  };

  const cancelReject = () => {
    setIsRejectModalOpen(false);
    setRequestToReject(null);
    setRejectionReason("");
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
              <th className="py-3 px-4 text-left font-semibold text-xs">Order</th>
              <th className="py-3 px-4 text-left font-semibold text-xs">Restaurant Name</th>
              <th className="py-3 px-4 text-left font-semibold text-xs">Email</th>
              <th className="py-3 px-4 text-left font-semibold text-xs">Phone Number</th>
              <th className="py-3 px-4 text-left font-semibold text-xs">Cuisine</th>
              <th className="py-3 px-4 text-left font-semibold text-xs">Location</th>
              <th className="py-3 px-4 text-left font-semibold text-xs">Submitted Date</th>
              <th className="py-3 px-4 text-center font-semibold text-xs">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-gray-500">
                  No pending restaurant requests
                </td>
              </tr>
            ) : (
              paginated.map((request, index) => (
                <tr
                  key={`${request.restaurantName}-${index}`}
                  className={`border-b border-gray-100 ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50"
                  } hover:bg-amber-50 transition-colors`}
                >
                  <td className="py-2.5 px-4 text-gray-700 text-xs">{(currentPage - 1) * PAGE_SIZE + index + 1}</td>
                  <td className="py-2.5 px-4 text-gray-700 text-xs">{request.restaurantName}</td>
                  <td className="py-2.5 px-4 text-gray-700 text-xs">{request.email || "-"}</td>
                  <td className="py-2.5 px-4 text-gray-700 text-xs">{request.phone || "-"}</td>
                  <td className="py-2.5 px-4 text-gray-700 text-xs">{request.cuisineType || "-"}</td>
                  <td className="py-2.5 px-4 text-gray-700 text-xs">{request.location || "-"}</td>
                  <td className="py-2.5 px-4 text-gray-700 text-xs">
                    {request.createdAt ? new Date(request.createdAt).toLocaleDateString() : "-"}
                  </td>
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
              ))
            )}
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
              {/* Business Overview */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Utensils size={20} className="text-amber-500" />
                    {selectedRequest.restaurantName || "Unnamed restaurant"}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-block px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                      {selectedRequest.cuisineType || "Cuisine not provided"}
                    </span>
                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full capitalize">
                      {selectedRequest.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                    <User size={14} /> Owner ID
                  </label>
                  <p className="text-sm text-gray-900 font-medium break-all">{selectedRequest.ownerId || "Not provided"}</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500">Request ID</label>
                  <p className="text-sm text-gray-900 font-medium break-all">{selectedRequest.id || "Not available"}</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                    <Mail size={14} /> Email
                  </label>
                  <p className="text-sm text-gray-900 break-all">{selectedRequest.email || "Not provided"}</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                    <Phone size={14} /> Phone Number
                  </label>
                  <p className="text-sm text-gray-900">{selectedRequest.phone || "Not provided"}</p>
                </div>
              </div>

              {/* Location Section */}
              <div className="border-t pt-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                    <MapPin size={14} /> Location
                  </label>
                  <p className="text-sm text-gray-900">{selectedRequest.location || "Location not provided"}</p>
                </div>
              </div>

              {/* Description Section */}
              <div className="border-t pt-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                    <FileText size={14} /> Description
                  </label>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {selectedRequest.description || "Description not provided by applicant."}
                  </p>
                </div>
              </div>

              {/* Operational Details */}
              <div className="border-t pt-4 grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                    <Clock size={14} /> Opening Hours
                  </label>
                  <p className="text-sm text-gray-900">{selectedRequest.openingHours || "Not provided"}</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500">Seating Capacity</label>
                  <p className="text-sm text-gray-900">
                    {selectedRequest.seatingCapacity ? `${selectedRequest.seatingCapacity} seats` : "Not provided"}
                  </p>
                </div>

                <div className="space-y-1 col-span-2">
                  <label className="text-xs font-medium text-gray-500">Submitted Date</label>
                  <p className="text-sm text-gray-900">
                    {selectedRequest.createdAt
                      ? new Date(selectedRequest.createdAt).toLocaleString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : "Not available"}
                  </p>
                </div>
              </div>

              {/* Documents Section */}
              <div className="border-t pt-4">
                <label className="text-xs font-medium text-gray-500 mb-2 block">Submitted Documents</label>
                {selectedRequest.documents && selectedRequest.documents.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedRequest.documents.map((doc, index) => (
                      <span
                        key={index}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs rounded-lg flex items-center gap-1 max-w-full"
                      >
                        <FileText size={12} />
                        <span className="truncate">{doc}</span>
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-red-600">No supporting documents submitted.</p>
                )}
              </div>
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

      {/* Rejection Reason Modal */}
      {isRejectModalOpen && requestToReject && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b">
              <h3 className="text-lg font-semibold text-gray-900">Reject Restaurant Request</h3>
              <p className="text-sm text-gray-500 mt-1">
                Please provide a reason for rejecting "{requestToReject.restaurantName}"
              </p>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rejection Reason <span className="text-red-500">*</span>
              </label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter the reason for rejection (this will be sent to the restaurant owner via email)..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                rows={4}
              />
              <p className="text-xs text-gray-500 mt-2">
                This reason will be included in the rejection email sent to the owner.
              </p>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t bg-gray-50 rounded-b-2xl flex justify-end gap-3">
              <button
                onClick={cancelReject}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                disabled={!rejectionReason.trim()}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
              >
                <X size={16} />
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
