import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { 
  Edit, 
  Trash2, 
  Plus, 
  Search,
  Package,
  Filter,
  Image as ImageIcon
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { toast } from 'sonner'

const ProductList = ({ onEdit, onAdd }) => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('ProductList: Error fetching products:', { error: error.message, timestamp: new Date().toISOString() })
        // Fallback to mock data if Supabase is not configured
        setProducts(getMockProducts())
        toast.warning('Using demo data', {
          description: 'Unable to connect to database. Showing demo products.'
        })
      } else {
        setProducts(data || getMockProducts())
      }
    } catch (error) {
      console.error('ProductList: General error:', { error: error.message, timestamp: new Date().toISOString() })
      setProducts(getMockProducts())
      toast.warning('Using demo data', {
        description: 'Unable to connect to database. Showing demo products.'
      })
    } finally {
      setLoading(false)
    }
  }

  const getMockProducts = () => [
    {
      id: 1,
      name: "Blue Jeans",
      category: "jeans",
      original_price: 100.00,
      sale_price: 50.00,
      discount_percentage: 50,
      stock_status: "Full-Stock",
      styles_available: 2,
      image_url: "/img/jeans.avif",
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      name: "T-Shirt Green Kids",
      category: "t-shirts",
      original_price: 100.00,
      sale_price: 50.00,
      discount_percentage: 50,
      stock_status: "Out-Of-Stock",
      styles_available: 2,
      image_url: "/img/t-shirt.avif",
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      name: "Classic Sneakers",
      category: "sneakers",
      original_price: 120.00,
      sale_price: 80.00,
      discount_percentage: 33,
      stock_status: "Full-Stock",
      styles_available: 3,
      image_url: "/img/sneakers.avif",
      created_at: new Date().toISOString()
    },
    {
      id: 4,
      name: "Casual Shirt",
      category: "shirts",
      original_price: 80.00,
      sale_price: 60.00,
      discount_percentage: 25,
      stock_status: "Promotions",
      styles_available: 4,
      image_url: "/img/shirts.avif",
      created_at: new Date().toISOString()
    }
  ]

  const handleDelete = async (id) => {
    const productToDelete = products.find(product => product.id === id)
    
    toast('Are you sure you want to delete this product?', {
      description: `This will permanently remove "${productToDelete?.name || 'Product'}" from your inventory.`,
      action: {
        label: 'Delete',
        onClick: async () => {
          try {
            const { error } = await supabase
              .from('products')
              .delete()
              .eq('id', id)

            if (error) throw error

            setProducts(products.filter(product => product.id !== id))
            
            toast.success('Product deleted successfully!', {
              description: `${productToDelete?.name || 'Product'} has been removed from your inventory.`
            })
          } catch (error) {
            console.error('ProductList: Error deleting product:', { error: error.message, productId, timestamp: new Date().toISOString() })
            toast.error('Failed to delete product', {
              description: 'An error occurred while deleting the product. Please try again.'
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

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const categories = ['all', 'jeans', 't-shirts', 'sneakers', 'shirts']

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Products Management</h2>
          <p className="text-sm sm:text-base text-gray-600 mt-1">Manage your product inventory and details</p>
        </div>
        <Button onClick={onAdd} className="bg-indigo-600 hover:bg-indigo-700 w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-gray-400 flex-shrink-0" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm w-full sm:w-auto"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="flex flex-col items-center justify-center py-12 sm:py-16 px-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Package className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 text-center">
              {searchTerm ? 'No products found' : 'No products yet'}
            </h3>
            <p className="text-sm sm:text-base text-gray-500 mb-6 text-center max-w-md">
              {searchTerm 
                ? 'Try adjusting your search terms or clear the search to see all products.' 
                : 'Get started by adding your first product to manage your inventory.'
              }
            </p>
            {!searchTerm && (
              <Button onClick={onAdd} className="bg-indigo-600 hover:bg-indigo-700 w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Product
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow duration-200 overflow-hidden">
              {/* Product Image */}
              <div className="relative h-40 sm:h-48 bg-gray-100">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                ) : null}
                <div 
                  className={`w-full h-full flex items-center justify-center ${product.image_url ? 'hidden' : 'flex'}`}
                >
                  <ImageIcon className="h-12 w-12 text-gray-400" />
                </div>
                
                {/* Action Buttons Overlay */}
                <div className="absolute top-2 right-2 flex space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(product)}
                    className="h-8 w-8 sm:h-9 sm:w-9 bg-white/90 hover:bg-white hover:text-indigo-600 shadow-sm"
                  >
                    <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(product.id)}
                    className="h-8 w-8 sm:h-9 sm:w-9 bg-white/90 hover:bg-white hover:text-red-600 shadow-sm"
                  >
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>

                {/* Discount Badge */}
                {product.discount_percentage > 0 && (
                  <div className="absolute top-2 left-2">
                    <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium bg-red-500 text-white">
                      {product.discount_percentage}% OFF
                    </span>
                  </div>
                )}
              </div>

              <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6">
                <div className="space-y-1 sm:space-y-2">
                  <CardTitle className="text-base sm:text-lg font-semibold text-gray-900 line-clamp-2">
                    {product.name}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                      {product.category}
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0 px-3 sm:px-6 pb-3 sm:pb-6">
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-gray-500">Price:</span>
                    <div className="text-right">
                      <span className="text-base sm:text-lg font-semibold text-gray-900">
                        ${product.sale_price}
                      </span>
                      {product.original_price > product.sale_price && (
                        <span className="text-xs sm:text-sm text-gray-500 line-through ml-1 sm:ml-2">
                          ${product.original_price}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-gray-500">Stock:</span>
                    <span className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs font-medium ${
                      product.stock_status === 'Full-Stock' ? 'bg-green-100 text-green-800' :
                      product.stock_status === 'Out-Of-Stock' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {product.stock_status}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs sm:text-sm text-gray-500">Styles:</span>
                    <span className="text-xs sm:text-sm font-medium text-gray-900">{product.styles_available}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductList
