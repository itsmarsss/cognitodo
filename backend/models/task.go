package models

type Task struct {
	ID          int     `json:"id"`
	Name        string  `json:"name"`        // New field for task name
	Description string  `json:"description"`
	Priority    string  `json:"priority"`    // New field for task priority
	Status      string  `json:"status"`      // e.g., "pending", "completed"
	Duration    string  `json:"duration"`    // New field for task duration in minutes
}

// CreateTask inserts a new task into the database
func CreateTask(task *Task) error {
	query := `INSERT INTO tasks (name, description, duration, priority, status) VALUES ($1, $2, $3, $4, $5) RETURNING id`
	err := db.QueryRow(query, task.Name, task.Description, task.Duration, task.Priority, task.Status).Scan(&task.ID)
	return err
}

// GetTasks retrieves all tasks from the database
func GetTasks() ([]Task, error) {
	rows, err := db.Query("SELECT id, COALESCE(name, ''), COALESCE(description, ''), duration, COALESCE(priority, ''), COALESCE(status, '') FROM tasks")
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var tasks []Task
	for rows.Next() {
		var task Task
		if err := rows.Scan(&task.ID, &task.Name, &task.Description, &task.Duration, &task.Priority, &task.Status); err != nil {
			return nil, err
		}
		tasks = append(tasks, task)
	}
	return tasks, nil
}

// GetTask retrieves a single task by ID
func GetTask(id int) (Task, error) {
	var task Task
	query := `SELECT id, COALESCE(name, ''), COALESCE(description, ''), duration, COALESCE(priority, ''), COALESCE(status, '') FROM tasks WHERE id = $1`
	err := db.QueryRow(query, id).Scan(&task.ID, &task.Name, &task.Description, &task.Duration, &task.Priority, &task.Status)
	return task, err
}

// UpdateTask updates an existing task
func UpdateTask(task Task) error {
	query := `UPDATE tasks SET name = $1, description = $2, duration = $3, priority = $4, status = $5 WHERE id = $6`
	_, err := db.Exec(query, task.Name, task.Description, task.Duration, task.Priority, task.Status, task.ID)
	return err
}

// DeleteTask removes a task by ID
func DeleteTask(id int) error {
	query := `DELETE FROM tasks WHERE id = $1`
	_, err := db.Exec(query, id)
	return err
}