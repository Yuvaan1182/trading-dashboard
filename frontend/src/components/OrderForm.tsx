import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Order } from "@/types";

type OrderFormProps = {
  // This onSubmit function will be passed down from App.tsx
  onSubmit: (order: Omit<Order, "id" | "timestamp">) => void;
};

export function OrderForm({ onSubmit }: OrderFormProps) {
  const [symbol, setSymbol] = useState("");
  const [type, setType] = useState<"BUY" | "SELL">("BUY");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Call the function passed in from App.tsx
    onSubmit({
      symbol: symbol.toUpperCase(),
      type,
      quantity: parseInt(quantity, 10),
      price: parseFloat(price),
    });

    // Reset form fields
    setSymbol("");
    setQuantity("");
    setPrice("");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Place Order</CardTitle>
        <CardDescription>Enter details to submit a new order.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="symbol">Symbol</Label>
            <Input
              id="symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              placeholder="e.g., AAPL"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="type">type</Label>
            <Select
              value={type}
              onValueChange={(value: "BUY" | "SELL") => setType(value)}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BUY">BUY</SelectItem>
                <SelectItem value="SELL">SELL</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              placeholder="e.g., 10"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g., 150.25"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Place {type} Order
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
