import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import logo from "../assets/logo.png";
import { Clock, LogOut, CheckCircle, Mail } from "lucide-react";

export default function PendingApproval() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] flex flex-col items-center justify-center p-4">
      <div className="bg-white border border-amber-100 rounded-3xl shadow-xl p-10 max-w-lg w-full text-center">
        <img src={logo} alt="KLEAN Logo" className="h-16 w-auto object-contain mx-auto mb-5" />

        <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Clock size={40} className="text-amber-500" />
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-4">Pending Approval</h2>
        <p className="text-gray-600 mb-6 text-lg">
          Your restaurant registration request has been submitted to KLEAN and is currently under review by our admin team.
        </p>

        <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-6 mb-8 text-left">
          <h3 className="font-semibold text-gray-800 mb-4">What happens next?</h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle size={20} className="text-emerald-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-600">Restaurant request submitted successfully</span>
            </div>
            <div className="flex items-start gap-3">
              <Clock size={20} className="text-amber-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-600">Admin reviewing your application (1-2 business days)</span>
            </div>
            <div className="flex items-start gap-3">
              <Mail size={20} className="text-amber-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-600">KLEAN will automatically send an email when your restaurant is approved</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-6">
          Need help? Contact contact@klean.app
        </p>
      </div>
    </div>
  );
}