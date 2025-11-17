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
		AllowOrigins:     []string{"http://localhost:5173", "http://localhost:80", "http://localhost"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	router.GET("/prices", controller.GetPricesHandler)
	router.GET("/orders", controller.GetOrderrHandler)
	router.POST("/orders", controller.AddOrderHandler)

	router.GET("/ws", func(c *gin.Context) {
		websocket.WSserver(hub, c)
	})

	log.Println("Server starting on PORT :8000...")
	if err := router.Run(":8000"); err != nil {
		log.Fatal("ListenAndServer: ", err)
	}
}
