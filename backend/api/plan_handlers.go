package api

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/itsmarsss/cognitodo/backend/models"
)

// GetDailyPlans returns all daily plans
func GetDailyPlans(c *gin.Context) {
	plans, err := models.GetAllDailyPlans()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, plans)
}

// GetDailyPlanByDate returns a daily plan for a specific date
func GetDailyPlanByDate(c *gin.Context) {
	dateStr := c.Param("date")
	date, err := time.Parse("2006-01-02", dateStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format. Use YYYY-MM-DD"})
		return
	}

	plan, err := models.GetDailyPlanByDate(date)
	if err != nil {
		// If no plan exists for the date, create an empty one
		if err.Error() == "record not found" {
			newPlan := models.DailyPlan{
				Date:  date,
				Tasks: []models.Task{},
			}
			c.JSON(http.StatusOK, newPlan)
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, plan)
}

// CreateDailyPlan creates a new daily plan
func CreateDailyPlan(c *gin.Context) {
	var plan models.DailyPlan
	if err := c.ShouldBindJSON(&plan); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Ensure date is just the date portion (no time)
	plan.Date = time.Date(plan.Date.Year(), plan.Date.Month(), plan.Date.Day(), 0, 0, 0, 0, plan.Date.Location())

	// Check if plan already exists for this date
	existingPlan, err := models.GetDailyPlanByDate(plan.Date)
	if err == nil {
		// Plan exists, update it
		plan.ID = existingPlan.ID
		plan.CreatedAt = existingPlan.CreatedAt
		if err := models.UpdateDailyPlan(&plan); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, plan)
		return
	}

	// Create new plan
	if err := models.CreateDailyPlan(&plan); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, plan)
} 