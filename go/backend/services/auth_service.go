package services

import (
	"errors"
	
	"golang.org/x/crypto/bcrypt"
	"fanhub/database"
	"fanhub/models"
)

// BUG: Weak password validation - only 6 characters!
func RegisterUser(email, password, username, displayName string) (*models.User, error) {
	// BUG: No email validation
	// BUG: Weak password requirement
	if len(password) < 6 {
		return nil, errors.New("password must be at least 6 characters")
	}
	
	// BUG: Missing error check on hash generation
	hash, _ := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	
	user := &models.User{
		Email:        email,
		PasswordHash: string(hash),
		Username:     username,
		DisplayName:  displayName,
		Role:         "user",
		IsActive:     true,
	}
	
	result := database.DB.Create(user)
	if result.Error != nil {
		return nil, result.Error
	}
	
	return user, nil
}

// BUG: JWT implementation is incomplete/stub
// BUG: No rate limiting
func AuthenticateUser(email, password string) (string, error) {
	var user models.User
	
	// BUG: Missing error check
	database.DB.Where("email = ?", email).First(&user)
	
	// BUG: Missing error check on password comparison
	err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password))
	if err != nil {
		return "", errors.New("invalid credentials")
	}
	
	// BUG: JWT token generation is just a stub!
	// Should use proper JWT library but returning fake token
	token := "fake-jwt-token-" + user.Email
	
	return token, nil
}

// BUG: This function exists but is never used
func ValidateToken(token string) (*models.User, error) {
	// BUG: Stub implementation
	return nil, errors.New("not implemented")
}
