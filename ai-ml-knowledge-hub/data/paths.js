/* ============================================================
   Phase 10 — Guided learning paths.
   Ordered tracks that sequence topics across categories from
   beginner to advanced. Plain, hand-editable data: add a track
   or reorder `topics` and the UI updates automatically.
   `topics` are topic ids (see data/*.js); progress reuses the
   shared "completed" state.
   ============================================================ */
window.PATHS = [
  {
    id: "first-model",
    title: "Zero to your first ML model",
    level: "Beginner",
    blurb: "The shortest honest path from Python to a trained, evaluated model. Load data, clean it, train, and judge it properly.",
    topics: ["python-why", "pandas-dataframe", "pandas-loading", "pandas-cleaning", "ml-fundamentals", "train-test-split", "regression", "model-evaluation", "sklearn-workflow"]
  },
  {
    id: "stats-for-ml",
    title: "Statistics you actually need for ML",
    level: "Beginner",
    blurb: "Just the statistics that show up in machine learning — centre, spread, shape, relationships — no academic detours.",
    topics: ["descriptive-stats", "variance-std", "percentiles-iqr", "normal-distribution", "correlation", "probability-basics"]
  },
  {
    id: "llms-and-rag",
    title: "Understand LLMs & RAG",
    level: "Intermediate",
    blurb: "How modern generative AI works, ending with a RAG system that answers from your own documents — the flagship developer skill.",
    topics: ["generative-ai-llm", "tokens-embeddings", "prompt-engineering", "vector-search", "rag", "rag-vs-finetuning", "ai-applications"]
  },
  {
    id: "better-models",
    title: "Make your models actually good",
    level: "Intermediate",
    blurb: "The craft that separates a demo from a dependable model: features, the overfitting trap, leakage, tuning, and stronger algorithms.",
    topics: ["feature-engineering", "standardization", "overfitting", "data-leakage", "classification", "clustering", "decision-trees", "hyperparameter-tuning"]
  },
  {
    id: "to-production",
    title: "From model to production (MLOps)",
    level: "Advanced",
    blurb: "Ship it and keep it working: the lifecycle, deployment, drift monitoring, retraining, and building responsibly.",
    topics: ["data-science-workflow", "sklearn-workflow", "mlops-lifecycle", "mlops-monitoring", "ai-ethics"]
  },
  {
    id: "deep-learning",
    title: "Deep learning foundations",
    level: "Advanced",
    blurb: "Open the neural-network black box: neurons and layers, how they learn, and the architectures behind vision and language.",
    topics: ["neural-networks", "activation-loss", "gradient-descent", "cnn-rnn-transformers"]
  }
];
