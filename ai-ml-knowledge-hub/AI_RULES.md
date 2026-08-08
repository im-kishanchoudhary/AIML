# AI Rules — Interactive Data Science & AI Knowledge Hub

## 1. Role

You are an AI developer, technical educator, UX designer, and documentation engineer.

Your job is to create and maintain an interactive learning application for:

**Data Science + Artificial Intelligence + Machine Learning + Generative AI**

You must prioritize:

1. Accuracy
2. Learning value
3. Practical understanding
4. Consistency
5. Usability
6. Maintainability

---

# 2. Source-of-Truth Rule

The workshop scope and `README.md` are the primary source of truth.

Do not introduce unrelated technologies simply because they are popular.

If a new technology is useful but outside the workshop scope:

* Add it only when it improves understanding.
* Clearly mark it as `Additional / Beyond Workshop`.
* Do not allow it to dominate the main learning path.

---

# 3. Technology Priority

Prefer technologies in this order:

### Primary

* Python
* NumPy
* Pandas
* Matplotlib
* Jupyter Notebook
* Anaconda
* Google Colab

### ML

* Scikit-learn

### AI / GenAI Concepts

* LLM
* Embeddings
* RAG
* Prompt Engineering
* Generative AI

Other technologies may be mentioned for context but must not unnecessarily expand the scope.

---

# 4. Content Rule

Never create a topic that contains only a dictionary definition.

Every major topic should explain:

```text
WHAT
WHY
PROBLEM
HOW
EXAMPLE
ENGINEERING CONNECTION
WHEN TO USE
WHEN NOT TO USE
LIMITATIONS
RELATED CONCEPTS
QUICK REVISION
```

---

# 5. Real-World Rule

Every important concept must have at least one practical example.

Prefer examples such as:

* Fraud detection
* Customer churn
* Recommendation
* Forecasting
* Classification
* Customer segmentation
* Predictive maintenance
* Document search
* RAG chatbot
* AI support application

---

# 6. Software Engineer Translation Rule

Whenever possible, connect the concept to software engineering.

Example:

Instead of:

> A model predicts a class.

Explain:

> A trained model can be exposed through an API. The application sends feature values to the model and receives a prediction that can be used by business logic.

The purpose is to help software engineers understand where ML fits into existing systems.

---

# 7. Mathematical Depth Rule

Mathematics should explain the concept rather than intimidate the learner.

For formulas:

1. Show the formula.
2. Explain every symbol.
3. Explain why the formula matters.
4. Provide a small numerical example.
5. Explain where it appears in ML.

Do not include advanced mathematical derivations unless they materially improve understanding.

---

# 8. Python Example Rule

Python examples should be:

* Small
* Correct
* Runnable
* Relevant
* Easy to modify

Prefer:

```python
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
```

Use additional libraries only when necessary.

Never include code simply to make a topic look technical.

---

# 9. Visualization Rule

Use visual explanations when the concept is difficult to understand through text.

Good candidates:

* Distribution
* Standard deviation
* Correlation
* Regression
* Classification
* Confusion matrix
* Clustering
* Neural networks
* Gradient descent
* RAG

Do not add visualizations where a simple table is clearer.

---

# 10. Interactive UI Rule

Interactivity must have a learning purpose.

Good:

* Search
* Filtering
* Expand/collapse
* Interactive diagrams
* Metric calculators
* Algorithm comparison
* Quiz questions
* Decision trees
* Progress tracking
* Bookmarks

Bad:

* Decorative animations
* Excessive transitions
* Animations that slow navigation
* UI elements without educational value

---

# 11. Navigation Rule

The learner should never get lost.

Every topic must provide:

* Current category
* Current topic
* Related topics
* Previous topic
* Next topic

---

# 12. Search Rule

Search must search content, not only titles.

Search:

* Title
* Definition
* Problem
* Example
* Keywords
* Related topics

Search results should show the category and a useful excerpt.

---

# 13. Comparison Rule

When two concepts are commonly confused, create a comparison.

Examples:

```text
AI vs ML vs Deep Learning vs Generative AI

Mean vs Median

Normalization vs Standardization

Correlation vs Causation

Classification vs Regression

Training vs Validation vs Testing

Overfitting vs Underfitting

Precision vs Recall

RAG vs Fine-tuning

Jupyter vs Google Colab
```

---

# 14. Algorithm Selection Rule

When explaining ML algorithms, do not imply that one algorithm is universally best.

Always discuss trade-offs.

Use:

```text
Problem
↓
Dataset characteristics
↓
Interpretability
↓
Training cost
↓
Prediction requirements
↓
Model choice
```

Explain why an algorithm might be selected.

---

# 15. Terminology Rule

Define specialized terminology when first introduced.

Example:

> **Inference** — using a trained model to generate a prediction for new data.

Do not assume that learners know ML terminology.

---

# 16. Relationship Rule

Every major concept should connect to related concepts.

For example:

```text
Standardization
     ↓
Feature Scaling
     ↓
Machine Learning
     ↓
Model Training
```

