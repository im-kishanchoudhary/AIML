window.KB = window.KB || {};
window.KB.python = [
  {
    id: "python-why",
    category: "python",
    title: "Why Python for data science",
    difficulty: "Beginner",
    short: "The glue language of data work — readable, batteries-included, with an unmatched library ecosystem.",
    definition: "Python is a high-level, general-purpose programming language that has become the default for data science because of its readable syntax and a mature ecosystem of numerical libraries (NumPy, Pandas, scikit-learn, PyTorch).",
    why: "The bottleneck in data work is human thinking, not raw execution speed. Python's clarity lets you express an analysis quickly, and its C-backed libraries do the heavy number-crunching fast underneath.",
    problem: "Doing statistics or ML in a low-level language means writing hundreds of lines for what should be one. Python's libraries turn 'train a model' into three lines while staying fast where it counts.",
    howItWorks: "Pure Python loops are slow, so the ecosystem pushes the actual computation into compiled libraries: NumPy for arrays, Pandas for tables, scikit-learn for models. You write high-level Python that orchestrates these fast building blocks.",
    example: "Loading a million-row CSV, filtering, grouping and averaging it takes a handful of Pandas lines and runs in a fraction of a second — the work happens in optimized C, not in a Python loop.",
    code: "import pandas as pd\ndf = pd.read_csv('sales.csv')\nmonthly = df.groupby('month')['revenue'].mean()\nprint(monthly)",
    engineering: "For a software engineer, Python is a familiar imperative language; the shift is learning to think in vectorized library operations instead of hand-written loops. Same language, new idioms.",
    whenToUse: [
      "Data analysis, ML, prototyping, automation and glue code",
      "Any task where a rich library already exists"
    ],
    whenNotToUse: [
      "Ultra-low-latency systems or tight embedded constraints",
      "CPU-bound pure-Python loops (push them into NumPy or another language)"
    ],
    limitations: [
      "Slow for hand-written loops; relies on C libraries for speed",
      "The Global Interpreter Lock limits pure-Python threading"
    ],
    keyTakeaway: "Python wins on readability and library ecosystem; keep the heavy math inside NumPy/Pandas and it's fast enough for almost everything.",
    related: ["python-data-structures", "numpy-ndarray", "pandas-dataframe"],
    keywords: ["python", "language", "why python", "ecosystem", "libraries", "readable"],
    viz: null
  },
  {
    id: "python-data-structures",
    category: "python",
    title: "Core Python data structures",
    difficulty: "Beginner",
    short: "Lists, dicts, tuples and sets — the everyday containers you reach for before NumPy and Pandas.",
    definition: "Python's built-in containers: list (ordered, mutable sequence), dict (key→value map), tuple (ordered, immutable) and set (unordered unique items). They hold and organize data before it goes into arrays or DataFrames.",
    why: "Almost every data task starts with plain Python objects — a list of records, a dict of counts, a set of seen IDs. Knowing which container fits keeps code clear and fast.",
    problem: "Using the wrong structure — say a list where you need fast membership tests — makes code slow and clumsy. Picking the right one makes the logic obvious and efficient.",
    howItWorks: "Lists keep order and allow duplicates; index and append in O(1). Dicts map keys to values with O(1) lookup — ideal for counting and grouping. Tuples are fixed records you don't change. Sets give O(1) membership and automatic de-duplication.",
    example: "Counting product categories: a dict maps each category to its count. Tracking which user IDs you've already emailed: a set gives instant 'have I seen this?' checks even over millions of IDs.",
    code: "orders = [{'id': 1, 'cat': 'books'}, {'id': 2, 'cat': 'toys'}, {'id': 3, 'cat': 'books'}]\ncounts = {}\nfor o in orders:\n    counts[o['cat']] = counts.get(o['cat'], 0) + 1\nprint(counts)  # {'books': 2, 'toys': 1}",
    engineering: "These map directly to concepts you know: list ≈ array/ArrayList, dict ≈ hash map, set ≈ hash set, tuple ≈ immutable record. Pandas and NumPy build on top of them.",
    whenToUse: [
      "Small in-memory data, preprocessing, and building inputs for libraries",
      "Counting, grouping and de-duplication before loading into Pandas"
    ],
    whenNotToUse: [
      "Large numerical datasets — use NumPy arrays for speed and memory",
      "Tabular analysis — use a Pandas DataFrame"
    ],
    limitations: [
      "Pure-Python containers are memory-heavy and slow for big numeric data",
      "No built-in vectorized math — that's what NumPy adds"
    ],
    keyTakeaway: "Match the container to the job: list for order, dict for lookup, set for membership, tuple for fixed records — then hand large numeric data to NumPy/Pandas.",
    related: ["python-why", "numpy-ndarray", "pandas-dataframe"],
    keywords: ["list", "dict", "dictionary", "tuple", "set", "data structures", "hash map"],
    viz: null
  }
];
