package middleware

import (
	"github.com/gin-gonic/gin"
)

// BUG: Auth middleware is just a stub - not implemented!
// BUG: Should validate JWT tokens but doesn't
// BUG: Never actually used in main.go
func AuthRequired() gin.HandlerFunc {
	return func(c *gin.Context) {
		// BUG: This is just a stub that does nothing!
		// Should:
		// 1. Extract token from Authorization header
		// 2. Validate JWT token
		// 3. Add user info to context
		// 4. Return 401 if invalid
		
		// TODO: Implement actual JWT validation
		
		c.Next()
	}
}
