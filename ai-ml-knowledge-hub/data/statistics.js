window.KB = window.KB || {};
window.KB.statistics = [
  {
    id: "descriptive-stats",
    category: "statistics",
    title: "Descriptive statistics: mean, median, mode",
    difficulty: "Beginner",
    short: "Three ways to describe the 'centre' of data — and why they disagree on skewed data.",
    definition: "Measures of central tendency. The mean is the arithmetic average. The median is the middle value when sorted. The mode is the most frequent value. Together they summarize where a dataset is centred.",
    why: "A single 'typical' number lets you compare groups and spot shifts at a glance. But which number? On skewed data the mean and median tell different stories, so choosing the right one matters.",
    problem: "Reporting average salary when a few executives earn millions makes the 'typical' salary look far higher than what most people actually earn. The median resists those extreme values.",
    howItWorks: "Mean = sum ÷ count, so every value (including outliers) pulls it. Median = the middle of the sorted values, unaffected by how extreme the tails are. Mode = the value that occurs most, the only one that works for categories. On symmetric data all three roughly agree; on skewed data mean is dragged toward the long tail.",
    example: "Salaries [40k, 45k, 50k, 55k, 500k]: mean ≈ 138k (misleading), median = 50k (representative). Report the median. For 'most common product colour', use the mode.",
    code: "import numpy as np\nsalaries = np.array([40, 45, 50, 55, 500])  # in k\nprint(salaries.mean())    # 138.0  (pulled by outlier)\nprint(np.median(salaries))# 50.0   (robust)",
    engineering: "These are your basic aggregations — the AVG/MEDIAN of a metric. Choosing mean vs median is a modelling decision: dashboards and SLAs often use median/percentiles precisely because they resist outliers.",
    whenToUse: [
      "Summarizing a numeric column in one number",
      "Median for skewed data (income, prices, response times); mode for categories"
    ],
    whenNotToUse: [
      "As the only summary — always pair with a measure of spread",
      "Mean on heavily skewed data where it misleads"
    ],
    limitations: [
      "A centre alone hides spread and shape — two very different datasets can share a mean",
      "Mean is sensitive to outliers"
    ],
    keyTakeaway: "Mean is average but outlier-sensitive; median is the robust middle; mode is the most frequent. On skewed data, prefer the median.",
    related: ["variance-std", "normal-distribution", "correlation"],
    keywords: ["mean", "median", "mode", "average", "central tendency", "descriptive", "skew"],
    viz: "central-tendency",
    comparison: {
      title: "Mean vs Median",
      headers: ["Aspect", "Mean", "Median"],
      rows: [
        ["What it is", "Arithmetic average", "Middle sorted value"],
        ["Outlier sensitivity", "High — pulled by extremes", "Low — robust"],
        ["Best for", "Symmetric data", "Skewed data (income, prices)"],
        ["Uses all values", "Yes", "No, only position"]
      ]
    }
  },
  {
    id: "variance-std",
    category: "statistics",
    title: "Variance & standard deviation",
    difficulty: "Beginner",
    short: "How spread out the data is — two datasets with the same mean can behave completely differently.",
    definition: "Variance is the average squared distance of values from the mean. Standard deviation (std) is its square root, expressed in the same units as the data. Both measure how much values typically deviate from the centre.",
    why: "The mean alone is dangerous. Two processes with the same average can have wildly different consistency, and consistency is often what actually matters — in quality, risk and reliability.",
    problem: "Two machines both produce parts averaging 10mm. One varies by ±0.1mm, the other by ±2mm. Same mean, but only the first is usable. Std captures exactly this difference.",
    howItWorks: "For each value, take its distance from the mean, square it (so negatives don't cancel and big deviations count more), average those, and that's the variance. Take the square root to get std back in the original units. Larger std = more spread. It's also the basis of standardization in ML.",
    example: "Machine A parts: 9.9, 10.0, 10.1, 10.0, 10.0 → std ≈ 0.06mm. Machine B: 8.0, 9.5, 10.0, 11.0, 11.5 → std ≈ 1.3mm. Identical means, but B is 20× less consistent — a quality red flag.",
    code: "import numpy as np\na = np.array([9.9, 10.0, 10.1, 10.0, 10.0])\nb = np.array([8.0, 9.5, 10.0, 11.0, 11.5])\nprint(a.mean(), b.mean())   # 10.0 10.0 (same)\nprint(a.std().round(2), b.std().round(2))  # 0.06 1.3",
    engineering: "Std is the unit of 'normal variation'. Alerting thresholds like 'flag anything 3 std above the mean' are built on it, and feature standardization ((x−mean)/std) rescales features so ML algorithms treat them fairly.",
    whenToUse: [
      "Quantifying consistency, risk or volatility",
      "Setting anomaly thresholds and standardizing features for ML"
    ],
    whenNotToUse: [
      "Very skewed data where std is distorted — consider IQR/percentiles",
      "As a standalone number without the mean for context"
    ],
    limitations: [
      "Squaring makes it outlier-sensitive",
      "Only fully meaningful for roughly bell-shaped data"
    ],
    keyTakeaway: "Std measures typical spread around the mean in the data's own units. Always report spread alongside the centre — same mean, different std means different behaviour.",
    related: ["descriptive-stats", "normal-distribution", "standardization"],
    keywords: ["variance", "standard deviation", "std", "spread", "dispersion", "volatility", "consistency"],
    viz: "std-spread"
  },
  {
    id: "normal-distribution",
    category: "statistics",
    title: "Normal distribution",
    difficulty: "Intermediate",
    short: "The bell curve — the shape that describes so much natural and aggregated data.",
    definition: "The normal (Gaussian) distribution is a symmetric, bell-shaped probability distribution defined by its mean (centre) and standard deviation (width). Values near the mean are most likely; extreme values are rare.",
    why: "Many real quantities (heights, measurement errors, averages of samples) are approximately normal, and much of classical statistics assumes normality. Recognizing the bell curve tells you what's typical and what's an outlier.",
    problem: "To judge whether a value is surprising, you need a model of what's normal. The bell curve gives precise odds: about 68% of values fall within 1 std of the mean, 95% within 2, 99.7% within 3.",
    howItWorks: "The curve is fully described by mean and std. The mean sets where the peak sits; the std sets how wide it is. The 68–95–99.7 rule quantifies the tails: only ~0.3% of values lie beyond 3 std, which is why '3-sigma' is a common anomaly threshold.",
    example: "Adult male heights average ~175cm with std ~7cm and follow a bell curve. So ~95% fall between 161cm and 189cm, and a 200cm height (>3 std) is genuinely rare — the same logic flags anomalous sensor readings.",
    code: "import numpy as np\nx = np.random.normal(loc=175, scale=7, size=10000)  # mean 175, std 7\nwithin_1_std = np.mean(np.abs(x - 175) <= 7)\nprint(round(within_1_std, 2))   # ~0.68",
    engineering: "The 68–95–99.7 rule is a ready-made anomaly detector: flag values beyond N standard deviations. Many statistical tests and confidence intervals assume normality, so checking it validates those tools.",
    whenToUse: [
      "Modelling naturally bell-shaped quantities and measurement error",
      "Setting std-based anomaly thresholds; underpinning many tests"
    ],
    whenNotToUse: [
      "Skewed or heavy-tailed data (income, latencies) — don't force normality",
      "Counts or bounded data that clearly aren't bell-shaped"
    ],
    limitations: [
      "Assuming normality when data is skewed gives wrong probabilities",
      "Real tails are often 'fatter' than the normal predicts"
    ],
    keyTakeaway: "The bell curve is set by mean and std; the 68–95–99.7 rule tells you what's typical vs rare — but check the shape before assuming it.",
    related: ["variance-std", "descriptive-stats", "hypothesis-testing"],
    keywords: ["normal", "gaussian", "bell curve", "distribution", "68 95 99.7", "sigma", "probability"],
    viz: "normal-dist"
  },
  {
    id: "correlation",
    category: "statistics",
    title: "Correlation & covariance",
    difficulty: "Intermediate",
    short: "Measure whether two variables move together — and never confuse that with causation.",
    definition: "Covariance measures whether two variables move in the same direction. Correlation is covariance rescaled to a standard −1 to +1 range: +1 perfect positive, −1 perfect negative, 0 no linear relationship.",
    why: "Relationships between variables drive prediction and feature selection. Correlation gives a single, comparable number for how strongly two things move together, regardless of their units.",
    problem: "Does ad spend relate to sales? Does temperature relate to ice-cream revenue? Correlation quantifies the strength and direction of such linear links so you can prioritize what to investigate or use as a feature.",
    howItWorks: "Covariance sums how far both variables sit from their means at the same time — positive when they rise together. But its size depends on units. Dividing by both standard deviations gives correlation, a unitless −1..+1 score. Note it only captures *linear* relationships.",
    example: "A retailer finds ad spend and sales correlate at 0.85 (strong positive) — useful. They also find ice-cream sales correlate with drownings; both are driven by hot weather. Correlation is real; causation is not.",
    code: "import numpy as np\nad = np.array([10, 20, 30, 40, 50])\nsales = np.array([100, 180, 240, 360, 400])\nprint(np.corrcoef(ad, sales)[0, 1].round(2))  # 0.99",
    engineering: "Correlation guides feature selection (drop redundant, highly-correlated features) and sanity-checks assumptions. But acting as if correlation means causation is a classic, expensive analytics mistake — validate causal claims with experiments.",
    whenToUse: [
      "Measuring linear relationship strength; feature selection during EDA",
      "Spotting redundant features that carry the same signal"
    ],
    whenNotToUse: [
      "Claiming one variable causes another (needs controlled experiments)",
      "Non-linear relationships, which correlation can miss entirely"
    ],
    limitations: [
      "Only detects linear relationships",
      "Sensitive to outliers; correlation ≠ causation"
    ],
    keyTakeaway: "Correlation scores linear co-movement from −1 to +1 in a unitless way — but a strong correlation never proves causation.",
    related: ["descriptive-stats", "regression", "feature-engineering"],
    keywords: ["correlation", "covariance", "relationship", "linear", "causation", "corrcoef", "feature selection"],
    viz: "correlation",
    comparison: {
      title: "Correlation vs Causation",
      headers: ["Aspect", "Correlation", "Causation"],
      rows: [
        ["Means", "Two variables move together", "One variable produces the change in another"],
        ["Evidence", "Observational data, a coefficient", "Controlled experiment / A-B test"],
        ["Example", "Ice cream & drownings both rise in summer", "Adding sugar raises blood glucose"],
        ["Risk", "Confounding variable fools you", "Requires careful design to establish"]
      ]
    }
  },
  {
    id: "probability-basics",
    category: "statistics",
    title: "Probability basics",
    difficulty: "Beginner",
    short: "The language of uncertainty — and the foundation under every ML prediction.",
    definition: "Probability quantifies how likely an event is, on a scale from 0 (impossible) to 1 (certain). Conditional probability — the chance of A given that B happened — is the core idea behind classification and much of ML.",
    why: "ML models rarely output certainties; they output probabilities ('80% likely to churn'). Understanding probability lets you interpret, threshold and combine those outputs sensibly instead of treating them as hard yes/no facts.",
    problem: "A fraud model says a transaction is 'positive'. Positive at what confidence? Probability turns vague labels into calibrated numbers you can act on — block at >0.9, review at 0.5–0.9, allow below.",
    howItWorks: "Basic probability = favourable outcomes ÷ total outcomes for equally likely cases. Conditional probability P(A|B) narrows the world to cases where B holds. Classifiers estimate P(class | features); you then pick a decision threshold that balances the costs of the two error types.",
    example: "A spam filter estimates P(spam | words in email) = 0.97. Because a missed important email is costly, the team sets the 'spam' threshold at 0.95 rather than 0.5, trading a little recall for fewer false alarms.",
    code: "# a classifier's probability output drives the decision\nprob_fraud = 0.87\nif prob_fraud > 0.90:\n    action = 'block'\nelif prob_fraud > 0.50:\n    action = 'review'\nelse:\n    action = 'allow'\nprint(action)  # review",
    engineering: "Model outputs are probabilities, and the decision threshold is a business rule you own — not a fixed 0.5. Exposing the probability (not just the label) through your API lets application logic route high-, medium- and low-confidence cases differently.",
    whenToUse: [
      "Interpreting classifier confidence and choosing thresholds",
      "Reasoning about risk, rare events and combined uncertainties"
    ],
    whenNotToUse: [
      "Treating an uncalibrated model score as a true probability without checking"
    ],
    limitations: [
      "Model 'probabilities' are often poorly calibrated and need adjustment",
      "Rare-event probabilities are hard to estimate reliably"
    ],
    keyTakeaway: "ML outputs probabilities, not certainties; the threshold that turns a probability into an action is a business decision you control.",
    related: ["normal-distribution", "classification", "model-evaluation"],
    keywords: ["probability", "conditional probability", "likelihood", "uncertainty", "threshold", "odds"],
    viz: null
  },
  {
    id: "hypothesis-testing",
    category: "statistics",
    title: "Hypothesis testing & p-values",
    difficulty: "Advanced",
    short: "Decide whether an observed difference is real or could just be random chance.",
    definition: "A formal procedure to test a claim. You assume a 'null hypothesis' (no effect), then compute how likely your observed data would be if the null were true. That likelihood is the p-value; a small p-value is evidence against the null.",
    why: "Any two groups differ a little by chance. Before you act on 'version B converted better', you need to know whether the difference is a real effect or just noise. Hypothesis testing draws that line rigorously.",
    problem: "An A/B test shows 5.1% vs 5.0% conversion. Is B genuinely better, or would you see this gap by luck? Shipping a change based on noise wastes effort and can hurt. Testing quantifies the risk of being fooled.",
    howItWorks: "State a null hypothesis (the two groups are the same). Choose a significance level (commonly 0.05). Compute a test statistic and its p-value — the probability of data this extreme if the null were true. If p < 0.05, reject the null and call the result 'statistically significant'; otherwise you can't conclude there's an effect.",
    example: "An A/B test on checkout: control 5.0% (n=10,000), variant 6.2% (n=10,000). A proportions test gives p = 0.002 — well under 0.05 — so the lift is very unlikely to be chance, and the team ships the variant.",
    code: "from scipy import stats\n# clicks out of impressions for control vs variant\nimport numpy as np\ncontrol = np.array([0]*9500 + [1]*500)   # 5.0%\nvariant = np.array([0]*9380 + [1]*620)   # 6.2%\nt, p = stats.ttest_ind(control, variant)\nprint(round(p, 4))  # small p => significant",
    engineering: "This is the statistics behind every A/B test and experimentation platform. As an engineer, you'll wire up the metrics and often read the p-value the platform reports — knowing what it means keeps you from shipping noise.",
    whenToUse: [
      "A/B tests and experiments comparing two groups or variants",
      "Deciding whether an observed difference warrants action"
    ],
    whenNotToUse: [
      "Tiny samples, or peeking repeatedly until p<0.05 (p-hacking)",
      "Treating statistical significance as practical importance"
    ],
    limitations: [
      "p < 0.05 is a convention, not proof; a p-value is not the probability the hypothesis is true",
      "A significant result can still be too small to matter in practice"
    ],
    keyTakeaway: "A p-value is the chance of seeing your data if there were no real effect; small p-value = unlikely to be luck. Significant ≠ large or important.",
    related: ["probability-basics", "normal-distribution", "correlation"],
    keywords: ["hypothesis testing", "p-value", "significance", "null hypothesis", "a/b test", "t-test", "confidence"],
    viz: null
  }
];
