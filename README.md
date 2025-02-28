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
-   **AI Integration**: DeepSeek API

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

go run .
```

### Running the Frontend

```bash
cd frontend
npm install

cd ios
pod install

cd ..
npx react-native start
```

## License

MIT
