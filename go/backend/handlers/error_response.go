package handlers

import (
	"fmt"
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func respondInternalError(c *gin.Context, handler string, err error) {
	detail := fmt.Sprint(err)
	log.Printf("%s: %s", handler, detail)
	c.JSON(http.StatusInternalServerError, gin.H{"error": "internal server error"})
}
