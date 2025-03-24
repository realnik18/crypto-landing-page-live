import type { Metadata } from "next"
import Hero from "@/components/hero"
import Features from "@/components/features"
import CryptoPrices from "@/components/crypto-prices"
import PriceChart from "@/components/price-chart"
import HowItWorks from "@/components/how-it-works"
import Testimonials from "@/components/testimonials"
import FAQ from "@/components/faq"
import CTA from "@/components/cta"
import Footer from "@/components/footer"

export const metadata: Metadata = {
  title: "CryptoVerse | Modern Crypto Trading Platform",
  description: "Secure, fast, and reliable crypto investments platform for traders of all levels",
  openGraph: {
    title: "CryptoVerse | Modern Crypto Trading Platform",
    description: "Secure, fast, and reliable crypto investments platform for traders of all levels",
    type: "website",
    url: "https://cryptoverse.com",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CryptoVerse",
      },
    ],
  },
}

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <Hero />
      <Features />
      <CryptoPrices />
      <PriceChart />
      <HowItWorks />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  )
}

