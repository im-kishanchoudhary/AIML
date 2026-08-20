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

## Batch 2 — Hard & hot (done)

| Topic | Analogy hook | Flow | Status |
|-------|--------------|------|--------|
| generative-ai-llm | A well-read intern doing super-charged autocomplete | ✅ | ✅ |
| train-test-split | A mock exam before the real one | ✅ | ✅ |
| clustering | Seating strangers at a wedding by similarity | ✅ | ✅ |
| prompt-engineering | Clear instructions to a brilliant, literal assistant | — | ✅ |
| vector-search | A librarian who finds books by vibe, not title | — | ✅ |
| rag-vs-finetuning | Look it up vs learn it by heart | — | ✅ |
| feature-engineering | Giving a detective better clues | — | ✅ |
| regression | The best-fit trend line through a cloud of dots | — | ✅ |
| classification | Sorting mail into labelled bins | — | ✅ |
| correlation | Ice-cream sales and sunburns rise together (not cause) | — | ✅ |

## Batch 3 — Foundations, tooling & core stats (done)

| Topic | Analogy hook | Flow | Status |
|-------|--------------|------|--------|
| ds-ai-ml-overview | Nested Russian dolls: AI ⊃ ML ⊃ DL ⊃ GenAI | — | ✅ |
| data-science-workflow | Cooking a meal: shop → chop → taste → cook → plate | ✅ | ✅ |
| anaconda | A pre-stocked kitchen — batteries included | — | ✅ |
| jupyter | A lab notebook: notes and live experiments side by side | — | ✅ |
| colab | A free rented lab in the cloud (someone else's fast computer) | — | ✅ |
| python-why | The universal adapter that plugs into everything | — | ✅ |
| python-data-structures | Containers: shopping list / phone book / guest list | — | ✅ |
| descriptive-stats | A one-line summary of a whole crowd | — | ✅ |
| variance-std | How consistent a machine's output is | — | ✅ |
| normal-distribution | The bell curve of heights in a population | — | ✅ |
| probability-basics | A weather forecast's "70% chance" | — | ✅ |

## Batch 4 — NumPy, Pandas, Visualization, ML, DL, MLOps (done)

| Topic | Analogy hook | Flow | Status |
|-------|--------------|------|--------|
| numpy-ndarray | An egg carton of identical cells the computer reads instantly | — | ✅ |
| numpy-vectorization | A photocopier vs writing each page by hand | — | ✅ |
| pandas-dataframe | A spreadsheet you drive with code | — | ✅ |
| pandas-loading | Importing a spreadsheet into your workspace | — | ✅ |
| pandas-cleaning | Tidying a messy desk before you start work | ✅ | ✅ |
| pandas-transform | Rearranging the furniture — same stuff, new layout | — | ✅ |
| matplotlib | Drawing a chart by giving step-by-step instructions | — | ✅ |
| choosing-a-chart | Right tool for the message — bar vs line vs scatter | — | ✅ |
| hyperparameter-tuning | Dialling in an oven for the best bake | — | ✅ |
| sklearn-workflow | One recipe (fit → predict) for every dish | ✅ | ✅ |
| activation-loss | A dimmer switch (activation) + a scorecard (loss) | — | ✅ |
| ai-applications | Wiring the model into a product like any other API | — | ✅ |
| mlops-lifecycle | Running the restaurant after opening night — keep it fresh | ✅ | ✅ |
| mlops-monitoring | Dashboard warning lights / a smoke detector | — | ✅ |

**All 45 topics done.** 🎉 11 flows in total.

## Batch 5 — Glossary (pending)

All 37 glossary terms get a one-line real-world analogy appended to their
definition. Batched last, after the topic pages land.

---

**Progress:** 45 / 45 topics ✅ · 0 / 37 glossary terms. Only the glossary
batch remains.
