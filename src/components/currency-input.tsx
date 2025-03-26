"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { currencies } from "@/lib/currencies";

interface CurrencyInputProps {
  value: number;
  onValueChange: (value: number) => void;
  currency: string;
  onCurrencyChange: (currency: string) => void;
}

export function CurrencyInput({
  value,
  onValueChange,
  currency,
  onCurrencyChange,
}: CurrencyInputProps) {
  const [open, setOpen] = useState(false);

  // Find the selected currency details
  const selectedCurrency = currencies.find((c) => c.code === currency);

  return (
    <div className="mt-1 flex ">
      <Input
        type="number"
        value={value}
        onChange={(e) => onValueChange(Number.parseFloat(e.target.value) || 0)}
        className="rounded-r-none "
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="md:w-[180px] w-[100px] justify-between rounded-l-none border-l-0"
          >
            <div className="flex items-center gap-2">
              {selectedCurrency?.flag && (
                <span className="mr-1">{selectedCurrency.flag}</span>
              )}
              <span>{currency}</span>
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="md:w-[300px] w-[90%] md:p-0 max-sm:m-auto">
          <Command>
            <CommandInput placeholder="Search currency..." />
            <CommandList>
              <CommandEmpty>No currency found.</CommandEmpty>
              <CommandGroup className="max-h-[300px] overflow-auto">
                {currencies.map((c) => (
                  <CommandItem
                    key={c.code}
                    value={`${c.code} ${c.name}`}
                    onSelect={() => {
                      onCurrencyChange(c.code);
                      setOpen(false);
                    }}
                  >
                    <div className="flex items-center">
                      {c.flag && <span className="mr-2">{c.flag}</span>}
                      <span className="font-medium">{c.code}</span>
                      <span className="ml-2 text-muted-foreground">
                        {c.name}
                      </span>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        currency === c.code ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
