import React, { useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Mail, ArrowRight } from 'lucide-react'

const NewsletterSection = ({isDarkMode}) => {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubscribe = async (e) => {
    e.preventDefault()
    if (email) {
      // Here you would typically send the email to your backend or Supabase
      console.info('Newsletter subscription:', { email, timestamp: new Date().toISOString() })
      setIsSubscribed(true)
      setEmail('')
      
      // Reset the success message after 3 seconds
      setTimeout(() => {
        setIsSubscribed(false)
      }, 3000)
    }
  }

  return (
    <section className="h-[100vh] relative overflow-hidden">
      {/* Background Image with Infinite Scroll */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 animate-scroll">
          <img
            src="/img/newsletter.avif"
            alt="Newsletter Background"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="absolute inset-0 animate-scroll-delayed">
          <img
            src="/img/newsletter.avif"
            alt="Newsletter Background"
            className="w-full h-full object-contain"
          />
        </div>
      </div>
      {isDarkMode === false ? (
        <div className="absolute inset-0 bg-white/80"></div>
      ) : (
        <></>
      )}
      
      <div className="max-w-[1440px] mx-auto px-6 lg:px-[50px] relative z-10 h-full flex items-center justify-center">
        <div className="text-center text-foreground">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-wider">
            DISCOVER STYLE
          </h2>
          <h3 className="text-4xl md:text-5xl font-bold mb-8 tracking-wider">
            JUST A BUTTON PRESS AWAY!
          </h3>
          
          {isSubscribed ? (
            <div className="bg-green-500 text-white px-6 py-3 rounded-lg inline-block">
              <p className="text-lg font-semibold">Thank you for subscribing!</p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="max-w-md mx-auto mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <Input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 text-foreground bg-background border-border"
                  required
                />
                <Button 
                  type="submit" 
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-8"
                >
                  Subscribe
                </Button>
              </div>
            </form>
          )}
          
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            INSTANTLY ACCESS THE LATEST FASHION TRENDS AND EXCLUSIVE DEALS ON OUR SITE. 
            DISCOVER YOUR IMPACT STYLE IN A FEW CLICKS!
          </p>
        </div>
      </div>
      
    </section>
  )
}

export default NewsletterSection
