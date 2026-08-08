/* ============================================================
   Phase 11 — End-of-path quizzes (auto-graded).
   One small multiple-choice set per learning path. `answer` is
   the 0-based index of the correct option; `topic` links a wrong
   answer to the topic it tests (feeds the "weak spots" list).
   Plain, hand-editable data — add questions freely.
   ============================================================ */
window.QUIZZES = {
  "first-model": [
    { q: "Why do we evaluate a model on a separate test set?", options: ["To make training faster", "To measure performance on unseen data", "To shrink the dataset", "To choose the learning rate"], answer: 1, topic: "train-test-split", explain: "The test set estimates real-world performance on data the model never trained on." },
    { q: "Linear regression predicts…", options: ["A category", "A continuous number", "A cluster id", "Only a probability"], answer: 1, topic: "regression", explain: "Regression outputs a continuous value; classification outputs a category." },
    { q: "On a 99%-legit fraud dataset, which single metric is most misleading?", options: ["Precision", "Recall", "Accuracy", "F1"], answer: 2, topic: "model-evaluation", explain: "'Always legit' scores 99% accuracy while catching zero fraud — accuracy hides this." }
  ],
  "stats-for-ml": [
    { q: "Which summary is most robust to outliers?", options: ["Mean", "Median", "Sum", "Range"], answer: 1, topic: "descriptive-stats", explain: "The median is the middle value, unaffected by extreme values." },
    { q: "Standard deviation measures…", options: ["The centre", "The spread around the mean", "The most frequent value", "The correlation"], answer: 1, topic: "variance-std", explain: "Std is the typical distance of values from the mean." },
    { q: "A correlation of 0.9 between two variables means…", options: ["One causes the other", "They move together strongly", "They are unrelated", "One is the mean of the other"], answer: 1, topic: "correlation", explain: "Strong linear co-movement — but correlation never proves causation." }
  ],
  "llms-and-rag": [
    { q: "RAG improves an LLM answer by…", options: ["Retraining the model each query", "Retrieving relevant documents into the prompt", "Making the model larger", "Lowering temperature"], answer: 1, topic: "rag", explain: "RAG retrieves relevant context and has the model answer from it — no retraining." },
    { q: "An embedding is…", options: ["A compressed image", "A vector capturing meaning", "A database index", "A prompt template"], answer: 1, topic: "tokens-embeddings", explain: "Embeddings place similar meanings close together in vector space." },
    { q: "You need answers from frequently-changing private docs. Best choice?", options: ["Fine-tuning", "RAG", "A bigger model", "Prompt only"], answer: 1, topic: "rag-vs-finetuning", explain: "RAG updates instantly by editing documents; fine-tuning would need retraining." }
  ],
  "better-models": [
    { q: "A model scores 99% on train but 70% on test. This is…", options: ["Underfitting", "Overfitting", "Perfect generalization", "A scaling bug"], answer: 1, topic: "overfitting", explain: "Great on train, poor on unseen data = memorized noise = overfitting." },
    { q: "Fitting a scaler on ALL data before splitting causes…", options: ["Faster training", "Data leakage", "Better fairness", "Nothing"], answer: 1, topic: "data-leakage", explain: "The test set influences training — an inflated, dishonest score." },
    { q: "Which models generally need feature scaling?", options: ["Decision trees", "Random forests", "K-means / KNN", "None"], answer: 2, topic: "standardization", explain: "Distance-based models need scaling; tree-based models are scale-invariant." }
  ],
  "to-production": [
    { q: "Data drift is…", options: ["A code bug", "Input data shifting away from training data", "A type of overfitting", "A deployment tool"], answer: 1, topic: "mlops-monitoring", explain: "The world changes, inputs drift, and accuracy silently degrades." },
    { q: "MLOps is best described as…", options: ["A cloud vendor", "DevOps discipline for the ML lifecycle", "A Python library", "A model type"], answer: 1, topic: "mlops-lifecycle", explain: "Versioning, automation, monitoring and retraining for models." },
    { q: "Removing an obviously sensitive feature guarantees fairness?", options: ["Yes", "No — proxy features remain", "Only for trees", "Only with RAG"], answer: 1, topic: "ai-ethics", explain: "Proxies (e.g. postcode for race) can still encode the sensitive attribute." }
  ],
  "deep-learning": [
    { q: "Without non-linear activation functions, stacking layers…", options: ["Learns images", "Collapses to one linear model", "Speeds training", "Prevents overfitting"], answer: 1, topic: "activation-loss", explain: "Non-linearity is what lets deep networks model complex patterns." },
    { q: "Gradient descent minimizes…", options: ["Accuracy", "The loss function", "The dataset", "The learning rate"], answer: 1, topic: "gradient-descent", explain: "It steps weights downhill on the loss to reduce error." },
    { q: "The architecture behind modern LLMs is the…", options: ["CNN", "RNN", "Transformer", "Decision tree"], answer: 2, topic: "cnn-rnn-transformers", explain: "Transformers use self-attention to weigh all tokens at once." }
  ]
};
