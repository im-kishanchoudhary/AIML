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
ai-ml-knowledge-hub/      # the published site (only this folder is deployed)
  index.html              #   app shell (loads data, then the app)
  assets/css/             #   organic.css (design tokens) + app.css
  assets/js/              #   viz.js (interactive diagrams) + app.js (controller)
  data/                   #   16 content modules → window.KB, PATHS, PROJECTS, …
docs/                     # project governance (not deployed)
  WORKSHOP-SPEC.md        #   scope, audience, features — the source of truth
  AI_RULES.md             #   how content and code are authored
  LOCAL-AI-LAB.md         #   guide to the run-it-locally build-along track
  LOCAL-AI-RULES.md       #   authoring rules for the local builds
```

## Local AI Lab

Four build-along projects that run entirely on your own machine (local CPU/GPU,
no cloud, no API keys) — train and use a model, build local RAG, and build two
kinds of agent. They're in the app under **Projects**; the setup, hardware
requirements, and safety notes are in
[docs/LOCAL-AI-LAB.md](docs/LOCAL-AI-LAB.md).

## Hosting (automatic)

Pushing to `main` publishes to **GitHub Pages** via
[`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml). The
workflow uploads **only** the `ai-ml-knowledge-hub/` folder as the site root, so
governance docs in `docs/` stay in the repo but never ship with the site. All
asset paths are relative, so it works whether Pages serves from a root or a
`/<repo>/` subpath.

**One-time setup:** in the repo, go to **Settings → Pages → Build and deployment →
Source** and select **GitHub Actions**. After that, every push to `main` deploys
automatically.
