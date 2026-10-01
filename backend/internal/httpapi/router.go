package httpapi

import (
	"context"
	"encoding/json"
	"errors"
	"io"
	"log/slog"
	"net/http"
	"net/mail"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/mohdasif-one/reach/backend/internal/store"
)

type quoteStore interface {
	Mode() string
	Ping(context.Context) error
	CreateQuote(context.Context, store.Quote) (int64, error)
	Subscribe(context.Context, string) error
}

type RouterConfig struct {
	AllowedOrigin string
	WebDistDir    string
}

type quoteRequest struct {
	Name         string `json:"name"`
	BusinessType string `json:"business_type"`
	Contact      string `json:"contact"`
	Plan         string `json:"plan"`
	Message      string `json:"message"`
}

type subscriptionRequest struct {
	Email string `json:"email"`
}

func New(store quoteStore, config RouterConfig) http.Handler {
	r := chi.NewRouter()
	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Recoverer)
	r.Use(middleware.Timeout(15 * time.Second))
	r.Use(cors(config.AllowedOrigin))

	r.Get("/api/v1/health", health(store))
	r.Post("/api/v1/quotes", createQuote(store))
	r.Post("/api/v1/subscriptions", subscribe(store))

	// Keep the existing public form endpoints working for any saved links.
	r.Get("/api/health", health(store))
	r.Post("/api/quote", createQuote(store))
	r.Post("/api/subscribe", subscribe(store))

	if config.WebDistDir != "" {
		r.Get("/", staticFiles(config.WebDistDir))
		r.Get("/*", staticFiles(config.WebDistDir))
	}
	r.NotFound(func(w http.ResponseWriter, req *http.Request) {
		writeJSON(w, http.StatusNotFound, map[string]any{"error": "Not found"})
	})
	return r
}

func health(db quoteStore) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		if err := db.Ping(req.Context()); err != nil {
			writeJSON(w, http.StatusServiceUnavailable, map[string]any{"ok": false, "error": "Database unavailable"})
			return
		}
		writeJSON(w, http.StatusOK, map[string]any{"ok": true, "db": "connected", "mode": db.Mode()})
	}
}

func createQuote(db quoteStore) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		var payload quoteRequest
		if err := decodeJSON(w, req, &payload); err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]any{"ok": false, "error": "Please submit a valid JSON request."})
			return
		}
		payload.Name = strings.TrimSpace(payload.Name)
		payload.BusinessType = strings.TrimSpace(payload.BusinessType)
		payload.Contact = strings.TrimSpace(payload.Contact)
		payload.Plan = strings.TrimSpace(payload.Plan)
		payload.Message = strings.TrimSpace(payload.Message)
		if payload.Name == "" || payload.BusinessType == "" || payload.Contact == "" || payload.Plan == "" {
			writeJSON(w, http.StatusBadRequest, map[string]any{"ok": false, "error": "Name, business name, contact, and project type are required."})
			return
		}
		if len(payload.Name) > 160 || len(payload.BusinessType) > 200 || len(payload.Contact) > 254 || len(payload.Plan) > 120 || len(payload.Message) > 2000 {
			writeJSON(w, http.StatusBadRequest, map[string]any{"ok": false, "error": "One or more fields exceed the allowed length."})
			return
		}
		id, err := db.CreateQuote(req.Context(), store.Quote{
			Name: payload.Name, BusinessType: payload.BusinessType,
			Contact: payload.Contact, Plan: payload.Plan, Message: payload.Message,
		})
		if err != nil {
			slog.Error("save quote request", "request_id", middleware.GetReqID(req.Context()), "error", err)
			writeJSON(w, http.StatusInternalServerError, map[string]any{"ok": false, "error": "We couldn’t save your request right now. Please try again."})
			return
		}
		writeJSON(w, http.StatusCreated, map[string]any{"ok": true, "id": id, "msg": "Quote saved! We reply in one business day."})
	}
}

func subscribe(db quoteStore) http.HandlerFunc {
	return func(w http.ResponseWriter, req *http.Request) {
		var payload subscriptionRequest
		if err := decodeJSON(w, req, &payload); err != nil {
			writeJSON(w, http.StatusBadRequest, map[string]any{"ok": false, "error": "Please submit a valid JSON request."})
			return
		}
		address := strings.TrimSpace(payload.Email)
		parsed, err := mail.ParseAddress(address)
		if err != nil || parsed.Address != address || len(address) > 254 {
			writeJSON(w, http.StatusBadRequest, map[string]any{"ok": false, "error": "Enter a valid email address."})
			return
		}
		if err := db.Subscribe(req.Context(), address); err != nil {
			slog.Error("save subscription", "request_id", middleware.GetReqID(req.Context()), "error", err)
			writeJSON(w, http.StatusInternalServerError, map[string]any{"ok": false, "error": "We couldn’t save your email right now."})
			return
		}
		writeJSON(w, http.StatusOK, map[string]any{"ok": true})
	}
}

func decodeJSON(w http.ResponseWriter, req *http.Request, target any) error {
	if req.Method != http.MethodPost || !strings.HasPrefix(req.Header.Get("Content-Type"), "application/json") {
		return errors.New("expected JSON POST")
	}
	req.Body = http.MaxBytesReader(w, req.Body, 1<<20)
	decoder := json.NewDecoder(req.Body)
	decoder.DisallowUnknownFields()
	if err := decoder.Decode(target); err != nil {
		return err
	}
	if err := decoder.Decode(&struct{}{}); err != io.EOF {
		return errors.New("request must contain one JSON value")
	}
	return nil
}

func cors(origin string) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
			requestOrigin := req.Header.Get("Origin")
			if requestOrigin != "" && origin != "" && requestOrigin == origin {
				w.Header().Set("Access-Control-Allow-Origin", origin)
				w.Header().Set("Vary", "Origin")
				w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
				w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Accept")
			}
			if req.Method == http.MethodOptions {
				w.WriteHeader(http.StatusNoContent)
				return
			}
			next.ServeHTTP(w, req)
		})
	}
}

func staticFiles(distDir string) http.HandlerFunc {
	fileServer := http.FileServer(http.Dir(distDir))
	return func(w http.ResponseWriter, req *http.Request) {
		if strings.HasPrefix(req.URL.Path, "/api/") {
			writeJSON(w, http.StatusNotFound, map[string]any{"error": "API route not found"})
			return
		}
		cleaned := filepath.Clean(filepath.FromSlash(strings.TrimPrefix(req.URL.Path, "/")))
		candidate := filepath.Join(distDir, cleaned)
		if info, err := os.Stat(candidate); err == nil && !info.IsDir() {
			fileServer.ServeHTTP(w, req)
			return
		}
		if _, err := os.Stat(filepath.Join(distDir, "index.html")); err != nil {
			http.Error(w, "The React production build is missing. Run npm run build in frontend/.", http.StatusServiceUnavailable)
			return
		}
		http.ServeFile(w, req, filepath.Join(distDir, "index.html"))
	}
}

func writeJSON(w http.ResponseWriter, status int, value any) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
	w.Header().Set("X-Content-Type-Options", "nosniff")
	w.WriteHeader(status)
	_ = json.NewEncoder(w).Encode(value)
}
