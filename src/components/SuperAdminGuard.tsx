import { Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";
import type { ReactNode } from "react";

interface SuperAdminGuardProps {
  children: ReactNode;
}

/**
 * A route guard that only allows super_admin users to access admin routes.
 * Redirects to dashboard if the user doesn't have super_admin role.
 */
export default function SuperAdminGuard({ children }: SuperAdminGuardProps) {
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Only super_admin can access admin routes
  if (role !== "super_admin") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
