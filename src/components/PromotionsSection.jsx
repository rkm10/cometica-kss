import React from 'react'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Percent, ArrowRight } from 'lucide-react'

const PromotionsSection = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-primary to-primary/80 relative">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-[50px]">
        <Card className="bg-card/10 backdrop-blur-sm border-border/20">
          <CardContent className="p-8 text-center text-card-foreground">
            <div className="flex justify-center mb-6">
              <div className="bg-card-foreground/20 rounded-full p-4">
                <Percent className="h-12 w-12" />
              </div>
            </div>
            <h2 className="sm:text-2xl md:text-5xl font-bold mb-4 tracking-wider">
              PROMOTIONS
            </h2>
            <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto opacity-90">
              Explore exclusive deals on our top products. The perfect opportunity to enrich 
              your wardrobe with trendy pieces at affordable prices.
            </p>
            <Button 
              size="lg" 
              className="bg-card-foreground text-primary hover:bg-card-foreground/90 text-lg px-8 py-4"
            >
              Explore Promotions
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </CardContent>
        </Card>
      </div>
      
    </section>
  )
}

export default PromotionsSection
