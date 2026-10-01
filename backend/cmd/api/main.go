package main

import (
	"context"
	"errors"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"strings"
	"syscall"
	"time"

	"github.com/mohdasif-one/reach/backend/internal/config"
	"github.com/mohdasif-one/reach/backend/internal/httpapi"
	"github.com/mohdasif-one/reach/backend/internal/store"
)

func main() {
	logger := slog.New(slog.NewJSONHandler(os.Stdout, nil))
	slog.SetDefault(logger)
	cfg := config.Load()

	startupCtx, cancelStartup := context.WithTimeout(context.Background(), 30*time.Second)
	db, err := store.Open(startupCtx, cfg.DatabaseURL, cfg.SQLitePath, cfg.MigrationsDir)
	cancelStartup()
	if err != nil {
		slog.Error("database startup failed", "error", err)
		os.Exit(1)
	}
	defer db.Close()

	handler := httpapi.New(db, httpapi.RouterConfig{
		AllowedOrigin: cfg.AllowedOrigin,
		WebDistDir:    cfg.WebDistDir,
	})
	server := &http.Server{
		Addr:              ":" + strings.TrimPrefix(cfg.Port, ":"),
		Handler:           handler,
		ReadHeaderTimeout: cfg.ReadTimeout,
		WriteTimeout:      cfg.WriteTimeout,
		IdleTimeout:       cfg.IdleTimeout,
	}

	shutdownCtx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()
	go func() {
		<-shutdownCtx.Done()
		ctx, cancel := context.WithTimeout(context.Background(), 8*time.Second)
		defer cancel()
		if err := server.Shutdown(ctx); err != nil {
			slog.Error("graceful shutdown failed", "error", err)
		}
	}()

	slog.Info("REACH API ready", "address", server.Addr, "database", db.Mode())
	if err := server.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
		slog.Error("server stopped unexpectedly", "error", err)
		os.Exit(1)
	}
}
