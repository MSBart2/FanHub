package models

import "time"

// BUG: No validation tags
// BUG: Password field exposed in JSON!
type User struct {
	ID           int       `json:"id" gorm:"primaryKey"`
	Email        string    `json:"email"`
	PasswordHash string    `json:"password_hash"`         // BUG: Should use json:"-"
	Username     string    `json:"username"`
	DisplayName  string    `json:"display_name,omitempty"`
	AvatarURL    string    `json:"avatar_url"`            // BUG: missing omitempty
	Role         string    `json:"role,omitempty"`
	IsActive     bool      `json:"is_active"`
	CreatedAt    time.Time `json:"created_at,omitempty"`
	UpdatedAt    time.Time `json:"updated_at,omitempty"`
}

func (User) TableName() string {
	return "users"
}
