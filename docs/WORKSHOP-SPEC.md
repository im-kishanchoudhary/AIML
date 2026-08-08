# Workshop Spec

What the AI/ML Knowledge Hub is, who it's for, and what it must cover. This is
the source of truth for scope; [AI_RULES.md](AI_RULES.md) governs how content is
written.

## Purpose

An interactive, searchable **companion** to the organization's Data Science, AI
& Machine Learning workshop — not a replacement for it. It helps participants
prepare before a session, review after, connect theory to practical examples,
search terminology, see how concepts relate, and revise before interviews.

## Audience

Software developers who know programming, APIs, databases, app development, and
cloud — but are new to data science, statistics, ML, deep learning, GenAI, LLMs,
and RAG. Explanations bridge **software engineering → data science → ML → GenAI**.

## Scope

Ten categories, in guided learning order:

| # | Category | Covers |
|---|----------|--------|
| 1 | Foundations | The big picture, the DS workflow, tools of the trade |
| 2 | Python | Why Python leads data work; core structures |
| 3 | NumPy | Fast numeric arrays |
| 4 | Pandas | Load, clean, reshape, explore tabular data |
| 5 | Visualization | Matplotlib; turning numbers into charts |
| 6 | Statistics | Centre, spread, shape, relationships, tests |
| 7 | Machine Learning | Regression, classification, clustering, evaluation, tuning |
| 8 | Deep Learning | Neural nets, activations, gradient descent, CNN/RNN/Transformers |
| 9 | Generative AI | LLMs, tokens, embeddings, prompt engineering, RAG, vector search |
| 10 | MLOps | The lifecycle: train → evaluate → deploy → monitor → retrain (supporting) |

Plus a **Glossary** for fast term lookup.

## Learning philosophy

Every concept follows the same arc: **definition → problem it solves →
real-world example → how it works → Python example → limitations → related
concepts → key takeaway**, and always ties back to software engineering. See
[AI_RULES.md](AI_RULES.md) for the full content model.

## Application requirements

A standalone web app — **HTML, CSS, JavaScript, no backend, no database,
offline-capable, responsive**. Open `index.html` and it works immediately.

### Features

- **Global search** (`Ctrl / ⌘ + K`) across titles, definitions, problems,
  examples, keywords, and related topics — with category and excerpt in results.
- **Sidebar** with topics grouped hierarchically by category, plus a learning
  progress bar; collapses to a drawer on mobile.
- **Five study modes:** Learn (full explanations), Cheat (condensed reference),
  Interview (spaced-repetition self-quiz), Compare (side-by-side tables), Visual
  (all diagrams).
- **Guided learning paths** — ordered tracks across categories, with quizzes.
- **Build-along projects** — end-to-end builds with runnable, checkpointed steps.
- **Concept map** — topics laid out by prerequisite depth, showing what each
  concept needs and unlocks.
- **Dashboard** — progress, mastery, due reviews, and weak spots.
- **Progress tracking** via `localStorage` (completed, recently viewed, review
  state). No account or server.

## Extensibility

Topics are plain JS objects rendered dynamically, so new topics are added by
editing data files — never by redesigning the UI. Representative shape:

```javascript
{
  id: "standard-deviation",
  category: "statistics",
  title: "Standard deviation",
  difficulty: "Beginner",
  definition: "...",
  problem: "...",
  example: "...",
  howItWorks: "...",
  code: "...",
  limitations: [],
  related: [],
  keywords: []
}
```

## Success criteria

For any topic, a learner can answer: *What is this? Why do I need it? What
problem does it solve? How does it relate to ML? How would I use it in Python?
Where would I meet it in a real app? What should I remember?* If not, the topic
is incomplete.

## Out of scope

Not a generic programming tutorial, a full Python or maths course, a
vendor-specific cloud manual, a Kubernetes/MLOps platform guide, or a pile of
shallow definitions and buzzwords. Stay aligned with the workshop.
