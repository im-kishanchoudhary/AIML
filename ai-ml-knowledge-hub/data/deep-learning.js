window.KB = window.KB || {};
window.KB["deep-learning"] = [
  {
    id: "neural-networks",
    category: "deep-learning",
    title: "Neural networks: neurons, layers & weights",
    difficulty: "Intermediate",
    short: "Stacked layers of simple units that learn complex patterns directly from raw data.",
    definition: "A neural network is a model made of layers of connected 'neurons'. Each neuron computes a weighted sum of its inputs plus a bias, passes it through an activation function, and sends the result forward. Stacking layers lets the network learn increasingly abstract patterns.",
    why: "Classic ML needs hand-crafted features. Neural networks can learn features themselves from raw data — pixels, audio, text — which is why they power image recognition, speech and modern language models.",
    problem: "Some relationships are too complex and non-linear for a line or a tree, and too tedious to feature-engineer by hand (e.g. recognizing a cat in a photo). Deep networks learn these mappings directly from examples.",
    howItWorks: "Data enters the input layer, flows through hidden layers, and exits the output layer. Each connection has a weight; each neuron adds a bias and applies an activation (adding non-linearity). Training feeds data forward, measures error with a loss function, then uses backpropagation + gradient descent to nudge every weight toward less error — repeated over many passes.",
    example: "A digit recognizer takes 784 pixel values in, passes them through hidden layers that learn edges then shapes, and outputs 10 probabilities (0–9). Trained on labelled images, it learns the visual features itself — no manual rules.",
    code: "from sklearn.neural_network import MLPClassifier\nnn = MLPClassifier(hidden_layer_sizes=(64, 32), max_iter=300)\nnn.fit(X_train, y_train)   # features are learned across layers\nprint(nn.score(X_test, y_test))",
    engineering: "A trained network is still just a function (a big pile of weights) you call for inference. The heavy cost is training; inference can be cheap. Frameworks (PyTorch/TensorFlow) handle the calculus, and models deploy behind APIs like any other.",
    whenToUse: [
      "Complex, non-linear patterns in raw data: images, audio, text",
      "When you have lots of data and manual features fall short"
    ],
    whenNotToUse: [
      "Small tabular datasets — classic ML is often better and cheaper",
      "When interpretability is essential (networks are hard to explain)"
    ],
    limitations: [
      "Data- and compute-hungry; easy to overfit",
      "A 'black box' — hard to explain individual predictions"
    ],
    keyTakeaway: "Neural nets stack layers of weighted-sum-plus-activation units to learn features from raw data. Powerful for images/text, but data-hungry and hard to interpret.",
    related: ["activation-loss", "gradient-descent", "cnn-rnn-transformers", "standardization"],
    keywords: ["neural network", "neuron", "layers", "weights", "bias", "deep learning", "perceptron"],
    viz: "neural-net"
  },
  {
    id: "activation-loss",
    category: "deep-learning",
    title: "Activation & loss functions",
    difficulty: "Intermediate",
    short: "Activations add the non-linearity that makes networks powerful; loss functions define what 'wrong' means.",
    definition: "An activation function transforms a neuron's output non-linearly (e.g. ReLU, sigmoid), letting the network model curves, not just lines. A loss function measures how far predictions are from the truth — the single number training tries to minimize.",
    why: "Without activations, stacking layers collapses to one linear model — no matter how deep. And without a loss, the network has no target to improve against. Together they make learning possible.",
    problem: "You need networks to learn non-linear patterns (activations) and a precise, differentiable definition of error to optimize (loss). These two choices shape what and how well the network learns.",
    howItWorks: "Activations: ReLU (max(0, x)) is the common default — fast and avoids some training problems; sigmoid squashes a value to 0–1 for probabilities; softmax turns outputs into a probability distribution over classes. Losses: mean squared error for regression, cross-entropy for classification. Training minimizes the loss via gradient descent.",
    example: "A digit classifier uses ReLU in hidden layers and softmax at the output (10 class probabilities), trained with cross-entropy loss. Cross-entropy punishes confident wrong answers hard, pushing the network toward calibrated predictions.",
    code: "# conceptual: ReLU activation and MSE loss\nimport numpy as np\nrelu = lambda x: np.maximum(0, x)\nmse = lambda y, p: np.mean((y - p) ** 2)\nprint(relu(np.array([-2, 0, 3])))  # [0 0 3]",
    engineering: "These are configuration choices with sensible defaults: ReLU + cross-entropy for classification, ReLU + MSE for regression. Knowing them helps you read model code and debug training that won't converge.",
    whenToUse: [
      "Designing or reading any neural network",
      "Choosing output activation/loss to match the task (regression vs classification)"
    ],
    whenNotToUse: [
      "Classic ML models that don't use them"
    ],
    limitations: [
      "Wrong activation/loss pairing stalls or breaks training",
      "Some activations cause vanishing/exploding gradients in deep nets"
    ],
    keyTakeaway: "Activations (ReLU, softmax) inject non-linearity; loss (MSE, cross-entropy) defines error. Match the output activation and loss to the task.",
    related: ["neural-networks", "gradient-descent", "model-evaluation"],
    keywords: ["activation", "relu", "sigmoid", "softmax", "loss function", "cross-entropy", "mse"],
    viz: null
  },
  {
    id: "gradient-descent",
    category: "deep-learning",
    title: "Gradient descent & backpropagation",
    difficulty: "Advanced",
    short: "The learning engine: measure the error's slope and step downhill until the model improves.",
    definition: "Gradient descent is the optimization algorithm that adjusts model weights to minimize the loss by repeatedly stepping in the direction that reduces error most. Backpropagation is the efficient method for computing, for every weight, how much it contributed to the error.",
    why: "This is literally how models 'learn'. Every neural network — including the largest language models — is trained by some form of gradient descent. Understanding it demystifies training entirely.",
    problem: "A network has millions of weights; you can't try values by hand. Gradient descent gives a principled, automatic way to nudge all of them, together, toward lower error.",
    howItWorks: "Imagine the loss as a hilly landscape and you want the lowest valley. The gradient is the slope; you take a step downhill sized by the learning rate, then recompute and step again. Backpropagation uses the chain rule to find each weight's share of the error in one efficient backward pass. Too-large a learning rate overshoots; too-small crawls.",
    example: "Training a price model: predictions start random with huge loss. Each step, gradient descent shifts the weights slightly to fit the data better; after thousands of steps the loss flattens and the model has 'learned' — the classic loss-going-down curve.",
    code: "# one gradient-descent step on a simple linear model\nlr = 0.01\nfor _ in range(1000):\n    pred = X @ w\n    grad = X.T @ (pred - y) / len(y)   # slope of the loss\n    w -= lr * grad                     # step downhill\n",
    engineering: "You rarely implement it — frameworks do — but you tune it: the learning rate is the key knob, and the falling loss curve is your primary training-health signal. A loss that won't drop or explodes points straight at the learning rate or data.",
    whenToUse: [
      "Training neural networks and many other ML models",
      "Understanding/debugging why training isn't converging"
    ],
    whenNotToUse: [
      "Models with closed-form solutions or tree-based methods that don't use it"
    ],
    limitations: [
      "Can get stuck in poor minima; sensitive to learning rate",
      "Needs differentiable loss and can be compute-intensive"
    ],
    keyTakeaway: "Gradient descent steps weights downhill on the loss landscape; backprop computes each weight's contribution efficiently. The learning rate is the critical dial.",
    related: ["neural-networks", "activation-loss", "hyperparameter-tuning"],
    keywords: ["gradient descent", "backpropagation", "learning rate", "optimization", "loss curve", "chain rule"],
    viz: null
  },
  {
    id: "cnn-rnn-transformers",
    category: "deep-learning",
    title: "CNNs, RNNs & Transformers",
    difficulty: "Advanced",
    short: "Specialized network architectures for images, sequences, and — the big one — language.",
    definition: "Architectures tailored to data types. CNNs (convolutional) excel at images by detecting local patterns. RNNs process sequences step by step, keeping a memory. Transformers use 'attention' to weigh all parts of a sequence at once and are the foundation of modern LLMs.",
    why: "A plain fully-connected network ignores structure — the grid of an image or the order of words. These architectures bake in the right assumptions, which is why each dominates its domain.",
    problem: "Recognizing objects needs spatial awareness (CNN); understanding a sentence needs word order and long-range context (Transformer). The architecture must match the data's structure to learn efficiently.",
    howItWorks: "CNNs slide small filters over an image to detect edges → shapes → objects, reusing weights across positions. RNNs feed each step's output back as input, carrying a memory but struggling with long sequences. Transformers use self-attention: every token looks at every other and decides what to focus on, capturing long-range context in parallel — the breakthrough behind GPT-style models.",
    example: "CNN: a phone recognizing faces in photos. RNN: older word-by-word text prediction. Transformer: ChatGPT reading your whole prompt and attending to the relevant parts to generate a coherent answer.",
    code: null,
    engineering: "You'll usually consume these as pre-trained models via APIs or libraries rather than build them. Knowing the family tells you the strengths: CNN for vision, Transformer for language and increasingly everything else.",
    whenToUse: [
      "CNN for images/video, Transformer for text and language tasks",
      "When leveraging pre-trained models for your domain"
    ],
    whenNotToUse: [
      "Simple tabular problems — classic ML is cheaper and often better",
      "When you lack the data/compute to train from scratch (use pre-trained)"
    ],
    limitations: [
      "Large ones need significant compute and data",
      "Transformers scale cost with sequence length (context window limits)"
    ],
    keyTakeaway: "Match architecture to data: CNN for images, RNN for sequences (mostly superseded), Transformer + attention for language — the backbone of today's LLMs.",
    related: ["neural-networks", "generative-ai-llm", "tokens-embeddings"],
    keywords: ["cnn", "rnn", "transformer", "attention", "convolution", "architecture", "sequence"],
    viz: null
  }
];
