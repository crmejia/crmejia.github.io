# crismar.me

Personal blog built with [Hugo](https://gohugo.io/) and the [paperesque](https://github.com/capnfabs/paperesque) theme. Deployed to GitHub Pages.

## Prerequisites

- [Hugo extended](https://gohugo.io/installation/) v0.147.3+
- [actionlint](https://github.com/rhysd/actionlint) (for `make lint` / `make check`)

If you use [asdf](https://asdf-vm.com/), the `.tool-versions` file has you covered.

## Quick start

```bash
make serve     # local dev server at http://localhost:1313 (drafts enabled)
make check     # lint + clean build — run before pushing
```

## All commands

```
make help      # show available targets
make build     # production build
make serve     # local dev server (drafts enabled)
make lint      # lint GitHub Actions workflows
make clean     # remove generated files
make check     # lint + clean build (run before pushing)
```

## Writing a new post

```bash
hugo new posts/my-post-title.md
```

This creates a draft in `content/posts/`. Set `draft: false` in the front matter when ready to publish.

## Deployment

Fully automated. Push to `main` and GitHub Actions builds and deploys to GitHub Pages. No manual steps required.
