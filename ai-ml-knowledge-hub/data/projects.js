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
  }
];
