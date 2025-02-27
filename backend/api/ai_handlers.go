package api

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/itsmarsss/cognitodo/backend/models"
	"github.com/itsmarsss/cognitodo/backend/services"
)

// GeneratePlanRequest represents a request to the AI planner
type GeneratePlanRequest struct {
	TaskDescriptions []string          `json:"taskDescriptions"`
	Date             string            `json:"date"`
	WorkHours        services.WorkHours `json:"workHours"`
	Preferences      string            `json:"preferences,omitempty"`
}

// parseDate parses a date string in YYYY-MM-DD format
func parseDate(dateStr string) (time.Time, error) {
	return time.Parse("2006-01-02", dateStr)
}

// GeneratePlan generates a daily plan using AI
func GeneratePlan(c *gin.Context) {
	var req GeneratePlanRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Parse date
	date, err := parseDate(req.Date)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid date format. Use YYYY-MM-DD"})
		return
	}

	// Convert task descriptions to TaskInput objects
	tasks := make([]services.TaskInput, len(req.TaskDescriptions))
	for i, desc := range req.TaskDescriptions {
		tasks[i] = services.TaskInput{
			Description: desc,
		}
	}

	// Create plan request
	planReq := services.PlanRequest{
		Tasks:       tasks,
		Date:        date,
		WorkHours:   req.WorkHours,
		Preferences: req.Preferences,
	}

	// Generate plan
	plan, err := services.GenerateDailyPlan(planReq)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	// Save the plan in the database
	existingPlan, err := models.GetDailyPlanByDate(date)
	if err == nil {
		// Plan exists, update it
		plan.ID = existingPlan.ID
		plan.CreatedAt = existingPlan.CreatedAt
		if err := models.UpdateDailyPlan(&plan); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	} else {
		// Create new plan
		if err := models.CreateDailyPlan(&plan); err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
	}

	c.JSON(http.StatusOK, plan)
} 