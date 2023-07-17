.PHONY: help

define colored_msg
	@echo -e "\033[36m$(1)\t\033[0m $(2)"
endef

# Help with description TODO
help:
	@echo -e '\nMakefile help message\n'
	@echo -e 'COMMAND\t\t DESCRIPTION'
	$(call colored_msg,"run-server:","Это обычный текст.")
	$(call colored_msg,"frontend-build:","Это обычный текст.")
	@echo other command in-progress of documenting

dev-run:
	@echo "run locally all services without docker"
	@echo "TODO"

dev-run-docker:
	@echo "run locally all services with docker"
	@docker-compose up

dev-run-server:
	@echo "backend server run"
	cd backend && poetry update && poetry run python app.py

dev-run-caddy: dev-frontend-build
	@echo "static server with proxy (Caddy2) run"
	sudo caddy run --config configs/Caddyfile

dev-frontend-build:
	@echo "start front building"
	cd frontend && npm run build && cp dist/bundle.js ../static/js/app.js
	cd frontend && cp index.html ../static/
	cd frontend && cp ./dist/bundle.js.map ../static/js

# Utility section
tests:
	@echo "start all tests"
	@echo "TODO"
