import { CurrencyConverter } from "@/components/currency-converter";
import { ThemeController } from "@/components/theme-controller";
import { Toaster } from "@/components/ui/sonner";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-24">
      <ThemeController />
      <div className="w-full max-w-3xl">
        <h1 className="mb-8 text-center text-3xl font-bold tracking-tight">
          Currency Converter
        </h1>
        <CurrencyConverter />
        <Toaster position="bottom-right" />
      </div>
    </main>
  );
}
