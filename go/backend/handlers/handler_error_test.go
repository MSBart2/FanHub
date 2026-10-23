package handlers

import (
	"bytes"
	"errors"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"fanhub/database"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

const internalError = "private_table constraint_xyz"

func setupFailingDatabase(t *testing.T) {
	t.Helper()

	originalDB := database.DB
	db, err := gorm.Open(sqlite.Open(":memory:"), &gorm.Config{})
	if err != nil {
		t.Fatalf("open test database: %v", err)
	}
	if err := db.Callback().Create().Before("gorm:create").Register("test:fail_create", func(db *gorm.DB) {
		db.AddError(errors.New(internalError))
	}); err != nil {
		t.Fatalf("register failing create callback: %v", err)
	}

	database.DB = db
	t.Cleanup(func() {
		database.DB = originalDB
		sqlDB, err := db.DB()
		if err == nil {
			_ = sqlDB.Close()
		}
	})
}

func performRequest(handler gin.HandlerFunc, body string) *httptest.ResponseRecorder {
	recorder := httptest.NewRecorder()
	request := httptest.NewRequest(http.MethodPost, "/", strings.NewReader(body))
	request.Header.Set("Content-Type", "application/json")
	context, _ := gin.CreateTestContext(recorder)
	context.Request = request
	handler(context)
	return recorder
}

func TestCreateHandlersHideDatabaseErrors(t *testing.T) {
	gin.SetMode(gin.TestMode)

	tests := []struct {
		name    string
		handler gin.HandlerFunc
		body    string
	}{
		{name: "character", handler: CreateCharacter, body: `{}`},
		{name: "episode", handler: CreateEpisode, body: `{}`},
		{name: "quote", handler: CreateQuote, body: `{}`},
		{name: "show", handler: CreateShow, body: `{}`},
	}

	for _, test := range tests {
		t.Run(test.name, func(t *testing.T) {
			setupFailingDatabase(t)

			response := performRequest(test.handler, test.body)

			if response.Code != http.StatusInternalServerError {
				t.Fatalf("status = %d, want %d", response.Code, http.StatusInternalServerError)
			}
			if strings.Contains(response.Body.String(), internalError) {
				t.Fatalf("response leaked internal error: %s", response.Body.String())
			}
			if got := response.Body.String(); got != "{\"error\":\"internal server error\"}" {
				t.Fatalf("response = %q, want generic error response", got)
			}
		})
	}
}

func TestRegisterHidesServiceErrors(t *testing.T) {
	gin.SetMode(gin.TestMode)
	setupFailingDatabase(t)

	response := performRequest(Register, `{"email":"user@example.com","password":"long-enough","username":"user"}`)

	if response.Code != http.StatusBadRequest {
		t.Fatalf("status = %d, want %d", response.Code, http.StatusBadRequest)
	}
	if strings.Contains(response.Body.String(), internalError) {
		t.Fatalf("response leaked internal error: %s", response.Body.String())
	}
	if got := response.Body.String(); got != "{\"error\":\"invalid request\"}" {
		t.Fatalf("response = %q, want generic validation response", got)
	}
}

func TestRegisterHidesBindingErrors(t *testing.T) {
	gin.SetMode(gin.TestMode)

	response := performRequest(Register, `{"email":`)

	if response.Code != http.StatusBadRequest {
		t.Fatalf("status = %d, want %d", response.Code, http.StatusBadRequest)
	}
	if bytes.Contains(response.Body.Bytes(), []byte("unexpected end of JSON input")) {
		t.Fatalf("response leaked binding error: %s", response.Body.String())
	}
	if got := response.Body.String(); got != "{\"error\":\"invalid request\"}" {
		t.Fatalf("response = %q, want generic validation response", got)
	}
}
