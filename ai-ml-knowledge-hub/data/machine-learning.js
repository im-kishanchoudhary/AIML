window.KB = window.KB || {};
window.KB["machine-learning"] = [
  {
    id: "ml-fundamentals",
    category: "machine-learning",
    title: "ML fundamentals: supervised vs unsupervised",
    difficulty: "Beginner",
    short: "Learning patterns from data — with labelled answers (supervised) or without (unsupervised).",
    definition: "Machine learning fits a model to data so it can make predictions on new inputs. Supervised learning trains on labelled examples (inputs + known answers). Unsupervised learning finds structure in unlabelled data. There is also reinforcement learning, where an agent learns from rewards.",
    why: "It's the fork in the road for any ML project: what you have (labels or not) and what you want (predict a known target vs discover structure) decides the entire toolset. Getting this wrong wastes the whole effort.",
    problem: "You have customer data. If you know who churned, you can *predict* churn (supervised). If you just want to *discover* natural customer groups, you have no labels — that's unsupervised. Same data, different problem.",
    howItWorks: "Supervised: show the model many (features → label) pairs; it learns a mapping and predicts labels for new inputs. Classification predicts categories, regression predicts numbers. Unsupervised: give only features; the model groups similar items (clustering) or compresses them (dimensionality reduction). No 'right answer' is provided.",
    example: "Supervised: predict house price (regression) or spam/not-spam (classification) from past labelled examples. Unsupervised: segment shoppers into groups by behaviour with no predefined segments.",
    code: "# supervised: features X, known labels y\nfrom sklearn.linear_model import LogisticRegression\nmodel = LogisticRegression().fit(X_train, y_train)\npred = model.predict(X_new)   # predicts labels\n\n# unsupervised: only X, no labels\nfrom sklearn.cluster import KMeans\ngroups = KMeans(n_clusters=3).fit_predict(X)",
    engineering: "A trained model is just a function you call: features in, prediction out. The 'learning' happens once during training; in production you load the fitted model and call predict — cheap and fast, like any pure function.",
    whenToUse: [
      "Supervised when you have labelled outcomes and want to predict them",
      "Unsupervised when you have no labels and want to discover structure"
    ],
    whenNotToUse: [
      "When a simple rule or SQL query already solves the problem",
      "When you lack enough quality data to learn from"
    ],
    limitations: [
      "Supervised needs labelled data, which is often expensive to obtain",
      "Unsupervised results are subjective — no ground truth to check against"
    ],
    keyTakeaway: "Labels + predict a known target → supervised. No labels + find structure → unsupervised. This choice defines the whole project.",
    related: ["regression", "classification", "clustering", "data-science-workflow"],
    keywords: ["machine learning", "supervised", "unsupervised", "reinforcement", "labels", "fundamentals"],
    viz: null,
    comparison: {
      title: "Classification vs Regression",
      headers: ["Aspect", "Classification", "Regression"],
      rows: [
        ["Predicts", "A category / class", "A continuous number"],
        ["Example", "Spam or not spam", "House price in $"],
        ["Output", "Label (+ probability)", "Real value"],
        ["Typical metric", "Accuracy, precision, recall", "RMSE, MAE, R²"]
      ]
    }
  },
  {
    id: "regression",
    category: "machine-learning",
    title: "Regression",
    difficulty: "Beginner",
    short: "Predict a continuous number by fitting a line or curve to the relationship in the data.",
    definition: "Supervised learning that predicts a continuous numeric target from input features. Linear regression, the simplest form, fits a straight line that best captures how the target changes with the inputs.",
    why: "A huge share of business questions are 'how much?' — revenue, price, demand, time. Regression answers them and, crucially, its coefficients are interpretable: they tell you how much each factor moves the outcome.",
    problem: "Estimate a house's price from its size, location and age. Regression learns from past sales how each feature affects price, then predicts a value for a new listing.",
    howItWorks: "The model assumes target ≈ w₁·x₁ + w₂·x₂ + … + b. Training finds the weights (w) that minimize the error between predictions and actual values — the average squared difference (this is where mean and variance come back). The fitted line/plane then predicts the target for new inputs.",
    example: "A property site fits price = w·(area) + b on thousands of past sales. It learns roughly '$2,000 per square metre plus a base', then instantly estimates any new listing's price — the line through the scatter of sales.",
    code: "from sklearn.linear_model import LinearRegression\nmodel = LinearRegression().fit(X_train, y_train)   # X: area, y: price\nprint(model.coef_, model.intercept_)   # price per unit area, base\nprint(model.predict([[120]]))          # estimate for 120 m2",
    engineering: "Once fitted, the model is a tiny set of numbers (weights + intercept). Wrap predict() behind an API and your app sends features, gets a number back. Interpretable coefficients also make it easy to explain decisions to stakeholders.",
    whenToUse: [
      "Predicting a numeric value: price, demand, sales, duration",
      "When you need an interpretable, fast baseline model"
    ],
    whenNotToUse: [
      "Predicting categories (use classification)",
      "Strongly non-linear relationships a straight line can't capture (without feature engineering)"
    ],
    limitations: [
      "Linear regression assumes a linear relationship and is sensitive to outliers",
      "Correlated features make coefficients unstable and hard to interpret"
    ],
    keyTakeaway: "Regression predicts numbers by fitting a line/curve that minimizes error; linear regression is the interpretable baseline for any 'how much?' question.",
    related: ["classification", "correlation", "model-evaluation", "overfitting"],
    keywords: ["regression", "linear regression", "predict number", "coefficients", "line of best fit", "rmse"],
    viz: "regression"
  },
  {
    id: "classification",
    category: "machine-learning",
    title: "Classification",
    difficulty: "Beginner",
    short: "Predict which category something belongs to — spam/not-spam, fraud/legit, churn/stay.",
    definition: "Supervised learning that assigns inputs to discrete categories. The model learns a decision boundary from labelled examples and outputs a class — usually with a probability attached.",
    why: "Countless decisions are categorical: is this transaction fraud? will this customer churn? is this email spam? Classification automates these yes/no or multi-class decisions at scale and with confidence scores.",
    problem: "A bank can't manually review millions of transactions. A classifier trained on past labelled fraud learns the patterns and flags suspicious ones automatically, each with a probability that drives the action.",
    howItWorks: "The model learns from (features → class) examples to separate the classes. It outputs a probability per class; a threshold (default 0.5, but tunable) turns that into a decision. Common algorithms: logistic regression, decision trees, random forests, gradient boosting. Evaluation uses a confusion matrix, precision and recall — not just accuracy.",
    example: "An email provider trains on millions of emails labelled spam/not-spam. For each new email it outputs P(spam); above the threshold it routes to the spam folder. The same pattern powers fraud detection and churn prediction.",
    code: "from sklearn.ensemble import RandomForestClassifier\nclf = RandomForestClassifier().fit(X_train, y_train)\nproba = clf.predict_proba(X_new)[:, 1]   # P(positive class)\npred = (proba > 0.5).astype(int)          # threshold to a decision",
    engineering: "Expose predict_proba behind an API and let application logic act on the probability (block, review, allow). The threshold is a business lever balancing false positives against false negatives — own it deliberately.",
    whenToUse: [
      "Assigning items to categories: spam, fraud, churn, defect type",
      "When you need a confidence score to drive different actions"
    ],
    whenNotToUse: [
      "Predicting a continuous quantity (use regression)",
      "When classes are so imbalanced that accuracy is meaningless without care"
    ],
    limitations: [
      "Imbalanced classes fool accuracy — a 99%-legit dataset makes 'always legit' look 99% accurate",
      "Requires labelled data and careful threshold/metric choice"
    ],
    keyTakeaway: "Classification predicts categories with a probability; the decision threshold trades false positives against false negatives, so judge it with precision/recall, not accuracy.",
    related: ["ml-fundamentals", "model-evaluation", "probability-basics", "regression"],
    keywords: ["classification", "classifier", "spam", "fraud", "churn", "decision boundary", "predict_proba"],
    viz: null
  },
  {
    id: "clustering",
    category: "machine-learning",
    title: "Clustering (K-means)",
    difficulty: "Intermediate",
    short: "Group similar items automatically when you have no labels — like discovering customer segments.",
    definition: "Unsupervised learning that partitions data into groups (clusters) of similar items. K-means, the most common method, splits data into K clusters by grouping points around K centre points.",
    why: "Sometimes you don't have labels — you want to *discover* structure. Clustering finds natural groupings you didn't define in advance, turning a shapeless dataset into meaningful segments.",
    problem: "A retailer wants to understand its customers but has no predefined segments. Clustering groups them by behaviour (spend, frequency, recency), revealing distinct segments like 'loyal big spenders' vs 'occasional bargain hunters'.",
    howItWorks: "K-means picks K starting centres, assigns each point to its nearest centre, moves each centre to the average of its assigned points, and repeats until stable. You choose K (often via the 'elbow' in error-vs-K). Because it uses distances, features must be scaled first, or large-range features dominate.",
    example: "An e-commerce team runs K-means (K=4) on customers' recency, frequency and monetary value. Out come four segments; marketing then targets each with a different campaign — the classic customer-segmentation use case.",
    code: "from sklearn.preprocessing import StandardScaler\nfrom sklearn.cluster import KMeans\nXs = StandardScaler().fit_transform(X)   # scale first!\nlabels = KMeans(n_clusters=4, n_init=10).fit_predict(Xs)\nprint(labels[:10])   # each customer's cluster id",
    engineering: "Clustering is a discovery tool: its output (segment IDs) becomes a feature or a routing key in downstream systems. Since there's no ground truth, validate clusters with domain experts before acting on them.",
    whenToUse: [
      "Customer or market segmentation, grouping similar documents/images",
      "Exploratory discovery when you have no labels"
    ],
    whenNotToUse: [
      "When you actually have labels — use classification",
      "Clusters that aren't roughly round or equally sized (K-means struggles)"
    ],
    limitations: [
      "You must choose K, and results depend on scaling and random starts",
      "No objective 'correct' clustering — interpretation is subjective"
    ],
    keyTakeaway: "K-means groups unlabelled data into K clusters by proximity to centres. Always scale features first, and remember there's no ground truth to check against.",
    related: ["ml-fundamentals", "feature-engineering", "standardization"],
    keywords: ["clustering", "k-means", "kmeans", "segmentation", "unsupervised", "groups", "centroid"],
    viz: "kmeans"
  },
  {
    id: "feature-engineering",
    category: "machine-learning",
    title: "Feature engineering",
    difficulty: "Intermediate",
    short: "Turn raw data into informative inputs — often the biggest lever on model quality.",
    definition: "The craft of creating, transforming and selecting the input variables (features) a model learns from — encoding categories, scaling numbers, extracting parts of dates, and combining columns into more predictive signals.",
    why: "Models can only learn from what you feed them. A mediocre algorithm with great features usually beats a fancy algorithm with raw, poorly-prepared inputs. This is where domain knowledge pays off most.",
    problem: "A raw 'signup_date' timestamp is useless to a model. Extracting 'day of week', 'is_weekend' or 'days_since_signup' turns it into signals the model can actually use to predict behaviour.",
    howItWorks: "Common transforms: encode categories as numbers (one-hot for unordered), scale/standardize numeric features so ranges are comparable, extract components from dates and text, bucket continuous values, and combine columns (e.g. price ÷ area). Selection then drops redundant or uninformative features.",
    example: "For churn prediction, engineers derive 'support_tickets_last_30d', 'days_since_last_login', and 'is_month_to_month' from raw logs. These hand-built features lift the model far more than swapping algorithms does.",
    code: "import pandas as pd\ndf['is_weekend'] = pd.to_datetime(df['signup_date']).dt.dayofweek >= 5\ndf['price_per_m2'] = df['price'] / df['area']\ndf = pd.get_dummies(df, columns=['country'])   # one-hot encode",
    engineering: "Feature engineering must run identically at training and prediction time — the exact same transformations, or you get 'training/serving skew'. Package it as a reusable, tested transform (e.g. a scikit-learn Pipeline).",
    whenToUse: [
      "Almost always — before and during modelling",
      "Whenever domain knowledge suggests a more informative signal"
    ],
    whenNotToUse: [
      "Over-engineering hundreds of features that add noise and overfitting risk",
      "Deep learning on raw images/text, which learns features itself"
    ],
    limitations: [
      "Time-consuming and requires domain expertise",
      "Data leakage (using future/target info) silently inflates results"
    ],
    keyTakeaway: "Good features beat fancy algorithms. Transform raw data into informative, comparable inputs — and apply the exact same transforms in production.",
    related: ["standardization", "pandas-transform", "regression", "overfitting"],
    keywords: ["feature engineering", "encoding", "one-hot", "scaling", "features", "leakage", "pipeline"],
    viz: null
  },
  {
    id: "standardization",
    category: "machine-learning",
    title: "Feature scaling: normalization vs standardization",
    difficulty: "Intermediate",
    short: "Put features on comparable scales so distance- and gradient-based models treat them fairly.",
    definition: "Rescaling numeric features to a common range. Normalization (min-max) squeezes values into 0–1. Standardization (z-score) recentres to mean 0 and std 1 by computing (x − mean) / std.",
    why: "Many algorithms use distances or gradients. If 'income' ranges 0–100,000 and 'age' ranges 0–100, income dominates purely because of scale. Rescaling makes each feature contribute on its merits, not its units.",
    problem: "In K-means or KNN, unscaled income swamps age, so clusters/neighbours are decided almost entirely by income. Standardizing both to comparable ranges fixes this and often speeds up gradient-based training too.",
    howItWorks: "Standardization: subtract the feature's mean and divide by its std (built directly on the statistics topics) — result has mean 0, std 1, and keeps outlier structure. Normalization: (x − min) / (max − min) → 0..1, but is sensitive to outliers. Fit the scaler on training data only, then apply to test/production data.",
    example: "Before K-means customer segmentation, standardize recency, frequency and monetary value. Now a difference of one std in any of them counts equally, so clusters reflect genuine behaviour, not the accident of dollar magnitudes.",
    code: "from sklearn.preprocessing import StandardScaler\nscaler = StandardScaler().fit(X_train)   # learn mean & std from train only\nX_train_s = scaler.transform(X_train)\nX_test_s = scaler.transform(X_test)      # same mean & std applied",
    engineering: "The scaler is a fitted object with learned parameters — save it alongside the model and apply the identical transform at serving time. Fitting it on all data (including test) leaks information and inflates scores.",
    whenToUse: [
      "Distance-based (KNN, K-means, SVM) and gradient-based (neural nets, logistic/linear regression) models",
      "Whenever features have very different ranges or units"
    ],
    whenNotToUse: [
      "Tree-based models (decision trees, random forests) — they're scale-invariant",
      "When features are already on the same natural scale"
    ],
    limitations: [
      "Min-max normalization is distorted by outliers",
      "Must persist scaler params to avoid training/serving skew"
    ],
    keyTakeaway: "Scale features so none dominates by units: standardization (mean 0, std 1) is the safe default. Fit on training data only; trees don't need it.",
    related: ["variance-std", "feature-engineering", "clustering", "neural-networks"],
    keywords: ["standardization", "normalization", "scaling", "z-score", "min-max", "feature scaling", "standardscaler"],
    viz: null,
    comparison: {
      title: "Normalization vs Standardization",
      headers: ["Aspect", "Normalization (min-max)", "Standardization (z-score)"],
      rows: [
        ["Formula", "(x − min) / (max − min)", "(x − mean) / std"],
        ["Output range", "0 to 1 (bounded)", "Unbounded, mean 0 std 1"],
        ["Outlier effect", "High — min/max shift", "Lower — keeps structure"],
        ["Use when", "You need bounded values", "Default for most ML"]
      ]
    }
  },
  {
    id: "train-test-split",
    category: "machine-learning",
    title: "Train / validation / test split",
    difficulty: "Beginner",
    short: "Hold back unseen data to measure how a model will really perform — never grade it on what it studied.",
    definition: "Splitting data into separate sets: the training set to fit the model, a validation set to tune choices, and a test set held back untouched to estimate real-world performance on unseen data.",
    why: "A model can memorize its training data and look perfect, yet fail on new inputs. Evaluating on data it has never seen is the only honest measure of how it will perform in production.",
    problem: "If you test on the same data you trained on, a model that just memorized answers scores 100% — then collapses on real users. The split prevents this self-deception.",
    howItWorks: "Typically ~70% train, ~15% validation, ~15% test (or 80/20 with cross-validation). Fit on train, use validation to pick hyperparameters and compare models, and touch the test set only once at the very end. Any scaling or feature learning must be fit on train only, or information leaks.",
    example: "For churn prediction, a team trains on Jan–Sep data, validates model choices on October, and reports final numbers on November — data the model never saw — mirroring how it'll face next month's customers.",
    code: "from sklearn.model_selection import train_test_split\nX_tr, X_test, y_tr, y_test = train_test_split(\n    X, y, test_size=0.2, random_state=42)\n# fit on X_tr only; evaluate once on X_test",
    engineering: "This is your test harness: train set = development, test set = the exam you run once. Cross-validation rotates the split to use data efficiently. Reusing the test set to tune turns it into training data and inflates your estimate.",
    whenToUse: [
      "Every supervised ML project, without exception",
      "Cross-validation when data is limited and you need robust estimates"
    ],
    whenNotToUse: [
      "Time-series where random splits leak the future — split chronologically instead"
    ],
    limitations: [
      "A single split can be lucky/unlucky; cross-validation is more reliable",
      "Leakage (scaling/feature-selecting before splitting) silently inflates scores"
    ],
    keyTakeaway: "Never grade a model on data it trained on. Fit on train, tune on validation, and touch the test set once — that number is your honest estimate.",
    related: ["overfitting", "model-evaluation", "hyperparameter-tuning", "standardization"],
    keywords: ["train test split", "validation", "holdout", "cross-validation", "unseen data", "leakage"],
    viz: "train-test"
  },
  {
    id: "overfitting",
    category: "machine-learning",
    title: "Overfitting, underfitting & bias–variance",
    difficulty: "Intermediate",
    short: "The central tension of ML: memorizing noise vs being too simple to learn the pattern.",
    definition: "Overfitting: the model learns the training data's noise, scoring high on train but poorly on new data (high variance). Underfitting: the model is too simple to capture the pattern, scoring poorly everywhere (high bias). The bias–variance tradeoff is balancing the two.",
    why: "This is the failure mode behind most disappointing models. A model that dazzles in development and flops in production is almost always overfit. Recognizing and controlling it is core to shipping models that work.",
    problem: "A model scores 99% on training data but 70% on new data — it memorized rather than generalized. Or it scores 65% on both — too simple. You need the sweet spot in between.",
    howItWorks: "As model complexity rises, training error keeps falling but validation error falls then rises — the gap between them is overfitting. Fixes for overfitting: more data, fewer features, regularization, simpler models. Fixes for underfitting: more/better features, a more complex model, less regularization. The train-vs-validation gap is your diagnostic.",
    example: "A decision tree grown to full depth memorizes every training customer (100% train, 68% test) — overfit. Limiting its depth drops train to 82% but lifts test to 80% — it now generalizes. That trade is the whole game.",
    code: "from sklearn.tree import DecisionTreeClassifier\ndeep = DecisionTreeClassifier().fit(X_tr, y_tr)          # overfits\nprint(deep.score(X_tr, y_tr), deep.score(X_test, y_test))# 1.00 0.68\nshallow = DecisionTreeClassifier(max_depth=4).fit(X_tr, y_tr)\nprint(shallow.score(X_tr, y_tr), shallow.score(X_test, y_test)) # 0.82 0.80",
    engineering: "Watch the gap between training and validation scores like you'd watch dev-vs-production behaviour. A large gap = overfitting (memorized dev cases); both low = underfitting (logic too simple). Regularization is your complexity dial.",
    whenToUse: [
      "Diagnosing any model by comparing train vs validation performance",
      "Deciding whether to add complexity/features or remove them"
    ],
    whenNotToUse: [
      "As an excuse to endlessly tune — sometimes the data simply lacks signal"
    ],
    limitations: [
      "Reducing variance usually raises bias and vice versa — you trade, not eliminate",
      "Detecting overfitting requires a proper, leak-free validation set"
    ],
    keyTakeaway: "Overfit = memorized noise (great on train, poor on new); underfit = too simple (poor everywhere). Use the train-vs-validation gap to find the balance.",
    related: ["train-test-split", "model-evaluation", "feature-engineering", "hyperparameter-tuning"],
    keywords: ["overfitting", "underfitting", "bias", "variance", "generalization", "regularization", "tradeoff"],
    viz: "overfitting"
  },
  {
    id: "model-evaluation",
    category: "machine-learning",
    title: "Model evaluation: confusion matrix, precision & recall",
    difficulty: "Intermediate",
    short: "Accuracy lies on imbalanced data — precision and recall tell you what a model really does.",
    definition: "Metrics that judge model quality. For classification, the confusion matrix counts true/false positives and negatives; precision (of predicted positives, how many were right) and recall (of actual positives, how many were caught) summarize the two error types. For regression, RMSE/MAE/R² measure error size.",
    why: "A fraud dataset that's 99% legit lets a 'never fraud' model score 99% accuracy while catching zero fraud. Accuracy hides this; precision and recall expose it. Choosing the right metric is choosing what 'good' means.",
    problem: "You must decide which errors hurt more. Missing fraud (false negative) vs annoying a real customer (false positive) have very different costs — and the confusion matrix makes that trade explicit.",
    howItWorks: "The confusion matrix has four cells: true positives, false positives, false negatives, true negatives. Precision = TP / (TP + FP) — trustworthiness of positive predictions. Recall = TP / (TP + FN) — coverage of real positives. F1 balances them. Moving the decision threshold trades precision against recall.",
    example: "Cancer screening favours recall (catch every real case, tolerate false alarms). Spam filtering favours precision (don't trash real email, tolerate some spam slipping through). Same math, opposite priorities.",
    code: "from sklearn.metrics import confusion_matrix, precision_score, recall_score\ny_pred = model.predict(X_test)\nprint(confusion_matrix(y_test, y_pred))\nprint(precision_score(y_test, y_pred), recall_score(y_test, y_pred))",
    engineering: "Pick the metric that matches business cost before you train, and monitor it in production. Exposing the probability lets you tune the threshold later without retraining as costs change.",
    whenToUse: [
      "Every classification model — especially with imbalanced classes",
      "Choosing a decision threshold that reflects real error costs"
    ],
    whenNotToUse: [
      "Relying on accuracy alone when classes are imbalanced",
      "Regression tasks — use RMSE/MAE/R² instead"
    ],
    limitations: [
      "No single metric captures everything; precision and recall trade off",
      "Metrics on a bad test set (leakage, drift) are misleading"
    ],
    keyTakeaway: "Don't trust accuracy on imbalanced data. Read the confusion matrix; use precision when false positives cost more, recall when false negatives do.",
    related: ["classification", "train-test-split", "probability-basics", "overfitting"],
    keywords: ["evaluation", "confusion matrix", "precision", "recall", "f1", "accuracy", "rmse", "metrics"],
    viz: "confusion",
    comparison: {
      title: "Precision vs Recall",
      headers: ["Aspect", "Precision", "Recall"],
      rows: [
        ["Question", "Of flagged positives, how many correct?", "Of real positives, how many caught?"],
        ["Formula", "TP / (TP + FP)", "TP / (TP + FN)"],
        ["Optimize when", "False positives are costly (spam filter)", "False negatives are costly (cancer screen)"],
        ["Raising threshold", "Precision up, recall down", "Recall up, precision down (lowering it)"]
      ]
    }
  },
  {
    id: "hyperparameter-tuning",
    category: "machine-learning",
    title: "Hyperparameter tuning",
    difficulty: "Advanced",
    short: "Search the model's configuration knobs to squeeze out better, more generalizable performance.",
    definition: "Hyperparameters are settings you choose before training (tree depth, number of trees, learning rate, K in K-means) — as opposed to parameters the model learns. Tuning searches combinations of these to find the best-performing configuration.",
    why: "The same algorithm can be mediocre or excellent depending on its settings. Tuning is often a cheap, reliable way to improve a model without new data or features — but it must be done without cheating on the test set.",
    problem: "A random forest with default settings underperforms. The right number of trees and depth might lift it several points — but trying settings against the test set would overfit to it. You need a disciplined search.",
    howItWorks: "Define a grid or distribution of values, then use cross-validation on the training data to score each combination, and pick the best. Grid search tries every combination; random search samples them (often as good and cheaper). The held-out test set is still touched only once, at the end.",
    example: "Tuning a gradient-boosting churn model, a team grid-searches learning rate and tree depth with 5-fold CV. The best combination lifts recall from 0.71 to 0.78 — a real gain, validated without ever peeking at the test set.",
    code: "from sklearn.model_selection import GridSearchCV\nfrom sklearn.ensemble import RandomForestClassifier\ngrid = {'n_estimators': [100, 300], 'max_depth': [4, 8, None]}\nsearch = GridSearchCV(RandomForestClassifier(), grid, cv=5)\nsearch.fit(X_tr, y_tr)\nprint(search.best_params_)",
    engineering: "Tuning is an automated, reproducible experiment — log the search space, seeds and results like any experiment. Beware cost: the search multiplies training runs, so budget compute and prefer random search when the grid is large.",
    whenToUse: [
      "After a working baseline, to extract extra performance",
      "When defaults clearly underperform and you have compute to spare"
    ],
    whenNotToUse: [
      "Before you have a clean pipeline and a solid baseline",
      "When better data or features would help far more than knob-twiddling"
    ],
    limitations: [
      "Expensive — combinatorial explosion of runs",
      "Tuning against the test set (instead of CV) overfits to it"
    ],
    keyTakeaway: "Tune the pre-set knobs via cross-validation, not against the test set. It's a cheap boost — but good data and features usually matter more.",
    related: ["train-test-split", "overfitting", "model-evaluation", "sklearn-workflow"],
    keywords: ["hyperparameter", "tuning", "grid search", "cross-validation", "gridsearchcv", "optimization"],
    viz: null
  },
  {
    id: "sklearn-workflow",
    category: "machine-learning",
    title: "The scikit-learn workflow",
    difficulty: "Beginner",
    short: "One consistent fit / predict / score pattern across nearly every classic ML algorithm.",
    definition: "Scikit-learn is Python's core classic-ML library. Its power is a uniform API: every model is an object with the same .fit(), .predict() and .score() methods, so swapping algorithms is a one-line change.",
    why: "A consistent interface means you learn the pattern once and reuse it for every model, and you can compare algorithms fairly and quickly. It also provides the surrounding tools — splitting, scaling, metrics, tuning — in one coherent package.",
    problem: "Trying five algorithms shouldn't mean learning five APIs. Scikit-learn's shared interface lets you loop over candidate models and compare them with identical code.",
    howItWorks: "Instantiate a model, call fit(X_train, y_train) to train, predict(X_new) to infer, and score() or a metric to evaluate. Pipelines chain preprocessing (scaling, encoding) and the model into one object so the same steps run at train and predict time, preventing leakage.",
    example: "A team benchmarks logistic regression, random forest and gradient boosting for churn by looping over the three, fitting each on the same split, and comparing recall — a dozen lines because the API is identical.",
    code: "from sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\npipe = make_pipeline(StandardScaler(), LogisticRegression())\npipe.fit(X_tr, y_tr)\nprint(pipe.score(X_test, y_test))",
    engineering: "A fitted Pipeline is a single deployable artifact: serialize it (joblib) and load it behind an API so preprocessing and prediction happen together, identically, in production — the clean handoff from data science to engineering.",
    whenToUse: [
      "Almost all classic (non-deep-learning) ML on tabular data",
      "Comparing algorithms and building leak-free preprocessing pipelines"
    ],
    whenNotToUse: [
      "Large-scale deep learning (use PyTorch/TensorFlow)",
      "Data far bigger than memory (needs distributed tools)"
    ],
    limitations: [
      "Not designed for GPUs or deep neural networks",
      "In-memory, single-machine by default"
    ],
    keyTakeaway: "Learn fit/predict/score once and it works for every scikit-learn model; wrap preprocessing + model in a Pipeline to deploy one leak-free artifact.",
    related: ["ml-fundamentals", "standardization", "train-test-split", "mlops-lifecycle"],
    keywords: ["scikit-learn", "sklearn", "fit", "predict", "pipeline", "workflow", "api"],
    viz: null
  }
];
