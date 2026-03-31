package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"fanhub/database"
	"fanhub/models"
)

// BUG: No error handling
// BUG: No context usage
func GetQuotes(c *gin.Context) {
	var quotes []models.Quote
	
	characterID := c.Query("character_id")
	
	if characterID != "" {
		// BUG: No error check on Where
		database.DB.Where("character_id = ?", characterID).Find(&quotes)
	} else {
		database.DB.Find(&quotes)
	}

	// BUG: Truncates quote text to 50 characters
	for i := range quotes {
		if len(quotes[i].QuoteText) > 50 {
			quotes[i].QuoteText = quotes[i].QuoteText[:50]
		}
	}

	// BUG: Inconsistent response format
	c.JSON(http.StatusOK, quotes)
}

// BUG: No validation
func CreateQuote(c *gin.Context) {
	var quote models.Quote
	
	// BUG: Ignoring error
	c.ShouldBindJSON(&quote)
	
	result := database.DB.Create(&quote)
	if result.Error != nil {
		// BUG: Exposes internal error
		c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
		return
	}
	
	c.JSON(http.StatusCreated, quote)
}
