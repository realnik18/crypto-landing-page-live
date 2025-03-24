"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function CTA() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <motion.div
          className="relative overflow-hidden rounded-lg bg-gradient-to-r from-primary/80 via-primary to-primary/80 p-8 md:p-12 lg:p-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Background animated elements */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full bg-white/10"
                style={{
                  width: `${50 + (i * 50)}px`,
                  height: `${50 + (i * 50)}px`,
                  left: `${20 + (i * 15)}%`,
                  top: `${20 + (i * 15)}%`,
                }}
                animate={{
                  x: [0, (i % 2 === 0 ? 1 : -1) * 50],
                  y: [0, (i % 2 === 0 ? 1 : -1) * 50],
                }}
                transition={{
                  duration: 10 + (i * 2),
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                }}
              />
            ))}
          </div>

          <div className="relative z-10 flex flex-col items-center justify-center space-y-6 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                Start Trading Today
              </h2>
              <p className="max-w-[600px] text-white/80 md:text-xl">
                Join thousands of traders and investors who have already discovered the power of our platform.
              </p>
            </div>
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 group">
              Create Your Account
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

