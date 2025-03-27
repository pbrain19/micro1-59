"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FrequentlyUsedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  frequentlyUsed: {
    from: string;
    to: string;
    timestamp?: number;
  }[];
  selectCurrencyPair: (from: string, to: string) => void;
}

export function FrequentlyUsedDialog({
  open,
  onOpenChange,
  frequentlyUsed,
  selectCurrencyPair,
}: FrequentlyUsedDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
  );
}
