"use client"

import { useState, useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion } from "framer-motion"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  type TooltipProps,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

interface PriceData {
  prices: [number, number][] // [timestamp, price]
}

interface ChartData {
  timestamp: number
  price: number
}

const timeRanges = [
  { value: "1", label: "24H" },
  { value: "7", label: "7D" },
  { value: "30", label: "30D" },
  { value: "90", label: "90D" },
]

async function fetchBitcoinPriceHistory(days: string) {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=${days}`,
  )

  if (!response.ok) {
    throw new Error("Failed to fetch price data")
  }

  return response.json()
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    const date = new Date(label)
    const formattedDate = date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    })
    const formattedTime = date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    })

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="bg-[#1A202C] border border-gray-700 rounded-lg shadow-xl p-4"
      >
        <p className="text-sm text-[#CBD5E0] font-medium">
          {formattedDate} • {formattedTime}
        </p>
        <p className="text-[#4ADE80] text-lg font-bold mt-1">
          $
          {Number(payload[0].value).toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
      </motion.div>
    )
  }

  return null
}

export default function PriceChart() {
  const [timeRange, setTimeRange] = useState("1")
  const [hoveredPrice, setHoveredPrice] = useState<number | null>(null)

  const { data, isLoading, error } = useQuery<PriceData>({
    queryKey: ["bitcoinPrice", timeRange],
    queryFn: () => fetchBitcoinPriceHistory(timeRange),
    refetchInterval: 300000, // Refetch every 5 minutes
  })

  const chartData: ChartData[] = useMemo(() => {
    if (!data?.prices) return []

    // For 24H view, reduce the number of data points to avoid overcrowding
    if (timeRange === "1") {
      const hourlyData = data.prices.filter((_, index) => index % 6 === 0)
      return hourlyData.map(([timestamp, price]) => ({
        timestamp,
        price,
      }))
    }

    return data.prices.map(([timestamp, price]) => ({
      timestamp,
      price,
    }))
  }, [data, timeRange])

  // Calculate price change
  const firstPrice = chartData[0]?.price
  const lastPrice = chartData[chartData.length - 1]?.price
  const priceChange = firstPrice && lastPrice ? ((lastPrice - firstPrice) / firstPrice) * 100 : 0

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price)
  }

  // Handle mouse move to update hovered price
  const handleMouseMove = (e: any) => {
    if (e.activePayload && e.activePayload.length) {
      setHoveredPrice(e.activePayload[0].payload.price)
    }
  }

  // Handle mouse leave to reset hovered price
  const handleMouseLeave = () => {
    setHoveredPrice(null)
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-[#0B1120]">
      <div className="container px-4 md:px-6">
        <motion.div
          className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Bitcoin Price Chart</h2>
          <p className="max-w-[700px] text-muted-foreground md:text-xl">
            Interactive visualization of Bitcoin price movements
          </p>
        </motion.div>

        <motion.div
          className="w-full max-w-5xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-[#0F172A] border-gray-800 shadow-2xl overflow-hidden">
            <CardHeader>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Bitcoin (BTC)</CardTitle>
                  <CardDescription>USD Price History</CardDescription>
                </div>
                <Tabs defaultValue="1" value={timeRange} onValueChange={setTimeRange}>
                  <TabsList>
                    {timeRanges.map((range) => (
                      <TabsTrigger key={range.value} value={range.value}>
                        {range.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              {error ? (
                <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                  Failed to load price data. Please try again later.
                </div>
              ) : isLoading ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-24" />
                  </div>
                  <Skeleton className="h-[400px] w-full" />
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="text-3xl font-bold text-white">
                        {hoveredPrice ? formatPrice(hoveredPrice) : formatPrice(lastPrice || 0)}
                      </div>
                      <div
                        className={`text-sm flex items-center font-medium ${
                          priceChange >= 0 ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {priceChange >= 0 ? "+" : ""}
                        {priceChange.toFixed(2)}% in the last {timeRanges.find((r) => r.value === timeRange)?.label}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400 bg-gray-800/50 px-3 py-1 rounded-full">
                      Last updated: {new Date().toLocaleTimeString()}
                    </div>
                  </div>
                  <div className="h-[400px] w-full bg-[#111827] rounded-xl p-4 md:p-6 shadow-lg">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={chartData}
                        margin={{
                          top: 20,
                          right: 20,
                          left: 20,
                          bottom: 20,
                        }}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={handleMouseLeave}
                      >
                        <defs>
                          <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4ADE80" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#4ADE80" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke="#2D3748"
                          opacity={0.5}
                          vertical={true}
                          horizontal={true}
                        />
                        <XAxis
                          dataKey="timestamp"
                          tickFormatter={(timestamp) => {
                            const date = new Date(timestamp)
                            if (timeRange === "1") {
                              return date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
                            } else if (timeRange === "7") {
                              return date.toLocaleDateString(undefined, { weekday: "short" })
                            } else {
                              return date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
                            }
                          }}
                          stroke="#CBD5E0"
                          tick={{ fontSize: 12, fill: "#CBD5E0" }}
                          axisLine={{ stroke: "#4A5568" }}
                          tickLine={{ stroke: "#4A5568" }}
                          interval="preserveStartEnd"
                          minTickGap={30}
                        />
                        <YAxis
                          tickFormatter={(value) => {
                            if (value >= 1000000000) {
                              return `$${(value / 1000000000).toFixed(1)}B`
                            } else if (value >= 1000000) {
                              return `$${(value / 1000000).toFixed(1)}M`
                            } else if (value >= 1000) {
                              return `$${(value / 1000).toFixed(1)}K`
                            } else {
                              return `$${value}`
                            }
                          }}
                          stroke="#CBD5E0"
                          tick={{ fontSize: 12, fill: "#CBD5E0" }}
                          axisLine={{ stroke: "#4A5568" }}
                          tickLine={{ stroke: "#4A5568" }}
                          width={60}
                          domain={["auto", "auto"]}
                          padding={{ top: 10, bottom: 10 }}
                        />
                        <Tooltip
                          content={<CustomTooltip />}
                          cursor={{ stroke: "#4A5568", strokeWidth: 1, strokeDasharray: "5 5" }}
                          wrapperStyle={{ zIndex: 100, pointerEvents: "none" }}
                        />
                        <Area
                          type="monotone"
                          dataKey="price"
                          stroke="#4ADE80"
                          strokeWidth={0}
                          fillOpacity={1}
                          fill="url(#colorPrice)"
                        />
                        <Line
                          type="monotone"
                          dataKey="price"
                          stroke="#4ADE80"
                          strokeWidth={3}
                          dot={false}
                          activeDot={{
                            r: 5,
                            stroke: "#4ADE80",
                            strokeWidth: 2,
                            fill: "#111827",
                          }}
                          connectNulls={true}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  )
}

