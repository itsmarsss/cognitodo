package api

import (
	"cognitodo/backend/models"
	"cognitodo/backend/services"
	"net/http"

	"github.com/gin-gonic/gin"
)

// GetDailyPlan handles GET /plan
func GetDailyPlan(c *gin.Context) {
	tasks, err := models.GetTasks()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	plan, err := services.GenerateDailyPlan(tasks)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, plan)
}