package model

import (
	"sync"
)

type PriceManager struct {
	mu     sync.RWMutex
	prices map[string]float64 // key: stock symbol | val: stock price
}

/* --- Get /prices --- */
func GetPrices() map[string]float64 {
	priceManager.mu.RLock()
	defer priceManager.mu.RUnlock()

	// creating a cpy of prices
	prices := make(map[string]float64)
	for symbol, price := range priceManager.prices {
		prices[symbol] = price
	}

	return prices
}

/* --- UPDATE /prices --- */
func UpdatePricesRandomly(chance float64) map[string]float64 {
	priceManager.mu.Lock()
	defer priceManager.mu.Unlock()

	updPrices := make(map[string]float64)

	for symbol, price := range priceManager.prices {

		if lcRand.Float64() < chance {
			priceChangePercent := (lcRand.Float64() * 0.1) - 0.05 // change from -5% to 5%
			newPrice := price * (1 + priceChangePercent)

			/* --- moving price down to 2 decimal --- */
			newPrice = float64(int(newPrice*100)) / 100
			priceManager.prices[symbol] = newPrice
			updPrices[symbol] = newPrice
		}
	}

	return updPrices
}
