window.KB = window.KB || {};
window.KB.fundamentals = [
  {
    id: "ds-ai-ml-overview",
    category: "fundamentals",
    title: "Data Science, AI, ML & GenAI — the big picture",
    difficulty: "Beginner",
    short: "How the four buzzwords relate and where each one actually fits.",
    definition: "Data Science is the practice of turning data into decisions. Artificial Intelligence (AI) is the broad goal of making machines behave intelligently. Machine Learning (ML) is the subset of AI where systems learn patterns from data instead of being explicitly programmed. Generative AI is a recent branch of ML that creates new content — text, images, code — rather than only predicting labels or numbers.",
    why: "Engineers hear these terms used interchangeably in meetings, docs and vendor pitches. Knowing what sits inside what stops you from over-engineering (reaching for an LLM when a SQL query would do) or under-scoping a project.",
    problem: "Teams waste months because 'let's add AI' has no shared meaning. A clear mental model lets you say 'this is a classification problem' or 'this needs retrieval', which points straight at the right tools.",
    howItWorks: "Think of nested circles: AI is the outer circle (any intelligent behaviour, including old rule engines). ML sits inside AI (systems that improve from data). Deep Learning sits inside ML (neural networks with many layers). Generative AI is a slice of Deep Learning focused on producing new content. Data Science overlaps all of them but also includes plain statistics, dashboards and data cleaning that involve no learning at all.",
    example: "A bank: a hard-coded rule 'block transactions over $10,000' is AI-ish automation but not ML. A model that learns fraud patterns from history is ML. A neural net reading raw transaction sequences is Deep Learning. A chatbot that drafts the customer's fraud-dispute email is Generative AI.",
    code: null,
    engineering: "For a software engineer, ML is just a new kind of function: instead of writing the logic by hand, you fit it from examples, then call it behind an API like any other service. The surrounding app — inputs, validation, storage, monitoring — is ordinary engineering.",
    whenToUse: [
      "Framing a new project so the team agrees on what kind of problem it is",
      "Deciding whether a rule, a classic ML model, or an LLM is the right tool",
      "Communicating scope and cost to non-technical stakeholders"
    ],
    whenNotToUse: [
      "As a substitute for defining the actual business metric you want to move"
    ],
    limitations: [
      "The boundaries are fuzzy and marketing blurs them further",
      "Newer isn't better — a generative model is often the wrong, expensive choice for a prediction task"
    ],
    keyTakeaway: "AI ⊃ ML ⊃ Deep Learning ⊃ Generative AI. Data Science is the wider craft of getting value from data, with or without learning.",
    related: ["data-science-workflow", "ml-fundamentals", "generative-ai-llm"],
    keywords: ["artificial intelligence", "machine learning", "deep learning", "generative ai", "data science", "definition", "overview"],
    viz: null,
    comparison: {
      title: "AI vs ML vs Deep Learning vs Generative AI",
      headers: ["Term", "Scope", "Learns from data?", "Typical output"],
      rows: [
        ["AI", "Any intelligent behaviour", "Not necessarily", "Decisions / actions"],
        ["Machine Learning", "Subset of AI", "Yes, patterns", "Predictions (label/number)"],
        ["Deep Learning", "Subset of ML", "Yes, via neural nets", "Predictions from raw data"],
        ["Generative AI", "Subset of Deep Learning", "Yes, from huge corpora", "New content (text/image/code)"]
      ]
    }
  },
  {
    id: "data-science-workflow",
    category: "fundamentals",
    title: "The Data Science workflow",
    difficulty: "Beginner",
    short: "The repeatable lifecycle from raw data to a deployed, monitored model.",
    definition: "A structured sequence of steps that a data project moves through: understand the problem, get and clean the data, explore it, engineer features, train and evaluate models, then deploy and monitor.",
    why: "Beginners jump straight to modelling and are surprised that the model is the smallest part. In practice, roughly 70–80% of effort is data loading, cleaning and understanding. A shared workflow keeps projects honest about where the work really is.",
    problem: "Without a lifecycle, projects skip validation, leak test data into training, or ship a model no one can maintain. The workflow bakes in checkpoints that prevent these classic failures.",
    howItWorks: "1) Problem framing — what decision are we improving? 2) Data collection — pull from databases, files, APIs. 3) Cleaning — handle missing values, types, duplicates. 4) EDA — explore distributions and relationships. 5) Feature engineering — turn raw columns into model-ready inputs. 6) Modelling — train candidate algorithms. 7) Evaluation — test on unseen data. 8) Deployment — expose behind an API. 9) Monitoring — watch for drift and retrain.",
    example: "Predicting customer churn for a telecom: frame it as 'flag customers likely to cancel next month', pull usage and billing tables, clean them in Pandas, explore who churns, build features like 'complaints last 30 days', train a classifier, evaluate on last quarter's data, deploy as a scoring API the CRM calls nightly.",
    code: null,
    engineering: "This maps cleanly onto a software delivery pipeline: data cleaning is your input validation, evaluation is your test suite, deployment is a release, and monitoring is production observability. Treat models like any other service that can regress.",
    whenToUse: [
      "Planning any end-to-end ML project",
      "Estimating effort — it reveals how much is data work vs modelling"
    ],
    whenNotToUse: [
      "A one-off analysis or dashboard may only need the first four steps"
    ],
    limitations: [
      "It looks linear but is highly iterative — you loop back constantly",
      "Real projects blur the boundaries between steps"
    ],
    keyTakeaway: "Modelling is a small slice; data understanding and cleaning dominate, and monitoring never really ends.",
    related: ["ds-ai-ml-overview", "pandas-cleaning", "mlops-lifecycle", "model-evaluation"],
    keywords: ["workflow", "lifecycle", "pipeline", "process", "eda", "deployment"],
    viz: null
  },
  {
    id: "anaconda",
    category: "fundamentals",
    title: "Anaconda & environments",
    difficulty: "Beginner",
    short: "A packaged Python distribution that solves the 'works on my machine' problem for data work.",
    definition: "Anaconda is a free distribution that bundles Python plus the core data-science libraries (NumPy, Pandas, Matplotlib, scikit-learn, Jupyter) and the conda tool for creating isolated environments.",
    why: "Installing scientific Python by hand is painful — packages depend on compiled libraries with conflicting versions. Anaconda ships them pre-built and lets each project have its own isolated set of versions.",
    problem: "Two projects need different versions of the same library, and installing one breaks the other. Environments give each project a sealed sandbox so they never collide.",
    howItWorks: "conda creates named environments, each a separate folder of installed packages. You activate an environment before working, and everything you install goes only into that environment. An environment.yml file records the exact packages so a teammate can recreate it.",
    example: "A data team ships environment.yml with every project. A new engineer runs one command, gets the exact library versions the model was trained with, and avoids subtle bugs from a newer Pandas behaving differently.",
    code: "# create and use an isolated environment\nconda create -n churn python=3.11 pandas scikit-learn\nconda activate churn\n\n# save it so others can reproduce\nconda env export > environment.yml",
    engineering: "Conda environments are the data-science equivalent of a virtualenv, Docker layer, or lockfile: reproducible dependency isolation. They make 'it worked in training' also true in production.",
    whenToUse: [
      "Any local data-science work where library versions matter",
      "Reproducing a colleague's or a course's exact setup"
    ],
    whenNotToUse: [
      "Lightweight cloud notebooks (Colab) that come pre-loaded",
      "Production containers where a slim pip + Docker image is leaner"
    ],
    limitations: [
      "Large install footprint (several GB)",
      "conda and pip can occasionally conflict if mixed carelessly"
    ],
    keyTakeaway: "Anaconda gives you batteries-included Python; conda environments keep every project's dependencies isolated and reproducible.",
    related: ["jupyter", "colab", "python-why"],
    keywords: ["anaconda", "conda", "environment", "virtualenv", "packages", "dependencies", "setup"],
    viz: null
  },
  {
    id: "jupyter",
    category: "fundamentals",
    title: "Jupyter Notebook",
    difficulty: "Beginner",
    short: "An interactive document that mixes runnable code, output and notes — the workbench of data science.",
    definition: "Jupyter Notebook is a browser-based tool where code is split into cells you run one at a time, with the results (tables, charts, text) shown inline right below each cell.",
    why: "Data work is exploratory: you load data, look, tweak, look again. A script that runs top-to-bottom is a poor fit. Notebooks let you iterate on one step without re-running everything, keeping data in memory.",
    problem: "Exploring data in a plain script means re-running the whole thing after every change and losing your place. Cells let you rerun just the part you changed and see results immediately beside the code.",
    howItWorks: "A notebook is a list of cells. Code cells execute in a persistent Python kernel, so variables set in one cell are available in the next. Markdown cells hold explanations. Output — including plots — renders inline, producing a shareable narrative of code + results.",
    example: "An analyst loads a sales CSV in cell 1, inspects it in cell 2, plots monthly revenue in cell 3, and writes a markdown conclusion in cell 4. The finished notebook reads like a report that also runs.",
    code: null,
    engineering: "Think of it as a REPL with memory and rich output. Great for exploration and demos, but notebooks hide execution order (you can run cells out of sequence), so promote settled logic into plain .py modules for production.",
    whenToUse: [
      "Exploratory analysis, prototyping, teaching, and sharing reproducible results",
      "Anything where seeing intermediate output speeds you up"
    ],
    whenNotToUse: [
      "Production pipelines and reusable libraries — use .py modules and tests",
      "Long-running jobs better suited to scripts or schedulers"
    ],
    limitations: [
      "Hidden state: out-of-order cell runs cause confusing bugs",
      "Version control (diffing) is messy because output is stored in the file"
    ],
    keyTakeaway: "Jupyter is the exploration workbench — code, output and notes together — but graduate proven code into real modules.",
    related: ["colab", "anaconda", "matplotlib"],
    keywords: ["jupyter", "notebook", "cells", "kernel", "interactive", "repl", "ipynb"],
    viz: null,
    comparison: {
      title: "Jupyter vs Google Colab",
      headers: ["Aspect", "Jupyter (local)", "Google Colab"],
      rows: [
        ["Where it runs", "Your machine", "Google's cloud"],
        ["Setup", "Install Anaconda first", "Just open a browser"],
        ["Free GPU/TPU", "Only your own hardware", "Yes, with limits"],
        ["Data privacy", "Stays local", "Uploaded to Google"],
        ["Best for", "Private data, full control", "Learning, sharing, GPU experiments"]
      ]
    }
  },
  {
    id: "colab",
    category: "fundamentals",
    title: "Google Colab",
    difficulty: "Beginner",
    short: "A free, zero-install Jupyter notebook in the cloud, with optional free GPUs.",
    definition: "Google Colaboratory is a hosted Jupyter environment that runs in the browser on Google's servers. Notebooks live in Google Drive, common libraries are pre-installed, and you can request a free GPU or TPU.",
    why: "It removes every setup barrier. A learner with only a browser can run real ML code in seconds, and get GPU acceleration for deep-learning experiments that their laptop couldn't handle.",
    problem: "Beginners often stall for hours on installation and driver issues before writing a single line. Colab skips all of that — open a link and run.",
    howItWorks: "Colab gives you a temporary virtual machine with a Python kernel. You write and run cells exactly like Jupyter. The machine resets after idle timeouts, so you re-run setup cells and reload data each session; files persist in Drive, not on the VM.",
    example: "A workshop shares one Colab link. Every participant opens it, runs the cells, and trains a small image classifier on a free GPU — no one installs anything.",
    code: "# a Colab cell can run shell commands and mount Drive\n!pip install scikit-learn --quiet\nfrom google.colab import drive\ndrive.mount('/content/drive')",
    engineering: "Colab is a disposable, shared dev sandbox. Perfect for demos and collaboration, but the ephemeral VM and data-goes-to-Google model make it unsuitable for sensitive production data.",
    whenToUse: [
      "Learning, tutorials and workshops with zero setup",
      "Quick GPU experiments without owning hardware",
      "Sharing a runnable notebook with a link"
    ],
    whenNotToUse: [
      "Confidential or regulated data",
      "Long training runs (sessions time out) or production jobs"
    ],
    limitations: [
      "Sessions and resources are time-limited and can be reclaimed",
      "Data uploaded leaves your environment; not for private datasets"
    ],
    keyTakeaway: "Colab is Jupyter-in-the-cloud with free GPUs and no setup — ideal for learning and sharing, not for private or long-running production work.",
    related: ["jupyter", "anaconda"],
    keywords: ["colab", "google", "cloud", "gpu", "notebook", "free", "setup"],
    viz: null
  }
];
