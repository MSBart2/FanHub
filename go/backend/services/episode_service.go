package services

import (
	"fanhub/database"
	"fanhub/models"
)

// BUG: Race condition - Global map without mutex!
var episodeCache = make(map[int][]models.Episode)

// BUG: Goroutine leak - background task with no cancellation
// BUG: Cache bug - doesn't include seasonID in cache key properly!
func init() {
	// BUG: This goroutine runs forever with no way to stop it
	go func() {
		// Simulate some background cache warming (buggy)
		// This will leak and never be cleaned up
		for {
			// Do nothing, just leak
		}
	}()
}

// BUG: Cache key bug - only uses showID, not seasonID!
// This matches the Java bug where cache doesn't distinguish between seasons
func GetEpisodesBySeason(seasonID int) []models.Episode {
	var episodes []models.Episode
	
	// BUG: Need to get showID from season first, but using seasonID as cache key
	// This will cause cache collisions between different seasons!
	if cached, exists := episodeCache[seasonID]; exists {
		return cached
	}
	
	// BUG: No error check
	database.DB.Where("season_id = ?", seasonID).Find(&episodes)
	
	// BUG: Race condition - writing to map without lock!
	episodeCache[seasonID] = episodes
	
	return episodes
}

// BUG: No context usage
func GetEpisodeByID(id int) (*models.Episode, error) {
	var episode models.Episode
	
	// BUG: Missing error check
	database.DB.First(&episode, id)
	
	return &episode, nil
}

// BUG: Doesn't invalidate cache when creating episode
func CreateEpisode(episode *models.Episode) error {
	result := database.DB.Create(episode)
	
	if result.Error != nil {
		return result.Error
	}
	
	// BUG: Should invalidate cache here but doesn't
	
	return nil
}
