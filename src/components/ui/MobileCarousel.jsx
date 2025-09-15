import React, { useState, useRef, useEffect } from 'react'

const MobileCarousel = ({ items, renderItem }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)
  const containerRef = useRef(null)

  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth)
      }
    }
    
    updateWidth()
    window.addEventListener('resize', updateWidth)
    
    return () => window.removeEventListener('resize', updateWidth)
  }, [])

  const handlePrev = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setCurrentIndex(prev => Math.min(items.length - 1, prev + 1))
  }

  const canGoPrev = currentIndex > 0
  const canGoNext = currentIndex < items.length - 1

  if (!items || items.length === 0) {
    return null
  }

  const itemWidth = 252 // Fixed width to match ProductCard
  const translateX = -currentIndex * (itemWidth + 16) // 16px gap

  return (
    <div className="relative" ref={containerRef}>
      <div className="overflow-hidden">
        <div 
          className="flex transition-transform duration-300 ease-in-out"
          style={{ 
            transform: `translateX(${translateX}px)`,
            gap: '16px'
          }}
        >
          {items.map((item, index) => (
            <div 
              key={item.id || index} 
              className="flex-shrink-0" 
              style={{ width: `${itemWidth}px` }}
            >
              {renderItem(item, index)}
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation Arrows */}
      <button
        onClick={handlePrev}
        disabled={!canGoPrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full border bg-background p-2 shadow-md hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        aria-label="Previous item"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={handleNext}
        disabled={!canGoNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full border bg-background p-2 shadow-md hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        aria-label="Next item"
      >
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-4 space-x-2">
        {items.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              index === currentIndex ? 'bg-primary' : 'bg-muted-foreground/30'
            }`}
            aria-label={`Go to item ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default MobileCarousel
