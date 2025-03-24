"use client"

import { motion } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "How do I create an account?",
    answer:
      "Creating an account is simple. Click on the 'Get Started' button, fill in your email address and password, and follow the verification steps to secure your account.",
  },
  {
    question: "What cryptocurrencies can I trade?",
    answer:
      "We support a wide range of cryptocurrencies including Bitcoin, Ethereum, Solana, Cardano, and many more. Our platform is constantly adding new tokens based on market demand and thorough security assessments.",
  },
  {
    question: "How secure is the platform?",
    answer:
      "Security is our top priority. We implement bank-level encryption, two-factor authentication, cold storage for the majority of assets, and regular security audits to ensure your funds and data remain safe.",
  },
  {
    question: "What are the trading fees?",
    answer:
      "Our fee structure is transparent and competitive. Trading fees typically range from 0.1% to 0.5% depending on your trading volume and account tier. We don't have hidden fees or charges.",
  },
  {
    question: "How can I deposit or withdraw funds?",
    answer:
      "You can deposit funds via bank transfer, credit/debit card, or by transferring cryptocurrency from another wallet. Withdrawals can be made to your bank account or external crypto wallet, subject to standard verification procedures.",
  },
  {
    question: "Is customer support available 24/7?",
    answer:
      "Yes, our customer support team is available 24/7 to assist with any questions or issues you may encounter. You can reach us through live chat, email, or our dedicated support ticket system.",
  },
]

export default function FAQ() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <motion.div
          className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Frequently Asked Questions</h2>
          <p className="max-w-[700px] text-muted-foreground md:text-xl">
            Find answers to common questions about our platform
          </p>
        </motion.div>

        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg font-medium">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  )
}

