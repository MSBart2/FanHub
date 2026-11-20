package handlers

import (
	"math/rand"
	"net/http"
	"time"

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

func GetQuoteSpotlight(c *gin.Context) {
	activeSeries, exists := c.Get("universe")
	if !exists {
		c.JSON(http.StatusNotFound, gin.H{"error": "No active program context"})
		return
	}

	activeShow, ok := activeSeries.(models.Show)
	if !ok {
		c.JSON(http.StatusNotFound, gin.H{"error": "No active program context"})
		return
	}

	var matches []models.Quote
	database.DB.Where("show_id = ? AND is_famous = ?", activeShow.ID, true).Find(&matches)
	if len(matches) == 0 {
		database.DB.Where("show_id = ?", activeShow.ID).Find(&matches)
	}

	if len(matches) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "No quotes found for this program"})
		return
	}

	rng := rand.New(rand.NewSource(time.Now().UnixNano()))
	quote := matches[rng.Intn(len(matches))]

	type spotlightQuote struct {
		models.Quote
		CharacterName string `json:"character_name,omitempty"`
	}

	responseQuote := spotlightQuote{Quote: quote}
	if quote.CharacterID != nil {
		var character models.Character
		database.DB.First(&character, *quote.CharacterID)
		if character.ID != 0 {
			responseQuote.CharacterName = character.Name
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"quote": responseQuote,
		"program": gin.H{"programId": activeShow.ID, "title": activeShow.Title},
	})
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
