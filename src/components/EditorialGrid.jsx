import React from 'react'
import { Button } from './ui/button'

const EditorialGrid = () => {
  const editorialImages = [
    { id: 1, alt: 'Fashion Model 1' },
    { id: 2, alt: 'Fashion Model 2' },
    { id: 3, alt: 'Fashion Model 3' },
    { id: 4, alt: 'Fashion Model 4' },
    { id: 5, alt: 'Fashion Model 5' },
    { id: 6, alt: 'Fashion Model 6' }
  ]

  return (
    <section className="py-16 bg-background">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-[50px]">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl text-muted-foreground mb-2 tracking-widest">
            WELCOME TO
          </h2>
          <h3 className="text-4xl md:text-6xl font-bold text-foreground mb-8 tracking-wider">
            COMETICA
          </h3>
        </div>

        {/* Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {editorialImages.map((image) => (
            <div 
              key={image.id}
              className="relative aspect-square bg-muted rounded-lg overflow-hidden group cursor-pointer"
            >
              {/* Placeholder for fashion image */}
              <div className="w-full h-full bg-gradient-to-br from-muted to-accent flex items-center justify-center">
                <span className="text-6xl text-muted-foreground">👤</span>
              </div>
              
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-background/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Button 
                  variant="outline" 
                  className="bg-card/20 border-border text-foreground hover:bg-card/30"
                >
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}

export default EditorialGrid
