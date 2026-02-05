package models

import "time"

// BUG: Mixed JSON tags and validation
type Quote struct {
	ID          int       `json:"id" gorm:"primaryKey"`
	ShowID      int       `json:"show_id"`
	CharacterID *int      `json:"character_id"`          // BUG: pointer
	EpisodeID   *int      `json:"episode_id"`            // BUG: pointer
	QuoteText   string    `json:"quote_text"`
	Context     string    `json:"context,omitempty"`
	IsFamous    bool      `json:"is_famous"`
	LikesCount  int       `json:"likes_count,omitempty"`
	CreatedAt   time.Time `json:"created_at"`            // BUG: missing omitempty
}

func (Quote) TableName() string {
	return "quotes"
}
