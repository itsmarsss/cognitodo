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