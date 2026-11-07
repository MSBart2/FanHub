package middleware

import (
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
	"fanhub/database"
	"fanhub/models"
)

func UniverseContext() gin.HandlerFunc {
	return func(c *gin.Context) {
		headerValue := c.GetHeader("X-Show-Slug")
		var show models.Show

		if headerValue != "" {
			if id, err := strconv.Atoi(headerValue); err == nil {
				database.DB.First(&show, id)
			} else {
				var shows []models.Show
				database.DB.Find(&shows)

				headerSlug := strings.ToLower(headerValue)
				for _, candidate := range shows {
					titleSlug := strings.ToLower(strings.ReplaceAll(candidate.Title, " ", "-"))
					if titleSlug == headerSlug {
						show = candidate
						break
					}
				}
			}
		}

		if show.ID == 0 {
			database.DB.Order("id asc").First(&show)
		}

		if show.ID != 0 {
			c.Set("universe", show)
		}

		c.Next()
	}
}
