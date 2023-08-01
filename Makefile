.PHONY: help

# Load environments from file and set static for caddy local running
include ./configs/default.env
export

define colored_msg
	@echo -e "|\033[36m $(1)\033[0m $(2)"
endef

# Help with description TODO
help:
	@echo -e '\nMakefile help message\n'
	@echo -e 'COMMAND\t\t\t  DESCRIPTION'
	@echo -e '------------------------------------------------------------'
	$(call colored_msg,"dev-run\\t\\t\|","Run caddy with backend locally")
	$(call colored_msg,"dev-run-docker\\t\|","Run locally with docker")
	@echo -e '------------------------------------------------------------'
	$(call colored_msg,"prod-run\\t\\t\|","Run production like system wide")
	$(call colored_msg,"prod-run-docker\\t\|","Run production with docker")
	@echo -e '------------------------------------------------------------'
	$(call colored_msg,"frontend-build\\t\|","Build front to ./static dir")
	@echo -e '------------------------------------------------------------'
	@echo

dev-docker:
	@echo "run locally all services with docker"
	@docker-compose up

dev-stop:  # TODO make more proper
	sudo killall caddy

dev-run: dev-run-caddy dev-run-backend
	@echo "run locally all services without docker"
	@echo "TODO"

dev-run-backend:
	@echo "backend server run"
	cd backend && poetry update && poetry run python app.py

dev-run-caddy: frontend-build
	@echo "Static server with proxy (Caddy2) run"
	#sudo caddy run --envfile configs/default.env --config configs/Caddyfile &
	export STATIC_FOLDER=./static && \
	export BACKEND=localhost && \
		sudo -E caddy start --config configs/Caddyfile

frontend-build:
	@echo "start front building"
	cd frontend && npm run build && cp dist/bundle.js ../static/js/app.js
	cd frontend && cp index.html ../static/
	cd frontend && cp ./dist/bundle.js.map ../static/js

# Utility section
tests:  # TODO
	@echo "start all tests"
	@echo "TODO"
