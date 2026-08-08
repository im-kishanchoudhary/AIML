window.KB = window.KB || {};
window.KB.numpy = [
  {
    id: "numpy-ndarray",
    category: "numpy",
    title: "NumPy arrays (ndarray)",
    difficulty: "Beginner",
    short: "The fast, fixed-type numeric array that every data library is built on.",
    definition: "NumPy's ndarray is an N-dimensional array holding elements of a single type in one contiguous block of memory. It is the foundational data structure for numerical computing in Python.",
    why: "A Python list of a million numbers is slow and memory-hungry because each element is a full Python object. An ndarray stores raw numbers packed together, so math on it runs in optimized C — often 10–100× faster.",
    problem: "Doing arithmetic over large numeric collections with Python loops is painfully slow. ndarray lets you operate on the whole array at once (vectorization), pushing the loop into compiled code.",
    howItWorks: "Because all elements share a type and sit contiguously, NumPy can apply an operation to the entire array in one compiled pass — no per-element Python overhead. Arrays carry a shape (e.g. 3×4) and support slicing across any dimension.",
    example: "Scaling sensor readings: convert 10 million Celsius values to Fahrenheit with one expression `c * 9/5 + 32`. NumPy computes it in milliseconds; a Python loop would take seconds.",
    code: "import numpy as np\nc = np.array([0, 20, 37, 100])\nf = c * 9/5 + 32          # applied to the whole array\nprint(f)                  # [ 32.  68.  98.6 212.]\nprint(f.mean(), f.shape)  # 102.65 (4,)",
    engineering: "An ndarray is like a typed, fixed-size buffer (think a C array or a typed array) with rich math attached. It is the in-memory format that Pandas columns, images, and ML tensors all use underneath.",
    whenToUse: [
      "Numerical computation on large arrays or matrices",
      "Anything performance-sensitive that Pandas doesn't already cover",
      "Feeding numeric features into ML libraries"
    ],
    whenNotToUse: [
      "Mixed-type tabular data with labels — use Pandas",
      "Small, irregular collections — plain lists are simpler"
    ],
    limitations: [
      "Single fixed dtype per array — no mixing text and numbers",
      "Size is fixed at creation; growing means reallocating"
    ],
    keyTakeaway: "ndarray = one contiguous block of same-type numbers, so whole-array math runs in fast compiled code. It underlies Pandas, images and ML tensors.",
    related: ["numpy-vectorization", "pandas-dataframe", "python-why"],
    keywords: ["numpy", "ndarray", "array", "vector", "matrix", "dtype", "shape"],
    viz: null
  },
  {
    id: "numpy-vectorization",
    category: "numpy",
    title: "Vectorization & broadcasting",
    difficulty: "Intermediate",
    short: "Replace explicit loops with whole-array operations, and let arrays of different shapes combine automatically.",
    definition: "Vectorization means expressing a computation as operations on entire arrays instead of element-by-element loops. Broadcasting is NumPy's rule for combining arrays of different shapes by virtually stretching the smaller one to match.",
    why: "Vectorized code is both faster (the loop runs in C) and shorter and clearer. Broadcasting removes the need to manually tile or reshape data just to make shapes line up.",
    problem: "Standardizing features means subtracting each column's mean and dividing by its standard deviation. Written as loops it's verbose and slow; with broadcasting it's a single expression over the whole matrix.",
    howItWorks: "Vectorization: `a + b` adds arrays elementwise in compiled code. Broadcasting: when shapes differ, NumPy compares dimensions from the right; a dimension of size 1 (or missing) is stretched to match. So a (1000×5) matrix minus a (5,) row vector subtracts that row from every one of the 1000 rows.",
    example: "Feature scaling a dataset of 1000 customers × 5 features: `(X - X.mean(axis=0)) / X.std(axis=0)`. The per-column mean and std are (5,) vectors that broadcast across all 1000 rows.",
    code: "import numpy as np\nX = np.random.rand(1000, 5)\nX_scaled = (X - X.mean(axis=0)) / X.std(axis=0)\nprint(X_scaled.mean(axis=0).round(3))  # ~[0 0 0 0 0]",
    engineering: "Think of vectorization as SIMD-style batch processing you get for free. The rule of thumb: if you're writing a for-loop over array elements in Python, there is usually a vectorized one-liner that's faster and clearer.",
    whenToUse: [
      "Any elementwise math over arrays, especially feature scaling and transforms",
      "Applying per-column or per-row statistics across a matrix"
    ],
    whenNotToUse: [
      "Genuinely sequential logic where each step depends on the last",
      "When broadcasting rules make the code harder to read than an explicit loop"
    ],
    limitations: [
      "Broadcasting mistakes create silently wrong shapes rather than errors",
      "Very large temporary arrays can blow memory"
    ],
    keyTakeaway: "Prefer whole-array expressions over loops; broadcasting lets arrays of compatible shapes combine without manual tiling. This is the heart of fast NumPy.",
    related: ["numpy-ndarray", "feature-engineering", "standardization"],
    keywords: ["vectorization", "broadcasting", "elementwise", "simd", "loops", "reshape", "axis"],
    viz: null
  }
];
