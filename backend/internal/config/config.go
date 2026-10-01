package config

import (
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/joho/godotenv"
)

type Config struct {
	Port          string
	DatabaseURL   string
	SQLitePath    string
	MigrationsDir string
	WebDistDir    string
	AllowedOrigin string
	ReadTimeout   time.Duration
	WriteTimeout  time.Duration
	IdleTimeout   time.Duration
}

func Load() Config {
	_ = godotenv.Load(filepath.Join("..", ".env"), ".env")

	return Config{
		Port:          valueOr("PORT", "8080"),
		DatabaseURL:   strings.TrimSpace(os.Getenv("DATABASE_URL")),
		SQLitePath:    valueOr("SQLITE_PATH", filepath.Join("..", "reach.db")),
		MigrationsDir: valueOr("MIGRATIONS_DIR", filepath.Join("db", "migrations", "postgres")),
		WebDistDir:    valueOr("WEB_DIST_DIR", filepath.Join("..", "frontend", "dist")),
		AllowedOrigin: strings.TrimSpace(os.Getenv("CORS_ORIGIN")),
		ReadTimeout:   10 * time.Second,
		WriteTimeout:  15 * time.Second,
		IdleTimeout:   60 * time.Second,
	}
}

func valueOr(key, fallback string) string {
	if value := strings.TrimSpace(os.Getenv(key)); value != "" {
		return value
	}
	return fallback
}
