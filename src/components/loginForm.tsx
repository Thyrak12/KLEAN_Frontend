import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, db } from "../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth/web-extension";
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
      // 1. Authenticate with Firebase — fails if account doesn't exist
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // 2. Check if user doc exists in Firestore 'users' collection
      const userDoc = await getDoc(doc(db, "users", uid));
      if (!userDoc.exists()) {
        // Account exists in Firebase Auth but no user doc in Firestore → deny access
        await auth.signOut();
        setError("Account not found. Please contact support.");
        return;
      }

      // 3. Compare role — only restaurant_owner is allowed
      const data = userDoc.data();
      const role = data?.role;

      if (role !== "restaurant_owner") {
        await auth.signOut();
        setError("Access denied. Only restaurant owners can log in.");
        return;
      }

      // 4. Role is restaurant_owner → allow access
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