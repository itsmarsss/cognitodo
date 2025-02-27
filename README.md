# CogniTodo - AI-Powered To-Do List Application

CogniTodo is a smart to-do list application that uses AI to help plan your day based on your tasks. Simply tell the app what you need to do, and it will organize your tasks into an optimal schedule.

## Features

-   **AI Task Planning**: Enter your tasks in natural language, and the app will plan your day.
-   **Task Management**: Create, update, and delete tasks with ease.
-   **Priority Management**: AI-based priority assignment for tasks.
-   **Time Blocking**: Intelligent time allocation for your tasks.

## Tech Stack

-   **Backend**: Go (with Gin framework)
-   **Frontend**: React Native
-   **AI Integration**: OpenAI API

## Project Structure

```
cognitodo/
├── backend/         # Go backend API
├── frontend/        # React Native mobile app
└── docs/            # Documentation
```

## Getting Started

### Prerequisites

-   Go 1.21+
-   Node.js 18+
-   npm or yarn
-   React Native development environment
-   OpenAI API key

### Running the Backend

```bash
cd backend
go mod download
go run main.go
```

### Running the Frontend

```bash
cd frontend
npm install
npx react-native start
```

### Elaborate Project Structure

```
cognitodo/
├── backend/
│   ├── api/
│   │   ├── ai_handlers.go
│   │   ├── plan_handlers.go
│   │   ├── routes.go
│   │   └── task_handlers.go
│   ├── config/
│   │   └── config.go
│   ├── models/
│   │   ├── daily_plan.go
│   │   ├── db.go
│   │   └── task.go
│   ├── services/
│   │   └── ai_service.go
│   ├── go.mod
│   ├── go.sum
│   └── .gitignore
│
└── frontend/
    ├── android/
    │   ├── app/
    │   │   ├── build.gradle
    │   │   ├── proguard-rules.pro
    │   │   └── src/
    │   │       ├── debug/
    │   │       │   └── AndroidManifest.xml
    │   │       └── main/
    │   │           ├── AndroidManifest.xml
    │   │           ├── java/com/frontend/
    │   │           │   ├── MainActivity.kt
    │   │           │   └── MainApplication.kt
    │   │           └── res/
    │   ├── build.gradle
    │   ├── gradle.properties
    │   ├── gradlew
    │   └── settings.gradle
    ├── ios/
    │   ├── frontend/
    │   │   ├── AppDelegate.swift
    │   │   ├── Info.plist
    │   │   ├── LaunchScreen.storyboard
    │   │   └── PrivacyInfo.xcprivacy
    │   ├── frontend.xcodeproj/
    │   ├── Podfile
    │   └── Podfile.lock
    ├── src/
    │   ├── components/
    │   │   ├── DailySchedule.js
    │   │   └── TaskList.js
    │   ├── screens/
    │   │   ├── AddTaskScreen.js
    │   │   └── HomeScreen.js
    │   ├── services/
    │   │   └── api.js
    │   └── utils/
    │       └── dateUtils.js
    ├── __tests__/
    │   └── App.test.tsx
    ├── App.tsx
    ├── app.json
    ├── babel.config.js
    ├── index.js
    ├── jest.config.js
    ├── metro.config.js
    ├── package.json
    ├── tsconfig.json
    └── .gitignore
```

## License

MIT

# Grok

Below, I’ll provide a detailed explanation of the backend files for the **CogniTodo** application, as outlined in the project structure from the query. Each file will be presented one by one with its contents and purpose, focusing on the Go backend implementation using the Gin framework, PostgreSQL for persistence, and OpenAI for AI-powered task planning. This response assumes you want the backend files fully fleshed out, as per the elaborated project structure in the README.

---

## Backend Files for CogniTodo

The backend is located in the `backend/` directory and serves as the API layer for the CogniTodo application. It handles task management and AI-driven daily planning. Below are the files, their purposes, and their contents.

### 1. `backend/main.go`

**Purpose**: The entry point of the application. It initializes the configuration, connects to the database, sets up the API router, and starts the server.

```go
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
```

---

### 2. `backend/config/config.go`

**Purpose**: Manages configuration settings, such as the database URL and OpenAI API key, by loading them from environment variables using the `viper` package.

```go
package config

import (
	"github.com/spf13/viper"
)

// InitConfig sets up viper to automatically load environment variables
func InitConfig() {
	viper.AutomaticEnv()
}
```

**Notes**:

