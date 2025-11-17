package controller

import (
	"backend/model"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetPricesHandler(c *gin.Context) {
	prices := model.GetPrices()
	c.JSON(http.StatusOK, prices)
}

func GetOrderrHandler(c *gin.Context) {
	orders := model.GetAllOrders()
	c.JSON(http.StatusOK, orders)
}

func AddOrderHandler(c *gin.Context) {
	var order model.Order

	if err := c.BindJSON(&order); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Request Body: " + err.Error()})
		return
	}

	createOrder := model.AddOrder(order)
	c.JSON(http.StatusCreated, createOrder)
}
