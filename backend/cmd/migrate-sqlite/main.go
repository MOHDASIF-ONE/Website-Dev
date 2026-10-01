package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"os"
	"path/filepath"
	"time"

	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/joho/godotenv"
	_ "modernc.org/sqlite"
)

type record struct {
	id        int64
	createdAt sql.NullString
}

func main() {
	_ = godotenv.Load(filepath.Join("..", ".env"), ".env")
	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		log.Fatal("DATABASE_URL must point to the PostgreSQL destination")
	}
	sourcePath := os.Getenv("SQLITE_PATH")
	if sourcePath == "" {
		sourcePath = filepath.Join("..", "reach.db")
	}

	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Minute)
	defer cancel()
	source, err := sql.Open("sqlite", sourcePath)
	if err != nil {
		log.Fatal(err)
	}
	defer source.Close()
	destination, err := sql.Open("pgx", databaseURL)
	if err != nil {
		log.Fatal(err)
	}
	defer destination.Close()
	if err := destination.PingContext(ctx); err != nil {
		log.Fatalf("connect to PostgreSQL: %v", err)
	}
	tx, err := destination.BeginTx(ctx, nil)
	if err != nil {
		log.Fatal(err)
	}
	quotes, err := source.QueryContext(ctx, `SELECT id, name, business_type, contact, plan, COALESCE(message, ''), COALESCE(created_at, '') FROM quotes ORDER BY id`)
	if err != nil {
		log.Fatal(err)
	}
	quoteCount := 0
	for quotes.Next() {
		var row record
		var name, businessType, contact, plan, message string
		if err := quotes.Scan(&row.id, &name, &businessType, &contact, &plan, &message, &row.createdAt); err != nil {
			_ = quotes.Close()
			_ = tx.Rollback()
			log.Fatal(err)
		}
		_, err = tx.ExecContext(ctx, `INSERT INTO quotes (id, name, business_type, contact, plan, message, created_at) VALUES ($1, $2, $3, $4, $5, $6, COALESCE(NULLIF($7, '')::timestamptz, NOW())) ON CONFLICT (id) DO NOTHING`, row.id, name, businessType, contact, plan, message, row.createdAt.String)
		if err != nil {
			_ = quotes.Close()
			_ = tx.Rollback()
			log.Fatalf("copy quote row %d: %v", row.id, err)
		}
		quoteCount++
	}
	if err := quotes.Err(); err != nil {
		_ = quotes.Close()
		_ = tx.Rollback()
		log.Fatal(err)
	}
	_ = quotes.Close()

	subscribers, err := source.QueryContext(ctx, `SELECT id, email, COALESCE(created_at, '') FROM subscribers ORDER BY id`)
	if err != nil {
		_ = tx.Rollback()
		log.Fatal(err)
	}
	subscriberCount := 0
	for subscribers.Next() {
		var row record
		var email string
		if err := subscribers.Scan(&row.id, &email, &row.createdAt); err != nil {
			_ = subscribers.Close()
			_ = tx.Rollback()
			log.Fatal(err)
		}
		_, err = tx.ExecContext(ctx, `INSERT INTO subscribers (id, email, created_at) VALUES ($1, $2, COALESCE(NULLIF($3, '')::timestamptz, NOW())) ON CONFLICT DO NOTHING`, row.id, email, row.createdAt.String)
		if err != nil {
			_ = subscribers.Close()
			_ = tx.Rollback()
			log.Fatalf("copy subscriber row %d: %v", row.id, err)
		}
		subscriberCount++
	}
	if err := subscribers.Err(); err != nil {
		_ = subscribers.Close()
		_ = tx.Rollback()
		log.Fatal(err)
	}
	_ = subscribers.Close()

	for _, table := range []string{"quotes", "subscribers"} {
		statement := fmt.Sprintf(`SELECT setval(pg_get_serial_sequence('%s', 'id'), GREATEST(COALESCE(MAX(id), 1), 1), COUNT(*) > 0) FROM %s`, table, table)
		if _, err := tx.ExecContext(ctx, statement); err != nil {
			_ = tx.Rollback()
			log.Fatalf("synchronize %s sequence: %v", table, err)
		}
	}
	if err := tx.Commit(); err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Imported %d quote requests and %d newsletter subscriptions.\n", quoteCount, subscriberCount)
}