-   Environment variables like `DATABASE_URL` and `OPENAI_API_KEY` must be set before running the application (e.g., via a `.env` file or export commands).
-   Example: `export DATABASE_URL="postgres://user:password@localhost:5432/cognitodo"` and `export OPENAI_API_KEY="your_openai_api_key"`.

---

### 3. `backend/models/db.go`

**Purpose**: Handles the database connection and provides a global `db` variable for database operations. Uses PostgreSQL as the database.

```go
package models

import (
	"database/sql"
	"github.com/spf13/viper"
	_ "github.com/lib/pq" // PostgreSQL driver
)

var db *sql.DB

// ConnectDatabase establishes a connection to the PostgreSQL database
func ConnectDatabase() {
	connStr := viper.GetString("DATABASE_URL")
	var err error
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		panic(err)
	}
	if err = db.Ping(); err != nil {
		panic(err)
	}
}
```

**Notes**:

-   Assumes a `tasks` table exists with columns: `id` (serial), `description` (text), `status` (text).
-   You’d need to create this table manually or add a migration step (not included here for simplicity).

---

### 4. `backend/models/task.go`

**Purpose**: Defines the `Task` struct and provides CRUD operations for tasks, interacting with the PostgreSQL database.

```go
package models

type Task struct {
	ID          int    `json:"id"`
	Description string `json:"description"`
	Status      string `json:"status"` // e.g., "pending", "completed"
}

// CreateTask inserts a new task into the database
func CreateTask(task *Task) error {
	query := `INSERT INTO tasks (description, status) VALUES ($1, $2) RETURNING id`
	err := db.QueryRow(query, task.Description, task.Status).Scan(&task.ID)
	return err
}

// GetTasks retrieves all tasks from the database
func GetTasks() ([]Task, error) {
	rows, err := db.Query("SELECT id, description, status FROM tasks")
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var tasks []Task
	for rows.Next() {
		var task Task
		if err := rows.Scan(&task.ID, &task.Description, &task.Status); err != nil {
			return nil, err
		}
		tasks = append(tasks, task)
	}
	return tasks, nil
}

// GetTask retrieves a single task by ID
func GetTask(id int) (Task, error) {
	var task Task
	query := `SELECT id, description, status FROM tasks WHERE id = $1`
	err := db.QueryRow(query, id).Scan(&task.ID, &task.Description, &task.Status)
	return task, err
}

// UpdateTask updates an existing task
func UpdateTask(task Task) error {
	query := `UPDATE tasks SET description = $1, status = $2 WHERE id = $3`
	_, err := db.Exec(query, task.Description, task.Status, task.ID)
	return err
}

// DeleteTask removes a task by ID
func DeleteTask(id int) error {
	query := `DELETE FROM tasks WHERE id = $1`
	_, err := db.Exec(query, id)
	return err
}
```

---

### 5. `backend/models/daily_plan.go`

**Purpose**: Defines the data structures for the AI-generated daily plan, including scheduled tasks with time blocks and priorities.

```go
package models

type ScheduledTask struct {
	TaskID    int    `json:"task_id"`
	StartTime string `json:"start_time"` // e.g., "09:00"
	EndTime   string `json:"end_time"`   // e.g., "10:00"
	Priority  string `json:"priority"`   // e.g., "high", "medium", "low"
}

type DailyPlan struct {
	Date     string           `json:"date"` // e.g., "2023-10-01"
	Schedule []ScheduledTask `json:"schedule"`
}
```

---

### 6. `backend/services/ai_service.go`

**Purpose**: Contains the logic to interact with the OpenAI API, generating a daily plan based on the user’s tasks.

```go
package services

import (
	"context"
	"fmt"

	"cognitodo/backend/models" // Adjust this import path to your project structure

	"github.com/cohesion-org/deepseek-go"
)

// GenerateDailyPlan uses DeepSeek to create a daily schedule from a list of tasks
func GenerateDailyPlan(tasks []models.Task) (models.DailyPlan, error) {
    // Initialize the DeepSeek client with the API key from environment variables
    client := deepseek.NewClient("sk-9b338f1e1d3e423ab765fc8a300fd13a")

    // Construct the prompt with the list of tasks
    prompt := "You are a helpful assistant that plans daily schedules. Given the following tasks, organize them into a schedule for the day, assigning start and end times and priorities.\n\nTasks:\n"
    for _, task := range tasks {
        prompt += fmt.Sprintf("- ID: %d, Description: %s\n", task.ID, task.Description)
    }
    prompt += "\nPlease respond with a JSON object in the following format:\n{\n  \"schedule\": [\n    {\n      \"task_id\": 1,\n      \"start_time\": \"09:00\",\n      \"end_time\": \"10:00\",\n      \"priority\": \"high\"\n    },\n    ...\n  ]\n}"

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
```

