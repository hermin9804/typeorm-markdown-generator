# Makefile for managing Docker Compose with environment variables from .env

# Define the environment file
ENV_FILE = .env

# Default target
.PHONY: up down down-v help

# Bring up the services
up:
	docker-compose --env-file $(ENV_FILE) up

# Bring down the services
down:
	docker-compose --env-file $(ENV_FILE) down

# Bring down the services and remove volumes
down-v:
	docker-compose --env-file $(ENV_FILE) down -v

# Display available commands
help:
	@echo "Makefile commands:"
	@echo "  make up      - Bring up the services"
	@echo "  make down    - Bring down the services"
	@echo "  make down-v  - Bring down the services and remove volumes"
