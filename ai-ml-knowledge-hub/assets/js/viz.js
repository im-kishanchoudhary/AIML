/* ============================================================
   Interactive visualizations for the AI/ML Knowledge Hub.
   Pure Canvas 2D + DOM — no libraries, works offline.
   window.VIZ[key](containerEl) builds the widget for a topic.
   ============================================================ */
(function () {
  "use strict";

  // ---- palette pulled from the Organic tokens ----
  function cssVar(n) { return getComputedStyle(document.documentElement).getPropertyValue(n).trim(); }
  var PAL = {};
  function loadPalette() {
    PAL = {
      accent: cssVar("--color-accent") || "#c67139",
      accent700: cssVar("--color-accent-700") || "#8c491a",
      accent300: cssVar("--color-accent-300") || "#ffc6a5",
      sage: cssVar("--color-accent-2-500") || "#8fa073",
      sage700: cssVar("--color-accent-2-700") || "#56633f",
      ink: cssVar("--color-text") || "#201e1d",
      grid: "rgba(32,30,29,0.12)",
      bg: cssVar("--color-bg") || "#f5ead8",
      surface: cssVar("--color-surface") || "#ebddc5",
      muted: "rgba(32,30,29,0.5)"
    };
  }

  // ---- small DOM helpers ----
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function mkCanvas(parent, w, h) {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var c = el("canvas");
    c.width = w * dpr; c.height = h * dpr;
    c.style.width = w + "px"; c.style.height = h + "px";
    parent.appendChild(c);
    var ctx = c.getContext("2d");
    ctx.scale(dpr, dpr);
    return { canvas: c, ctx: ctx, w: w, h: h };
  }
  function slider(cfg) {
    // cfg: {label, min, max, step, value, fmt, onInput}
    var wrap = el("div", "viz-control");
    var lab = el("label");
    var name = el("span", null, cfg.label);
    var val = el("b", null, cfg.fmt ? cfg.fmt(cfg.value) : cfg.value);
    lab.appendChild(name); lab.appendChild(val);
    var inp = el("input");
    inp.type = "range"; inp.min = cfg.min; inp.max = cfg.max; inp.step = cfg.step; inp.value = cfg.value;
    inp.addEventListener("input", function () {
      var v = parseFloat(inp.value);
      val.textContent = cfg.fmt ? cfg.fmt(v) : v;
      cfg.onInput(v);
    });
    wrap.appendChild(lab); wrap.appendChild(inp);
    return wrap;
  }
  function statBox(k) {
    var b = el("div", "viz-stat");
    var v = el("div", "v", "–");
    var kk = el("div", "k", k);
    b.appendChild(v); b.appendChild(kk);
    b._v = v;
    return b;
  }
  function button(label, onClick) {
    var b = el("button", "btn btn-secondary", label);
    b.type = "button";
    b.addEventListener("click", onClick);
    return b;
  }
  // seeded RNG so a widget is reproducible until "new" is pressed
  function rng(seed) {
    var s = seed || 12345;
    return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
  }
  function gauss(rand) {
    var u = 0, v = 0;
    while (u === 0) u = rand();
    while (v === 0) v = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }
  function mean(a) { return a.reduce(function (s, x) { return s + x; }, 0) / a.length; }
  function std(a) { var m = mean(a); return Math.sqrt(mean(a.map(function (x) { return (x - m) * (x - m); }))); }
  function median(a) { var b = a.slice().sort(function (x, y) { return x - y; }); var n = b.length; return n % 2 ? b[(n - 1) / 2] : (b[n / 2 - 1] + b[n / 2]) / 2; }

  var VIZ = {};

  // 1 ── Mean / Median / Mode ─────────────────────────────
  VIZ["central-tendency"] = function (root) {
    var base = [42, 45, 48, 50, 50, 52, 55];
    var outlier = 60;
    var cv = mkCanvas(root, Math.min(root.clientWidth || 620, 700), 220);
    var readout = el("div", "viz-readout");
    var sMean = statBox("Mean"), sMed = statBox("Median"), sMode = statBox("Mode");
    readout.appendChild(sMean); readout.appendChild(sMed); readout.appendChild(sMode);
    var controls = el("div", "viz-controls");
    controls.appendChild(slider({
      label: "Highest value (drag to an extreme)", min: 55, max: 500, step: 5, value: outlier,
      fmt: function (v) { return v + "k"; }, onInput: function (v) { outlier = v; draw(); }
    }));
    var note = el("div", "viz-note", "As the top salary grows, the <b>mean</b> is dragged toward it while the <b>median</b> barely moves — which is why skewed data is reported with the median.");
    root.appendChild(readout); root.appendChild(controls); root.appendChild(note);

    function draw() {
      var data = base.concat([outlier]);
      var mn = mean(data), md = median(data);
      var counts = {}; data.forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });
      var mode = Object.keys(counts).reduce(function (a, b) { return counts[b] > counts[a] ? b : a; });
      sMean._v.textContent = mn.toFixed(1) + "k";
      sMed._v.textContent = md.toFixed(0) + "k";
      sMode._v.textContent = mode + "k";
      var ctx = cv.ctx, W = cv.w, H = cv.h;
      ctx.clearRect(0, 0, W, H);
      var pad = 30, axisY = H - 40;
      var lo = 40, hi = Math.max(60, outlier);
      function X(v) { return pad + (v - lo) / (hi - lo) * (W - 2 * pad); }
      ctx.strokeStyle = PAL.grid; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(pad, axisY); ctx.lineTo(W - pad, axisY); ctx.stroke();
      // dots
      data.forEach(function (v) {
        ctx.beginPath(); ctx.arc(X(v), axisY, 8, 0, 7); ctx.fillStyle = PAL.sage; ctx.globalAlpha = .8; ctx.fill(); ctx.globalAlpha = 1;
      });
      // mean & median markers
      function marker(v, color, label, up) {
        var x = X(v), y = up ? 26 : 54;
        ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.setLineDash([4, 3]);
        ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, axisY); ctx.stroke(); ctx.setLineDash([]);
        ctx.fillStyle = color; ctx.font = "600 13px Figtree, sans-serif"; ctx.textAlign = "center";
        ctx.fillText(label, x, y - 6);
      }
      marker(mn, PAL.accent, "Mean", true);
      marker(md, PAL.sage700, "Median", false);
    }
    draw();
  };

  // 2 ── Standard deviation / spread ──────────────────────
  VIZ["std-spread"] = function (root) {
    var spread = 1.3;
    var rand = rng(7);
    var cv = mkCanvas(root, Math.min(root.clientWidth || 620, 700), 210);
    var readout = el("div", "viz-readout");
    var sA = statBox("Machine A · std"), sB = statBox("Machine B · std");
    readout.appendChild(sA); readout.appendChild(sB);
    var controls = el("div", "viz-controls");
    controls.appendChild(slider({
      label: "Machine B variability", min: 0.1, max: 3, step: 0.1, value: spread,
      fmt: function (v) { return "±" + v.toFixed(1); }, onInput: function (v) { spread = v; draw(); }
    }));
    root.appendChild(readout); root.appendChild(controls);
    root.appendChild(el("div", "viz-note", "Both machines average 10&nbsp;mm. Standard deviation reveals the one you can't trust — same centre, very different spread."));
    function draw() {
      var A = [], B = [], r2 = rng(11);
      for (var i = 0; i < 40; i++) { A.push(10 + gauss(rand) * 0.08); B.push(10 + gauss(r2) * spread); }
      sA._v.textContent = std(A).toFixed(2); sB._v.textContent = std(B).toFixed(2);
      var ctx = cv.ctx, W = cv.w, H = cv.h; ctx.clearRect(0, 0, W, H);
      var lo = 6, hi = 14, pad = 24;
      function X(v) { return pad + (Math.max(lo, Math.min(hi, v)) - lo) / (hi - lo) * (W - 2 * pad); }
      [{ d: A, y: 60, c: PAL.sage, l: "Machine A (consistent)" }, { d: B, y: 150, c: PAL.accent, l: "Machine B (variable)" }].forEach(function (row) {
        ctx.strokeStyle = PAL.grid; ctx.beginPath(); ctx.moveTo(pad, row.y); ctx.lineTo(W - pad, row.y); ctx.stroke();
        ctx.fillStyle = PAL.muted; ctx.font = "12px Figtree, sans-serif"; ctx.textAlign = "left";
        ctx.fillText(row.l, pad, row.y - 26);
        // target line at 10
        ctx.strokeStyle = PAL.grid; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(X(10), row.y - 18); ctx.lineTo(X(10), row.y + 18); ctx.stroke(); ctx.setLineDash([]);
        row.d.forEach(function (v) { ctx.beginPath(); ctx.arc(X(v), row.y, 5, 0, 7); ctx.fillStyle = row.c; ctx.globalAlpha = .55; ctx.fill(); ctx.globalAlpha = 1; });
      });
    }
    draw();
  };

  // 3 ── Normal distribution ──────────────────────────────
  VIZ["normal-dist"] = function (root) {
    var mu = 175, sigma = 7, shade = 1;
    var cv = mkCanvas(root, Math.min(root.clientWidth || 620, 700), 260);
    var controls = el("div", "viz-controls");
    controls.appendChild(slider({ label: "Mean (μ)", min: 150, max: 200, step: 1, value: mu, fmt: function (v) { return v + "cm"; }, onInput: function (v) { mu = v; draw(); } }));
    controls.appendChild(slider({ label: "Std dev (σ)", min: 3, max: 15, step: 0.5, value: sigma, fmt: function (v) { return v + "cm"; }, onInput: function (v) { sigma = v; draw(); } }));
    controls.appendChild(slider({ label: "Shade ± σ region", min: 1, max: 3, step: 1, value: shade, fmt: function (v) { return "±" + v + "σ"; }, onInput: function (v) { shade = v; draw(); } }));
    var readout = el("div", "viz-readout");
    var sPct = statBox("Within region"); readout.appendChild(sPct);
    root.appendChild(readout); root.appendChild(controls);
    root.appendChild(el("div", "viz-note", "The 68–95–99.7 rule: about 68% of values fall within ±1σ, 95% within ±2σ, 99.7% within ±3σ."));
    function draw() {
      var ctx = cv.ctx, W = cv.w, H = cv.h; ctx.clearRect(0, 0, W, H);
      var pad = 24, axisY = H - 30, lo = 145, hi = 205;
      function X(v) { return pad + (v - lo) / (hi - lo) * (W - 2 * pad); }
      function pdf(x) { return Math.exp(-0.5 * Math.pow((x - mu) / sigma, 2)); }
      var peak = 1, top = 24;
      function Y(p) { return axisY - p / peak * (axisY - top); }
      // shaded region
      ctx.fillStyle = "rgba(198,113,57,0.18)";
      ctx.beginPath(); ctx.moveTo(X(mu - shade * sigma), axisY);
      for (var x = mu - shade * sigma; x <= mu + shade * sigma; x += 0.5) ctx.lineTo(X(x), Y(pdf(x)));
      ctx.lineTo(X(mu + shade * sigma), axisY); ctx.closePath(); ctx.fill();
      // curve
      ctx.strokeStyle = PAL.accent; ctx.lineWidth = 2.5; ctx.beginPath();
      for (var xx = lo; xx <= hi; xx += 0.5) { var px = X(xx), py = Y(pdf(xx)); if (xx === lo) ctx.moveTo(px, py); else ctx.lineTo(px, py); }
      ctx.stroke();
      // axis + mean
      ctx.strokeStyle = PAL.grid; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(pad, axisY); ctx.lineTo(W - pad, axisY); ctx.stroke();
      ctx.strokeStyle = PAL.sage700; ctx.setLineDash([4, 3]); ctx.beginPath(); ctx.moveTo(X(mu), top); ctx.lineTo(X(mu), axisY); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = PAL.sage700; ctx.font = "600 12px Figtree, sans-serif"; ctx.textAlign = "center"; ctx.fillText("μ = " + mu, X(mu), top - 4);
      // sigma ticks
      ctx.fillStyle = PAL.muted; ctx.font = "11px Figtree, sans-serif";
      for (var k = -shade; k <= shade; k++) { if (k === 0) continue; ctx.fillText((k > 0 ? "+" : "") + k + "σ", X(mu + k * sigma), axisY + 16); }
      var pct = { 1: "68%", 2: "95%", 3: "99.7%" }[shade];
      sPct._v.textContent = pct;
    }
    draw();
  };

  // 4 ── Correlation scatter ──────────────────────────────
  VIZ["correlation"] = function (root) {
    var r = 0.8;
    var cv = mkCanvas(root, Math.min(root.clientWidth || 560, 560), 300);
    var readout = el("div", "viz-readout"); var sR = statBox("Correlation r"); var sStr = statBox("Strength");
    readout.appendChild(sR); readout.appendChild(sStr);
    var controls = el("div", "viz-controls");
    controls.appendChild(slider({ label: "Target correlation", min: -1, max: 1, step: 0.05, value: r, fmt: function (v) { return v.toFixed(2); }, onInput: function (v) { r = v; draw(); } }));
    root.appendChild(readout); root.appendChild(controls);
    root.appendChild(el("div", "viz-note", "r near ±1 means points hug a line; r near 0 means no linear relationship. A strong r still never proves causation."));
    function draw() {
      var rand = rng(3), pts = [];
      for (var i = 0; i < 80; i++) { var x = gauss(rand); var y = r * x + Math.sqrt(Math.max(0, 1 - r * r)) * gauss(rand); pts.push([x, y]); }
      var ctx = cv.ctx, W = cv.w, H = cv.h; ctx.clearRect(0, 0, W, H);
      var pad = 30;
      function X(v) { return pad + (v + 3) / 6 * (W - 2 * pad); }
      function Y(v) { return (H - pad) - (v + 3) / 6 * (H - 2 * pad); }
      ctx.strokeStyle = PAL.grid; ctx.lineWidth = 1;
      ctx.strokeRect(pad, pad, W - 2 * pad, H - 2 * pad);
      // trend line
      ctx.strokeStyle = PAL.accent; ctx.lineWidth = 2; ctx.globalAlpha = .8;
      ctx.beginPath(); ctx.moveTo(X(-3), Y(r * -3)); ctx.lineTo(X(3), Y(r * 3)); ctx.stroke(); ctx.globalAlpha = 1;
      pts.forEach(function (p) { ctx.beginPath(); ctx.arc(X(p[0]), Y(p[1]), 4, 0, 7); ctx.fillStyle = PAL.sage; ctx.globalAlpha = .7; ctx.fill(); ctx.globalAlpha = 1; });
      sR._v.textContent = r.toFixed(2);
      var a = Math.abs(r);
      sStr._v.textContent = a > 0.8 ? "Strong" : a > 0.5 ? "Moderate" : a > 0.2 ? "Weak" : "None";
    }
    draw();
  };

  // 5 ── Linear regression fit ────────────────────────────
  VIZ["regression"] = function (root) {
    var noise = 1.2;
    var cv = mkCanvas(root, Math.min(root.clientWidth || 560, 560), 300);
    var readout = el("div", "viz-readout");
    var sSlope = statBox("Slope"), sInt = statBox("Intercept"), sR2 = statBox("R²");
    readout.appendChild(sSlope); readout.appendChild(sInt); readout.appendChild(sR2);
    var controls = el("div", "viz-controls");
    controls.appendChild(slider({ label: "Noise in the data", min: 0, max: 4, step: 0.2, value: noise, fmt: function (v) { return v.toFixed(1); }, onInput: function (v) { noise = v; draw(); } }));
    root.appendChild(readout); root.appendChild(controls);
    root.appendChild(el("div", "viz-note", "Least squares finds the line minimizing squared vertical errors. More noise → lower R² (the line explains less of the variation)."));
    function draw() {
      var rand = rng(9), xs = [], ys = [];
      for (var i = 0; i < 40; i++) { var x = i / 4; var y = 2 * x + 5 + gauss(rand) * noise * 2; xs.push(x); ys.push(y); }
      var mx = mean(xs), my = mean(ys), num = 0, den = 0;
      for (var j = 0; j < xs.length; j++) { num += (xs[j] - mx) * (ys[j] - my); den += (xs[j] - mx) * (xs[j] - mx); }
      var slope = num / den, intercept = my - slope * mx;
      var ssTot = 0, ssRes = 0;
      for (var k = 0; k < xs.length; k++) { var pred = slope * xs[k] + intercept; ssRes += Math.pow(ys[k] - pred, 2); ssTot += Math.pow(ys[k] - my, 2); }
      var r2 = 1 - ssRes / ssTot;
      var ctx = cv.ctx, W = cv.w, H = cv.h; ctx.clearRect(0, 0, W, H);
      var pad = 34, xhi = 10, ylo = 0, yhi = 30;
      function X(v) { return pad + v / xhi * (W - 2 * pad); }
      function Y(v) { return (H - pad) - (v - ylo) / (yhi - ylo) * (H - 2 * pad); }
      ctx.strokeStyle = PAL.grid; ctx.strokeRect(pad, pad, W - 2 * pad, H - 2 * pad);
      // residuals
      ctx.strokeStyle = "rgba(198,113,57,0.35)"; ctx.lineWidth = 1;
      for (var m = 0; m < xs.length; m++) { ctx.beginPath(); ctx.moveTo(X(xs[m]), Y(ys[m])); ctx.lineTo(X(xs[m]), Y(slope * xs[m] + intercept)); ctx.stroke(); }
      // fit line
      ctx.strokeStyle = PAL.accent; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(X(0), Y(intercept)); ctx.lineTo(X(xhi), Y(slope * xhi + intercept)); ctx.stroke();
      // points
      for (var n = 0; n < xs.length; n++) { ctx.beginPath(); ctx.arc(X(xs[n]), Y(ys[n]), 4, 0, 7); ctx.fillStyle = PAL.sage; ctx.fill(); }
      sSlope._v.textContent = slope.toFixed(2); sInt._v.textContent = intercept.toFixed(1); sR2._v.textContent = r2.toFixed(2);
    }
    draw();
  };

  // 6 ── Confusion matrix / threshold ─────────────────────
  VIZ["confusion"] = function (root) {
    var t = 0.5;
    var rand = rng(5);
    var neg = [], pos = [];
    for (var i = 0; i < 200; i++) { neg.push(Math.max(0, Math.min(1, 0.35 + gauss(rand) * 0.13))); pos.push(Math.max(0, Math.min(1, 0.65 + gauss(rand) * 0.13))); }
    var top = el("div"); top.style.display = "grid"; top.style.gridTemplateColumns = "1fr auto"; top.style.gap = "24px"; top.style.alignItems = "center";
    var left = el("div"); var right = el("div");
    top.appendChild(left); top.appendChild(right);
    root.appendChild(top);
    var cv = mkCanvas(left, Math.min((root.clientWidth || 620) - 220, 380), 170);
    // matrix grid
    right.innerHTML = "";
    var grid = el("div"); grid.style.display = "grid"; grid.style.gridTemplateColumns = "auto auto"; grid.style.gap = "6px";
    var cells = {};
    [["TP", PAL.sage], ["FP", PAL.accent], ["FN", PAL.accent], ["TN", PAL.sage]].forEach(function (c) {
      var box = el("div"); box.style.cssText = "width:96px;height:60px;border-radius:12px;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#fff;font-family:var(--font-heading)";
      box.style.background = c[1]; box.style.opacity = ".9";
      var v = el("div", null, "0"); v.style.fontSize = "22px";
      var l = el("div", null, c[0]); l.style.fontSize = "11px"; l.style.opacity = ".85";
      box.appendChild(v); box.appendChild(l); grid.appendChild(box); cells[c[0]] = v;
    });
    right.appendChild(grid);
    var controls = el("div", "viz-controls");
    controls.appendChild(slider({ label: "Decision threshold", min: 0.1, max: 0.9, step: 0.02, value: t, fmt: function (v) { return v.toFixed(2); }, onInput: function (v) { t = v; draw(); } }));
    var readout = el("div", "viz-readout");
    var sP = statBox("Precision"), sR = statBox("Recall"), sA = statBox("Accuracy");
    readout.appendChild(sP); readout.appendChild(sR); readout.appendChild(sA);
    root.appendChild(readout); root.appendChild(controls);
    root.appendChild(el("div", "viz-note", "Raise the threshold and precision climbs while recall falls: you flag fewer cases but they're more often right. The best threshold depends on which error costs more."));
    function draw() {
      var TP = pos.filter(function (s) { return s > t; }).length;
      var FN = pos.length - TP;
      var FP = neg.filter(function (s) { return s > t; }).length;
      var TN = neg.length - FP;
      cells.TP.textContent = TP; cells.FP.textContent = FP; cells.FN.textContent = FN; cells.TN.textContent = TN;
      sP._v.textContent = TP + FP ? (TP / (TP + FP)).toFixed(2) : "–";
      sR._v.textContent = (TP / (TP + FN)).toFixed(2);
      sA._v.textContent = ((TP + TN) / 400).toFixed(2);
      var ctx = cv.ctx, W = cv.w, H = cv.h; ctx.clearRect(0, 0, W, H);
      var pad = 20, axisY = H - 24;
      function X(v) { return pad + v * (W - 2 * pad); }
      function hist(data, color, dir) {
        var bins = new Array(30).fill(0);
        data.forEach(function (s) { bins[Math.min(29, Math.floor(s * 30))]++; });
        var mx = Math.max.apply(null, bins);
        ctx.fillStyle = color; ctx.globalAlpha = .55;
        bins.forEach(function (b, i) { var h = b / mx * (axisY - 20); ctx.fillRect(X(i / 30), axisY - h, (W - 2 * pad) / 30 - 1, h); });
        ctx.globalAlpha = 1;
      }
      hist(neg, PAL.accent);
      hist(pos, PAL.sage);
      ctx.strokeStyle = PAL.grid; ctx.beginPath(); ctx.moveTo(pad, axisY); ctx.lineTo(W - pad, axisY); ctx.stroke();
      ctx.strokeStyle = PAL.ink; ctx.lineWidth = 2; ctx.setLineDash([5, 3]); ctx.beginPath(); ctx.moveTo(X(t), 8); ctx.lineTo(X(t), axisY); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = PAL.ink; ctx.font = "600 11px Figtree, sans-serif"; ctx.textAlign = "center"; ctx.fillText("threshold", X(t), axisY + 16);
      ctx.textAlign = "left"; ctx.fillStyle = PAL.accent700; ctx.fillText("● legit", pad, 14);
      ctx.fillStyle = PAL.sage700; ctx.fillText("● fraud", pad + 60, 14);
    }
    draw();
  };

  // 7 ── Train / validation / test split ──────────────────
  VIZ["train-test"] = function (root) {
    var testPct = 20, valPct = 15, total = 10000;
    var bar = el("div"); bar.style.cssText = "display:flex;height:58px;border-radius:999px;overflow:hidden;margin-top:8px";
    var segTrain = el("div"), segVal = el("div"), segTest = el("div");
    [segTrain, segVal, segTest].forEach(function (s) { s.style.cssText = "display:flex;align-items:center;justify-content:center;color:#fff;font-family:var(--font-heading);font-size:14px;transition:width .3s"; });
    segTrain.style.background = PAL.sage; segVal.style.background = PAL.accent300; segVal.style.color = PAL.accent700; segTest.style.background = PAL.accent;
    bar.appendChild(segTrain); bar.appendChild(segVal); bar.appendChild(segTest);
    root.appendChild(bar);
    var controls = el("div", "viz-controls");
    controls.appendChild(slider({ label: "Test set size", min: 10, max: 40, step: 5, value: testPct, fmt: function (v) { return v + "%"; }, onInput: function (v) { testPct = v; draw(); } }));
    controls.appendChild(slider({ label: "Validation set size", min: 0, max: 30, step: 5, value: valPct, fmt: function (v) { return v + "%"; }, onInput: function (v) { valPct = v; draw(); } }));
    root.appendChild(controls);
    root.appendChild(el("div", "viz-note", "Fit on <b>train</b>, tune choices on <b>validation</b>, and touch <b>test</b> once at the very end. Reusing test to tune quietly turns it into training data."));
    function draw() {
      var trainPct = Math.max(0, 100 - testPct - valPct);
      segTrain.style.width = trainPct + "%"; segVal.style.width = valPct + "%"; segTest.style.width = testPct + "%";
      segTrain.textContent = "Train " + trainPct + "%";
      segVal.textContent = valPct >= 10 ? "Val " + valPct + "%" : "";
      segTest.textContent = "Test " + testPct + "%";
    }
    draw();
  };

  // 8 ── K-means clustering ───────────────────────────────
  VIZ["kmeans"] = function (root) {
    var K = 3, seed = 21, pts = [], centers = [], assign = [];
    var cv = mkCanvas(root, Math.min(root.clientWidth || 560, 560), 320);
    var colors = [PAL.accent, PAL.sage, "#5b7fa6", "#a65b8f", "#c9a227"];
    var controls = el("div", "viz-controls");
    controls.appendChild(slider({ label: "Number of clusters K", min: 2, max: 5, step: 1, value: K, onInput: function (v) { K = v; init(); draw(); } }));
    var btns = el("div", "viz-controls");
    btns.appendChild(button("New points", function () { seed = Math.floor(Math.random() * 9999) + 1; init(); draw(); }));
    btns.appendChild(button("Step", function () { step(); draw(); }));
    btns.appendChild(button("Run to end", function () { for (var i = 0; i < 12; i++) step(); draw(); }));
    root.appendChild(controls); root.appendChild(btns);
    root.appendChild(el("div", "viz-note", "'New points' scatters data, 'Step' runs one iteration: assign each point to the nearest ✕ centre, then move each centre to its cluster's average. Watch it settle."));
    function init() {
      var rand = rng(seed); pts = [];
      var blobs = [[0.25, 0.3], [0.7, 0.35], [0.45, 0.75], [0.8, 0.75], [0.2, 0.7]];
      for (var b = 0; b < Math.max(3, K); b++) { for (var i = 0; i < 22; i++) { pts.push([blobs[b][0] + gauss(rand) * 0.07, blobs[b][1] + gauss(rand) * 0.07]); } }
      centers = []; for (var k = 0; k < K; k++) centers.push([rand(), rand()]);
      assign = pts.map(function () { return 0; });
    }
    function step() {
      assign = pts.map(function (p) {
        var best = 0, bd = Infinity;
        centers.forEach(function (c, ci) { var d = (p[0] - c[0]) * (p[0] - c[0]) + (p[1] - c[1]) * (p[1] - c[1]); if (d < bd) { bd = d; best = ci; } });
        return best;
      });
      centers = centers.map(function (c, ci) {
        var members = pts.filter(function (_, i) { return assign[i] === ci; });
        if (!members.length) return c;
        return [mean(members.map(function (m) { return m[0]; })), mean(members.map(function (m) { return m[1]; }))];
      });
    }
    function draw() {
      var ctx = cv.ctx, W = cv.w, H = cv.h; ctx.clearRect(0, 0, W, H);
      var pad = 16;
      function X(v) { return pad + v * (W - 2 * pad); }
      function Y(v) { return pad + v * (H - 2 * pad); }
      pts.forEach(function (p, i) { ctx.beginPath(); ctx.arc(X(p[0]), Y(p[1]), 5, 0, 7); ctx.fillStyle = colors[assign[i] % colors.length]; ctx.globalAlpha = .7; ctx.fill(); ctx.globalAlpha = 1; });
      centers.forEach(function (c, ci) {
        ctx.strokeStyle = colors[ci % colors.length]; ctx.lineWidth = 4; var x = X(c[0]), y = Y(c[1]), s = 9;
        ctx.beginPath(); ctx.moveTo(x - s, y - s); ctx.lineTo(x + s, y + s); ctx.moveTo(x + s, y - s); ctx.lineTo(x - s, y + s); ctx.stroke();
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 1.5; ctx.stroke();
      });
    }
    init(); draw();
  };

  // 9 ── Neural network diagram ───────────────────────────
  VIZ["neural-net"] = function (root) {
    var h1 = 5, h2 = 4;
    var cv = mkCanvas(root, Math.min(root.clientWidth || 620, 680), 300);
    var controls = el("div", "viz-controls");
    controls.appendChild(slider({ label: "Hidden layer 1 neurons", min: 2, max: 8, step: 1, value: h1, onInput: function (v) { h1 = v; draw(); } }));
    controls.appendChild(slider({ label: "Hidden layer 2 neurons", min: 0, max: 8, step: 1, value: h2, onInput: function (v) { h2 = v; draw(); } }));
    root.appendChild(controls);
    root.appendChild(el("div", "viz-note", "Each line is a weight; data flows left→right. Inputs → hidden layers that learn features → output. Set layer 2 to 0 to remove it."));
    function draw() {
      var layers = [4, h1]; if (h2 > 0) layers.push(h2); layers.push(3);
      var labels = ["input", "hidden", h2 > 0 ? "hidden" : "output", "output"];
      var ctx = cv.ctx, W = cv.w, H = cv.h; ctx.clearRect(0, 0, W, H);
      var padX = 60, padY = 30;
      var colX = layers.map(function (_, i) { return padX + i / (layers.length - 1) * (W - 2 * padX); });
      function nodeY(count, idx) { var gap = (H - 2 * padY) / (count + 1); return padY + gap * (idx + 1); }
      // connections
      ctx.strokeStyle = "rgba(198,113,57,0.25)"; ctx.lineWidth = 1;
      for (var l = 0; l < layers.length - 1; l++) {
        for (var a = 0; a < layers[l]; a++) {
          for (var b = 0; b < layers[l + 1]; b++) {
            ctx.beginPath(); ctx.moveTo(colX[l], nodeY(layers[l], a)); ctx.lineTo(colX[l + 1], nodeY(layers[l + 1], b)); ctx.stroke();
          }
        }
      }
      // nodes
      for (var li = 0; li < layers.length; li++) {
        var isEnd = li === 0 || li === layers.length - 1;
        for (var n = 0; n < layers[li]; n++) {
          ctx.beginPath(); ctx.arc(colX[li], nodeY(layers[li], n), 12, 0, 7);
          ctx.fillStyle = li === 0 ? PAL.sage : (li === layers.length - 1 ? PAL.accent : PAL.surface);
          ctx.fill(); ctx.strokeStyle = li === 0 ? PAL.sage700 : (li === layers.length - 1 ? PAL.accent700 : PAL.grid); ctx.lineWidth = 2; ctx.stroke();
        }
        ctx.fillStyle = PAL.muted; ctx.font = "11px Figtree, sans-serif"; ctx.textAlign = "center";
        ctx.fillText(li === 0 ? "input" : li === layers.length - 1 ? "output" : "hidden", colX[li], H - 8);
      }
    }
    draw();
  };

  // 10 ── RAG pipeline (animated flow) ────────────────────
  VIZ["rag-pipeline"] = function (root) {
    var steps = [
      { t: "Question", d: "\u201cWhat's our refund policy?\u201d", c: PAL.sage },
      { t: "Embed", d: "Question \u2192 vector", c: PAL.sage },
      { t: "Retrieve", d: "Vector search finds top-k relevant chunks", c: PAL.accent },
      { t: "Context", d: "Chunks inserted into the prompt", c: PAL.accent },
      { t: "LLM", d: "Generates an answer from the context", c: PAL.accent700 },
      { t: "Answer", d: "Grounded, source-cited reply", c: PAL.sage700 }
    ];
    var flow = el("div"); flow.style.cssText = "display:flex;flex-wrap:wrap;align-items:stretch;gap:8px";
    var boxes = [];
    steps.forEach(function (s, i) {
      var box = el("div"); box.style.cssText = "flex:1;min-width:120px;background:var(--color-bg);border:2px solid transparent;border-radius:16px;padding:12px 14px;transition:all .3s;opacity:.55";
      var t = el("div", null, (i + 1) + ". " + s.t); t.style.cssText = "font-family:var(--font-heading);font-size:15px;color:" + s.c;
      var d = el("div", null, s.d); d.style.cssText = "font-size:12px;color:var(--color-text);opacity:.8;margin-top:4px";
      box.appendChild(t); box.appendChild(d); box._c = s.c;
      flow.appendChild(box); boxes.push(box);
    });
    root.appendChild(flow);
    var controls = el("div", "viz-controls");
    controls.appendChild(button("▶ Play the pipeline", function () { play(); }));
    root.appendChild(controls);
    root.appendChild(el("div", "viz-note", "Traditional search stops after <b>Retrieve</b>. RAG adds the last steps — feeding retrieved context to an LLM so the answer is grounded in your real documents."));
    var timer = null;
    function play() {
      if (timer) clearInterval(timer);
      boxes.forEach(function (b) { b.style.opacity = ".55"; b.style.borderColor = "transparent"; b.style.transform = "none"; });
      var i = 0;
      timer = setInterval(function () {
        if (i > 0) { boxes[i - 1].style.transform = "none"; }
        if (i >= boxes.length) { clearInterval(timer); timer = null; return; }
        var b = boxes[i]; b.style.opacity = "1"; b.style.borderColor = b._c; b.style.transform = "translateY(-4px)";
        i++;
      }, 650);
    }
    play();
  };

  // 11 ── Overfitting curve ───────────────────────────────
  VIZ["overfitting"] = function (root) {
    var degree = 3;
    var cv = mkCanvas(root, Math.min(root.clientWidth || 560, 560), 300);
    var readout = el("div", "viz-readout");
    var sTr = statBox("Train error"), sTe = statBox("Test error"), sFit = statBox("Diagnosis");
    readout.appendChild(sTr); readout.appendChild(sTe); readout.appendChild(sFit);
    var controls = el("div", "viz-controls");
    controls.appendChild(slider({ label: "Model complexity (polynomial degree)", min: 1, max: 12, step: 1, value: degree, onInput: function (v) { degree = v; draw(); } }));
    root.appendChild(readout); root.appendChild(controls);
    root.appendChild(el("div", "viz-note", "Low degree underfits (high error everywhere). Very high degree overfits — it wiggles through training points but test error climbs. The best model is the dip in the middle."));
    // fixed sample from a smooth truth + noise
    var rand = rng(4), train = [], test = [];
    for (var i = 0; i < 12; i++) { var x = i / 11; train.push([x, Math.sin(x * 3) + gauss(rand) * 0.18]); }
    for (var j = 0; j < 12; j++) { var xt = (j + 0.5) / 12; test.push([xt, Math.sin(xt * 3) + gauss(rand) * 0.18]); }
    function fitPoly(data, deg) {
      // build Vandermonde and solve normal equations via gaussian elimination
      var n = deg + 1, X = data.map(function (p) { var row = []; for (var k = 0; k < n; k++) row.push(Math.pow(p[0], k)); return row; });
      var y = data.map(function (p) { return p[1]; });
      var A = [], bb = [];
      for (var r = 0; r < n; r++) { A[r] = []; bb[r] = 0; for (var c = 0; c < n; c++) { var s = 0; for (var m = 0; m < X.length; m++) s += X[m][r] * X[m][c]; A[r][c] = s; } for (var m2 = 0; m2 < X.length; m2++) bb[r] += X[m2][r] * y[m2]; }
      // solve A w = bb
      for (var col = 0; col < n; col++) {
        var piv = col; for (var rr = col + 1; rr < n; rr++) if (Math.abs(A[rr][col]) > Math.abs(A[piv][col])) piv = rr;
        var tmp = A[col]; A[col] = A[piv]; A[piv] = tmp; var tb = bb[col]; bb[col] = bb[piv]; bb[piv] = tb;
        if (Math.abs(A[col][col]) < 1e-9) continue;
        for (var rr2 = 0; rr2 < n; rr2++) { if (rr2 === col) continue; var f = A[rr2][col] / A[col][col]; for (var cc = col; cc < n; cc++) A[rr2][cc] -= f * A[col][cc]; bb[rr2] -= f * bb[col]; }
      }
      var w = []; for (var q = 0; q < n; q++) w[q] = A[q][q] ? bb[q] / A[q][q] : 0;
      return w;
    }
    function predict(w, x) { var s = 0; for (var k = 0; k < w.length; k++) s += w[k] * Math.pow(x, k); return s; }
    function rmse(w, data) { return Math.sqrt(mean(data.map(function (p) { return Math.pow(p[1] - predict(w, p[0]), 2); }))); }
    function draw() {
      var w = fitPoly(train, degree);
      var trErr = rmse(w, train), teErr = rmse(w, test);
      sTr._v.textContent = trErr.toFixed(2); sTe._v.textContent = teErr.toFixed(2);
      var diag = degree <= 2 ? "Underfit" : (teErr > trErr * 2.2 ? "Overfit" : "Good fit");
      sFit._v.textContent = diag;
      var ctx = cv.ctx, W = cv.w, H = cv.h; ctx.clearRect(0, 0, W, H);
      var pad = 28, ylo = -1.6, yhi = 1.6;
      function X(v) { return pad + v * (W - 2 * pad); }
      function Y(v) { return (H - pad) - (v - ylo) / (yhi - ylo) * (H - 2 * pad); }
      ctx.strokeStyle = PAL.grid; ctx.strokeRect(pad, pad, W - 2 * pad, H - 2 * pad);
      // fitted curve
      ctx.strokeStyle = PAL.accent; ctx.lineWidth = 2.5; ctx.beginPath();
      for (var x = 0; x <= 1; x += 0.005) { var px = X(x), py = Y(Math.max(ylo, Math.min(yhi, predict(w, x)))); if (x === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py); }
      ctx.stroke();
      // points
      train.forEach(function (p) { ctx.beginPath(); ctx.arc(X(p[0]), Y(p[1]), 5, 0, 7); ctx.fillStyle = PAL.sage; ctx.fill(); });
      test.forEach(function (p) { ctx.beginPath(); ctx.arc(X(p[0]), Y(p[1]), 4, 0, 7); ctx.strokeStyle = PAL.accent700; ctx.lineWidth = 1.5; ctx.stroke(); });
      ctx.fillStyle = PAL.sage700; ctx.font = "11px Figtree, sans-serif"; ctx.textAlign = "left"; ctx.fillText("● train", pad + 4, pad + 14);
      ctx.fillStyle = PAL.accent700; ctx.fillText("○ test", pad + 54, pad + 14);
    }
    draw();
  };

  // 12 ── Box plot / percentiles ──────────────────────────
  VIZ["boxplot"] = function (root) {
    var outlier = 200;
    var base = [12, 13, 14, 14, 15, 15, 16, 16, 17, 18, 19, 21];
    var cv = mkCanvas(root, Math.min(root.clientWidth || 640, 700), 170);
    var readout = el("div", "viz-readout");
    var sQ1 = statBox("Q1"), sMed = statBox("Median"), sQ3 = statBox("Q3"), sIQR = statBox("IQR");
    readout.appendChild(sQ1); readout.appendChild(sMed); readout.appendChild(sQ3); readout.appendChild(sIQR);
    var controls = el("div", "viz-controls");
    controls.appendChild(slider({
      label: "Add an extreme value", min: 22, max: 300, step: 2, value: outlier,
      onInput: function (v) { outlier = v; draw(); }
    }));
    root.appendChild(readout); root.appendChild(controls);
    root.appendChild(el("div", "viz-note", "The box spans Q1–Q3 (the middle 50%); the line is the median. Points beyond 1.5×IQR from the box are flagged as outliers — notice the box barely moves as the extreme value grows."));
    function pct(sorted, p) {
      var idx = (sorted.length - 1) * p, lo = Math.floor(idx), hi = Math.ceil(idx);
      return sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo);
    }
    function draw() {
      var data = base.concat([outlier]).slice().sort(function (a, b) { return a - b; });
      var q1 = pct(data, 0.25), md = pct(data, 0.5), q3 = pct(data, 0.75), iqr = q3 - q1;
      sQ1._v.textContent = q1.toFixed(0); sMed._v.textContent = md.toFixed(0); sQ3._v.textContent = q3.toFixed(0); sIQR._v.textContent = iqr.toFixed(0);
      var lowFence = q1 - 1.5 * iqr, highFence = q3 + 1.5 * iqr;
      var ctx = cv.ctx, W = cv.w, H = cv.h; ctx.clearRect(0, 0, W, H);
      var pad = 40, lo = 8, hi = Math.max(24, outlier + 10), cy = 78, bh = 48;
      function X(v) { return pad + (v - lo) / (hi - lo) * (W - 2 * pad); }
      // whiskers span non-outlier range
      var inRange = data.filter(function (v) { return v >= lowFence && v <= highFence; });
      var wlo = Math.min.apply(null, inRange), whi = Math.max.apply(null, inRange);
      ctx.strokeStyle = PAL.accent700; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(X(wlo), cy); ctx.lineTo(X(q1), cy); ctx.moveTo(X(q3), cy); ctx.lineTo(X(whi), cy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(X(wlo), cy - 10); ctx.lineTo(X(wlo), cy + 10); ctx.moveTo(X(whi), cy - 10); ctx.lineTo(X(whi), cy + 10); ctx.stroke();
      // box
      ctx.fillStyle = "rgba(122,138,94,0.35)"; ctx.strokeStyle = PAL.sage700; ctx.lineWidth = 2;
      ctx.fillRect(X(q1), cy - bh / 2, X(q3) - X(q1), bh); ctx.strokeRect(X(q1), cy - bh / 2, X(q3) - X(q1), bh);
      // median
      ctx.strokeStyle = PAL.accent; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(X(md), cy - bh / 2); ctx.lineTo(X(md), cy + bh / 2); ctx.stroke();
      // points + outliers
      data.forEach(function (v) {
        var isOut = v < lowFence || v > highFence;
        ctx.beginPath(); ctx.arc(X(v), cy + bh / 2 + 22, isOut ? 6 : 4, 0, 7);
        ctx.fillStyle = isOut ? PAL.accent : PAL.sage; ctx.globalAlpha = isOut ? 1 : .6; ctx.fill(); ctx.globalAlpha = 1;
        if (isOut) { ctx.fillStyle = PAL.accent700; ctx.font = "600 11px Figtree, sans-serif"; ctx.textAlign = "center"; ctx.fillText("outlier", X(v), cy + bh / 2 + 42); }
      });
      ctx.fillStyle = PAL.muted; ctx.font = "11px Figtree, sans-serif"; ctx.textAlign = "left"; ctx.fillText("all data points", pad, H - 6);
    }
    draw();
  };

  // 13 ── Standardization (rescale to mean 0, std 1) ──────
  VIZ["standardize"] = function (root) {
    var base = [20, 35, 40, 45, 55], stretch = 1.5;
    var cv = mkCanvas(root, Math.min(root.clientWidth || 640, 700), 220);
    var readout = el("div", "viz-readout");
    var sRaw = statBox("Raw std"), sZ = statBox("Standardized std");
    readout.appendChild(sRaw); readout.appendChild(sZ);
    var controls = el("div", "viz-controls");
    controls.appendChild(slider({ label: "Stretch the raw data", min: 0.5, max: 4, step: 0.1, value: stretch, fmt: function (v) { return "×" + v.toFixed(1); }, onInput: function (v) { stretch = v; draw(); } }));
    root.appendChild(readout); root.appendChild(controls);
    root.appendChild(el("div", "viz-note", "Stretch the raw numbers however you like — the <b>standardized</b> version always lands centred at 0 with spread 1. That's why features on different scales become comparable."));
    function draw() {
      var m0 = mean(base);
      var raw = base.map(function (v) { return m0 + (v - m0) * stretch; });
      var mr = mean(raw), sr = std(raw);
      var z = raw.map(function (v) { return (v - mr) / sr; });
      sRaw._v.textContent = sr.toFixed(1); sZ._v.textContent = std(z).toFixed(2);
      var ctx = cv.ctx, W = cv.w, H = cv.h; ctx.clearRect(0, 0, W, H);
      var pad = 40;
      function axis(y, label) {
        ctx.strokeStyle = PAL.grid; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(W - pad, y); ctx.stroke();
        ctx.fillStyle = PAL.muted; ctx.font = "12px Figtree, sans-serif"; ctx.textAlign = "left"; ctx.fillText(label, pad, y - 22);
      }
      var rlo = Math.min.apply(null, raw), rhi = Math.max.apply(null, raw), rp = (rhi - rlo) * 0.15 + 1;
      function Xr(v) { return pad + (v - (rlo - rp)) / ((rhi + rp) - (rlo - rp)) * (W - 2 * pad); }
      axis(72, "Raw values (scale changes as you stretch)");
      raw.forEach(function (v) { ctx.beginPath(); ctx.arc(Xr(v), 72, 7, 0, 7); ctx.fillStyle = PAL.accent; ctx.globalAlpha = .8; ctx.fill(); ctx.globalAlpha = 1; });
      function Xz(v) { return pad + (Math.max(-3, Math.min(3, v)) + 3) / 6 * (W - 2 * pad); }
      axis(168, "Standardized (always centred 0, spread 1)");
      ctx.strokeStyle = PAL.grid; ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.moveTo(Xz(0), 150); ctx.lineTo(Xz(0), 186); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = PAL.muted; ctx.textAlign = "center"; ctx.fillText("0", Xz(0), 200);
      z.forEach(function (v) { ctx.beginPath(); ctx.arc(Xz(v), 168, 7, 0, 7); ctx.fillStyle = PAL.sage; ctx.globalAlpha = .85; ctx.fill(); ctx.globalAlpha = 1; });
    }
    draw();
  };

  // 14 ── Classification decision boundary ────────────────
  VIZ["decision-boundary"] = function (root) {
    var angle = 20;
    var rand = rng(8), A = [], B = [];
    for (var i = 0; i < 40; i++) { A.push([0.34 + gauss(rand) * 0.10, 0.62 + gauss(rand) * 0.10]); B.push([0.66 + gauss(rand) * 0.10, 0.40 + gauss(rand) * 0.10]); }
    var cv = mkCanvas(root, Math.min(root.clientWidth || 520, 520), 300);
    var readout = el("div", "viz-readout"); var sAcc = statBox("Accuracy"); readout.appendChild(sAcc);
    var controls = el("div", "viz-controls");
    controls.appendChild(slider({ label: "Tilt the boundary line", min: -80, max: 80, step: 2, value: angle, fmt: function (v) { return v + "°"; }, onInput: function (v) { angle = v; draw(); } }));
    root.appendChild(readout); root.appendChild(controls);
    root.appendChild(el("div", "viz-note", "The line is the model's decision boundary: one side is predicted class A, the other class B. Tilt it to separate the two clouds as cleanly as you can — that's what training does automatically."));
    function side(p) { var a = angle * Math.PI / 180, nx = Math.sin(a), ny = -Math.cos(a); return (p[0] - 0.5) * nx + (p[1] - 0.5) * ny > 0; }
    function draw() {
      var correct = 0, total = A.length + B.length;
      A.forEach(function (p) { if (side(p) === true) correct++; });
      B.forEach(function (p) { if (side(p) === false) correct++; });
      sAcc._v.textContent = (correct / total * 100).toFixed(0) + "%";
      var ctx = cv.ctx, W = cv.w, H = cv.h; ctx.clearRect(0, 0, W, H);
      function X(v) { return v * W; } function Y(v) { return v * H; }
      var a = angle * Math.PI / 180, dx = Math.cos(a), dy = Math.sin(a);
      ctx.strokeStyle = PAL.ink; ctx.lineWidth = 2.5; ctx.beginPath(); ctx.moveTo(X(0.5 - dx), Y(0.5 - dy)); ctx.lineTo(X(0.5 + dx), Y(0.5 + dy)); ctx.stroke();
      A.forEach(function (p) { ctx.beginPath(); ctx.arc(X(p[0]), Y(p[1]), 5, 0, 7); ctx.fillStyle = PAL.accent; ctx.globalAlpha = .8; ctx.fill(); ctx.globalAlpha = 1; });
      B.forEach(function (p) { ctx.beginPath(); ctx.arc(X(p[0]), Y(p[1]), 5, 0, 7); ctx.fillStyle = PAL.sage; ctx.globalAlpha = .8; ctx.fill(); ctx.globalAlpha = 1; });
      ctx.fillStyle = PAL.accent700; ctx.font = "600 12px Figtree, sans-serif"; ctx.textAlign = "left"; ctx.fillText("● class A", 12, 18);
      ctx.fillStyle = PAL.sage700; ctx.fillText("● class B", 92, 18);
    }
    draw();
  };

  // 15 ── Word-embedding map (meaning = location) ──────────
  function makeWordMap(root, mode) {
    var words = [
      { w: "dog", x: .18, y: .25, g: 0 }, { w: "cat", x: .27, y: .32, g: 0 }, { w: "lion", x: .15, y: .41, g: 0 },
      { w: "king", x: .76, y: .22, g: 1 }, { w: "queen", x: .84, y: .30, g: 1 }, { w: "prince", x: .72, y: .37, g: 1 },
      { w: "Paris", x: .22, y: .80, g: 2 }, { w: "London", x: .31, y: .72, g: 2 }, { w: "Tokyo", x: .15, y: .69, g: 2 },
      { w: "pizza", x: .80, y: .76, g: 3 }, { w: "sushi", x: .86, y: .67, g: 3 }, { w: "bread", x: .71, y: .80, g: 3 }
    ];
    var colors = [PAL.accent, PAL.sage, "#5b7fa6", "#a65b8f"];
    var sel = mode === "search" ? 3 : 0, k = 3;
    var cv = mkCanvas(root, Math.min(root.clientWidth || 560, 560), 320);
    cv.canvas.style.cursor = "pointer";
    cv.canvas.addEventListener("click", function (e) {
      var r = cv.canvas.getBoundingClientRect();
      var mx = (e.clientX - r.left) / r.width, my = (e.clientY - r.top) / r.height, best = 0, bd = 1e9;
      words.forEach(function (o, i) { var d = (o.x - mx) * (o.x - mx) + (o.y - my) * (o.y - my); if (d < bd) { bd = d; best = i; } });
      sel = best; draw();
    });
    root.appendChild(el("div", "viz-note", mode === "search"
      ? "Click a word to use it as a <b>search</b>: the map lights up its nearest words by <b>meaning</b>, not spelling. That's how vector search finds relevant text even when the words don't match."
      : "Every word is a point, and words with similar meaning sit close together. Click any word to light up its nearest neighbours — the model's sense of 'related'."));
    function draw() {
      var ctx = cv.ctx, W = cv.w, H = cv.h; ctx.clearRect(0, 0, W, H);
      function X(v) { return 30 + v * (W - 60); } function Y(v) { return 20 + v * (H - 56); }
      var s = words[sel];
      var near = words.map(function (o, i) { return { i: i, d: Math.hypot(o.x - s.x, o.y - s.y) }; })
        .filter(function (o) { return o.i !== sel; }).sort(function (a, b) { return a.d - b.d; }).slice(0, k).map(function (o) { return o.i; });
      ctx.strokeStyle = PAL.accent; ctx.lineWidth = 2; ctx.globalAlpha = .5;
      near.forEach(function (i) { ctx.beginPath(); ctx.moveTo(X(s.x), Y(s.y)); ctx.lineTo(X(words[i].x), Y(words[i].y)); ctx.stroke(); });
      ctx.globalAlpha = 1;
      words.forEach(function (o, i) {
        var isSel = i === sel, isNear = near.indexOf(i) > -1, on = isSel || isNear;
        ctx.beginPath(); ctx.arc(X(o.x), Y(o.y), isSel ? 9 : 6, 0, 7); ctx.fillStyle = colors[o.g]; ctx.globalAlpha = on ? 1 : .45; ctx.fill(); ctx.globalAlpha = 1;
        ctx.fillStyle = PAL.ink; ctx.font = (isSel ? "600 13px" : "12px") + " Figtree, sans-serif"; ctx.textAlign = "center"; ctx.globalAlpha = on ? 1 : .5;
        ctx.fillText(o.w, X(o.x), Y(o.y) - 11); ctx.globalAlpha = 1;
      });
      ctx.fillStyle = PAL.accent700; ctx.font = "600 12px Figtree, sans-serif"; ctx.textAlign = "left";
      ctx.fillText((mode === "search" ? "search: " : "selected: ") + s.w + "  →  nearest: " + near.map(function (i) { return words[i].w; }).join(", "), 30, H - 8);
    }
    draw();
  }
  VIZ["embedding-map"] = function (root) { makeWordMap(root, "map"); };
  VIZ["vector-search"] = function (root) { makeWordMap(root, "search"); };

  // 16 ── Activation functions ────────────────────────────
  VIZ["activation"] = function (root) {
    var fn = "ReLU";
    var cv = mkCanvas(root, Math.min(root.clientWidth || 560, 560), 250);
    var controls = el("div", "viz-controls");
    ["Sigmoid", "tanh", "ReLU"].forEach(function (name) { controls.appendChild(button(name, function () { fn = name; hi(); draw(); })); });
    root.appendChild(controls);
    var note = el("div", "viz-note", ""); root.appendChild(note);
    var notes = {
      Sigmoid: "Squashes any input into 0–1 — handy for a probability, but very large or small inputs barely move the output.",
      tanh: "Like sigmoid but centred at 0 (−1 to 1), which often trains a little better.",
      ReLU: "Simplest and most used: let positives through, zero out negatives. Cheap, and it works well in deep networks."
    };
    function apply(x) { if (fn === "Sigmoid") return 1 / (1 + Math.exp(-x)); if (fn === "tanh") return Math.tanh(x); return Math.max(0, x); }
    function hi() { Array.prototype.forEach.call(controls.querySelectorAll("button"), function (b) { var on = b.textContent === fn; b.classList.toggle("btn-primary", on); b.classList.toggle("btn-secondary", !on); }); note.innerHTML = notes[fn]; }
    function draw() {
      var ctx = cv.ctx, W = cv.w, H = cv.h; ctx.clearRect(0, 0, W, H);
      var pad = 30, xlo = -5, xhi = 5, ylo = -1.2, yhi = 1.2; if (fn === "ReLU") { ylo = -0.5; yhi = 5; }
      function X(v) { return pad + (v - xlo) / (xhi - xlo) * (W - 2 * pad); }
      function Y(v) { return (H - pad) - (v - ylo) / (yhi - ylo) * (H - 2 * pad); }
      ctx.strokeStyle = PAL.grid; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(pad, Y(0)); ctx.lineTo(W - pad, Y(0)); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(X(0), pad); ctx.lineTo(X(0), H - pad); ctx.stroke();
      ctx.strokeStyle = PAL.accent; ctx.lineWidth = 2.5; ctx.beginPath();
      for (var x = xlo; x <= xhi; x += 0.05) { var px = X(x), py = Y(Math.max(ylo, Math.min(yhi, apply(x)))); if (x === xlo) ctx.moveTo(px, py); else ctx.lineTo(px, py); }
      ctx.stroke();
    }
    hi(); draw();
  };

  // 17 ── p-value / hypothesis test ───────────────────────
  VIZ["p-value"] = function (root) {
    var z = 1.0;
    var cv = mkCanvas(root, Math.min(root.clientWidth || 620, 700), 240);
    var readout = el("div", "viz-readout"); var sP = statBox("p-value"), sV = statBox("Verdict");
    readout.appendChild(sP); readout.appendChild(sV);
    var controls = el("div", "viz-controls");
    controls.appendChild(slider({ label: "How far the result is from 'no effect'", min: 0, max: 4, step: 0.1, value: z, fmt: function (v) { return v.toFixed(1) + "σ"; }, onInput: function (v) { z = v; draw(); } }));
    root.appendChild(readout); root.appendChild(controls);
    root.appendChild(el("div", "viz-note", "The bell is what you'd expect if <b>nothing</b> is going on. The shaded tails are how likely a result this extreme would be by pure chance — the <b>p-value</b>. Small (&lt;0.05) → too surprising to be luck, so you reject 'no effect'."));
    function erf(x) { var t = 1 / (1 + 0.3275911 * Math.abs(x)); var y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x); return x < 0 ? -y : y; }
    function pval(zv) { var Phi = 0.5 * (1 + erf(zv / Math.SQRT2)); return 2 * (1 - Phi); }
    function draw() {
      var p = pval(z); sP._v.textContent = p.toFixed(3); sV._v.textContent = p < 0.05 ? "Reject null" : "Not enough";
      var ctx = cv.ctx, W = cv.w, H = cv.h; ctx.clearRect(0, 0, W, H);
      var pad = 24, axisY = H - 28, lo = -4, hi = 4, top = 20;
      function X(v) { return pad + (v - lo) / (hi - lo) * (W - 2 * pad); }
      function pdf(x) { return Math.exp(-0.5 * x * x); }
      function Y(pp) { return axisY - pp * (axisY - top); }
      ctx.fillStyle = "rgba(198,113,57,0.25)";
      function shade(from, to) { ctx.beginPath(); ctx.moveTo(X(from), axisY); for (var x = from; x <= to; x += 0.05) ctx.lineTo(X(x), Y(pdf(x))); ctx.lineTo(X(to), axisY); ctx.closePath(); ctx.fill(); }
      shade(z, 4); shade(-4, -z);
      ctx.strokeStyle = PAL.accent; ctx.lineWidth = 2.5; ctx.beginPath();
      for (var xx = lo; xx <= hi; xx += 0.05) { var px = X(xx), py = Y(pdf(xx)); if (xx === lo) ctx.moveTo(px, py); else ctx.lineTo(px, py); }
      ctx.stroke();
      ctx.strokeStyle = PAL.grid; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(pad, axisY); ctx.lineTo(W - pad, axisY); ctx.stroke();
      ctx.strokeStyle = PAL.ink; ctx.lineWidth = 1.5; ctx.setLineDash([4, 3]);
      [z, -z].forEach(function (v) { ctx.beginPath(); ctx.moveTo(X(v), top); ctx.lineTo(X(v), axisY); ctx.stroke(); });
      ctx.setLineDash([]);
      ctx.fillStyle = PAL.ink; ctx.font = "600 11px Figtree, sans-serif"; ctx.textAlign = "center"; ctx.fillText("±" + z.toFixed(1) + "σ", X(z), top - 4);
    }
    draw();
  };

  // 18 ── Probability & the law of large numbers ──────────
  VIZ["probability"] = function (root) {
    var trials = 50, seed = 1;
    var cv = mkCanvas(root, Math.min(root.clientWidth || 560, 560), 220);
    var readout = el("div", "viz-readout"); var sH = statBox("Heads %"), sExp = statBox("Expected");
    readout.appendChild(sH); readout.appendChild(sExp);
    var controls = el("div", "viz-controls");
    controls.appendChild(slider({ label: "Number of coin flips", min: 10, max: 2000, step: 10, value: trials, onInput: function (v) { trials = v; draw(); } }));
    var btns = el("div", "viz-controls"); btns.appendChild(button("Flip again", function () { seed = Math.floor(Math.random() * 9999) + 1; draw(); }));
    root.appendChild(readout); root.appendChild(controls); root.appendChild(btns);
    root.appendChild(el("div", "viz-note", "A fair coin is 50/50, but a few flips can look lopsided. Increase the flips: the measured heads % settles toward 50% — the law of large numbers, and why models need enough data."));
    function draw() {
      var rand = rng(seed), heads = 0; for (var i = 0; i < trials; i++) if (rand() < 0.5) heads++;
      sH._v.textContent = (heads / trials * 100).toFixed(1) + "%"; sExp._v.textContent = "50%";
      var ctx = cv.ctx, W = cv.w, H = cv.h; ctx.clearRect(0, 0, W, H);
      var pad = 40, baseY = H - 30, barW = (W - 2 * pad) / 2 - 20, tails = trials - heads;
      function bar(x, frac, color, label, val) {
        var h = frac * (baseY - 30); ctx.fillStyle = color; ctx.globalAlpha = .85; ctx.fillRect(x, baseY - h, barW, h); ctx.globalAlpha = 1;
        ctx.fillStyle = PAL.ink; ctx.font = "600 13px Figtree, sans-serif"; ctx.textAlign = "center"; ctx.fillText(val, x + barW / 2, baseY - h - 6);
        ctx.fillStyle = PAL.muted; ctx.font = "12px Figtree, sans-serif"; ctx.fillText(label, x + barW / 2, baseY + 16);
      }
      bar(pad, heads / trials, PAL.sage, "Heads", heads);
      bar(pad + barW + 40, tails / trials, PAL.accent, "Tails", tails);
      var y = baseY - 0.5 * (baseY - 30);
      ctx.strokeStyle = PAL.ink; ctx.setLineDash([5, 3]); ctx.globalAlpha = .5; ctx.beginPath(); ctx.moveTo(pad - 10, y); ctx.lineTo(W - pad + 10, y); ctx.stroke(); ctx.setLineDash([]); ctx.globalAlpha = 1;
      ctx.fillStyle = PAL.muted; ctx.textAlign = "left"; ctx.font = "11px Figtree, sans-serif"; ctx.fillText("50%", W - pad + 2, y - 3);
    }
    draw();
  };

  // 19 ── Feature engineering lift ────────────────────────
  VIZ["feature-lift"] = function (root) {
    var engineered = false, rand = rng(6), A = [], B = [], Ae = [], Be = [];
    for (var i = 0; i < 30; i++) { A.push(0.5 + gauss(rand) * 0.13); B.push(0.5 + gauss(rand) * 0.13); Ae.push(0.30 + gauss(rand) * 0.06); Be.push(0.70 + gauss(rand) * 0.06); }
    var cv = mkCanvas(root, Math.min(root.clientWidth || 620, 700), 160);
    var controls = el("div", "viz-controls");
    controls.appendChild(button("Add the engineered feature", function () { engineered = !engineered; draw(); update(); }));
    root.appendChild(controls);
    var note = el("div", "viz-note", ""); root.appendChild(note);
    function update() {
      note.innerHTML = engineered
        ? "With a smarter feature (e.g. spend-per-month), the two classes pull <b>apart</b> — now a simple straight line can separate them."
        : "On the raw feature the two classes <b>overlap</b> — no line separates them well. Click the button to engineer a better feature.";
      controls.querySelector("button").textContent = engineered ? "Show the raw feature" : "Add the engineered feature";
    }
    function draw() {
      var ctx = cv.ctx, W = cv.w, H = cv.h; ctx.clearRect(0, 0, W, H);
      var pad = 40, y = 84; function X(v) { return pad + v * (W - 2 * pad); }
      ctx.strokeStyle = PAL.grid; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(W - pad, y); ctx.stroke();
      var av = engineered ? Ae : A, bv = engineered ? Be : B;
      av.forEach(function (v) { ctx.beginPath(); ctx.arc(X(v), y - 12, 5, 0, 7); ctx.fillStyle = PAL.accent; ctx.globalAlpha = .7; ctx.fill(); ctx.globalAlpha = 1; });
      bv.forEach(function (v) { ctx.beginPath(); ctx.arc(X(v), y + 12, 5, 0, 7); ctx.fillStyle = PAL.sage; ctx.globalAlpha = .7; ctx.fill(); ctx.globalAlpha = 1; });
      ctx.fillStyle = PAL.accent700; ctx.font = "600 12px Figtree, sans-serif"; ctx.textAlign = "left"; ctx.fillText("● class A", pad, 24);
      ctx.fillStyle = PAL.sage700; ctx.fillText("● class B", pad + 82, 24);
    }
    draw(); update();
  };

  window.VIZ = VIZ;
  window.__loadVizPalette = loadPalette;
  loadPalette();
})();
