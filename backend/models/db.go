package models

import (
	"database/sql"
	"fmt"
	"os"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq" // PostgreSQL driver
)

var db *sql.DB

// ConnectDatabase establishes a connection to the PostgreSQL database
func ConnectDatabase() {
	// Load environment variables from .env file
	if err := godotenv.Load(); err != nil {
		panic(fmt.Errorf("failed to load .env file: %v", err))
	}

	connStr := os.Getenv("DATABASE_URL")
	var err error
	db, err = sql.Open("postgres", connStr)
	if err != nil {
		panic(err)
	}
	if err = db.Ping(); err != nil {
		panic(err)
	}
}