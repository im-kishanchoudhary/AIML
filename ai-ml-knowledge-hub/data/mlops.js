window.KB = window.KB || {};
window.KB.mlops = [
  {
    id: "mlops-lifecycle",
    category: "mlops",
    title: "MLOps: the model lifecycle",
    difficulty: "Intermediate",
    short: "Treating models like production software — the loop from data to deployment to retraining.",
    definition: "MLOps (Machine Learning Operations) applies software-engineering discipline to the ML lifecycle: versioning data and models, automating training, testing, deploying, monitoring, and retraining — so models stay reliable in production, not just in a notebook.",
    why: "A model that works in a notebook is not a product. Data changes, dependencies drift, and performance degrades over time. MLOps is what keeps a deployed model trustworthy and maintainable — the bridge from experiment to reliable service.",
    problem: "Teams ship a great model, then it silently rots: the world shifts, accuracy drops, and no one notices until customers complain. MLOps adds the versioning, automation and monitoring that catch and fix this.",
    howItWorks: "The lifecycle loops: Data → Training → Evaluation → Deployment → Monitoring → (drift detected) → Retraining → back to Data. Each stage borrows from DevOps: version data and models (not just code), automate the pipeline (CI/CD for ML), test models before release, and monitor live performance to trigger retraining.",
    example: "A fraud model is retrained monthly on fresh data through an automated pipeline. Every version is tracked; each candidate is tested against a held-out set before it can replace the live model; production metrics are watched to decide when to retrain sooner.",
    code: "# a model is a versioned, deployable artifact\nimport joblib\njoblib.dump(pipeline, 'fraud_model_v7.joblib')   # version it\n# ...served behind an API; monitored; retrained on schedule",
    engineering: "MLOps is DevOps with two extra things to version and watch: data and models, not just code. If you know CI/CD, testing and observability, you already know 80% of it — the new parts are data/model versioning and drift monitoring.",
    whenToUse: [
      "Any model that will run in production and must stay reliable",
      "When models need regular retraining as data evolves"
    ],
    whenNotToUse: [
      "One-off analyses or throwaway experiments",
      "Over-engineering heavy platforms for a single simple model"
    ],
    limitations: [
      "Adds tooling and process overhead",
      "Full platforms (Kubernetes/Kubeflow) are overkill for small teams"
    ],
    keyTakeaway: "MLOps = DevOps for ML: version data + models, automate the pipeline, and monitor + retrain so a deployed model keeps working as the world changes.",
    related: ["data-science-workflow", "mlops-monitoring", "sklearn-workflow"],
    keywords: ["mlops", "lifecycle", "deployment", "ci/cd", "versioning", "operations", "production"],
    viz: null
  },
  {
    id: "mlops-monitoring",
    category: "mlops",
    title: "Deployment, monitoring & drift",
    difficulty: "Intermediate",
    short: "Serving a model as an API, then watching for the silent decay that data drift causes.",
    definition: "Deployment exposes a trained model so applications can use it, usually as an API endpoint. Monitoring tracks its live inputs and predictions to detect data drift — when incoming data drifts away from what the model was trained on — which degrades accuracy over time.",
    why: "Unlike ordinary code, a model can fail without any error: it keeps returning predictions, just increasingly wrong ones, as the world changes. Monitoring is the only way to catch this silent decay before it hurts the business.",
    problem: "A demand-forecasting model trained pre-pandemic keeps predicting confidently as buying patterns shift — quietly wrong for months. Drift monitoring flags that inputs no longer look like the training data, triggering retraining.",
    howItWorks: "Deploy the fitted model (often the whole preprocessing+model pipeline) behind an API; the app sends features and gets predictions. In parallel, log inputs and outputs and compare their distributions over time to training data. When drift or an accuracy drop crosses a threshold, alert and retrain on fresh data.",
    example: "A churn model is served as a scoring API the CRM calls nightly. A dashboard tracks the input distributions and weekly accuracy; when a feature's distribution shifts and accuracy dips, the team retrains — closing the MLOps loop.",
    code: "# model behind an API endpoint (conceptual)\n@app.post('/predict')\ndef predict(features):\n    x = preprocess(features)\n    p = model.predict_proba([x])[0][1]\n    log(features, p)            # for drift monitoring\n    return {'churn_probability': p}",
    engineering: "Deployment is standard service engineering (an endpoint, scaling, latency). The ML-specific addition is monitoring the *data and predictions*, not just uptime — because a healthy-looking service can still be quietly making bad predictions.",
    whenToUse: [
      "Any production model consumed by applications",
      "Whenever input data can shift over time (almost always)"
    ],
    whenNotToUse: [
      "Static, one-time batch scoring with no ongoing use"
    ],
    limitations: [
      "Detecting drift and its impact on accuracy is non-trivial",
      "Ground-truth labels for live accuracy often arrive late or not at all"
    ],
    keyTakeaway: "Serving a model is normal API work; the ML-specific job is monitoring inputs and predictions for drift, because models fail silently as data changes.",
    related: ["mlops-lifecycle", "ai-applications", "model-evaluation"],
    keywords: ["deployment", "monitoring", "data drift", "api", "serving", "retraining", "observability"],
    viz: null
  }
];
