package models

import "time"

// BUG: Mixed JSON tags - some use omitempty, some don't
// BUG: No validation tags
type Character struct {
	ID               int       `json:"id" gorm:"primaryKey"`
	ShowID           int       `json:"show_id"`
	Name             string    `json:"name"`
	ActorName        string    `json:"actor_name,omitempty"`  // BUG: inconsistent omitempty
	Bio              string    `json:"bio"`                    // BUG: missing omitempty
	ImageURL         string    `json:"image_url,omitempty"`
	IsMainCharacter  bool      `json:"is_main_character"`
	FirstAppearance  *int      `json:"first_appearance"`       // BUG: pointer but others aren't
	Status           string    `json:"status,omitempty"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at,omitempty"`  // BUG: inconsistent omitempty
}

// BUG: Mixed pointer/value receivers in methods
func (c *Character) IsAlive() bool {
	return c.Status == "alive"
}

// BUG: Value receiver here but pointer above
func (c Character) GetDisplayName() string {
	if c.ActorName != "" {
		return c.Name + " (" + c.ActorName + ")"
	}
	return c.Name
}

func (Character) TableName() string {
	return "characters"
}
