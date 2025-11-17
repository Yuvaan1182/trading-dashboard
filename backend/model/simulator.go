package model

import (
	"log"
	"time"
)

// Define the "constants" for our simulation
const (
	// How often the market "ticks"
	simulationTickRate = 200 * time.Millisecond

	// The probability (e.g., 0.05 = 5%) that a stock's price will change on any given tick
	priceChangeChance = 0.05
)

func PriceSimulator(broadcast chan<- map[string]float64) {
	log.Println("Starting Price Simulation... ")

	ticker := time.NewTicker(simulationTickRate)

	for range ticker.C {
		changedPrices := UpdatePricesRandomly(priceChangeChance)

		if len(changedPrices) > 0 {
			broadcast <- changedPrices
		}
	}
}
