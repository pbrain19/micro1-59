"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowLeftRight, History, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { CurrencyInput } from "./currency-input";

// Define types
type CurrencyPair = {
  from: string;
  to: string;
  timestamp?: number;
};

export function CurrencyConverter() {
  // State for currency values
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [fromAmount, setFromAmount] = useState(1);
  const [toAmount, setToAmount] = useState(0);
  const [exchangeRate, setExchangeRate] = useState(0);
  const [lastUpdated, setLastUpdated] = useState("");

  // State for modals
  const [frequentlyUsedOpen, setFrequentlyUsedOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);

  // State for frequently used and favorites
  const [frequentlyUsed, setFrequentlyUsed] = useState<CurrencyPair[]>([]);
  const [favorites, setFavorites] = useState<CurrencyPair[]>([]);

  // Check if current pair is in favorites
  const isCurrentPairFavorite = favorites.some(
    (pair) => pair.from === fromCurrency && pair.to === toCurrency
  );

  // Fetch exchange rate
  useEffect(() => {
    const fetchExchangeRate = async () => {
      try {
        // In a real app, you would use a real API like:
        // const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`)
        // const data = await response.json()
        // const rate = data.rates[toCurrency]

        // For demo purposes, we'll use a mock rate
        const mockRate = getMockExchangeRate(fromCurrency, toCurrency);
        setExchangeRate(mockRate);
        setToAmount(Number.parseFloat((fromAmount * mockRate).toFixed(2)));

        // Update last updated time
        const now = new Date();
        setLastUpdated(now.toLocaleTimeString());

        // Add to frequently used
        addToFrequentlyUsed(fromCurrency, toCurrency);
      } catch (error) {
        console.error("Error fetching exchange rate:", error);
      }
    };

    fetchExchangeRate();
  }, [fromCurrency, toCurrency, fromAmount]);

  // Add to frequently used
  const addToFrequentlyUsed = (from: string, to: string) => {
    setFrequentlyUsed((prev) => {
      // Check if pair already exists
      const existingPairIndex = prev.findIndex(
        (pair) => pair.from === from && pair.to === to
      );

      // If exists, update timestamp and move to top
      if (existingPairIndex !== -1) {
        const updatedPairs = [...prev];
        updatedPairs.splice(existingPairIndex, 1);
        return [{ from, to, timestamp: Date.now() }, ...updatedPairs];
      }

      // Otherwise add new pair
      return [{ from, to, timestamp: Date.now() }, ...prev].slice(0, 10);
    });
  };

  // Toggle favorite
  const toggleFavorite = () => {
    const pair = { from: fromCurrency, to: toCurrency };

    if (isCurrentPairFavorite) {
      setFavorites((prev) =>
        prev.filter((item) => !(item.from === pair.from && item.to === pair.to))
      );
      toast.success(`Removed ${fromCurrency}/${toCurrency} from favorites`);
    } else {
      setFavorites((prev) => [...prev, pair]);
      toast.success(`Added ${fromCurrency}/${toCurrency} to favorites`);
    }
  };

  // Handle currency swap
  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount(toAmount);
  };

  // Handle from amount change
  const handleFromAmountChange = (value: number) => {
    setFromAmount(value);
    setToAmount(Number.parseFloat((value * exchangeRate).toFixed(2)));
  };

  // Handle to amount change
  const handleToAmountChange = (value: number) => {
    setToAmount(value);
    setFromAmount(Number.parseFloat((value / exchangeRate).toFixed(2)));
  };

  // Select currency pair
  const selectCurrencyPair = (from: string, to: string) => {
    setFromCurrency(from);
    setToCurrency(to);
    setFrequentlyUsedOpen(false);
    setFavoritesOpen(false);
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Convert</CardTitle>
            <div className="flex space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setFrequentlyUsedOpen(true)}
                    >
                      <History className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Frequently Used</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setFavoritesOpen(true)}
                    >
                      <Star
                        className="h-4 w-4"
                        fill={isCurrentPairFavorite ? "currentColor" : "none"}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>
                      {isCurrentPairFavorite
                        ? "Remove from favorites"
                        : "Add to favorites"}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="md:flex md:flex-row md:space-x-4 items-center">
            <div>
              <label className="text-sm font-medium leading-none">Amount</label>
              <CurrencyInput
                value={fromAmount}
                onValueChange={handleFromAmountChange}
                currency={fromCurrency}
                onCurrencyChange={setFromCurrency}
              />
            </div>

            <div className="flex justify-center md:mt-6 mt-4">
              <Button
                variant="secondary"
                size="icon"
                onClick={handleSwap}
                className="rounded-full"
              >
                <ArrowLeftRight className="h-4 w-4" />
              </Button>
            </div>

            <div>
              <label className="text-sm font-medium leading-none">
                Converted to
              </label>
              <CurrencyInput
                value={toAmount}
                onValueChange={handleToAmountChange}
                currency={toCurrency}
                onCurrencyChange={setToCurrency}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-start">
          <div className="flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0"
                    onClick={toggleFavorite}
                  >
                    <Star
                      className="mr-1 h-4 w-4"
                      fill={isCurrentPairFavorite ? "currentColor" : "none"}
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    Click to {isCurrentPairFavorite ? "remove from" : "add to"}{" "}
                    favorites
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <p className="text-sm text-muted-foreground">
              1 {fromCurrency} = {exchangeRate} {toCurrency}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Last updated: {lastUpdated}
          </p>
        </CardFooter>
      </Card>

      {/* Frequently Used Modal */}
      <Dialog open={frequentlyUsedOpen} onOpenChange={setFrequentlyUsedOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Frequently Used</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-auto">
            {frequentlyUsed.length > 0 ? (
              <div className="divide-y">
                {frequentlyUsed.map((pair, index) => (
                  <div
                    key={index}
                    className="flex cursor-pointer items-center justify-between p-3 hover:bg-accent"
                    onClick={() => selectCurrencyPair(pair.from, pair.to)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <span className="font-medium">{pair.from}</span>
                        <span>→</span>
                        <span className="font-medium">{pair.to}</span>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {pair.timestamp
                        ? new Date(pair.timestamp).toLocaleDateString()
                        : ""}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="p-4 text-center text-muted-foreground">
                No frequently used pairs yet
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Favorites Modal */}
      <Dialog open={favoritesOpen} onOpenChange={setFavoritesOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Favorites</DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-auto">
            {favorites.length > 0 ? (
              <div className="divide-y">
                {favorites.map((pair, index) => (
                  <div
                    key={index}
                    className="flex cursor-pointer items-center justify-between p-3 hover:bg-accent"
                    onClick={() => selectCurrencyPair(pair.from, pair.to)}
                  >
                    <div className="flex items-center space-x-3">
                      <Star className="h-4 w-4" fill="currentColor" />
                      <div className="flex items-center space-x-1">
                        <span className="font-medium">{pair.from}</span>
                        <span>→</span>
                        <span className="font-medium">{pair.to}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFavorites((prev) =>
                          prev.filter((item, i) => i !== index)
                        );
                        toast.success(
                          `Removed ${pair.from}/${pair.to} from favorites`
                        );
                      }}
                    >
                      <Star className="h-4 w-4" fill="none" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="p-4 text-center text-muted-foreground">
                No favorites yet
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

// Mock exchange rate function (in a real app, you would use an API)
function getMockExchangeRate(from: string, to: string): number {
  const rates: Record<string, Record<string, number>> = {
    USD: {
      EUR: 0.92,
      GBP: 0.78,
      JPY: 151.72,
      CAD: 1.36,
      AUD: 1.51,
      INR: 83.42,
    },
    EUR: {
      USD: 1.09,
      GBP: 0.85,
      JPY: 165.02,
      CAD: 1.48,
      AUD: 1.64,
      INR: 90.67,
    },
    GBP: {
      USD: 1.28,
      EUR: 1.18,
      JPY: 194.14,
      CAD: 1.74,
      AUD: 1.93,
      INR: 106.67,
    },
    JPY: {
      USD: 0.0066,
      EUR: 0.0061,
      GBP: 0.0052,
      CAD: 0.0089,
      AUD: 0.0099,
      INR: 0.55,
    },
    CAD: {
      USD: 0.74,
      EUR: 0.68,
      GBP: 0.57,
      JPY: 111.57,
      AUD: 1.11,
      INR: 61.34,
    },
    AUD: { USD: 0.66, EUR: 0.61, GBP: 0.52, JPY: 100.48, CAD: 0.9, INR: 55.25 },
    INR: {
      USD: 0.012,
      EUR: 0.011,
      GBP: 0.0094,
      JPY: 1.82,
      CAD: 0.016,
      AUD: 0.018,
    },
  };

  // Default fallback rate
  if (!rates[from] || !rates[from][to]) {
    return from === to ? 1 : 1.1;
  }

  return rates[from][to];
}
