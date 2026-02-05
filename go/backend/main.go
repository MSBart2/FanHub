package main

import (
	"fmt"
	"log"

	"github.com/gin-gonic/gin"
	"fanhub/config"
	"fanhub/database"
	"fanhub/handlers"
	"fanhub/middleware"
)

// BUG: Global DB variable - no dependency injection
var DB = database.DB

func main() {
	// BUG: No config validation
	config.LoadConfig()
	
	// BUG: Missing error check on DB initialization
	database.InitDB()
	
	// BUG: No graceful shutdown
	// BUG: No context usage
	
	r := gin.Default()
	
	// BUG: Missing recovery middleware (should exist but doesn't)
	r.Use(middleware.CORS())
	
	// API routes
	api := r.Group("/api")
	{
		// Character routes
		api.GET("/characters", handlers.GetCharacters)
		api.POST("/characters", handlers.CreateCharacter)
		api.GET("/characters/:id", handlers.GetCharacter)
		
		// Episode routes
		api.GET("/episodes", handlers.GetEpisodes)
		api.POST("/episodes", handlers.CreateEpisode)
		api.GET("/episodes/:id", handlers.GetEpisode)
		
		// Show routes
		api.GET("/shows", handlers.GetShows)
		api.POST("/shows", handlers.CreateShow)
		api.GET("/shows/:id", handlers.GetShow)
		
		// Quote routes
		api.GET("/quotes", handlers.GetQuotes)
		api.POST("/quotes", handlers.CreateQuote)
	}
	
	// BUG: Auth routes inconsistent - should be /api/auth but using /auth
	auth := r.Group("/auth")
	{
		auth.POST("/register", handlers.Register)
		auth.POST("/login", handlers.Login)
	}
	
	port := config.Port
	fmt.Printf("Server starting on port %s\n", port)
	r.Run(":" + port)
}
