"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { ArrowDown, ArrowUp, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

interface Coin {
  id: string
  symbol: string
  name: string
  image: string
  current_price: number
  price_change_percentage_24h: number
  market_cap: number
}

async function fetchCryptoData() {
  const response = await fetch(
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=false",
  )

  if (!response.ok) {
    throw new Error("Failed to fetch crypto data")
  }

  return response.json()
}

export default function CryptoPrices() {
  const [searchTerm, setSearchTerm] = useState("")

  const {
    data: coins,
    isLoading,
    error,
  } = useQuery<Coin[]>({
    queryKey: ["cryptoData"],
    queryFn: fetchCryptoData,
    refetchInterval: 60000, // Refetch every minute
  })

  const filteredCoins = coins?.filter(
    (coin) =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: price < 1 ? 4 : 2,
      maximumFractionDigits: price < 1 ? 6 : 2,
    }).format(price)
  }

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`
    } else {
      return `$${marketCap.toLocaleString()}`
    }
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Live Crypto Prices</h2>
          <p className="max-w-[700px] text-muted-foreground md:text-xl">
            Real-time cryptocurrency market data updated every minute
          </p>
        </div>

        <div className="w-full max-w-4xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by name or symbol..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="w-full max-w-4xl mx-auto rounded-lg border bg-card">
          {error ? (
            <div className="p-8 text-center text-muted-foreground">
              Failed to load crypto data. Please try again later.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">#</TableHead>
                  <TableHead>Coin</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">24h Change</TableHead>
                  <TableHead className="text-right hidden md:table-cell">Market Cap</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array(10)
                    .fill(0)
                    .map((_, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Skeleton className="h-4 w-4" />
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <div className="space-y-1">
                              <Skeleton className="h-4 w-24" />
                              <Skeleton className="h-3 w-12" />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-4 w-20 ml-auto" />
                        </TableCell>
                        <TableCell className="text-right">
                          <Skeleton className="h-4 w-16 ml-auto" />
                        </TableCell>
                        <TableCell className="text-right hidden md:table-cell">
                          <Skeleton className="h-4 w-24 ml-auto" />
                        </TableCell>
                      </TableRow>
                    ))
                ) : filteredCoins?.length ? (
                  filteredCoins.map((coin, index) => (
                    <TableRow key={coin.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <img
                            src={coin.image || "/placeholder.svg"}
                            alt={coin.name}
                            className="h-8 w-8 rounded-full"
                          />
                          <div>
                            <div className="font-medium">{coin.name}</div>
                            <div className="text-xs text-muted-foreground uppercase">{coin.symbol}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-medium">{formatPrice(coin.current_price)}</TableCell>
                      <TableCell className="text-right">
                        <div
                          className={`flex items-center justify-end ${
                            coin.price_change_percentage_24h > 0
                              ? "text-green-500"
                              : coin.price_change_percentage_24h < 0
                                ? "text-red-500"
                                : ""
                          }`}
                        >
                          {coin.price_change_percentage_24h > 0 ? (
                            <ArrowUp className="mr-1 h-4 w-4" />
                          ) : coin.price_change_percentage_24h < 0 ? (
                            <ArrowDown className="mr-1 h-4 w-4" />
                          ) : null}
                          {Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
                        </div>
                      </TableCell>
                      <TableCell className="text-right hidden md:table-cell">
                        {formatMarketCap(coin.market_cap)}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                      No coins found matching your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </section>
  )
}

