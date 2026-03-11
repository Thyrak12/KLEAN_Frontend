import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import { auth, db } from "../config/firebase";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { XCircle, RefreshCw, LogOut, AlertTriangle, ArrowRight, MapPin, Phone, Utensils } from "lucide-react";

interface RejectionInfo {
  restaurantName: string;
  rejectionReason: string;
  rejectedAt?: number;
  // Previous submission data preview
  phone?: string;
  address?: string;
  category?: string;
}

export default function RejectedOwner() {
  const { user, refreshUserData } = useAuth();
  const navigate = useNavigate();
  const [rejectionInfo, setRejectionInfo] = useState<RejectionInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRejectionInfo = async () => {
      if (!user) return;
      
      try {
        // Fetch the rejected restaurant request
        const requestDoc = await getDoc(doc(db, "restaurantRequests", user.uid));
        if (requestDoc.exists()) {
          const data = requestDoc.data();
          setRejectionInfo({
            restaurantName: data.restaurantName || "Your Restaurant",
            rejectionReason: data.rejectionReason || "No reason provided",
            rejectedAt: data.updatedAt?.toMillis?.() || data.updatedAt,
            phone: data.phone,
            address: data.address || data.location,
            category: data.category || data.cuisineType,
          });
        }
      } catch (err) {
        console.error("Error fetching rejection info:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRejectionInfo();
  }, [user]);

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  const handleEditAndResubmit = async () => {
    if (!user) return;

    try {
      // Update user role to allow re-onboarding (keep the request data for pre-filling)
      await updateDoc(doc(db, "users", user.uid), {
        role: null,
        onboardingCompleted: false,
        updatedAt: serverTimestamp(),
      });

      // Refresh user data and navigate to onboarding
      // The onboarding will load previous data from restaurantRequests
      await refreshUserData();
      navigate("/onbording1?resubmit=true");
    } catch (err) {
      console.error("Error preparing for resubmission:", err);
      alert("Failed to prepare for resubmission. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-lg w-full text-center">
        {/* Rejected Icon */}
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle size={40} className="text-red-500" />
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-4">Application Rejected</h2>
        <p className="text-gray-600 mb-6 text-lg">
          Unfortunately, your restaurant registration for <strong>"{rejectionInfo?.restaurantName}"</strong> was not approved.
        </p>

        {/* Rejection Reason */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8 text-left">
          <div className="flex items-start gap-3 mb-3">
            <AlertTriangle size={20} className="text-red-500 mt-0.5 flex-shrink-0" />
            <h3 className="font-semibold text-red-800">Reason for Rejection</h3>
          </div>
          <p className="text-sm text-red-700 whitespace-pre-wrap pl-8">
            {rejectionInfo?.rejectionReason}
          </p>
          {rejectionInfo?.rejectedAt && (
            <p className="text-xs text-red-400 mt-3 pl-8">
              Rejected on: {new Date(rejectionInfo.rejectedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          )}
        </div>

        {/* What to do next */}
        <div className="bg-gray-50 rounded-xl p-6 mb-6 text-left">
          <h3 className="font-semibold text-gray-800 mb-4">Your Previous Submission:</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Utensils size={16} className="text-gray-400" />
              <span className="text-gray-600">Restaurant: <strong>{rejectionInfo?.restaurantName}</strong></span>
            </div>
            {rejectionInfo?.phone && (
              <div className="flex items-center gap-2">
                <Phone size={16} className="text-gray-400" />
                <span className="text-gray-600">Phone: {rejectionInfo.phone}</span>
              </div>
            )}
            {rejectionInfo?.address && (
              <div className="flex items-center gap-2">
                <MapPin size={16} className="text-gray-400" />
                <span className="text-gray-600">Address: {rejectionInfo.address}</span>
              </div>
            )}
            {rejectionInfo?.category && (
              <div className="flex items-center gap-2">
                <Utensils size={16} className="text-gray-400" />
                <span className="text-gray-600">Category: {rejectionInfo.category}</span>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8 text-left">
          <h3 className="font-semibold text-amber-800 mb-4">What you can do:</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-amber-600">1</span>
              </div>
              <span className="text-sm text-amber-700">Review the rejection reason above</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-amber-600">2</span>
              </div>
              <span className="text-sm text-amber-700">Click "Edit & Re-submit" to update your information</span>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold text-amber-600">3</span>
              </div>
              <span className="text-sm text-amber-700">Your previous info will be pre-filled for easy editing</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button 
            onClick={handleEditAndResubmit}
            className="w-full flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-white font-bold py-3 px-6 rounded-xl transition-colors"
          >
            <RefreshCw size={20} />
            Edit & Re-submit Application
            <ArrowRight size={18} />
          </button>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-6">
          Need help? Contact support@dineflow.com
        </p>
      </div>
    </div>
  );
}
