import React, { useState, useEffect } from 'react'
import { Menu, X, Sun, Moon, Search } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

const Header = ({setIsDarkModes}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [isTransparent, setIsTransparent] = useState(true)
  const location = useLocation()
  const isHomePage = location.pathname === '/'

  useEffect(() => {
    // Check for saved theme preference or default to dark mode
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'dark')
      // Apply theme to document
      if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    } else {
      // Default to dark mode
      setIsDarkMode(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

  // Update parent component with current theme state
  useEffect(() => {
    if (setIsDarkModes) {
      setIsDarkModes(isDarkMode)
    }
  }, [isDarkMode, setIsDarkModes])

  useEffect(() => {
    // Handle body scroll lock when menu is open
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  useEffect(() => {
    // Handle escape key to close menu
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false)
      }
    }

    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isMenuOpen])

  useEffect(() => {
    // Handle scroll to make header transparent on hero section (only on home page)
    const handleScroll = () => {
      if (isHomePage) {
        const heroSection = document.querySelector('section')
        if (heroSection) {
          const heroHeight = heroSection.offsetHeight
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop
          
          // Make header transparent when in hero section, opaque when scrolled past
          // Use a smaller threshold to ensure smooth transition
          setIsTransparent(scrollTop < heroHeight - 50)
        }
      } else {
        // On non-home pages, always use themed background (not transparent)
        setIsTransparent(false)
      }
    }

    // Initial check
    handleScroll()
    
    // Add scroll listener
    window.addEventListener('scroll', handleScroll)
    
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isHomePage])

  // Handle route changes to update transparency immediately
  useEffect(() => {
    if (isHomePage) {
      // On home page, let scroll handler manage transparency
      // Just trigger the scroll handler to set initial state
      const handleScroll = () => {
        const heroSection = document.querySelector('section')
        if (heroSection) {
          const heroHeight = heroSection.offsetHeight
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop
          setIsTransparent(scrollTop < heroHeight - 50)
        }
      }
      handleScroll()
    } else {
      // On non-home pages, immediately set to not transparent
      setIsTransparent(false)
    }
  }, [isHomePage])

  const toggleTheme = () => {
    const newTheme = !isDarkMode
    setIsDarkMode(newTheme)
    localStorage.setItem('theme', newTheme ? 'dark' : 'light')
    
    // Apply theme to document
    if (newTheme) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const navigation = [
    { name: 'HOME', href: '/' },
    { name: 'PRODUCT', href: '/products', hasSubmenu: true },
    { name: 'SHORT-BY', href: '/sort', hasSubmenu: true },
    { name: 'BLOG', href: '/blog' },
    { name: 'FAQ', href: '/faq' },
    { name: 'CONTACT', href: '/contact' },
    { name: 'ADMIN', href: '/admin/login' },
  ]

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 group ${
        isTransparent 
          ? 'bg-transparent border-transparent hover:bg-card/90 hover:border-border/50' 
          : isDarkMode 
            ? 'bg-[#0d0d0d] border-b border-border' 
            : 'bg-card border-b border-border'
      }`}>
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Mobile Menu Toggle Button */}
            <div className="flex-shrink-0">
               <button
                 onClick={() => setIsMenuOpen(!isMenuOpen)}
                 className={`transition-colors ${
                   isTransparent 
                     ? (isDarkMode ? 'text-white group-hover:text-white' : 'text-white group-hover:text-black') 
                     : 'text-foreground group-hover:text-muted-foreground'
                 }`}
               >
                <Menu className="h-6 w-6" />
              </button>
            </div>

            {/* Brand Logo */}
            <div className="flex-shrink-0">
               <h1 className={`text-2xl font-bold tracking-wider transition-colors duration-300 ${
                 isTransparent 
                   ? (isDarkMode ? 'text-white group-hover:text-white' : 'text-white group-hover:text-black') 
                   : 'text-foreground group-hover:text-muted-foreground'
               }`}>
                <Link to="/">COMETICA</Link>
              </h1>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center space-x-4">
               <button 
                 onClick={toggleTheme}
                 className={`transition-colors ${
                   isTransparent 
                     ? (isDarkMode ? 'text-white group-hover:text-white' : 'text-white group-hover:text-black') 
                     : 'text-foreground group-hover:text-muted-foreground'
                 }`}
               >
                {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <button className={`transition-colors ${
                isTransparent 
                  ? (isDarkMode ? 'text-white group-hover:text-white' : 'text-white group-hover:text-black') 
                  : 'text-foreground group-hover:text-muted-foreground'
              }`}>
                <Search className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Menu */}
      <div className={`fixed inset-0 z-50 transition-all duration-300 ease-in-out ${
        isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}>
        {/* Backdrop */}
        <div 
          className={`fixed inset-0 bg-background/50 transition-opacity duration-300 ${
            isMenuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setIsMenuOpen(false)}
        />
        
        {/* Navigation Panel */}
        <div className={`relative flex h-full bg-card border-r border-border transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } w-full lg:w-1/3`}>
          <div className="flex flex-col w-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-foreground text-lg font-semibold">MENU</h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-foreground hover:text-muted-foreground transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Navigation Menu Items */}
            <nav className="flex-1 p-4">
              <div className="space-y-1">
                {navigation.map((item, index) => (
                  <div key={item.name}>
                      <Link
                        to={item.href}
                        className={`flex items-center text-foreground hover:text-muted-foreground py-3 px-2 text-sm font-medium transition-colors ${
                          item.name === 'ADMIN' ? 'justify-end' : 'justify-between'
                        }`}
                        onClick={() => setIsMenuOpen(false)}
                      >
                      <span>{item.name}</span>
                      {item.hasSubmenu && (
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </Link>
                    {index < navigation.length - 1 && (
                      <div className="border-t border-border"></div>
                    )}
                  </div>
                ))}
              </div>
            </nav>
          </div>
        </div>
      </div>
    </>
  )
}

export default Header
