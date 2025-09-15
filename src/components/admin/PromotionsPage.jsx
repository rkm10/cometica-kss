import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Percent,
  Calendar,
  Tag,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { toast } from 'sonner'

const PromotionsPage = () => {
  const [promotions, setPromotions] = useState([])
  const [filteredPromotions, setFilteredPromotions] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editingPromotion, setEditingPromotion] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    discount_percentage: '',
    discount_amount: '',
    discount_type: 'percentage',
    min_order_amount: '',
    max_discount_amount: '',
    start_date: '',
    end_date: '',
    is_active: true,
    usage_limit: '',
    code: ''
  })

  const discountTypes = [
    { value: 'percentage', label: 'Percentage' },
    { value: 'fixed', label: 'Fixed Amount' }
  ]

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'active', label: 'Active' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'expired', label: 'Expired' },
    { value: 'inactive', label: 'Inactive' }
  ]

  useEffect(() => {
    fetchPromotions()
  }, [])

  useEffect(() => {
    filterPromotions()
  }, [promotions, searchTerm, statusFilter])

  const fetchPromotions = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setPromotions(data || [])
    } catch (error) {
      console.error('PromotionsPage: Error fetching promotions:', { error: error.message, timestamp: new Date().toISOString() })
      // Fallback to mock data
      toast.warning('Using demo data', {
        description: 'Unable to connect to database. Showing demo promotions.'
      })
      setPromotions([
        {
          id: 1,
          name: 'Summer Sale 2024',
          description: 'Get up to 50% off on all summer collection items',
          discount_percentage: 50,
          discount_amount: 0,
          discount_type: 'percentage',
          min_order_amount: 100,
          max_discount_amount: 200,
          start_date: '2024-06-01',
          end_date: '2024-08-31',
          is_active: true,
          usage_limit: 1000,
          code: 'SUMMER50',
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          name: 'New Customer Discount',
          description: 'Welcome discount for new customers',
          discount_percentage: 0,
          discount_amount: 20,
          discount_type: 'fixed',
          min_order_amount: 50,
          max_discount_amount: 20,
          start_date: '2024-01-01',
          end_date: '2024-12-31',
          is_active: true,
          usage_limit: 500,
          code: 'WELCOME20',
          created_at: new Date().toISOString()
        },
        {
          id: 3,
          name: 'Black Friday Special',
          description: 'Massive discounts for Black Friday',
          discount_percentage: 70,
          discount_amount: 0,
          discount_type: 'percentage',
          min_order_amount: 200,
          max_discount_amount: 500,
          start_date: '2024-11-24',
          end_date: '2024-11-26',
          is_active: false,
          usage_limit: 2000,
          code: 'BLACKFRIDAY70',
          created_at: new Date().toISOString()
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const filterPromotions = () => {
    let filtered = promotions

    if (searchTerm) {
      filtered = filtered.filter(promotion =>
        promotion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        promotion.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        promotion.code.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      const now = new Date()
      filtered = filtered.filter(promotion => {
        const startDate = new Date(promotion.start_date)
        const endDate = new Date(promotion.end_date)
        
        switch (statusFilter) {
          case 'active':
            return promotion.is_active && startDate <= now && endDate >= now
          case 'upcoming':
            return startDate > now
          case 'expired':
            return endDate < now
          case 'inactive':
            return !promotion.is_active
          default:
            return true
        }
      })
    }

    setFilteredPromotions(filtered)
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const promotionData = {
        ...formData,
        discount_percentage: parseFloat(formData.discount_percentage) || 0,
        discount_amount: parseFloat(formData.discount_amount) || 0,
        min_order_amount: parseFloat(formData.min_order_amount) || 0,
        max_discount_amount: parseFloat(formData.max_discount_amount) || 0,
        usage_limit: parseInt(formData.usage_limit) || 0
      }

      if (editingPromotion) {
        const { error } = await supabase
          .from('promotions')
          .update(promotionData)
          .eq('id', editingPromotion.id)
        if (error) throw error
        
        toast.success('Promotion updated successfully!', {
          description: `${formData.name} has been updated.`
        })
      } else {
        const { error } = await supabase
          .from('promotions')
          .insert([promotionData])
        if (error) throw error
        
        toast.success('Promotion created successfully!', {
          description: `${formData.name} has been added to your promotions.`
        })
      }

      setShowForm(false)
      setEditingPromotion(null)
      resetForm()
      fetchPromotions()
    } catch (error) {
      console.error('PromotionsPage: Error saving promotion:', { error: error.message, promotionData: formData, timestamp: new Date().toISOString() })
      toast.error('Failed to save promotion', {
        description: 'An error occurred while saving the promotion. Please try again.'
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      discount_percentage: '',
      discount_amount: '',
      discount_type: 'percentage',
      min_order_amount: '',
      max_discount_amount: '',
      start_date: '',
      end_date: '',
      is_active: true,
      usage_limit: '',
      code: ''
    })
  }

  const handleEdit = (promotion) => {
    setEditingPromotion(promotion)
    setFormData({
      name: promotion.name,
      description: promotion.description,
      discount_percentage: promotion.discount_percentage.toString(),
      discount_amount: promotion.discount_amount.toString(),
      discount_type: promotion.discount_type,
      min_order_amount: promotion.min_order_amount.toString(),
      max_discount_amount: promotion.max_discount_amount.toString(),
      start_date: promotion.start_date,
      end_date: promotion.end_date,
      is_active: promotion.is_active,
      usage_limit: promotion.usage_limit.toString(),
      code: promotion.code
    })
    setShowForm(true)
  }

  const handleDelete = async (promotionId) => {
    const promotionToDelete = promotions.find(promotion => promotion.id === promotionId)
    
    toast('Are you sure you want to delete this promotion?', {
      description: `This will permanently remove "${promotionToDelete?.name || 'Promotion'}" from your promotions.`,
      action: {
        label: 'Delete',
        onClick: async () => {
          try {
            const { error } = await supabase
              .from('promotions')
              .delete()
              .eq('id', promotionId)
            if (error) throw error
            
            fetchPromotions()
            
            toast.success('Promotion deleted successfully!', {
              description: `${promotionToDelete?.name || 'Promotion'} has been removed.`
            })
          } catch (error) {
            console.error('PromotionsPage: Error deleting promotion:', { error: error.message, promotionId, timestamp: new Date().toISOString() })
            toast.error('Failed to delete promotion', {
              description: 'An error occurred while deleting the promotion. Please try again.'
            })
          }
        }
      },
      cancel: {
        label: 'Cancel',
        onClick: () => {
          toast.dismiss()
        }
      },
      duration: 15000, // Keep the confirmation visible longer
      style: {
        background: 'white',
        border: '2px solid #ef4444',
        color: '#374151',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        borderRadius: '12px',
        minWidth: '400px',
        maxWidth: '500px',
      }
    })
  }

  const togglePromotionStatus = async (promotion) => {
    try {
      const { error } = await supabase
        .from('promotions')
        .update({ is_active: !promotion.is_active })
        .eq('id', promotion.id)
      if (error) throw error
      
      fetchPromotions()
      
      toast.success('Promotion status updated!', {
        description: `${promotion.name} has been ${!promotion.is_active ? 'activated' : 'deactivated'}.`
      })
    } catch (error) {
      console.error('PromotionsPage: Error updating promotion status:', { error: error.message, promotionId, newStatus, timestamp: new Date().toISOString() })
      toast.error('Failed to update promotion status', {
        description: 'An error occurred while updating the promotion status. Please try again.'
      })
    }
  }

  const getPromotionStatus = (promotion) => {
    const now = new Date()
    const startDate = new Date(promotion.start_date)
    const endDate = new Date(promotion.end_date)

    if (!promotion.is_active) return 'inactive'
    if (startDate > now) return 'upcoming'
    if (endDate < now) return 'expired'
    return 'active'
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100'
      case 'upcoming': return 'text-blue-600 bg-blue-100'
      case 'expired': return 'text-red-600 bg-red-100'
      case 'inactive': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4" />
      case 'upcoming': return <Clock className="w-4 h-4" />
      case 'expired': return <XCircle className="w-4 h-4" />
      case 'inactive': return <AlertCircle className="w-4 h-4" />
      default: return <AlertCircle className="w-4 h-4" />
    }
  }

  if (showForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">
            {editingPromotion ? 'Edit Promotion' : 'Create New Promotion'}
          </h1>
          <Button
            variant="outline"
            onClick={() => {
              setShowForm(false)
              setEditingPromotion(null)
              resetForm()
            }}
          >
            Cancel
          </Button>
        </div>

        <Card>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Promotion Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Promo Code</Label>
                  <Input
                    id="code"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    placeholder="e.g., SUMMER50"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="discount_type">Discount Type</Label>
                  <select
                    id="discount_type"
                    value={formData.discount_type}
                    onChange={(e) => setFormData(prev => ({ ...prev, discount_type: e.target.value }))}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Select discount type</option>
                    {discountTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor={formData.discount_type === 'percentage' ? 'discount_percentage' : 'discount_amount'}>
                    {formData.discount_type === 'percentage' ? 'Discount Percentage (%)' : 'Discount Amount ($)'}
                  </Label>
                  <Input
                    id={formData.discount_type === 'percentage' ? 'discount_percentage' : 'discount_amount'}
                    name={formData.discount_type === 'percentage' ? 'discount_percentage' : 'discount_amount'}
                    type="number"
                    step="0.01"
                    value={formData.discount_type === 'percentage' ? formData.discount_percentage : formData.discount_amount}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="min_order_amount">Minimum Order Amount ($)</Label>
                  <Input
                    id="min_order_amount"
                    name="min_order_amount"
                    type="number"
                    step="0.01"
                    value={formData.min_order_amount}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="max_discount_amount">Maximum Discount Amount ($)</Label>
                  <Input
                    id="max_discount_amount"
                    name="max_discount_amount"
                    type="number"
                    step="0.01"
                    value={formData.max_discount_amount}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    name="start_date"
                    type="date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    name="end_date"
                    type="date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="usage_limit">Usage Limit</Label>
                  <Input
                    id="usage_limit"
                    name="usage_limit"
                    type="number"
                    value={formData.usage_limit}
                    onChange={handleInputChange}
                    placeholder="0 for unlimited"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    className="rounded"
                  />
                  <span>Active</span>
                </label>
              </div>
              <div className="flex justify-end space-x-4">
                <Button type="submit">
                  {editingPromotion ? 'Update Promotion' : 'Create Promotion'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Promotions Management</h1>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Promotion
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search promotions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
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
        </CardContent>
      </Card>

      {/* Promotions List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPromotions.map((promotion) => {
            const status = getPromotionStatus(promotion)
            return (
              <Card key={promotion.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{promotion.name}</CardTitle>
                    <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                      {getStatusIcon(status)}
                      <span className="capitalize">{status}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Tag className="w-4 h-4" />
                    <span className="font-mono">{promotion.code}</span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 line-clamp-2">{promotion.description}</p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Discount:</span>
                      <span className="font-semibold">
                        {promotion.discount_type === 'percentage' 
                          ? `${promotion.discount_percentage}%`
                          : `$${promotion.discount_amount}`
                        }
                      </span>
                    </div>
                    {promotion.min_order_amount > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Min Order:</span>
                        <span>${promotion.min_order_amount}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Period:</span>
                      <div className="text-right">
                        <div className="text-xs">{new Date(promotion.start_date).toLocaleDateString()}</div>
                        <div className="text-xs text-gray-400">to {new Date(promotion.end_date).toLocaleDateString()}</div>
                      </div>
                    </div>
                    {promotion.usage_limit > 0 && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Usage Limit:</span>
                        <span>{promotion.usage_limit}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(promotion)}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => togglePromotionStatus(promotion)}
                        className={promotion.is_active ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                      >
                        {promotion.is_active ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(promotion.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {filteredPromotions.length === 0 && !loading && (
        <div className="text-center py-12">
          <Percent className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No promotions found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  )
}

export default PromotionsPage
