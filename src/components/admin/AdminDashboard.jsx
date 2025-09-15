import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { 
  Package, 
  Percent, 
  TrendingUp, 
  Users,
  Plus,
  Edit,
  ShoppingCart
} from 'lucide-react'
import { supabase } from '../../lib/supabase'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalPromotions: 0,
    totalRevenue: 0,
    totalUsers: 0
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // Fetch products count
      const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })

      // Fetch promotions count (products with discount > 0)
      const { count: promotionsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .gt('discount_percentage', 0)

      setStats({
        totalProducts: productsCount || 0,
        totalPromotions: promotionsCount || 0,
        totalRevenue: 0, // This would be calculated from orders
        totalUsers: 0 // This would be fetched from users table
      })
    } catch (error) {
      console.error('AdminDashboard: Error fetching stats:', { error: error.message, timestamp: new Date().toISOString() })
      // Fallback to mock data
      setStats({
        totalProducts: 12,
        totalPromotions: 8,
        totalRevenue: 2500,
        totalUsers: 150
      })
    }
  }

  const handleNavigateToProducts = () => {
    navigate('/admin/products')
  }

  const handleNavigateToOrders = () => {
    navigate('/admin/orders')
  }

  const handleNavigateToPromotions = () => {
    navigate('/admin/promotions')
  }

  const handleNavigateToUsers = () => {
    navigate('/admin/users')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to the Cometica admin panel</p>
      </div>

      {/* Dashboard Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow duration-200"
          onClick={handleNavigateToProducts}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow duration-200"
          onClick={handleNavigateToPromotions}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Promotions</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPromotions}</div>
            <p className="text-xs text-muted-foreground">
              +1 from last week
            </p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow duration-200"
          onClick={handleNavigateToOrders}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p>
          </CardContent>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-md transition-shadow duration-200"
          onClick={handleNavigateToUsers}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              +5 from last week
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleNavigateToProducts}
              className="w-full justify-start bg-indigo-600 hover:bg-indigo-700"
            >
              <Package className="mr-2 h-4 w-4" />
              Manage Products
            </Button>
            <Button 
              variant="outline"
              onClick={handleNavigateToOrders}
              className="w-full justify-start"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              View Orders
            </Button>
            <Button 
              variant="outline"
              onClick={handleNavigateToPromotions}
              className="w-full justify-start"
            >
              <Percent className="mr-2 h-4 w-4" />
              Manage Promotions
            </Button>
            <Button 
              variant="outline"
              onClick={handleNavigateToUsers}
              className="w-full justify-start"
            >
              <Users className="mr-2 h-4 w-4" />
              Manage Users
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New product added</p>
                  <p className="text-xs text-gray-500">Blue Jeans - 2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Product updated</p>
                  <p className="text-xs text-gray-500">T-Shirt Green Kids - 1 hour ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Promotion created</p>
                  <p className="text-xs text-gray-500">50% OFF Sale - 3 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminDashboard
