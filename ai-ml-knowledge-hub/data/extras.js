/* ============================================================
   Extra topics added after v1 (workshop-scope gap-fillers).
   Pushed onto the existing category arrays so file structure
   and load order stay intact. Same schema as the core topics.
   ============================================================ */
window.KB = window.KB || {};
window.KB.fundamentals = window.KB.fundamentals || [];
window.KB.statistics = window.KB.statistics || [];
window.KB["machine-learning"] = window.KB["machine-learning"] || [];
window.KB.mlops = window.KB.mlops || [];
window.KB.glossary = window.KB.glossary || [];

window.KB.fundamentals.push({
  id: "jupyter-colab-tips",
  category: "fundamentals",
  title: "Notebook tips & shortcuts",
  difficulty: "Beginner",
  short: "The handful of Jupyter/Colab habits that make exploratory work fast and reproducible.",
  definition: "A short set of practical habits and keyboard shortcuts for working efficiently in Jupyter and Colab — running cells, restarting the kernel, inspecting objects, and keeping notebooks reproducible.",
  why: "Notebooks reward a few learned reflexes. Knowing them turns clumsy click-driven work into fast keyboard-driven exploration, and avoids the classic 'it worked but I can't rerun it' trap.",
  problem: "Beginners run cells out of order, accumulate hidden state, and end up with a notebook that only works by accident. A few habits keep results trustworthy and repeatable.",
  howItWorks: "Key shortcuts (command mode, press Esc first): Shift+Enter run cell, A/B insert cell above/below, DD delete, M/Y markdown/code, Z undo. Habits: Restart & Run All before trusting results (proves top-to-bottom reproducibility); use `?obj` / `obj.<Tab>` to inspect; `%timeit` to benchmark; keep imports in the first cell.",
  example: "Before sharing an analysis, a data scientist hits 'Restart & Run All'. Two cells fail because they depended on a variable deleted earlier — caught now, not by a confused teammate later.",
  code: "# useful magics in a notebook cell\n%timeit sum(range(1000))     # benchmark a line\n%matplotlib inline           # show plots in the notebook\n?pd.read_csv                 # show the docstring",
  engineering: "Treat 'Restart & Run All' like running your test suite: it's the only proof the notebook actually works from a clean state. Pin imports and versions so a rerun tomorrow behaves the same.",
  whenToUse: ["Everyday exploratory work in Jupyter or Colab", "Before sharing or publishing a notebook"],
  whenNotToUse: ["Production code — move settled logic into tested .py modules"],
  limitations: ["Shortcuts differ slightly between classic Jupyter, JupyterLab and Colab", "Habits help but don't fully remove hidden-state risk"],
  keyTakeaway: "Learn a few command-mode shortcuts and always 'Restart & Run All' before trusting a notebook — it's your reproducibility check.",
  related: ["jupyter", "colab"],
  keywords: ["jupyter", "colab", "shortcuts", "keyboard", "restart run all", "magics", "reproducible", "tips"],
  viz: null
});

window.KB.statistics.push({
  id: "percentiles-iqr",
  category: "statistics",
  title: "Percentiles, IQR & box plots",
  difficulty: "Beginner",
  short: "Describe spread and spot outliers with rank-based measures that ignore extreme values.",
  definition: "A percentile is the value below which a given percent of data falls (the 25th percentile = 25% of values are below it). The interquartile range (IQR) is the middle 50% — the 75th minus the 25th percentile. A box plot draws these five numbers visually.",
  why: "Mean and standard deviation are distorted by skew and outliers. Percentiles are rank-based, so they describe 'typical' spread robustly — which is why latency, income and response-time reports lean on them.",
  problem: "You need a summary of spread that isn't wrecked by a few extreme values, and a quick rule for flagging outliers. The IQR gives both.",
  howItWorks: "Sort the data. The median is the 50th percentile; Q1 and Q3 are the 25th and 75th. IQR = Q3 − Q1. A common outlier rule flags anything below Q1 − 1.5·IQR or above Q3 + 1.5·IQR. A box plot shows the box (Q1–Q3), a line at the median, whiskers to the non-outlier range, and dots for outliers.",
  example: "An SRE reports API latency as p50=120ms, p95=340ms, p99=900ms rather than the mean — because a few slow requests would inflate the average and hide what most users actually experience.",
  code: "import numpy as np\nx = np.array([12, 15, 14, 13, 16, 200])   # 200 is an outlier\nq1, q3 = np.percentile(x, [25, 75])\niqr = q3 - q1\nprint(q1, q3, iqr)\nprint('outlier cutoff >', q3 + 1.5 * iqr)   # flags 200",
  engineering: "Percentiles are the natural language of SLAs and monitoring ('p99 latency < 500ms'). The 1.5·IQR rule is a cheap, robust outlier filter you can drop into a data-cleaning step.",
  whenToUse: ["Summarizing skewed data (latency, income, prices)", "Robust outlier detection during cleaning", "SLAs and performance monitoring"],
  whenNotToUse: ["Small samples where quartiles are unstable", "When the mean/std genuinely suit symmetric data"],
  limitations: ["The 1.5·IQR rule is a convention, not a law", "Loses information about the exact shape of the tails"],
  keyTakeaway: "Percentiles and IQR describe spread without being fooled by outliers; the box plot shows all five numbers, and 1.5·IQR is a handy outlier flag.",
  related: ["descriptive-stats", "variance-std", "pandas-cleaning"],
  keywords: ["percentile", "quartile", "iqr", "interquartile", "box plot", "median", "p95", "p99", "outlier"],
  viz: "boxplot"
});

window.KB["machine-learning"].push(
  {
    id: "decision-trees",
    category: "machine-learning",
    title: "Decision trees & random forests",
    difficulty: "Intermediate",
    short: "Rule-based models that split data with if/else questions — and the forests that make them accurate.",
    definition: "A decision tree predicts by asking a sequence of yes/no questions about features, splitting the data at each node until it reaches a prediction. A random forest averages many varied trees to cut overfitting and boost accuracy.",
    why: "Single trees are wonderfully interpretable — you can read the rules — but overfit easily. Random forests keep most of the power while generalizing far better, making them a reliable default for tabular data.",
    problem: "You want a model that captures non-linear rules, needs no feature scaling, and handles mixed data types — while staying accurate. Trees (and especially forests) fit that bill.",
    howItWorks: "A tree picks, at each node, the feature/threshold split that best separates the target (using impurity measures like Gini). It recurses until leaves are pure or a depth limit stops it. A random forest trains many trees on random subsets of rows and features, then votes/averages — the diversity cancels out individual trees' overfitting.",
    example: "A bank's churn model: a tree learns rules like 'if month-to-month AND tickets>2 → likely churn'. A random forest of hundreds of such trees gives a more accurate, stable churn probability for each customer.",
    code: "from sklearn.ensemble import RandomForestClassifier\nrf = RandomForestClassifier(n_estimators=300, max_depth=8)\nrf.fit(X_train, y_train)\nprint(rf.score(X_test, y_test))\nprint(rf.feature_importances_)   # which features mattered",
    engineering: "Forests need no feature scaling and expose feature importances, which help explain and debug. They're heavier to store/serve than a linear model, so weigh accuracy against latency and size.",
    whenToUse: ["Tabular data where accuracy matters and relationships are non-linear", "When you want feature-importance insight", "A strong, low-effort baseline"],
    whenNotToUse: ["Images/text/sequences (use deep learning)", "Very tight latency/size budgets", "When a single interpretable tree or linear model is required"],
    limitations: ["Single trees overfit; forests are larger and slower to predict", "Forests lose the single tree's easy interpretability", "Can struggle to extrapolate beyond the training range"],
    keyTakeaway: "A tree is readable if/else rules that overfit; a random forest averages many diverse trees for accuracy and gives feature importances — a great tabular default.",
    related: ["classification", "overfitting", "feature-engineering", "sklearn-workflow"],
    keywords: ["decision tree", "random forest", "ensemble", "gini", "feature importance", "bagging", "splits"],
    viz: null
  },
  {
    id: "data-leakage",
    category: "machine-learning",
    title: "Data leakage",
    difficulty: "Intermediate",
    short: "When information the model shouldn't have sneaks into training — making it look brilliant, then fail.",
    definition: "Data leakage is when information that wouldn't be available at prediction time (including anything from the test set or the target itself) leaks into training. The model scores unrealistically well in development, then collapses in production.",
    why: "Leakage is the single most common cause of 'amazing in the notebook, useless in production' models. Recognizing it saves you from shipping a model built on a mirage.",
    problem: "A model reports 99% accuracy and everyone celebrates — but it secretly learned from a column that encodes the answer, or was scaled using the test set. It has nothing real to offer new data.",
    howItWorks: "Common leaks: (1) fitting scalers/encoders/feature selection on all data before splitting — the test set influences training; (2) target leakage — a feature that's a proxy for or derived from the target (e.g. 'account_closed_date' when predicting churn); (3) time leakage — using future information to predict the past. The fix: split first, fit every transform on train only, and ask of each feature 'would I actually have this at prediction time?'.",
    example: "A hospital model predicting illness looked near-perfect — until someone noticed a feature was the treatment already prescribed for that illness. It had 'peeked' at the answer; in real triage that feature doesn't exist yet.",
    code: "from sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\n# Pipeline fits the scaler INSIDE cross-validation folds -> no leakage\npipe = make_pipeline(StandardScaler(), LogisticRegression())\npipe.fit(X_train, y_train)",
    engineering: "Leakage is a correctness bug, like reading test answers into your unit tests. Prevent it structurally: split before any fitting, wrap preprocessing in a Pipeline, and review each feature for 'is this known at inference time?'.",
    whenToUse: ["As a checklist on every supervised project before trusting results", "Whenever a score looks too good to be true"],
    whenNotToUse: [],
    limitations: ["Subtle leaks can be very hard to spot", "Requires domain knowledge to judge what's truly available at prediction time"],
    keyTakeaway: "If results look too good, suspect leakage: split before fitting anything, keep transforms inside a pipeline, and check every feature is actually available at prediction time.",
    related: ["train-test-split", "standardization", "feature-engineering", "overfitting"],
    keywords: ["data leakage", "target leakage", "leakage", "too good to be true", "pipeline", "train test", "overfitting"],
    viz: null
  },
  {
    id: "pca",
    category: "machine-learning",
    title: "PCA & dimensionality reduction",
    difficulty: "Advanced",
    short: "Compress many correlated features into a few informative ones while keeping most of the signal.",
    definition: "Dimensionality reduction lowers the number of features while preserving structure. Principal Component Analysis (PCA) is the classic method: it finds new axes (principal components) along which the data varies most and re-expresses the data in the top few.",
    why: "High-dimensional data is slow, hard to visualize, and prone to overfitting (the 'curse of dimensionality'). PCA compresses it, removes redundancy from correlated features, and lets you plot high-dimensional data in 2D.",
    problem: "You have 200 correlated sensor features. Many carry the same information. PCA condenses them into a handful of components that capture most of the variation, speeding up models and enabling visualization.",
    howItWorks: "PCA finds the directions of maximum variance in the (standardized) data — the first component captures the most, the next the most of what remains, and so on, each orthogonal to the last. Keeping the top k components gives a lower-dimensional representation that retains a stated percentage of total variance. Features must be scaled first.",
    example: "To visualize customer segments described by 30 features, an analyst runs PCA down to 2 components (retaining ~80% of variance) and plots them — the clusters become visible on a simple scatter.",
    code: "from sklearn.preprocessing import StandardScaler\nfrom sklearn.decomposition import PCA\nXs = StandardScaler().fit_transform(X)\npca = PCA(n_components=2).fit(Xs)\nprint(pca.explained_variance_ratio_)   # variance kept per component\nX2 = pca.transform(Xs)                 # now 2-D for plotting",
    engineering: "PCA is a preprocessing transform (fit on train only, like a scaler) that can shrink model input size and speed inference. The trade-off: components are combinations of features, so you lose direct interpretability.",
    whenToUse: ["Compressing many correlated features; speeding up models", "Visualizing high-dimensional data in 2D/3D", "Reducing noise and redundancy"],
    whenNotToUse: ["When interpretability of individual features is essential", "Few features, or mostly independent ones", "Strongly non-linear structure (consider other methods)"],
    limitations: ["Components are hard to interpret (mixtures of features)", "Only captures linear structure; sensitive to scaling", "Choosing how many components to keep is a judgement call"],
    keyTakeaway: "PCA re-expresses correlated features along axes of maximum variance and keeps the top few — great for speed, denoising and 2D visualization, at the cost of interpretability.",
    related: ["standardization", "clustering", "feature-engineering"],
    keywords: ["pca", "principal component", "dimensionality reduction", "variance", "curse of dimensionality", "compression"],
    viz: null
  },
  {
    id: "recommendation-systems",
    category: "machine-learning",
    title: "Recommendation systems",
    difficulty: "Intermediate",
    short: "Predict what a user will like — the engine behind 'you might also enjoy'.",
    definition: "A recommendation system suggests items a user is likely to want. The two classic approaches are collaborative filtering (recommend what similar users liked) and content-based filtering (recommend items similar to ones the user already liked).",
    why: "Recommendations drive a huge share of engagement and revenue on commerce, media and content platforms. They turn an overwhelming catalogue into a personalized, navigable shortlist.",
    problem: "A catalogue has a million items; a user will look at a dozen. How do you surface the right dozen? Recommenders predict per-user preference to rank what to show.",
    howItWorks: "Collaborative filtering builds a user–item interaction matrix and finds patterns: 'users like you also bought X'. Content-based filtering represents items by features (or embeddings) and recommends nearest items to what a user engaged with. Modern systems blend both (hybrid) and increasingly use embeddings + vector search for similarity.",
    example: "A streaming service recommends shows via collaborative filtering ('viewers with your history watched this') and content-based signals (same genre/cast as what you finished) — combined into one ranked home row.",
    code: "# content-based: recommend items nearest to a liked item's embedding\nimport numpy as np\ndef recommend(liked_vec, item_vecs, k=5):\n    sims = item_vecs @ liked_vec        # cosine if vectors are normalized\n    return np.argsort(-sims)[:k]",
    engineering: "A recommender is a ranking service: precompute embeddings/similarities offline, serve top-k fast (often via a vector database), and log interactions to improve it. The same embedding + nearest-neighbour machinery as semantic search and RAG applies here.",
    whenToUse: ["Personalizing large catalogues (commerce, media, content)", "Increasing engagement, discovery and cross-sell"],
    whenNotToUse: ["Tiny catalogues where simple rules or popularity suffice", "When you lack interaction data for new users/items"],
    limitations: ["Cold start: little data for new users or items", "Can create filter bubbles and reinforce popularity", "Needs ongoing interaction data and evaluation"],
    keyTakeaway: "Recommenders predict per-user preference via collaborative (similar users) and content-based (similar items) signals — a ranking service built on the same embedding/similarity tools as search.",
    related: ["tokens-embeddings", "vector-search", "clustering"],
    keywords: ["recommendation", "recommender", "collaborative filtering", "content-based", "personalization", "ranking", "cold start"],
    viz: null
  },
  {
    id: "time-series",
    category: "machine-learning",
    title: "Time-series forecasting basics",
    difficulty: "Intermediate",
    short: "Predict future values from history — where order and time matter and normal splits break.",
    definition: "Time-series forecasting predicts future values of a quantity measured over time (sales, demand, traffic) using its past. Unlike ordinary ML, the data is ordered, and that order carries information you must respect.",
    why: "Countless business questions are forecasts: how much stock to order, how many servers to provision, next quarter's revenue. Time-series methods exploit trend and seasonality that generic models miss.",
    problem: "You need next month's demand. The data has an upward trend and a repeating yearly pattern, and — critically — you can't use the future to predict the past, so a random train/test split would cheat.",
    howItWorks: "A series often decomposes into trend (long-term direction), seasonality (repeating cycles) and noise. Methods range from simple baselines (last value, moving average) to classical models (ARIMA, exponential smoothing) to ML with engineered lag/rolling features. Validation must be chronological: train on earlier periods, test on later ones.",
    example: "A retailer forecasts December demand using years of history: the model captures the steady growth trend plus the holiday spike, and is validated by predicting last December from earlier data.",
    code: "import pandas as pd\ndf = df.sort_values('date')\ndf['lag_1'] = df['sales'].shift(1)         # yesterday's value\ndf['roll_7'] = df['sales'].rolling(7).mean()  # weekly average\n# train on earlier dates, test on later dates (never shuffle)",
    engineering: "The big rule: split by time, never randomly, or you leak the future. Features are lags and rolling windows; retraining as new data arrives is part of the deployment loop (a natural fit for the MLOps lifecycle).",
    whenToUse: ["Forecasting demand, sales, traffic, capacity", "Any target measured repeatedly over time with trend/seasonality"],
    whenNotToUse: ["Independent observations with no time order (ordinary ML)", "When there's too little history to see patterns"],
    limitations: ["Sudden regime changes (shocks) break models trained on the past", "Requires chronological validation; random splits leak the future", "Long horizons are inherently uncertain"],
    keyTakeaway: "Forecasting exploits trend and seasonality in ordered data — engineer lag/rolling features and always validate chronologically, because using the future to predict the past is leakage.",
    related: ["data-leakage", "train-test-split", "feature-engineering", "mlops-lifecycle"],
    keywords: ["time series", "forecasting", "trend", "seasonality", "arima", "lag", "rolling", "demand"],
    viz: null
  }
);

window.KB.mlops.push({
  id: "ai-ethics",
  category: "mlops",
  title: "AI ethics, bias & fairness",
  difficulty: "Intermediate",
  short: "Models learn our data's biases — responsible AI means detecting and mitigating real-world harm.",
  definition: "The practice of building and operating ML systems responsibly: detecting and reducing unfair bias, protecting privacy, being transparent about decisions, and keeping humans accountable for outcomes that affect people.",
  why: "Models trained on historical data absorb the biases in that data and can amplify them at scale — denying loans, mis-ranking candidates, misidentifying people. Beyond ethics and law, biased models are simply wrong and a serious business and reputational risk.",
  problem: "A model optimized purely for accuracy can be systematically unfair to a group while still scoring well overall. You need to measure and address fairness explicitly — it won't happen by accident.",
  howItWorks: "Bias enters through skewed or unrepresentative training data and through proxy features (e.g. a postcode standing in for race). Mitigation spans the lifecycle: audit data for representation, evaluate metrics per subgroup (not just overall), remove or scrutinize proxy features, add fairness constraints, keep a human in the loop for high-stakes decisions, and document limitations. Privacy (minimizing and protecting personal data) and transparency (explaining decisions) are part of the same duty.",
  example: "A hiring model trained on past hires favoured one group because history did. The team caught it by evaluating selection rates per group, removed proxy features, and added human review — turning a discriminatory tool into an audited assistive one.",
  code: null,
  engineering: "Fairness is a requirement to test for, like security or accessibility — not an afterthought. Bake subgroup metrics into evaluation and monitoring, log decisions for auditability, and treat high-stakes predictions as human-assist, not human-replace.",
  whenToUse: ["Any model whose decisions affect people (credit, hiring, healthcare, justice)", "Whenever training data reflects historical or social bias"],
  whenNotToUse: ["As a checkbox — it's ongoing, not a one-time sign-off"],
  limitations: ["Fairness has multiple, sometimes mutually incompatible definitions", "Removing obvious sensitive features doesn't remove proxies", "Trade-offs between fairness, accuracy and other goals require human judgement"],
  keyTakeaway: "Models inherit and amplify data bias; responsible AI means measuring fairness per subgroup, watching for proxy features, protecting privacy, and keeping humans accountable for high-stakes decisions.",
  related: ["model-evaluation", "mlops-monitoring", "feature-engineering"],
  keywords: ["ai ethics", "bias", "fairness", "responsible ai", "privacy", "transparency", "discrimination", "proxy"],
  viz: null
});

