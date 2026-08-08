# AI/ML Knowledge Hub

An interactive, searchable cheat sheet for Data Science, AI, Machine Learning,
Generative AI and MLOps — built for software engineers moving into AI/ML.

It's a single-page app with **no build step and no backend**: vanilla JS, local
CSS, embedded data modules, and `localStorage` for progress. Open it over HTTP
and it works fully offline after that.

## Run locally

`localStorage` needs a real origin, so serve it over HTTP rather than opening the
file directly:

```bash
python -m http.server 8777
```

Then visit <http://127.0.0.1:8777/ai-ml-knowledge-hub/index.html>.

## Project layout

```
ai-ml-knowledge-hub/
  index.html            # app shell (loads data, then the app)
  assets/css/           # organic.css (design tokens) + app.css
  assets/js/            # viz.js (interactive diagrams) + app.js (controller)
  data/                 # 16 content modules → window.KB, PATHS, PROJECTS, …
  AI_RULES.md           # content & design rules the hub follows
```

## Hosting (automatic)

Pushing to `main` publishes to **GitHub Pages** via
[`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml). The
workflow uploads the `ai-ml-knowledge-hub/` folder as the site root, so the app
serves from the repository's Pages URL. All asset paths are relative, so it works
whether Pages serves from a root or a `/<repo>/` subpath.

**One-time setup:** in the repo, go to **Settings → Pages → Build and deployment →
Source** and select **GitHub Actions**. After that, every push to `main` deploys
automatically.
