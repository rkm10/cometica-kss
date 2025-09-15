import React from 'react'

const HeroSection = ({isDarkMode}) => {
  return (
    <section className="relative min-h-screen bg-background flex items-center justify-center overflow-hidden px-6 lg:px-[50px]">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          src="/video/hero.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          onError={(e) => {
            console.error('HeroSection: Video failed to load:', { error: e.message, videoSrc: '/video/hero.mp4', timestamp: new Date().toISOString() });
            // Hide video element if it fails to load
            e.target.style.display = 'none';
          }}
        />
        {/* Dark overlay gradient for better text readability and scroll effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-transparent z-10"></div>
        <div
          className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent z-10"
          style={{ background: `linear-gradient(to bottom, transparent, transparent, hsl(var(--background) / ${isDarkMode === true ? '11.8' : '0.2'}))` }}
        ></div>
      </div>
    </section>
  )
}

export default HeroSection
