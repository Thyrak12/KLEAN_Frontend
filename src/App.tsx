import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import { AuthProvider, useAuth } from "./features/auth/AuthContext";
import { MenuProvider } from "./features/menu/MenuContext";

import Dashboard from "./page/dashboard";
import RestaurantProfile from "./page/RestaurantProfile";
import MenuPromotion from "./page/MenuPromotion";
import FeedbackMonitor from "./page/FeedbackMonitor";
import Sidebar from "./components/Sidebar";
import Login from "./page/Login";
import SignUp from "./page/SignUp";
import Setting from "./page/setting";
import Onbording1 from "./features/onBording/Onbording1";
import Onbording2 from "./features/onBording/Onbording2";
import Onbording3 from "./features/onBording/Onbording3";
import OnboardingGuard from "./components/OnboardingGuard";
import SuperAdminGuard from "./components/SuperAdminGuard";
import { OnboardingProvider } from "./features/onBording/OnboardingContext";
import AdminDashboard from "./page/admin/admin-dashboard";
import SetupSuperAdmin from "./page/SetupSuperAdmin";
import AdminRestaurantManage from "./page/admin/restaurant-manage";
import AdminUsers from "./page/admin/users";
import AdminRestaurantRequests from "./page/admin/restaurant-request";
import AdminSettings from "./page/admin/setting";
import PendingApproval from './page/PendingApproval'
import RejectedOwner from './page/RejectedOwner'

function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { user, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-lg text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but no role yet (hasn't completed onboarding) → redirect to onboarding
  if (!role) {
    return <Navigate to="/onbording1" replace />;
  }

  // Only restaurant_owner, admin, and super_admin can access the dashboard
  if (role !== 'restaurant_owner' && role !== 'admin' && role !== 'super_admin') {
    if (role === 'pending_owner') {
      return <PendingApproval />
    }

    if (role === 'rejected_owner') {
      return <RejectedOwner />
    }

    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen">
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main
        className={`transition-all duration-300 ${sidebarCollapsed ? "ml-20" : "ml-80"}`}
      >
        <div className="">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={<RestaurantProfile />} />
            <Route path="/menus" element={<MenuPromotion />} />
            <Route path="/feedback" element={<FeedbackMonitor />} />
            <Route path="/setting" element={<Setting />} />
            {/* Admin Routes - Protected by SuperAdminGuard */}
            <Route path="/admin/" element={<SuperAdminGuard><AdminDashboard /></SuperAdminGuard>} />
            <Route
              path="/admin/restaurants-manage"
              element={<SuperAdminGuard><AdminRestaurantManage /></SuperAdminGuard>}
            />
            <Route path="/admin/users" element={<SuperAdminGuard><AdminUsers /></SuperAdminGuard>} />
            <Route
              path="/admin/restaurants-request"
              element={<SuperAdminGuard><AdminRestaurantRequests /></SuperAdminGuard>}
            />
            <Route path="/admin/settings" element={<SuperAdminGuard><AdminSettings /></SuperAdminGuard>} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
function App() {
  return (
    <AuthProvider>
      <MenuProvider>
        <Toaster position="top-center" />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/setup-admin" element={<SetupSuperAdmin />} />
            {/* Onboarding Routes — single provider keeps data alive across steps */}
            <Route
              element={
                <OnboardingProvider>
                  <Outlet />
                </OnboardingProvider>
              }
            >
              <Route
                path="/onbording1"
                element={
                  <OnboardingGuard>
                    <Onbording1 />
                  </OnboardingGuard>
                }
              />
              <Route
                path="/onbording2"
                element={
                  <OnboardingGuard>
                    <Onbording2 />
                  </OnboardingGuard>
                }
              />
              <Route
                path="/onbording3"
                element={
                  <OnboardingGuard>
                    <Onbording3 />
                  </OnboardingGuard>
                }
              />
            </Route>

            {/* Protected Routes Wrapper */}
            <Route path="/*" element={<AppLayout />} />
          </Routes>
        </BrowserRouter>
      </MenuProvider>
    </AuthProvider>
  );
}

export default App;
