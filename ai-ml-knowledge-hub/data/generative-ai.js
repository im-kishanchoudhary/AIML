window.KB = window.KB || {};
window.KB["generative-ai"] = [
  {
    id: "generative-ai-llm",
    category: "generative-ai",
    title: "Generative AI & Large Language Models (LLMs)",
    difficulty: "Beginner",
    short: "Models that generate new content by predicting what comes next, learned from massive text corpora.",
    definition: "Generative AI creates new content (text, images, code) rather than only classifying or predicting numbers. A Large Language Model is a Transformer trained on enormous text collections to predict the next token, which — at scale — produces fluent, useful language.",
    why: "LLMs shifted AI from 'predict a label' to 'produce content and reason in language'. For engineers, they turn hard NLP tasks (summarize, extract, translate, draft, answer) into a single API call, unlocking new product categories.",
    problem: "Tasks like summarizing documents, drafting replies, or answering questions used to need bespoke models each. One LLM handles many of them from a natural-language instruction, collapsing months of ML work into a prompt.",
    howItWorks: "Text is broken into tokens; the model, trained on huge corpora, predicts the next token given the previous ones, over and over, to generate output. Because it learned patterns of language and facts from its training data, it can follow instructions, but it predicts plausible text — it does not 'know' truth.",
    example: "A support tool sends a customer's message plus an instruction to an LLM API and gets back a drafted, on-brand reply in one call. An agent might then summarize the thread and tag it — all from prompts, no trained classifier.",
    code: "# conceptual: calling an LLM is just an API request\nresponse = llm.complete(\n    prompt='Summarize this ticket in one sentence:\\n' + ticket_text\n)\nprint(response)   # generated summary text",
    engineering: "An LLM is a stateless text-in/text-out service you call over HTTP. Your engineering job is everything around it: prompt construction, providing context (see RAG), validating outputs, handling cost/latency, and guarding against bad responses.",
    whenToUse: [
      "Language tasks: summarize, draft, extract, translate, answer, classify",
      "Rapid prototyping of features that once needed custom NLP models"
    ],
    whenNotToUse: [
      "Precise numeric prediction on tabular data (use classic ML)",
      "Tasks needing guaranteed correctness without verification"
    ],
    limitations: [
      "Hallucinations: confident, fluent, sometimes wrong output",
      "Knowledge frozen at training time; cost, latency and context limits"
    ],
    keyTakeaway: "LLMs generate text by predicting the next token; they're powerful language engines you call as an API — but they produce plausible text, not guaranteed truth.",
    related: ["tokens-embeddings", "prompt-engineering", "rag", "cnn-rnn-transformers"],
    keywords: ["generative ai", "llm", "large language model", "gpt", "next token", "text generation"],
    viz: null
  },
  {
    id: "tokens-embeddings",
    category: "generative-ai",
    title: "Tokens & embeddings",
    difficulty: "Intermediate",
    short: "How text becomes numbers — the pieces models read (tokens) and their meaning as vectors (embeddings).",
    definition: "A token is a chunk of text (a word or word-piece) that a model reads as one unit. An embedding is a list of numbers (a vector) representing a token, word or document such that similar meanings sit close together in that numeric space.",
    why: "Models can't read text directly — everything must be numbers. Tokens define how text is chopped up (and how cost/limits are measured), and embeddings capture meaning numerically, which powers search, similarity and RAG.",
    problem: "How do you let a computer find documents 'about the same thing' even with different words? Embeddings place similar meanings near each other, so 'car' and 'automobile' land close — enabling semantic search that keywords miss.",
    howItWorks: "Text → tokenizer → tokens (e.g. 'unhappiness' → 'un', 'happiness'). Each token/passage is mapped to an embedding vector; distance between vectors reflects semantic similarity. LLM pricing and context limits are counted in tokens. Embeddings are produced by a model and stored for fast similarity search.",
    example: "A help centre embeds every article once. When a user asks a question, it embeds the question and finds the nearest article vectors — returning relevant help even when the user's words don't match the article's exactly.",
    code: "# conceptual: embed text into a vector, compare by similarity\nq = embed('how do I reset my password')\ndoc = embed('steps to change your account password')\nsimilarity = cosine(q, doc)   # high => same meaning\nprint(round(similarity, 2))",
    engineering: "Embeddings turn 'meaning' into vectors you can index in a vector database and query by nearest-neighbour — the backbone of semantic search and RAG. Track token counts: they drive API cost and context-window limits.",
    whenToUse: [
      "Semantic search, recommendation, deduplication, clustering of text",
      "Building the retrieval half of a RAG system"
    ],
    whenNotToUse: [
      "Exact keyword/ID lookups (a normal index is better)",
      "When simple string matching already suffices"
    ],
    limitations: [
      "Embedding quality depends on the model and domain",
      "Vectors are opaque; storage/indexing adds infrastructure"
    ],
    keyTakeaway: "Tokens are the text pieces models read (and bill for); embeddings turn meaning into vectors so 'similar' becomes 'close' — enabling semantic search and RAG.",
    related: ["generative-ai-llm", "vector-search", "rag"],
    keywords: ["token", "tokenization", "embedding", "vector", "semantic", "similarity", "cosine"],
    viz: null
  },
  {
    id: "prompt-engineering",
    category: "generative-ai",
    title: "Prompt engineering",
    difficulty: "Beginner",
    short: "Designing the instructions and context you give an LLM to get reliable, useful output.",
    definition: "The practice of crafting the input to an LLM — instructions, examples, context and format specifications — to steer it toward accurate, consistent and useful responses.",
    why: "The same model gives wildly different results depending on how you ask. Because the prompt is your main control surface (short of training), prompt design is often the fastest, cheapest way to improve an AI feature.",
    problem: "A vague prompt ('summarize this') yields inconsistent, unusable output. A precise one (role, task, constraints, output format, examples) yields reliable results you can parse and ship.",
    howItWorks: "Effective prompts typically set a role, state the task clearly, provide relevant context, give one or a few examples (few-shot), and specify the exact output format (e.g. JSON). Techniques like 'think step by step' (chain-of-thought) improve reasoning tasks. You iterate on the prompt like you'd iterate on code.",
    example: "Instead of 'classify this review', a shipped prompt says: 'You are a support classifier. Categorize the review as one of [billing, bug, praise]. Respond only with JSON {\"category\": ...}.' Now the output is parseable and consistent.",
    code: "prompt = '''You extract data. From the email below, return JSON with\nkeys: name, order_id, issue. Email:\n\"\"\"{email}\"\"\"'''\nresponse = llm.complete(prompt.format(email=email_text))\ndata = json.loads(response)",
    engineering: "Treat prompts as versioned source code: store them, test them against example inputs, and validate the model's output (schema-check JSON) before using it. Specifying an output format is what makes an LLM safe to wire into code.",
    whenToUse: [
      "Any LLM feature — it's your primary tuning lever",
      "Getting structured, parseable output for downstream logic"
    ],
    whenNotToUse: [
      "As a fix for missing knowledge — provide context (RAG) instead",
      "When behaviour needs to be guaranteed, not merely steered"
    ],
    limitations: [
      "Brittle: small wording changes can shift results",
      "Model- and version-specific; prompts may need re-tuning"
    ],
    keyTakeaway: "The prompt is your main control surface: role + task + context + examples + explicit output format. Version and test prompts like code, and validate outputs.",
    related: ["generative-ai-llm", "rag", "ai-applications"],
    keywords: ["prompt engineering", "prompt", "few-shot", "chain of thought", "instructions", "output format"],
    viz: null
  },
  {
    id: "rag",
    category: "generative-ai",
    title: "Retrieval-Augmented Generation (RAG)",
    difficulty: "Intermediate",
    short: "Give an LLM the right documents as context so it answers from your data, not just its training.",
    definition: "RAG is a pattern where, before the LLM answers, the system retrieves relevant documents from an external knowledge source and inserts them into the prompt as context. The model then generates an answer grounded in that retrieved information.",
    why: "LLMs don't know your private/company data and their training is frozen and can hallucinate. RAG injects fresh, authoritative, private content at query time — grounding answers in real sources without retraining the model.",
    problem: "Ask a plain LLM 'what's our refund policy?' and it guesses or hallucinates — it never saw your policy. RAG retrieves the actual policy document and hands it to the model, which then answers from it, often with citations.",
    howItWorks: "Offline: split your documents into chunks, embed each, and store the vectors. At query time: embed the user's question, retrieve the most similar chunks (vector search), put them into the prompt as context, and ask the LLM to answer using only that context. This differs from traditional search, which stops at 'retrieve'; RAG adds 'generate an answer from what was retrieved'.",
    example: "A company-policy chatbot: employee asks about parental leave; the system finds the two most relevant HR document chunks, feeds them to the LLM, and returns a precise answer with a link to the source — no hallucination, always current.",
    code: "# RAG in four conceptual steps\nq_vec = embed(question)\nchunks = vector_db.search(q_vec, top_k=4)      # retrieve\ncontext = '\\n'.join(chunks)\nprompt = f'Answer using ONLY this context:\\n{context}\\n\\nQ: {question}'\nanswer = llm.complete(prompt)                  # generate",
    engineering: "RAG is mostly a data-plumbing problem an engineer already understands: chunk, embed, index in a vector DB, retrieve top-k, assemble the prompt. It's cheaper and more maintainable than fine-tuning when knowledge changes often — just update the documents.",
    whenToUse: [
      "Answering from private, large, or frequently-changing knowledge bases",
      "When you need current, source-cited, grounded answers"
    ],
    whenNotToUse: [
      "General knowledge the base model already handles well",
      "When you need to change the model's style/behaviour (consider fine-tuning)"
    ],
    limitations: [
      "Answer quality depends on retrieval quality — bad chunks, bad answer",
      "Adds infrastructure (embeddings, vector DB) and prompt-size/cost limits"
    ],
    keyTakeaway: "RAG = retrieve relevant docs, then generate an answer grounded in them. It gives LLMs your current, private knowledge without retraining — quality hinges on retrieval.",
    related: ["tokens-embeddings", "vector-search", "rag-vs-finetuning", "generative-ai-llm"],
    keywords: ["rag", "retrieval augmented generation", "grounding", "context", "vector search", "chatbot", "hallucination"],
    viz: "rag-pipeline"
  },
  {
    id: "vector-search",
    category: "generative-ai",
    title: "Vector search & vector databases",
    difficulty: "Intermediate",
    short: "Find items by meaning, not keywords, by locating the nearest vectors in embedding space.",
    definition: "Vector search finds the items whose embeddings are closest to a query embedding. A vector database stores millions of these vectors and returns nearest neighbours fast — the retrieval engine behind semantic search and RAG.",
    why: "Keyword search fails when wording differs ('car' vs 'automobile') or when intent matters more than exact terms. Vector search matches on meaning, dramatically improving relevance for natural-language queries.",
    problem: "A user searches 'how to stop my subscription' but the article says 'cancel your plan'. Keyword search misses it; vector search finds it because the two phrases embed close together.",
    howItWorks: "Every item is embedded once and stored. A query is embedded, then the database finds the top-k nearest vectors using a distance measure (e.g. cosine similarity), accelerated by approximate-nearest-neighbour indexes so it scales to millions of items in milliseconds.",
    example: "A documentation site embeds all its pages. A natural-language query returns the most semantically relevant pages regardless of exact wording — and the same top-k results become the context for a RAG answer.",
    code: "# conceptual: query a vector store for nearest neighbours\nq_vec = embed('cancel my subscription')\nresults = vector_db.search(q_vec, top_k=5)\nfor r in results:\n    print(r.title, round(r.score, 2))",
    engineering: "A vector database is infrastructure like any other datastore — you index, query and scale it. Choosing it (managed vs self-hosted) and tuning top-k and similarity thresholds are ordinary engineering decisions.",
    whenToUse: [
      "Semantic search, recommendations, and RAG retrieval",
      "Matching by meaning where keywords fall short"
    ],
    whenNotToUse: [
      "Exact-match lookups (IDs, codes) — use a normal index",
      "Tiny datasets where a brute-force compare is fine"
    ],
    limitations: [
      "Results only as good as the embedding model",
      "Approximate search trades a little accuracy for speed; adds infra"
    ],
    keyTakeaway: "Vector search retrieves by meaning via nearest-neighbour on embeddings — the fast retrieval layer powering semantic search and RAG.",
    related: ["tokens-embeddings", "rag", "generative-ai-llm"],
    keywords: ["vector search", "vector database", "nearest neighbour", "cosine similarity", "semantic search", "ann"],
    viz: null
  },
  {
    id: "rag-vs-finetuning",
    category: "generative-ai",
    title: "RAG vs fine-tuning",
    difficulty: "Advanced",
    short: "Two ways to specialize an LLM — inject knowledge at query time, or bake behaviour into weights.",
    definition: "RAG adds knowledge at inference time by retrieving documents into the prompt. Fine-tuning changes the model itself by continuing training on your examples, adjusting its weights to shift its knowledge, style or format.",
    why: "Teams constantly ask 'should we fine-tune?'. Usually the answer is 'try RAG first'. Knowing the difference prevents an expensive, slow fine-tune when a cheaper retrieval approach would work better.",
    problem: "You need the model to use your data or behave a certain way. Fine-tuning is costly and must be redone when data changes; RAG updates instantly by editing documents. But RAG can't easily teach a new style or output format — that's where fine-tuning shines.",
    howItWorks: "RAG: keep the model fixed, retrieve relevant context per query, generate grounded answers — best for changing, factual knowledge. Fine-tuning: collect many input→output examples, continue training to adjust weights — best for consistent style, format, or specialized behaviour. They can be combined: fine-tune for behaviour, RAG for facts.",
    example: "A support bot uses RAG so answers always reflect the latest product docs (facts change weekly). It's also lightly fine-tuned so replies always match the brand's tone and structure (behaviour that's stable). Each tool does what it's best at.",
    code: null,
    engineering: "Default to RAG: it's cheaper, faster to update, and easier to audit (you can see the sources). Reach for fine-tuning when you need consistent form/behaviour that prompting can't reliably achieve. Both need evaluation on real examples.",
    whenToUse: [
      "RAG: changing, factual, private knowledge; need citations",
      "Fine-tuning: consistent style/format/behaviour, narrow specialized tasks"
    ],
    whenNotToUse: [
      "Fine-tuning just to add facts that change often (use RAG)",
      "RAG when the need is behavioural consistency, not knowledge"
    ],
    limitations: [
      "Fine-tuning: costly, needs quality labelled data, stale when facts change",
      "RAG: retrieval-dependent, prompt-size limits, extra infrastructure"
    ],
    keyTakeaway: "Knowledge that changes → RAG. Behaviour/style/format → fine-tuning. Start with RAG; combine them when you need both.",
    related: ["rag", "generative-ai-llm", "prompt-engineering"],
    keywords: ["rag vs fine-tuning", "fine-tuning", "specialize", "training", "weights", "comparison"],
    viz: null,
    comparison: {
      title: "RAG vs Fine-tuning",
      headers: ["Aspect", "RAG", "Fine-tuning"],
      rows: [
        ["Changes", "The prompt (adds context)", "The model's weights"],
        ["Best for", "Facts, changing knowledge", "Style, format, behaviour"],
        ["Update cost", "Edit documents — instant", "Retrain — slow & costly"],
        ["Traceable sources", "Yes, can cite", "No"],
        ["Data needed", "Documents", "Many labelled examples"]
      ]
    }
  },
  {
    id: "ai-applications",
    category: "generative-ai",
    title: "AI-powered applications & agents",
    difficulty: "Intermediate",
    short: "Wrapping LLMs in real software — with context, tools, validation and guardrails around the model call.",
    definition: "An AI-powered application embeds an LLM into a product, surrounding the raw model call with retrieval (RAG), prompt construction, output validation, tools/functions the model can invoke, and monitoring. An 'agent' is an app where the LLM decides which steps or tools to use to reach a goal.",
    why: "The model is only ~10% of a real product. The reliability, safety and usefulness come from the engineering around it. This is exactly where software engineers add the most value in AI.",
    problem: "A bare LLM call is unreliable: no memory, no access to your data or systems, and it can produce unusable or unsafe output. A real application adds context, lets the model take actions (call APIs), and validates everything.",
    howItWorks: "A typical loop: take the user input, retrieve relevant context (RAG), build a prompt, call the LLM, optionally let it call 'tools' (search, database, calculator) via structured outputs, validate/parse the result, and return it — logging cost, latency and quality throughout. Agents repeat this loop, letting the model plan multi-step actions.",
    example: "A support assistant: retrieves the customer's orders and the relevant help docs, drafts a reply, can call a 'refund' tool when appropriate, validates the JSON action, and escalates to a human when confidence is low — a full application, not just a prompt.",
    code: "# app loop: context in, validated action out\nctx = retrieve(user_msg)                 # RAG\nout = llm.complete(build_prompt(ctx, user_msg))\naction = validate_json(out)              # guardrail\nif action['type'] == 'refund':\n    refund_api(action['order_id'])       # tool call",
    engineering: "This is squarely software engineering: integration, validation, error handling, observability and cost control around a probabilistic component. Treat the LLM as an unreliable dependency — validate its output and design for graceful failure.",
    whenToUse: [
      "Turning an LLM capability into a dependable product feature",
      "Workflows needing data access, actions, or multi-step reasoning"
    ],
    whenNotToUse: [
      "Simple one-shot tasks a single prompt already handles",
      "Where a deterministic rule or classic ML is more reliable/cheaper"
    ],
    limitations: [
      "Added complexity, cost and latency; agents can loop or misfire",
      "Requires guardrails, evaluation and monitoring to be trustworthy"
    ],
    keyTakeaway: "Real AI products are mostly the engineering around the model: context, tools, validation, guardrails and monitoring. Treat the LLM as a powerful but unreliable dependency.",
    related: ["generative-ai-llm", "rag", "prompt-engineering", "mlops-monitoring"],
    keywords: ["ai application", "agent", "tools", "function calling", "guardrails", "integration", "production"],
    viz: null
  }
];
