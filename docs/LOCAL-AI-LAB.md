# Local AI Lab

Four build-along projects that run **entirely on your own machine** — no cloud
APIs, no keys, no data leaving your computer. They live in the Knowledge Hub
under **Projects** (open the app → **Projects**, or the `#projects` route) and
are meant to be done in order: each reuses what the previous one produced.

| # | Project | Level | You end with |
|---|---------|-------|--------------|
| 1 | Train your first model on your machine | Beginner | A saved `churn_model.joblib` + a local prediction endpoint |
| 2 | Local RAG with your own models | Intermediate | An offline retrieve-then-generate loop + a fine-tuned embedder |
| 3 | Build a custom agent from scratch | Advanced | A reason→act→observe agent you wrote yourself |
| 4 | Local agent with Ollama tool-calling | Advanced | A local model taking real, sandboxed actions |

The thread through all four: **you own the model and the compute.** Project 1
trains a model and saves it; project 2 runs embeddings and an LLM locally;
projects 3 and 4 turn those local models into agents.

## Hardware — what you actually need

Everything here runs on a normal laptop. A GPU only speeds things up; it is
never required.

| Workload | Minimum | Comfortable | GPU? |
|----------|---------|-------------|------|
| scikit-learn (projects 1, 3, 4 tool) | Any 4-core CPU, 8 GB RAM | 8-core CPU | Not used |
| Embeddings — MiniLM (project 2) | CPU, 8 GB RAM | Any GPU with 2 GB VRAM | Optional, auto-detected |
| Local LLM `llama3.2:3b` (projects 2, 3) | 8 GB RAM (CPU) | 6 GB VRAM | Optional, much faster |
| Tool-capable LLM `llama3.1:8b` (project 4) | 16 GB RAM (CPU) | 8 GB VRAM | Recommended |
| Lighter tool model `qwen2.5:3b` (project 4) | 8 GB RAM | 4 GB VRAM | Optional |

Low on memory? Use the smaller models (`qwen2.5:3b`, `llama3.2:3b`) or a
quantised tag (e.g. `llama3.1:8b-instruct-q4_0`). Ollama uses your GPU
automatically when it can (CUDA on NVIDIA, Metal on Apple Silicon) and falls
back to CPU otherwise — no configuration needed.

## One-time setup (shared by all four)

```bash
# 1) Isolated Python environment
python -m venv .venv
# Windows: .venv\Scripts\activate    macOS/Linux: source .venv/bin/activate

# 2) Core libraries
pip install scikit-learn pandas numpy joblib          # projects 1, 3, 4
pip install sentence-transformers                      # project 2 (pulls PyTorch)
pip install ollama fastapi uvicorn                     # LLM client + optional serving

# 3) Ollama — the local LLM runtime  (https://ollama.com/download)
ollama pull llama3.2:3b        # projects 2 & 3
ollama pull llama3.1:8b        # project 4 (or: ollama pull qwen2.5:3b)
```

Ollama runs as a local server on `http://localhost:11434`; the `ollama` Python
package talks to it. Nothing in these projects makes an outbound request once the
models are downloaded.

## How the projects connect

```
Project 1  ──►  churn_model.joblib ──┐
                                     ├─►  Project 3  (custom agent: model as a tool)
Project 2  ──►  local embedder + LLM ┘        │
                                              ▼
                                        Project 4  (Ollama tool-calling + real actions)
```

Run project 1 first — it produces `churn_model.joblib`, which projects 3 and 4
load as an agent tool. Project 2 is independent but introduces the local LLM the
agents drive.

## Safety (projects 3 & 4)

These agents can call real functions. The projects build in the guardrails you
should never skip:

- **Allowlist** — the agent may only call tools you registered.
- **Path sandbox** — file tools refuse any path outside the working folder.
- **Human-in-the-loop** — write/delete/shell actions require an explicit `y/N`.
- **Step cap** — the loop stops after N steps so it can't spin forever.

Never wire an autonomous loop directly to shell execution or file deletion
without confirmation. See [LOCAL-AI-RULES.md](LOCAL-AI-RULES.md) for the full
rule set.

## Troubleshooting

- **`ConnectionError` / `connection refused` from `ollama`** — the Ollama app/
  server isn't running. Start it (launch the app, or `ollama serve`), then retry.
- **`model not found`** — run the matching `ollama pull …` first.
- **First run is slow** — models download once (MiniLM ~90 MB; LLMs 2–5 GB) and
  are cached afterwards.
- **Out of memory loading an LLM** — switch to a smaller or quantised tag.
- **`ModuleNotFoundError`** — activate the venv, then re-run the `pip install`.
