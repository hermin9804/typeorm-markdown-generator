
# Default target
.PHONY: up down down-v help

# Bring up the services
up:
	docker-compose up

# Bring down the services
down:
	docker-compose down

# Bring down the services and remove volumes
down-v:
	docker-compose down -v

re:
	docker-compose down -v
	docker-compose up


# Display available commands
help:
	@echo "Makefile commands:"
	@echo "  make up      - Bring up the services"
	@echo "  make down    - Bring down the services"
	@echo "  make down-v  - Bring down the services and remove volumes"
