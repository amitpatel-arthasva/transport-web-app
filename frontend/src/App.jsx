import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Background from './components/common/Background.jsx'
import ProtectedLayout from './components/common/ProtectedLayout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Quotations from './pages/Quotations.jsx'
import DeliverySlips from './pages/DeliverySlips.jsx'
import LoadingSlips from './pages/LoadingSlips.jsx'

import ShreeDattaguruLR from './components/lorryReceipts/ShreeDattaguruLR.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import PublicRoute from './components/common/PublicRoute.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { ToastProvider } from './components/common/ToastSystem.jsx'
import LorryReceipts from './pages/LorryReceipts.jsx'
import Profile from './pages/Profile.jsx'
import Invoices from './pages/Invoices.jsx'

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <Background>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } />
              <Route path="/register" element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } />
              
              {/* Protected routes with outlet */}
              <Route path="/" element={<ProtectedLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="quotations" element={<Quotations />} />
                <Route path="loading-slips" element={<LoadingSlips />} />
                <Route path="delivery-slips" element={<DeliverySlips />} />
                <Route path="lorry-receipts" element={<LorryReceipts />} />
				<Route path='invoices' element={<Invoices />} />
                <Route path="profile" element={<Profile />} />
              </Route>
            </Routes>
          </Background>
        </Router>
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
