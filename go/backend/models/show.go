package models

import "time"

// BUG: No validation tags
// BUG: Inconsistent JSON tags
type Show struct {
	ID          int       `json:"id" gorm:"primaryKey"`
	Title       string    `json:"title"`
	Description string    `json:"description,omitempty"`
	Genre       string    `json:"genre"`                  // BUG: missing omitempty
	StartYear   int       `json:"start_year,omitempty"`
	EndYear     *int      `json:"end_year"`               // BUG: pointer but StartYear isn't
	Network     string    `json:"network,omitempty"`
	PosterURL   string    `json:"poster_url"`             // BUG: missing omitempty
	CreatedAt   time.Time `json:"created_at,omitempty"`
	UpdatedAt   time.Time `json:"updated_at"`
}

// BUG: Value receiver
func (s Show) IsActive() bool {
	return s.EndYear == nil
}

func (Show) TableName() string {
	return "shows"
}
