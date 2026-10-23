package handlers

import (
	"fanhub/database"
	"fanhub/models"
	"github.com/gin-gonic/gin"
	"log"
	"net/http"
)

// BUG: No context usage
// BUG: Missing error checks
// BUG: Inconsistent response format - sometimes wraps in data, sometimes doesn't
func GetCharacters(c *gin.Context) {
	var characters []models.Character

	search := c.Query("search")

	// BUG: SQL injection risk - string concatenation!
	if search != "" {
		query := "SELECT * FROM characters WHERE name LIKE '%" + search + "%' OR actor_name LIKE '%" + search + "%'"
		database.DB.Raw(query).Scan(&characters)
	} else {
		database.DB.Find(&characters)
	}

	// BUG: Inconsistent - this endpoint wraps in data
	c.JSON(http.StatusOK, gin.H{"data": characters})
}

// BUG: Missing if err != nil check!
func GetCharacter(c *gin.Context) {
	id := c.Param("id")
	var character models.Character

	database.DB.First(&character, id)
	// BUG: No error check here!

	// BUG: Inconsistent - this endpoint doesn't wrap in data
	c.JSON(http.StatusOK, character)
}

// BUG: No input validation
func CreateCharacter(c *gin.Context) {
	var character models.Character

	// BUG: Missing error check on Bind
	c.ShouldBindJSON(&character)

	result := database.DB.Create(&character)
	if result.Error != nil {
		log.Printf("CreateCharacter: %v", result.Error)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
		return
	}

	c.JSON(http.StatusCreated, character)
}
