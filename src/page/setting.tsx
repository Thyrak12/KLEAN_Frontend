import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import {
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  signOut,
} from "firebase/auth";

export default function Setting() {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChangePassword = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=]).{12,}$/;
    if (!passwordRegex.test(newPassword)) {
      setError("Password does not meet the requirements.");
      return;
    }

    const user = auth.currentUser;
    if (!user || !user.email) {
      setError("No authenticated user found.");
      return;
    }

    setLoading(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, oldPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      setSuccess("Password updated successfully.");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setError("Failed to change password. Check your old password.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogOut = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch {
      setError("Failed to log out.");
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] p-8">
      {/* Title */}
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Change Password</h1>

      {/* Card */}
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <form onSubmit={handleChangePassword}>
          <div className="flex flex-col md:flex-row md:gap-16">
            {/* Left: inputs */}
            <div className="flex-1 space-y-5 max-w-sm">
              {/* Old Password */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-600">
                  Old Password
                </label>
                <input
                  type="password"
                  placeholder="enter name"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                  className="w-full rounded-full border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20"
                />
              </div>

              {/* New Password */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-600">
                  New Password
                </label>
                <input
                  type="password"
                  placeholder="write password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="w-full rounded-full border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gray-600">
                  Confirm Password
                </label>
                <input
                  type="password"
                  placeholder="Enter newpassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full rounded-full border border-gray-300 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20"
                />
              </div>
            </div>

            {/* Right: requirements + save */}
            <div className="mt-6 flex flex-col justify-between md:mt-0">
              <div>
                <p className="mb-2 text-sm text-gray-600">
                  Please add all necessary Characters to create safe password
                </p>
                <ul className="list-disc space-y-1 pl-5 text-sm text-gray-600">
                  <li>minimum character 12</li>
                  <li>One uppercase character</li>
                  <li>One lowercase character</li>
                  <li>One special character</li>
                  <li>One number</li>
                </ul>
              </div>

              {/* Messages */}
              {error && (
                <p className="mt-4 text-sm text-red-600">{error}</p>
              )}
              {success && (
                <p className="mt-4 text-sm text-green-600">{success}</p>
              )}

              {/* Save button */}
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-[#F5A623] px-8 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-[#e09510] disabled:opacity-60 cursor-pointer"
                >
                  {loading ? "SAVING..." : "SAVE"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Log Out button */}
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleLogOut}
          className="rounded-full bg-[#F5A623] px-8 py-3 text-sm font-semibold text-white shadow-md transition hover:bg-[#e09510] cursor-pointer"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
