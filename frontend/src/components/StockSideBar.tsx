import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import type { StockMap } from "@/types";

interface StockSidebarProps {
  stocks: StockMap;
  selected: string[];
  onChange: (symbols: string[]) => void;
}

export function StockSidebar({
  stocks,
  selected,
  onChange,
}: StockSidebarProps) {
  const toggle = (symbol: string) => {
    if (selected.includes(symbol)) {
      onChange(selected.filter((s) => s !== symbol));
    } else {
      onChange([...selected, symbol]);
    }
  };

  return (
    <div className="space-y-2">
      {Object.entries(stocks)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([symbol, data]) => {
          const { current, open } = data;
          const changePercent = open > 0 ? ((current - open) / open) * 100 : 0;
          const isPositive = changePercent >= 0;

          return (
            <div
              key={symbol}
              className="flex items-center space-x-3 border-2 p-2 rounded-lg"
            >
              <Checkbox
                id={symbol}
                checked={selected.includes(symbol)}
                onCheckedChange={() => toggle(symbol)}
              />

              <Label
                htmlFor={symbol}
                className="flex-1 flex justify-between items-center cursor-pointer"
              >
                <span className="font-light text-xs">{symbol}</span>

                <div className="text-right">
                  <span className="font-mono">${current.toFixed(2)}</span>
                  <span
                    className={cn(
                      "ml-2 w-16 inline-block text-right text-xs font-mono",
                      isPositive ? "text-green-500" : "text-red-500"
                    )}
                  >
                    {isPositive ? "+" : ""}
                    {changePercent.toFixed(2)}%
                  </span>
                </div>
              </Label>
            </div>
          );
        })}
    </div>
  );
}
