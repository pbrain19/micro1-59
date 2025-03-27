"use client";

import { Star } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FavoritesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  favorites: {
    from: string;
    to: string;
  }[];
  selectCurrencyPair: (from: string, to: string) => void;
}

export function FavoritesDialog({
  open,
  onOpenChange,
  favorites,
  selectCurrencyPair,
}: FavoritesDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                  className="flex cursor-pointer items-center justify-between p-3 hover:bg-accent hover:border-accent-foreground hover:border-1"
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
  );
}
