import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import { auth } from "../config/firebase";
import { Clock, RefreshCw, LogOut, CheckCircle, Mail } from "lucide-react";

export default function PendingApproval() {
  const { role, refreshUserData } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  const handleRefresh = async () => {
    // When clicked, check if the admin has updated their role to "restaurant_owner" in Firestore
    await refreshUserData();
    if (role === "restaurant_owner" || role === "admin" || role === "super_admin") {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-lg w-full text-center">
        {/* Pending Icon */}
        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock size={40} className="text-amber-500" />
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-4">Pending Approval</h2>
        <p className="text-gray-600 mb-6 text-lg">
          Your restaurant registration has been submitted and is currently under review by our admin team.
        </p>

        {/* Status Steps */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
          <h3 className="font-semibold text-gray-800 mb-4">What happens next?</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle size={20} className="text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-600">Registration submitted successfully</span>
            </div>
            <div className="flex items-start gap-3">
              <Clock size={20} className="text-amber-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-600">Admin reviewing your application (1-2 business days)</span>
            </div>
            <div className="flex items-start gap-3">
              <Mail size={20} className="text-gray-400 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-600">You'll receive an email when approved</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button 
            onClick={handleRefresh}
            className="w-full flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-500 text-white font-bold py-3 px-6 rounded-xl transition-colors"
          >
            <RefreshCw size={20} />
            Check Approval Status
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