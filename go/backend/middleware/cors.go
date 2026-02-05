package middleware

import (
	"github.com/gin-gonic/gin"
)

// BUG: CORS is wide open - allows all origins!
// BUG: No configuration options
// BUG: Allows all methods and headers
func CORS() gin.HandlerFunc {
	return func(c *gin.Context) {
		// BUG: Allows any origin - major security issue!
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		
		// BUG: Allows all headers - too permissive!
		c.Writer.Header().Set("Access-Control-Allow-Headers", "*")
		
		// BUG: Allows all methods - too permissive!
		c.Writer.Header().Set("Access-Control-Allow-Methods", "*")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}
