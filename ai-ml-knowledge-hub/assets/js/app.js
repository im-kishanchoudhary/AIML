/* ============================================================
   AI/ML Knowledge Hub — application controller.
   Vanilla JS, no framework. Renders topics from window.KB,
   handles routing, search, progress and recently-viewed.
   ============================================================ */
(function () {
  "use strict";

  // ---------- Icons (inline Lucide-style SVG, stroke 2.75) ----------
  function ic(paths) {
    return '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round">' + paths + '</svg>';
  }
  var ICONS = {
    fundamentals: ic('<circle cx="12" cy="12" r="9"/><path d="M12 3v18M3 12h18"/>'),
    python: ic('<path d="M8 3h5a3 3 0 0 1 3 3v4a3 3 0 0 1-3 3H8a3 3 0 0 0-3 3v1"/><circle cx="9" cy="6" r="0.5" fill="currentColor"/>'),
    numpy: ic('<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>'),
    pandas: ic('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 4v16"/>'),
    visualization: ic('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'),
    statistics: ic('<path d="M3 3v18h18"/><path d="M6 15c3-6 6-6 9-3s5 1 6-2"/>'),
    "machine-learning": ic('<circle cx="12" cy="12" r="3"/><circle cx="5" cy="6" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="5" cy="18" r="2"/><circle cx="19" cy="18" r="2"/><path d="M7 7l3 3M17 7l-3 3M7 17l3-3M17 17l-3-3"/>'),
    "deep-learning": ic('<circle cx="5" cy="6" r="1.8"/><circle cx="5" cy="12" r="1.8"/><circle cx="5" cy="18" r="1.8"/><circle cx="12" cy="8" r="1.8"/><circle cx="12" cy="16" r="1.8"/><circle cx="19" cy="12" r="1.8"/><path d="M6.5 6.8l4 1M6.5 11.6l4-2.4M6.5 12.4l4 2.4M6.5 17.2l4-1M13.5 8.6l4 2.4M13.5 15.4l4-2.4"/>'),
    "generative-ai": ic('<path d="M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z"/><path d="M19 15l1 2 2 1-2 1-1 2-1-2-2-1 2-1z"/>'),
    mlops: ic('<path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1"/><circle cx="12" cy="12" r="3.5"/>'),
    glossary: ic('<path d="M4 5a2 2 0 0 1 2-2h13v18H6a2 2 0 0 1-2-2z"/><path d="M9 3v18"/>'),
    check: ic('<path d="M20 6L9 17l-5-5"/>'),
    search: ic('<circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/>'),
    arrow: ic('<path d="M5 12h14M13 6l6 6-6 6"/>'),
    home: ic('<path d="M3 10l9-7 9 7v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/>'),
    bulb: ic('<path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.1V17h6v-.2c0-.8.4-1.6 1-2.1A7 7 0 0 0 12 2z"/>'),
    menu: ic('<path d="M3 6h18M3 12h18M3 18h18"/>')
  };

  // ---------- Category metadata (guided order) ----------
  var CATEGORIES = [
    { id: "fundamentals", label: "Foundations", blurb: "The big picture, the workflow, and the tools of the trade." },
    { id: "python", label: "Python", blurb: "Why Python leads data work and the structures you start with." },
    { id: "numpy", label: "NumPy", blurb: "Fast numeric arrays — the layer everything else is built on." },
    { id: "pandas", label: "Pandas", blurb: "Load, clean, reshape and explore tabular data." },
    { id: "visualization", label: "Visualization", blurb: "Turn numbers into charts you can reason about." },
    { id: "statistics", label: "Statistics", blurb: "The measures and tests that ground every model." },
    { id: "machine-learning", label: "Machine Learning", blurb: "Learn patterns from data: regression, classification, clustering." },
    { id: "deep-learning", label: "Deep Learning", blurb: "Neural networks and the architectures behind modern AI." },
    { id: "generative-ai", label: "Generative AI", blurb: "LLMs, embeddings, RAG and AI-powered applications." },
    { id: "mlops", label: "MLOps", blurb: "Keep deployed models reliable as the world changes." }
  ];
  var CAT_LABEL = {}; CATEGORIES.forEach(function (c) { CAT_LABEL[c.id] = c.label; });
  CAT_LABEL.glossary = "Glossary";

  // ---------- Build flat topic model ----------
  var KB = window.KB || {};
  var TOPICS = [];      // full topic objects in guided order
  var BY_ID = {};
  CATEGORIES.forEach(function (c) {
    (KB[c.id] || []).forEach(function (t) { TOPICS.push(t); BY_ID[t.id] = t; });
  });
  var GLOSSARY = KB.glossary || [];
  var ORDER = TOPICS.map(function (t) { return t.id; });

  // Phase 8+9 enrichment: merge extra fields onto topics, compute reverse "unlocks".
  var UNLOCKS = {};
  if (window.ENRICH) {
    Object.keys(window.ENRICH).forEach(function (id) { if (BY_ID[id]) { var e = window.ENRICH[id]; Object.keys(e).forEach(function (k) { BY_ID[id][k] = e[k]; }); } });
    TOPICS.forEach(function (t) { (t.prerequisites || []).forEach(function (p) { (UNLOCKS[p] = UNLOCKS[p] || []).push(t.id); }); });
  }

  var DIFF_CLASS = { "Beginner": "beginner", "Intermediate": "intermediate", "Advanced": "advanced" };

  // ---------- Persistence ----------
  var LS_DONE = "aihub.completed.v1";
  var LS_RECENT = "aihub.recent.v1";
  var LS_MODE = "aihub.mode.v1";
  var LS_INTERVIEW = "aihub.interview.v1";
  function load(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch (e) { return fallback; } }
  function save(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }
  var completed = load(LS_DONE, []);
  var recent = load(LS_RECENT, []);
  var MODES = [
    { id: "learn", label: "Learn", sub: "Full explanations" },
    { id: "cheat", label: "Cheat", sub: "Condensed reference" },
    { id: "interview", label: "Interview", sub: "Quiz yourself" },
    { id: "compare", label: "Compare", sub: "Side-by-side" },
    { id: "visual", label: "Visual", sub: "All diagrams" }
  ];
  var COLLECTION_MODES = { interview: 1, compare: 1, visual: 1 };
  var mode = load(LS_MODE, "cheat");
  if (!MODES.some(function (m) { return m.id === mode; })) mode = "cheat";
  var interviewScore = load(LS_INTERVIEW, {}); // legacy self-score (migrated into SR)
  var LS_SR = "aihub.sr.v1";
  var LS_QUIZWRONG = "aihub.quizwrong.v1";
  var LS_QUIZSCORE = "aihub.quizscore.v1";
  var srState = load(LS_SR, {});        // { topicId: { box, due, streak, seen } }
  var quizWrong = load(LS_QUIZWRONG, {}); // { topicId: 1 } — missed in a quiz
  var quizScore = load(LS_QUIZSCORE, {}); // { pathId: { best, total } }
  var DAY = 86400000;
  var SR_INTERVALS = [0, 1, 3, 7, 16, 30]; // days until due, indexed by box level 0..5
  var SR_MASTERED = 4;
  function srDue(id) { var s = srState[id]; return !s || s.due <= Date.now(); }
  function srSeen(id) { return !!(srState[id] && srState[id].seen); }
  function srBox(id) { return srState[id] ? srState[id].box : 0; }
  function srMark(id, ok) {
    var s = srState[id] || { box: 0, streak: 0 };
    if (ok) { s.box = Math.min(5, (s.box || 0) + 1); s.streak = (s.streak || 0) + 1; if (quizWrong[id]) { delete quizWrong[id]; save(LS_QUIZWRONG, quizWrong); } }
    else { s.box = 0; s.streak = 0; }
    s.due = Date.now() + SR_INTERVALS[s.box] * DAY; s.seen = true;
    srState[id] = s; save(LS_SR, srState);
  }
  function weakTopics() {
    var set = {};
    Object.keys(srState).forEach(function (id) { if (srState[id].seen && srState[id].box <= 1) set[id] = 1; });
    Object.keys(quizWrong).forEach(function (id) { set[id] = 1; });
    return Object.keys(set).filter(function (id) { return BY_ID[id]; });
  }
  var ivFilter = "all";
  function isDone(id) { return completed.indexOf(id) !== -1; }
  function toggleDone(id) {
    var i = completed.indexOf(id);
    if (i === -1) completed.push(id); else completed.splice(i, 1);
    save(LS_DONE, completed);
    updateProgress(); renderSidebar();
  }
  function pushRecent(id) {
    recent = recent.filter(function (r) { return r !== id; });
    recent.unshift(id);
    recent = recent.slice(0, 8);
    save(LS_RECENT, recent);
  }

  // ---------- Text helpers ----------
  function esc(s) { return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"); }
  // lightweight markdown: **bold**, `code`, newlines -> <br>
  function md(s) {
    return esc(s)
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/`([^`]+)`/g, '<code style="background:var(--color-neutral-200);padding:1px 5px;border-radius:5px;font-size:.9em">$1</code>')
      .replace(/\n/g, "<br>");
  }
  // naive python highlighter — XML-safe: strings/comments are tokenized first,
  // and keywords are only highlighted in the remaining code (never inside a
  // string or an already-inserted <span>), so spans can never overlap.
  function kwHighlight(s) {
    return s.replace(/\b(import|from|as|for|in|if|elif|else|def|return|class|while|and|or|not|is|None|True|False|lambda|with)\b/g, '<span class="kw">$1</span>');
  }
  function highlightPy(code) {
    return esc(code).split("\n").map(function (line) {
      var full = line.match(/^(\s*)(#.*)$/);
      if (full) return full[1] + '<span class="cmt">' + full[2] + "</span>";
      var out = "", last = 0, m, re = /('[^']*'|"[^"]*"|#.*$)/g;
      while ((m = re.exec(line))) {
        out += kwHighlight(line.slice(last, m.index));
        out += m[0].charAt(0) === "#" ? '<span class="cmt">' + m[0] + "</span>" : '<span class="str">' + m[0] + "</span>";
        last = re.lastIndex;
      }
      return out + kwHighlight(line.slice(last));
    }).join("\n");
  }

  // ---------- DOM refs ----------
  var $ = function (s) { return document.querySelector(s); };
  var content = $("#content");
  var navScroll = $("#navScroll");

  // ---------- Progress ----------
  function updateProgress() {
    var pct = ORDER.length ? Math.round(completed.filter(function (id) { return BY_ID[id]; }).length / ORDER.length * 100) : 0;
    $("#progFill").style.width = pct + "%";
    $("#progPct").textContent = pct + "%";
    $("#progCount").textContent = completed.filter(function (id) { return BY_ID[id]; }).length + " / " + ORDER.length;
  }

  // ---------- Sidebar ----------
  var collapsed = {};
  function renderSidebar() {
    var active = currentTopicId();
    var activeCat = active && BY_ID[active] ? BY_ID[active].category : (location.hash.indexOf("cat/") > -1 ? location.hash.split("cat/")[1] : null);
    var html = "";
    CATEGORIES.forEach(function (c) {
      var topics = KB[c.id] || [];
      var isCollapsed = collapsed[c.id];
      html += '<div class="nav-group' + (isCollapsed ? " collapsed" : "") + '" data-cat="' + c.id + '">';
      html += '<button class="nav-cat" data-toggle="' + c.id + '"><span class="ico">' + ICONS[c.id] + '</span>' + esc(c.label) + '<span class="chev">' + ICONS.arrow.replace('width="20" height="20"', 'width="14" height="14"') + '</span></button>';
      html += '<div class="nav-items">';
      topics.forEach(function (t) {
        html += '<a class="nav-item' + (t.id === active ? " active" : "") + (isDone(t.id) ? " completed" : "") + '" href="#t/' + t.id + '">' +
          '<span class="dot ' + DIFF_CLASS[t.difficulty] + '" title="' + t.difficulty + '"></span>' +
          '<span class="label">' + esc(t.title) + '</span>' +
          '<span class="done">' + ICONS.check.replace('width="20" height="20"', 'width="14" height="14"') + '</span></a>';
      });
      html += '</div></div>';
    });
    // glossary
    html += '<div class="nav-group"><a class="nav-cat" href="#glossary" style="text-decoration:none"><span class="ico">' + ICONS.glossary + '</span>Glossary</a></div>';
    navScroll.innerHTML = html;
    Array.prototype.forEach.call(navScroll.querySelectorAll("[data-toggle]"), function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-toggle");
        collapsed[id] = !collapsed[id];
        renderSidebar();
      });
    });
  }

  // ---------- Rendering: sections ----------
  function sec(n, title, body) {
    if (!body) return "";
    return '<div class="sec"><h2><span class="n">' + n + '</span>' + esc(title) + '</h2>' + body + "</div>";
  }
  function listBlock(items, cls) {
    if (!items || !items.length) return "";
    return '<ul class="pill-list ' + cls + '">' + items.map(function (i) { return "<li>" + md(i) + "</li>"; }).join("") + "</ul>";
  }
  function cmpTable(cmp) {
    if (!cmp) return "";
    var h = '<div class="cmp-title">' + esc(cmp.title) + "</div><div class=\"cmp-table-wrap\"><table class=\"table\"><thead><tr>";
    cmp.headers.forEach(function (x) { h += "<th>" + esc(x) + "</th>"; });
    h += "</tr></thead><tbody>";
    cmp.rows.forEach(function (r) { h += "<tr>" + r.map(function (c, i) { return (i === 0 ? "<td><strong>" + esc(c) + "</strong></td>" : "<td>" + esc(c) + "</td>"); }).join("") + "</tr>"; });
    h += "</tbody></table></div>";
    return h;
  }

  function renderTopic(id) {
    var t = BY_ID[id];
    if (!t) { renderHome(); return; }
    pushRecent(id);
    if (mode === "cheat") { renderTopicCheat(t); return; }
    var idx = ORDER.indexOf(id);
    var prev = idx > 0 ? BY_ID[ORDER[idx - 1]] : null;
    var next = idx < ORDER.length - 1 ? BY_ID[ORDER[idx + 1]] : null;

    var h = '<div class="content-inner">';
    // breadcrumb
    h += '<div class="breadcrumb"><a href="#home">Home</a><span class="sep">/</span>' +
      '<a href="#cat/' + t.category + '">' + esc(CAT_LABEL[t.category]) + '</a><span class="sep">/</span>' +
      '<span class="cur">' + esc(t.title) + '</span></div>';
    // head
    h += '<div class="topic-head"><div class="tag-row">' +
      '<span class="tag tag-accent">' + esc(CAT_LABEL[t.category]) + '</span>' +
      '<span class="tag tag-outline">' + esc(t.difficulty) + '</span></div>' +
      "<h1>" + esc(t.title) + "</h1>" +
      '<p class="short">' + md(t.short) + "</p>" +
      '<div class="topic-actions">' +
      '<button class="btn btn-primary complete-btn' + (isDone(id) ? " is-done" : "") + '" id="completeBtn">' +
      (isDone(id) ? ICONS.check + " Completed" : "Mark as complete") + "</button>" +
      "</div></div>";

    h += prereqStrip(t);
    // key takeaway up top as TL;DR
    h += '<div class="tldr"><span class="tldr-ico">' + ICONS.bulb + '</span><div><div class="tldr-label">Key takeaway</div><div class="tldr-text">' + md(t.keyTakeaway) + "</div></div></div>";
    h += calloutsHtml(t);

    var n = 1;
    h += sec(n++, "What is it?", '<p class="lead">' + md(t.definition) + "</p>");
    h += sec(n++, "Why it exists", "<p>" + md(t.why) + "</p>");
    h += sec(n++, "Problem it solves", "<p>" + md(t.problem) + "</p>");
    h += sec(n++, "How it works", "<p>" + md(t.howItWorks) + "</p>");
    if (t.walkthrough && t.walkthrough.length) h += walkthroughHtml(t, n++);
    h += sec(n++, "Real-world example", "<p>" + md(t.example) + "</p>");
    // visualization
    if (t.viz && window.VIZ && window.VIZ[t.viz]) {
      h += '<div class="sec"><h2><span class="n">' + (n++) + '</span>Interactive visualization</h2><div class="viz-box"><div class="viz" id="vizHost"></div></div></div>';
    }
    if (t.code) {
      h += sec(n++, "Python example", '<div class="code-cap">Python · runnable pattern</div><pre class="code"><code>' + highlightPy(t.code) + "</code></pre>");
    }
    h += sec(n++, "Engineering connection", "<p>" + md(t.engineering) + "</p>");
    // when / when not
    if ((t.whenToUse && t.whenToUse.length) || (t.whenNotToUse && t.whenNotToUse.length)) {
      h += '<div class="sec"><h2><span class="n">' + (n++) + '</span>When to use it — and when not</h2><div class="two-col">' +
        '<div><div class="cmp-title">Reach for it when</div>' + listBlock(t.whenToUse, "good") + "</div>" +
        '<div><div class="cmp-title">Prefer something else when</div>' + listBlock(t.whenNotToUse, "bad") + "</div></div></div>";
    }
    h += sec(n++, "Limitations", listBlock(t.limitations, "neutral"));
    if (t.comparison) h += sec(n++, "Common comparison", cmpTable(t.comparison));
    if (t.practical) h += practicalHtml(t, n++);
    // related
    if (t.related && t.related.length) {
      var rel = t.related.filter(function (r) { return BY_ID[r]; });
      if (rel.length) {
        h += '<div class="sec"><h2><span class="n">' + (n++) + '</span>Related concepts</h2><div class="related-row">' +
          rel.map(function (r) { return '<a class="rel-chip" href="#t/' + r + '">' + esc(BY_ID[r].title) + " " + ICONS.arrow.replace('width="20" height="20"', 'width="14" height="14"') + "</a>"; }).join("") +
          "</div></div>";
      }
    }
    // prev / next
    h += '<div class="prevnext">';
    h += prev ? '<a class="pn prev" href="#t/' + prev.id + '"><span class="pn-dir">← Previous</span><span class="pn-title">' + esc(prev.title) + "</span></a>" : '<span class="pn prev placeholder"></span>';
    h += next ? '<a class="pn next" href="#t/' + next.id + '"><span class="pn-dir">Next →</span><span class="pn-title">' + esc(next.title) + "</span></a>" : '<span class="pn next placeholder"></span>';
    h += "</div>";

    h += "</div>";
    content.innerHTML = h;
    content.scrollTop = 0;

    var cb = $("#completeBtn");
    if (cb) cb.addEventListener("click", function () {
      toggleDone(id);
      cb.classList.toggle("is-done");
      cb.innerHTML = isDone(id) ? ICONS.check + " Completed" : "Mark as complete";
    });
    wirePracticals();
    var vizHost = $("#vizHost");
    if (vizHost && t.viz && window.VIZ[t.viz]) {
      if (window.__loadVizPalette) window.__loadVizPalette();
      try { window.VIZ[t.viz](vizHost); } catch (e) { vizHost.innerHTML = '<div class="viz-note">Visualization unavailable.</div>'; console.error(e); }
    }
    renderSidebar();
  }

  // ---------- Rendering: category ----------
  function renderCategory(cid) {
    var cat = CATEGORIES.filter(function (c) { return c.id === cid; })[0];
    if (!cat) { renderHome(); return; }
    var topics = KB[cid] || [];
    var h = '<div class="content-inner">';
    h += '<div class="breadcrumb"><a href="#home">Home</a><span class="sep">/</span><span class="cur">' + esc(cat.label) + "</span></div>";
    h += '<div class="hero" style="margin-bottom:var(--space-6)"><div class="eyebrow">Category</div><h1>' + esc(cat.label) + "</h1><p>" + esc(cat.blurb) + "</p></div>";
    h += '<div class="cat-grid">';
    topics.forEach(function (t) {
      h += '<a class="cat-card" href="#t/' + t.id + '">' +
        '<div class="cc-title">' + esc(t.title) + "</div>" +
        '<div class="cc-blurb">' + esc(t.short) + "</div>" +
        '<div class="cc-meta">' + esc(t.difficulty) + (isDone(t.id) ? " · ✓ done" : "") + "</div></a>";
    });
    h += "</div></div>";
    content.innerHTML = h; content.scrollTop = 0;
    renderSidebar();
  }

  // ---------- Rendering: glossary ----------
  function renderGlossary() {
    var h = '<div class="content-inner">';
    h += '<div class="breadcrumb"><a href="#home">Home</a><span class="sep">/</span><span class="cur">Glossary</span></div>';
    h += '<div class="hero" style="margin-bottom:var(--space-6)"><div class="eyebrow">Quick reference</div><h1>Glossary</h1><p>Fast definitions for the terms across the hub. Click a term to jump to its full explanation.</p></div>';
    h += '<div class="glossary-grid">';
    GLOSSARY.slice().sort(function (a, b) { return a.term.localeCompare(b.term); }).forEach(function (g) {
      h += '<div class="gl-item"><div class="gl-term">' + esc(g.term) +
        (g.topic && BY_ID[g.topic] ? ' <a class="gl-link" href="#t/' + g.topic + '">read more →</a>' : "") +
        '</div><div class="gl-def">' + esc(g.definition) + "</div></div>";
    });
    h += "</div></div>";
    content.innerHTML = h; content.scrollTop = 0;
    renderSidebar();
  }

  // ---------- Rendering: home ----------
  function renderHome() {
    var relFlow = ["python-why", "pandas-cleaning", "pandas-transform", "correlation", "feature-engineering", "ml-fundamentals", "model-evaluation", "mlops-lifecycle", "generative-ai-llm", "rag"];
    var h = '<div class="content-inner">';
    h += '<div class="hero"><div class="eyebrow">Data Science · AI · Machine Learning · MLOps</div>' +
      "<h1>Your interactive cheat sheet</h1>" +
      "<p>A searchable companion to the workshop. Every topic explains what it is, the problem it solves, a real-world example, the Python, and how it connects to software engineering — built for developers moving into AI/ML.</p>" +
      '<div class="hero-actions">' +
      '<a class="btn btn-primary" href="#t/' + ORDER[0] + '">Start from the beginning ' + ICONS.arrow.replace('width="20" height="20"', 'width="16" height="16"') + "</a>" +
      '<button class="btn btn-secondary" id="heroSearch">' + ICONS.search.replace('width="20" height="20"', 'width="16" height="16"') + " Search topics</button>" +
      "</div></div>";

    // resume / recently viewed
    var recentValid = recent.filter(function (r) { return BY_ID[r]; });
    if (recentValid.length) {
      h += '<div class="section-title">Continue where you left off</div><div class="recent-row">';
      recentValid.forEach(function (r) {
        h += '<a class="recent-chip" href="#t/' + r + '"><span>' + esc(BY_ID[r].title) + '</span><span class="rc-cat">' + esc(CAT_LABEL[BY_ID[r].category]) + "</span></a>";
      });
      h += "</div>";
    }

    // learning paths
    if (PATHS.length) {
      h += '<div class="section-title">Guided learning paths</div><div class="path-grid">' +
        PATHS.slice(0, 3).map(pathCard).join("") + "</div>" +
        '<div style="margin-top:var(--space-3)"><a class="btn btn-secondary" href="#paths">See all ' + PATHS.length + " paths →</a></div>";
    }

    // build-along projects
    if (PROJECTS.length) {
      h += '<div class="section-title">Build something end to end</div><div class="path-grid">' +
        PROJECTS.map(projectCard).join("") + "</div>";
    }

    // categories
    h += '<div class="section-title">Explore by category</div><div class="cat-grid">';
    CATEGORIES.forEach(function (c) {
      var topics = KB[c.id] || [];
      var doneCount = topics.filter(function (t) { return isDone(t.id); }).length;
      h += '<a class="cat-card" href="#cat/' + c.id + '">' +
        '<div class="cc-ico">' + ICONS[c.id] + "</div>" +
        '<div class="cc-title">' + esc(c.label) + "</div>" +
        '<div class="cc-blurb">' + esc(c.blurb) + "</div>" +
        '<div class="cc-meta">' + topics.length + " topics" + (doneCount ? " · " + doneCount + " done" : "") + "</div></a>";
    });
    h += "</div>";

    // relationship map
    h += '<div class="section-title">How it all connects</div><div class="relmap"><div class="relmap-flow">';
    relFlow.forEach(function (id, i) {
      if (!BY_ID[id]) return;
      h += '<a class="relmap-node" href="#t/' + id + '">' + esc(BY_ID[id].title.split(":")[0].split(" (")[0]) + "</a>";
      if (i < relFlow.length - 1) h += '<span class="relmap-arrow">' + ICONS.arrow.replace('width="20" height="20"', 'width="16" height="16"') + "</span>";
    });
    h += '</div><div class="viz-note" style="margin-top:var(--space-4)">The typical journey: prepare data → understand it → model it → evaluate and operate it → extend into generative AI. Every stage links to its topics above.</div>' +
      '<div style="margin-top:var(--space-4)"><a class="btn btn-secondary" href="#map">Open the full concept map →</a></div></div>';

    h += "</div>";
    content.innerHTML = h; content.scrollTop = 0;
    var hs = $("#heroSearch");
    if (hs) hs.addEventListener("click", openSearch);
    updateProgress();
    renderSidebar();
  }

  // ---------- Prev / next (shared) ----------
  function prevNextHtml(id) {
    var idx = ORDER.indexOf(id);
    var prev = idx > 0 ? BY_ID[ORDER[idx - 1]] : null;
    var next = idx < ORDER.length - 1 ? BY_ID[ORDER[idx + 1]] : null;
    var h = '<div class="prevnext">';
    h += prev ? '<a class="pn prev" href="#t/' + prev.id + '"><span class="pn-dir">← Previous</span><span class="pn-title">' + esc(prev.title) + "</span></a>" : '<span class="pn prev placeholder"></span>';
    h += next ? '<a class="pn next" href="#t/' + next.id + '"><span class="pn-dir">Next →</span><span class="pn-title">' + esc(next.title) + "</span></a>" : '<span class="pn next placeholder"></span>';
    return h + "</div>";
  }
  function relatedHtml(t) {
    if (!t.related || !t.related.length) return "";
    var rel = t.related.filter(function (r) { return BY_ID[r]; });
    if (!rel.length) return "";
    return '<div class="sec"><h2>Related concepts</h2><div class="related-row">' +
      rel.map(function (r) { return '<a class="rel-chip" href="#t/' + r + '">' + esc(BY_ID[r].title) + " " + ICONS.arrow.replace('width="20" height="20"', 'width="14" height="14"') + "</a>"; }).join("") +
      "</div></div>";
  }

  // ---------- Phase 8+9: prerequisites, walkthrough, practical ----------
  function chipsRow(ids) {
    return ids.filter(function (r) { return BY_ID[r]; }).map(function (r) {
      return '<a class="rel-chip" href="#t/' + r + '">' + esc(BY_ID[r].title) + "</a>";
    }).join("");
  }
  function prereqStrip(t) {
    var pre = (t.prerequisites || []).filter(function (r) { return BY_ID[r]; });
    var unl = (UNLOCKS[t.id] || []).filter(function (r) { return BY_ID[r]; });
    if (!pre.length && !unl.length) return "";
    var h = '<div class="prereq-strip">';
    if (pre.length) h += '<div class="prereq-col"><div class="prereq-k">' + ICONS.check.replace('width="20" height="20"', 'width="15" height="15"') + ' Learn these first</div><div class="related-row">' + chipsRow(pre) + "</div></div>";
    if (unl.length) h += '<div class="prereq-col"><div class="prereq-k">' + ICONS.arrow.replace('width="20" height="20"', 'width="15" height="15"') + ' This unlocks</div><div class="related-row">' + chipsRow(unl) + "</div></div>";
    return h + "</div>";
  }
  function calloutsHtml(t) {
    var h = "";
    if (t.plainWords) h += '<div class="callout plain"><div class="callout-k">In plain words</div><div class="callout-v">' + md(t.plainWords) + "</div></div>";
    if (t.actuallyDoes) h += '<div class="callout does"><div class="callout-k">What it actually does</div><div class="callout-v">' + md(t.actuallyDoes) + "</div></div>";
    return h ? '<div class="callout-row">' + h + "</div>" : "";
  }
  function walkthroughHtml(t, n) {
    if (!t.walkthrough || !t.walkthrough.length) return "";
    var steps = t.walkthrough.map(function (s) {
      return '<li><div class="wt-t">' + esc(s.t) + '</div><div class="wt-d">' + md(s.d) + "</div></li>";
    }).join("");
    return '<div class="sec"><h2>' + (n != null ? '<span class="n">' + n + "</span>" : "") + 'Step-by-step walkthrough</h2><ol class="walkthrough">' + steps + "</ol></div>";
  }
  function practicalHtml(t, n) {
    var p = t.practical;
    if (!p) return "";
    var h = '<div class="sec practical"><h2>' + (n != null ? '<span class="n">' + n + "</span>" : "") + ICONS.bulb.replace('width="20" height="20"', 'width="17" height="17"') + ' Try it yourself</h2>';
    h += '<div class="practical-box">';
    h += '<div class="pr-goal">' + md(p.goal) + "</div>";
    if (p.steps && p.steps.length) h += '<ol class="pr-steps">' + p.steps.map(function (s) { return "<li>" + md(s) + "</li>"; }).join("") + "</ol>";
    h += '<div class="pr-codewrap"><div class="pr-toolbar"><span class="pr-lang">Python</span>' +
      '<button class="btn btn-secondary pr-copy" type="button">Copy code</button>' +
      '<a class="btn btn-secondary" href="https://colab.research.google.com/#create=true" target="_blank" rel="noopener">Open blank Colab ↗</a></div>' +
      '<pre class="code"><code>' + highlightPy(p.code) + "</code></pre></div>";
    if (p.expected) h += '<div class="pr-expected"><span class="pr-tag">Expected</span> ' + md(p.expected) + "</div>";
    if (p.stretch) h += '<div class="pr-stretch"><span class="pr-tag stretch">Stretch</span> ' + md(p.stretch) + "</div>";
    h += "</div></div>";
    return h;
  }
  function wirePracticals() {
    Array.prototype.forEach.call(content.querySelectorAll(".pr-copy"), function (btn) {
      btn.addEventListener("click", function () {
        var pre = btn.closest(".pr-codewrap").querySelector("pre code");
        var text = pre.textContent;
        var done = function () { btn.textContent = "Copied ✓"; setTimeout(function () { btn.textContent = "Copy code"; }, 1600); };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, done);
        else { var ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); } catch (e) {} document.body.removeChild(ta); done(); }
      });
    });
  }

  // ---------- Cheat (condensed) topic ----------
  function renderTopicCheat(t) {
    var h = '<div class="content-inner">';
    h += '<div class="breadcrumb"><a href="#home">Home</a><span class="sep">/</span><a href="#cat/' + t.category + '">' + esc(CAT_LABEL[t.category]) + '</a><span class="sep">/</span><span class="cur">' + esc(t.title) + "</span></div>";
    h += '<div class="topic-head"><div class="tag-row"><span class="tag tag-accent">' + esc(CAT_LABEL[t.category]) + '</span><span class="tag tag-outline">' + esc(t.difficulty) + '</span>' +
      '<span class="tag tag-neutral">Cheat sheet</span></div><h1>' + esc(t.title) + "</h1>" +
      '<p class="short">' + md(t.short) + "</p>" +
      '<div class="topic-actions"><button class="btn btn-primary complete-btn' + (isDone(t.id) ? " is-done" : "") + '" id="completeBtn">' + (isDone(t.id) ? ICONS.check + " Completed" : "Mark as complete") + "</button>" +
      '<a class="btn btn-secondary" href="#t/' + t.id + '" id="toLearn">Full explanation →</a></div></div>';
    h += prereqStrip(t);
    h += calloutsHtml(t);
    h += '<div class="cheat-grid">';
    h += '<div class="cheat-cell"><div class="cheat-k">What it is</div><div class="cheat-v">' + md(t.definition) + "</div></div>";
    h += '<div class="cheat-cell"><div class="cheat-k">Problem it solves</div><div class="cheat-v">' + md(t.problem) + "</div></div>";
    h += '<div class="cheat-cell"><div class="cheat-k">Real example</div><div class="cheat-v">' + md(t.example) + "</div></div>";
    h += '<div class="cheat-cell accent"><div class="cheat-k">Key takeaway</div><div class="cheat-v">' + md(t.keyTakeaway) + "</div></div>";
    h += "</div>";
    if (t.comparison) h += '<div class="sec">' + cmpTable(t.comparison) + "</div>";
    if (t.code) h += '<div class="sec"><div class="code-cap">Python · quick pattern</div><pre class="code"><code>' + highlightPy(t.code) + "</code></pre></div>";
    if (t.practical) h += practicalHtml(t);
    h += relatedHtml(t);
    h += prevNextHtml(t.id);
    h += "</div>";
    content.innerHTML = h; content.scrollTop = 0;
    wireCompleteBtn(t.id);
    wirePracticals();
    renderSidebar();
  }
  function wireCompleteBtn(id) {
    var cb = $("#completeBtn");
    if (cb) cb.addEventListener("click", function () {
      toggleDone(id);
      cb.classList.toggle("is-done");
      cb.innerHTML = isDone(id) ? ICONS.check + " Completed" : "Mark as complete";
    });
  }

  // ---------- Mode bar ----------
  function renderModeBar() {
    var bar = $("#modeBar");
    bar.innerHTML = MODES.map(function (m) {
      return '<button class="mode-tab' + (m.id === mode ? " active" : "") + '" role="tab" aria-selected="' + (m.id === mode) + '" data-mode="' + m.id + '">' +
        '<span class="mt-label">' + esc(m.label) + '</span><span class="mt-sub">' + esc(m.sub) + "</span></button>";
    }).join("");
    Array.prototype.forEach.call(bar.querySelectorAll("[data-mode]"), function (btn) {
      btn.addEventListener("click", function () { setMode(btn.getAttribute("data-mode")); });
    });
  }
  function setMode(m) {
    if (m === mode) return;
    mode = m; save(LS_MODE, mode);
    renderModeBar();
    if (COLLECTION_MODES[m] && /^#paths?/.test(location.hash)) { location.hash = "#home"; return; }
    route();
  }

  // ---------- Interview mode ----------
  function genQuestion(t) {
    return {
      q: "What is " + t.title.replace(/:.*$/, "") + ", and what problem does it solve?",
      a: "<strong>What:</strong> " + md(t.definition) + "<br><br><strong>Problem:</strong> " + md(t.problem) +
        "<br><br><strong>Example:</strong> " + md(t.example) + "<br><br><strong>Remember:</strong> " + md(t.keyTakeaway)
    };
  }
  function renderInterview(scrollId) {
    var seen = TOPICS.filter(function (t) { return srSeen(t.id); }).length;
    var mastered = TOPICS.filter(function (t) { return srBox(t.id) >= SR_MASTERED; }).length;
    var dueCount = TOPICS.filter(function (t) { return srSeen(t.id) && srDue(t.id); }).length;
    var weak = weakTopics();
    var h = '<div class="content-inner">';
    h += '<div class="hero" style="margin-bottom:var(--space-4)"><div class="eyebrow">Interview mode · spaced repetition</div><h1>Quiz yourself</h1>' +
      '<p>One question per topic. Reveal your answer, then mark it. Cards you mark <strong>Review</strong> come back soon; ones you keep getting right resurface less often — so your effort lands where it’s weakest.</p>' +
      '<div class="viz-readout" style="margin-top:var(--space-4)">' +
      '<div class="viz-stat"><div class="v">' + dueCount + "</div><div class=\"k\">Due now</div></div>" +
      '<div class="viz-stat"><div class="v">' + mastered + "</div><div class=\"k\">Mastered</div></div>" +
      '<div class="viz-stat"><div class="v">' + seen + " / " + ORDER.length + "</div><div class=\"k\">Reviewed</div></div>" +
      "</div>";
    if (weak.length) {
      h += '<div class="weak-panel"><div class="weak-k">Your weak spots (' + weak.length + ")</div><div class=\"related-row\">" +
        weak.slice(0, 12).map(function (id) { return '<a class="rel-chip" href="#t/' + id + '">' + esc(BY_ID[id].title) + "</a>"; }).join("") + "</div></div>";
    }
    h += '<div class="hero-actions" style="align-items:center"><div class="iv-filter">' +
      ['all', 'due', 'weak'].map(function (f) {
        var lbl = f === "all" ? "All topics" : f === "due" ? "Due for review (" + dueCount + ")" : "Weak spots (" + weak.length + ")";
        return '<button class="iv-filter-tab' + (ivFilter === f ? " active" : "") + '" data-filter="' + f + '">' + lbl + "</button>";
      }).join("") + "</div>" +
      '<button class="btn btn-ghost" id="ivReset">Reset progress</button></div></div>';

    var weakSet = {}; weak.forEach(function (id) { weakSet[id] = 1; });
    var shown = 0;
    CATEGORIES.forEach(function (c) {
      var topics = (KB[c.id] || []).filter(function (t) {
        if (ivFilter === "due") return srSeen(t.id) ? srDue(t.id) : true;
        if (ivFilter === "weak") return weakSet[t.id];
        return true;
      });
      if (!topics.length) return;
      h += '<div class="section-title" id="cat-' + c.id + '">' + esc(c.label) + "</div>";
      topics.forEach(function (t) {
        shown++;
        var qa = genQuestion(t), box = srBox(t.id), s = srState[t.id];
        var due = srSeen(t.id) && srDue(t.id);
        var pips = ""; for (var i = 0; i < 5; i++) pips += '<span class="pip' + (i < box ? " on" : "") + '"></span>';
        var stateClass = !srSeen(t.id) ? "" : (box >= SR_MASTERED ? " scored-got" : box <= 1 ? " scored-review" : " scored-mid");
        h += '<div class="iv-card' + stateClass + '" id="card-' + t.id + '">' +
          '<button class="iv-q" data-toggle="' + t.id + '"><span class="iv-badge">' + esc(t.difficulty) + '</span><span>' + esc(qa.q) + "</span>" +
          (due ? '<span class="iv-due">Due</span>' : "") +
          '<span class="iv-box" title="Mastery box ' + box + ' of 5">' + pips + "</span>" +
          (s && s.streak > 1 ? '<span class="iv-streak" title="' + s.streak + ' in a row">★ ' + s.streak + "</span>" : "") +
          '<span class="iv-chev">' + ICONS.arrow.replace('width="20" height="20"', 'width="16" height="16"') + "</span></button>" +
          '<div class="iv-a"><div class="iv-a-body">' + qa.a + "</div>" +
          '<div class="iv-score"><span class="iv-score-label">How did you do?</span>' +
          '<button class="btn btn-secondary iv-mark" data-mark="got" data-id="' + t.id + '">' + ICONS.check.replace('width="20" height="20"', 'width="16" height="16"') + ' Got it</button>' +
          '<button class="btn btn-secondary iv-mark" data-mark="review" data-id="' + t.id + '">Need review</button>' +
          '<a class="btn btn-ghost" href="#t/' + t.id + '">Read full →</a></div></div></div>';
      });
    });
    if (!shown) h += '<div class="search-empty">Nothing here right now — switch to “All topics”, or come back when cards are due.</div>';
    h += "</div>";
    content.innerHTML = h; content.scrollTop = 0;
    Array.prototype.forEach.call(content.querySelectorAll(".iv-q"), function (b) {
      b.addEventListener("click", function () { b.parentNode.classList.toggle("open"); });
    });
    Array.prototype.forEach.call(content.querySelectorAll(".iv-mark"), function (b) {
      b.addEventListener("click", function (e) {
        e.stopPropagation();
        srMark(b.getAttribute("data-id"), b.getAttribute("data-mark") === "got");
        renderInterview();
      });
    });
    Array.prototype.forEach.call(content.querySelectorAll(".iv-filter-tab"), function (b) {
      b.addEventListener("click", function () { ivFilter = b.getAttribute("data-filter"); renderInterview(); });
    });
    var rb = $("#ivReset");
    if (rb) rb.addEventListener("click", function () { srState = {}; quizWrong = {}; save(LS_SR, srState); save(LS_QUIZWRONG, quizWrong); renderInterview(); });
    renderSidebar();
    if (scrollId) scrollToCard(scrollId);
  }

  // ---------- Compare mode ----------
  function renderCompare(scrollId) {
    var h = '<div class="content-inner">';
    h += '<div class="hero" style="margin-bottom:var(--space-4)"><div class="eyebrow">Compare mode</div><h1>Side-by-side</h1>' +
      "<p>Every concept-pair that's commonly confused, gathered in one place — the fastest way to keep them straight.</p></div>";
    var any = false;
    CATEGORIES.forEach(function (c) {
      var topics = (KB[c.id] || []).filter(function (t) { return t.comparison; });
      if (!topics.length) return;
      any = true;
      h += '<div class="section-title" id="cat-' + c.id + '">' + esc(c.label) + "</div>";
      topics.forEach(function (t) {
        h += '<div class="cmp-card" id="card-' + t.id + '">' + cmpTable(t.comparison) +
          '<a class="btn btn-ghost" href="#t/' + t.id + '" style="margin-top:var(--space-2)">Open ' + esc(t.title) + " →</a></div>";
      });
    });
    if (!any) h += "<p>No comparisons available.</p>";
    h += "</div>";
    content.innerHTML = h; content.scrollTop = 0;
    renderSidebar();
    if (scrollId) scrollToCard(scrollId);
  }

  // ---------- Visual mode ----------
  function renderVisual(scrollId) {
    var h = '<div class="content-inner">';
    h += '<div class="hero" style="margin-bottom:var(--space-4)"><div class="eyebrow">Visual mode</div><h1>All diagrams</h1>' +
      "<p>Every interactive visualization in one scroll. Drag the sliders and buttons to build intuition.</p></div>";
    var vizTopics = TOPICS.filter(function (t) { return t.viz && window.VIZ && window.VIZ[t.viz]; });
    vizTopics.forEach(function (t) {
      h += '<div class="vis-card" id="card-' + t.id + '"><div class="vis-head"><div><div class="vis-cat">' + esc(CAT_LABEL[t.category]) + '</div><div class="vis-title">' + esc(t.title) + "</div></div>" +
        '<a class="btn btn-ghost" href="#t/' + t.id + '">Open topic →</a></div>' +
        '<div class="viz-box"><div class="viz" data-viz="' + t.viz + '"></div></div></div>';
    });
    h += "</div>";
    content.innerHTML = h; content.scrollTop = 0;
    if (window.__loadVizPalette) window.__loadVizPalette();
    Array.prototype.forEach.call(content.querySelectorAll("[data-viz]"), function (host) {
      try { window.VIZ[host.getAttribute("data-viz")](host); } catch (e) { console.error(e); }
    });
    renderSidebar();
    if (scrollId) scrollToCard(scrollId);
  }

  function scrollToCard(id) {
    var elc = document.getElementById("card-" + id) || document.getElementById("cat-" + (BY_ID[id] ? BY_ID[id].category : id));
    if (elc) { var top = elc.offsetTop - 12; content.scrollTop = top; elc.classList.add("flash"); setTimeout(function () { elc.classList.remove("flash"); }, 1200); }
  }

  // ---------- Phase 10: guided learning paths ----------
  var PATHS = window.PATHS || [];
  var PATH_BY_ID = {}; PATHS.forEach(function (p) { PATH_BY_ID[p.id] = p; });
  function pathValidTopics(p) { return p.topics.filter(function (id) { return BY_ID[id]; }); }
  function pathDone(p) { return pathValidTopics(p).filter(function (id) { return isDone(id); }).length; }
  function estLabel(count) { var mins = count * 6; return mins >= 60 ? (mins / 60).toFixed(mins % 60 ? 1 : 0) + " hr" : mins + " min"; }
  var LEVEL_TAG = { "Beginner": "tag-accent-2", "Intermediate": "tag-accent", "Advanced": "tag-neutral" };

  function pathCard(p) {
    var topics = pathValidTopics(p), done = pathDone(p), pct = topics.length ? Math.round(done / topics.length * 100) : 0;
    return '<a class="path-card" href="#path/' + p.id + '">' +
      '<div class="pc-top"><span class="tag ' + (LEVEL_TAG[p.level] || "tag-neutral") + '">' + esc(p.level) + '</span>' +
      '<span class="pc-meta">' + topics.length + " topics · ~" + estLabel(topics.length) + "</span></div>" +
      '<div class="pc-title">' + esc(p.title) + "</div>" +
      '<div class="pc-blurb">' + esc(p.blurb) + "</div>" +
      '<div class="pc-progress"><div class="progress-track"><div class="progress-fill" style="width:' + pct + '%"></div></div>' +
      '<span class="pc-pct">' + done + " / " + topics.length + "</span></div></a>";
  }

  function renderPaths() {
    var h = '<div class="content-inner">';
    h += '<div class="breadcrumb"><a href="#home">Home</a><span class="sep">/</span><span class="cur">Learning paths</span></div>';
    h += '<div class="hero" style="margin-bottom:var(--space-6)"><div class="eyebrow">Guided learning</div><h1>Learning paths</h1>' +
      "<p>Curated, ordered tracks that take you from the basics to advanced — each sequences topics across categories so you always know what to study next. Your progress is shared with the rest of the hub.</p></div>";
    ["Beginner", "Intermediate", "Advanced"].forEach(function (lvl) {
      var group = PATHS.filter(function (p) { return p.level === lvl; });
      if (!group.length) return;
      h += '<div class="section-title">' + lvl + "</div><div class=\"path-grid\">" + group.map(pathCard).join("") + "</div>";
    });
    h += "</div>";
    content.innerHTML = h; content.scrollTop = 0;
    renderSidebar();
  }

  function renderPath(id) {
    var p = PATH_BY_ID[id];
    if (!p) { renderPaths(); return; }
    var topics = pathValidTopics(p), done = pathDone(p), pct = topics.length ? Math.round(done / topics.length * 100) : 0;
    var nextId = topics.filter(function (t) { return !isDone(t); })[0];
    var h = '<div class="content-inner">';
    h += '<div class="breadcrumb"><a href="#home">Home</a><span class="sep">/</span><a href="#paths">Paths</a><span class="sep">/</span><span class="cur">' + esc(p.title) + "</span></div>";
    h += '<div class="topic-head"><div class="tag-row"><span class="tag ' + (LEVEL_TAG[p.level] || "tag-neutral") + '">' + esc(p.level) + '</span>' +
      '<span class="tag tag-outline">' + topics.length + " topics</span><span class=\"tag tag-outline\">~" + estLabel(topics.length) + "</span></div>" +
      "<h1>" + esc(p.title) + "</h1><p class=\"short\">" + esc(p.blurb) + "</p>";
    h += '<div class="path-progress-row"><div class="progress-track" style="max-width:320px"><div class="progress-fill" style="width:' + pct + '%"></div></div><span class="pc-pct">' + done + " / " + topics.length + " done</span></div>";
    h += '<div class="topic-actions">';
    if (nextId) h += '<a class="btn btn-primary" href="#t/' + nextId + '">' + (done ? "Continue" : "Start") + ": " + esc(BY_ID[nextId].title) + " →</a>";
    else h += '<span class="tag tag-accent-2" style="padding:10px 18px">✓ Path complete — nice work!</span>';
    h += "</div></div>";
    h += '<ol class="path-list">';
    topics.forEach(function (tid, i) {
      var t = BY_ID[tid], d = isDone(tid);
      h += '<li class="path-step' + (d ? " done" : "") + (tid === nextId ? " current" : "") + '">' +
        '<button class="path-check" data-path-toggle="' + tid + '" aria-label="Toggle complete" title="Mark complete">' + (d ? ICONS.check.replace('width="20" height="20"', 'width="16" height="16"') : "") + "</button>" +
        '<a class="path-step-main" href="#t/' + tid + '"><span class="ps-num">' + (i + 1) + "</span>" +
        '<span class="ps-text"><span class="ps-title">' + esc(t.title) + '</span><span class="ps-meta">' + esc(CAT_LABEL[t.category]) + " · " + esc(t.difficulty) + "</span></span>" +
        (tid === nextId ? '<span class="ps-flag">Up next</span>' : "") + "</a></li>";
    });
    h += "</ol>";
    h += quizHtml(p.id);
    h += "</div>";
    content.innerHTML = h; content.scrollTop = 0;
    Array.prototype.forEach.call(content.querySelectorAll("[data-path-toggle]"), function (b) {
      b.addEventListener("click", function (e) { e.preventDefault(); toggleDone(b.getAttribute("data-path-toggle")); renderPath(id); });
    });
    wireQuiz(p.id);
    renderSidebar();
  }

  var QUIZZES = window.QUIZZES || {};
  function quizHtml(pathId) {
    var qs = QUIZZES[pathId];
    if (!qs || !qs.length) return "";
    var best = quizScore[pathId];
    var h = '<div class="sec quiz" id="quiz"><h2>' + ICONS.check.replace('width="20" height="20"', 'width="17" height="17"') + ' Test yourself</h2>' +
      '<div class="quiz-box" data-quiz="' + pathId + '">';
    if (best) h += '<div class="quiz-best">Best score: ' + best.best + " / " + best.total + "</div>";
    qs.forEach(function (item, qi) {
      h += '<div class="quiz-q" data-qi="' + qi + '" data-answer="' + item.answer + '" data-topic="' + esc(item.topic || "") + '">' +
        '<div class="quiz-qt">' + (qi + 1) + ". " + esc(item.q) + "</div><div class=\"quiz-opts\">";
      item.options.forEach(function (o, oi) {
        h += '<label class="quiz-opt"><input type="radio" name="qz_' + pathId + "_" + qi + '" value="' + oi + '"><span class="qo-text">' + esc(o) + "</span></label>";
      });
      h += '</div><div class="quiz-explain">' + esc(item.explain || "") + "</div></div>";
    });
    h += '<div class="quiz-actions"><button class="btn btn-primary" data-quiz-check>Check answers</button>' +
      '<button class="btn btn-ghost" data-quiz-reset>Try again</button><span class="quiz-result"></span></div>';
    return h + "</div></div>";
  }
  function wireQuiz(pathId) {
    var box = content.querySelector('.quiz-box[data-quiz="' + pathId + '"]');
    if (!box) return;
    var qs = QUIZZES[pathId];
    box.querySelector("[data-quiz-check]").addEventListener("click", function () {
      var score = 0;
      Array.prototype.forEach.call(box.querySelectorAll(".quiz-q"), function (q, qi) {
        var ans = parseInt(q.getAttribute("data-answer"), 10);
        var topic = q.getAttribute("data-topic");
        var chosen = q.querySelector("input:checked");
        q.classList.add("graded");
        Array.prototype.forEach.call(q.querySelectorAll(".quiz-opt"), function (lab, oi) {
          lab.classList.remove("correct", "wrong");
          if (oi === ans) lab.classList.add("correct");
          else if (chosen && parseInt(chosen.value, 10) === oi) lab.classList.add("wrong");
        });
        var ok = chosen && parseInt(chosen.value, 10) === ans;
        if (ok) { score++; if (topic && quizWrong[topic]) { delete quizWrong[topic]; } }
        else if (topic) { quizWrong[topic] = 1; }
      });
      save(LS_QUIZWRONG, quizWrong);
      var prev = quizScore[pathId];
      if (!prev || score > prev.best) quizScore[pathId] = { best: score, total: qs.length };
      save(LS_QUIZSCORE, quizScore);
      var res = box.querySelector(".quiz-result");
      res.textContent = "You scored " + score + " / " + qs.length + (score === qs.length ? " — perfect!" : "");
      res.className = "quiz-result " + (score === qs.length ? "good" : "partial");
    });
    box.querySelector("[data-quiz-reset]").addEventListener("click", function () {
      Array.prototype.forEach.call(box.querySelectorAll(".quiz-q"), function (q) { q.classList.remove("graded"); Array.prototype.forEach.call(q.querySelectorAll(".quiz-opt"), function (l) { l.classList.remove("correct", "wrong"); }); });
      Array.prototype.forEach.call(box.querySelectorAll("input:checked"), function (i) { i.checked = false; });
      box.querySelector(".quiz-result").textContent = "";
    });
  }

  // ---------- Generic copy-code buttons ----------
  function wireCopyButtons() {
    Array.prototype.forEach.call(content.querySelectorAll("[data-copy]"), function (btn) {
      btn.addEventListener("click", function () {
        var pre = btn.closest(".code-wrap").querySelector("pre code");
        var text = pre.textContent;
        var done = function () { var o = btn.textContent; btn.textContent = "Copied ✓"; setTimeout(function () { btn.textContent = o.indexOf("Copied") === 0 ? "Copy code" : o; btn.textContent = "Copy code"; }, 1500); };
        if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, done);
        else { var ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); } catch (e) {} document.body.removeChild(ta); done(); }
      });
    });
  }

  // ---------- Phase 12: concept-dependency map ----------
  function renderMap() {
    var COL_W = 240, NODE_W = 200, HEADER_Y = 44, NODE_H = 40, GAP_Y = 14, PAD_TOP = 18;
    var cols = CATEGORIES.map(function (c) { return { cat: c, topics: KB[c.id] || [] }; }).filter(function (c) { return c.topics.length; });
    var maxRows = cols.reduce(function (m, c) { return Math.max(m, c.topics.length); }, 0);
    var canvasW = cols.length * COL_W;
    var canvasH = PAD_TOP + HEADER_Y + maxRows * (NODE_H + GAP_Y);
    var pos = {}; // id -> {x,y,cx,cy}
    cols.forEach(function (col, ci) {
      var x = ci * COL_W + (COL_W - NODE_W) / 2;
      col.topics.forEach(function (t, ri) {
        var y = PAD_TOP + HEADER_Y + ri * (NODE_H + GAP_Y);
        pos[t.id] = { x: x, y: y, cx: x + NODE_W, cyl: y + NODE_H / 2, lx: x, cy: y + NODE_H / 2, ri: ri, ci: ci };
      });
    });
    // edges from prerequisites: prereq (source, earlier) -> topic (target)
    var edges = [];
    TOPICS.forEach(function (t) {
      (t.prerequisites || []).forEach(function (p) {
        if (pos[p] && pos[t.id]) edges.push({ from: p, to: t.id });
      });
    });
    // adjacency for highlight
    var PRE = {}, POST = {};
    edges.forEach(function (e) { (PRE[e.to] = PRE[e.to] || []).push(e.from); (POST[e.from] = POST[e.from] || []).push(e.to); });
    function walk(id, adj, seen) { (adj[id] || []).forEach(function (n) { if (!seen[n]) { seen[n] = 1; walk(n, adj, seen); } }); }

    var svg = '<svg class="map-edges" width="' + canvasW + '" height="' + canvasH + '" viewBox="0 0 ' + canvasW + ' ' + canvasH + '">';
    edges.forEach(function (e) {
      var a = pos[e.from], b = pos[e.to];
      var x1, y1, x2, y2;
      // draw from right edge of the left-most node to left edge of the right-most node
      if (a.ci <= b.ci) { x1 = a.x + NODE_W; y1 = a.cy; x2 = b.x; y2 = b.cy; }
      else { x1 = a.x; y1 = a.cy; x2 = b.x + NODE_W; y2 = b.cy; }
      var dx = Math.max(30, Math.abs(x2 - x1) / 2);
      var d = "M" + x1 + " " + y1 + " C" + (x1 + (x2 > x1 ? dx : -dx)) + " " + y1 + " " + (x2 - (x2 > x1 ? dx : -dx)) + " " + y2 + " " + x2 + " " + y2;
      svg += '<path class="map-edge" data-from="' + e.from + '" data-to="' + e.to + '" d="' + d + '"/>';
    });
    svg += "</svg>";

    var nodesHtml = "";
    cols.forEach(function (col, ci) {
      nodesHtml += '<div class="map-colhead" style="left:' + (ci * COL_W) + "px;width:" + COL_W + 'px">' + ICONS[col.cat.id] + "<span>" + esc(col.cat.label) + "</span></div>";
      col.topics.forEach(function (t) {
        var p = pos[t.id];
        nodesHtml += '<a class="map-node ' + DIFF_CLASS[t.difficulty] + (isDone(t.id) ? " done" : "") + '" data-id="' + t.id + '" href="#t/' + t.id + '" ' +
          'style="left:' + p.x + "px;top:" + p.y + "px;width:" + NODE_W + "px;height:" + NODE_H + 'px">' +
          '<span class="mn-dot"></span><span class="mn-label">' + esc(t.title) + "</span>" +
          (isDone(t.id) ? '<span class="mn-check">' + ICONS.check.replace('width="20" height="20"', 'width="13" height="13"') + "</span>" : "") + "</a>";
      });
    });

    var linked = edges.length;
    var h = '<div class="content-inner">';
    h += '<div class="breadcrumb"><a href="#home">Home</a><span class="sep">/</span><span class="cur">Concept map</span></div>';
    h += '<div class="hero" style="margin-bottom:var(--space-4)"><div class="eyebrow">Phase 12 · dependency map</div><h1>How the concepts connect</h1>' +
      "<p>Every topic laid out left-to-right in learning order. Lines run from a prerequisite to the concept it unlocks. Hover a node to light up its full chain — what it needs, and what it leads to. Click to open it.</p></div>";
    h += '<div class="map-legend">' +
      '<span class="map-lg"><span class="lg-line"></span> prerequisite → unlocks</span>' +
      '<span class="map-lg"><span class="lg-dot beginner"></span> Beginner</span>' +
      '<span class="map-lg"><span class="lg-dot intermediate"></span> Intermediate</span>' +
      '<span class="map-lg"><span class="lg-dot advanced"></span> Advanced</span>' +
      '<span class="map-lg"><span class="lg-dot done"></span> completed</span>' +
      '<span class="map-lg map-count">' + linked + " prerequisite links mapped</span></div>";
    h += '<div class="map-scroll"><div class="map-canvas" style="width:' + canvasW + "px;height:" + canvasH + 'px">' + svg + nodesHtml + "</div></div>";
    h += '<div class="viz-note">Prerequisite links come from the topic enrichment data and grow as it rolls out across all ' + ORDER.length + " topics. Columns follow the guided category order.</div>";
    h += "</div>";
    content.innerHTML = h; content.scrollTop = 0;

    var edgeEls = content.querySelectorAll(".map-edge");
    var nodeEls = content.querySelectorAll(".map-node");
    Array.prototype.forEach.call(nodeEls, function (node) {
      node.addEventListener("mouseenter", function () {
        var id = node.getAttribute("data-id");
        var set = {}; set[id] = 1;
        walk(id, PRE, set); walk(id, POST, set);
        content.querySelector(".map-canvas").classList.add("focusing");
        Array.prototype.forEach.call(nodeEls, function (n) { n.classList.toggle("lit", !!set[n.getAttribute("data-id")]); });
        Array.prototype.forEach.call(edgeEls, function (e) { e.classList.toggle("lit", !!set[e.getAttribute("data-from")] && !!set[e.getAttribute("data-to")]); });
      });
      node.addEventListener("mouseleave", function () {
        content.querySelector(".map-canvas").classList.remove("focusing");
        Array.prototype.forEach.call(nodeEls, function (n) { n.classList.remove("lit"); });
        Array.prototype.forEach.call(edgeEls, function (e) { e.classList.remove("lit"); });
      });
    });
    renderSidebar();
  }

  // ---------- Phase 13: build-along projects ----------
  var PROJECTS = window.PROJECTS || [];
  var PROJECT_BY_ID = {}; PROJECTS.forEach(function (p) { PROJECT_BY_ID[p.id] = p; });
  var LS_PROJ = "aihub.projsteps.v1";
  var projDone = load(LS_PROJ, {}); // { "projId#i": 1 }
  function stepKey(pid, i) { return pid + "#" + i; }
  function isStepDone(pid, i) { return !!projDone[stepKey(pid, i)]; }
  function toggleStep(pid, i) { var k = stepKey(pid, i); if (projDone[k]) delete projDone[k]; else projDone[k] = 1; save(LS_PROJ, projDone); }
  function projSteps(p) { return (p.steps || []).length; }
  function projDoneCount(p) { var n = 0; (p.steps || []).forEach(function (s, i) { if (isStepDone(p.id, i)) n++; }); return n; }
  var PROJ_LEVEL_TAG = { "Beginner": "tag-accent-2", "Intermediate": "tag-accent", "Advanced": "tag-neutral" };

  function projectCard(p) {
    var total = projSteps(p), done = projDoneCount(p), pct = total ? Math.round(done / total * 100) : 0;
    return '<a class="path-card" href="#project/' + p.id + '">' +
      '<div class="pc-top"><span class="tag ' + (PROJ_LEVEL_TAG[p.level] || "tag-neutral") + '">' + esc(p.level) + '</span>' +
      '<span class="pc-meta">' + total + " steps · " + esc((p.stack || []).join(" · ")) + "</span></div>" +
      '<div class="pc-title">' + esc(p.title) + "</div>" +
      '<div class="pc-blurb">' + esc(p.blurb) + "</div>" +
      '<div class="pc-progress"><div class="progress-track"><div class="progress-fill" style="width:' + pct + '%"></div></div>' +
      '<span class="pc-pct">' + done + " / " + total + "</span></div></a>";
  }
  function renderProjects() {
    var h = '<div class="content-inner">';
    h += '<div class="breadcrumb"><a href="#home">Home</a><span class="sep">/</span><span class="cur">Projects</span></div>';
    h += '<div class="hero" style="margin-bottom:var(--space-6)"><div class="eyebrow">Phase 13 · build along</div><h1>Build-along projects</h1>' +
      "<p>Stop reading, start shipping. Each project stitches a handful of topics into one end-to-end build — every step is runnable, links back to the concept behind it, and ends with a checkpoint so you know it worked.</p></div>";
    h += '<div class="path-grid">' + PROJECTS.map(projectCard).join("") + "</div></div>";
    content.innerHTML = h; content.scrollTop = 0;
    renderSidebar();
  }
  function renderProject(id) {
    var p = PROJECT_BY_ID[id];
    if (!p) { renderProjects(); return; }
    var total = projSteps(p), done = projDoneCount(p), pct = total ? Math.round(done / total * 100) : 0;
    var h = '<div class="content-inner">';
    h += '<div class="breadcrumb"><a href="#home">Home</a><span class="sep">/</span><a href="#projects">Projects</a><span class="sep">/</span><span class="cur">' + esc(p.title) + "</span></div>";
    h += '<div class="topic-head"><div class="tag-row"><span class="tag ' + (PROJ_LEVEL_TAG[p.level] || "tag-neutral") + '">' + esc(p.level) + '</span>' +
      '<span class="tag tag-outline">' + total + ' steps</span>' + (p.stack || []).map(function (s) { return '<span class="tag tag-neutral">' + esc(s) + "</span>"; }).join("") + "</div>" +
      "<h1>" + esc(p.title) + '</h1><p class="short">' + esc(p.blurb) + "</p>";
    h += '<div class="path-progress-row"><div class="progress-track" style="max-width:320px"><div class="progress-fill" style="width:' + pct + '%"></div></div><span class="pc-pct">' + done + " / " + total + " steps</span></div></div>";
    // brief
    h += '<div class="proj-brief">';
    h += '<div class="pb-cell"><div class="pb-k">Goal</div><div class="pb-v">' + esc(p.goal) + "</div></div>";
    if (p.dataset) h += '<div class="pb-cell"><div class="pb-k">Data</div><div class="pb-v">' + esc(p.dataset) + "</div></div>";
    if (p.outcome) h += '<div class="pb-cell"><div class="pb-k">You\'ll end with</div><div class="pb-v">' + esc(p.outcome) + "</div></div>";
    h += "</div>";
    // steps
    h += '<div class="proj-steps">';
    (p.steps || []).forEach(function (s, i) {
      var d = isStepDone(p.id, i), t = BY_ID[s.topic];
      h += '<div class="proj-step' + (d ? " done" : "") + '" id="pstep-' + i + '">' +
        '<div class="ps-head"><button class="proj-check" data-step="' + i + '" aria-label="Mark step done">' + (d ? ICONS.check.replace('width="20" height="20"', 'width="15" height="15"') : (i + 1)) + "</button>" +
        '<div class="ps-headtext"><div class="ps-title">' + esc(s.title) + "</div>" +
        (t ? '<a class="ps-topic" href="#t/' + s.topic + '">' + ICONS.bulb.replace('width="20" height="20"', 'width="13" height="13"') + " Concept: " + esc(t.title) + "</a>" : "") +
        "</div></div>";
      if (s.detail) h += '<div class="ps-detail">' + md(s.detail) + "</div>";
      if (s.code) h += '<div class="code-wrap"><div class="code-bar"><span class="code-lang">Python</span><button class="btn btn-secondary" data-copy type="button">Copy code</button></div><pre class="code"><code>' + highlightPy(s.code) + "</code></pre></div>";
      if (s.checkpoint) h += '<div class="ps-check"><span class="ps-check-k">' + ICONS.check.replace('width="20" height="20"', 'width="14" height="14"') + ' Checkpoint</span> ' + md(s.checkpoint) + "</div>";
      h += "</div>";
    });
    h += "</div>";
    // completion
    h += '<div class="proj-done-banner' + (done === total && total ? " show" : "") + '">' + ICONS.check + " Project complete — you built it end to end. Try swapping in your own data next.</div>";
    h += "</div>";
    content.innerHTML = h; content.scrollTop = 0;
    Array.prototype.forEach.call(content.querySelectorAll(".proj-check"), function (b) {
      b.addEventListener("click", function () { toggleStep(p.id, parseInt(b.getAttribute("data-step"), 10)); renderProject(id); });
    });
    wireCopyButtons();
    renderSidebar();
  }

  // ---------- Phase 14: personal dashboard ----------
  function bestStreak() { var m = 0; Object.keys(srState).forEach(function (id) { if (srState[id].streak > m) m = srState[id].streak; }); return m; }
  function renderDashboard() {
    var doneIds = completed.filter(function (id) { return BY_ID[id]; });
    var pct = ORDER.length ? Math.round(doneIds.length / ORDER.length * 100) : 0;
    var seen = TOPICS.filter(function (t) { return srSeen(t.id); }).length;
    var mastered = TOPICS.filter(function (t) { return srBox(t.id) >= SR_MASTERED; }).length;
    var dueCount = TOPICS.filter(function (t) { return srSeen(t.id) && srDue(t.id); }).length;
    var weak = weakTopics();
    var nextId = ORDER.filter(function (id) { return !isDone(id); })[0];
    var R = 52, C = 2 * Math.PI * R, off = C * (1 - pct / 100);

    var h = '<div class="content-inner">';
    h += '<div class="hero" style="margin-bottom:var(--space-5)"><div class="eyebrow">Phase 14 · your progress</div><h1>Dashboard</h1>' +
      "<p>Everything you've done in one place — what you've learned, what's due for review, and where you're weakest. All stored on this device.</p></div>";

    // top row: ring + key stats + actions
    h += '<div class="dash-top">';
    h += '<div class="dash-ring-card"><svg width="128" height="128" viewBox="0 0 128 128"><circle cx="64" cy="64" r="' + R + '" class="ring-bg"/>' +
      '<circle cx="64" cy="64" r="' + R + '" class="ring-fg" stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + off.toFixed(1) + '" transform="rotate(-90 64 64)"/>' +
      '<text x="64" y="60" class="ring-pct">' + pct + '%</text><text x="64" y="80" class="ring-sub">complete</text></svg>' +
      '<div class="drc-meta">' + doneIds.length + " of " + ORDER.length + " topics</div></div>";
    h += '<div class="dash-stats">' +
      dashStat(seen + " / " + ORDER.length, "Reviewed", "in Interview mode") +
      dashStat(mastered, "Mastered", "box 4+ of 5") +
      dashStat(dueCount, "Due now", "for spaced review") +
      dashStat(bestStreak(), "Best streak", "correct in a row") +
      "</div>";
    h += "</div>";

    // actions
    h += '<div class="dash-actions">';
    if (nextId) h += '<a class="btn btn-primary" href="#t/' + nextId + '">Resume: ' + esc(BY_ID[nextId].title) + " →</a>";
    else h += '<span class="tag tag-accent-2" style="padding:10px 18px">✓ Every topic complete!</span>';
    if (dueCount) h += '<a class="btn btn-secondary" href="#home" id="dashReview">Review ' + dueCount + " due card" + (dueCount > 1 ? "s" : "") + " →</a>";
    h += '<a class="btn btn-secondary" href="#map">Open concept map →</a>';
    h += "</div>";

    // by category
    h += '<div class="section-title">Progress by category</div><div class="dash-cats">';
    CATEGORIES.forEach(function (c) {
      var ts = KB[c.id] || [], dc = ts.filter(function (t) { return isDone(t.id); }).length;
      var cp = ts.length ? Math.round(dc / ts.length * 100) : 0;
      h += '<a class="dash-cat" href="#cat/' + c.id + '"><span class="dc-ico">' + ICONS[c.id] + '</span>' +
        '<span class="dc-body"><span class="dc-name">' + esc(c.label) + '<span class="dc-num">' + dc + " / " + ts.length + "</span></span>" +
        '<span class="progress-track"><span class="progress-fill" style="width:' + cp + '%"></span></span></span></a>';
    });
    h += "</div>";

    // weak spots
    if (weak.length) {
      h += '<div class="section-title">Weak spots (' + weak.length + ")</div><div class=\"weak-panel\"><div class=\"weak-k\">Missed in a quiz or still in an early review box — worth another pass.</div><div class=\"related-row\">" +
        weak.slice(0, 16).map(function (id) { return '<a class="rel-chip" href="#t/' + id + '">' + esc(BY_ID[id].title) + "</a>"; }).join("") + "</div></div>";
    }

    // paths + projects progress side by side
    h += '<div class="dash-two">';
    h += '<div><div class="section-title" style="margin-top:0">Learning paths</div><div class="dash-list">';
    PATHS.forEach(function (p) {
      var ts = pathValidTopics(p), dc = pathDone(p), cp = ts.length ? Math.round(dc / ts.length * 100) : 0;
      h += '<a class="dash-line" href="#path/' + p.id + '"><span class="dl-title">' + esc(p.title) + '</span><span class="progress-track"><span class="progress-fill" style="width:' + cp + '%"></span></span><span class="dl-num">' + dc + "/" + ts.length + "</span></a>";
    });
    h += "</div></div>";
    h += '<div><div class="section-title" style="margin-top:0">Projects</div><div class="dash-list">';
    PROJECTS.forEach(function (p) {
      var total = projSteps(p), dc = projDoneCount(p), cp = total ? Math.round(dc / total * 100) : 0;
      h += '<a class="dash-line" href="#project/' + p.id + '"><span class="dl-title">' + esc(p.title) + '</span><span class="progress-track"><span class="progress-fill" style="width:' + cp + '%"></span></span><span class="dl-num">' + dc + "/" + total + "</span></a>";
    });
    h += "</div></div></div>";

    h += "</div>";
    content.innerHTML = h; content.scrollTop = 0;
    var dr = $("#dashReview");
    if (dr) dr.addEventListener("click", function (e) { e.preventDefault(); ivFilter = "due"; setMode("interview"); location.hash = "#home"; });
    renderSidebar();
  }
  function dashStat(v, k, sub) {
    return '<div class="dash-stat"><div class="ds-v">' + esc(String(v)) + '</div><div class="ds-k">' + esc(k) + '</div><div class="ds-sub">' + esc(sub) + "</div></div>";
  }

  // ---------- Keyboard help ----------
  var KB_SHORTCUTS = [
    { k: ["Ctrl", "K"], d: "Open search" },
    { k: ["/"], d: "Open search" },
    { k: ["j"], d: "Next topic" },
    { k: ["k"], d: "Previous topic" },
    { k: ["m"], d: "Mark current topic complete" },
    { k: ["g", "h"], d: "Go home" },
    { k: ["g", "d"], d: "Go to dashboard" },
    { k: ["?"], d: "This help" },
    { k: ["Esc"], d: "Close any overlay" }
  ];
  function openKbHelp() {
    var g = $("#kbGrid");
    g.innerHTML = KB_SHORTCUTS.map(function (s) {
      return '<div class="kb-row"><span class="kb-keys">' + s.k.map(function (x) { return "<kbd>" + esc(x) + "</kbd>"; }).join('<span class="kb-plus">then</span>') + "</span><span class=\"kb-desc\">" + esc(s.d) + "</span></div>";
    }).join("");
    $("#kbModal").classList.add("open");
  }
  function closeKbHelp() { $("#kbModal").classList.remove("open"); }

  // ---------- Router ----------
  function currentTopicId() {
    var m = location.hash.match(/^#t\/(.+)$/);
    return m ? m[1] : null;
  }
  function navTopic(delta) {
    var cid = currentTopicId();
    if (!cid || ORDER.indexOf(cid) === -1) { if (ORDER.length) location.hash = "#t/" + ORDER[0]; return; }
    var i = ORDER.indexOf(cid) + delta;
    if (i < 0) i = 0; if (i > ORDER.length - 1) i = ORDER.length - 1;
    location.hash = "#t/" + ORDER[i];
  }
  function route() {
    var hash = location.hash || "#home";
    closeSidebar();
    if (hash === "#paths") return renderPaths();
    if (hash === "#projects") return renderProjects();
    if (hash === "#map") return renderMap();
    if (hash === "#dashboard") return renderDashboard();
    var mpr = hash.match(/^#project\/(.+)$/);
    if (mpr) return renderProject(mpr[1]);
    var mp = hash.match(/^#path\/(.+)$/);
    if (mp) return renderPath(mp[1]);
    var mt = hash.match(/^#t\/(.+)$/);
    var mc = hash.match(/^#cat\/(.+)$/);
    if (COLLECTION_MODES[mode]) {
      var scrollId = mt ? mt[1] : (mc ? mc[1] : null);
      if (mode === "interview") return renderInterview(scrollId);
      if (mode === "compare") return renderCompare(scrollId);
      if (mode === "visual") return renderVisual(scrollId);
    }
    if (hash === "#home" || hash === "#") return renderHome();
    if (hash === "#glossary") return renderGlossary();
    if (mt) return renderTopic(mt[1]);
    if (mc) return renderCategory(mc[1]);
    renderHome();
  }

  // ---------- Search ----------
  var searchModal, searchInput, searchResults, searchIndex, activeResult = -1, lastResults = [];
  function buildIndex() {
    searchIndex = TOPICS.map(function (t) {
      var hay = [t.title, t.short, t.definition, t.problem, t.example, t.keyTakeaway, (t.keywords || []).join(" "), (t.related || []).map(function (r) { return BY_ID[r] ? BY_ID[r].title : ""; }).join(" ")].join(" \u0001 ").toLowerCase();
      return { type: "topic", id: t.id, title: t.title, cat: CAT_LABEL[t.category], short: t.short, hay: hay, def: t.definition };
    }).concat(GLOSSARY.map(function (g) {
      return { type: "glossary", id: g.topic, title: g.term, cat: "Glossary", short: g.definition, hay: (g.term + " " + g.definition).toLowerCase(), def: g.definition };
    }));
  }
  function openSearch() {
    searchModal.classList.add("open");
    searchInput.value = "";
    runSearch("");
    setTimeout(function () { searchInput.focus(); }, 30);
  }
  function closeSearch() { searchModal.classList.remove("open"); }
  function excerpt(item, q) {
    var text = item.short || item.def || "";
    if (!q) return esc(text.slice(0, 130)) + (text.length > 130 ? "…" : "");
    var lc = (item.short + " " + item.def).toLowerCase();
    var pos = lc.indexOf(q);
    var src = item.short + " " + item.def;
    if (pos === -1) return esc(text.slice(0, 130)) + (text.length > 130 ? "…" : "");
    var start = Math.max(0, pos - 40);
    var snip = (start > 0 ? "…" : "") + src.slice(start, pos + q.length + 90) + "…";
    // highlight
    var re = new RegExp("(" + q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig");
    return esc(snip).replace(new RegExp("(" + q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig"), "<mark>$1</mark>");
  }
  function runSearch(q) {
    q = q.trim().toLowerCase();
    var results;
    if (!q) {
      results = searchIndex.filter(function (r) { return r.type === "topic"; }).slice(0, 8);
    } else {
      var terms = q.split(/\s+/);
      results = searchIndex.map(function (r) {
        var score = 0;
        terms.forEach(function (term) {
          if (r.title.toLowerCase().indexOf(term) !== -1) score += 10;
          var idx = r.hay.indexOf(term);
          if (idx !== -1) score += 3;
        });
        // whole-phrase bonus
        if (r.hay.indexOf(q) !== -1) score += 5;
        return { r: r, score: score };
      }).filter(function (x) { return x.score > 0; }).sort(function (a, b) { return b.score - a.score; }).slice(0, 12).map(function (x) { return x.r; });
    }
    lastResults = results; activeResult = results.length ? 0 : -1;
    if (!results.length) {
      searchResults.innerHTML = '<div class="search-empty">No matches. Try another term — search covers titles, definitions, problems, examples and keywords.</div>';
      return;
    }
    searchResults.innerHTML = results.map(function (r, i) {
      return '<a class="sr-item' + (i === 0 ? " active" : "") + '" href="#t/' + (r.id || "home") + '" data-i="' + i + '">' +
        '<div class="sr-top"><span class="sr-cat">' + esc(r.cat) + '</span><span class="sr-title">' + esc(r.title) + "</span></div>" +
        '<div class="sr-excerpt">' + excerpt(r, q) + "</div></a>";
    }).join("");
    Array.prototype.forEach.call(searchResults.querySelectorAll(".sr-item"), function (a) {
      a.addEventListener("click", function () { closeSearch(); });
      a.addEventListener("mouseenter", function () { setActive(parseInt(a.getAttribute("data-i"), 10)); });
    });
  }
  function setActive(i) {
    var items = searchResults.querySelectorAll(".sr-item");
    if (!items.length) return;
    activeResult = (i + items.length) % items.length;
    Array.prototype.forEach.call(items, function (it, idx) { it.classList.toggle("active", idx === activeResult); });
    items[activeResult].scrollIntoViewIfNeeded ? items[activeResult].scrollIntoViewIfNeeded() : null;
  }
  function gotoActive() {
    var items = searchResults.querySelectorAll(".sr-item");
    if (activeResult >= 0 && items[activeResult]) { location.hash = items[activeResult].getAttribute("href").slice(1); closeSearch(); }
  }

  // ---------- Sidebar (mobile) ----------
  function openSidebar() { $("#sidebar").classList.add("open"); $("#scrim").classList.add("open"); }
  function closeSidebar() { $("#sidebar").classList.remove("open"); $("#scrim").classList.remove("open"); }

  // ---------- Init ----------
  function init() {
    searchModal = $("#searchModal"); searchInput = $("#searchInput"); searchResults = $("#searchResults");
    buildIndex();
    $("#searchTrigger").addEventListener("click", openSearch);
    $("#menuBtn").addEventListener("click", openSidebar);
    $("#printBtn").addEventListener("click", function () { window.print(); });
    $("#kbHelpBtn").addEventListener("click", openKbHelp);
    $("#kbClose").addEventListener("click", closeKbHelp);
    $("#kbModal").addEventListener("click", function (e) { if (e.target === $("#kbModal")) closeKbHelp(); });
    $("#scrim").addEventListener("click", closeSidebar);
    searchInput.addEventListener("input", function () { runSearch(searchInput.value); });
    searchModal.addEventListener("click", function (e) { if (e.target === searchModal) closeSearch(); });
    var gPending = false, gTimer = null;
    document.addEventListener("keydown", function (e) {
      if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) { e.preventDefault(); searchModal.classList.contains("open") ? closeSearch() : openSearch(); return; }
      if (e.key === "/" && !/input|textarea/i.test(document.activeElement.tagName) && !searchModal.classList.contains("open")) { e.preventDefault(); openSearch(); return; }
      if (searchModal.classList.contains("open")) {
        if (e.key === "Escape") closeSearch();
        else if (e.key === "ArrowDown") { e.preventDefault(); setActive(activeResult + 1); }
        else if (e.key === "ArrowUp") { e.preventDefault(); setActive(activeResult - 1); }
        else if (e.key === "Enter") { e.preventDefault(); gotoActive(); }
        return;
      }
      if ($("#kbModal").classList.contains("open")) { if (e.key === "Escape") closeKbHelp(); return; }
      // ---- study-mode shortcuts (only when not typing) ----
      if (/input|textarea|select/i.test(document.activeElement.tagName) || e.ctrlKey || e.metaKey || e.altKey) return;
      if (gPending) {
        gPending = false; clearTimeout(gTimer);
        if (e.key === "h") { location.hash = "#home"; return; }
        if (e.key === "d") { location.hash = "#dashboard"; return; }
        if (e.key === "m") { location.hash = "#map"; return; }
        if (e.key === "p") { location.hash = "#projects"; return; }
      }
      if (e.key === "?") { e.preventDefault(); openKbHelp(); return; }
      if (e.key === "g") { gPending = true; gTimer = setTimeout(function () { gPending = false; }, 900); return; }
      if (e.key === "j") { e.preventDefault(); navTopic(1); return; }
      if (e.key === "k") { e.preventDefault(); navTopic(-1); return; }
      if (e.key === "m") { var cid = currentTopicId(); if (cid && BY_ID[cid]) { toggleDone(cid); route(); } return; }
    });
    window.addEventListener("hashchange", route);
    window.addEventListener("resize", function () { /* redraw viz if a topic is open */
      var id = currentTopicId();
      if (id && BY_ID[id] && BY_ID[id].viz) { var host = $("#vizHost"); if (host) { host.innerHTML = ""; try { window.VIZ[BY_ID[id].viz](host); } catch (e) {} } }
    });
    updateProgress();
    renderModeBar();
    renderSidebar();
    route();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
