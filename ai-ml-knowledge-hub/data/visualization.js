window.KB = window.KB || {};
window.KB.visualization = [
  {
    id: "matplotlib",
    category: "visualization",
    title: "Matplotlib basics",
    difficulty: "Beginner",
    short: "The foundational Python plotting library — turn numbers into charts you can reason about.",
    definition: "Matplotlib is Python's core plotting library. It draws line, bar, scatter, histogram and other charts from arrays and DataFrames, giving fine control over every element of a figure.",
    why: "Humans spot patterns visually far faster than by reading tables. A histogram reveals skew, a scatter reveals correlation, a line reveals a trend — often in one glance. Plotting is how EDA becomes insight.",
    problem: "A table of 10,000 numbers tells you almost nothing. One histogram of the same numbers instantly shows the shape, the centre, the spread and any outliers.",
    howItWorks: "You create a figure and axes, call a plot method (`plot`, `bar`, `scatter`, `hist`) with your data, then label and show. Pandas wraps Matplotlib so `df['col'].hist()` works directly. Each chart type answers a different question about the data.",
    example: "Before modelling house prices, an analyst plots a histogram of prices (right-skewed, suggesting a log transform) and a scatter of price vs area (clear upward trend) — both shape the feature engineering.",
    code: "import matplotlib.pyplot as plt\nprices = [120, 150, 150, 180, 900]\nplt.hist(prices, bins=10)\nplt.xlabel('Price (k)'); plt.ylabel('Count')\nplt.title('Price distribution')\nplt.show()",
    engineering: "Matplotlib is a rendering API: you describe a figure declaratively and it draws it. Treat charts as artifacts of your analysis (save them to files, embed in reports) the way you'd treat generated docs.",
    whenToUse: [
      "Exploring distributions and relationships during EDA",
      "Communicating findings in reports and notebooks"
    ],
    whenNotToUse: [
      "Polished interactive dashboards — reach for Plotly/BI tools",
      "When a single summary number answers the question"
    ],
    limitations: [
      "Verbose API for complex or styled figures",
      "Static by default; interactivity needs other tools"
    ],
    keyTakeaway: "Plot early and often: the right chart turns a wall of numbers into an instantly readable pattern. Histogram for shape, scatter for relationship, line for trend.",
    related: ["choosing-a-chart", "pandas-transform", "descriptive-stats"],
    keywords: ["matplotlib", "plot", "chart", "histogram", "scatter", "visualization", "pyplot"],
    viz: null
  },
  {
    id: "choosing-a-chart",
    category: "visualization",
    title: "Choosing the right chart",
    difficulty: "Beginner",
    short: "Match the chart to the question — distribution, comparison, relationship or trend.",
    definition: "A simple decision framework for picking a visualization based on what you want to show: the shape of one variable, comparison across categories, the relationship between two variables, or change over time.",
    why: "The wrong chart hides or distorts the message. A pie chart of 20 slices is useless; the same data as a sorted bar chart is instantly clear. Picking well is half of good communication.",
    problem: "Analysts default to whatever chart is easiest, then wonder why no one 'gets' their finding. Starting from the question — not the chart — produces visuals people understand immediately.",
    howItWorks: "Ask what the data question is. Distribution of one variable → histogram or box plot. Comparison across categories → bar chart. Relationship between two numbers → scatter plot. Change over time → line chart. Part-of-whole (few parts) → stacked bar or, sparingly, a pie.",
    example: "To show which regions sell most → sorted bar chart. To show whether ad spend drives sales → scatter of spend vs sales. To show monthly revenue → line chart. Each choice flows directly from the question.",
    code: null,
    engineering: "This is UX for data: choose the encoding that lets the reader decode the answer with the least effort. Like picking the right widget for a UI, the right chart makes the information self-explanatory.",
    whenToUse: [
      "Before making any chart — decide the question first",
      "When a visual isn't landing, re-check the chart matches the question"
    ],
    whenNotToUse: [
      "Over-thinking a quick exploratory plot for your own eyes"
    ],
    limitations: [
      "Guidelines, not laws — context can justify exceptions",
      "Good chart choice can't rescue bad or misleading data"
    ],
    keyTakeaway: "Start from the question: distribution→histogram, comparison→bar, relationship→scatter, trend→line. The chart should make the answer obvious.",
    related: ["matplotlib", "descriptive-stats", "correlation"],
    keywords: ["chart selection", "bar", "line", "scatter", "histogram", "pie", "visualization"],
    viz: null
  }
];
