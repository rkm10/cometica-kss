import React from 'react'
import { Facebook, Twitter, Instagram, Mail, Youtube } from 'lucide-react'
import { Button } from './ui/button'

const Footer = () => {
  const footerLinks = {
    product: ['Home', 'Advisable', 'Promotions'],
    company: ['Contact', 'Blog', 'FAQ'],
  }

  const socialIcons = [
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'Instagram', icon: Instagram, href: '#' },
    { name: 'Pinterest', icon: Mail, href: '#' },
    { name: 'TikTok', icon: Youtube, href: '#' },
    { name: 'YouTube', icon: Youtube, href: '#' }
  ]

  const paymentMethods = [
    { name: 'Visa', icon: '💳' },
    { name: 'Mastercard', icon: '💳' },
    { name: 'American Express', icon: '💳' },
    { name: 'PayPal', icon: '💳' },
    { name: 'Apple Pay', icon: '📱' },
    { name: 'Google Pay', icon: '📱' }
  ]

  return (
    <footer className="bg-card text-card-foreground relative">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-[50px] py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4 tracking-wider">COMETICA</h3>
            <div className="flex space-x-4 mb-6">
              {socialIcons.map((social) => (
                <a 
                  key={social.name}
                  href={social.href} 
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
            <p className="text-muted-foreground mb-6 max-w-md">
              Welcome to, your fashion destination. Discover the latest trends, 
              find perfect pieces for your wardrobe, and enjoy seamless online shopping.
            </p>
            <p className="text-muted-foreground text-sm">
              © 2025 RAJKUMAR. All rights reserved.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Product</h4>
            <ul className="space-y-2">
              {footerLinks.product.map((link) => (
                <li key={link}>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link}>
                  <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        
      </div>
      
    </footer>
  )
}

export default Footer
