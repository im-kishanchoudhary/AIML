/* ============================================================
   Phase 13 — Build-along mini-projects.
   Each project stitches several topics into one end-to-end
   build. Steps carry a linked `topic`, a short brief, runnable
   code and a checkpoint (what you should see). Progress reuses
   the shared "completed"-style state via a dedicated key.
   Plain, hand-editable data — add a project or a step freely.
   `topic` ids must exist in data/*.js (validated at render).
   ============================================================ */
window.PROJECTS = [
  {
    id: "churn-model",
    title: "Predict customer churn",
    level: "Beginner",
    blurb: "Build a classifier that flags which customers are about to leave — the classic first end-to-end ML project.",
    goal: "Go from a raw customer table to a trained, honestly-evaluated churn classifier, then read which signals drive its predictions.",
    dataset: "A synthetic telecom table generated in step 1 — no download needed. Swap in the real Telco Churn CSV later.",
    outcome: "A model that scores ~0.80 ROC-AUC, plus the top features it leans on — and the vocabulary to explain it.",
    stack: ["pandas", "scikit-learn"],
    steps: [
      {
        title: "Make a dataset to work with",
        topic: "pandas-dataframe",
        detail: "Generate a small customer table so the whole project runs offline. Each row is a customer; `churn` is what we'll predict.",
        code: "import numpy as np, pandas as pd\nrng = np.random.default_rng(0)\nn = 1200\ndf = pd.DataFrame({\n  'tenure_months': rng.integers(1, 72, n),\n  'monthly_charge': rng.normal(70, 25, n).round(2),\n  'support_calls': rng.poisson(1.5, n),\n  'is_month_to_month': rng.integers(0, 2, n),\n})\n# churn is likelier for new, month-to-month, high-support-call customers\nrisk = (df.is_month_to_month*1.2 + df.support_calls*0.4 - df.tenure_months*0.04)\ndf['churn'] = (rng.random(n) < 1/(1+np.exp(-risk+1))).astype(int)\nprint(df.head())\nprint('churn rate:', df.churn.mean().round(3))",
        checkpoint: "A 1,200-row table prints, with a churn rate around 0.35–0.45."
      },
      {
        title: "Clean and sanity-check",
        topic: "pandas-cleaning",
        detail: "Real data has gaps. Practise the habit now: check types, look for missing values, and eyeball the class balance before modelling.",
        code: "print(df.dtypes)\nprint('missing:\\n', df.isna().sum())\nprint(df.describe().round(1))\n# no NaNs here, but this is where you'd fillna / drop in real data",
        checkpoint: "Zero missing values, and numeric ranges that look sane (tenure 1–72, charges near 70)."
      },
      {
        title: "Engineer a feature",
        topic: "feature-engineering",
        detail: "Models learn from signal you expose. Add spend-per-tenure — a ratio that often separates churners from loyal customers better than either column alone.",
        code: "df['charge_per_tenure'] = (df.monthly_charge / (df.tenure_months + 1)).round(3)\nfeatures = ['tenure_months','monthly_charge','support_calls','is_month_to_month','charge_per_tenure']\nX, y = df[features], df['churn']\nprint(X.head())",
        checkpoint: "`X` now has five columns including the new `charge_per_tenure`."
      },
      {
        title: "Split before you touch a model",
        topic: "train-test-split",
        detail: "Hold out a test set FIRST — it's your only honest estimate of real-world performance. `stratify` keeps the churn rate equal in both halves.",
        code: "from sklearn.model_selection import train_test_split\nX_tr, X_te, y_tr, y_te = train_test_split(\n  X, y, test_size=0.25, stratify=y, random_state=0)\nprint('train:', X_tr.shape, ' test:', X_te.shape)",
        checkpoint: "~900 training rows and ~300 test rows, printed."
      },
      {
        title: "Scale, then train",
        topic: "standardization",
        detail: "Fit the scaler on TRAIN only (fitting on all data leaks the test set), then train a simple, strong baseline classifier.",
        code: "from sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\nscaler = StandardScaler().fit(X_tr)          # fit on train only\nmodel = LogisticRegression(max_iter=1000)\nmodel.fit(scaler.transform(X_tr), y_tr)\nprint('trained')",
        checkpoint: "It prints `trained` with no convergence warning."
      },
      {
        title: "Evaluate honestly",
        topic: "model-evaluation",
        detail: "Accuracy alone lies on imbalanced data. Read ROC-AUC and the full report — precision and recall tell you what the model actually catches.",
        code: "from sklearn.metrics import roc_auc_score, classification_report\nproba = model.predict_proba(scaler.transform(X_te))[:,1]\nprint('ROC-AUC:', round(roc_auc_score(y_te, proba), 3))\nprint(classification_report(y_te, (proba>0.5).astype(int)))",
        checkpoint: "ROC-AUC around 0.78–0.85 — clearly better than 0.5 (random)."
      },
      {
        title: "Read what drives it",
        topic: "classification",
        detail: "A logistic model's coefficients are interpretable: positive pushes toward churn, negative toward staying. This is how you explain a model to a stakeholder.",
        code: "import pandas as pd\ncoef = pd.Series(model.coef_[0], index=features).sort_values()\nprint(coef.round(3))\n# expect: is_month_to_month & support_calls positive; tenure negative",
        checkpoint: "Coefficients rank the drivers — month-to-month and support calls raise churn risk, tenure lowers it."
      }
    ]
  },
  {
    id: "rag-chatbot",
    title: "Build a RAG document chatbot",
    level: "Intermediate",
    blurb: "Make an LLM answer questions from your own documents — with citations — the flagship applied-AI build.",
    goal: "Chunk documents, embed them, retrieve the relevant pieces for a question, and have an LLM answer strictly from what was retrieved.",
    dataset: "A handful of short text snippets defined inline. Point it at your own docs once the pipeline works.",
    outcome: "A working retrieve-then-answer loop you can explain end-to-end, and a clear view of why RAG beats fine-tuning for changing knowledge.",
    stack: ["numpy", "an embedding model", "an LLM API"],
    steps: [
      {
        title: "Understand the pieces",
        topic: "generative-ai-llm",
        detail: "An LLM only knows its training data. RAG feeds it fresh, private context at question time so it can answer things it was never trained on — without retraining.",
        code: "# Mental model of the loop we're building:\n#   question -> embed -> find nearest chunks -> stuff into prompt -> LLM answers\n# No fine-tuning. Update knowledge by editing documents.\nprint('RAG = Retrieval-Augmented Generation')",
        checkpoint: "You can say the four stages of the loop out loud: embed, retrieve, augment, generate."
      },
      {
        title: "Chunk your documents",
        topic: "rag",
        detail: "Retrieval works on pieces, not whole files. Split documents into small, self-contained chunks so each retrieved piece is focused.",
        code: "docs = [\n  'Refunds are available within 30 days of purchase with a receipt.',\n  'Our support team is available Monday to Friday, 9am to 6pm.',\n  'The Pro plan includes unlimited projects and priority support.',\n  'Data is encrypted at rest and in transit using AES-256.',\n]\nchunks = docs  # already short; real docs: split ~200-500 tokens each\nprint(len(chunks), 'chunks ready')",
        checkpoint: "A list of short, standalone chunks — each answers one thing."
      },
      {
        title: "Embed the chunks",
        topic: "tokens-embeddings",
        detail: "An embedding turns text into a vector where similar meanings sit close together. Embed every chunk once and keep the vectors.",
        code: "# Using OpenAI-style embeddings (swap for any provider / local model):\n# from openai import OpenAI; client = OpenAI()\n# def embed(text):\n#     return client.embeddings.create(\n#         model='text-embedding-3-small', input=text).data[0].embedding\n#\n# For an offline demo, fake it with a hashing embedding:\nimport numpy as np\ndef embed(text):\n    v = np.zeros(64)\n    for w in text.lower().split():\n        v[hash(w) % 64] += 1\n    return v / (np.linalg.norm(v) + 1e-9)\nchunk_vecs = np.array([embed(c) for c in chunks])\nprint('embedded:', chunk_vecs.shape)",
        checkpoint: "A matrix of one vector per chunk (here 4 × 64)."
      },
      {
        title: "Retrieve by similarity",
        topic: "vector-search",
        detail: "For a question, embed it and rank chunks by cosine similarity. The top-k are your evidence. In production a vector DB does this at scale.",
        code: "def retrieve(question, k=2):\n    q = embed(question)\n    sims = chunk_vecs @ q            # cosine (vectors are normalized)\n    top = sims.argsort()[::-1][:k]\n    return [chunks[i] for i in top]\n\nctx = retrieve('how long do I have to get a refund?')\nprint(ctx)",
        checkpoint: "The refund chunk is retrieved first for a refund question."
      },
      {
        title: "Augment the prompt & answer",
        topic: "prompt-engineering",
        detail: "Put the retrieved context in the prompt and instruct the model to answer ONLY from it — this is what grounds the answer and enables citations.",
        code: "def answer(question):\n    ctx = retrieve(question)\n    prompt = (\n      'Answer using ONLY the context. If it is not there, say you do not know.\\n\\n'\n      + 'Context:\\n- ' + '\\n- '.join(ctx)\n      + f'\\n\\nQuestion: {question}\\nAnswer:')\n    # return client.chat.completions.create(...)  # send prompt to your LLM\n    return prompt\nprint(answer('when is support open?'))",
        checkpoint: "The assembled prompt contains the right context and a grounding instruction."
      },
      {
        title: "Know when to choose RAG",
        topic: "rag-vs-finetuning",
        detail: "RAG updates the moment you edit a document; fine-tuning bakes knowledge into weights and needs retraining. For changing or private facts, RAG wins.",
        code: "# Rule of thumb:\n#   RAG        -> facts that change, must cite sources, private data\n#   Fine-tune  -> fixed style/format/behaviour, not new facts\nprint('Changing knowledge? Reach for RAG.')",
        checkpoint: "You can justify RAG over fine-tuning for a knowledge-base bot in one sentence."
      }
    ]
  },
  {
    id: "sales-forecast",
    title: "Forecast monthly sales",
    level: "Intermediate",
    blurb: "Turn a history of numbers into a defensible forecast — and learn why a naive baseline is the bar to beat.",
    goal: "Explore a time series, build features from the calendar and the past, fit a regression forecaster, and measure it against a naive baseline.",
    dataset: "A synthetic monthly-sales series with trend and seasonality, generated in step 1.",
    outcome: "A forecast that beats the naive 'same as last month' baseline, plus an honest error number you can report.",
    stack: ["pandas", "scikit-learn"],
    steps: [
      {
        title: "Create a sales history",
        topic: "pandas-loading",
        detail: "Generate three years of monthly sales with an upward trend and a seasonal bump — enough structure for a model to learn.",
        code: "import numpy as np, pandas as pd\nrng = np.random.default_rng(1)\nmonths = pd.date_range('2022-01-01', periods=36, freq='MS')\ntrend = np.linspace(100, 160, 36)\nseason = 15*np.sin(2*np.pi*(months.month-1)/12)\nsales = (trend + season + rng.normal(0, 5, 36)).round(1)\ndf = pd.DataFrame({'month': months, 'sales': sales})\nprint(df.head())",
        checkpoint: "36 rows of monthly sales, values roughly in the 90–180 range."
      },
      {
        title: "Look before you model",
        topic: "descriptive-stats",
        detail: "Always describe a series first — the level, the spread, and the obvious pattern. It tells you what a model must capture.",
        code: "print(df.sales.describe().round(1))\nprint('year-over-year growth:',\n      round(df.sales[-12:].mean() - df.sales[:12].mean(), 1))",
        checkpoint: "A clear positive year-over-year difference confirms the upward trend."
      },
      {
        title: "Build lag & calendar features",
        topic: "feature-engineering",
        detail: "A forecaster predicts from the past. Expose last month's value (lag-1), the same month a year ago (lag-12), and the month number for seasonality.",
        code: "df['lag1'] = df.sales.shift(1)\ndf['lag12'] = df.sales.shift(12)\ndf['month_num'] = df.month.dt.month\nd = df.dropna().reset_index(drop=True)   # first 12 rows lack lag12\nprint(d[['month','sales','lag1','lag12','month_num']].head())",
        checkpoint: "A feature table with lag1, lag12 and month_num, no NaNs."
      },
      {
        title: "Split by time, not at random",
        topic: "train-test-split",
        detail: "Time series must NOT be shuffled — you can't train on the future. Train on the earlier months, test on the most recent ones.",
        code: "feat = ['lag1','lag12','month_num']\ncut = len(d) - 6                 # last 6 months = test\nX_tr, y_tr = d[feat][:cut], d.sales[:cut]\nX_te, y_te = d[feat][cut:], d.sales[cut:]\nprint('train months:', len(X_tr), ' test months:', len(X_te))",
        checkpoint: "The final 6 months are held out as the test window."
      },
      {
        title: "Fit a regression forecaster",
        topic: "regression",
        detail: "A regression model maps the lag/calendar features to next month's sales. Simple and interpretable — the right first forecaster.",
        code: "from sklearn.linear_model import LinearRegression\nm = LinearRegression().fit(X_tr, y_tr)\npred = m.predict(X_te)\nfor mth, yhat, real in zip(d.month[cut:], pred, y_te):\n    print(mth.strftime('%Y-%m'), 'pred', round(yhat,1), 'actual', real)",
        checkpoint: "Six predictions print next to actuals, and they're in the right ballpark."
      },
      {
        title: "Beat the naive baseline",
        topic: "model-evaluation",
        detail: "A forecast is only good if it beats 'next month = this month'. Compare mean absolute error against that baseline — the honest test.",
        code: "from sklearn.metrics import mean_absolute_error\nnaive = X_te['lag1'].values                 # predict last month's value\nprint('model MAE:', round(mean_absolute_error(y_te, pred), 2))\nprint('naive MAE:', round(mean_absolute_error(y_te, naive), 2))\nprint('model wins' if mean_absolute_error(y_te,pred) < mean_absolute_error(y_te,naive) else 'baseline wins — rethink features')",
        checkpoint: "The model's MAE is lower than the naive baseline's — it's earning its keep."
      }
    ]
  },

  /* ================= Local AI Lab — runs entirely on your own machine ================= */
  {
    id: "local-first-model",
    title: "Train your first model on your machine",
    level: "Beginner",
    blurb: "Set up a local Python ML environment, train a scikit-learn model on your CPU, save it, then load it and use it to score new data — no cloud, no GPU.",
    goal: "Stand up a reproducible local ML environment, train and honestly evaluate a classifier on your own CPU, persist it to disk, and call it on brand-new inputs from a tiny local service.",
    dataset: "A synthetic customer table generated locally in step 2 — nothing to download. Swap in your own CSV later.",
    outcome: "A saved churn_model.joblib you can reload anywhere, a prediction on a new customer, and an HTTP endpoint that scores customers — all served from your machine.",
    stack: ["Python 3.10+", "scikit-learn", "joblib", "FastAPI (optional)"],
    story: "Picture the whole build as **raising, testing, graduating and then hiring a human expert** — a *churn coach* who learns to spot which customers are about to leave. Each step below is one stage in that story, and each stage maps to one specific line of code.",
    lifecycle: [
      { icon: "📖", label: "Write the textbook", sub: "make the data", to: 1 },
      { icon: "✍️", label: "Study", sub: "model.fit() — training", to: 2 },
      { icon: "📝", label: "Sit the exam", sub: "evaluate honestly", to: 3 },
      { icon: "🎓", label: "Graduate", sub: "save the model", to: 4 },
      { icon: "🧑‍🏫", label: "Answer a question", sub: "predict for a customer", to: 5 },
      { icon: "🏢", label: "Open the office", sub: "serve over HTTP", to: 6 }
    ],
    concept: {
      q: "How can we say we “trained a model”?",
      a: "It comes down to a single line — **model.fit(X_tr, y_tr)** in the *Split, then train* step. Before that line runs you have an empty, know-nothing algorithm. After it, you have something that has absorbed the patterns in 900 worked examples and can judge customers it has **never seen**. That one line is the exact moment “training” happens — everything before it prepares the lesson, everything after it puts what was learned to work."
    },
    capabilities: [
      "Returns a **churn-risk score** (0–1) for any customer from just 4 inputs",
      "Turns that score into a **business action** — `retention outreach` vs `no action`",
      "Runs in **milliseconds, offline, on your CPU** — no cloud, no API cost",
      "Ships as **one ~6 MB file** and can serve a whole company over HTTP"
    ],
    limitations: [
      "It is trained on **synthetic, made-up customers** and only 4 features",
      "So it is a **correct demo of the technique, not a production tool**",
      "Swap step 2's fake data for **real customer records** and the other five steps become genuinely useful — unchanged"
    ],
    steps: [
      {
        title: "Set up a local Python environment",
        topic: "sklearn-workflow",
        detail: "A CPU is all you need for classic ML — no GPU required. Create an isolated environment so versions stay reproducible, then install the libraries.",
        analogy: "**Set up the classroom.** Before any teaching happens you prepare a clean, private room (the virtual environment) and put the right books on the shelf (the libraries). Nothing is learned yet — you're just making a tidy, repeatable place to work.",
        code: "# Create an isolated environment (pick ONE)\n# --- conda ---\nconda create -n ai-lab python=3.11 -y\nconda activate ai-lab\n# --- or venv ---\npython -m venv .venv\n# Windows: .venv\\Scripts\\activate   macOS/Linux: source .venv/bin/activate\n\n# Install (CPU-only, no GPU needed)\npip install scikit-learn pandas numpy joblib\n\n# Verify\npython -c \"import sklearn; print('env ready', sklearn.__version__)\"",
        checkpoint: "`env ready` prints with a scikit-learn version — your local ML sandbox is live."
      },
      {
        title: "Generate a dataset locally",
        topic: "pandas-dataframe",
        detail: "So the whole project runs offline, synthesise a customer table. Each row is a customer; `churn` (1 = left) is what we'll predict.",
        analogy: "**Write the textbook — and its answer key.** Every row is a practice problem (the customer's details) with the answer already filled in (`churn` = did they leave?). Still nothing is learned; you're creating the material the student will study from.",
        code: "import numpy as np, pandas as pd\nrng = np.random.default_rng(0)\nn = 1200\ndf = pd.DataFrame({\n  'tenure_months': rng.integers(1, 72, n),\n  'monthly_charge': rng.normal(70, 25, n).round(2),\n  'support_calls': rng.poisson(1.5, n),\n  'is_month_to_month': rng.integers(0, 2, n),\n})\nrisk = df.is_month_to_month*1.2 + df.support_calls*0.4 - df.tenure_months*0.04\ndf['churn'] = (rng.random(n) < 1/(1+np.exp(-risk+1))).astype(int)\nprint(df.head()); print('churn rate:', df.churn.mean().round(3))",
        checkpoint: "A 1,200-row table prints with a churn rate around 0.35–0.45."
      },
      {
        title: "Split, then train on your CPU",
        topic: "train-test-split",
        detail: "Hold out a test set first — your only honest read on real-world accuracy. Then train a Random Forest, a strong baseline that needs no scaling. `n_jobs=-1` uses every CPU core.",
        analogy: "**The student studies.** You hand over 900 solved examples to learn from and hide 300 for a later exam. The line `model.fit(X_tr, y_tr)` **is the studying** — this is the exact moment \"we trained a model\" literally happens.",
        code: "from sklearn.model_selection import train_test_split\nfrom sklearn.ensemble import RandomForestClassifier\nfeatures = ['tenure_months','monthly_charge','support_calls','is_month_to_month']\nX, y = df[features], df['churn']\nX_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.25, stratify=y, random_state=0)\nmodel = RandomForestClassifier(n_estimators=200, random_state=0, n_jobs=-1)\nmodel.fit(X_tr, y_tr)\nprint('trained on', X_tr.shape[0], 'rows using your CPU')",
        checkpoint: "It prints the training row count — the forest is fit locally in a second or two."
      },
      {
        title: "Evaluate honestly",
        topic: "model-evaluation",
        detail: "Accuracy alone lies on imbalanced data. Read ROC-AUC and the full precision/recall report on the held-out test set.",
        analogy: "**Exam day — on questions never seen.** You test the coach on the 300 hidden examples. A high score proves it learned real patterns instead of just memorising the workbook (that failure has a name: *overfitting*).",
        code: "from sklearn.metrics import roc_auc_score, classification_report\nproba = model.predict_proba(X_te)[:, 1]\nprint('ROC-AUC:', round(roc_auc_score(y_te, proba), 3))\nprint(classification_report(y_te, (proba > 0.5).astype(int)))",
        checkpoint: "ROC-AUC around 0.78–0.85 — clearly better than 0.5 (random guessing)."
      },
      {
        title: "Save the model to disk",
        topic: "mlops-lifecycle",
        detail: "A trained model is just an object — persist it so you never retrain to reuse it. joblib is the scikit-learn standard for this.",
        analogy: "**Graduation — the diploma.** `joblib.dump()` freezes the trained brain into one portable file. You never re-teach it: email it, ship it, or load it on any machine and the expertise is intact.",
        code: "import joblib\njoblib.dump(model, 'churn_model.joblib')\nprint('saved churn_model.joblib')\n# this file is a portable artifact — commit it, ship it, or load it on another machine",
        checkpoint: "A `churn_model.joblib` file appears in your folder."
      },
      {
        title: "Load it and use it on a new customer",
        topic: "sklearn-workflow",
        detail: "This is the payoff: reload the saved model in a fresh process and score input it has never seen — exactly what a real application does at inference time.",
        analogy: "**Hiring the coach for one question.** A brand-new customer walks up and the model instantly answers *\"83% likely to leave → call them.\"* This is the \"what's 2 + 2? → 4\" moment: knowledge applied on demand.",
        code: "import joblib, pandas as pd\nclf = joblib.load('churn_model.joblib')\nnew_customer = pd.DataFrame([{\n  'tenure_months': 3, 'monthly_charge': 95.0,\n  'support_calls': 4, 'is_month_to_month': 1,\n}])\np = float(clf.predict_proba(new_customer)[0, 1])\nprint('churn probability:', round(p, 3))\nprint('decision:', 'RETENTION OUTREACH' if p > 0.5 else 'no action')",
        checkpoint: "A churn probability prints for the new customer, with a decision — you're using the model."
      },
      {
        title: "Serve it locally over HTTP (optional)",
        topic: "mlops-lifecycle",
        detail: "Wrap the model in a tiny FastAPI service on localhost so any app on your machine can call it — the same shape as a production model API, minus the cloud.",
        analogy: "**Open a coaching office with a phone line.** The FastAPI `/predict` endpoint means any app, website, or teammate can ring up 24/7 and get a prediction back — the same expert, now available to everyone at once.",
        code: "# pip install fastapi uvicorn\n# save as serve.py, then run:  uvicorn serve:app --port 8000\nfrom fastapi import FastAPI\nfrom pydantic import BaseModel\nimport joblib, pandas as pd\napp = FastAPI()\nclf = joblib.load('churn_model.joblib')\nclass Customer(BaseModel):\n    tenure_months: int\n    monthly_charge: float\n    support_calls: int\n    is_month_to_month: int\n@app.post('/predict')\ndef predict(c: Customer):\n    x = pd.DataFrame([c.model_dump()])\n    p = float(clf.predict_proba(x)[0, 1])\n    return {'churn_probability': round(p, 3), 'action': 'outreach' if p > 0.5 else 'none'}",
        checkpoint: "Open http://127.0.0.1:8000/docs, POST a customer, and get a JSON churn score back — served entirely from your machine."
      }
    ]
  },
  {
    id: "local-rag",
    title: "Local RAG with your own models",
    level: "Intermediate",
    blurb: "Run the whole retrieve-then-generate loop offline: a local embedding model for search and a local Ollama LLM for answers. Then fine-tune the embedder on your own data.",
    goal: "Build RAG entirely on your own hardware — embed documents with a local sentence-transformers model, search them with a local index, generate grounded answers with a local LLM via Ollama, and fine-tune the embedder on your own pairs.",
    dataset: "A few inline text chunks; point it at your own .txt / .md files once the loop works.",
    outcome: "A fully offline RAG pipeline (no API keys, no data leaving your machine) plus a fine-tuned embedder tuned to your domain.",
    stack: ["sentence-transformers", "numpy", "Ollama", "PyTorch (CPU or GPU)"],
    story: "Think of a plain LLM as a **brilliant but forgetful professor** — widely read, but they've never seen *your* documents and will confidently make things up about them. RAG turns that professor into **an experienced teacher who has just read your thesis** and answers strictly from it: they look up the relevant page before speaking, and point to where the answer came from. This project builds that teacher on your own machine.",
    lifecycle: [
      { icon: "🧠", label: "Hire the tutor", sub: "install a local LLM", to: 0 },
      { icon: "👓", label: "Teach it to read meaning", sub: "load the embedder", to: 1 },
      { icon: "📚", label: "Hand over your documents", sub: "chunk + embed", to: 2 },
      { icon: "🔎", label: "Look up the right page", sub: "retrieve", to: 3 },
      { icon: "🗣️", label: "Answer from the page", sub: "generate + cite", to: 4 },
      { icon: "🎓", label: "Specialise the tutor", sub: "fine-tune", to: 5 }
    ],
    concept: {
      q: "What does RAG actually change?",
      a: "A plain LLM answers from memory and can bluff about anything it never studied — including your private documents. RAG inserts a **look-it-up-first** step: retrieve the relevant text, then answer *only* from it. So the model stays current, works on your own data, and can point to its source — **without any retraining.**"
    },
    capabilities: [
      "Answers questions about **your own documents**, not just what the model was trained on",
      "Runs **fully offline** — your files never leave your machine",
      "Can **cite the source passage** for every answer, which curbs made-up facts",
      "Swap in new documents any time by re-embedding — **no retraining needed**"
    ],
    limitations: [
      "Only as good as what you feed it — **missing or messy documents give weak answers**",
      "A small local model is less fluent than a big cloud one — great for facts, not deep reasoning",
      "Retrieval can miss context if chunks are too big or too small — **how you split documents matters**"
    ],
    steps: [
      {
        title: "Install the local stack",
        topic: "rag",
        detail: "Two pieces: sentence-transformers (pulls in PyTorch) for embeddings, and Ollama to run an LLM locally. The 3B model is ~2 GB, runs on CPU, and is much faster on a GPU.",
        analogy: "**Hire the tutor and set up the room.** You bring in the well-read expert (the local LLM via Ollama) and the desk and tools (the Python libraries). Nothing about your documents yet — you're just getting the expert and the workspace ready.",
        code: "# 1) Python libraries (sentence-transformers pulls in PyTorch)\npip install sentence-transformers numpy\n\n# 2) Install Ollama (runs LLMs locally): https://ollama.com/download\n#    then pull a small, fast model:\nollama pull llama3.2:3b\n\n# 3) Confirm it runs (Ollama serves on http://localhost:11434)\nollama run llama3.2:3b \"say hi in three words\"",
        checkpoint: "The model replies in your terminal — an LLM is now running locally on your CPU/GPU."
      },
      {
        title: "Load a local embedding model",
        topic: "tokens-embeddings",
        detail: "all-MiniLM-L6-v2 is ~90 MB, downloads once, then works fully offline. It maps text to 384-dim vectors and uses your GPU automatically if you have one.",
        analogy: "**Teach the tutor to understand meaning, not just words.** The embedding model is that sense of meaning — so a question about 'getting my money back' will later find the 'refund' passage even though they share no words.",
        code: "from sentence_transformers import SentenceTransformer\nembedder = SentenceTransformer('all-MiniLM-L6-v2')\nprint('embedding dim:', embedder.get_sentence_embedding_dimension())  # 384",
        checkpoint: "Prints 384 — your local embedder is ready (no network after the first download)."
      },
      {
        title: "Chunk and embed your documents",
        topic: "vector-search",
        detail: "Retrieval works on small, self-contained pieces. Embed each chunk once and keep the matrix. Normalising the vectors lets a plain dot product act as cosine similarity.",
        analogy: "**Hand over your documents and let the tutor make an index.** Each passage becomes a searchable 'meaning fingerprint', so later they can flip straight to the right page instead of re-reading the whole book.",
        code: "import numpy as np\ndocs = [\n  'Refunds are available within 30 days of purchase with a receipt.',\n  'Support is available Monday to Friday, 9am to 6pm UK time.',\n  'The Pro plan includes unlimited projects and priority support.',\n  'All data is encrypted at rest and in transit using AES-256.',\n]\nemb = embedder.encode(docs, normalize_embeddings=True)\nemb = np.asarray(emb, dtype='float32')\nprint('index shape:', emb.shape)   # (4, 384)",
        checkpoint: "(4, 384) prints — every chunk is now a local vector."
      },
      {
        title: "Retrieve the relevant chunks",
        topic: "vector-search",
        detail: "Embed the question the same way and rank chunks by cosine similarity. Top-k are your evidence. For big corpora, swap the numpy dot for FAISS (`pip install faiss-cpu`).",
        analogy: "**Ask a question and the tutor flips to the most relevant pages.** They pull only the few passages that actually answer you — the 'evidence' the answer will be built from — rather than reciting the whole thesis.",
        code: "def retrieve(question, k=2):\n    q = embedder.encode([question], normalize_embeddings=True)[0]\n    scores = emb @ np.asarray(q, dtype='float32')   # cosine (vectors normalized)\n    top = scores.argsort()[::-1][:k]\n    return [docs[i] for i in top]\n\nprint(retrieve('how many days do I have to return something?'))",
        checkpoint: "The refund chunk comes back first — semantic search is working locally."
      },
      {
        title: "Generate a grounded answer with the local LLM",
        topic: "generative-ai-llm",
        detail: "Put the retrieved context into the prompt and instruct the model to answer ONLY from it. The `ollama` package talks to your local server — nothing leaves the machine.",
        analogy: "**The tutor answers out loud, from the open page.** They speak using only the passages just retrieved — so the reply stays grounded in your documents and they can't wander off and invent things.",
        code: "# pip install ollama\nimport ollama\n\ndef answer(question):\n    ctx = retrieve(question)\n    prompt = (\n        'Answer using ONLY the context. If it is not there, say you do not know.\\n\\n'\n        'Context:\\n- ' + '\\n- '.join(ctx) +\n        '\\n\\nQuestion: ' + question + '\\nAnswer:'\n    )\n    r = ollama.chat(model='llama3.2:3b',\n                    messages=[{'role': 'user', 'content': prompt}])\n    return r['message']['content']\n\nprint(answer('When is support open?'))",
        checkpoint: "The model answers 'Monday to Friday, 9am to 6pm' — grounded in your retrieved chunk, generated on your machine."
      },
      {
        title: "Fine-tune the embedder on your own pairs",
        topic: "rag-vs-finetuning",
        detail: "Retrieval sharpens when the embedder knows your domain. Fine-tune MiniLM on (question, answering-chunk) pairs with a contrastive loss — small enough to run on CPU, quick on GPU. This is the 'self-train' part.",
        analogy: "**Send the tutor on a short course in your subject.** By training on a handful of your own question → answer pairs, their sense of 'what's relevant' sharpens for your material, so they find the right passage more reliably.",
        code: "from sentence_transformers import InputExample, losses\nfrom torch.utils.data import DataLoader\n\npairs = [\n  InputExample(texts=['how do I get my money back?', docs[0]]),\n  InputExample(texts=['what are your opening hours?', docs[1]]),\n  InputExample(texts=['what is in the paid tier?', docs[2]]),\n]\nloader = DataLoader(pairs, batch_size=3, shuffle=True)\nloss = losses.MultipleNegativesRankingLoss(embedder)\nembedder.fit(train_objectives=[(loader, loss)], epochs=3, warmup_steps=1)\nembedder.save('my-embedder')   # reload later: SentenceTransformer('my-embedder')\nprint('fine-tuned embedder saved to ./my-embedder')",
        checkpoint: "Training runs 3 epochs and saves ./my-embedder — re-embed with it and retrieval gets sharper on your data."
      }
    ]
  },
  {
    id: "custom-agent",
    title: "Build a custom agent from scratch",
    level: "Advanced",
    blurb: "No frameworks. Define your own tools, prompt and reason–act loop, and let a local LLM drive tools — including the model you trained and your RAG retriever.",
    goal: "Understand agents by building one from first principles: a tool registry, a controller loop, and JSON tool-calls parsed by hand — powered end-to-end by your own local models.",
    dataset: "Reuses churn_model.joblib from 'Train your first model'. Runs against your local Ollama LLM.",
    outcome: "A working reason→act→observe agent, about 60 lines you fully understand and can extend — running on local models only.",
    stack: ["Python", "Ollama", "your saved model"],
    steps: [
      {
        title: "Define your tools",
        topic: "ai-applications",
        detail: "A tool is just a Python function the model is allowed to call. Register a few in a dict — including a churn predictor backed by the model you trained in project 1.",
        code: "import joblib, pandas as pd\nclf = joblib.load('churn_model.joblib')   # from 'Train your first model'\n\ndef predict_churn(tenure_months, monthly_charge, support_calls, is_month_to_month):\n    x = pd.DataFrame([dict(tenure_months=tenure_months, monthly_charge=monthly_charge,\n                           support_calls=support_calls, is_month_to_month=is_month_to_month)])\n    return round(float(clf.predict_proba(x)[0, 1]), 3)\n\ndef calculator(expression):\n    return eval(expression, {'__builtins__': {}}, {})   # arithmetic only, no builtins\n\nTOOLS = {'predict_churn': predict_churn, 'calculator': calculator}\nprint('registered tools:', list(TOOLS))",
        checkpoint: "Two tools register; calling `predict_churn(2, 99, 5, 1)` returns a probability."
      },
      {
        title: "Describe the tools to the model",
        topic: "prompt-engineering",
        detail: "The LLM needs a spec of each tool and a strict output contract. Tell it to reply with JSON only — either a tool call or a final answer.",
        code: "TOOL_SPEC = '''\npredict_churn(tenure_months:int, monthly_charge:float, support_calls:int, is_month_to_month:int) -> float\ncalculator(expression:str) -> number\n'''\nSYSTEM = (\n    'You can call tools. To call one, reply with ONLY JSON:\\n'\n    '{\"tool\": \"<name>\", \"args\": {...}}\\n'\n    'When you have the final answer, reply with ONLY JSON:\\n'\n    '{\"answer\": \"<text>\"}\\n'\n    'Tools:\\n' + TOOL_SPEC\n)\nprint(SYSTEM)",
        checkpoint: "The system prompt prints with the tool signatures and the JSON contract."
      },
      {
        title: "Parse a tool call",
        topic: "ai-applications",
        detail: "Models wrap JSON in chatter. Pull out the first JSON object; if there isn't one, treat the whole reply as the answer.",
        code: "import json, re\ndef parse(text):\n    m = re.search(r'\\{.*\\}', text, re.S)   # first JSON object\n    return json.loads(m.group(0)) if m else {'answer': text}\n\nprint(parse('sure! {\"tool\": \"calculator\", \"args\": {\"expression\": \"2+2\"}}'))",
        checkpoint: "Prints {'tool': 'calculator', 'args': {'expression': '2+2'}} — parsing works."
      },
      {
        title: "Write the reason–act loop",
        topic: "generative-ai-llm",
        detail: "The controller: send the conversation to the local LLM, parse its reply, run the tool it asks for, feed the observation back, and repeat until it answers or hits the step cap.",
        code: "import ollama\n\ndef run(task, max_steps=5):\n    msgs = [{'role': 'system', 'content': SYSTEM},\n            {'role': 'user', 'content': task}]\n    for _ in range(max_steps):\n        out = ollama.chat(model='llama3.2:3b', messages=msgs)['message']['content']\n        step = parse(out)\n        if 'answer' in step:\n            return step['answer']\n        obs = TOOLS[step['tool']](**step.get('args', {}))      # ACT\n        print('  ->', step['tool'], step.get('args', {}), '=', obs)\n        msgs.append({'role': 'assistant', 'content': out})\n        msgs.append({'role': 'user', 'content': 'Observation: ' + str(obs)})\n    return 'stopped: max steps reached'\n\nprint(run('Customer: tenure 2, charge 99, 5 support calls, month-to-month. Is churn risk above 0.5?'))",
        checkpoint: "The agent calls predict_churn, reads the score, and returns a yes/no answer — a loop you wrote, driven by a local model."
      },
      {
        title: "Add guardrails and memory",
        topic: "mlops-monitoring",
        detail: "Real agents fail safely. Allowlist tool names, catch tool errors, and keep the step cap. Persist `msgs` across calls to give the agent conversational memory.",
        code: "def safe_act(name, args):\n    if name not in TOOLS:\n        return 'error: unknown tool ' + str(name)\n    try:\n        return TOOLS[name](**args)\n    except Exception as e:\n        return 'error: ' + str(e)\n\n# In run(), replace TOOLS[step['tool']](...) with safe_act(step['tool'], step.get('args', {})).\n# Memory: keep the same `msgs` list between run() calls for multi-turn context.\nprint('guardrails: step cap + tool allowlist + error capture')",
        checkpoint: "Unknown tools and bad arguments now return a handled error string instead of crashing the loop."
      }
    ]
  },
  {
    id: "ollama-agent",
    title: "Local agent with Ollama tool-calling",
    level: "Advanced",
    blurb: "Use Ollama's native function-calling so a local model can take real actions on your machine — read files, query your model, run allow-listed operations — safely.",
    goal: "Let a local LLM decide and call real local actions through Ollama's structured tool API, with a path sandbox and human confirmation so it stays safe.",
    dataset: "Acts on your local working folder and the churn model from project 1.",
    outcome: "An agent that turns plain-English requests into real local actions via Ollama's built-in tool calling — fully offline, with safety rails.",
    stack: ["Ollama", "ollama-python", "a tool-capable model (llama3.1 / qwen2.5)"],
    steps: [
      {
        title: "Get a tool-capable local model",
        topic: "generative-ai-llm",
        detail: "Function calling needs a model trained for it. llama3.1:8b is a solid local choice; qwen2.5:3b is lighter if RAM is tight. Sizes below are rough RAM/VRAM needs.",
        code: "# Tool-capable local models:\nollama pull llama3.1:8b     # ~4.7 GB, wants ~8 GB RAM/VRAM\n# lighter option:\nollama pull qwen2.5:3b      # ~2 GB\n\npip install ollama\nollama list                 # confirm it downloaded",
        checkpoint: "`ollama list` shows a tool-capable model ready to use."
      },
      {
        title: "Write real local action functions",
        topic: "ai-applications",
        detail: "These functions actually DO things on your machine. Sandbox every path to the working folder so the agent can't wander off it.",
        code: "import os, joblib, pandas as pd\nALLOWED = os.path.abspath('.')\n\ndef _safe(name):\n    p = os.path.abspath(os.path.join(ALLOWED, name))\n    return p if p.startswith(ALLOWED) else None\n\ndef list_files(subdir='.'):\n    p = _safe(subdir)\n    return os.listdir(p) if p else 'blocked: outside working folder'\n\ndef read_file(name):\n    p = _safe(name)\n    if not p:\n        return 'blocked'\n    with open(p, encoding='utf-8') as f:\n        return f.read()[:2000]\n\n_clf = joblib.load('churn_model.joblib')\ndef churn_score(tenure_months, monthly_charge, support_calls, is_month_to_month):\n    x = pd.DataFrame([dict(tenure_months=tenure_months, monthly_charge=monthly_charge,\n                           support_calls=support_calls, is_month_to_month=is_month_to_month)])\n    return round(float(_clf.predict_proba(x)[0, 1]), 3)\n\nACTIONS = {'list_files': list_files, 'read_file': read_file, 'churn_score': churn_score}\nprint('actions ready:', list(ACTIONS))",
        checkpoint: "The actions register, and a path outside the working folder returns 'blocked'."
      },
      {
        title: "Declare the tools in Ollama's schema",
        topic: "prompt-engineering",
        detail: "Ollama accepts OpenAI-style JSON tool definitions. Describe each action so the model knows when and how to call it.",
        code: "tools = [\n  {'type': 'function', 'function': {\n    'name': 'list_files',\n    'description': 'List files in a subfolder of the working directory.',\n    'parameters': {'type': 'object',\n      'properties': {'subdir': {'type': 'string'}}, 'required': []}}},\n  {'type': 'function', 'function': {\n    'name': 'read_file',\n    'description': 'Read the first 2000 chars of a text file.',\n    'parameters': {'type': 'object',\n      'properties': {'name': {'type': 'string'}}, 'required': ['name']}}},\n  {'type': 'function', 'function': {\n    'name': 'churn_score',\n    'description': 'Predict churn probability (0-1) for one customer.',\n    'parameters': {'type': 'object', 'properties': {\n      'tenure_months': {'type': 'integer'}, 'monthly_charge': {'type': 'number'},\n      'support_calls': {'type': 'integer'}, 'is_month_to_month': {'type': 'integer'}},\n      'required': ['tenure_months','monthly_charge','support_calls','is_month_to_month']}}},\n]\nprint(len(tools), 'tools declared')",
        checkpoint: "Three tool schemas are declared and ready to pass to the model."
      },
      {
        title: "Let the model call actions",
        topic: "generative-ai-llm",
        detail: "Pass `tools` to ollama.chat. The model replies with structured tool_calls; you execute each, append the result as a 'tool' message, and loop until it gives a final answer.",
        code: "import ollama, json\n\ndef agent(task, model='llama3.1:8b'):\n    msgs = [{'role': 'user', 'content': task}]\n    while True:\n        r = ollama.chat(model=model, messages=msgs, tools=tools)\n        m = r['message']\n        if not m.get('tool_calls'):\n            return m['content']                      # final answer\n        msgs.append(m)\n        for call in m['tool_calls']:\n            name = call['function']['name']\n            args = call['function']['arguments']\n            result = ACTIONS[name](**args)           # DO the action\n            print('  ->', name, args, '=', str(result)[:80])\n            msgs.append({'role': 'tool', 'content': json.dumps(result, default=str)})\n\nprint(agent('List the files here, then read README.md and summarise it in one line.'))",
        checkpoint: "The model calls list_files, then read_file, then answers — real local actions chosen by a local model."
      },
      {
        title: "Gate risky actions behind confirmation",
        topic: "mlops-monitoring",
        detail: "Read-only tools can run automatically; anything that writes, deletes, or executes must ask a human first. This one rule keeps an autonomous local agent safe.",
        code: "RISKY = {'write_file', 'delete_file', 'run_shell'}\n\ndef guarded(name, args):\n    if name in RISKY:\n        ok = input('Approve ' + name + ' ' + str(args) + '? [y/N] ')\n        if ok.strip().lower() != 'y':\n            return 'denied by user'\n    return ACTIONS[name](**args)\n# In agent(), call guarded(name, args) instead of ACTIONS[name](**args).\n# Golden rules: allowlist tools, sandbox paths, confirm writes, never auto-run shell.\nprint('risky actions now require human approval')",
        checkpoint: "Write/delete/shell actions pause for a y/N — the agent acts locally without being able to do damage unattended."
      }
    ]
  }
];
