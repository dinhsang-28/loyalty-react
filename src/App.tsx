import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/ui/toaster';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import HomePage from './pages/public/HomePage';
import LoginPage from './pages/public/LoginPage';
import RegisterPage from './pages/public/RegisterPage';
import TrackPage from './pages/public/TrackPage';
import StatsPage from './pages/public/StatsPage';

// Customer Pages
import LoyaltyDashboard from'./pages/customer/DashBoard'
import ProfilePage from './pages/customer/ProfilePage';
import RewardsPage from './pages/customer/RewardsPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import RegisterAffiliate from './pages/customer/RegisterAffiliate'

// Affiliate Pages
import AffiliateDashboard from './pages/affiliate/AffiliateDashboard';

// Admin Pages
import AdminLoyaltyTiers from './pages/admin/AdminLoyaltyTiers';
import AdminLoyaltyVouchers from './pages/admin/AdminLoyaltyVouchers';
import AdminLoyaltyMembers from './pages/admin/AdminLoyaltyMember';
import AdminLoyaltyUseCode from './pages/admin/AdminLoyaltyUseCode';
import AdminAffiliateTiers from './pages/admin/AdminAffiliateTiers';
import AdminAffiliateOrders from './pages/admin/AdminAffiliateOrder';
import AdminPayouts from './pages/admin/AdminPayouts';
import AdminDashboard from './pages/admin/AdminDashBoard';

// Route Guards
import ProtectedRoute from './components/guards/ProtectedRoute';
import AdminRoute from './components/guards/AdminRoute';

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/track" element={<TrackPage />} />
              <Route path="/stats/:referral_code" element={<StatsPage />} />
            </Route>

            {/* Customer Routes */}
            <Route element={<ProtectedRoute><UserLayout /></ProtectedRoute>}>
              <Route path='/dashboard' element={<LoyaltyDashboard/>}/>
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/rewards" element={<RewardsPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/register/affiliate" element={<RegisterAffiliate/>}/>
              <Route path="/affiliate/dashboard" element={<AffiliateDashboard />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
              {/* <Route path="/admin" element={<Navigate to="/admin/loyalty/tiers" replace />} /> */}
              {/* <Route path="/admin/dashboard" element={<AdminDashboard/>} /> */}
              <Route path="/admin" element={<AdminDashboard/>} />
              <Route path="/admin/loyalty/tiers" element={<AdminLoyaltyTiers />} />
              <Route path="/admin/loyalty/vouchers" element={<AdminLoyaltyVouchers />} />
              <Route path="/admin/loyalty/members" element={<AdminLoyaltyMembers />} />
              <Route path="/admin/loyalty/use-code" element={<AdminLoyaltyUseCode />} />
              <Route path="/admin/affiliate/tiers" element={<AdminAffiliateTiers />} />
              <Route path="/admin/affiliate/orders" element={<AdminAffiliateOrders />} />
              <Route path="/admin/payouts" element={<AdminPayouts />} />
            </Route>
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </HelmetProvider>
  );
}

export default App;
