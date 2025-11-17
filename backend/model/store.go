package model

import (
	"math/rand"
	"time"
)

var (
	priceManager *PriceManager
	orderBook    *OrderHistory
	lcRand       *rand.Rand
)

/* --- Initializing Data --- */
func init() {
	priceManager = &PriceManager{
		prices: map[string]float64{
			"AAPL": 150.25,
			"TSLA": 220.70,
			"AMZN": 130.10,
			"INFY": 18.50,
			"TCS":  42.00,
		},
	}

	orderBook = &OrderHistory{
		orders: []Order{},
	}

	lcRand = rand.New(rand.NewSource(time.Now().UnixNano()))
}
