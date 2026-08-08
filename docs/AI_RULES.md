# Authoring Rules

How content and code are written for the AI/ML Knowledge Hub. Read alongside
[WORKSHOP-SPEC.md](WORKSHOP-SPEC.md), which defines the scope these rules serve.

## Source of truth

- **[WORKSHOP-SPEC.md](WORKSHOP-SPEC.md) is authoritative** for scope. Don't add
  topics or technologies just because they're popular.
- Anything useful but outside workshop scope is marked **"Beyond workshop"** and
  kept off the main learning path.

## Technology scope

Primary: **Python, NumPy, Pandas, Matplotlib, Jupyter/Colab, Anaconda**.
ML: **scikit-learn**. GenAI concepts: **LLMs, embeddings, RAG, prompt
engineering**. Other tools may be *mentioned* for context but must not expand
the scope. Don't turn the project into a Python course, a maths course, or a
Kubernetes/MLOps platform manual.

## Every topic answers nine questions

A topic is complete only when it covers: **What · Why · Problem · How ·
Example · Engineering connection · When to use / when not · Limitations ·
Key takeaway**. Never ship a topic that is only a dictionary definition.

Supporting rules:

- **Real-world example required** — prefer fraud detection, churn, forecasting,
  recommendation, segmentation, document search, RAG chatbot, and similar cases
  a software engineer already understands.
- **Engineering translation** — connect each concept to how it fits an app
  (e.g. "a trained model is called behind an API like any other service").
- **Define terminology on first use.** Don't assume ML vocabulary.
- **No isolated pages** — every topic links to related concepts and, where
  known, its prerequisites and what it unlocks (drives the concept map).

## Accuracy

- **No hallucination.** Don't invent library APIs, functions, algorithms,
  formulas, or product features. Verify before stating as fact.
- **No buzzwords.** Every term gets a concrete explanation and purpose.
- **Trade-offs, not winners.** Never imply one algorithm is universally best;
  explain why one might be chosen (data, interpretability, cost, latency).
- **Maths explains, not intimidates:** show the formula, define each symbol,
  say why it matters, give a small numeric example, note where it appears in ML.

## Code examples

Small, correct, runnable, easy to modify — roughly **20–30 lines max**. Prefer
`numpy` / `pandas` / `matplotlib` / `scikit-learn`. Never add code just to look
technical.

## Comparisons & visualizations

- When two concepts are commonly confused, add a **comparison table** (e.g.
  precision vs recall, normalization vs standardization, RAG vs fine-tuning).
- Add an **interactive visualization** only when it builds intuition a table
  can't (distributions, correlation, regression, confusion matrix, clustering,
  gradient descent, RAG). No decorative animation.
- Interactivity must have a learning purpose (search, filter, quiz, progress,
  diagrams). Difficulty is tagged Beginner / Intermediate / Advanced — don't
  make everything Advanced.

## Architecture & platform

- **Content is separate from presentation:** topic data (JS objects) →
  rendering (JS) → HTML → CSS. Don't hardcode content into markup.
- **Runs with no backend:** vanilla JS, local CSS, embedded data, `localStorage`.
  No dependency that requires the network.
- **Accessible & responsive:** semantic HTML, keyboard navigation, visible focus,
  sufficient contrast, never color alone. Works desktop → mobile; the sidebar
  collapses into a drawer on small screens.

## When changing existing files

Change only what's necessary. Preserve existing content, navigation,
functionality, styling, and the `localStorage` data model. After any change,
re-check: search, navigation, prev/next, topic rendering, progress, interactive
components, mobile layout, and the console (zero errors).
