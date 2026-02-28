import { useState } from "react";
import { Search, ChevronLeft, ChevronRight, Check, X, Eye, MapPin, Clock, Phone, Mail, User, Utensils, FileText } from "lucide-react";

interface RestaurantRequest {
  id: number;
  name: string;
  owner: string;
  email: string;
  phone: string;
  address: string;
  cuisineType: string;
  description: string;
  openingHours: string;
  seatingCapacity: number;
  requestDate: string;
  documents: string[];
}

const mockRequests: RestaurantRequest[] = [
  { id: 10001, name: "Omakase", owner: "Jack Smith", email: "Omakase@gmail.com", phone: "0118822342", address: "123 Riverside Blvd, Phnom Penh", cuisineType: "Japanese", description: "Authentic Japanese omakase experience with fresh ingredients imported daily from Tokyo's Tsukiji market.", openingHours: "11:00 AM - 10:00 PM", seatingCapacity: 40, requestDate: "2026-02-20", documents: ["Business License", "Health Certificate", "Food Safety Permit"] },
  { id: 10002, name: "Uncle Hai", owner: "Hai Nguyen", email: "Unclehai@gmail.com", phone: "0118844322", address: "456 Street 271, Toul Kork", cuisineType: "Vietnamese", description: "Traditional Vietnamese pho and rice dishes made with family recipes passed down through generations.", openingHours: "6:00 AM - 9:00 PM", seatingCapacity: 60, requestDate: "2026-02-19", documents: ["Business License", "Health Certificate"] },
  { id: 10003, name: "XiaoGe", owner: "Wei Chen", email: "Xiaoge@gmail.com", phone: "0908652390", address: "789 Mao Tse Tung Blvd", cuisineType: "Chinese", description: "Szechuan and Cantonese cuisine featuring spicy hot pot and dim sum.", openingHours: "10:00 AM - 11:00 PM", seatingCapacity: 80, requestDate: "2026-02-18", documents: ["Business License", "Health Certificate", "Fire Safety Certificate"] },
  { id: 10004, name: "Burger King", owner: "Mike Johnson", email: "burgerking@gmail.com", phone: "012003344", address: "101 Norodom Blvd", cuisineType: "American Fast Food", description: "Premium burgers and fries with a focus on quality ingredients and fast service.", openingHours: "7:00 AM - 12:00 AM", seatingCapacity: 100, requestDate: "2026-02-17", documents: ["Franchise License", "Business License", "Health Certificate"] },
  { id: 10005, name: "Pasta Corner", owner: "Marco Rossi", email: "pastacorner@gmail.com", phone: "012009944", address: "202 Russian Blvd", cuisineType: "Italian", description: "Handmade pasta and authentic Italian pizzas baked in a wood-fired oven.", openingHours: "11:00 AM - 10:00 PM", seatingCapacity: 50, requestDate: "2026-02-16", documents: ["Business License", "Health Certificate"] },
  { id: 10006, name: "Kuyteav Tep", owner: "Sophal Keo", email: "kuyteavtep@gmail.com", phone: "098667743", address: "303 Street 63, BKK1", cuisineType: "Cambodian", description: "Famous Phnom Penh noodle soup with premium beef and fresh herbs.", openingHours: "5:30 AM - 2:00 PM", seatingCapacity: 35, requestDate: "2026-02-15", documents: ["Business License", "Health Certificate"] },
  { id: 10007, name: "Sakura Buffet", owner: "Yuki Tanaka", email: "sakura@gmail.com", phone: "088506790", address: "404 Sihanouk Blvd", cuisineType: "Japanese Buffet", description: "All-you-can-eat Japanese buffet featuring sushi, sashimi, and teppanyaki.", openingHours: "11:30 AM - 2:30 PM, 5:30 PM - 10:00 PM", seatingCapacity: 150, requestDate: "2026-02-14", documents: ["Business License", "Health Certificate", "Food Handler Certification"] },
  { id: 10008, name: "Romdoul", owner: "Dara Sok", email: "romdoul@gmail.com", phone: "088234433", address: "505 Kampuchea Krom Blvd", cuisineType: "Khmer Fine Dining", description: "Upscale Khmer cuisine with modern presentation, celebrating Cambodia's culinary heritage.", openingHours: "6:00 PM - 11:00 PM", seatingCapacity: 45, requestDate: "2026-02-13", documents: ["Business License", "Health Certificate", "Liquor License"] },
  { id: 10009, name: "Khmer River", owner: "Visal Tep", email: "khmerriver@gmail.com", phone: "097090988", address: "606 Sisowath Quay", cuisineType: "Cambodian Seafood", description: "Fresh river and ocean seafood served with stunning views of the Mekong.", openingHours: "10:00 AM - 11:00 PM", seatingCapacity: 120, requestDate: "2026-02-12", documents: ["Business License", "Health Certificate", "Liquor License"] },
  { id: 10010, name: "Pasta Master", owner: "Luigi Bianchi", email: "pastamaster@gmail.com", phone: "097880099", address: "707 Street 240", cuisineType: "Italian", description: "Gourmet Italian dining with an extensive wine selection and homemade desserts.", openingHours: "12:00 PM - 10:30 PM", seatingCapacity: 65, requestDate: "2026-02-11", documents: ["Business License", "Health Certificate", "Liquor License"] },
  { id: 10011, name: "Carl Jr", owner: "David Lee", email: "carljr@gmail.com", phone: "077723090", address: "808 Monivong Blvd", cuisineType: "American Fast Food", description: "Charbroiled burgers and hand-breaded chicken tenders.", openingHours: "6:00 AM - 11:00 PM", seatingCapacity: 75, requestDate: "2026-02-10", documents: ["Franchise License", "Business License", "Health Certificate"] },
  { id: 10012, name: "Sushi World", owner: "Kenji Yamamoto", email: "sushiworld@gmail.com", phone: "088112233", address: "909 Street 51", cuisineType: "Japanese Sushi", description: "Premium sushi and sashimi prepared by expert chefs with years of experience.", openingHours: "11:00 AM - 10:00 PM", seatingCapacity: 55, requestDate: "2026-02-09", documents: ["Business License", "Health Certificate", "Food Safety Permit"] },
  { id: 10013, name: "Noodle King", owner: "Chen Wei", email: "noodleking@gmail.com", phone: "099223344", address: "1010 Street 310", cuisineType: "Chinese Noodles", description: "Hand-pulled noodles and traditional Chinese noodle soups.", openingHours: "7:00 AM - 9:00 PM", seatingCapacity: 45, requestDate: "2026-02-08", documents: ["Business License", "Health Certificate"] },
];

