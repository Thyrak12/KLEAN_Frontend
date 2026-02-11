import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './page/dashboard'
import RestaurantProfile from './page/RestaurantProfile'
import MenuPromotion from './page/MenuPromotion'
import FeedbackMonitor from './page/FeedbackMonitor'
import Reservation from './page/Reservation'
import Sidebar from './components/Sidebar'

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <BrowserRouter>
      <div className="min-h-screen">
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
        <main className={`transition-all duration-300 ${sidebarCollapsed ? 'ml-20' : 'ml-80'}`}>
          <div className="">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/profile" element={<RestaurantProfile />} />
              <Route path="/menus" element={<MenuPromotion />} />
              <Route path="/feedback" element={<FeedbackMonitor />} />
              <Route path="/reservation" element={<Reservation />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
