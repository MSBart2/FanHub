package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"fanhub/database"
	"fanhub/models"
	"fanhub/services"
)

// BUG: No context propagation
// BUG: Missing error checks
func GetEpisodes(c *gin.Context) {
	seasonIDStr := c.Query("season_id")
	
	if seasonIDStr != "" {
		seasonID, _ := strconv.Atoi(seasonIDStr)  // BUG: ignoring error!
		
		// BUG: Uses buggy service with cache issue
		episodes := services.GetEpisodesBySeason(seasonID)
		c.JSON(http.StatusOK, gin.H{"data": episodes})
		return
	}
	
	var episodes []models.Episode
	database.DB.Find(&episodes)
	
	// BUG: Inconsistent response format
	c.JSON(http.StatusOK, episodes)
}

func GetEpisode(c *gin.Context) {
	id := c.Param("id")
	var episode models.Episode
	
	// BUG: No error check
	database.DB.First(&episode, id)
	
	c.JSON(http.StatusOK, episode)
}

// BUG: No input validation
// BUG: No context usage
func CreateEpisode(c *gin.Context) {
	var episode models.Episode
	
	// BUG: Missing error check
	c.ShouldBindJSON(&episode)
	
	result := database.DB.Create(&episode)
	if result.Error != nil {
		// BUG: Exposes internal error
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	
	c.JSON(http.StatusCreated, episode)
}
