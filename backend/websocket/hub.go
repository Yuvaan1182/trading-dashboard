package websocket

import (
	"encoding/json"
	"log"
)

type Hub struct {
	clients    map[*Client]bool
	broadcast  <-chan map[string]float64
	register   chan *Client
	unregister chan *Client
}

func NewHub(broadcastChan <-chan map[string]float64) *Hub {
	return &Hub{
		broadcast:  broadcastChan,
		clients:    make(map[*Client]bool),
		register:   make(chan *Client),
		unregister: make(chan *Client),
	}
}

func (h *Hub) Run() {
	for {
		select {

		case client := <-h.register:
			h.clients[client] = true
			log.Println("New client connected. Total:", len(h.clients))

		case client := <-h.unregister:
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.send)
				log.Println("Client disconnected. Total:", len(h.clients))
			}

		case prices := <-h.broadcast:
			priceJSON, err := json.Marshal(prices)
			if err != nil {
				log.Println("Price marshal error:", err)
				continue // don't crash hub
			}

			for client := range h.clients {
				select {
				case client.send <- priceJSON:
				default:
					close(client.send)
					delete(h.clients, client)
					log.Println("Client buffer full — removed client.")
				}
			}
		}
	}
}
