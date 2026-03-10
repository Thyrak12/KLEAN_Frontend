import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, db } from "../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import logo from "../assets/logo.png"; // Adjust the path if needed

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      const userDoc = await getDoc(doc(db, "users", uid));

      if (!userDoc.exists()) {
        await auth.signOut();
        setError("Account profile not found. Please contact support.");
        return;
      }

      const data = userDoc.data();
      const role = data?.role as string | undefined;
      const allowedRoles = ["restaurant_owner", "pending_owner", "admin", "super_admin"];

      if (!role || !allowedRoles.includes(role)) {
        await auth.signOut();
        setError("Access denied. Invalid role for this platform.");
        return;
      }

      if (role === "super_admin" || role === "admin") {
        navigate("/admin");
        return;
      }

      navigate("/");
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 m-auto w-full max-w-md px-6">
      {/* Logo */}
      <div className="mb-8 flex justify-center">
        <img src={logo} alt="Klean" className="h-20 object-contain" />
      </div>

      <form onSubmit={handleLogin} className="space-y-5">
        {/* Error message */}
        {error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600 border border-red-200">
            {error}
          </div>
        )}

        {/* Email */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20"
          />
        </div>

        {/* Password */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#F5A623] focus:ring-2 focus:ring-[#F5A623]/20"
          />
        </div>

        {/* Remember me & Forgot */}
        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 cursor-pointer text-gray-600">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 accent-[#F5A623]"
            />
            Remember me
          </label>
          <button
            type="button"
            className="text-gray-500 hover:text-gray-700 transition cursor-pointer"
          >
            Forget password
          </button>
        </div>

        {/* Login button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-full bg-[#F5A623] py-3.5 text-base font-semibold text-white shadow-md transition hover:bg-[#e09510] disabled:opacity-60 cursor-pointer"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>

        {/* Sign up link */}
        <p className="text-center text-sm text-gray-500">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-medium text-[#F5A623] hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}