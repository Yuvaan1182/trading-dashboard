import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar";
import { StockSidebar } from "./StockSideBar";
import type { Order, StockMap } from "@/types";

interface AppSidebarProps {
  stocks: StockMap;
  selected: string[];
  onChange: (symbols: string[]) => void;
  handlePlaceOrder: (order: Omit<Order, "id" | "timestamp">) => void;
}

export function AppSidebar({ stocks, selected, onChange }: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader>
        <h2 className="text-sm font-bold">My Trading App</h2>
      </SidebarHeader>

      <SidebarContent>
        {/* Group 1: The Watchlist */}
        <SidebarGroup>
          <SidebarGroupLabel>Watchlist</SidebarGroupLabel>
          <SidebarGroupContent>
            {/* We're putting our existing StockSidebar component inside */}
            <StockSidebar
              stocks={stocks}
              selected={selected}
              onChange={onChange}
            />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        {/* You can add a footer here, e.g., user profile */}
      </SidebarFooter>
    </Sidebar>
  );
}
