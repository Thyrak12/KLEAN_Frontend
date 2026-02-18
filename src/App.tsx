import { useState } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import Dashboard from './page/dashboard'
import RestaurantProfile from './page/RestaurantProfile'
import MenuPromotion from './page/MenuPromotion'
import FeedbackMonitor from './page/FeedbackMonitor'
import Reservation from './page/Reservation'
import Sidebar from './components/Sidebar'
import Login from './page/Login'
import SignUp from './page/SignUp'
import Setting from './page/setting'

function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const location = useLocation()
  const isLoginPage = location.pathname === '/login'

  if (isLoginPage) {
    return <Login />
  }

  return (
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
            <Route path="/setting" element={<Setting />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/*" element={<AppLayout />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
