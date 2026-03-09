import { useState } from "react";

export default function AdminSettings() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSave = () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert("Password changed successfully!");
  };

  const handleLogOut = () => {
    alert("Logged out!");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col">
      {/* Title */}
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Change Password
      </h1>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-sm p-8 max-w-3xl w-full">
        {/* Dots decoration */}
        <div className="flex justify-end gap-1 mb-6">
          <span className="w-2 h-2 rounded-full bg-gray-300" />
          <span className="w-2 h-2 rounded-full bg-gray-300" />
          <span className="w-2 h-2 rounded-full bg-gray-300" />
        </div>

        <div className="flex gap-8">
          {/* Form - Left Side */}
          <div className="flex-1 space-y-5">
            {/* Old Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Old Password
              </label>
              <input
                type="password"
                placeholder="enter name..."
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                New Password
              </label>
              <input
                type="password"
                placeholder="write password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Write Repassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          {/* Requirements - Right Side */}
          <div className="flex-1 pt-6">
            <p className="text-sm text-gray-600 italic mb-3">
              Please add all necessary Characters to create safe password
            </p>
            <ul className="space-y-1.5 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                minimum character 12
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                One uppercase character
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                One lowercase character
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                One special character
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-500" />
                One number
              </li>
            </ul>

            {/* Save Button */}
            <div className="flex justify-end mt-8">
              <button
                onClick={handleSave}
                className="bg-amber-400 hover:bg-amber-500 text-white font-bold px-8 py-2.5 rounded-lg transition-colors text-sm"
              >
                SAVE
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Log Out Button */}
      <div className="flex justify-end mt-6 max-w-3xl w-full">
        <button
          onClick={handleLogOut}
          className="bg-amber-400 hover:bg-amber-500 text-white font-bold px-8 py-2.5 rounded-full transition-colors text-sm"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}