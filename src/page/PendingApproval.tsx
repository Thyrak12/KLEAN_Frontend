import { useNavigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import { auth } from "../config/firebase";

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
    if (role === "restaurant_owner" || role === "admin") {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-md w-full text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Pending Approval</h2>
        <p className="text-gray-600 mb-8 text-lg">
          Your restaurant registration has been submitted and is currently under review by our admin team. 
          You will be notified once approved.
        </p>

        <div className="flex flex-col gap-4">
          <button 
            onClick={handleRefresh}
            className="w-full bg-[#FFC107] hover:bg-[#FFB300] text-black font-bold py-3 px-6 rounded-xl transition-colors"
          >
            Check Status
          </button>
          <button 
            onClick={handleLogout}
            className="w-full py-3 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}