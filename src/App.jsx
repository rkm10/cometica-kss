import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import HeroSection from './components/HeroSection'
import EditorialGrid from './components/EditorialGrid'
import ProductCategories from './components/ProductCategory'
import PromotionsSection from './components/PromotionsSection'
import TrendingProducts from './components/TrendingProducts'
import NewsletterSection from './components/NewsletterSection'
import AdminLayout from './components/admin/AdminLayout'
import AdminLogin from './components/admin/AdminLogin'
import AdminDashboard from './components/admin/AdminDashboard'
import ProductsPage from './components/admin/ProductsPage'
import OrdersPage from './components/admin/OrdersPage'
import PromotionsPage from './components/admin/PromotionsPage'
import UsersPage from './components/admin/UsersPage'
import ProductDetail from './components/ProductDetail'
import ProtectedRoute from './components/ProtectedRoute'
import ScrollToTop from './components/ScrollToTop'
import ComingSoon from './components/ComingSoon'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { Sonner } from './components/ui/sonner'

// Wrapper component to provide key for ProductDetail
const ProductDetailWrapper = ({ isDarkMode }) => {
  const location = useLocation()
  return <ProductDetail key={location.pathname} isDarkMode={isDarkMode} />
}

// Wrapper component for AdminLogin to provide onLogin function and handle redirects
const AdminLoginWrapper = () => {
  const { login, isAuthenticated, isLoading } = useAuth()
  const navigate = useNavigate()

  // If already authenticated, redirect to admin dashboard
  React.useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/admin')
    }
  }, [isAuthenticated, isLoading, navigate])

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, show login form
  if (!isAuthenticated) {
    return <AdminLogin onLogin={login} />
  }

  // This should not render as we redirect above, but just in case
  return null
}

function App() {
  const [isDarkMode, setIsDarkModes] = useState(false)



  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-background text-foreground">
          <Routes>
            {/* Admin Login Route */}
            <Route path="/admin/login" element={<AdminLoginWrapper />} />

            {/* Admin Routes */}
            <Route path="/admin/*" element={
              <ProtectedRoute>
                <AdminLayout>
                  <Routes>
                    <Route path="/" element={<AdminDashboard />} />
                    <Route path="/products" element={<ProductsPage />} />
                    <Route path="/orders" element={<OrdersPage />} />
                    <Route path="/promotions" element={<PromotionsPage />} />
                    <Route path="/users" element={<UsersPage />} />
                  </Routes>
                </AdminLayout>
              </ProtectedRoute>
            } />

            {/* Public Routes */}
            <Route path="/*" element={
              <>
                <Header setIsDarkModes={setIsDarkModes} />
                <Routes>
                  <Route path="/" element={
                    <>
                      <HeroSection isDarkMode={isDarkMode} />
                      {/* <EditorialGrid /> */}
                      <ProductCategories />
                      {/* <PromotionsSection /> */}
                      <TrendingProducts />
                      <NewsletterSection isDarkMode={isDarkMode} />
                    </>
                  } />
                  <Route path="/products" element={
                    <>
                      <div className="pt-16 px-6 lg:px-[50px]">
                        <TrendingProducts />
                      </div>
                    </>
                  } />
                  <Route path="/promotions" element={
                    <>
                      <div className="pt-16 px-6 lg:px-[50px]">
                        <PromotionsSection />
                        <TrendingProducts />
                      </div>
                    </>
                  } />
                  <Route path="/about" element={
                    <ComingSoon
                      title="About Us"
                      description="Learn more about Cometica's story, mission, and the team behind your favorite fashion brand."
                    />
                  } />
                  <Route path="/contact" element={
                    <ComingSoon
                      title="Contact Us"
                      description="Get in touch with our team for support, inquiries, or just to say hello. We'd love to hear from you!"
                    />
                  } />
                  <Route path="/sort" element={
                    <ComingSoon
                      title="Sort By"
                      description="Advanced sorting and filtering options to help you find exactly what you're looking for."
                    />
                  } />
                  <Route path="/blog" element={
                    <ComingSoon
                      title="Blog"
                      description="Stay updated with the latest fashion trends, styling tips, and behind-the-scenes content from Cometica."
                    />
                  } />
                  <Route path="/faq" element={
                    <ComingSoon
                      title="FAQ"
                      description="Find answers to frequently asked questions about our products, shipping, returns, and more."
                    />
                  } />
                  <Route path="/product/:id" element={<ProductDetailWrapper isDarkMode={isDarkMode} />} />
                </Routes>
                <Footer />
              </>
            } />
          </Routes>
          <Sonner />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App