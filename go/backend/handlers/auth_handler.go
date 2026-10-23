package handlers

import (
	"net/http"

	"fanhub/services"
	"github.com/gin-gonic/gin"
)

type RegisterRequest struct {
	Email       string `json:"email"`
	Password    string `json:"password"`
	Username    string `json:"username"`
	DisplayName string `json:"display_name"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// BUG: No input validation
// BUG: Weak password requirements (6 chars via service)
// BUG: No context usage
func Register(c *gin.Context) {
	var req RegisterRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	// BUG: Service has weak password validation
	user, err := services.RegisterUser(req.Email, req.Password, req.Username, req.DisplayName)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	c.JSON(http.StatusCreated, user)
}

// BUG: Incomplete JWT implementation
// BUG: No rate limiting
// BUG: No context usage
func Login(c *gin.Context) {
	var req LoginRequest

	// BUG: Missing error check
	c.ShouldBindJSON(&req)

	// BUG: JWT token generation is incomplete/stub
	token, err := services.AuthenticateUser(req.Email, req.Password)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid credentials"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token})
}
