package services

import (
	"context"
	"fmt"
	"os"

	"cognitodo/backend/models" // Adjust this import path to your project structure

	"github.com/cohesion-org/deepseek-go"
	"github.com/joho/godotenv"
)

// GenerateDailyPlan uses DeepSeek to create a daily schedule from a list of tasks
func GenerateDailyPlan(tasks []models.Task) (models.DailyPlan, error) {
	// Load environment variables from .env file
	if err := godotenv.Load(); err != nil {
		return models.DailyPlan{}, fmt.Errorf("failed to load .env file: %v", err)
	}

	// Initialize the DeepSeek client with the API key from environment variables
	apiKey := os.Getenv("DEEPSEEK_API_KEY")
	client := deepseek.NewClient(apiKey)

	// Construct the prompt with the list of tasks
	prompt := "You are an intelligent scheduling assistant that optimizes daily plans for efficiency and balance. Given the following tasks, organize them into a structured daily schedule, assigning appropriate start and end times. Prioritize productivity while allowing for necessary breaks and flexibility. Consider factors such as task urgency, duration, and logical sequencing.\n\nTasks:\n"
	
	for _, task := range tasks {
		newDuration := task.Duration

		if newDuration == "0" {
			newDuration = "Not specified"
		}

		prompt += fmt.Sprintf("- ID: %d, Name: %s, Description: %s, Status: %s, Priority: %s, Duration: %s\n", task.ID, task.Name, task.Description, task.Status, task.Priority, newDuration)
	}
	prompt += "\nPlease respond with a JSON object in the following format:\n{\n  \"schedule\": [\n    {\n      \"task_id\": 1,\n      \"start_time\": \"09:00\",\n      \"end_time\": \"10:00\",\n      },\n    ...\n  ]\n}"

	// Create the chat completion request
	resp, err := client.CreateChatCompletion(
		context.Background(),
		&deepseek.ChatCompletionRequest{
			Model: "deepseek-chat", // Replace with actual model name
			Messages: []deepseek.ChatCompletionMessage{
				{
					Role:    "user",
					Content: prompt,
				},
			},
			// ResponseFormat: &deepseek.ChatCompletionResponseFormat{
			//     Type: "json_object",
			// },
		},
	)
	if err != nil {
		return models.DailyPlan{}, fmt.Errorf("failed to create chat completion: %v", err)
	}

	// Extract JSON using JSONExtractor
	extractor := deepseek.NewJSONExtractor(nil)
	var plan struct {
		Schedule []models.ScheduledTask `json:"schedule"`
	}
	if err := extractor.ExtractJSON(resp, &plan); err != nil {
		return models.DailyPlan{}, fmt.Errorf("failed to extract JSON: %v", err)
	}

	// Return the daily plan
	return models.DailyPlan{
		Date:     "today", // Adjust as needed (e.g., use a parameter or current date)
		Schedule: plan.Schedule,
	}, nil
}