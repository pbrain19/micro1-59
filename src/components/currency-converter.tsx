"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ArrowLeftRight, History, Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { CurrencyInput } from "./currency-input";
import { FrequentlyUsedDialog } from "./currency-dialogs/frequently-used-dialog";
import { FavoritesDialog } from "./currency-dialogs/favorites-dialog";
import { ConfirmationModal } from "./currency-dialogs/confirmation-modal";
import { getMockExchangeRate } from "@/lib/utils";
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
  const [confirmationOpen, setConfirmationOpen] = useState(false);

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
    if (isCurrentPairFavorite) {
      // If it's already a favorite, show confirmation dialog
      setConfirmationOpen(true);
    } else {
      // If it's not a favorite, add it without confirmation
      addToFavorites();
    }
  };

  // Add to favorites function
  const addToFavorites = () => {
    const pair = { from: fromCurrency, to: toCurrency };
    setFavorites((prev) => [...prev, pair]);
    toast.success(`Added ${fromCurrency}/${toCurrency} to favorites`);
  };

  // Remove from favorites function
  const removeFromFavorites = () => {
    const pair = { from: fromCurrency, to: toCurrency };

    // Store a copy of current favorites for undo
    const previousFavorites = [...favorites];

    setFavorites((prev) =>
      prev.filter((item) => !(item.from === pair.from && item.to === pair.to))
    );

    toast.success(`Removed ${fromCurrency}/${toCurrency} from favorites`, {
      action: {
        label: "Undo",
        onClick: () => {
          // Restore favorites to previous state, maintaining the removed item's position
          const restoredFavorites = [...previousFavorites];
          setFavorites(restoredFavorites);
          toast.success(`Restored ${fromCurrency}/${toCurrency} to favorites`);
        },
      },
    });
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

  const modalButtons = () => (
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
            <p>Favorites</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );

  return (
    <>
      <Card className="w-full">
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
        <CardFooter className="flex max-sm:flex-col flex-row justify-between">
          <div className="flex items-center justify-end max-sm:hidden">
            {modalButtons()}
          </div>
          <div className="flex md:flex-row flex-col-reverse max-sm:w-full  items-center max-sm:items-end space-x-2">
            <div className="max-sm:w-full text-right max-sm:mt-4">
              <div className="sm:hidden float-left">{modalButtons()}</div>
              <p className="text-sm text-muted-foreground">
                1 {fromCurrency} = {exchangeRate} {toCurrency}
              </p>
              <p className="text-xs text-muted-foreground">
                Last updated: {lastUpdated}
              </p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="w-full md:w-auto max-md:mb-2"
              onClick={toggleFavorite}
            >
              {isCurrentPairFavorite
                ? "Remove from Favorites"
                : "Add to Favorites"}
            </Button>
          </div>
        </CardFooter>
      </Card>

      {/* Dialogs */}
      <FrequentlyUsedDialog
        open={frequentlyUsedOpen}
        onOpenChange={setFrequentlyUsedOpen}
        frequentlyUsed={frequentlyUsed}
        selectCurrencyPair={selectCurrencyPair}
      />

      <FavoritesDialog
        open={favoritesOpen}
        onOpenChange={setFavoritesOpen}
        favorites={favorites}
        selectCurrencyPair={selectCurrencyPair}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmationOpen}
        onClose={() => setConfirmationOpen(false)}
        onConfirm={removeFromFavorites}
        title="Remove from Favorites"
        description={`Are you sure you want to remove ${fromCurrency}/${toCurrency} from your favorites?`}
        confirmLabel="Remove"
        cancelLabel="Cancel"
      />
    </>
  );
}
