import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Star, Heart, Share2, ShoppingCart, ChevronDown, Menu, Search, X, Instagram, Twitter, Plus, Minus } from 'lucide-react'
import { toast } from 'sonner'
import { supabase } from '../lib/supabase'
import ProductCard from './ProductCard'
import ReusableCarousel from './ui/ReusableCarousel'
import NewsletterSection from './NewsletterSection'

const ProductDetail = ({ isDarkMode }) => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState(0)
  const [similarProducts, setSimilarProducts] = useState([])
  const [ourProducts, setOurProducts] = useState([])
  const [expandedSections, setExpandedSections] = useState({})
  const [showPurchaseDrawer, setShowPurchaseDrawer] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [isCheckingOut, setIsCheckingOut] = useState(false)

  const sizes = [
    { size: 'S', available: true },
    { size: 'M', available: true },
    { size: 'L', available: true },
    { size: 'XL', available: false }
  ]

  const colorVariants = [
    { name: 'Blue', image: product?.image_url, active: true },
    { name: 'Grey', image: product?.image_url, active: false },
    { name: 'Green', image: product?.image_url, active: false }
  ]

  const sections = [
    { id: 'description', label: 'Product Description' },
    { id: 'material', label: 'Material' },
    { id: 'delivery', label: 'Delivery and Returns' }
  ]

  useEffect(() => {
    // Reset component state when product ID changes
    setProduct(null)
    setLoading(true)
    setSelectedSize('')
    setSelectedImage(0)
    setSelectedColor(0)
    setSimilarProducts([])
    setOurProducts([])
    setExpandedSections({})
    
    // Scroll to top when product changes
    window.scrollTo({ top: 0, behavior: 'smooth' })
    
    fetchProduct()
  }, [id])

  useEffect(() => {
    if (product) {
      fetchSimilarProducts()
      fetchOurProducts()
    }
  }, [product])

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      setProduct(data)
    } catch (error) {
      console.error('ProductDetail: Error fetching product:', { error: error.message, productId: id, timestamp: new Date().toISOString() })
    } finally {
      setLoading(false)
    }
  }

  const fetchSimilarProducts = async () => {
    try {
      // Fetch products from the same category as the current product
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', product?.category)
        .neq('id', id)
        .limit(8)

      if (error) throw error
      setSimilarProducts(data || [])
    } catch (error) {
      console.error('ProductDetail: Error fetching similar products:', { error: error.message, category: product?.category, timestamp: new Date().toISOString() })
    }
  }

  const fetchOurProducts = async () => {
    try {
      // Fetch mixed products from all categories
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(8)

      if (error) throw error
      setOurProducts(data || [])
    } catch (error) {
      console.error('ProductDetail: Error fetching our products:', { error: error.message, timestamp: new Date().toISOString() })
    }
  }

  const getStatusBadgeColor = (status) => {
    return 'bg-gray-700 text-white'
  }

  const handlePurchase = () => {
    setShowPurchaseDrawer(true)
  }

  const handleCloseDrawer = () => {
    setShowPurchaseDrawer(false)
    // Reset form when closing without checkout
    setQuantity(1)
    setSelectedSize('')
    setSelectedColor(0)
    setIsCheckingOut(false)
  }

  const handleQuantityChange = (change) => {
    setQuantity(prev => Math.max(1, prev + change))
  }

  const handleCheckout = async () => {
    setIsCheckingOut(true)
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Handle checkout logic
    console.info('ProductDetail: Checkout initiated:', {
      productId: product?.id,
      productName: product?.name,
      selectedSize,
      selectedColor,
      quantity,
      totalPrice: product.sale_price * quantity,
      timestamp: new Date().toISOString()
    })
    
    // Show success toast
    toast.success('Order placed successfully!', {
      description: `Your order for ${product?.name} (${selectedSize || 'No size'}) has been placed. Order total: $${(product?.sale_price * quantity).toFixed(2)}`
    })
    
    // Reset form and close drawer
    setShowPurchaseDrawer(false)
    setQuantity(1)
    setSelectedSize('')
    setSelectedColor(0)
    setIsCheckingOut(false)
  }

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }


  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground text-lg">Loading product...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  // Create multiple images for gallery (using the same image for demo)
  const productImages = [
    product.image_url,
    product.image_url,
    product.image_url,
    product.image_url
  ]

  return (
    <div className="min-h-screen bg-background text-foreground">
     

      <div className="px-6 lg:px-[50px] pb-16 pt-20 min-h-screen">
        {/* Product Detail Back Navigation */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back</span>
        </button>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Product Image Gallery */}
          <div className="space-y-4 sm:sticky sm:top-4 sm:h-[calc(100vh-8rem)] flex flex-col">
            {/* Main Product Image */}
            <div className="flex-1 bg-muted rounded-lg overflow-hidden min-h-0">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
              />
              <div 
                className="w-full h-full flex items-center justify-center text-6xl"
                style={{ display: productImages[selectedImage] ? 'none' : 'flex' }}
              >
                👕
              </div>
            </div>

            {/* Image Navigation Dots */}
            <div className="flex justify-center space-x-2 mt-4 flex-shrink-0">
              {productImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    selectedImage === index ? 'bg-white' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Product Information Section */}
          <div className="space-y-3 sm:space-y-4">
            {/* Product Category Badge */}
            <div className="text-sm text-muted-foreground uppercase tracking-wider">
              {product.category || 'FASHION'}
            </div>

            {/* Product Name and Title */}
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">{product.name}</h1>

            {/* Product Status Indicators */}
            <div className="flex items-center space-x-3">
              <span className={`text-xs px-3 py-1 font-semibold rounded-full ${getStatusBadgeColor(product.stock_status)}`}>
                {product.stock_status}
              </span>
              <span className={`text-xs px-3 py-1 font-semibold rounded-full ${getStatusBadgeColor(product.stock_status)}`}>
                {product.stock_status}
              </span>
            </div>

            {/* Gender Category Badge */}
            <div className="flex items-center space-x-3">
              <span className={`text-xs px-3 py-1 font-semibold rounded-full ${getStatusBadgeColor(product.stock_status)}`}>
                {product.gender || 'Unisex'}
              </span>
            </div>

            {/* Product Pricing Information */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground">
                ${product.sale_price}
              </span>
              {product.original_price > product.sale_price && (
                <>
                  <span className="text-base sm:text-lg lg:text-xl text-muted-foreground line-through">
                    ${product.original_price}
                  </span>
                  <span className="text-base sm:text-lg lg:text-xl font-bold text-foreground">
                    {product.discount_percentage}%
                  </span>
                </>
              )}
            </div>

            {/* Color Variants */}
            <div className="space-y-2 sm:space-y-3">
              <h3 className="text-sm sm:text-base font-semibold text-foreground">Choose Other Versions</h3>
              <div className="flex space-x-2 sm:space-x-3">
                {colorVariants.map((variant, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedColor(index)}
                    className={`w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden border-2 ${
                      selectedColor === index ? 'border-white' : 'border-gray-600'
                    }`}
                  >
                    <img
                      src={variant.image}
                      alt={variant.name}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="space-y-2 sm:space-y-3">
              <h3 className="text-sm sm:text-base font-semibold text-foreground">Choose The Size</h3>
              <div className="flex space-x-2 sm:space-x-3">
                {sizes.map((sizeOption) => (
                  <button
                    key={sizeOption.size}
                    onClick={() => sizeOption.available && setSelectedSize(sizeOption.size)}
                    disabled={!sizeOption.available}
                    className={`w-10 h-10 sm:w-12 sm:h-12 border-2 rounded-lg font-semibold text-sm sm:text-base transition-colors ${
                      selectedSize === sizeOption.size
                        ? 'border-foreground bg-foreground text-background'
                        : sizeOption.available
                        ? 'border-muted-foreground text-foreground hover:border-foreground'
                        : 'border-muted text-muted-foreground cursor-not-allowed opacity-50'
                    }`}
                  >
                    {sizeOption.size}
                  </button>
                ))}
              </div>
            </div>

            {/* Collapsible Sections */}
            <div className="space-y-1">
              {sections.map((section) => (
                <div key={section.id} className="border-b border-border">
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between py-3 text-left"
                  >
                    <span className="text-sm sm:text-base font-medium text-foreground">{section.label}</span>
                    <ChevronDown 
                      className={`w-5 h-5 text-muted-foreground transition-transform ${
                        expandedSections[section.id] ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                  
                  {expandedSections[section.id] && (
                    <div className="pb-3 text-muted-foreground">
                      {section.id === 'description' && (
                        <p className="leading-relaxed">
                          {product.description || 'Premium quality product designed for comfort and style. Made with attention to detail and crafted from the finest materials.'}
                        </p>
                      )}
                      {section.id === 'material' && (
                        <div className="space-y-2">
                          <p>100% Cotton</p>
                          <p>Machine washable</p>
                          <p>Pre-shrunk fabric</p>
                        </div>
                      )}
                      {section.id === 'delivery' && (
                        <div className="space-y-2">
                          <p>Free shipping on orders over $50</p>
                          <p>Standard delivery: 3-5 business days</p>
                          <p>30-day return policy</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Purchase Button */}
            <button
              onClick={handlePurchase}
              className="w-full bg-primary text-primary-foreground py-2 sm:py-3 px-4 sm:px-6 rounded-lg font-semibold text-sm hover:bg-primary/90 transition-colors"
            >
              Purchase Now
            </button>
          </div>
        </div>

        {/* Customer Reviews */}
        <div className="mt-16 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">THE OPINION OF OUR CUSTOMERS</h2>
            <p className="text-foreground">OVER 1,000 SATISFIED CUSTOMERS</p>
          </div>

          {/* Scrolling Reviews Container */}
          <div className="relative overflow-hidden">
            {/* Left fade overlay */}
            <div className="absolute left-0 top-0 bottom-0 w-24 z-10 testimonial-fade-left"></div>
            
            {/* Right fade overlay */}
            <div className="absolute right-0 top-0 bottom-0 w-24 z-10 testimonial-fade-right"></div>
            
            <div 
              className="flex animate-scroll"
              style={{
                width: 'calc(200% + 2rem)',
                animation: 'scroll 35s linear infinite'
              }}
              aria-label="Customer testimonials scrolling carousel"
            >
              {/* First set of reviews */}
              {[
                { name: 'Zebra', rating: 5, comment: "Love these jeans! They're comfy, stylish, and durable. Perfect for everyday wear. Highly recommend!" },
                { name: 'Mateo', rating: 5, comment: "This dress is perfect for summer! It's lightweight, flattering, and has pockets! A bit pricey, but worth it." },
                { name: 'Kai', rating: 5, comment: "This jacket is a must-have for cold weather! It's warm, cozy, and water-resistant. Packs down small for easy travel." },
                { name: 'Jasper', rating: 5, comment: "These sneakers are a classic! They're stylish, comfy, and go with everything. Easy to clean too. Highly recommend!" },
                { name: 'Sarah', rating: 5, comment: "Amazing quality! The fabric is so soft and the fit is perfect. Will definitely buy again!" },
                { name: 'Alex', rating: 5, comment: "Great customer service and fast shipping. The product exceeded my expectations!" },
                { name: 'Emma', rating: 5, comment: "Love the design and comfort. Perfect for both casual and formal occasions!" },
                { name: 'David', rating: 5, comment: "Excellent value for money. High quality materials and great attention to detail!" }
              ].map((review, index) => (
                <div key={`first-${index}`} className="flex-shrink-0 w-80 sm:w-72 md:w-80 lg:w-80 mx-4">
                  <div className="bg-card p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
                    <div className="flex items-center space-x-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-lg">★</span>
                      ))}
                      <span className="text-sm text-muted-foreground ml-2">5/5</span>
                    </div>
                    <p className="text-muted-foreground mb-3 text-sm leading-relaxed">{review.comment}</p>
                    <p className="font-semibold text-foreground">{review.name}</p>
                  </div>
                </div>
              ))}
              
              {/* Duplicate set for seamless loop */}
              {[
                { name: 'Zebra', rating: 5, comment: "Love these jeans! They're comfy, stylish, and durable. Perfect for everyday wear. Highly recommend!" },
                { name: 'Mateo', rating: 5, comment: "This dress is perfect for summer! It's lightweight, flattering, and has pockets! A bit pricey, but worth it." },
                { name: 'Kai', rating: 5, comment: "This jacket is a must-have for cold weather! It's warm, cozy, and water-resistant. Packs down small for easy travel." },
                { name: 'Jasper', rating: 5, comment: "These sneakers are a classic! They're stylish, comfy, and go with everything. Easy to clean too. Highly recommend!" },
                { name: 'Sarah', rating: 5, comment: "Amazing quality! The fabric is so soft and the fit is perfect. Will definitely buy again!" },
                { name: 'Alex', rating: 5, comment: "Great customer service and fast shipping. The product exceeded my expectations!" },
                { name: 'Emma', rating: 5, comment: "Love the design and comfort. Perfect for both casual and formal occasions!" },
                { name: 'David', rating: 5, comment: "Excellent value for money. High quality materials and great attention to detail!" }
              ].map((review, index) => (
                <div key={`second-${index}`} className="flex-shrink-0 w-80 sm:w-72 md:w-80 lg:w-80 mx-4">
                  <div className="p-6 rounded-lg border shadow-sm hover:shadow-md transition-shadow duration-300 h-full">
                    <div className="flex items-center space-x-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-400 text-lg">★</span>
                      ))}
                      <span className="text-sm text-muted-foreground ml-2">5/5</span>
                    </div>
                    <p className="text-muted-foreground mb-3 text-sm leading-relaxed">{review.comment}</p>
                    <p className="font-semibold text-foreground">{review.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-foreground mb-4">SIMILAR PRODUCTS</h2>
            <p className="text-foreground mb-8">RECOMMENDATIONS FOR YOU</p>
            <ReusableCarousel
              items={similarProducts}
              renderItem={(product) => <ProductCard product={product} />}
              itemsPerView={4}
              gap={24}
              itemWidth={252}
              className="px-0"
            />
          </div>
        )}

        {/* Our Products */}
        {ourProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold text-foreground mb-8">OUR PRODUCTS</h2>
            <ReusableCarousel
              items={ourProducts}
              renderItem={(product) => <ProductCard product={product} />}
              itemsPerView={4}
              gap={24}
              itemWidth={252}
              className="px-0"
            />
          </div>
        )}

        {/* Newsletter Section */}
        <NewsletterSection isDarkMode={isDarkMode} />
      </div>

      {/* Purchase Drawer */}
      {showPurchaseDrawer && (
        <div className="fixed inset-0 z-50 animate-in fade-in duration-300">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={handleCloseDrawer}
          />
          
          {/* Drawer */}
          <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-background shadow-2xl transform transition-all duration-300 ease-in-out animate-in slide-in-from-right-full sm:slide-in-from-right-0">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-xl font-semibold text-foreground">Purchase Details</h2>
                <button
                  onClick={handleCloseDrawer}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Product Info */}
                <div className="flex space-x-4">
                  <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={product?.image_url}
                      alt={product?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground truncate">{product?.name}</h3>
                    <p className="text-sm text-muted-foreground capitalize">{product?.category}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-lg font-bold text-foreground">${product?.sale_price}</span>
                      {product?.original_price > product?.sale_price && (
                        <span className="text-sm text-muted-foreground line-through">
                          ${product?.original_price}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Selected Options */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Selected Size</label>
                    <div className="mt-1">
                      {selectedSize ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary text-primary-foreground">
                          {selectedSize}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">No size selected</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Selected Color</label>
                    <div className="mt-1">
                      <span className="text-sm text-foreground capitalize">
                        {colorVariants[selectedColor]?.name || 'Default'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Quantity</label>
                  <div className="flex items-center space-x-3 mt-2">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                      <Minus className="w-4 h-4 text-muted-foreground" />
                    </button>
                    <span className="w-12 text-center font-medium text-foreground">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="border-t border-border pt-4">
                  <h3 className="font-semibold text-foreground mb-3">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-foreground">${(product?.sale_price * quantity).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="text-foreground">Free</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="text-foreground">$0.00</span>
                    </div>
                    <div className="border-t border-border pt-2">
                      <div className="flex justify-between font-semibold">
                        <span className="text-foreground">Total</span>
                        <span className="text-foreground">${(product?.sale_price * quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t border-border p-4 space-y-3">
                <button
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isCheckingOut ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    'Proceed to Checkout'
                  )}
                </button>
                <button
                  onClick={handleCloseDrawer}
                  className="w-full border border-border text-foreground py-3 px-4 rounded-lg font-semibold hover:bg-muted transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default ProductDetail
