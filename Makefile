.PHONY: help db-generate db-migrate db-push db-studio db-teardown format

help:
	@echo "Available commands:"
	@echo "  make db-generate   - Generate Drizzle migration from schema changes"
	@echo "  make db-migrate    - Apply pending migrations to database"
	@echo "  make db-push       - Push schema directly (development only)"
	@echo "  make db-studio     - Open Drizzle Studio"
	@echo "  make db-teardown   - Drop all tables (WARNING: destructive)"
	@echo "  make format        - Format code with Prettier"

db-generate:
	@echo "Generating migration..."
	@bun run db:generate

db-migrate:
	@echo "Applying migrations..."
	@bun run db:migrate

db-push:
	@echo "Pushing schema changes..."
	@bun run db:push

db-studio:
	@echo "Opening Drizzle Studio..."
	@bun run db:studio

db-teardown:
	@echo "WARNING: This will drop all tables!"
	@read -p "Are you sure? (y/N): " confirm && [ "$$confirm" = "y" ] || exit 1
	@echo "Dropping all tables..."
	@bun run --env-file=.env tsx scripts/db-teardown.ts

format:
	@echo "Formatting code..."
	@bun run format
