package config

import (
	"os"
)

// Configuration represents the application configuration
type Configuration struct {
	OpenAIAPIKey string
}

// Config is the global configuration
var Config Configuration

// LoadConfig loads the configuration from environment variables
func LoadConfig() {
	Config = Configuration{
		OpenAIAPIKey: getEnv("OPENAI_API_KEY", ""),
	}
}

// getEnv gets an environment variable or returns a default value
func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
} 