package api

import (
	"github.com/gin-gonic/gin"
)

// SetupRouter configures and returns the Gin router
func SetupRouter() *gin.Engine {
	r := gin.Default()
	r.POST("/tasks", CreateTask)
	r.GET("/tasks", GetTasks)
	r.GET("/tasks/:id", GetTask)
	r.PUT("/tasks/:id", UpdateTask)
	r.DELETE("/tasks/:id", DeleteTask)
	r.GET("/plan", GetDailyPlan)
	return r
}