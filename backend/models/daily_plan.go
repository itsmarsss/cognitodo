package models

type ScheduledTask struct {
	TaskID    int    `json:"task_id"`
	StartTime string `json:"start_time"` // e.g., "09:00"
	EndTime   string `json:"end_time"`   // e.g., "10:00"
}

type DailyPlan struct {
	Date     string          `json:"date"` // e.g., "2023-10-01"
	Schedule []ScheduledTask `json:"schedule"`
}