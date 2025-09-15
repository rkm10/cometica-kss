import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { 
  Search, 
  Filter, 
  Eye,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  Calendar,
  User,
  DollarSign,
  MapPin
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { toast } from 'sonner'

const OrdersPage = () => {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showOrderDetails, setShowOrderDetails] = useState(false)

  const statusOptions = [
    { value: 'all', label: 'All Orders' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'refunded', label: 'Refunded' }
  ]

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    filterOrders()
  }, [orders, searchTerm, statusFilter])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            id,
            product_id,
            quantity,
            price,
            products (
              name,
              image_url
            )
          )
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      setOrders(data || [])
    } catch (error) {
      console.error('OrdersPage: Error fetching orders:', { error: error.message, timestamp: new Date().toISOString() })
      // Fallback to mock data
      toast.warning('Using demo data', {
        description: 'there is no data in database. Showing demo orders.'
      })
      setOrders([
        {
          id: 1,
          order_number: 'ORD-2024-001',
          customer_name: 'John Doe',
          customer_email: 'john@example.com',
          customer_phone: '+1 234 567 8900',
          shipping_address: '123 Main St, New York, NY 10001',
          billing_address: '123 Main St, New York, NY 10001',
          status: 'delivered',
          total_amount: 149.97,
          subtotal: 129.97,
          tax_amount: 10.00,
          shipping_amount: 10.00,
          discount_amount: 0,
          payment_method: 'credit_card',
          payment_status: 'paid',
          created_at: '2024-01-15T10:30:00Z',
          updated_at: '2024-01-18T14:20:00Z',
          order_items: [
            {
              id: 1,
              product_id: 1,
              quantity: 2,
              price: 29.99,
              products: {
                name: 'Classic White T-Shirt',
                image_url: '/img/t-shirt.avif'
              }
            },
            {
              id: 2,
              product_id: 2,
              quantity: 1,
              price: 79.99,
              products: {
                name: 'Blue Denim Jeans',
                image_url: '/img/jeans.avif'
              }
            }
          ]
        },
        {
          id: 2,
          order_number: 'ORD-2024-002',
          customer_name: 'Jane Smith',
          customer_email: 'jane@example.com',
          customer_phone: '+1 234 567 8901',
          shipping_address: '456 Oak Ave, Los Angeles, CA 90210',
          billing_address: '456 Oak Ave, Los Angeles, CA 90210',
          status: 'processing',
          total_amount: 89.99,
          subtotal: 79.99,
          tax_amount: 6.40,
          shipping_amount: 3.60,
          discount_amount: 0,
          payment_method: 'paypal',
          payment_status: 'paid',
          created_at: '2024-01-16T15:45:00Z',
          updated_at: '2024-01-16T15:45:00Z',
          order_items: [
            {
              id: 3,
              product_id: 3,
              quantity: 1,
              price: 79.99,
              products: {
                name: 'Blue Denim Jeans',
                image_url: '/img/jeans.avif'
              }
            }
          ]
        },
        {
          id: 3,
          order_number: 'ORD-2024-003',
          customer_name: 'Mike Johnson',
          customer_email: 'mike@example.com',
          customer_phone: '+1 234 567 8902',
          shipping_address: '789 Pine St, Chicago, IL 60601',
          billing_address: '789 Pine St, Chicago, IL 60601',
          status: 'pending',
          total_amount: 199.98,
          subtotal: 179.98,
          tax_amount: 14.40,
          shipping_amount: 5.60,
          discount_amount: 0,
          payment_method: 'credit_card',
          payment_status: 'pending',
          created_at: '2024-01-17T09:15:00Z',
          updated_at: '2024-01-17T09:15:00Z',
          order_items: [
            {
              id: 4,
              product_id: 3,
              quantity: 2,
              price: 89.99,
              products: {
                name: 'Running Sneakers',
                image_url: '/img/sneakers.avif'
              }
            }
          ]
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const filterOrders = () => {
    let filtered = orders

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer_email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter)
    }

    setFilteredOrders(filtered)
  }

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', orderId)
      if (error) throw error
      
      fetchOrders()
      
      toast.success('Order status updated!', {
        description: `Order status has been changed to ${newStatus}.`
      })
    } catch (error) {
      console.error('OrdersPage: Error updating order status:', { error: error.message, orderId, newStatus, timestamp: new Date().toISOString() })
      toast.error('Failed to update order status', {
        description: 'An error occurred while updating the order status. Please try again.'
      })
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'processing': return 'text-blue-600 bg-blue-100'
      case 'shipped': return 'text-purple-600 bg-purple-100'
      case 'delivered': return 'text-green-600 bg-green-100'
      case 'cancelled': return 'text-red-600 bg-red-100'
      case 'refunded': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />
      case 'processing': return <Package className="w-4 h-4" />
      case 'shipped': return <Truck className="w-4 h-4" />
      case 'delivered': return <CheckCircle className="w-4 h-4" />
      case 'cancelled': return <XCircle className="w-4 h-4" />
      case 'refunded': return <AlertCircle className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'failed': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const viewOrderDetails = (order) => {
    setSelectedOrder(order)
    setShowOrderDetails(true)
  }

  if (showOrderDetails && selectedOrder) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Order Details</h1>
          <Button
            variant="outline"
            onClick={() => {
              setShowOrderDetails(false)
              setSelectedOrder(null)
            }}
            className="w-full sm:w-auto"
          >
            Back to Orders
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
          {/* Order Info */}
          <div className="lg:col-span-3 space-y-4 sm:space-y-6">
            <Card>
              <CardHeader className="p-4 sm:p-6 pb-4">
                <CardTitle className="text-lg sm:text-xl">Order Information</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Order Number</Label>
                    <p className="font-mono text-sm mt-1">{selectedOrder.order_number}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Order Date</Label>
                    <p className="text-sm mt-1">{new Date(selectedOrder.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Status</Label>
                    <div className="mt-1">
                      <div className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                        {getStatusIcon(selectedOrder.status)}
                        <span className="capitalize">{selectedOrder.status}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Payment</Label>
                    <div className="mt-1">
                      <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(selectedOrder.payment_status)}`}>
                        <span className="capitalize">{selectedOrder.payment_status}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
              <CardHeader className="p-4 sm:p-6 pb-4">
                <CardTitle className="text-lg sm:text-xl">Order Items</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="space-y-3">
                  {selectedOrder.order_items?.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
                        {item.products?.image_url ? (
                          <img
                            src={item.products.image_url}
                            alt={item.products.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Package className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm text-gray-900 truncate">{item.products?.name}</h4>
                        <p className="text-xs text-gray-500 mt-1">Quantity: {item.quantity}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="font-semibold text-sm text-gray-900">${(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-xs text-gray-500">${item.price} each</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customer & Shipping Info */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader className="p-4 sm:p-6 pb-4">
                <CardTitle className="text-lg sm:text-xl">Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <span className="font-medium text-sm text-gray-900">{selectedOrder.customer_name}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 flex-shrink-0"></div>
                    <span className="text-sm text-gray-500 break-all">{selectedOrder.customer_email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-5 h-5 flex-shrink-0"></div>
                    <span className="text-sm text-gray-500">{selectedOrder.customer_phone}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4 sm:p-6 pb-4">
                <CardTitle className="text-lg sm:text-xl">Shipping Address</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700 break-words">{selectedOrder.shipping_address}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4 sm:p-6 pb-4">
                <CardTitle className="text-lg sm:text-xl">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Subtotal</span>
                    <span className="text-sm font-medium text-gray-900">${selectedOrder.subtotal?.toFixed(2)}</span>
                  </div>
                  {selectedOrder.discount_amount > 0 && (
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">Discount</span>
                      <span className="text-sm font-medium text-green-600">-${selectedOrder.discount_amount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Tax</span>
                    <span className="text-sm font-medium text-gray-900">${selectedOrder.tax_amount?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Shipping</span>
                    <span className="text-sm font-medium text-gray-900">${selectedOrder.shipping_amount?.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                    <span className="font-semibold text-base text-gray-900">Total</span>
                    <span className="font-bold text-lg text-gray-900">${selectedOrder.total_amount?.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Status Update */}
            <Card>
              <CardHeader className="p-4 sm:p-6 pb-4">
                <CardTitle className="text-lg sm:text-xl">Update Status</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <select
                  value={selectedOrder.status}
                  onChange={(e) => updateOrderStatus(selectedOrder.id, e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {statusOptions.slice(1).map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Orders Management</h1>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full"
                />
              </div>
            </div>
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <Filter className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full sm:w-48 flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="all">Filter by status</option>
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="space-y-3 sm:space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow duration-200">
              <CardContent className="p-4 sm:p-6">
                {/* Mobile Layout - Stacked */}
                <div className="flex flex-col space-y-3 sm:hidden">
                  <div className="flex items-start space-x-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-sm text-gray-900 truncate">{order.order_number}</h3>
                          <p className="text-xs text-gray-500 mt-0.5">{order.customer_name}</p>
                        </div>
                        <div className="text-right ml-2 flex-shrink-0">
                          <p className="font-semibold text-sm text-gray-900">${order.total_amount?.toFixed(2)}</p>
                          <p className="text-xs text-gray-500">{order.order_items?.length} items</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="capitalize">{order.status}</span>
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(order.created_at).toLocaleDateString()}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => viewOrderDetails(order)}
                      className="h-8 px-3 text-xs"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1.5" />
                      View
                    </Button>
                  </div>
                </div>

                {/* Desktop Layout - Horizontal */}
                <div className="hidden sm:flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 text-gray-400" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-900 truncate">{order.order_number}</h3>
                      <p className="text-sm text-gray-500">{order.customer_name}</p>
                      <p className="text-xs text-gray-400">{new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">${order.total_amount?.toFixed(2)}</p>
                      <p className="text-sm text-gray-500">{order.order_items?.length} items</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="capitalize">{order.status}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => viewOrderDetails(order)}
                        className="h-8 px-3"
                      >
                        <Eye className="w-4 h-4 mr-1.5" />
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredOrders.length === 0 && !loading && (
        <div className="text-center py-8 sm:py-12 px-4">
          <Package className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No orders found</h3>
          <p className="text-sm sm:text-base text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  )
}

export default OrdersPage
