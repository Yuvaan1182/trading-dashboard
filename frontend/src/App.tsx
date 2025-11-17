import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";
import { AppSidebar } from "./components/AppSideBar";
import { OrderForm } from "./components/OrderForm";
import AppAreaChart from "./components/AppAreaChart";
import AppDataTable from "./components/AppDataTable";
import { Separator } from "./components/ui/separator";

import type { Order, PriceMap, StockMap } from "./types";
import { useEffect, useState } from "react";
import { api } from "./lib/api"; // axios instance

const WS_BASE_URL = "ws://localhost:8000";

function App() {
  const [stocks, setStocks] = useState<StockMap>({});
  const [orders, setOrders] = useState<Order[]>([]);
  const [stockPriceHistory, setStockPriceHistory] = useState<any[]>([]);
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>(["AAPL"]);

  // -------------------------------------------------------------------
  // 1. Initial Prices + WebSocket Live Updates
  // -------------------------------------------------------------------
  useEffect(() => {
    let ws: WebSocket | null = null;

    const fetchInitialPrices = async () => {
      try {
        const response = await api.get<PriceMap>("/prices");
        const data = response.data;

        const initial: StockMap = {};

        for (const symbol in data) {
          initial[symbol] = {
            current: data[symbol],
            previous: data[symbol],
            open: data[symbol],
          };
        }

        setStocks(initial);
      } catch (err) {
        console.error("❌ Error fetching initial prices:", err);
      }
    };

    const connectWebSocket = () => {
      ws = new WebSocket(`${WS_BASE_URL}/ws`);

      ws.onopen = () => console.log("🔌 WebSocket connected");

      ws.onmessage = (event) => {
        const partialUpdate: PriceMap = JSON.parse(event.data);

        setStocks((current) => {
          const updated: StockMap = { ...current };

          for (const symbol in partialUpdate) {
            const newPrice = partialUpdate[symbol];
            const oldPrice = current[symbol]?.current ?? newPrice;

            updated[symbol] = {
              ...current[symbol],
              previous: oldPrice,
              current: newPrice,
            };
          }

          // Build history snapshot
          const snapshot: any = {
            time: new Date().toLocaleTimeString(),
            date: new Date().toISOString(),
          };

          for (const symbol in updated) {
            snapshot[symbol] = updated[symbol].current;
          }

          setStockPriceHistory((prev) => [...prev.slice(-200), snapshot]);

          return updated;
        });
      };

      ws.onclose = () => {
        console.warn("⚠️ WebSocket disconnected. Reconnecting...");
        setTimeout(connectWebSocket, 2000);
      };

      ws.onerror = (err) => {
        console.error("❌ WebSocket error:", err);
        ws?.close();
      };
    };

    fetchInitialPrices().then(connectWebSocket);

    return () => ws?.close();
  }, []);

  // -------------------------------------------------------------------
  // 2. Fetch Orders (Axios)
  // -------------------------------------------------------------------
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get<Order[]>("/orders");
        setOrders(res.data);
      } catch (err) {
        console.error("❌ Error fetching orders:", err);
      }
    })();
  }, []);

  // -------------------------------------------------------------------
  // 3. Place Order (Axios POST)
  // -------------------------------------------------------------------
  const handlePlaceOrder = async (order: Omit<Order, "id" | "timestamp">) => {
    try {
      const res = await api.post<Order>("/orders", order);
      setOrders((prev) => [...prev, res.data]);
    } catch (err) {
      console.error("❌ Error placing order:", err);
    }
  };

  // -------------------------------------------------------------------
  // UI Layout
  // -------------------------------------------------------------------
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <SidebarProvider>
        <div className="h-screen w-screen flex">
          <AppSidebar
            stocks={stocks}
            selected={selectedSymbols}
            onChange={setSelectedSymbols}
            handlePlaceOrder={handlePlaceOrder}
          />

          <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-1">
            <nav className="flex items-center gap-2 py-2 px-4">
              <SidebarTrigger />
              <div className="text-3xl">Dashboard</div>
            </nav>

            <Separator />

            <div className="col-span-1 md:col-span-2 p-4">
              <AppAreaChart
                history={stockPriceHistory}
                selectedStocks={selectedSymbols}
              />
            </div>

            <div className="col-span-1 p-4">
              <OrderForm onSubmit={handlePlaceOrder} />
            </div>

            <div className="col-span-1 p-4">
              <AppDataTable orders={orders} />
            </div>
          </main>
        </div>
      </SidebarProvider>
    </ThemeProvider>
  );
}

export default App;
