import React, { useState, useEffect } from 'react'

const ReusableCarousel = ({ 
  items, 
  renderItem, 
  itemsPerView = 5, 
  gap = 16,
  showArrows = true,
  className = "",
  itemWidth = 252
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)
  const [actualItemsPerView, setActualItemsPerView] = useState(itemsPerView)

  useEffect(() => {
    const updateDimensions = () => {
      // Calculate available width (viewport - container padding)
      const availableWidth = window.innerWidth - 100 // Account for container padding (50px each side)
      setContainerWidth(availableWidth)
      
      // Calculate how many items can actually fit
      const totalItemWidth = itemWidth + gap
      const maxItemsPerView = Math.floor(availableWidth / totalItemWidth)
      
      // Use the smaller of requested itemsPerView or what actually fits
      const newItemsPerView = Math.min(itemsPerView, maxItemsPerView)
      setActualItemsPerView(newItemsPerView)
    }
    
    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    
    return () => window.removeEventListener('resize', updateDimensions)
  }, [itemWidth, gap, itemsPerView])

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    const maxIndex = Math.max(0, items.length - actualItemsPerView)
    setCurrentIndex(prev => Math.min(maxIndex, prev + 1))
  }

  const canGoPrev = currentIndex > 0
  const canGoNext = currentIndex < Math.max(0, items.length - actualItemsPerView)
  
  // Always use the fixed itemWidth for consistent card dimensions
  const effectiveItemWidth = itemWidth

  if (!items || items.length === 0) {
    return null
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div 
        className="flex transition-transform duration-300 ease-in-out"
        style={{ 
          transform: `translateX(-${currentIndex * (effectiveItemWidth + gap)}px)`,
          gap: `${gap}px`
        }}
      >
        {items.map((item, index) => (
          <div key={item.id || index} className="flex-shrink-0" style={{ width: `${effectiveItemWidth}px`, minWidth: `${effectiveItemWidth}px` }}>
            {renderItem(item, index)}
          </div>
        ))}
      </div>
      
      {showArrows && (
        <>
          {/* Previous Arrow */}
          <button
            onClick={handlePrev}
            disabled={!canGoPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full border bg-background p-2 shadow-md hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            aria-label="Previous items"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          {/* Next Arrow */}
          <button
            onClick={handleNext}
            disabled={!canGoNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full border bg-background p-2 shadow-md hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            aria-label="Next items"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}
    </div>
  )
}

export default ReusableCarousel