const PAGE_SIZE = 11;

export default function AdminRestaurantRequests() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("Newest");
  const [selectedRequest, setSelectedRequest] = useState<RestaurantRequest | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (request: RestaurantRequest) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedRequest(null);
    setIsModalOpen(false);
  };

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

  const handleAccept = (request: RestaurantRequest) => {
    alert(`Accepted request from ${request.name}`);
    closeModal();
  };

  const handleReject = (request: RestaurantRequest) => {
    alert(`Rejected request from ${request.name}`);
    closeModal();
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
                    {selectedRequest.name}
                  </h3>
                  <span className="inline-block mt-1 px-3 py-1 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                    {selectedRequest.cuisineType}
                  </span>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                    <User size={14} /> Owner Name
                  </label>
                  <p className="text-sm text-gray-900 font-medium">{selectedRequest.owner}</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500">Restaurant ID</label>
                  <p className="text-sm text-gray-900 font-medium">#{selectedRequest.id}</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                    <Mail size={14} /> Email
                  </label>
                  <p className="text-sm text-gray-900">{selectedRequest.email}</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                    <Phone size={14} /> Phone Number
                  </label>
                  <p className="text-sm text-gray-900">{selectedRequest.phone}</p>
                </div>
              </div>

              {/* Address Section */}
              <div className="border-t pt-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                    <MapPin size={14} /> Address
                  </label>
                  <p className="text-sm text-gray-900">{selectedRequest.address}</p>
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
              <div className="border-t pt-4 grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500 flex items-center gap-1">
                    <Clock size={14} /> Opening Hours
                  </label>
                  <p className="text-sm text-gray-900">{selectedRequest.openingHours}</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500">Seating Capacity</label>
                  <p className="text-sm text-gray-900">{selectedRequest.seatingCapacity} seats</p>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-500">Request Date</label>
                  <p className="text-sm text-gray-900">{new Date(selectedRequest.requestDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>

              {/* Documents Section */}
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