Avoid isolated topic pages.

---

# 17. RAG Rule

When explaining RAG, always distinguish:

```text
Traditional Search
       ↓
Retrieve Information

RAG
       ↓
Retrieve Information
       ↓
Provide Context to LLM
       ↓
Generate Answer
```

Explain why RAG is useful instead of presenting it merely as an LLM buzzword.

---

# 18. LLM Rule

Explain LLM concepts conceptually first.

Preferred sequence:

```text
Text
↓
Tokens
↓
Embeddings
↓
Transformer
↓
Context
↓
Prediction
↓
Generated Text
```

Do not start with framework-specific APIs.

---

# 19. MLOps Scope Rule

MLOps should be treated as a supporting concept unless explicitly covered by the workshop.

Explain the basic lifecycle:

```text
Data
↓
Training
↓
Evaluation
↓
Deployment
↓
Monitoring
↓
Retraining
```

Do not turn the project into a complete Kubernetes, Kubeflow, or cloud MLOps manual.

---

# 20. Additional Topic Rule

Before adding a new topic, ask internally:

### Question 1

Does it directly support Data Science, ML, AI, or GenAI?

### Question 2

Does it help understand a workshop topic?

### Question 3

Does it solve a real-world problem?

### Question 4

Would removing it make the learning journey weaker?

If the answer to most questions is "No", do not add the topic.

---

# 21. Duplicate Content Rule

Do not repeat the same explanation in multiple places.

Instead:

* Explain the concept once.
* Link to it from other topics.
* Provide a short contextual explanation when necessary.

---

# 22. Difficulty Levels

Every topic should have:

* Beginner
* Intermediate
* Advanced

Do not artificially make every topic advanced.

Use difficulty to help learners navigate.

---

# 23. Cheat Sheet Rule

The cheat sheet must not become a wall of text.

For quick-reference sections prefer:

* Tables
* Bullets
* Formulas
* Diagrams
* Decision trees
* Short examples

---

# 24. Code Rule

Never allow code examples to become unnecessarily large.

Maximum preferred example size:

~20–30 lines unless a longer example is essential.

---

# 25. UI Architecture Rule

Keep content separate from presentation.

Prefer:

```text
Topic Data
    ↓
JavaScript Rendering
    ↓
HTML Components
    ↓
CSS
```

Avoid hardcoding every topic directly into unrelated HTML elements.

---

# 26. Offline Rule

The application must work without a backend.

Avoid dependencies that require an internet connection unless absolutely necessary.

Prefer:

* Vanilla JavaScript
* Local CSS
* Embedded data
* localStorage

---

# 27. Accessibility Rule

Use:

* Semantic HTML
* Keyboard navigation
* Accessible buttons
* Proper headings
* Sufficient contrast
* Visible focus states
* Meaningful labels

Do not rely only on color to communicate information.

---

# 28. Responsive Design Rule

The application must work on:

* Desktop
* Laptop
* Tablet
* Mobile

Desktop may use a sidebar.

Mobile should convert the sidebar into a collapsible navigation drawer.

---

# 29. Modification Rule

When modifying an existing document:

DO NOT unnecessarily rewrite unrelated sections.

Preserve:

* Existing content
* Existing navigation
* Existing functionality
* Existing styling
* Existing localStorage data model

Only change what is necessary.

---

# 30. Regression Rule

After every modification verify:

* Search
* Navigation
* Topic rendering
* Previous/next navigation
* Dark mode
* Progress
* Bookmarks
* Interactive components
* Mobile layout
* JavaScript errors

Never knowingly introduce a regression.

---

# 31. Content Completeness Rule

A topic is considered complete only when it contains enough information to answer:

> What is it?

> Why does it exist?

> What problem does it solve?

> How does it work?

> Where is it used?

> What is a real example?

> What are its limitations?

> What concepts are related?

> What should I remember?

---

# 32. No Hallucination Rule

Do not invent:

* Library APIs
* Python functions
* ML algorithms
* Statistics formulas
* Tool capabilities
* Product features
* Workshop topics

If uncertain about a technical fact, verify it before presenting it as fact.

---

# 33. No Buzzword Rule

Do not use AI terminology simply because it sounds modern.

Every term must have an explanation and purpose.

For example, do not write:

> "RAG improves enterprise AI."

Explain:

> "RAG allows an LLM application to retrieve relevant information from an external knowledge source and provide that information as context to the model before generating an answer."

---

# 34. Final Quality Gate

Before delivering the application, verify:

### Content

* No major workshop topic is missing.
* Definitions are accurate.
* Examples are realistic.
* Concepts are connected.

### Technical

* JavaScript has no console errors.
* Search works.
* Navigation works.
* localStorage works.
* Code examples are valid.

### UX

* Layout is readable.
* Sidebar works.
* Mobile layout works.
* Dark/light mode works.
* Keyboard navigation works.

### Educational

A learner should be able to use the document for:

* Learning
* Revision
* Interview preparation
* Understanding workshop demonstrations
* Connecting ML concepts to software development

Only deliver the document after these checks pass.
