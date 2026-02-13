SHELL := /bin/bash
.DEFAULT_GOAL := help
.PHONY: help build serve lint clean check

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-10s\033[0m %s\n", $$1, $$2}'

build: ## Build the site for production
	hugo --gc --minify

serve: ## Start local dev server (drafts enabled)
	hugo server -D

lint: ## Lint GitHub Actions workflows
	actionlint .github/workflows/*.yml

clean: ## Remove generated files
	rm -rf public/ resources/_gen/

check: clean lint build ## Lint + clean build (run before pushing)
