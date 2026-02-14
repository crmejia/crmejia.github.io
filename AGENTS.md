# AGENTS.md

## Project Overview

This is a Hugo static site — a personal technical blog for a Site Reliability Engineer. It deploys to GitHub Pages at `crmejia.github.io` (custom domain: `crismar.me`).

## Tech Stack

- **Static site generator:** [Hugo](https://gohugo.io/) (v0.147.3 extended)
- **Theme:** `paperesque` (located in `themes/paperesque/`, customized — no longer synced with upstream)
- **Deployment:** GitHub Actions → GitHub Pages (see `.github/workflows/gh-pages.yml`)
- **Custom domain:** configured via `static/CNAME`

## Repository Structure

```
config.toml              # Hugo site configuration
content/
  _index.md              # Homepage
  about.md               # About page
  consulting.md          # Consulting services page
  posts/                 # Blog posts (markdown with YAML front matter)
themes/
  paperesque/            # Active theme (git subtree, do NOT modify)
layouts/                 # Custom layout overrides (currently minimal)
archetypes/
  default.md             # Template for new posts
static/
  CNAME                  # Custom domain file for GitHub Pages
.github/workflows/
  gh-pages.yml           # CI/CD: build Hugo site and deploy to GitHub Pages
Makefile                 # Build, lint, and dev server targets
.tool-versions           # asdf version pinning (Hugo)
```

## Key Rules

### Theme is customized

The `themes/paperesque/` directory was originally a git subtree but has been extensively customized (modern redesign with zinc palette, reactive dark mode, Inter font, Catppuccin syntax highlighting). It is no longer synced with upstream. Edit theme files directly when making visual or structural changes. Key theme files:

- **CSS**: `themes/paperesque/assets/css/style.css` (all CSS variables + styles)
- **Syntax**: `themes/paperesque/assets/css/syntax.css` (Catppuccin Mocha)
- **JS (bundled)**: `themes/paperesque/assets/js/main.js` (what Hugo serves)
- **JS (source)**: `themes/paperesque/js/` (readable source modules)
- **Layouts**: `themes/paperesque/layouts/` (Hugo templates)

When changing theme colors, keep these files in sync:
1. CSS variables in `style.css` (`:root` and `@media (prefers-color-scheme: dark)`)
2. `<meta name="theme-color">` in `layouts/_partials/meta.html`
3. Hardcoded colors in `assets/js/main.js` (theme-color meta tag updates)

### Content conventions

Blog posts live in `content/posts/` as Markdown files with YAML front matter:

```yaml
---
title: "Post Title"
date: 2024-05-08T23:19:49-04:00
draft: false
tags: ["Go", "Docker", "Kubernetes"]
description: "Optional short description"
---
```

- `draft: true` posts are not published. Set `draft: false` to publish.
- Use kebab-case for post filenames (e.g., `my-new-post.md`).
- Tags are an array of strings. Common tags in this repo: Go, Docker, Kubernetes, Terraform, AWS, Fly.io, SQLite.
- The `date` field uses ISO 8601 with timezone offset.
- New posts can be scaffolded with `hugo new posts/my-post-title.md`.

### Navigation menu

The top navigation is defined in `config.toml` under `[[params.topmenu]]`. Currently: about, blog, consulting.

## Building and Previewing

```bash
make serve     # Local dev server with drafts visible
make build     # Production build (matches CI)
make check     # Lint + clean build — run before pushing
```

The CI pipeline (`.github/workflows/gh-pages.yml`) runs on every push to `main`. It installs Hugo 0.147.3 extended, builds with `--gc --minify`, and deploys to GitHub Pages.

## Deployment

Deployment is fully automated. Push to `main` and GitHub Actions handles the rest. There is no manual deploy step. The generated `public/` directory is gitignored and should not be committed.

## Common Tasks

| Task | Command / Location |
|---|---|
| Create a new post | `hugo new posts/post-name.md` |
| Preview locally (with drafts) | `make serve` |
| Build for production | `make build` |
| Lint + build before pushing | `make check` |
| Edit site config | `config.toml` |
| Override a theme template | Copy from `themes/paperesque/layouts/` to `layouts/` and edit |
| Add a navigation item | Add a `[[params.topmenu]]` block in `config.toml` |
