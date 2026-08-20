# Local AI Lab — Authoring Rules

Rules specific to the local, self-hosted build-along projects (see
[LOCAL-AI-LAB.md](LOCAL-AI-LAB.md)). These extend the general
[AI_RULES.md](AI_RULES.md); where they overlap, the stricter one wins.

## 1. Local-first, always

- Every step must run on the learner's own machine. **No cloud APIs, no API
  keys, no accounts.** If a concept is usually taught with a hosted API, teach
  the local equivalent (sentence-transformers for embeddings, Ollama for the
  LLM).
- After the initial model download, a project must run **fully offline**. Don't
  add a step that needs the network at runtime.

## 2. Honest hardware guidance

- State CPU/RAM/VRAM expectations plainly and never imply a GPU is required for
  classic ML — it isn't. A GPU is an accelerator, not a prerequisite.
- Default to models that fit a typical 8–16 GB laptop (`llama3.2:3b`,
  `qwen2.5:3b`, MiniLM). Always offer a lighter or quantised fallback.
- Let the runtime pick the device (Ollama and PyTorch auto-detect CUDA/Metal).
  Don't hardcode `cuda`; don't ask the learner to configure a device.

## 3. Reproducible

- Seed every random source (`np.random.default_rng(0)`, `random_state=0`).
- Pin the model **tag** explicitly (`llama3.2:3b`, not `llama3.2:latest`) so a
  step behaves the same next month.
- Generate demo data in-project so there's nothing to download and results are
  stable. Point at the learner's own data only after the pipeline works.

## 4. Real, runnable, minimal

- Every code block runs as written, in order, given the shared setup in
  LOCAL-AI-LAB.md. No pseudo-code stubs presented as working code.
- Keep each block ~15–30 lines. Show one idea per step.
- Use current, correct APIs only — verify signatures, don't invent them
  (`predict_proba`, `SentenceTransformer.encode(normalize_embeddings=True)`,
  `ollama.chat(model=…, messages=…, tools=…)`). This restates AI_RULES' no-
  hallucination rule and matters most here, where wrong APIs fail on the
  learner's machine.

## 5. Agents must be safe by construction

Any project where a model can call code must build in, and name, these rails:

- **Allowlist** — the model may only invoke explicitly registered tools; an
  unknown tool name returns a handled error, never an exception.
- **Path sandbox** — file/OS tools reject any path outside the working folder.
- **Human-in-the-loop** — write, delete, or shell actions require explicit
  confirmation. Never wire an autonomous loop straight to destructive actions.
- **Bounded** — every agent loop has a step cap.
- **Errors are data** — a failing tool returns an error string the loop can
  reason about, it doesn't crash the agent.

Teach the guardrail in the same step that introduces the capability — never as
an afterthought.

## 6. Build on what came before

The four projects form one track. Reuse artifacts across them (the saved
`churn_model.joblib`, the local embedder/LLM) instead of re-teaching setup.
State a project's prerequisites in its `goal` / `dataset` fields.

## 7. Explain the "why", connect to engineering

Each step says what the code does *and why it's there* (e.g. "fit the scaler on
train only, or you leak the test set"). Tie the local build back to real systems
— a `joblib` file is a deployable artifact; a FastAPI endpoint is the same shape
as a production model service, minus the cloud.
