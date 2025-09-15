import React, { useState, useEffect } from 'react'
import ProductCard from './ProductCard'
import ReusableCarousel from './ui/ReusableCarousel'
import MobileCarousel from './ui/MobileCarousel'
import { supabase } from '../lib/supabase'

const TrendingProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) {
        throw error
      }

      setProducts(data || [])
    } catch (err) {
      console.error('TrendingProducts: Error fetching products:', { error: err.message, timestamp: new Date().toISOString() })
      setError('Failed to load products')
      // Fallback to empty array if API fails
      setProducts([])
    } finally {
      setLoading(false)
    }
  }



  if (loading) {
    return (
      <section className="py-16 bg-background">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-[50px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading products...</p>
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 bg-background">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-[50px]">
          <div className="text-center">
            <div className="text-red-500 text-lg mb-4">⚠️ {error}</div>
            <button 
              onClick={fetchProducts}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return (
      <section className="py-16 bg-background">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-[50px]">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-wider">
              TRENDING NOW
            </h2>
            <p className="text-muted-foreground text-lg">No products available at the moment.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-background">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-[50px]">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-wider">
            TRENDING NOW
          </h2>
        </div>
        
        {/* Large Screens (lg+): Two-Row Layout with Different Products */}
        <div className="hidden lg:block space-y-8">
          {/* First Row */}
          <ReusableCarousel
            items={products.slice(0, Math.ceil(products.length / 2))}
            renderItem={(product) => <ProductCard product={product} screenSize="desktop" />}
            itemsPerView={4}
            gap={16}
            itemWidth={252}
          />

          {/* Second Row */}
          <ReusableCarousel
            items={products.slice(Math.ceil(products.length / 2))}
            renderItem={(product) => <ProductCard product={product} screenSize="desktop" />}
            itemsPerView={4}
            gap={16}
            itemWidth={252}
          />
        </div>

        {/* Tablet: Single Row Layout */}
        <div className="hidden sm:block lg:hidden">
          <ReusableCarousel
            items={products}
            renderItem={(product) => <ProductCard product={product} screenSize="tablet" />}
            itemsPerView={3}
            gap={16}
            itemWidth={252}
          />
        </div>

        {/* Mobile: Responsive Grid Layout */}
        <div className="sm:hidden">
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
            {products.map((product, index) => (
              <div key={product.id || index}>
                <ProductCard product={product} screenSize="mobile" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default TrendingProducts

