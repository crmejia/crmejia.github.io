# AGENTS.md

## Project Overview

This is a Hugo static site — a personal technical blog for a Site Reliability Engineer. It deploys to GitHub Pages at `crmejia.github.io` (custom domain: `crismar.me`).

## Tech Stack

- **Static site generator:** [Hugo](https://gohugo.io/) (v0.121.1 extended)
- **Theme:** `paperesque` (located in `themes/paperesque/`, added as a git subtree)
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
```

## Key Rules

### Do not modify the theme

The `themes/paperesque/` directory is a git subtree from an upstream repo. Do not edit files inside it. Use Hugo's layout override mechanism instead — place files in the top-level `layouts/` directory to override theme templates.

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
# Local dev server with drafts visible
hugo server -D

# Production build (matches CI)
hugo --gc --minify
```

The CI pipeline (`.github/workflows/gh-pages.yml`) runs on every push to `main`. It installs Hugo 0.121.1 extended + Dart Sass, builds with `--gc --minify`, and deploys to GitHub Pages.

## Deployment

Deployment is fully automated. Push to `main` and GitHub Actions handles the rest. There is no manual deploy step. The generated `public/` directory is gitignored and should not be committed.

## Common Tasks

| Task | Command / Location |
|---|---|
| Create a new post | `hugo new posts/post-name.md` |
| Preview locally (with drafts) | `hugo server -D` |
| Build for production | `hugo --gc --minify` |
| Edit site config | `config.toml` |
| Override a theme template | Copy from `themes/paperesque/layouts/` to `layouts/` and edit |
| Add a navigation item | Add a `[[params.topmenu]]` block in `config.toml` |
