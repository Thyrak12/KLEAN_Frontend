import { useState } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./page/dashboard";
import RestaurantProfile from "./page/RestaurantProfile";
import MenuPromotion from "./page/MenuPromotion";
import FeedbackMonitor from "./page/FeedbackMonitor";
import Reservation from "./page/Reservation";
import Sidebar from "./components/Sidebar";
import AdminDashboard from "./page/admin/admin-dashboard";
import AdminRestaurantManage from "./page/admin/restaurant-manage";
import AdminUsers from "./page/admin/users";
import AdminSettings from "./page/admin/setting";
import AdminRestaurantRequests from "./page/admin/restaurant-request";

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default App;
