package models

import "time"

type Season struct {
	ID            int       `json:"id" gorm:"primaryKey"`
	ShowID        int       `json:"show_id"`
	SeasonNumber  int       `json:"season_number"`
	Title         string    `json:"title,omitempty"`
	EpisodeCount  int       `json:"episode_count,omitempty"`
	AirDate       string    `json:"air_date,omitempty"`
	CreatedAt     time.Time `json:"created_at,omitempty"`
}

func (Season) TableName() string {
	return "seasons"
}
