import { useState, useEffect } from 'react'
import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './config/firebase' // Import your firebase auth instance

import Dashboard from './page/dashboard'
import RestaurantProfile from './page/RestaurantProfile'
import MenuPromotion from './page/MenuPromotion'
import FeedbackMonitor from './page/FeedbackMonitor'
import Reservation from './page/Reservation'
import Sidebar from './components/Sidebar'
import Login from './page/Login'
import SignUp from './page/SignUp'
import Setting from './page/setting'
import Onbording1 from './features/onBording/Onbording1'
import Onbording2 from './features/onBording/Onbording2'
import OnboardingGuard from './components/OnboardingGuard'

function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null) // null = loading

  useEffect(() => {
    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user)
    })
    return () => unsubscribe()
  }, [])

  // Show nothing or a loading spinner while checking auth status
  if (isAuthenticated === null) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
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
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/onbording1" element={<OnboardingGuard><Onbording1 /></OnboardingGuard>} />
        <Route path="/onbording2" element={<OnboardingGuard><Onbording2 /></OnboardingGuard>} />
        
        {/* Protected Routes Wrapper */}
        <Route path="/*" element={<AppLayout />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
