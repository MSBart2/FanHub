package config

import (
	"os"
)

// BUG: All global variables - bad pattern, no DI
var (
	DBHost     string
	DBPort     string
	DBUser     string
	DBPassword string
	DBName     string
	Port       string
	JWTSecret  string
)

// BUG: No validation of required values
// BUG: Hardcoded JWT secret fallback (security issue)
func LoadConfig() {
	DBHost = getEnv("DB_HOST", "localhost")
	DBPort = getEnv("DB_PORT", "5432")
	DBUser = getEnv("DB_USER", "postgres")
	DBPassword = getEnv("DB_PASSWORD", "postgres")
	DBName = getEnv("DB_NAME", "fanhub")
	Port = getEnv("PORT", "8080")
	
	// BUG: Hardcoded JWT secret - major security issue!
	JWTSecret = getEnv("JWT_SECRET", "super-secret-key-do-not-use-in-production")
}

func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}
