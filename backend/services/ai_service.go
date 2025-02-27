package services

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"github.com/itsmarsss/cognitodo/backend/config"
	"github.com/itsmarsss/cognitodo/backend/models"
	"github.com/sashabaranov/go-openai"
)

// TaskInput represents a task input for the AI planner
type TaskInput struct {
	Description string    `json:"description"`
	Duration    int       `json:"duration,omitempty"`
	Priority    string    `json:"priority,omitempty"`
	DueDate     time.Time `json:"dueDate,omitempty"`
}

// PlanRequest represents a request to generate a plan
type PlanRequest struct {
	Tasks       []TaskInput `json:"tasks"`
	Date        time.Time   `json:"date"`
	WorkHours   WorkHours   `json:"workHours"`
	Preferences string      `json:"preferences,omitempty"`
}

// WorkHours represents working hours for planning
type WorkHours struct {
	Start string `json:"start"` // Format: "HH:MM"
	End   string `json:"end"`   // Format: "HH:MM"
}

// GenerateDailyPlan uses OpenAI to generate a daily plan based on tasks
func GenerateDailyPlan(request PlanRequest) (models.DailyPlan, error) {
	client := openai.NewClient(config.Config.OpenAIAPIKey)
	ctx := context.Background()

	// Create system prompt
	systemPrompt := `You are an AI assistant that helps users plan their day optimally.
Your task is to create a daily schedule based on the provided tasks, working hours, and preferences.
- For each task, determine the optimal start and end time.
- Consider task priorities, deadlines, and durations.
- Return your response as a valid JSON object containing an array of tasks with start and end times.
- Each task should include: id (if provided, otherwise 0), title, description, startTime, endTime, priority.
- Do not include any explanations, just the JSON response.
- All times should be in ISO 8601 format (YYYY-MM-DDTHH:MM:SS).
- Make sure no tasks overlap.
- Schedule breaks if appropriate.`

	// Create user prompt
	tasksJSON, err := json.Marshal(request.Tasks)
	if err != nil {
		return models.DailyPlan{}, err
	}

	dateStr := request.Date.Format("2006-01-02")
	userPrompt := fmt.Sprintf(`Please plan my day for %s.
Working hours: from %s to %s.
My tasks: %s
Additional preferences: %s

Output the schedule as JSON.`,
		dateStr, request.WorkHours.Start, request.WorkHours.End, string(tasksJSON), request.Preferences)

	// Create completion request
	resp, err := client.CreateChatCompletion(
		ctx,
		openai.ChatCompletionRequest{
			Model: openai.GPT4o,
			Messages: []openai.ChatCompletionMessage{
				{
					Role:    openai.ChatMessageRoleSystem,
					Content: systemPrompt,
				},
				{
					Role:    openai.ChatMessageRoleUser,
					Content: userPrompt,
				},
			},
			ResponseFormat: &openai.ChatCompletionResponseFormat{
				Type: openai.ChatCompletionResponseFormatTypeJSONObject,
			},
		},
	)

	if err != nil {
		return models.DailyPlan{}, err
	}

	// Parse the response
	var result struct {
		Tasks []struct {
			ID          uint      `json:"id"`
			Title       string    `json:"title"`
			Description string    `json:"description"`
			StartTime   time.Time `json:"startTime"`
			EndTime     time.Time `json:"endTime"`
			Priority    string    `json:"priority"`
			Duration    int       `json:"duration"`
		} `json:"tasks"`
	}

	err = json.Unmarshal([]byte(resp.Choices[0].Message.Content), &result)
	if err != nil {
		return models.DailyPlan{}, err
	}

	// Create daily plan
	plan := models.DailyPlan{
		Date:  request.Date,
		Tasks: make([]models.Task, 0, len(result.Tasks)),
	}

	// Convert tasks
	for _, t := range result.Tasks {
		priority := models.Priority(t.Priority)
		if priority != models.PriorityLow && priority != models.PriorityMedium && priority != models.PriorityHigh {
			priority = models.PriorityMedium
		}

		task := models.Task{
			Title:       t.Title,
			Description: t.Description,
			Priority:    priority,
			Duration:    t.Duration,
			StartTime:   t.StartTime,
			EndTime:     t.EndTime,
		}
		if t.ID > 0 {
			task.ID = t.ID
		}
		plan.Tasks = append(plan.Tasks, task)
	}

	return plan, nil
} 