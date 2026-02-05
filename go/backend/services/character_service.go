package services

import (
	"errors"
	"fanhub/database"
	"fanhub/models"
)

// BUG: No context.Context parameter
// BUG: Nil pointer dereference risk
// BUG: Missing error checks
func GetCharacterByID(id int) (*models.Character, error) {
	var character models.Character
	
	// BUG: No error check
	database.DB.First(&character, id)
	
	// BUG: Should check if character was found
	return &character, nil
}

// BUG: No context usage
// BUG: Returns nil without proper error on not found
func GetCharactersByShow(showID int) []models.Character {
	var characters []models.Character
	
	// BUG: Ignoring error return
	database.DB.Where("show_id = ?", showID).Find(&characters)
	
	return characters
}

// BUG: No validation of input
// BUG: Could cause nil pointer issues
func UpdateCharacterStatus(id int, status string) error {
	result := database.DB.Model(&models.Character{}).Where("id = ?", id).Update("status", status)
	
	if result.Error != nil {
		return result.Error
	}
	
	// BUG: Should check RowsAffected
	return nil
}

// BUG: Missing error handling
func DeleteCharacter(id int) error {
	// BUG: No check if character exists
	result := database.DB.Delete(&models.Character{}, id)
	
	if result.Error != nil {
		return result.Error
	}
	
	if result.RowsAffected == 0 {
		return errors.New("character not found")
	}
	
	return nil
}