**Notes**:

-   Uses `github.com/sashabaranov/go-openai` for OpenAI integration.
-   The prompt requests JSON output for easy parsing.
-   The date is hardcoded as "today" for simplicity; you could use `time.Now().Format("2006-01-02")` for a dynamic date.

---

### 7. `backend/api/task_handlers.go`

**Purpose**: Defines HTTP handlers for task-related CRUD operations using the Gin framework.

```go
package api

import (
	"net/http"
	"strconv"
	"cognitodo/backend/models"
	"github.com/gin-gonic/gin"
)

// CreateTask handles POST /tasks
func CreateTask(c *gin.Context) {
	var task models.Task
	if err := c.ShouldBindJSON(&task); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	if err := models.CreateTask(&task); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, task)
}

// GetTasks handles GET /tasks
func GetTasks(c *gin.Context) {
	tasks, err := models.GetTasks()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, tasks)
}

// GetTask handles GET /tasks/:id
func GetTask(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}
	task, err := models.GetTask(id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Task not found"})
		return
	}
	c.JSON(http.StatusOK, task)
}

// UpdateTask handles PUT /tasks/:id
func UpdateTask(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}
	var task models.Task
	if err := c.ShouldBindJSON(&task); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	task.ID = id
	if err := models.UpdateTask(task); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, task)
}

// DeleteTask handles DELETE /tasks/:id
func DeleteTask(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
		return
	}
	if err := models.DeleteTask(id); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.Status(http.StatusNoContent)
}
```

---

### 8. `backend/api/plan_handlers.go`

**Purpose**: Defines the handler for generating and retrieving the AI-powered daily plan.

```go
package api

import (
	"net/http"
	"cognitodo/backend/models"
	"cognitodo/backend/services"
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
```

---

### 9. `backend/api/routes.go`

**Purpose**: Sets up the API routes using Gin, mapping endpoints to their respective handlers.

```go
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
```

---

### 10. `backend/api/ai_handlers.go`

**Purpose**: This file isn’t strictly necessary based on the current design, as AI logic is encapsulated in `services/ai_service.go` and invoked via `plan_handlers.go`. However, if additional AI-related endpoints were needed (e.g., a direct AI query endpoint), this file could be used. For now, it can be an empty placeholder or omitted.

```go
package api

// This file is a placeholder for potential future AI-specific endpoints
```

**Notes**: Since the README includes it, I’ve listed it, but the current implementation doesn’t require it.

---

### 11. `backend/go.mod`

**Purpose**: Defines the Go module and its dependencies.

```go
module cognitodo/backend

go 1.21

require (
	github.com/gin-gonic/gin v1.9.1
	github.com/sashabaranov/go-openai v1.17.9
	github.com/spf13/viper v1.18.2
	github.com/lib/pq v1.10.9
)
```

**Notes**:

-   Run `go mod init cognitodo/backend` followed by `go get` for each dependency to populate `go.sum`.
-   Versions are based on stable releases as of late 2023; update as needed.

---

### 12. `backend/.gitignore`

**Purpose**: Specifies files and directories to ignore in version control.

```
# Binaries for programs and plugins
*.exe
*.exe~
*.dll
*.so
*.dylib

# Test binary, build with `go test -c`
*.test

# Output of the go coverage tool
*.out

# Dependency directories
vendor/

# IDE and editor files
.idea/
.vscode/
*.swp
*.swo

# Environment variables
.env

# Go build artifacts
go.sum
```

---

## Additional Notes

-   **Database Setup**: You’ll need a PostgreSQL database with a `tasks` table:
    ```sql
    CREATE TABLE tasks (
        id SERIAL PRIMARY KEY,
        description TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending'
    );
    ```
-   **Running the Backend**: Set the environment variables (`DATABASE_URL` and `OPENAI_API_KEY`), then run:
    ```bash
    cd backend
    go mod download
    go run main.go
    ```
-   **API Endpoints**:
    -   `POST /tasks`: Create a task (expects JSON with `description` and `status`).
    -   `GET /tasks`: List all tasks.
    -   `GET /tasks/:id`: Get a specific task.
    -   `PUT /tasks/:id`: Update a task.
    -   `DELETE /tasks/:id`: Delete a task.
    -   `GET /plan`: Generate and retrieve the daily plan.

This covers the backend files as requested. If you need the frontend files or further elaboration, let me know!
