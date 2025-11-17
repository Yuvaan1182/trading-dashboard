package model

import (
	"sync"
	"time"

	"github.com/google/uuid"
)

// Structure of single order placed
type Order struct {
	Id        string    `json:"id"`
	Symbol    string    `json:"symbol"`
	Type      string    `json:"type"`
	Quantity  int       `json:"quantity"`
	Price     float64   `json:"price"`
	Timestamp time.Time `json:"timestamp"`
}

// hold all the order placed
type OrderHistory struct {
	mu     sync.Mutex
	orders []Order
}

/* Reason to use a lock when we are requesting orders
** Because at the time order's might get updated
** GET /orders
**/
func GetAllOrders() []Order {
	orderBook.mu.Lock() // creating a Lock Reading and writing
	defer orderBook.mu.Unlock()

	// create a copy of already placed orders
	tempOrders := make([]Order, len(orderBook.orders))
	copy(tempOrders, orderBook.orders)

	return tempOrders
}

/* Reason to use a lock when we are requesting orders
** Because at the time order's might get updated
** POST /orders
**/

func AddOrder(order Order) Order {
	orderBook.mu.Lock() // locking the orders for writing
	defer orderBook.mu.Unlock()

	order.Id = uuid.New().String()
	order.Timestamp = time.Now().UTC()

	orderBook.orders = append(orderBook.orders, order)

	return order
}
