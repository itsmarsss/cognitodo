package main

import (
	"cognitodo/backend/api"
	"cognitodo/backend/config"
	"cognitodo/backend/models"
)

func main() {
	// Load configuration from environment variables
	config.InitConfig()

	// Establish database connection
	models.ConnectDatabase()

	// Set up the API router
	router := api.SetupRouter()

	// Start the server on port 8080
	router.Run(":8080")
}