window.KB.glossary.push(
  { term: "Random forest", category: "glossary", definition: "An ensemble of many decision trees whose votes are averaged for a more accurate, less overfit prediction.", topic: "decision-trees" },
  { term: "Decision tree", category: "glossary", definition: "A model that predicts by following a sequence of yes/no feature questions to a leaf.", topic: "decision-trees" },
  { term: "Data leakage", category: "glossary", definition: "When information unavailable at prediction time (or from the test set) sneaks into training, inflating scores.", topic: "data-leakage" },
  { term: "PCA", category: "glossary", definition: "Principal Component Analysis — re-expresses correlated features along axes of maximum variance, keeping the top few.", topic: "pca" },
  { term: "Collaborative filtering", category: "glossary", definition: "Recommending items by finding users with similar tastes ('users like you also liked…').", topic: "recommendation-systems" },
  { term: "Seasonality", category: "glossary", definition: "A repeating cyclical pattern in time-series data (e.g. weekly or yearly).", topic: "time-series" },
  { term: "IQR", category: "glossary", definition: "Interquartile range — the middle 50% of data (Q3 − Q1); a robust measure of spread and outlier rule.", topic: "percentiles-iqr" },
  { term: "Percentile", category: "glossary", definition: "The value below which a given percent of the data falls (p95 = 95% of values are lower).", topic: "percentiles-iqr" },
  { term: "Fairness", category: "glossary", definition: "Evaluating and reducing a model's unfair bias across groups, not just its overall accuracy.", topic: "ai-ethics" }
);
