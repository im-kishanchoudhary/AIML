window.KB = window.KB || {};
window.KB.pandas = [
  {
    id: "pandas-dataframe",
    category: "pandas",
    title: "Pandas Series & DataFrame",
    difficulty: "Beginner",
    short: "A spreadsheet-like, labelled table in memory — the workhorse of data analysis in Python.",
    definition: "A Series is a labelled one-dimensional array (one column). A DataFrame is a two-dimensional table of Series sharing a common row index — rows and named columns, like a spreadsheet or SQL table living in memory.",
    why: "Real data has named columns of mixed types (numbers, dates, text). NumPy alone can't label or mix types comfortably. Pandas adds labels, mixed types and hundreds of table operations on top of NumPy's speed.",
    problem: "You need to load a CSV, select the customers from Europe, group by country and average their spend. Pandas expresses each of these as a short, readable operation instead of manual parsing and looping.",
    howItWorks: "Each column is a NumPy-backed Series with a dtype; columns are aligned by a shared row index. You select by label (`df['col']`), filter with boolean masks (`df[df.age > 30]`), and combine, group and aggregate — all vectorized underneath.",
    example: "An analyst loads a 500k-row orders table, filters to the last quarter, groups by region, and computes average order value per region — a few lines that would be a long, error-prone script in plain Python.",
    code: "import pandas as pd\ndf = pd.DataFrame({'region': ['EU','US','EU','US'],\n                   'spend': [120, 90, 200, 60]})\nby_region = df.groupby('region')['spend'].mean()\nprint(by_region)   # EU 160.0, US 75.0",
    engineering: "Think of a DataFrame as an in-memory SQL table with a Python API: select, filter, join (merge), group by, aggregate. If you know SQL, you already understand most of Pandas' operations.",
    whenToUse: [
      "Loading, cleaning, transforming and analyzing tabular data",
      "Anything you'd otherwise do in a spreadsheet or SQL, but scripted"
    ],
    whenNotToUse: [
      "Data far larger than memory — use chunking, a database, or Spark/Polars",
      "Pure numeric matrix math — stay in NumPy"
    ],
    limitations: [
      "Everything must fit in RAM",
      "Some operations copy data and spike memory; chained indexing can bite"
    ],
    keyTakeaway: "A DataFrame is a labelled, mixed-type, in-memory table with SQL-like operations — the default tool for practical data wrangling.",
    related: ["pandas-loading", "pandas-cleaning", "pandas-transform", "numpy-ndarray"],
    keywords: ["pandas", "dataframe", "series", "table", "column", "groupby", "index"],
    viz: null
  },
  {
    id: "pandas-loading",
    category: "pandas",
    title: "Loading & inspecting data",
    difficulty: "Beginner",
    short: "Get data in from files or databases, then quickly understand its shape, types and gaps.",
    definition: "The first step of any analysis: read data (CSV, Excel, JSON, SQL) into a DataFrame, then inspect its size, column types, sample rows and summary statistics before doing anything else.",
    why: "You can't trust an analysis if you don't know what you loaded. A quick inspection reveals wrong types, missing values and surprises early, before they corrupt downstream work.",
    problem: "A column of prices loaded as text, or a date parsed as a string, silently breaks every calculation after it. Inspection catches these in the first minute.",
    howItWorks: "`read_csv` (and friends) parse a file into a DataFrame, inferring types. Then `head()` shows sample rows, `shape` gives dimensions, `info()` lists columns, types and non-null counts, and `describe()` summarizes numeric columns (count, mean, min, max, quartiles).",
    example: "Given a new customer export, an analyst runs head/info/describe and immediately spots that 'signup_date' is text and 'age' has 300 missing values — fixing the plan before modelling starts.",
    code: "import pandas as pd\ndf = pd.read_csv('customers.csv')\nprint(df.shape)      # (10000, 8)\ndf.info()            # columns, dtypes, non-null counts\nprint(df.describe()) # summary stats for numeric columns",
    engineering: "This is your data's 'health check' and schema discovery step — the equivalent of inspecting an API response or DB schema before you write code against it. Automate it into every pipeline as a sanity gate.",
    whenToUse: [
      "The very first thing you do with any new dataset",
      "After every load in a pipeline as a validation checkpoint"
    ],
    whenNotToUse: [
      "As a substitute for deeper EDA — inspection is the quick first pass"
    ],
    limitations: [
      "Type inference can guess wrong on messy files",
      "describe() only covers numeric columns by default"
    ],
    keyTakeaway: "Always look before you leap: head/shape/info/describe reveal types, size and missing values so problems surface immediately.",
    related: ["pandas-dataframe", "pandas-cleaning", "data-science-workflow"],
    keywords: ["read_csv", "load", "inspect", "head", "info", "describe", "import data"],
    viz: null
  },
  {
    id: "pandas-cleaning",
    category: "pandas",
    title: "Data cleaning",
    difficulty: "Intermediate",
    short: "Handle missing values, wrong types, duplicates and outliers so the data can be trusted.",
    definition: "The process of detecting and fixing problems in raw data: missing values, incorrect data types, duplicate rows, inconsistent categories and outliers — turning messy input into a reliable table.",
    why: "Models and statistics assume clean, consistent data. Garbage in, garbage out: a single mishandled missing value or duplicate can bias results or crash training. This is where most project time goes.",
    problem: "Real exports have blank cells, 'N/A' strings, dates as text, duplicate records from a bad join, and typos like 'USA' vs 'U.S.A.'. Each silently distorts analysis until cleaned.",
    howItWorks: "Detect missing with `isna().sum()`, then decide per column: drop rows, or fill (impute) with a mean/median/mode or a sentinel. Fix types with `astype`/`to_datetime`. Remove duplicates with `drop_duplicates`. Standardize categories by mapping variants to one label.",
    example: "Cleaning a customer table: fill missing ages with the median age, convert 'signup_date' from text to real dates, drop 1,200 duplicate rows from a double-import, and unify 'US'/'USA'/'United States' into one value.",
    code: "import pandas as pd\ndf = pd.read_csv('customers.csv')\ndf['age'] = df['age'].fillna(df['age'].median())\ndf['signup_date'] = pd.to_datetime(df['signup_date'])\ndf = df.drop_duplicates()\ndf['country'] = df['country'].replace({'USA': 'US', 'United States': 'US'})",
    engineering: "Cleaning is input validation and normalization for data. In production, encode these rules as a repeatable, tested transformation step — never hand-edit data — so every new batch is cleaned identically.",
    whenToUse: [
      "After loading, before any analysis or modelling",
      "As a fixed, versioned step in every data pipeline"
    ],
    whenNotToUse: [
      "Blindly dropping all missing rows when the missingness itself is informative"
    ],
    limitations: [
      "Imputation invents values and can bias results if done carelessly",
      "There's no single 'correct' way — choices depend on the problem"
    ],
    keyTakeaway: "Most of data science is cleaning: handle missing values, types, duplicates and inconsistent categories deliberately, and encode the rules so they repeat.",
    related: ["pandas-loading", "pandas-transform", "feature-engineering", "data-science-workflow"],
    keywords: ["cleaning", "missing values", "imputation", "duplicates", "fillna", "dropna", "outliers"],
    viz: null
  },
  {
    id: "pandas-transform",
    category: "pandas",
    title: "Transformation & EDA",
    difficulty: "Intermediate",
    short: "Reshape, group and summarize data to discover patterns before modelling.",
    definition: "Transformation reshapes data (filtering, grouping, joining, pivoting, deriving columns). Exploratory Data Analysis (EDA) uses these operations plus plots to understand distributions, relationships and anomalies before building models.",
    why: "You must understand data before you model it. EDA reveals which features matter, what's skewed, what correlates, and what's suspicious — decisions that shape everything downstream.",
    problem: "Jumping straight to a model on unexplored data leads to wasted effort on useless features or being fooled by an outlier. Grouping and summarizing surfaces the real structure first.",
    howItWorks: "Core moves: filter with boolean masks, derive new columns from existing ones, `groupby` + aggregate to summarize by category, `merge` to join tables, and `pivot_table` to cross-tabulate. Pair each with a quick plot to see distributions and relationships.",
    example: "Investigating churn: group customers by plan and compute churn rate per plan, derive 'tenure_months', and cross-tabulate churn by region. The EDA shows month-to-month contracts churn far more — a key modelling insight.",
    code: "import pandas as pd\ndf = pd.read_csv('customers.csv')\ndf['tenure_years'] = df['tenure_months'] / 12\nchurn_by_plan = df.groupby('plan')['churned'].mean()\nprint(churn_by_plan.sort_values(ascending=False))",
    engineering: "groupby/merge/pivot are the direct analogues of SQL GROUP BY, JOIN and crosstab. EDA is the discovery phase — like exploring a new API or database before writing the feature that depends on it.",
    whenToUse: [
      "After cleaning, to understand the data and guide feature choices",
      "Whenever you need summaries, joins, or reshaping"
    ],
    whenNotToUse: [
      "As an endless rabbit hole — EDA should inform decisions, then stop"
    ],
    limitations: [
      "Easy to see patterns that are just noise; confirm with proper validation",
      "Aggregations can hide within-group variation (Simpson's paradox)"
    ],
    keyTakeaway: "Reshape and summarize (group, join, pivot) plus quick plots to understand the data before modelling — EDA decisions shape the whole project.",
    related: ["pandas-cleaning", "correlation", "feature-engineering", "matplotlib"],
    keywords: ["eda", "groupby", "merge", "join", "pivot", "transform", "exploratory"],
    viz: null
  }
];
