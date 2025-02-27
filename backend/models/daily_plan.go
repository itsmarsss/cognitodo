package models

import (
	"time"

	"gorm.io/gorm"
)

// DailyPlan represents a plan for a day
type DailyPlan struct {
	gorm.Model
	Date  time.Time `json:"date" gorm:"uniqueIndex"`
	Tasks []Task    `json:"tasks" gorm:"foreignKey:DailyPlanID"`
}

// CreateDailyPlan creates a new daily plan
func CreateDailyPlan(plan *DailyPlan) error {
	return DB.Create(plan).Error
}

// GetDailyPlanByDate returns a daily plan by date
func GetDailyPlanByDate(date time.Time) (DailyPlan, error) {
	var plan DailyPlan
	// Truncate time portion to just get the date
	dateOnly := time.Date(date.Year(), date.Month(), date.Day(), 0, 0, 0, 0, date.Location())
	err := DB.Where("date = ?", dateOnly).Preload("Tasks").First(&plan).Error
	return plan, err
}

// GetAllDailyPlans returns all daily plans
func GetAllDailyPlans() ([]DailyPlan, error) {
	var plans []DailyPlan
	err := DB.Preload("Tasks").Find(&plans).Error
	return plans, err
}

// UpdateDailyPlan updates a daily plan
func UpdateDailyPlan(plan *DailyPlan) error {
	return DB.Save(plan).Error
}

// DeleteDailyPlan deletes a daily plan
func DeleteDailyPlan(id uint) error {
	return DB.Delete(&DailyPlan{}, id).Error
} 