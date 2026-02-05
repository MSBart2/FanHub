package models

import "time"

// BUG: Inconsistent field naming and JSON tags
// BUG: No validation tags
type Episode struct {
	ID             int       `json:"id" gorm:"primaryKey"`
	ShowID         int       `json:"show_id"`
	SeasonID       int       `json:"season_id"`
	EpisodeNumber  int       `json:"episode_number"`
	Title          string    `json:"title"`
	Description    string    `json:"description,omitempty"`  // BUG: inconsistent omitempty
	AirDate        *time.Time `json:"air_date"`              // BUG: pointer here
	RuntimeMinutes int       `json:"runtime_minutes,omitempty"`
	Director       string    `json:"director"`               // BUG: missing omitempty
	Writer         string    `json:"writer"`                 // BUG: missing omitempty
	ThumbnailURL   string    `json:"thumbnail_url,omitempty"`
	Rating         float64   `json:"rating"`                 // BUG: should be pointer or omitempty
	CreatedAt      time.Time `json:"created_at,omitempty"`
	UpdatedAt      time.Time `json:"updated_at"`             // BUG: inconsistent omitempty
}

func (Episode) TableName() string {
	return "episodes"
}
