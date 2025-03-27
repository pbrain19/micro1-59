import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Mock exchange rate function (in a real app, you would use an API)
export function getMockExchangeRate(from: string, to: string): number {
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
