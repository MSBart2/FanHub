package models

import "time"

type Lore struct {
	ID          int       `json:"id" gorm:"primaryKey"`
	ShowID      int       `json:"show_id"`
	Title       string    `json:"title"`
	Description string    `json:"description"`
	Category    string    `json:"category"`
	CreatedAt   time.Time `json:"created_at,omitempty"`
}

func (Lore) TableName() string {
	return "lores"
}
