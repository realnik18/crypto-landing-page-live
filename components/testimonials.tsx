"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

const testimonials = [
  {
    id: 1,
    name: "Alex Johnson",
    role: "Day Trader",
    avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=150&h=150&fit=crop&crop=faces&q=80",
    rating: 5,
    text: "The platform's speed and reliability have completely transformed my trading experience. I can execute trades instantly without worrying about slippage or downtime.",
  },
  {
    id: 2,
    name: "Sarah Chen",
    role: "Long-term Investor",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&h=150&fit=crop&crop=faces&q=80",
    rating: 5,
    text: "As someone focused on long-term investments, the analytical tools and market insights provided by this platform have been invaluable for making informed decisions.",
  },
  {
    id: 3,
    name: "Michael Rodriguez",
    role: "Crypto Enthusiast",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=faces&q=80",
    rating: 4,
    text: "The user interface is incredibly intuitive, making it easy for beginners to navigate the complex world of cryptocurrency trading. Highly recommended!",
  },
  {
    id: 4,
    name: "Emily Wilson",
    role: "Financial Advisor",
    avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&h=150&fit=crop&crop=faces&q=80",
    rating: 5,
    text: "I've recommended this platform to all my clients. The security features and transparent fee structure make it stand out from other trading platforms.",
  },
]

export default function Testimonials() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(0)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
      position: "absolute",
      width: "100%"
    }),
    center: {
      x: 0,
      opacity: 1,
      position: "absolute",
      width: "100%",
      zIndex: 1
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 500 : -500,
      opacity: 0,
      position: "absolute",
      width: "100%"
    })
  }

  const nextSlide = () => {
    setDirection(1)
    setCurrent((prev) => (prev + 1) % testimonials.length)
  }

  const prevSlide = () => {
    setDirection(-1)
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  useEffect(() => {
    // Auto-advance slides every 5 seconds
    timeoutRef.current = setTimeout(nextSlide, 5000)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [current])

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">What Our Users Say</h2>
          <p className="max-w-[700px] text-muted-foreground md:text-xl">
            Trusted by thousands of traders around the world
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden relative h-[400px]">
            <AnimatePresence custom={direction} initial={false}>
              <motion.div
                key={current}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.5 }}
                className="w-full absolute top-0 left-0"
              >
                <Card className="border-none shadow-lg bg-background">
                  <CardContent className="p-6 md:p-10">
                    <div className="flex flex-col items-center text-center space-y-4">
                      <Avatar className="h-20 w-20 border-4 border-primary/20 shadow-lg">
                        <AvatarImage src={testimonials[current].avatar} alt={testimonials[current].name} />
                        <AvatarFallback>{testimonials[current].name.charAt(0)}</AvatarFallback>
                      </Avatar>

                      <div className="space-y-2">
                        <div className="flex justify-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${
                                i < testimonials[current].rating
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>

                        <blockquote className="text-xl md:text-2xl font-medium italic">
                          "{testimonials[current].text}"
                        </blockquote>

                        <div>
                          <div className="font-semibold">{testimonials[current].name}</div>
                          <div className="text-sm text-muted-foreground">{testimonials[current].role}</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 md:-translate-x-6 bg-background shadow-lg rounded-full z-10"
            onClick={() => {
              if (timeoutRef.current) clearTimeout(timeoutRef.current)
              prevSlide()
            }}
          >
            <ChevronLeft className="h-5 w-5" />
            <span className="sr-only">Previous</span>
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 md:translate-x-6 bg-background shadow-lg rounded-full z-10"
            onClick={() => {
              if (timeoutRef.current) clearTimeout(timeoutRef.current)
              nextSlide()
            }}
          >
            <ChevronRight className="h-5 w-5" />
            <span className="sr-only">Next</span>
          </Button>

          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-2.5 h-2.5 rounded-full ${index === current ? "bg-primary" : "bg-primary/20"}`}
                onClick={() => {
                  if (timeoutRef.current) clearTimeout(timeoutRef.current)
                  setDirection(index > current ? 1 : -1)
                  setCurrent(index)
                }}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

