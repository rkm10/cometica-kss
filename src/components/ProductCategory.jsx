import React from 'react'

const ProductCategories = () => {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-[50px]">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4 tracking-wider">
            ELEVATING YOUR STYLE GAME
          </h2>
          <p className="text-[12px] text-muted-foreground mb-8 max-w-2xl mx-auto">
            DISCOVER THE PERFECT BLEND OF COMFORT AND TREND WITH OUR EXCLUSIVE COLLECTION.
            EXPLORE DEALS ON JEANS, SNEAKERS, AND MORE!
          </p>
        </div>

        {/* Product Categories Grid Layout */}
        <div className="grid grid-cols-1 min-[810px]:grid-cols-3 gap-6 mb-12 h-auto min-[810px]:h-[700px]">

          {/* Left Column - Jeans and Shirts */}
          <div className="space-y-6 h-auto min-[810px]:h-[700px]">
            {/* Jeans Category Card */}
            <div className="bg-card text-card-foreground rounded-lg px-6 pt-6 hover:shadow-lg transition-shadow h-[400px] min-[810px]:h-[60%] flex flex-col">
              <h3 className="text-2xl font-bold mb-8 tracking-wider text-center">JEANS</h3>
              <p className="text-xs mb-4 opacity-90 leading-relaxed max-w-[280px] mx-auto text-center">
                Style and comfort meet in our collection of jeans. Discover the latest trends and perfect cuts for an impeccable look.
              </p>
              <div className="flex justify-center items-center flex-1 overflow-hidden">
                <img
                  src="/img/jeans.avif"
                  alt="Jeans with paint roller"
                  className="w-full h-full object-contain object-top rounded relative top-[35px] min-[810px]:top-[55px] scale-[0.8] min-[810px]:scale-[1.1]"
                />
              </div>
            </div>

            {/* Shirts Category Card */}
            <div className="bg-card text-card-foreground rounded-lg px-6 pt-6 hover:shadow-lg transition-shadow h-[250px] min-[810px]:h-[36.5%] flex flex-col">
              <h3 className="text-2xl font-bold mb-2 tracking-wider text-center ">SHIRTS</h3>
              <div className="flex justify-center items-center flex-1 overflow-hidden">
                <img
                  src="/img/shirts.avif"
                  alt="Folded shirts"
                  className="w-full h-full object-contain object-top box-border relative top-[50px] min-[810px]:top-[75px] scale-[1.2] min-[810px]:scale-[1.7]"
                />
              </div>
            </div>
          </div>

          {/* Center Column - Promotions */}
          <div className="flex items-center h-auto min-[810px]:h-[700px]">
            <div className="bg-card text-card-foreground rounded-lg px-6 hover:shadow-lg transition-shadow w-full h-[700px] min-[810px]:h-[700px] flex flex-col overflow-hidden">
              {/* Promotions Top Image */}
              <div className="flex-1 flex-col gap-2 overflow-hidden relative">
                <img
                  src="/img/promotion2.avif"
                  alt="Fashion items flat lay"
                  className="w-full h-full object-contain box-border object-bottom relative bottom-[90px] min-[810px]:bottom-[135px] scale-[1.2] min-[810px]:scale-[1.7]"
                />
              </div>
              <h3 className="text-2xl font-bold mb-8 tracking-wider text-center">PROMOTIONS</h3>
              <p className="text-xs mb-4 opacity-90 leading-relaxed max-w-[280px] mx-auto text-center">
                Explore exclusive deals on our top products. The perfect opportunity to enrich your wardrobe with trendy pieces at affordable prices.
              </p>
              
                {/* Promotions Bottom Image */}
              <div className="flex-1 overflow-hidden">
                  <img
                    src="/img/Promotion1.avif"
                    alt="Additional fashion items"
                    className="w-full h-full object-contain box-border object-top relative top-[70px] min-[810px]:top-[105px] scale-[1.2] min-[810px]:scale-[1.7]"
                  />
                </div>
            </div>
          </div>

          {/* Right Column - T-Shirts and Sneakers */}
          <div className="space-y-6 h-auto min-[810px]:h-[700px]">
            {/* T-Shirts Category Card */}
            <div className="bg-card text-card-foreground rounded-lg  pt-14 hover:shadow-lg transition-shadow h-[250px] min-[810px]:h-[36.5%] flex flex-col">
              <h3 className="text-2xl font-bold mb-8 px-6 tracking-widermax-w-[280px] mx-auto text-center">T-SHIRTS</h3>
              <div className="flex justify-center items-center flex-1 overflow-hidden">
                <img
                  src="/img/t-shirt.avif"
                  alt="T-shirts on rack"
                  className="w-full h-[150%] object-contain object-top box-border scale-[1.3] min-[810px]:scale-[1.85] relative top-[25px] min-[810px]:top-[39px]"
                />
              </div>
            </div>

            {/* Sneakers Category Card */}
            <div className="bg-card text-card-foreground rounded-lg  pt-14 hover:shadow-lg transition-shadow h-[400px] min-[810px]:h-[60%] flex flex-col">
              <h3 className="text-2xl font-bold mb-8 tracking-wider text-center px-12">SNEAKERS</h3>
              <p className="text-xs mb-4 opacity-90 leading-relaxed max-w-[280px] mx-auto text-center px-12">
                Passion for fashion and comfort is reflected in every pair of sneakers. Experience style and functionality in a single step.
              </p>
              <div className="flex justify-center items-center flex-1 overflow-hidden">
                <img
                  src="/img/sneakers.avif"
                  alt="Hand holding sneaker"
                  className="w-full h-full object-contain object-top box-border scale-[1.2] min-[810px]:scale-150 relative top-[40px] min-[810px]:top-[60px]"
                />
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  )
}

export default ProductCategories
