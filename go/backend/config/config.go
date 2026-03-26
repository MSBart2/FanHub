package config

import (
	"os"
)

// BUG: All global variables - bad pattern, no DI
var (
	DBPath     string
	Port       string
	JWTSecret  string
)

// BUG: No validation of required values
// BUG: Hardcoded JWT secret fallback (security issue)
func LoadConfig() {
	DBPath = getEnv("DB_PATH", "./fanhub.db")
	Port = getEnv("PORT", "5265")

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
