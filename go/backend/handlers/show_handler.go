package handlers

import (
	"log"
	"net/http"

	"fanhub/database"
	"fanhub/models"
	"github.com/gin-gonic/gin"
)

// BUG: No error handling
func GetShows(c *gin.Context) {
	var shows []models.Show

	database.DB.Find(&shows)

	c.JSON(http.StatusOK, gin.H{"data": shows})
}

// BUG: Missing error check
func GetShow(c *gin.Context) {
	id := c.Param("id")
	var show models.Show

	database.DB.First(&show, id)

	c.JSON(http.StatusOK, show)
}

// BUG: No validation
// BUG: No context usage
func CreateShow(c *gin.Context) {
	var show models.Show

	// BUG: Ignoring error
	c.ShouldBindJSON(&show)

	result := database.DB.Create(&show)
	if result.Error != nil {
		log.Printf("CreateShow: %v", result.Error)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}

	c.JSON(http.StatusCreated, show)
}
