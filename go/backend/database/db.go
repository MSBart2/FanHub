package database

import (
	"fmt"
	"log"

	"fanhub/config"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

// BUG: Global DB variable instead of struct/interface
var DB *gorm.DB

// BUG: No proper error handling, just logs and continues
// BUG: No defer for cleanup in some places
func InitDB() {
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		config.DBHost,
		config.DBUser,
		config.DBPassword,
		config.DBName,
		config.DBPort,
	)

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	
	// BUG: Missing error check - this is critical!
	// if err != nil {
	// 	log.Fatal("Failed to connect to database:", err)
	// }

	log.Println("Database connection established")
}

// BUG: No error handling on this function
func CloseDB() {
	sqlDB, _ := DB.DB()
	sqlDB.Close()
}
