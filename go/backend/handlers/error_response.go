package handlers

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func respondInternalError(c *gin.Context, handler string, err error) {
	log.Printf("%s: %v", handler, err)
	c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
}
