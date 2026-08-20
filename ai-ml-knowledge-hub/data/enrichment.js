/* ============================================================
   Phase 8 + 9 enrichment — FULL coverage (all 53 topics).
   Adds — per topic id — prerequisites, plain-words analogy,
   "what it actually does", an optional walkthrough, and a
   hands-on practical (runnable code, expected output, stretch).
   Merged onto topics at load by app.js.
   `unlocks` is computed automatically (reverse of prerequisites).
   Plain, hand-editable data — every topic follows this format.
   ============================================================ */
window.ENRICH = {
  "ml-fundamentals": {
    analogy: "Like training a new hire by showing them thousands of past cases instead of handing them a rulebook. Show a child enough photos of cats and dogs and they learn the difference themselves — you never define 'cat'. Machine learning is exactly that: **learn the rule from examples, don't hand-write it.**",
    flow: {
      title: "How a model is built and used",
      stages: [
        { icon: "📊", label: "Collect examples", d: "Gather past cases where you already know the answer — the labelled training data." },
        { icon: "✍️", label: "Train", d: "The algorithm finds the pattern that maps inputs to the known answers. This is `model.fit()`." },
        { icon: "📝", label: "Evaluate", d: "Check it on held-out examples it never saw while training — the honest score." },
        { icon: "⚡", label: "Predict", d: "Feed it a brand-new case and it returns an answer in milliseconds." },
        { icon: "🔁", label: "Improve", d: "Add data or better features and repeat — models get better with feedback." }
      ]
    },
    prerequisites: ["python-why", "pandas-dataframe"],
    plainWords: "Instead of writing the rules yourself, you show the computer lots of examples and it works out the rules — like learning to recognise spam by seeing thousands of spam and non-spam emails, not by being told 'block anything with the word FREE'.",
    actuallyDoes: "Takes a table of past examples (features + known answers), finds the pattern that maps features → answer, and saves it as a reusable function you can call on new rows.",
    practical: {
      goal: "Train your very first model in 6 lines and make a prediction.",
      steps: [
        "Run the code — it trains a classifier on the built-in iris flowers dataset.",
        "Read the accuracy it prints.",
        "Change test_size to 0.5 and rerun — notice accuracy shift as the model sees less training data."
      ],
      code: "from sklearn.datasets import load_iris\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.ensemble import RandomForestClassifier\n\nX, y = load_iris(return_X_y=True)\nX_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2, random_state=0)\nmodel = RandomForestClassifier().fit(X_tr, y_tr)\nprint('accuracy:', model.score(X_te, y_te))",
      expected: "accuracy: around 0.90–1.00 — the model classifies most unseen flowers correctly.",
      stretch: "Swap RandomForestClassifier for LogisticRegression — the rest of the code is identical (that's scikit-learn's uniform API). Compare accuracy."
    }
  },
  "standardization": {
    analogy: "Like **converting every price into one currency** before comparing. A €5 coffee and a ¥600 coffee only compare fairly once they're on the same scale. Features measured in dollars, years and counts need the same treatment — otherwise the biggest-numbered column wins by accident, not because it matters most.",
    prerequisites: ["variance-std", "numpy-vectorization"],
    plainWords: "Different features use different rulers — dollars vs years vs counts. Standardizing puts them all on the same ruler so no feature wins just because its numbers happen to be bigger.",
    actuallyDoes: "Subtracts each column's mean and divides by its standard deviation, so every feature ends up centred at 0 with a spread of 1.",
    practical: {
      goal: "See why scaling matters by standardizing features and checking the result.",
      steps: [
        "Run it — X has one tiny-range column and one huge-range column.",
        "Look at the means (~0) and stds (~1) after scaling.",
        "Comment out the scaler and feed raw X to KMeans in the k-means practical — the huge column dominates the clusters."
      ],
      code: "import numpy as np\nfrom sklearn.preprocessing import StandardScaler\n\nX = np.array([[1, 50000], [2, 60000], [3, 55000], [4, 90000]], dtype=float)\nXs = StandardScaler().fit_transform(X)\nprint('means:', Xs.mean(axis=0).round(2))   # ~[0 0]\nprint('stds :', Xs.std(axis=0).round(2))    # ~[1 1]",
      expected: "means: [ 0. 0. ]  and  stds: [1. 1.] — both columns now share the same scale.",
      stretch: "Try MinMaxScaler instead and print the min/max — it maps every column into 0–1 rather than mean-0/std-1."
    }
  },
  "regression": {
    analogy: "Like **drawing the single best trend line through a cloud of dots** and reading it off — 'bigger house ≈ higher price', made precise. Once you have the line, you can estimate the price of a house you've never seen by finding where it lands on it.",
    prerequisites: ["ml-fundamentals", "correlation"],
    plainWords: "You're drawing the single straight line that best passes through a cloud of dots, then using that line to guess the y for any new x — like eyeballing 'bigger house ≈ higher price' but done precisely.",
    actuallyDoes: "Finds the slope and intercept that make the line's total squared vertical distance to all the points as small as possible, then predicts y = slope·x + intercept for new inputs.",
    walkthrough: [
      { t: "1. Start with data", d: "Past house sales: each row has an area (x) and a sold price (y)." },
      { t: "2. Assume a line", d: "price ≈ slope · area + base. The model doesn't know slope/base yet." },
      { t: "3. Fit", d: "It tries lines and keeps the one with the smallest total squared error (gap between line and real prices)." },
      { t: "4. Predict", d: "For a new 120 m² listing, plug 120 into the fitted line to get an estimated price." }
    ],
    practical: {
      goal: "Fit a line to real-ish data and predict a new value.",
      steps: [
        "Run it — it fits price ≈ slope·area + base on five sales.",
        "Read the printed slope (price per m²) and the prediction for 120 m².",
        "Add a wildly-priced outlier to the data and rerun — watch the line get pulled toward it."
      ],
      code: "import numpy as np\nfrom sklearn.linear_model import LinearRegression\n\narea = np.array([50, 70, 90, 110, 130]).reshape(-1, 1)\nprice = np.array([150, 200, 250, 300, 360])   # in k\nm = LinearRegression().fit(area, price)\nprint('price per m2:', round(m.coef_[0], 2), 'base:', round(m.intercept_, 1))\nprint('predict 120 m2:', round(m.predict([[120]])[0], 1), 'k')",
      expected: "price per m2 ≈ 2.6, base ≈ 17, predict 120 m² ≈ 330k — a straight-line estimate.",
      stretch: "Add a second feature (e.g. number of rooms) as another column in area — LinearRegression handles multiple features with no other change."
    }
  },
  "clustering": {
    analogy: "Like **seating strangers at a wedding by who seems similar** — no name cards, no known groups, you just cluster people who resemble each other. It finds natural groups in *unlabelled* data (customer segments, say) without being told the answers in advance.",
    flow: {
      title: "How k-means finds groups",
      stages: [
        { icon: "🎯", label: "Pick k centres", d: "Choose how many groups (k) and drop k starting points at random." },
        { icon: "🧲", label: "Assign", d: "Each data point joins its nearest centre — forming k tentative clusters." },
        { icon: "📍", label: "Move centres", d: "Recompute each centre as the average position of its members." },
        { icon: "🔁", label: "Repeat", d: "Reassign and re-average until the groups stop changing — the clusters have settled." }
      ]
    },
    prerequisites: ["ml-fundamentals", "standardization"],
    plainWords: "Nobody labelled the data, so the computer sorts it into piles where things in a pile are near each other — like tipping a mixed bag of Lego onto a table and grouping by colour without being told the colours.",
    actuallyDoes: "Places K centre points, assigns every data point to its nearest centre, moves each centre to the middle of its assigned points, and repeats until the piles stop changing.",
    practical: {
      goal: "Cluster customers into segments with no labels.",
      steps: [
        "Run it — it groups fake customers by (spend, visits) into 3 clusters.",
        "Look at labels: each customer now has a cluster id.",
        "Change n_clusters to 2 or 4 and rerun — see how the segments merge or split."
      ],
      code: "import numpy as np\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.cluster import KMeans\n\nX = np.array([[20,2],[25,3],[200,20],[210,22],[5,1],[8,1]], dtype=float)\nXs = StandardScaler().fit_transform(X)          # scale first!\nlabels = KMeans(n_clusters=3, n_init=10, random_state=0).fit_predict(Xs)\nprint('cluster per customer:', labels)",
      expected: "Something like [0 0 1 1 2 2] — low, high and mid spenders land in separate clusters.",
      stretch: "Remove the StandardScaler line and rerun — with raw values, 'spend' dwarfs 'visits' and the clusters are decided almost entirely by spend."
    }
  },
  "tokens-embeddings": {
    analogy: "Like giving every word a **GPS coordinate in 'meaning space'**, so related words sit close together — 'king' near 'queen', 'Paris' near 'France'. The model can then do arithmetic with meaning instead of matching exact letters, which is why search finds 'refund' even when you typed 'money back'.",
    prerequisites: ["generative-ai-llm"],
    plainWords: "An embedding is a way of giving every word or sentence a set of coordinates, so that things which mean similar things end up near each other on a map — 'car' and 'automobile' become neighbours even though they share no letters.",
    actuallyDoes: "Runs text through a model that outputs a fixed-length list of numbers (a vector); the closeness of two vectors measures how similar the meanings are.",
    walkthrough: [
      { t: "1. Tokenise", d: "Split text into tokens (word-pieces) — this is also what LLM cost/limits are counted in." },
      { t: "2. Embed", d: "A model turns the text into a vector of numbers capturing its meaning." },
      { t: "3. Compare", d: "Cosine similarity between two vectors ≈ 1 means same meaning, ≈ 0 means unrelated." },
      { t: "4. Use", d: "Store vectors once; later, find the nearest ones to a query — that's semantic search and the retrieval half of RAG." }
    ],
    practical: {
      goal: "Feel semantic similarity without any AI account — using tiny hand-made vectors.",
      steps: [
        "Run it — three sentences are given toy 3-number 'embeddings'.",
        "See that the two password-related sentences score highly similar, the unrelated one doesn't.",
        "In real code you'd get these vectors from an embedding model/API instead of by hand."
      ],
      code: "import numpy as np\ndef cos(a, b): return a @ b / (np.linalg.norm(a) * np.linalg.norm(b))\n\nreset_pw = np.array([0.9, 0.1, 0.0])   # 'how do I reset my password'\nchange_pw = np.array([0.8, 0.2, 0.0])  # 'steps to change my account password'\nweather   = np.array([0.0, 0.1, 0.9])  # 'what is the weather today'\nprint('reset vs change :', round(cos(reset_pw, change_pw), 2))   # high\nprint('reset vs weather:', round(cos(reset_pw, weather), 2))     # low",
      expected: "reset vs change ≈ 0.99 (same meaning), reset vs weather ≈ 0.05 (unrelated).",
      stretch: "Add a fourth sentence's vector and find which existing sentence it's closest to — that's a 1-line recommender / search."
    }
  },
  "rag": {
    analogy: "Like an **open-book exam** instead of a memory test. A plain LLM answers from memory and can confidently bluff. RAG lets it look up the relevant page first and answer from what it just read — so it stays current and can **cite its source**, without re-memorising the whole book.",
    flow: {
      title: "The RAG loop",
      stages: [
        { icon: "❓", label: "Question", d: "The user asks something — often about private or recent data the model never trained on." },
        { icon: "🔎", label: "Retrieve", d: "Embed the question and pull the most relevant chunks from your document store." },
        { icon: "➕", label: "Augment", d: "Paste those chunks into the prompt as context, with an instruction to answer **only** from them." },
        { icon: "🗣️", label: "Generate", d: "The LLM writes the answer grounded in the retrieved text — and can point to where it came from." }
      ]
    },
    prerequisites: ["generative-ai-llm", "tokens-embeddings", "vector-search"],
    plainWords: "A plain LLM answers from memory and can make things up. RAG is like giving it an open-book exam: before it answers, you hand it the exact pages from your own documents, and it answers from those — so it's grounded in your real, current information.",
    actuallyDoes: "Embeds the user's question, searches your document vectors for the most relevant chunks, pastes those chunks into the prompt as context, and asks the LLM to answer using only that context.",
    walkthrough: [
      { t: "1. Prep (offline)", d: "Split your docs into chunks, embed each chunk, store the vectors in a vector database." },
      { t: "2. Ask", d: "User asks a question; embed the question into the same vector space." },
      { t: "3. Retrieve", d: "Vector search returns the top-k chunks whose meaning is closest to the question." },
      { t: "4. Augment", d: "Insert those chunks into the prompt: 'Answer using ONLY this context: …'." },
      { t: "5. Generate", d: "The LLM writes an answer grounded in the retrieved chunks — often citing the source." }
    ],
    practical: {
      goal: "Build the whole RAG loop with a fake retriever + LLM, so the flow is crystal clear.",
      steps: [
        "Run it — a tiny 'knowledge base' of 3 policy snippets is searched by keyword (stand-in for vector search).",
        "The best-matching snippet is pasted into a prompt and a fake LLM 'answers' from it.",
        "Swap the question string and rerun — the retrieved context and answer change accordingly."
      ],
      code: "docs = {\n  'refunds': 'Refunds are available within 30 days of purchase.',\n  'shipping': 'Orders ship in 2 business days; delivery in 5.',\n  'leave': 'Employees get 20 days of paid annual leave.',\n}\ndef retrieve(q):                       # stand-in for vector search\n    return max(docs.values(), key=lambda d: len(set(q.lower().split()) & set(d.lower().split())))\ndef fake_llm(prompt): return 'ANSWER (from context): ' + prompt.split('CONTEXT:')[1].strip()\n\nquestion = 'what is the refund window?'\ncontext = retrieve(question)\nprompt = f'Answer using ONLY this.\\nCONTEXT: {context}'\nprint(fake_llm(prompt))",
      expected: "ANSWER (from context): Refunds are available within 30 days of purchase. — grounded in the retrieved snippet, not invented.",
      stretch: "Replace retrieve() with the embedding-similarity idea from the Tokens & embeddings practical, and replace fake_llm() with a real LLM API call — that's a production RAG chatbot in miniature."
    }
  },

  /* ---------- Foundations ---------- */
  "ds-ai-ml-overview": {
    plainWords: "AI is the big umbrella (machines doing smart things), Machine Learning is one way to get there (learning patterns from data instead of hand-coded rules), and Data Science is the wider craft of turning data into decisions. GenAI is the newest ML branch that creates text and images.",
    actuallyDoes: "Frames the field so you can place any task correctly: rules vs learned patterns, prediction vs generation — which decides the tools you reach for.",
    practical: {
      goal: "Sort real tasks into the right bucket so the vocabulary sticks.",
      steps: [
        "Run it — each task is tagged as rule-based, classic ML, or generative AI.",
        "Read the reasoning printed beside each.",
        "Add your own task string to the list and give it a label — does it need learned patterns or fixed rules?"
      ],
      code: "tasks = {\n  'Add VAT to a price': 'rules (just arithmetic)',\n  'Flag a transaction as fraud': 'classic ML (learn from labelled history)',\n  'Write a product description': 'generative AI (produce new text)',\n  'Group customers by behaviour': 'classic ML (unsupervised)',\n}\nfor t, kind in tasks.items():\n    print(f'{t:35s} -> {kind}')",
      expected: "Each task prints next to its category — arithmetic stays rules, pattern-finding is ML, producing content is GenAI.",
      stretch: "List three tasks from your own job and label each. Which are honestly ML, and which are really just if-statements dressed up?"
    }
  },
  "data-science-workflow": {
    prerequisites: ["ds-ai-ml-overview"],
    plainWords: "A project isn't 'train a model' — it's a loop: understand the question, get and clean data, explore it, model, evaluate, and ship. Most of the time goes into the boring middle, not the modelling.",
    actuallyDoes: "Gives you a repeatable checklist so you never skip framing the problem or validating the result — the two steps beginners most often drop.",
    practical: {
      goal: "Turn the workflow into a checklist you drive from code.",
      steps: [
        "Run it — the stages print in order with a one-line reminder each.",
        "Mark where you are on a real task by editing the `current` variable.",
        "Notice that 'define the question' and 'evaluate honestly' bookend everything."
      ],
      code: "stages = [\n  ('Frame',    'What decision does this inform? What is success?'),\n  ('Collect',  'Get the data; note its source and gaps.'),\n  ('Clean',    'Types, missing values, duplicates.'),\n  ('Explore',  'Plot and summarise before modelling.'),\n  ('Model',    'Start simple; a baseline first.'),\n  ('Evaluate', 'On unseen data, with the right metric.'),\n  ('Ship',     'Deploy, monitor, and iterate.'),\n]\ncurrent = 'Explore'\nfor i,(s,note) in enumerate(stages,1):\n    mark = '<-- you are here' if s==current else ''\n    print(f'{i}. {s:9s} {note} {mark}')",
      expected: "A numbered 7-step pipeline prints, with an arrow on the stage you set.",
      stretch: "Add a 'Monitor' loop-back arrow from Ship to Collect — real projects never stop at deploy."
    }
  },
  "anaconda": {
    plainWords: "Anaconda bundles Python plus the data-science libraries and, crucially, lets you make separate 'environments' — sealed rooms so Project A's library versions never break Project B.",
    actuallyDoes: "Manages isolated per-project sets of packages and Python versions, so dependencies don't collide and a project stays reproducible.",
    practical: {
      goal: "Inspect the environment your code is actually running in.",
      steps: [
        "Run it — it prints the Python version and where it lives.",
        "In a terminal, the same idea is `conda create -n myproj python=3.11` then `conda activate myproj`.",
        "Check which packages are present with the pip freeze idea below."
      ],
      code: "import sys, platform\nprint('python :', platform.python_version())\nprint('runs at:', sys.executable)   # the env's path — tells you WHICH env\n# list installed packages (first 5):\nimport pkg_resources\nfor p in list(pkg_resources.working_set)[:5]:\n    print(' -', p.project_name, p.version)",
      expected: "A Python version, the interpreter path (its env), and a few installed packages.",
      stretch: "Create a fresh env with `conda create -n test python=3.11`, activate it, run this again, and watch the interpreter path change."
    }
  },
  "jupyter": {
    prerequisites: ["anaconda"],
    plainWords: "A Jupyter notebook is a document where code, its output, and your notes live together in cells you run one at a time — perfect for exploring data and keeping a visible trail of what you tried.",
    actuallyDoes: "Runs a persistent Python kernel; each cell mutates shared state and shows its result inline, so you build up an analysis incrementally without re-running everything.",
    practical: {
      goal: "Feel how notebook state carries across cells.",
      steps: [
        "Imagine each numbered block below is a separate cell run in order.",
        "Run it here as one script — the point is that `total` persists between 'cells'.",
        "In a real notebook, re-running cell 2 alone would keep adding to `total` — the classic gotcha."
      ],
      code: "# cell 1\ntotal = 0\n# cell 2 (run me a few times in a notebook!)\ntotal += 10\n# cell 3\nprint('total is', total)   # depends on how many times cell 2 ran",
      expected: "Prints `total is 10` here — but in a notebook the value grows each time you re-run cell 2. That shared state is the mental model.",
      stretch: "In Jupyter, press Shift+Enter to run a cell, and use 'Restart & Run All' when state gets confusing — it proves your notebook runs top-to-bottom cleanly."
    }
  },
  "colab": {
    plainWords: "Google Colab is a Jupyter notebook that runs in the browser on Google's machines — no install, and free access to GPUs for heavier deep-learning work.",
    actuallyDoes: "Hosts your notebook on a remote runtime (CPU/GPU/TPU) you connect to from the browser; files and sessions are temporary unless you mount Google Drive.",
    practical: {
      goal: "Check what hardware a runtime gives you.",
      steps: [
        "Run it — it reports whether a GPU is available.",
        "In Colab: Runtime → Change runtime type → GPU, then rerun to flip the result.",
        "Remember the runtime resets — anything not saved to Drive disappears."
      ],
      code: "# In Colab this detects the free GPU:\ntry:\n    import torch\n    print('GPU available:', torch.cuda.is_available())\nexcept ImportError:\n    import shutil\n    print('no torch here; on Colab run: !nvidia-smi to see the GPU')",
      expected: "On a Colab GPU runtime this prints `GPU available: True`; on plain CPU it prints False.",
      stretch: "Mount Drive with `from google.colab import drive; drive.mount('/content/drive')` so your work survives a runtime reset."
    }
  },
  "jupyter-colab-tips": {
    prerequisites: ["jupyter"],
    plainWords: "A handful of keystrokes and magics turn the notebook from clunky to fast — run-and-advance, time a cell, list variables, get help — the muscle memory pros rely on.",
    actuallyDoes: "Uses IPython 'magic' commands and keyboard shortcuts that wrap common tasks (timing, shell access, introspection) into one-liners.",
    practical: {
      goal: "Try the magics that pay off every single day.",
      steps: [
        "Run it — `%timeit`-style timing is shown with plain code here.",
        "In a notebook, prefix a line with %timeit to benchmark it, and %who to list your variables.",
        "Use `?` after any name (e.g. `sum?`) to pull up its docs instantly."
      ],
      code: "import time\ndef timeit(fn, n=100000):\n    t=time.perf_counter()\n    for _ in range(n): fn()\n    return (time.perf_counter()-t)/n\nprint('per call:', round(timeit(lambda: sum(range(100)))*1e6, 3), 'microsec')\n# notebook equivalents: %timeit sum(range(100))   |   %who   |   sum?",
      expected: "A tiny per-call timing prints — the same insight %timeit gives you in one word.",
      stretch: "In Jupyter, learn three shortcuts: Shift+Enter (run), Esc then A/B (insert cell above/below), Esc then M (make markdown)."
    }
  },

  /* ---------- Python ---------- */
  "python-why": {
    plainWords: "Python won data science because it reads almost like English and has a giant free toolbox (NumPy, pandas, scikit-learn) that does the heavy lifting — so you spend time on the problem, not the plumbing.",
    actuallyDoes: "Acts as the glue language: concise syntax on top, fast C/Fortran libraries underneath, so you get readable code and real speed together.",
    practical: {
      goal: "Feel the readability that made Python the default.",
      steps: [
        "Run it — the same task (sum of squares of evens) in a clear one-liner.",
        "Read it aloud; it nearly matches the English description.",
        "Change the range or the condition and rerun."
      ],
      code: "nums = range(1, 11)\nresult = sum(n**2 for n in nums if n % 2 == 0)\nprint('sum of squares of evens 1..10 =', result)   # 4+16+36+64+100",
      expected: "sum of squares of evens 1..10 = 220 — expressed in a single readable line.",
      stretch: "Write the same logic with an explicit for-loop and an accumulator. Which would you rather read in six months?"
    }
  },
  "python-data-structures": {
    prerequisites: ["python-why"],
    plainWords: "Lists (ordered, changeable), tuples (ordered, fixed), dicts (labelled lookups) and sets (unique items) are the four containers you'll use constantly — picking the right one makes code simpler and faster.",
    actuallyDoes: "Each structure trades off order, mutability and lookup speed; choosing correctly turns O(n) scans into O(1) lookups and prevents whole classes of bugs.",
    practical: {
      goal: "See why a dict/set beats a list for lookups.",
      steps: [
        "Run it — the same membership question answered by a list and a set.",
        "Note the dict giving instant labelled access.",
        "Add an item to each container and reprint."
      ],
      code: "prices = {'apple': 0.5, 'banana': 0.3, 'cherry': 2.0}  # dict: label -> value\nfruits = set(prices)                                    # unique keys\nprint('cherry price:', prices['cherry'])                # O(1) lookup\nprint('has banana? ', 'banana' in fruits)               # O(1) membership\nprint('sorted fruits:', sorted(fruits))",
      expected: "The cherry price, a True membership test, and an alphabetical list of fruits.",
      stretch: "Build a dict counting letters in 'mississippi' using `dict.get(c, 0) + 1`. This counting pattern shows up everywhere in data work."
    }
  },

  /* ---------- NumPy ---------- */
  "numpy-ndarray": {
    prerequisites: ["python-data-structures"],
    plainWords: "A NumPy array is like a Python list that's all one type and stored in a tight block of memory, so maths on millions of numbers runs at C speed instead of slow Python loops.",
    actuallyDoes: "Holds numbers in a contiguous typed buffer with a shape; operations run in compiled code over the whole buffer at once.",
    practical: {
      goal: "Create arrays and do maths on them without a loop.",
      steps: [
        "Run it — build an array, check its shape and dtype.",
        "Multiply the whole array by 2 in one expression.",
        "Slice a row and a column from the 2-D array."
      ],
      code: "import numpy as np\na = np.array([[1, 2, 3], [4, 5, 6]])\nprint('shape:', a.shape, ' dtype:', a.dtype)\nprint('doubled:\\n', a * 2)              # whole-array maths, no loop\nprint('column 1:', a[:, 1])             # -> [2 5]",
      expected: "shape (2, 3), an int dtype, every element doubled, and the middle column [2 5].",
      stretch: "Make `np.arange(12).reshape(3, 4)` and take its `.mean(axis=0)` vs `.mean(axis=1)` — feel what 'axis' means."
    }
  },
  "numpy-vectorization": {
    prerequisites: ["numpy-ndarray"],
    plainWords: "Vectorization means expressing a calculation over a whole array at once instead of looping element by element — shorter to write and often 10–100× faster. Broadcasting lets arrays of different shapes combine sensibly.",
    actuallyDoes: "Pushes the loop down into compiled C, and 'stretches' smaller arrays across larger ones (broadcasting) so you avoid explicit Python iteration.",
    practical: {
      goal: "Replace a Python loop with a vectorized expression and compare.",
      steps: [
        "Run it — both compute the same distances; the vectorized version is one line.",
        "See broadcasting subtract a per-column mean from every row.",
        "Increase n and feel the speed difference in a notebook with %timeit."
      ],
      code: "import numpy as np\nX = np.array([[2.,4.],[6.,8.],[10.,12.]])\n# center each column by subtracting its mean (broadcasting):\ncentered = X - X.mean(axis=0)\nprint(centered)\n# vectorized row norms, no loop:\nprint('row lengths:', np.sqrt((X**2).sum(axis=1)).round(2))",
      expected: "A mean-centered matrix (each column now sums to ~0) and the length of each row vector.",
      stretch: "Write the row-lengths with a for-loop, then `%timeit` both on a 100000×3 array — the vectorized one wins by a lot."
    }
  },

  /* ---------- Pandas ---------- */
  "pandas-dataframe": {
    prerequisites: ["numpy-ndarray"],
    plainWords: "A DataFrame is a spreadsheet in code: labelled columns, an index for rows, each column a NumPy array. A Series is a single column. It's the table every data project revolves around.",
    actuallyDoes: "Wraps typed columnar arrays with row/column labels and alignment, so selecting, filtering and combining tabular data becomes concise and safe.",
    practical: {
      goal: "Build a DataFrame and select from it.",
      steps: [
        "Run it — create a small table from a dict.",
        "Select a column, then filter rows by a condition.",
        "Add a computed column."
      ],
      code: "import pandas as pd\ndf = pd.DataFrame({\n  'name': ['Ana','Ben','Cara'],\n  'age':  [25, 41, 33],\n  'city': ['Paris','Lima','Cairo'],\n})\nprint(df[df.age > 30][['name','age']])   # filter + pick columns\ndf['is_senior'] = df.age >= 40\nprint(df)",
      expected: "The over-30 rows (Ben, Cara) then the full table with a new boolean `is_senior` column.",
      stretch: "Set the index with `df.set_index('name')` and fetch a row using `.loc['Ben']`."
    }
  },
  "pandas-loading": {
    prerequisites: ["pandas-dataframe"],
    plainWords: "Real data lives in CSVs, Excel and databases. `read_csv` pulls it in, and a few one-liners (`head`, `info`, `describe`) tell you instantly what you're dealing with before you touch it.",
    actuallyDoes: "Parses external files into a DataFrame, inferring types, then summarises shape, dtypes, missing counts and basic statistics.",
    practical: {
      goal: "Load data and run the standard first-look trio.",
      steps: [
        "Run it — a CSV is built in-memory from a string so it works offline.",
        "Read the shape, the dtypes, and the summary statistics.",
        "These three commands are the first thing you run on ANY new dataset."
      ],
      code: "import pandas as pd, io\ncsv = 'name,age,spend\\nAna,25,120\\nBen,41,340\\nCara,33,\\nDan,29,90'\ndf = pd.read_csv(io.StringIO(csv))\nprint('shape:', df.shape)\nprint(df.info())\nprint(df.describe())",
      expected: "A 4×3 shape, an info() listing that flags one missing `spend`, and describe() stats for the numeric columns.",
      stretch: "Point read_csv at a real file path or URL and run the same three lines — the workflow never changes."
    }
  },
  "pandas-cleaning": {
    prerequisites: ["pandas-loading"],
    plainWords: "Raw data is messy: blanks, duplicates, wrong types, stray whitespace. Cleaning is fixing those so the numbers you compute later actually mean something — the least glamorous, most important step.",
    actuallyDoes: "Detects and resolves missing values (drop/fill), removes duplicates, fixes dtypes and normalises text, producing a trustworthy table.",
    practical: {
      goal: "Handle missing values and duplicates on a dirty table.",
      steps: [
        "Run it — count missing values, then fill the numeric gap with the median.",
        "Drop an exact duplicate row.",
        "Compare shape before and after."
      ],
      code: "import pandas as pd, numpy as np\ndf = pd.DataFrame({'id':[1,2,2,3], 'spend':[100, np.nan, np.nan, 300]})\nprint('missing:\\n', df.isna().sum())\ndf['spend'] = df['spend'].fillna(df['spend'].median())\ndf = df.drop_duplicates(subset='id')\nprint(df)",
      expected: "A report of 2 missing spends, then a clean 3-row table with gaps filled by the median.",
      stretch: "Try `fillna(df['spend'].mean())` instead and see how a single big value pulls the fill higher than the median would."
    }
  },
  "pandas-transform": {
    prerequisites: ["pandas-cleaning"],
    plainWords: "Once clean, you reshape and summarise: group rows and aggregate them, make new columns, pivot. This is where a table starts answering questions ('average spend per city?').",
    actuallyDoes: "Applies split-apply-combine (groupby), vectorized column math and reshaping so you can compute summaries and features directly on the table.",
    practical: {
      goal: "Answer a question with a groupby aggregation.",
      steps: [
        "Run it — group customers by city and average their spend.",
        "Add a second aggregation (count) in the same call.",
        "Sort the result to find the top city."
      ],
      code: "import pandas as pd\ndf = pd.DataFrame({\n  'city': ['Paris','Lima','Paris','Lima','Paris'],\n  'spend': [120, 90, 200, 60, 150],\n})\nout = df.groupby('city')['spend'].agg(['mean','count','sum']).sort_values('mean', ascending=False)\nprint(out)",
      expected: "A per-city table showing Paris with the higher mean spend, plus counts and totals.",
      stretch: "Add a `revenue_share` column = each city's sum / grand total, and confirm the shares add to 1."
    }
  },

  /* ---------- Visualization ---------- */
  "matplotlib": {
    prerequisites: ["numpy-ndarray"],
    plainWords: "Matplotlib is Python's core plotting library — the thing that actually draws the line, bar and scatter charts. Most other plotting tools are built on top of it.",
    actuallyDoes: "Maps arrays of numbers to figures and axes you can style and export; the figure/axes objects give fine control over every element.",
    practical: {
      goal: "Draw and save a simple line chart.",
      steps: [
        "Run it — plot y = x² over a range.",
        "Add axis labels and a title (already included).",
        "In a notebook the chart shows inline; here it's saved to a file."
      ],
      code: "import numpy as np\nimport matplotlib\nmatplotlib.use('Agg')            # headless; in a notebook you can drop this\nimport matplotlib.pyplot as plt\nx = np.linspace(-3, 3, 100)\nplt.plot(x, x**2)\nplt.xlabel('x'); plt.ylabel('x squared'); plt.title('A parabola')\nplt.savefig('parabola.png'); print('saved parabola.png')",
      expected: "A file 'parabola.png' is written (in a notebook, a U-shaped curve appears inline).",
      stretch: "Add a second line `plt.plot(x, x**3)` and a `plt.legend(['x^2','x^3'])` to compare the two curves."
    }
  },
  "choosing-a-chart": {
    prerequisites: ["matplotlib"],
    plainWords: "The chart type should match the question: comparison → bars, trend over time → line, distribution → histogram, relationship → scatter. Pick wrong and you hide the story or mislead.",
    actuallyDoes: "Maps a data question to the encoding (position, length, angle) that human eyes read most accurately, so the reader's takeaway matches the data.",
    practical: {
      goal: "Match questions to chart types in code, then draw the right one.",
      steps: [
        "Run it — a lookup maps each question type to its best chart.",
        "It then draws a histogram, the right pick for 'what's the distribution?'.",
        "Swap in your own question and choose from the map."
      ],
      code: "import numpy as np, matplotlib\nmatplotlib.use('Agg'); import matplotlib.pyplot as plt\nchoose = {\n  'compare categories':'bar', 'trend over time':'line',\n  'distribution of one variable':'histogram', 'relationship of two':'scatter',\n}\nfor q,c in choose.items(): print(f'{q:32s} -> {c}')\nplt.hist(np.random.default_rng(0).normal(size=500), bins=20)\nplt.title('distribution -> histogram'); plt.savefig('dist.png'); print('saved dist.png')",
      expected: "The question→chart cheat-map prints, and a bell-shaped histogram is saved.",
      stretch: "Take a chart you've seen recently that confused you — which encoding would have read more clearly?"
    }
  },

  /* ---------- Statistics ---------- */
  "descriptive-stats": {
    prerequisites: ["numpy-ndarray"],
    plainWords: "Before modelling, describe the data in a few numbers: the centre (mean/median/mode) and where it sits. The median resists outliers; the mean doesn't — that difference matters constantly.",
    actuallyDoes: "Reduces a column to summary statistics of location, so you understand a distribution's typical value and how outliers shift it.",
    practical: {
      goal: "See mean vs median diverge under an outlier.",
      steps: [
        "Run it — compute mean and median of salaries.",
        "Note they're close.",
        "Add one CEO salary and rerun — watch the mean jump while the median barely moves."
      ],
      code: "import numpy as np\nsalary = np.array([48, 52, 55, 60, 62])   # thousands\nprint('mean  :', salary.mean())\nprint('median:', np.median(salary))\nbig = np.append(salary, 900)               # add an outlier\nprint('with outlier -> mean:', big.mean().round(1), ' median:', np.median(big))",
      expected: "Mean and median near ~55 at first; after the outlier the mean rockets past 190 while the median stays ~57.",
      stretch: "Which would you report as a 'typical' salary, and why? This is exactly why medians appear in income statistics."
    }
  },
  "variance-std": {
    prerequisites: ["descriptive-stats"],
    plainWords: "The mean tells you the centre; standard deviation tells you the spread — how far values typically sit from that centre. Two datasets can share a mean yet feel completely different.",
    actuallyDoes: "Computes the average squared distance from the mean (variance) and its square root (std), giving spread in the data's own units.",
    practical: {
      goal: "Compare two datasets with the same mean but different spread.",
      steps: [
        "Run it — both arrays average 50.",
        "Compare their standard deviations.",
        "The bigger std means values are more scattered — more risk/uncertainty."
      ],
      code: "import numpy as np\ntight  = np.array([48, 49, 50, 51, 52])\nspread = np.array([10, 30, 50, 70, 90])\nfor name, a in [('tight', tight), ('spread', spread)]:\n    print(f'{name}: mean={a.mean():.0f}  std={a.std():.1f}')",
      expected: "Both means are 50, but 'tight' has a small std (~1.4) and 'spread' a large one (~28).",
      stretch: "Standard deviation is in the data's units; variance is std squared. Print both and confirm var == std**2."
    }
  },
  "normal-distribution": {
    prerequisites: ["variance-std"],
    plainWords: "The normal (bell) curve describes tons of natural measurements: most values cluster near the mean and taper symmetrically. Its 68–95–99.7 rule tells you how much data falls within 1, 2, 3 std of the mean.",
    actuallyDoes: "Models data with a symmetric density defined by mean and std; the empirical rule quantifies how probability mass concentrates near the centre.",
    practical: {
      goal: "Verify the 68–95–99.7 rule from samples.",
      steps: [
        "Run it — draw many samples from a normal distribution.",
        "Count the fraction within 1 and 2 standard deviations.",
        "Compare to the theoretical 68% and 95%."
      ],
      code: "import numpy as np\nrng = np.random.default_rng(0)\nx = rng.normal(loc=100, scale=15, size=100000)\nm, s = x.mean(), x.std()\nwithin1 = np.mean(np.abs(x-m) < s)\nwithin2 = np.mean(np.abs(x-m) < 2*s)\nprint('within 1 std:', round(within1*100,1), '%  (~68)')\nprint('within 2 std:', round(within2*100,1), '%  (~95)')",
      expected: "About 68% of values within 1 std and about 95% within 2 std — the empirical rule confirmed.",
      stretch: "Change scale to 30 and confirm the percentages stay the same — the rule is about std, not the raw spread."
    }
  },
  "correlation": {
    analogy: "Like noticing **ice-cream sales and sunburns rise together** — related, but one doesn't cause the other (hot weather drives both). Correlation measures whether two things move together, from -1 to +1. It's a hint to investigate, **never proof of cause**.",
    prerequisites: ["variance-std"],
    plainWords: "Correlation is a single number from -1 to +1 saying how tightly two things move together: +1 rise together, -1 one rises as the other falls, 0 no linear link. It never proves one causes the other.",
    actuallyDoes: "Standardises the covariance of two variables to [-1, 1], measuring the strength and direction of their linear relationship.",
    practical: {
      goal: "Compute a correlation and see a spurious one.",
      steps: [
        "Run it — study hours vs exam score should correlate strongly and positively.",
        "Then correlate two random columns — it should hover near 0.",
        "Remember: even a high correlation is not causation."
      ],
      code: "import numpy as np\nrng = np.random.default_rng(1)\nhours = np.array([1,2,3,4,5,6,7,8.])\nscore = 40 + 6*hours + rng.normal(0,3,8)\nprint('hours vs score r =', round(np.corrcoef(hours, score)[0,1], 2))\nnoise = rng.normal(size=8)\nprint('score vs noise r =', round(np.corrcoef(score, noise)[0,1], 2))",
      expected: "Hours↔score near +0.98 (strong), score↔noise near 0 — a strong signal vs no relationship.",
      stretch: "Name two things that are correlated but where neither causes the other (ice-cream sales and drownings — both driven by summer heat)."
    }
  },
  "probability-basics": {
    prerequisites: ["descriptive-stats"],
    plainWords: "Probability puts a number from 0 to 1 on how likely something is. The key beginner trap is conditional probability — how a new piece of evidence updates the odds (the heart of Bayes and of ML).",
    actuallyDoes: "Quantifies uncertainty and updates it with evidence; conditional probability and Bayes' rule are the machinery behind classifiers and A/B tests.",
    practical: {
      goal: "Estimate a probability by simulation instead of algebra.",
      steps: [
        "Run it — simulate rolling two dice many times.",
        "Estimate P(sum == 7) by counting.",
        "Compare to the exact answer, 6/36 ≈ 0.167."
      ],
      code: "import numpy as np\nrng = np.random.default_rng(0)\nrolls = rng.integers(1, 7, size=(200000, 2))\nsevens = np.mean(rolls.sum(axis=1) == 7)\nprint('P(sum=7) estimate:', round(sevens, 3), ' exact:', round(6/36, 3))",
      expected: "An estimate very close to 0.167 — simulation converging on the exact probability.",
      stretch: "Estimate P(at least one 6 in two rolls) and check it against the exact 11/36."
    }
  },
  "hypothesis-testing": {
    analogy: "Like a **courtroom**. The default (the *null hypothesis*) is 'innocent — nothing is going on'. Your data is the evidence. The **p-value** is how surprising that evidence would be *if the defendant were truly innocent*; small enough, and you reject 'innocent'. You never *prove* innocence — you just fail to convict.",
    prerequisites: ["normal-distribution", "probability-basics"],
    plainWords: "A hypothesis test asks: could this difference be just luck? The p-value is the chance of seeing a result this extreme if nothing were really going on. Small p (<0.05) → probably a real effect.",
    actuallyDoes: "Compares observed data against a 'nothing happening' null model and returns the probability of the observation under that null (the p-value).",
    practical: {
      goal: "Run a t-test comparing two groups.",
      steps: [
        "Run it — two variants' conversion-like scores are compared.",
        "Read the p-value.",
        "Below ~0.05 suggests the difference is unlikely to be pure chance."
      ],
      code: "import numpy as np\nfrom scipy import stats\nrng = np.random.default_rng(0)\nA = rng.normal(10.0, 2, 60)   # control\nB = rng.normal(11.2, 2, 60)   # variant, slightly higher\nt, p = stats.ttest_ind(A, B)\nprint('means:', round(A.mean(),2), round(B.mean(),2))\nprint('p-value:', round(p, 4))",
      expected: "B's mean is a bit higher and the p-value is small (often <0.05), hinting at a real difference.",
      stretch: "Shrink the gap (make B's mean 10.1) and rerun — watch the p-value climb as the effect gets harder to distinguish from noise."
    }
  },
  "percentiles-iqr": {
    prerequisites: ["descriptive-stats"],
    plainWords: "Percentiles cut sorted data into positions — the 90th percentile is the value 90% fall below. The middle 50% (IQR, from 25th to 75th) is a robust spread measure and the basis of the box plot and outlier rules.",
    actuallyDoes: "Reports order-statistics of a distribution; the IQR gives outlier-resistant spread and a standard rule flags points beyond 1.5×IQR.",
    practical: {
      goal: "Compute quartiles and flag outliers with the 1.5×IQR rule.",
      steps: [
        "Run it — get the 25th, 50th, 75th percentiles.",
        "Compute the IQR and the upper fence.",
        "See which value is flagged as an outlier."
      ],
      code: "import numpy as np\nx = np.array([10, 12, 13, 14, 15, 16, 18, 60])\nq1, q2, q3 = np.percentile(x, [25, 50, 75])\niqr = q3 - q1\nupper = q3 + 1.5*iqr\nprint('Q1,med,Q3:', q1, q2, q3, ' IQR:', iqr)\nprint('outliers:', x[x > upper])",
      expected: "Quartiles printed, and 60 flagged as an outlier beyond the upper fence.",
      stretch: "Add a lower fence `q1 - 1.5*iqr` and confirm no small-side outliers here. This is exactly what a box plot's whiskers draw."
    }
  },

  /* ---------- Machine learning ---------- */
  "classification": {
    analogy: "Like **sorting incoming mail into labelled bins** — spam vs not, approve vs review, churn vs stay. The model learns from past sorted mail what belongs in each bin, then drops each new item into the most likely one — usually with a confidence score.",
    prerequisites: ["ml-fundamentals", "train-test-split"],
    plainWords: "Classification predicts a category, not a number: spam or not, which digit, which disease. The model outputs a probability per class and you pick the most likely.",
    actuallyDoes: "Learns a decision boundary between classes from labelled examples, then assigns new inputs to the class with highest predicted probability.",
    practical: {
      goal: "Train a classifier and read its predictions.",
      steps: [
        "Run it — classify iris flowers into 3 species.",
        "Read the accuracy on held-out data.",
        "Inspect the predicted probabilities for one flower."
      ],
      code: "from sklearn.datasets import load_iris\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.linear_model import LogisticRegression\nX, y = load_iris(return_X_y=True)\nXtr,Xte,ytr,yte = train_test_split(X, y, test_size=0.3, random_state=0, stratify=y)\nclf = LogisticRegression(max_iter=1000).fit(Xtr, ytr)\nprint('accuracy:', round(clf.score(Xte, yte), 3))\nprint('P(classes) for one flower:', clf.predict_proba(Xte[:1]).round(2))",
      expected: "Accuracy around 0.9+, and a probability vector that sums to 1 across the three species.",
      stretch: "Print `classification_report(yte, clf.predict(Xte))` to see precision and recall per species, not just overall accuracy."
    }
  },
  "feature-engineering": {
    analogy: "Like **giving a detective better clues**. The raw case file (the columns) might not crack it, but combine a few facts — 'spend per month of tenure', 'days since last login' — and the pattern jumps out. Often a smart feature beats a fancier model.",
    prerequisites: ["pandas-transform"],
    plainWords: "Models learn from the columns you give them. Feature engineering is crafting better columns — ratios, dates split into parts, categories turned into numbers — often worth more than a fancier algorithm.",
    actuallyDoes: "Transforms raw fields into informative numeric features (encodings, interactions, aggregations) that expose the signal a model can actually use.",
    practical: {
      goal: "Engineer features from raw columns.",
      steps: [
        "Run it — turn a raw date and a category into model-ready features.",
        "One-hot encode the category.",
        "Extract month and a weekend flag from the date."
      ],
      code: "import pandas as pd\ndf = pd.DataFrame({'date': pd.to_datetime(['2024-01-06','2024-03-12']), 'plan': ['pro','free']})\ndf['month'] = df.date.dt.month\ndf['is_weekend'] = df.date.dt.dayofweek >= 5\ndf = pd.get_dummies(df, columns=['plan'])   # one-hot\nprint(df)",
      expected: "A table with numeric `month`, a boolean `is_weekend`, and `plan_free`/`plan_pro` one-hot columns.",
      stretch: "Add a ratio feature from two numeric columns of your own data — ratios often beat raw values for models."
    }
  },
  "train-test-split": {
    analogy: "Like a **mock exam before the real one**. You practise on past papers (training data) but keep one paper sealed for the real test (test data). If you'd peeked at the sealed paper while studying, a great score would prove nothing — which is exactly why the test set is held out *before* any learning happens.",
    flow: {
      title: "Why you split the data first",
      stages: [
        { icon: "📚", label: "All data", d: "Start with every labelled example you have." },
        { icon: "✂️", label: "Split", d: "Randomly seal ~20–25% as a **test set**; keep the rest for training." },
        { icon: "✍️", label: "Train on the rest", d: "The model only ever learns from the training portion." },
        { icon: "📝", label: "Test on the sealed set", d: "Score it on the unseen test set — your honest estimate of real-world accuracy." }
      ]
    },
    prerequisites: ["ml-fundamentals"],
    plainWords: "You must judge a model on data it never saw during training — otherwise you're grading it on the answers it memorised. So you hold out a test set before training anything.",
    actuallyDoes: "Randomly partitions data into train and test (and often validation) subsets so the reported score estimates real-world, unseen performance.",
    practical: {
      goal: "Split data and confirm the halves are disjoint.",
      steps: [
        "Run it — split features and labels 75/25.",
        "Check the shapes.",
        "`stratify=y` keeps the class balance identical in both parts."
      ],
      code: "from sklearn.datasets import load_iris\nfrom sklearn.model_selection import train_test_split\nimport numpy as np\nX, y = load_iris(return_X_y=True)\nXtr,Xte,ytr,yte = train_test_split(X, y, test_size=0.25, random_state=0, stratify=y)\nprint('train/test rows:', len(Xtr), len(Xte))\nprint('class balance tr:', np.bincount(ytr), ' te:', np.bincount(yte))",
      expected: "About 112 train / 38 test rows, with the same class proportions in each thanks to stratify.",
      stretch: "Drop `stratify=y` and rerun a few times with different random_state — watch the class balance wobble."
    }
  },
  "overfitting": {
    analogy: "Like a student who **memorised last year's exam paper** instead of learning the subject. Flawless on the questions they've already seen, lost the moment the questions change. A model that memorises its training data looks brilliant in rehearsal and then fails on real, unseen customers.",
    prerequisites: ["train-test-split"],
    plainWords: "Overfitting is memorising the training data — including its noise — so the model aces training but flops on new data. Underfitting is the opposite: too simple to capture the pattern. You want the middle.",
    actuallyDoes: "Trades bias for variance: an over-flexible model fits noise (high variance), an over-simple one misses signal (high bias); the gap between train and test score reveals which.",
    practical: {
      goal: "Watch a model overfit as its flexibility grows.",
      steps: [
        "Run it — fit polynomials of increasing degree to noisy data.",
        "Compare train vs test error at each degree.",
        "The high-degree fit nails train but worsens on test — overfitting."
      ],
      code: "import numpy as np\nfrom numpy.polynomial import polynomial as P\nrng = np.random.default_rng(0)\nx = np.linspace(0,1,20); y = np.sin(2*x) + rng.normal(0,0.1,20)\nxtr,ytr,xte,yte = x[::2],y[::2],x[1::2],y[1::2]\nfor deg in [1,3,9]:\n    c = np.polyfit(xtr,ytr,deg)\n    tr = np.mean((np.polyval(c,xtr)-ytr)**2)\n    te = np.mean((np.polyval(c,xte)-yte)**2)\n    print(f'degree {deg}: train MSE {tr:.3f}  test MSE {te:.3f}')",
      expected: "Degree 9 shows tiny train error but a large test error — the classic overfitting signature.",
      stretch: "Which degree gives the best TEST error? That sweet spot is what regularization and validation are hunting for."
    }
  },
  "model-evaluation": {
    analogy: "Like a **report card, not a single grade**. *Judge a fish by its ability to climb a tree* and every fish fails — the wrong metric hides the truth. Accuracy alone flatters a model on rare events (say '99% not fraud' by never catching any fraud); precision and recall reveal what it actually catches and what it misses.",
    prerequisites: ["classification", "train-test-split"],
    plainWords: "Accuracy alone lies on imbalanced data. The confusion matrix splits right/wrong into types; precision asks 'of my positive calls, how many were right?' and recall asks 'of the real positives, how many did I catch?'.",
    actuallyDoes: "Breaks predictions into true/false positives/negatives and derives precision, recall and F1 — metrics that expose failures accuracy hides.",
    practical: {
      goal: "Read a confusion matrix and precision/recall.",
      steps: [
        "Run it — a fraud-like imbalanced problem.",
        "Note the confusion matrix counts.",
        "See how accuracy looks great while recall on the rare class tells the real story."
      ],
      code: "from sklearn.metrics import confusion_matrix, classification_report\nimport numpy as np\ny_true = np.array([0]*95 + [1]*5)          # 5% positives\ny_pred = np.array([0]*100)                 # 'always negative'\nprint('accuracy:', (y_true==y_pred).mean())\nprint(confusion_matrix(y_true, y_pred))\nprint(classification_report(y_true, y_pred, zero_division=0))",
      expected: "95% accuracy yet 0 recall on the positive class — the model catches no fraud at all.",
      stretch: "This is why you pick the metric that matches the cost of each error. For fraud, recall on positives usually matters most."
    }
  },
  "hyperparameter-tuning": {
    prerequisites: ["overfitting", "train-test-split"],
    plainWords: "Hyperparameters are the knobs you set before training (tree depth, regularization strength, k). Tuning searches combinations to find the settings that generalise best — judged by cross-validation, not the test set.",
    actuallyDoes: "Systematically evaluates knob settings with cross-validation and keeps the combination with the best validated score, avoiding manual guesswork and test-set leakage.",
    practical: {
      goal: "Grid-search a hyperparameter with cross-validation.",
      steps: [
        "Run it — search the regularization strength C for a classifier.",
        "Read the best value and its cross-validated score.",
        "The search never touches a final test set — it uses CV folds."
      ],
      code: "from sklearn.datasets import load_iris\nfrom sklearn.linear_model import LogisticRegression\nfrom sklearn.model_selection import GridSearchCV\nX, y = load_iris(return_X_y=True)\ngrid = GridSearchCV(LogisticRegression(max_iter=1000),\n                    {'C':[0.01,0.1,1,10,100]}, cv=5)\ngrid.fit(X, y)\nprint('best C:', grid.best_params_['C'], ' CV score:', round(grid.best_score_,3))",
      expected: "A best C value and a cross-validated accuracy, chosen without peeking at a test set.",
      stretch: "Add `'penalty':['l1','l2']` with `solver='liblinear'` and search both knobs at once — grid search scales to combinations."
    }
  },
  "sklearn-workflow": {
    prerequisites: ["ml-fundamentals", "train-test-split"],
    plainWords: "scikit-learn gives every model the same three verbs: fit, predict, score. Learn the pattern once and you can swap algorithms freely. Pipelines chain preprocessing + model so nothing leaks.",
    actuallyDoes: "Exposes a uniform estimator API and Pipeline objects that bundle transformers and a model, so preprocessing is fit only on training folds.",
    practical: {
      goal: "Build a leak-proof pipeline: scale + model in one object.",
      steps: [
        "Run it — a Pipeline chains a scaler and a classifier.",
        "Call fit/score on the pipeline as if it were one model.",
        "The scaler is fit inside the pipeline, so cross-validation stays honest."
      ],
      code: "from sklearn.datasets import load_iris\nfrom sklearn.pipeline import make_pipeline\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.neighbors import KNeighborsClassifier\nfrom sklearn.model_selection import cross_val_score\nX, y = load_iris(return_X_y=True)\npipe = make_pipeline(StandardScaler(), KNeighborsClassifier(n_neighbors=5))\nprint('CV accuracy:', cross_val_score(pipe, X, y, cv=5).mean().round(3))",
      expected: "A solid cross-validated accuracy from a single pipeline object that scales then classifies.",
      stretch: "Swap KNeighborsClassifier for RandomForestClassifier — same three verbs, one line changed. That uniformity is the whole point."
    }
  },
  "decision-trees": {
    prerequisites: ["classification"],
    plainWords: "A decision tree asks a series of yes/no questions about features to reach an answer — like a flowchart it learns from data. Many trees averaged together (a random forest) fix a single tree's tendency to overfit.",
    actuallyDoes: "Recursively splits data on the feature/threshold that best separates the target; a random forest averages many de-correlated trees to reduce variance.",
    practical: {
      goal: "Train a tree and a forest, compare, and read feature importance.",
      steps: [
        "Run it — fit a single tree and a random forest.",
        "Compare their accuracy.",
        "Read which features the forest relied on most."
      ],
      code: "from sklearn.datasets import load_iris\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.tree import DecisionTreeClassifier\nfrom sklearn.ensemble import RandomForestClassifier\nX, y = load_iris(return_X_y=True)\nXtr,Xte,ytr,yte = train_test_split(X,y,test_size=0.3,random_state=0,stratify=y)\nfor name,m in [('tree',DecisionTreeClassifier(random_state=0)),('forest',RandomForestClassifier(random_state=0))]:\n    m.fit(Xtr,ytr); print(name,'acc:',round(m.score(Xte,yte),3))\nprint('importances:', m.feature_importances_.round(2))",
      expected: "Both score well; the forest is usually as good or better, plus a feature-importance vector.",
      stretch: "Set `max_depth=1` on the tree (a 'stump') and watch accuracy drop — depth is its key overfitting knob."
    }
  },
  "data-leakage": {
    prerequisites: ["train-test-split", "standardization"],
    plainWords: "Leakage is when information from the test set (or the future) sneaks into training, giving a dishonest, too-good score that collapses in production. The classic: scaling using stats from the whole dataset before splitting.",
    actuallyDoes: "Occurs when preprocessing or features encode target/test information; the fix is to fit every transform on training data only, inside cross-validation.",
    practical: {
      goal: "Cause leakage, then fix it, and see the score change.",
      steps: [
        "Run it — first scale on ALL data (leaky), then correctly on train only.",
        "Compare the two accuracies.",
        "The leaky version reports a rosier number than it deserves."
      ],
      code: "from sklearn.datasets import load_breast_cancer\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.linear_model import LogisticRegression\nX, y = load_breast_cancer(return_X_y=True)\n# LEAKY: fit scaler on everything, then split\nXs = StandardScaler().fit_transform(X)\na,b,c,d = train_test_split(Xs,y,test_size=0.3,random_state=0)\nleaky = LogisticRegression(max_iter=5000).fit(a,c).score(b,d)\n# CORRECT: split first, fit scaler on train only\nXtr,Xte,ytr,yte = train_test_split(X,y,test_size=0.3,random_state=0)\nsc = StandardScaler().fit(Xtr)\nclean = LogisticRegression(max_iter=5000).fit(sc.transform(Xtr),ytr).score(sc.transform(Xte),yte)\nprint('leaky:', round(leaky,4), ' clean:', round(clean,4))",
      expected: "The two scores are close here but the leaky one is optimistic — on trickier data the gap can be large and dangerous.",
      stretch: "Use a Pipeline (from the scikit-learn workflow topic) so the scaler can never leak — it's fit per fold automatically."
    }
  },
  "pca": {
    prerequisites: ["standardization", "numpy-vectorization"],
    plainWords: "PCA compresses many correlated columns into a few new ones that keep most of the variation — handy for visualising high-dimensional data and speeding up models, at the cost of interpretable columns.",
    actuallyDoes: "Finds orthogonal directions of maximum variance and projects data onto the top few, reducing dimensionality while preserving most information.",
    practical: {
      goal: "Reduce 4-D iris data to 2-D and see how much variance survives.",
      steps: [
        "Run it — standardize, then PCA to 2 components.",
        "Read the explained-variance ratio.",
        "Two numbers now summarise four original features."
      ],
      code: "from sklearn.datasets import load_iris\nfrom sklearn.preprocessing import StandardScaler\nfrom sklearn.decomposition import PCA\nX, y = load_iris(return_X_y=True)\nXs = StandardScaler().fit_transform(X)\np = PCA(n_components=2).fit(Xs)\nprint('explained variance:', p.explained_variance_ratio_.round(3))\nprint('kept total:', round(p.explained_variance_ratio_.sum(), 3))",
      expected: "Two components that together retain roughly 95% of the variance — 4-D down to 2-D with little loss.",
      stretch: "Always standardize before PCA. Rerun without the scaler and watch the variance ratios distort as big-scale columns dominate."
    }
  },
  "recommendation-systems": {
    prerequisites: ["ml-fundamentals"],
    plainWords: "Recommenders predict what you'll like. Two big ideas: collaborative filtering ('people like you liked this') and content-based ('more items like ones you liked'). Netflix and Spotify live on these.",
    actuallyDoes: "Models user–item interactions to score unseen items; collaborative filtering uses similarity between users/items, content-based uses item features.",
    practical: {
      goal: "Recommend by finding the most similar user.",
      steps: [
        "Run it — a tiny user×movie ratings matrix.",
        "Find the user most similar to the target.",
        "Suggest a movie they rated highly that the target hasn't seen."
      ],
      code: "import numpy as np\n# rows=users, cols=movies (0 = unseen)\nR = np.array([[5,4,0,1],[5,5,0,0],[1,0,5,4],[0,1,4,5.]])\ntarget = 0\nsim = R @ R[target] / (np.linalg.norm(R,axis=1)*np.linalg.norm(R[target])+1e-9)\nsim[target] = -1                       # ignore self\nbuddy = sim.argmax()\nunseen = np.where(R[target]==0)[0]\nrec = unseen[np.argmax(R[buddy][unseen])]\nprint('most similar user:', buddy, ' recommend movie:', rec)",
      expected: "User 1 is picked as the closest match to user 0, and an unseen movie they liked is recommended.",
      stretch: "This is item-agnostic collaborative filtering. What breaks for a brand-new user with zero ratings? (The 'cold-start' problem.)"
    }
  },
  "time-series": {
    prerequisites: ["regression", "descriptive-stats"],
    plainWords: "Time-series data is ordered by time, so the past predicts the future and you must never shuffle it. Forecasting uses lags (recent values) and seasonality, and you always compare against a naive 'same as last period' baseline.",
    actuallyDoes: "Models temporal dependence with lag/seasonal features and time-ordered validation, then benchmarks against a naive persistence forecast.",
    practical: {
      goal: "Beat the naive baseline with a lag feature.",
      steps: [
        "Run it — a trending monthly series.",
        "Predict each month from the previous one via linear regression.",
        "Compare the model's error to the naive 'last value' forecast."
      ],
      code: "import numpy as np\nfrom sklearn.linear_model import LinearRegression\nfrom sklearn.metrics import mean_absolute_error\nrng = np.random.default_rng(0)\ny = np.linspace(100,160,36) + rng.normal(0,4,36)\nlag = y[:-1]; target = y[1:]\ncut = 24\nm = LinearRegression().fit(lag[:cut].reshape(-1,1), target[:cut])\npred = m.predict(lag[cut:].reshape(-1,1))\nprint('model MAE:', round(mean_absolute_error(target[cut:], pred),2))\nprint('naive MAE:', round(mean_absolute_error(target[cut:], lag[cut:]),2))",
      expected: "The regression's MAE is at or below the naive baseline — a forecast worth keeping.",
      stretch: "Add a lag-12 feature for yearly seasonality and see if the error drops further."
    }
  },

  /* ---------- Deep learning ---------- */
  "neural-networks": {
    analogy: "Like an **assembly line of specialists**. Raw input enters at one end; each layer of workers spots slightly more complex patterns (edges → shapes → faces) and passes its findings to the next. No single worker understands the whole job — the layers *together* do.",
    flow: {
      title: "How signal flows through the network",
      stages: [
        { icon: "📥", label: "Input layer", d: "The raw features enter — pixels, numbers, or token vectors." },
        { icon: "🧩", label: "Hidden layers", d: "Each layer combines the previous one's signals into steadily richer patterns (edges → shapes → objects)." },
        { icon: "⚙️", label: "Weights + activation", d: "Every connection has a **weight**; an **activation function** lets the network bend, not just draw straight lines." },
        { icon: "📤", label: "Output", d: "The final layer turns all of that into a prediction — a class or a number." },
        { icon: "🔁", label: "Backprop", d: "The error is sent *backwards* to nudge every weight — that's gradient descent doing the actual learning." }
      ]
    },
    prerequisites: ["ml-fundamentals", "standardization"],
    plainWords: "A neural network stacks simple units (neurons): each multiplies inputs by weights, adds them, and passes the result through a squashing function. Stack enough layers and it can learn very complex patterns.",
    actuallyDoes: "Composes layers of weighted sums + non-linear activations; training adjusts the weights so the composed function maps inputs to correct outputs.",
    practical: {
      goal: "Compute a forward pass of one neuron layer by hand.",
      steps: [
        "Run it — inputs times weights, plus bias, through a ReLU.",
        "Change a weight and watch the output move.",
        "This tiny operation, repeated over layers, is the whole engine."
      ],
      code: "import numpy as np\nx = np.array([0.5, -1.0, 2.0])           # inputs\nW = np.array([[0.2, 0.8, -0.5],          # 2 neurons x 3 inputs\n              [-0.3, 0.1, 0.9]])\nb = np.array([0.0, 0.5])\nz = W @ x + b                            # weighted sums\na = np.maximum(0, z)                     # ReLU activation\nprint('pre-activation:', z.round(2))\nprint('after ReLU   :', a.round(2))",
      expected: "Two weighted sums, with any negative one clamped to 0 by ReLU.",
      stretch: "Add a second layer: feed `a` through another W2/b2. You've just hand-built a 2-layer network's forward pass."
    }
  },
  "activation-loss": {
    prerequisites: ["neural-networks"],
    plainWords: "Activation functions add the non-linearity that lets deep nets model complex things (without them, stacked layers collapse to one line). The loss function scores how wrong a prediction is — the thing training tries to shrink.",
    actuallyDoes: "Activations (ReLU, sigmoid, softmax) bend the function; the loss (MSE, cross-entropy) turns error into a single number whose gradient drives learning.",
    practical: {
      goal: "See non-linearity matter, and compute a loss.",
      steps: [
        "Run it — softmax turns raw scores into probabilities.",
        "Cross-entropy scores the prediction against the true label.",
        "Make the prediction more confident-and-correct and watch the loss fall."
      ],
      code: "import numpy as np\ndef softmax(z): e=np.exp(z-z.max()); return e/e.sum()\nlogits = np.array([2.0, 1.0, 0.1])\np = softmax(logits)\nprint('probs:', p.round(3))\ntrue = 0                                  # correct class index\nloss = -np.log(p[true])\nprint('cross-entropy loss:', round(loss, 3))",
      expected: "A probability vector summing to 1 and a loss that is small when the true class already has high probability.",
      stretch: "Set logits to [10,1,0.1] (very confident, correct) and rerun — the loss shrinks toward 0. Wrong-and-confident would explode it."
    }
  },
  "gradient-descent": {
    analogy: "Like hiking down a mountain in thick fog. You can't see the valley, but you can feel which way slopes **downhill** under your feet, take a step that way, and repeat. The *learning rate* is your step size — tiny steps are slow, giant steps overshoot the valley and bounce around.",
    flow: {
      title: "One step of learning, repeated thousands of times",
      stages: [
        { icon: "🎯", label: "Guess", d: "Start with random weights — the model knows nothing yet." },
        { icon: "📏", label: "Measure error", d: "Compare predictions to the truth with a **loss function**: how wrong are we right now?" },
        { icon: "🧭", label: "Find the slope", d: "The **gradient** points in the direction that *increases* error; downhill is the opposite way." },
        { icon: "👣", label: "Step downhill", d: "Nudge each weight a little against the gradient. How big a nudge = the learning rate." },
        { icon: "🔁", label: "Repeat", d: "Do it again and again until the error stops dropping — you've reached the valley (the minimum)." }
      ]
    },
    prerequisites: ["activation-loss"],
    plainWords: "Gradient descent is how a model learns: compute which way the loss goes downhill (the gradient) and take a small step that way, over and over. Backpropagation is the efficient way to get those gradients through the layers.",
    actuallyDoes: "Iteratively updates parameters by subtracting the learning-rate-scaled gradient of the loss, converging toward a minimum.",
    practical: {
      goal: "Minimise a function by hand with gradient descent.",
      steps: [
        "Run it — minimise f(x) = (x-3)² starting from x=0.",
        "Each step moves x toward 3.",
        "Change the learning rate and watch convergence speed (or divergence)."
      ],
      code: "x = 0.0\nlr = 0.1\nfor step in range(20):\n    grad = 2*(x - 3)          # derivative of (x-3)^2\n    x -= lr * grad\nprint('converged x =', round(x, 3), ' (target 3)')",
      expected: "x lands very close to 3 — the minimum — after 20 steps.",
      stretch: "Set lr=1.1 and rerun: too big a step overshoots and x diverges. That's why learning rate is the most-tuned knob in deep learning."
    }
  },
  "cnn-rnn-transformers": {
    analogy: "Three tools for three jobs. A **CNN** is a magnifying glass sweeping across an image for local patterns. An **RNN** reads a sentence word-by-word, remembering what came before. A **Transformer** reads the whole page at once and draws lines between related words — which is why it powers modern LLMs.",
    prerequisites: ["neural-networks", "gradient-descent"],
    plainWords: "Different data needs different architectures: CNNs for images (they scan for local patterns), RNNs for sequences (they carry memory), and Transformers (self-attention) for language — the design behind modern LLMs.",
    actuallyDoes: "Each architecture bakes in an inductive bias: convolution for spatial locality, recurrence/attention for order, self-attention for long-range token relationships computed in parallel.",
    practical: {
      goal: "Feel self-attention: score how much one word attends to others.",
      steps: [
        "Run it — three word vectors; compute attention weights for word 0.",
        "Softmax turns similarity scores into weights that sum to 1.",
        "The output is a weighted blend of the other words' values."
      ],
      code: "import numpy as np\ndef softmax(z): e=np.exp(z-z.max()); return e/e.sum()\n# 3 tokens, 2-dim (toy) embeddings\nE = np.array([[1,0],[0.9,0.1],[0,1.]])\nq = E[0]                       # query = token 0\nscores = E @ q                 # similarity to every token\nattn = softmax(scores)\nout = attn @ E                 # weighted sum of values\nprint('attention weights:', attn.round(2))\nprint('context vector   :', out.round(2))",
      expected: "Token 0 attends most to itself and the similar token 1, least to the orthogonal token 2 — a context vector blended by those weights.",
      stretch: "This toy is the heart of the Transformer. Real ones add separate query/key/value projections and many attention heads in parallel."
    }
  },

  /* ---------- Generative AI ---------- */
  "generative-ai-llm": {
    analogy: "Like a **very well-read intern doing super-charged autocomplete**. It has read a huge slice of the internet and, given some text, predicts the next word over and over — fluently enough to write essays, code and answers. It doesn't 'look up' facts; it predicts what a knowledgeable person would most likely say next.",
    flow: {
      title: "How an LLM turns your prompt into an answer",
      stages: [
        { icon: "✍️", label: "Text", d: "Your prompt arrives as plain text." },
        { icon: "🔡", label: "Tokens", d: "It's chopped into **tokens** — word-pieces the model actually works with." },
        { icon: "📍", label: "Embeddings", d: "Each token becomes a vector capturing its meaning and position." },
        { icon: "🧠", label: "Transformer", d: "Attention layers weigh how every token relates to the others to build context." },
        { icon: "🎲", label: "Next token", d: "It predicts the most likely next token, appends it, and repeats." },
        { icon: "📝", label: "Answer", d: "Token by token the reply is generated — which is why it 'types' one word at a time." }
      ]
    },
    prerequisites: ["neural-networks"],
    plainWords: "An LLM is a giant next-token predictor trained on huge text. Ask it something and it repeatedly guesses the most plausible next chunk of text — that simple objective, at scale, produces fluent answers.",
    actuallyDoes: "Predicts the probability of the next token given all previous ones; sampling from that distribution repeatedly generates coherent text.",
    practical: {
      goal: "Build a toy next-token predictor to demystify the idea.",
      steps: [
        "Run it — learn which word tends to follow which from a tiny corpus.",
        "Generate text by repeatedly picking a likely next word.",
        "Real LLMs do this with billions of parameters over sub-word tokens."
      ],
      code: "import random\nfrom collections import defaultdict\ncorpus = 'the cat sat on the mat the cat ran to the mat'.split()\nnxt = defaultdict(list)\nfor a,b in zip(corpus, corpus[1:]): nxt[a].append(b)\nrandom.seed(0)\nword='the'; out=[word]\nfor _ in range(6): word=random.choice(nxt[word]); out.append(word)\nprint(' '.join(out))",
      expected: "A short, corpus-flavoured sentence generated one word at a time from learned transitions.",
      stretch: "This is a 1-gram model. LLMs condition on thousands of prior tokens at once — same idea, vastly more context."
    }
  },
  "prompt-engineering": {
    analogy: "Like giving instructions to a **brilliant but painfully literal assistant**. It does exactly what you say, not what you meant — so vague asks get vague work. Say who it is, what you want, the format, and show one example, and the same model suddenly produces exactly what you need.",
    prerequisites: ["generative-ai-llm"],
    plainWords: "The prompt is your program for an LLM. Clear instructions, examples, and a defined output format dramatically change the quality — same model, wildly different results depending on how you ask.",
    actuallyDoes: "Shapes the model's output distribution by conditioning it: role, constraints, few-shot examples and format cues steer generation toward the answer you want.",
    practical: {
      goal: "Turn a weak prompt into a strong one.",
      steps: [
        "Run it — compare a vague prompt with a structured one.",
        "The strong prompt sets a role, constraints and an output format.",
        "Paste the strong prompt into any LLM and see the difference."
      ],
      code: "weak = 'Summarize this.'\nstrong = (\n  'You are a technical editor.\\n'\n  'Summarize the text in exactly 3 bullet points,\\n'\n  'each under 12 words, plain language, no jargon.\\n\\n'\n  'TEXT: <paste text here>')\nprint('WEAK  :', weak)\nprint('STRONG:\\n', strong)",
      expected: "The strong prompt specifies role, count, length, tone and a placeholder — everything the model needs to comply.",
      stretch: "Add one worked example (few-shot) before the TEXT and watch consistency improve further."
    }
  },
  "vector-search": {
    analogy: "Like a **librarian who finds books by vibe, not exact title**. Ask for 'something about getting my money back' and keyword search shrugs; meaning-based search hands you the refund policy. It matches by *what the text means* — using the embedding vectors — not by the letters.",
    prerequisites: ["tokens-embeddings"],
    plainWords: "Vector search finds items by meaning, not keywords: embed everything into vectors, then return the ones closest to your query's vector. It's what powers semantic search and the retrieval step in RAG.",
    actuallyDoes: "Indexes embedding vectors and answers nearest-neighbour queries by cosine/inner-product similarity, often approximately for speed at scale.",
    practical: {
      goal: "Rank documents by cosine similarity to a query.",
      steps: [
        "Run it — tiny hashed embeddings stand in for a real model.",
        "Score each doc against the query and sort.",
        "The most semantically-related doc ranks first."
      ],
      code: "import numpy as np\ndef embed(t):\n    v=np.zeros(32)\n    for w in t.lower().split(): v[hash(w)%32]+=1\n    return v/(np.linalg.norm(v)+1e-9)\ndocs=['refund policy and returns','shipping and delivery times','office opening hours']\nD=np.array([embed(d) for d in docs])\nq=embed('how do I return an item for a refund')\nsims=D@q\nfor i in sims.argsort()[::-1]: print(round(sims[i],3), docs[i])",
      expected: "The refund/returns document scores highest for a refund question — retrieval by meaning.",
      stretch: "Swap the hashed embed() for a real embedding model and you have production semantic search. A vector DB just does this fast over millions of docs."
    }
  },
  "rag-vs-finetuning": {
    analogy: "**Look it up vs learn it by heart.** RAG hands the model an open reference to read at answer time — great for facts that change or must be cited. Fine-tuning makes it study until a behaviour is second nature — great for a fixed style or format, not for fresh facts. Changing knowledge? Reach for RAG.",
    prerequisites: ["rag"],
    plainWords: "Two ways to give an LLM new abilities: RAG feeds facts at query time (great for changing/private knowledge), fine-tuning bakes behaviour into the weights (great for fixed style or format). They solve different problems.",
    actuallyDoes: "RAG augments the prompt with retrieved context (no weight change); fine-tuning updates weights on curated examples. Choose by whether you're adding knowledge or shaping behaviour.",
    practical: {
      goal: "Route real needs to the right technique.",
      steps: [
        "Run it — each scenario is tagged RAG or fine-tune with a reason.",
        "Read the rule of thumb printed at the end.",
        "Add a scenario from your own work and decide."
      ],
      code: "cases = {\n  'Answer from docs updated weekly': 'RAG (knowledge changes; edit docs, not weights)',\n  'Always reply in our strict JSON schema': 'fine-tune (fixed behaviour/format)',\n  'Cite the source document': 'RAG (retrieval gives you the source)',\n  'Adopt a consistent brand voice': 'fine-tune (style, not facts)',\n}\nfor c,ans in cases.items(): print(f'- {c}\\n    -> {ans}')\nprint('\\nRule: new/changing FACTS -> RAG;  fixed BEHAVIOUR -> fine-tune.')",
      expected: "Each scenario routed correctly, ending with the facts-vs-behaviour rule of thumb.",
      stretch: "Many production systems use BOTH: fine-tune for format, RAG for facts. When would you reach for each in one app?"
    }
  },
  "ai-applications": {
    prerequisites: ["rag", "prompt-engineering"],
    plainWords: "Beyond chat, LLMs power agents that use tools: they decide what to do, call a function (search, calculator, API), read the result, and continue. The model is the reasoner; tools give it real-world reach.",
    actuallyDoes: "Wraps an LLM in a loop that parses its requested action, executes a tool, feeds the result back, and repeats until the task is done.",
    practical: {
      goal: "Build a minimal tool-using agent loop.",
      steps: [
        "Run it — the 'LLM' decides to call a calculator tool.",
        "The tool runs and the result is fed back.",
        "This decide→act→observe loop is the core of every agent framework."
      ],
      code: "def tool_calculator(expr): return eval(expr, {'__builtins__':{}})\ndef fake_llm(task):\n    # a real LLM would output this decision itself\n    return {'tool':'calculator','args':'12*7 + 5'}\ntask = 'what is 12 times 7 plus 5?'\naction = fake_llm(task)\nresult = tool_calculator(action['args'])\nprint('agent called', action['tool'], '->', result)\nprint('final answer:', result)",
      expected: "The agent chooses the calculator tool, runs 12*7+5, and returns 89.",
      stretch: "Add a second tool (e.g. a fake web search) and have fake_llm pick between them based on the task text — that's tool routing."
    }
  },

  /* ---------- MLOps ---------- */
  "mlops-lifecycle": {
    prerequisites: ["sklearn-workflow", "model-evaluation"],
    plainWords: "MLOps is DevOps for models: version the data and model, automate training, deploy, monitor, and retrain when things drift. A model isn't 'done' at good accuracy — that's when the real work starts.",
    actuallyDoes: "Coordinates data/model versioning, reproducible pipelines, deployment and monitoring so a model stays reliable and auditable across its life.",
    practical: {
      goal: "Version and persist a trained model like production does.",
      steps: [
        "Run it — train, then save the model with a version tag.",
        "Reload it and confirm it predicts identically.",
        "Real systems store this artifact in a registry alongside its metrics."
      ],
      code: "from sklearn.datasets import load_iris\nfrom sklearn.linear_model import LogisticRegression\nimport pickle, hashlib\nX,y = load_iris(return_X_y=True)\nmodel = LogisticRegression(max_iter=1000).fit(X,y)\nblob = pickle.dumps(model)\nversion = hashlib.md5(blob).hexdigest()[:8]\nprint('model version:', version)\nreloaded = pickle.loads(blob)\nprint('predictions match:', (reloaded.predict(X)==model.predict(X)).all())",
      expected: "A short version hash and `predictions match: True` after a save/reload round-trip.",
      stretch: "Store the accuracy next to the version. Now you can compare v1 vs v2 before promoting one to production."
    }
  },
  "mlops-monitoring": {
    prerequisites: ["mlops-lifecycle"],
    plainWords: "After deploy, the world keeps changing. Data drift is when live inputs no longer look like the training data, silently eroding accuracy. Monitoring catches it so you can retrain before users notice.",
    actuallyDoes: "Compares live input distributions against a training reference (via statistical tests/distances) and alerts when drift exceeds a threshold, triggering retraining.",
    practical: {
      goal: "Detect drift between training and live data.",
      steps: [
        "Run it — a reference (training) sample vs a shifted live sample.",
        "A statistical test flags whether the distributions differ.",
        "A small p-value means drift — time to investigate or retrain."
      ],
      code: "import numpy as np\nfrom scipy import stats\nrng = np.random.default_rng(0)\ntrain = rng.normal(50, 10, 1000)     # reference\nlive  = rng.normal(58, 10, 1000)     # shifted upward\nks, p = stats.ks_2samp(train, live)\nprint('KS stat:', round(ks,3), ' p-value:', round(p,5))\nprint('DRIFT DETECTED' if p < 0.05 else 'no significant drift')",
      expected: "A small p-value and a 'DRIFT DETECTED' message — the live mean moved away from training.",
      stretch: "Set live's mean back to 50 and rerun — no drift. This same test guards features in production pipelines."
    }
  },
  "ai-ethics": {
    prerequisites: ["model-evaluation"],
    plainWords: "Models learn our historical biases and can amplify them. 'Fairness through unawareness' — just dropping a sensitive column — fails, because other columns act as proxies. You must measure outcomes across groups, not assume.",
    actuallyDoes: "Audits model behaviour for disparate error/selection rates across groups and surfaces proxy leakage that a removed sensitive attribute leaves behind.",
    practical: {
      goal: "Show that removing a sensitive column doesn't remove the bias.",
      steps: [
        "Run it — a 'zip code' proxy is correlated with a sensitive group.",
        "Even without the group column, the proxy leaks it.",
        "Measure the correlation that a model would happily exploit."
      ],
      code: "import numpy as np\nrng = np.random.default_rng(0)\ngroup = rng.integers(0,2,1000)                 # sensitive attribute (dropped from model)\nzip_code = group*3 + rng.normal(0,1,1000)      # proxy leaks the group\nr = np.corrcoef(group, zip_code)[0,1]\nprint('group vs zip_code correlation:', round(r,2))\nprint('Dropping group but keeping zip_code still encodes it.' if abs(r)>0.5 else 'weak proxy')",
      expected: "A strong correlation (~0.8) showing the proxy still carries the sensitive signal after the column is removed.",
      stretch: "Real audits measure error rates per group (equalized odds). Removing features is not enough — you must test outcomes."
    }
  }
};
