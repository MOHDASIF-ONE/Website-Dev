package store

import (
	"context"
	"database/sql"
	"errors"
	"fmt"
	"os"
	"path/filepath"

	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/mohdasif-one/reach/backend/internal/store/dbgen"
	"github.com/pressly/goose/v3"
	_ "modernc.org/sqlite"
)

type Store struct {
	db   *sql.DB
	mode string
}

type Quote struct {
	Name         string
	BusinessType string
	Contact      string
	Plan         string
	Message      string
}

func Open(ctx context.Context, databaseURL, sqlitePath, migrationsDir string) (*Store, error) {
	if databaseURL != "" {
		db, err := sql.Open("pgx", databaseURL)
		if err != nil {
			return nil, fmt.Errorf("open PostgreSQL: %w", err)
		}
		db.SetMaxOpenConns(12)
		db.SetMaxIdleConns(4)
		if err := db.PingContext(ctx); err != nil {
			_ = db.Close()
			return nil, fmt.Errorf("connect PostgreSQL: %w", err)
		}
		if err := goose.SetDialect("postgres"); err != nil {
			_ = db.Close()
			return nil, fmt.Errorf("configure migration dialect: %w", err)
		}
		if err := goose.UpContext(ctx, db, migrationsDir); err != nil {
			_ = db.Close()
			return nil, fmt.Errorf("run database migrations: %w", err)
		}
		return &Store{db: db, mode: "postgres"}, nil
	}

	if sqlitePath == "" {
		sqlitePath = "../reach.db"
	}
	if sqlitePath != ":memory:" {
		if err := os.MkdirAll(filepath.Dir(sqlitePath), 0o755); err != nil {
			return nil, fmt.Errorf("create local database directory: %w", err)
		}
	}
	db, err := sql.Open("sqlite", sqlitePath)
	if err != nil {
		return nil, fmt.Errorf("open local SQLite database: %w", err)
	}
	db.SetMaxOpenConns(1)
	if _, err := db.ExecContext(ctx, `PRAGMA busy_timeout = 5000;`); err != nil {
		_ = db.Close()
		return nil, fmt.Errorf("configure local database: %w", err)
	}
	if err := ensureSQLiteSchema(ctx, db); err != nil {
		_ = db.Close()
		return nil, err
	}
	return &Store{db: db, mode: "sqlite"}, nil
}

func ensureSQLiteSchema(ctx context.Context, db *sql.DB) error {
	_, err := db.ExecContext(ctx, `
		CREATE TABLE IF NOT EXISTS quotes (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL,
			business_type TEXT NOT NULL,
			contact TEXT NOT NULL,
			plan TEXT NOT NULL,
			message TEXT NOT NULL DEFAULT '',
			created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
		);
		CREATE TABLE IF NOT EXISTS subscribers (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			email TEXT NOT NULL UNIQUE,
			created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
		);`)
	if err != nil {
		return fmt.Errorf("initialize local SQLite schema: %w", err)
	}
	return nil
}

func (s *Store) Mode() string { return s.mode }

func (s *Store) Ping(ctx context.Context) error { return s.db.PingContext(ctx) }

func (s *Store) Close() error { return s.db.Close() }

func (s *Store) CreateQuote(ctx context.Context, quote Quote) (int64, error) {
	if s.mode == "postgres" {
		return dbgen.New(s.db).CreateQuote(ctx, dbgen.CreateQuoteParams{
			Name: quote.Name, BusinessType: quote.BusinessType, Contact: quote.Contact,
			Plan: quote.Plan, Message: quote.Message,
		})
	}
	result, err := s.db.ExecContext(ctx, `
		INSERT INTO quotes (name, business_type, contact, plan, message)
		VALUES (?, ?, ?, ?, ?)`,
		quote.Name, quote.BusinessType, quote.Contact, quote.Plan, quote.Message,
	)
	if err != nil {
		return 0, err
	}
	return result.LastInsertId()
}

func (s *Store) Subscribe(ctx context.Context, email string) error {
	if s.mode == "postgres" {
		return dbgen.New(s.db).AddSubscriber(ctx, email)
	}
	query := `INSERT INTO subscribers (email) VALUES (?) ON CONFLICT(email) DO NOTHING`
	_, err := s.db.ExecContext(ctx, query, email)
	return err
}

func IsNotFound(err error) bool { return errors.Is(err, sql.ErrNoRows) }
