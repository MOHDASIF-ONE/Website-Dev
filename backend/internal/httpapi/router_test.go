package httpapi

import (
	"context"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/mohdasif-one/reach/backend/internal/store"
)

func testRouter(t *testing.T) http.Handler {
	t.Helper()
	db, err := store.Open(context.Background(), "", ":memory:", "")
	if err != nil {
		t.Fatalf("open in-memory database: %v", err)
	}
	t.Cleanup(func() { _ = db.Close() })
	return New(db, RouterConfig{})
}

func TestHealth(t *testing.T) {
	router := testRouter(t)
	request := httptest.NewRequest(http.MethodGet, "/api/v1/health", nil)
	response := httptest.NewRecorder()
	router.ServeHTTP(response, request)

	if response.Code != http.StatusOK {
		t.Fatalf("health status = %d, want %d", response.Code, http.StatusOK)
	}
	if !strings.Contains(response.Body.String(), `"mode":"sqlite"`) {
		t.Fatalf("health response does not report the local SQLite mode: %s", response.Body.String())
	}
}

func TestQuoteValidationAndSave(t *testing.T) {
	router := testRouter(t)
	invalid := httptest.NewRequest(http.MethodPost, "/api/v1/quotes", strings.NewReader(`{"name":"","business_type":"","contact":"","plan":""}`))
	invalid.Header.Set("Content-Type", "application/json")
	invalidResponse := httptest.NewRecorder()
	router.ServeHTTP(invalidResponse, invalid)
	if invalidResponse.Code != http.StatusBadRequest {
		t.Fatalf("invalid quote status = %d, want %d", invalidResponse.Code, http.StatusBadRequest)
	}

	valid := httptest.NewRequest(http.MethodPost, "/api/v1/quotes", strings.NewReader(`{"name":"Alex Morgan","business_type":"Northstar Studio","contact":"alex@example.com","plan":"Business - $499","message":"A new website"}`))
	valid.Header.Set("Content-Type", "application/json")
	validResponse := httptest.NewRecorder()
	router.ServeHTTP(validResponse, valid)
	if validResponse.Code != http.StatusCreated {
		t.Fatalf("valid quote status = %d, want %d: %s", validResponse.Code, http.StatusCreated, validResponse.Body.String())
	}
	if !strings.Contains(validResponse.Body.String(), `"ok":true`) {
		t.Fatalf("valid quote response should confirm the save: %s", validResponse.Body.String())
	}
}

func TestSubscriptionRejectsInvalidAndAcceptsDuplicate(t *testing.T) {
	router := testRouter(t)
	invalid := httptest.NewRequest(http.MethodPost, "/api/v1/subscriptions", strings.NewReader(`{"email":"not-an-email"}`))
	invalid.Header.Set("Content-Type", "application/json")
	invalidResponse := httptest.NewRecorder()
	router.ServeHTTP(invalidResponse, invalid)
	if invalidResponse.Code != http.StatusBadRequest {
		t.Fatalf("invalid subscription status = %d, want %d", invalidResponse.Code, http.StatusBadRequest)
	}

	for range 2 {
		request := httptest.NewRequest(http.MethodPost, "/api/v1/subscriptions", strings.NewReader(`{"email":"hello@example.com"}`))
		request.Header.Set("Content-Type", "application/json")
		response := httptest.NewRecorder()
		router.ServeHTTP(response, request)
		if response.Code != http.StatusOK {
			t.Fatalf("valid subscription status = %d, want %d: %s", response.Code, http.StatusOK, response.Body.String())
		}
	}
}
