import React from 'react'
import { useNavigate } from 'react-router-dom'

const ProductCard = ({ product, screenSize = 'desktop' }) => {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/product/${product.id}`)
  }
  const getStatusBadgeColor = (status) => {
    // Consistent dark grey background with white text for all stock statuses
    return 'bg-gray-700 text-white'
  }

  // Responsive dimensions - compact for mobile grid, standard for other screens
  const getCardDimensions = () => {
    switch (screenSize) {
      case 'mobile':
        return {
          cardWidth: 'w-full',
          imageWidth: 'w-full h-[220px]',
          imageClass: 'w-full h-[220px] object-cover'
        }
      case 'tablet':
        return {
          cardWidth: 'w-[252px]',
          imageWidth: 'w-[252px] h-[372px]',
          imageClass: 'w-[252px] h-[372px] object-cover'
        }
      case 'desktop':
      default: // desktop and large screens
        return {
          cardWidth: 'w-[252px]',
          imageWidth: 'w-[252px] h-[372px]',
          imageClass: 'w-[252px] h-[372px] object-cover'
        }
    }
  }

  const { cardWidth, imageWidth, imageClass } = getCardDimensions()

  return (
    <div 
      className={`group hover:shadow-lg transition-shadow duration-300 ${cardWidth} cursor-pointer`}
      onClick={handleClick}
    >
      <div className="relative overflow-hidden">
        <div className={`${imageWidth} bg-muted flex items-center justify-center`}>
          {product.image_url ? (
            <img 
              src={product.image_url} 
              alt={product.name}
              className={imageClass}
              onError={(e) => {
                e.target.style.display = 'none'
                e.target.nextSibling.style.display = 'flex'
              }}
            />
          ) : null}
          <span 
            className={`text-6xl ${product.image_url ? 'hidden' : 'flex'}`}
            style={{ display: product.image_url ? 'none' : 'flex' }}
          >
            👕
          </span>
        </div>
        <div className="absolute top-2 right-2">
          <span className={`${screenSize === 'mobile' ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-1'} font-semibold ${getStatusBadgeColor(product.stock_status)}`}>
            {product.stock_status}
          </span>
        </div>
        {product.stock_status === 'Out-Of-Stock' && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Out of Stock
            </span>
          </div>
        )}
      </div>
      <div className={`${screenSize === 'mobile' ? 'p-3' : 'p-4'}`}>
        <div className={`${screenSize === 'mobile' ? 'space-y-2' : 'space-y-3'}`}>
          <h3 className={`font-semibold ${screenSize === 'mobile' ? 'text-sm' : 'text-lg'} text-foreground`}>{product.name}</h3>
          <div className="flex items-center space-x-2">
            <span className={`${screenSize === 'mobile' ? 'text-sm' : 'text-lg'} font-bold text-foreground`}>
              ${product.sale_price}
            </span>
            {product.original_price > product.sale_price && (
              <span className={`${screenSize === 'mobile' ? 'text-xs' : 'text-sm'} text-muted-foreground line-through`}>
                ${product.original_price}
              </span>
            )}
            {product.discount_percentage > 0 && (
              <span className={`${screenSize === 'mobile' ? 'text-xs' : 'text-sm'} font-semibold text-red-500`}>
                {product.discount_percentage}
              </span>
            )}
          </div>
          <p className={`${screenSize === 'mobile' ? 'text-xs' : 'text-sm'} text-muted-foreground`}>
            {product.styles_available} Styles Available
          </p>
        </div>
      </div>
    </div>
  )
}

export default ProductCard
