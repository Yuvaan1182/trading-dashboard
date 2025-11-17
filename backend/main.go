package main

import (
	"backend/controller"
	"backend/model"
	"backend/websocket"
	"log"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	broadcastChan := make(chan map[string]float64, 5)
	hub := websocket.NewHub(broadcastChan)

	go hub.Run()

	go model.PriceSimulator(broadcastChan)

	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://3.80.71.198"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	router.GET("/api/prices", controller.GetPricesHandler)
	router.GET("/api/orders", controller.GetOrderrHandler)
	router.POST("/api/orders", controller.AddOrderHandler)

	router.GET("/ws", func(c *gin.Context) {
		websocket.WSserver(hub, c)
	})

	log.Println("Server starting on PORT :8000...")
	if err := router.Run(":8000"); err != nil {
		log.Fatal("ListenAndServer: ", err)
	}
}
