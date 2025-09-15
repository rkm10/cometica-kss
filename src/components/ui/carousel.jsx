import * as React from "react"
import useEmblaCarousel from "embla-carousel-react"
import { cn } from "../../lib/utils"

const CarouselContext = React.createContext(null)

const useCarousel = () => {
  const context = React.useContext(CarouselContext)
  if (!context) {
    throw new Error("useCarousel must be used within a CarouselProvider")
  }
  return context
}

const Carousel = React.forwardRef(({ className, showArrows, ...props }, ref) => {
  const [isDesktop, setIsDesktop] = React.useState(false)
  
  React.useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 768) // md breakpoint
    }
    
    checkIsDesktop()
    window.addEventListener('resize', checkIsDesktop)
    
    return () => window.removeEventListener('resize', checkIsDesktop)
  }, [])

  const emblaOptions = React.useMemo(() => ({
    loop: false,
    dragFree: false,
    containScroll: 'trimSnaps',
    skipSnaps: false,
    slidesToScroll: 1,
    ...(isDesktop && { 
      dragFree: false,
      containScroll: 'trimSnaps',
      skipSnaps: false,
      dragThreshold: 1000000,
      slidesToScroll: 1
    })
  }), [isDesktop])

  const [emblaRef, emblaApi] = useEmblaCarousel(emblaOptions)
  
  const [canScrollPrev, setCanScrollPrev] = React.useState(false)
  const [canScrollNext, setCanScrollNext] = React.useState(false)

  const onSelect = React.useCallback((emblaApi) => {
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [])

  React.useEffect(() => {
    if (!emblaApi) return

    onSelect(emblaApi)
    emblaApi.on("reInit", onSelect)
    emblaApi.on("select", onSelect)
  }, [emblaApi, onSelect])

  const scrollPrev = React.useCallback(() => {
    emblaApi?.scrollPrev()
  }, [emblaApi])

  const scrollNext = React.useCallback(() => {
    emblaApi?.scrollNext()
  }, [emblaApi])

  React.useImperativeHandle(ref, () => ({
    scrollPrev,
    scrollNext,
    canScrollPrev,
    canScrollNext,
  }))

  const value = {
    carouselRef: emblaRef,
    api: emblaApi,
    scrollPrev,
    scrollNext,
    canScrollPrev,
    canScrollNext,
    isDesktop
  }

  return (
    <CarouselContext.Provider value={value}>
      <div className={cn("relative", className)} {...props}>
        <div 
          className={cn(
            "overflow-hidden",
            isDesktop && "pointer-events-none"
          )} 
          ref={emblaRef}
        >
          <div className="flex">
            {props.children}
          </div>
        </div>
        {showArrows && (
          <>
            <button
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 rounded-full border bg-background p-2 shadow-md hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={scrollPrev}
              disabled={!canScrollPrev}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 rounded-full border bg-background p-2 shadow-md hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={scrollNext}
              disabled={!canScrollNext}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </>
        )}
      </div>
    </CarouselContext.Provider>
  )
})
Carousel.displayName = "Carousel"

const CarouselContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex", className)} {...props} />
))
CarouselContent.displayName = "CarouselContent"

const CarouselItem = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("min-w-0 shrink-0 grow-0 basis-full", className)}
    {...props}
  />
))
CarouselItem.displayName = "CarouselItem"

const CarouselPrevious = React.forwardRef(({ className, ...props }, ref) => {
  const { scrollPrev, canScrollPrev } = useCarousel()

  return (
    <button
      type="button"
      className={cn(
        "absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 rounded-full border bg-background p-2 shadow-md hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      onClick={scrollPrev}
      disabled={!canScrollPrev}
      ref={ref}
      {...props}
    >
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 19l-7-7 7-7"
        />
      </svg>
      <span className="sr-only">Previous slide</span>
    </button>
  )
})
CarouselPrevious.displayName = "CarouselPrevious"

const CarouselNext = React.forwardRef(({ className, ...props }, ref) => {
  const { scrollNext, canScrollNext } = useCarousel()

  return (
    <button
      type="button"
      className={cn(
        "absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 rounded-full border bg-background p-2 shadow-md hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed",
        className
      )}
      onClick={scrollNext}
      disabled={!canScrollNext}
      ref={ref}
      {...props}
    >
      <svg
        className="h-4 w-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 5l7 7-7 7"
        />
      </svg>
      <span className="sr-only">Next slide</span>
    </button>
  )
})
CarouselNext.displayName = "CarouselNext"

export { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext }
