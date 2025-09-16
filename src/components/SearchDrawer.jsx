import React, { useState, useEffect } from 'react'
import { Search, X, Package, Star, ShoppingCart, Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Card, CardContent } from './ui/card'
import { supabase } from '../lib/supabase'
import { toast } from 'sonner'

const SearchDrawer = ({ isOpen, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState([])

  // Load recent searches from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('recent_searches')
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved))
      } catch (error) {
        console.error('Error parsing recent searches:', error)
      }
    }
  }, [])

  // Fetch all products when drawer opens
  useEffect(() => {
    if (isOpen) {
      fetchProducts()
    }
  }, [isOpen])

  // Filter products based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts([])
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
      setFilteredProducts(filtered)
    }
  }, [searchTerm, products])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('SearchDrawer: Error fetching products:', error)
        // Fallback to mock data
        setProducts(getMockProducts())
        toast.warning('Using demo data', {
          description: 'Unable to connect to database. Showing demo products.'
        })
      } else {
        setProducts(data || getMockProducts())
      }
    } catch (error) {
      console.error('SearchDrawer: General error:', error)
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
    },
    {
      id: 5,
      name: "Vintage Denim Jacket",
      category: "jackets",
      original_price: 150.00,
      sale_price: 120.00,
      discount_percentage: 20,
      stock_status: "Full-Stock",
      styles_available: 2,
      image_url: "/img/jeans.avif",
      created_at: new Date().toISOString()
    },
    {
      id: 6,
      name: "Summer Shorts",
      category: "shorts",
      original_price: 60.00,
      sale_price: 45.00,
      discount_percentage: 25,
      stock_status: "Full-Stock",
      styles_available: 3,
      image_url: "/img/t-shirt.avif",
      created_at: new Date().toISOString()
    }
  ]

  const handleSearch = (term) => {
    setSearchTerm(term)
    if (term.trim() !== '') {
      addToRecentSearches(term)
    }
  }

  const addToRecentSearches = (term) => {
    const trimmedTerm = term.trim()
    if (trimmedTerm === '') return

    const updated = [trimmedTerm, ...recentSearches.filter(item => item !== trimmedTerm)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('recent_searches', JSON.stringify(updated))
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem('recent_searches')
  }

  const handleProductClick = () => {
    onClose()
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const getStockStatusColor = (status) => {
    switch (status) {
      case 'Full-Stock':
        return 'text-green-600 bg-green-100'
      case 'Out-Of-Stock':
        return 'text-red-600 bg-red-100'
      case 'Promotions':
        return 'text-blue-600 bg-blue-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className={`fixed inset-0 z-50 transition-all duration-300 ease-in-out ${
      isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
    }`}>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-background/50 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`fixed right-0 top-0 h-full w-full max-w-md bg-card border-l border-border shadow-2xl transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h2 className="text-lg font-semibold text-foreground">Search Products</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="hover:bg-muted transition-colors duration-200"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Search Input */}
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors duration-200" />
              <Input
                type="text"
                placeholder="Search for products..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 pr-4 h-10 transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
                autoFocus
              />
            </div>
          </div>

          {/* Content */}
          <div className={`flex-1 overflow-y-auto transition-opacity duration-200 ${
            isOpen ? 'opacity-100' : 'opacity-0'
          }`}>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : searchTerm.trim() === '' ? (
              /* Recent Searches */
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-foreground">Recent Searches</h3>
                  {recentSearches.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearRecentSearches}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      Clear
                    </Button>
                  )}
                </div>
                
                {recentSearches.length > 0 ? (
                  <div className="space-y-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(search)}
                        className="flex items-center w-full p-2 text-left text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-all duration-200 group"
                      >
                        <Search className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                        {search}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">Start typing to search for products</p>
                  </div>
                )}
              </div>
            ) : (
              /* Search Results */
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-foreground">
                    {filteredProducts.length} result{filteredProducts.length !== 1 ? 's' : ''} found
                  </h3>
                </div>
                
                {filteredProducts.length > 0 ? (
                  <div className="space-y-3">
                    {filteredProducts.map((product) => (
                      <Link
                        key={product.id}
                        to={`/product/${product.id}`}
                        onClick={handleProductClick}
                        className="block group"
                      >
                        <Card className="hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border-border group-hover:border-primary/20">
                          <CardContent className="p-3">
                            <div className="flex items-center space-x-3">
                              <div className="flex-shrink-0">
                                <img
                                  src={product.image_url}
                                  alt={product.name}
                                  className="h-16 w-16 object-cover rounded-md group-hover:scale-105 transition-transform duration-200"
                                  onError={(e) => {
                                    e.target.src = '/img/placeholder.jpg'
                                  }}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors duration-200">
                                  {product.name}
                                </h4>
                                <p className="text-xs text-muted-foreground capitalize">
                                  {product.category}
                                </p>
                                <div className="flex items-center mt-1 space-x-2">
                                  <span className="text-sm font-semibold text-primary">
                                    {formatPrice(product.sale_price)}
                                  </span>
                                  {product.original_price > product.sale_price && (
                                    <span className="text-xs text-muted-foreground line-through">
                                      {formatPrice(product.original_price)}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center mt-1 space-x-2">
                                  <span className={`text-xs px-2 py-1 rounded-full ${getStockStatusColor(product.stock_status)}`}>
                                    {product.stock_status}
                                  </span>
                                  {product.discount_percentage > 0 && (
                                    <span className="text-xs text-destructive font-medium">
                                      -{product.discount_percentage}%
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">No products found</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">
                      Try searching with different keywords
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchDrawer
