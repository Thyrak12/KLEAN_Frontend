import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'

import { AuthProvider, useAuth } from './features/auth/AuthContext'

import Dashboard from "./page/dashboard";
import RestaurantProfile from "./page/RestaurantProfile";
import MenuPromotion from "./page/MenuPromotion";
import FeedbackMonitor from "./page/FeedbackMonitor";
import Reservation from "./page/Reservation";
import Sidebar from "./components/Sidebar";
import Login from "./page/Login";
import SignUp from "./page/SignUp";
import Setting from "./page/setting";
import Onbording1 from "./features/onBording/Onbording1";
import Onbording2 from "./features/onBording/Onbording2";
import Onbording3 from "./features/onBording/Onbording3";
import OnboardingGuard from "./components/OnboardingGuard";
import { OnboardingProvider } from "./features/onBording/OnboardingContext";
import AdminDashboard from "./page/admin/admin-dashboard";
import AdminRestaurantManage from "./page/admin/restaurant-manage";
import AdminUsers from "./page/admin/users";
import AdminRestaurantRequests from "./page/admin/restaurant-request";
import AdminSettings from "./page/admin/setting";

function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { user, role, loading } = useAuth()

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  // Not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />
  }

  // Logged in but no role yet (hasn't completed onboarding) → redirect to onboarding
  if (!role) {
    return <Navigate to="/onbording1" replace />
  }

  // Only restaurant_owner and admin can access the dashboard
  if (role !== 'restaurant_owner' && role !== 'admin') {
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
            <Route path="/reservation" element={<Reservation />} />
            <Route path="/setting" element={<Setting />} />
            <Route path="/admin/" element={<AdminDashboard />} />
            <Route
              path="/admin/restaurants-manage"
              element={<AdminRestaurantManage />}
            />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route
              path="/admin/restaurants-request"
              element={<AdminRestaurantRequests />}
            />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          {/* Onboarding Routes — single provider keeps data alive across steps */}
          <Route element={<OnboardingProvider><Outlet /></OnboardingProvider>}>
            <Route path="/onbording1" element={<OnboardingGuard><Onbording1 /></OnboardingGuard>} />
            <Route path="/onbording2" element={<OnboardingGuard><Onbording2 /></OnboardingGuard>} />
            <Route path="/onbording3" element={<OnboardingGuard><Onbording3 /></OnboardingGuard>} />
          </Route>
          
          {/* Protected Routes Wrapper */}
          <Route path="/*" element={<AppLayout />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App;
