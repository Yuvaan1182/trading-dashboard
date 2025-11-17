import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "./ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import type { HistoryPoint } from "@/types";

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

const AppAreaChart = ({
  history,
  selectedStocks,
}: {
  history: HistoryPoint[];
  selectedStocks: string[];
}) => {
  const [range, setRange] = useState<
    "1h" | "24h" | "7d" | "30d" | "1mo" | "week" | "month" | "all"
  >("24h");

  const toDate = (h: HistoryPoint) => new Date(h.date);

  // -------------------------------------------
  // Weekly + Monthly grouping helper
  // -------------------------------------------
  const groupLast = (items: HistoryPoint[], keyFn: (d: Date) => string) => {
    const map = new Map<string, HistoryPoint>();

    for (const it of items) {
      const d = toDate(it);
      const key = keyFn(d);
      map.set(key, { ...it, bucket: key }); // Save bucket field
    }
    return Array.from(map.values());
  };

  // -------------------------------------------
  // FILTERING LOGIC
  // -------------------------------------------
  const filtered = useMemo(() => {
    if (!history?.length) return [];

    const now = new Date();

    // 1h & 24h (high resolution)
    if (range === "1h" || range === "24h") {
      const ms = range === "1h" ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000;

      const cutoff = new Date(now.getTime() - ms);
      return history.filter((h) => toDate(h) >= cutoff);
    }

    // 7d / 30d / 1mo (date-only filters)
    if (range === "7d" || range === "30d" || range === "1mo") {
      const days = range === "7d" ? 7 : range === "30d" ? 30 : 30;
      const cutoff = new Date(now.getTime() - days * 86400000);

      return history.filter((h) => toDate(h) >= cutoff);
    }

    // Week-wise bucket (ISO week)
    if (range === "week") {
      return groupLast(history, (d) => {
        const year = d.getUTCFullYear();
        const firstJan = new Date(Date.UTC(year, 0, 1));
        const days = Math.floor((d.getTime() - firstJan.getTime()) / 86400000);
        const week = Math.ceil((days + firstJan.getUTCDay() + 1) / 7);
        return `${year}-W${week}`;
      });
    }

    // Month-wise bucket: YYYY-MM
    if (range === "month") {
      return groupLast(
        history,
        (d) => `${d.getFullYear()}-${d.getMonth() + 1}`
      );
    }

    return history;
  }, [history, range, groupLast]);

  // -------------------------------------------
  // X-AXIS CONFIG (dynamic)
  // -------------------------------------------
  const { xKey, formatX } = useMemo(() => {
    switch (range) {
      case "1h":
      case "24h":
        return {
          xKey: "time",
          formatX: (v: string) => v,
        };

      case "7d":
      case "30d":
      case "1mo":
        return {
          xKey: "date",
          formatX: (v: string) =>
            new Date(v).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
        };

      case "week":
        return {
          xKey: "bucket",
          formatX: (v: string) => v, // e.g. "2025-W04"
        };

      case "month":
        return {
          xKey: "bucket",
          formatX: (v: string) => v, // e.g. "2025-12"
        };

      case "all":
      default:
        return {
          xKey: "date",
          formatX: (v: string) =>
            new Date(v).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            }),
        };
    }
  }, [range]);

  // -----------------------------
  // Dynamic Chart Legend Colors
  // -----------------------------
  const chartConfig: ChartConfig = selectedStocks.reduce((acc, symbol, idx) => {
    acc[symbol] = {
      label: symbol,
      color: COLORS[idx % COLORS.length],
    };
    return acc;
  }, {} as ChartConfig);

  // -----------------------------
  // Empty State
  // -----------------------------
  if (!selectedStocks.length || !history.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Stocks Selected</CardTitle>
          <CardDescription>Select stocks from sidebar</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // -----------------------------
  // CHART RENDER
  // -----------------------------
  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center justify-between border-b py-5">
        <div>
          <CardTitle>Live Stock Prices</CardTitle>
          <CardDescription>Updated in real-time</CardDescription>
        </div>

        <Select value={range} onValueChange={(v) => setRange(v as any)}>
          <SelectTrigger className="w-44 rounded-lg">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1h">Last 1 hour</SelectItem>
            <SelectItem value="24h">Last 24 hours</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="1mo">Last 1 month</SelectItem>
            <SelectItem value="week">Week-wise</SelectItem>
            <SelectItem value="month">Month-wise</SelectItem>
            <SelectItem value="all">All</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[300px] w-full"
        >
          <AreaChart data={filtered}>
            <defs>
              {selectedStocks.map((symbol, idx) => (
                <linearGradient
                  key={symbol}
                  id={`gradient-${symbol}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor={COLORS[idx % COLORS.length]}
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor={COLORS[idx % COLORS.length]}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              ))}
            </defs>

            <CartesianGrid vertical={false} strokeOpacity={0.35} />

            {/* ----------------- X Axis ----------------- */}
            <XAxis
              dataKey={xKey}
              tickFormatter={formatX}
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              minTickGap={28}
            />

            {/* ----------------- Y Axis ----------------- */}
            <YAxis
              width={64}
              tickMargin={8}
              tickLine={false}
              axisLine={false}
              domain={["auto", "auto"]}
              tickFormatter={(v) => Number(v).toFixed(2)}
            />

            {/* Tooltip */}
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                  labelFormatter={(v) => v}
                />
              }
            />

            {/* Stock Areas */}
            {selectedStocks.map((symbol, idx) => (
              <Area
                key={symbol}
                dataKey={symbol}
                type="monotone"
                strokeWidth={2}
                stroke={COLORS[idx % COLORS.length]}
                fill={`url(#gradient-${symbol})`}
                dot={false}
                isAnimationActive={false}
              />
            ))}

            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default AppAreaChart;
