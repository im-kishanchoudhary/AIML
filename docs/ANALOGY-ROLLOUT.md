# Real-World Analogy Rollout — Tracker

Adding, to every topic, a **"Like in the real world"** analogy (best-fit, plain
language, tied back to the actual mechanism) and — for process-type topics — an
**interactive flow strip**. Goal: make each complex idea click against something
a student or professional already understands.

**Data:** `analogy` (string) and optional `flow` ({ title, stages:[{icon,label,d}] })
live in `data/enrichment.js`, merged onto topics at load. Rendered by
`renderTopic` / `renderTopicCheat`. See [AI_RULES.md](AI_RULES.md) — one analogy
per concept, concrete over abstract, always tied to the line/idea it explains.

Legend: ✅ done · ⬜ pending · **Flow** = gets an interactive flow strip.

## Pilot (batch 1 — done)

| Topic | Analogy hook | Flow | Status |
|-------|--------------|------|--------|
| ml-fundamentals | Teach a new hire with past cases, not a rulebook | ✅ | ✅ |
| gradient-descent | Hiking downhill in fog, feeling for the steepest step | ✅ | ✅ |
| neural-networks | Assembly line of specialists, each spotting more | ✅ | ✅ |
| rag | Open-book exam instead of a memory test | ✅ | ✅ |
| overfitting | Student who memorised last year's exam paper | — | ✅ |
| tokens-embeddings | A GPS coordinate for every word's meaning | — | ✅ |
| standardization | Convert every price to one currency before comparing | — | ✅ |
| model-evaluation | A report card, not one grade (don't judge a fish by climbing) | — | ✅ |
| hypothesis-testing | A courtroom: innocent until the evidence is surprising enough | — | ✅ |
| cnn-rnn-transformers | Magnifying glass / reading aloud / reading the whole page at once | — | ✅ |

## Batch 2 — Foundations & tooling (pending)

| Topic | Analogy hook | Flow | Status |
|-------|--------------|------|--------|
| ds-ai-ml-overview | Nested Russian dolls: AI ⊃ ML ⊃ DL ⊃ GenAI | — | ⬜ |
| data-science-workflow | Cooking a meal: gather → prep → cook → serve | Flow | ⬜ |
| anaconda | A pre-stocked toolbox — batteries included | — | ⬜ |
| jupyter | A lab notebook: notes and live experiments side by side | — | ⬜ |
| colab | A free rented lab in the cloud (someone else's fast computer) | — | ⬜ |
| python-why | The universal adapter that plugs into everything | — | ⬜ |
| python-data-structures | Containers: shopping list / phone book / guest list | — | ⬜ |

## Batch 3 — NumPy, Pandas, Visualization (pending)

| Topic | Analogy hook | Flow | Status |
|-------|--------------|------|--------|
| numpy-ndarray | An egg carton of identical cells the computer reads instantly | — | ⬜ |
| numpy-vectorization | A photocopier vs writing each page by hand | — | ⬜ |
| pandas-dataframe | A spreadsheet you drive with code | — | ⬜ |
| pandas-loading | Importing a spreadsheet into your workspace | — | ⬜ |
| pandas-cleaning | Tidying a messy desk before you start work | Flow | ⬜ |
| pandas-transform | Rearranging the furniture — same stuff, new layout | — | ⬜ |
| matplotlib | Drawing a chart by giving step-by-step instructions | — | ⬜ |
| choosing-a-chart | Right tool for the message — bar vs line vs scatter | — | ⬜ |

## Batch 4 — Statistics (pending)

| Topic | Analogy hook | Flow | Status |
|-------|--------------|------|--------|
| descriptive-stats | A one-line summary of a whole crowd | — | ⬜ |
| variance-std | How consistent a machine's output is | — | ⬜ |
| normal-distribution | The bell curve of heights in a population | — | ⬜ |
| probability-basics | A weather forecast's "70% chance" | — | ⬜ |
| correlation | Ice-cream sales and sunburns rise together (not cause) | — | ⬜ |

## Batch 5 — Machine Learning (pending)

| Topic | Analogy hook | Flow | Status |
|-------|--------------|------|--------|
| regression | Drawing the best-fit trend line through a cloud of dots | — | ⬜ |
| classification | Sorting mail into labelled bins | — | ⬜ |
| clustering | Seating strangers by similarity at a party | — | ⬜ |
| train-test-split | A mock exam before the real one | Flow | ⬜ |
| feature-engineering | Giving a detective better clues to work from | — | ⬜ |
| hyperparameter-tuning | Tuning the dials on an oven for the best bake | — | ⬜ |
| sklearn-workflow | The same recipe steps for any dish | Flow | ⬜ |

## Batch 6 — Deep Learning & GenAI (pending)

| Topic | Analogy hook | Flow | Status |
|-------|--------------|------|--------|
| activation-loss | A dimmer switch (activation) + a scorecard (loss) | — | ⬜ |
| generative-ai-llm | A very well-read intern doing super-charged autocomplete | — | ⬜ |
| prompt-engineering | Clear instructions to a brilliant but literal assistant | — | ⬜ |
| rag-vs-finetuning | Look it up vs learn it by heart | — | ⬜ |
| vector-search | A librarian who finds books by vibe, not exact title | — | ⬜ |
| ai-applications | Wiring the model into a product like any other API | — | ⬜ |

## Batch 7 — MLOps (pending)

| Topic | Analogy hook | Flow | Status |
|-------|--------------|------|--------|
| mlops-lifecycle | Running the restaurant after opening night — keep it fresh | Flow | ⬜ |
| mlops-monitoring | Dashboard warning lights / a smoke detector | — | ⬜ |

## Batch 8 — Glossary (pending)

All 37 glossary terms get a one-line real-world analogy appended to their
definition. Batched last, after the topic pages land.

---

**Progress:** 10 / 45 topics · 0 / 37 glossary terms.
