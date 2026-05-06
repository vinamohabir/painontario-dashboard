/* Pain Ontario — /dashboard/forms scaffold v1 (2026-05-05)
 *
 * Forms-inquiries dashboard. Mirrors painontario-dashboard@v1/dashboard.js
 * conventions: IIFE-wrapped, all CSS scoped under .po-dash, all DOM IDs
 * prefixed po-forms-, lazy-load Chart.js + PapaParse from jsDelivr,
 * localStorage author key shared with /portal (po_dash_author).
 *
 * Data source: a single Google Sheet ("Web Inquiries") aggregating Contact /
 * Mailing list / Site feedback rows with a "Form type" column. Vina to fill in
 * the gviz CSV URL at SHEET_CSV below.
 *
 * Bootstrap from Webflow Embed:
 *   <div id="po-forms-root"></div>
 *   <script src="https://cdn.jsdelivr.net/gh/vinamohabir/painontario-dashboard@main/dashboard-forms.js"></script>
 *
 * ES2015 max. No external deps beyond Chart.js / PapaParse.
 */
(function () {
  "use strict";

  /* ============================================================
   * CONFIG
   * ============================================================ */
  /* Multi-sheet sources: dashboard-forms.js fetches each sheet, tags each
     row with a synthetic "Form type" column based on the source label,
     merges in the browser. No external consolidation script needed.
     Each entry: { url: gvizCsvUrl, formType: stringLabel }. Add or remove
     entries here to change the data sources. */
  var SHEET_SOURCES = [
    {
      label: "Contact",
      url:   "https://docs.google.com/spreadsheets/d/1PXLjxRhTs7YK6agpBoRdgY-kr9f-Zhd4E2aNhPr_hko/gviz/tq?tqx=out:csv&sheet=Sheet1"
    },
    {
      label: "Mailing list",
      url:   "https://docs.google.com/spreadsheets/d/1R75jrxM72jl5qxxRMkhZaN6epg-n156tkPPHeK28Wlw/gviz/tq?tqx=out:csv&sheet=Sheet1"
    }
    /* Site feedback can be added once that pipeline lands.
       Vina, replace any URL above if the sheet ID rotates. */
  ];

  /* Backward-compat: if anyone still wants single-sheet mode, this still works. */
  var SHEET_CSV = null;

  var AUTHOR_KEY = "po_dash_author";
  var ROOT_ID = "po-forms-root";
  var REFRESH_MS = 60 * 1000;

  var FORM_TYPES = [
    { id: "all", label: "All", match: null },
    { id: "contact", label: "Contact", match: /contact/i },
    { id: "mailing", label: "Mailing list", match: /(mailing|newsletter|signup|sign\s*up|subscribe)/i },
    { id: "feedback", label: "Site feedback", match: /(feedback|site)/i }
  ];

  /* ============================================================
   * CSS (scoped under .po-dash; mirrors dashboard.js tokens)
   * ============================================================ */
  var CSS = [
    ".po-dash{all:revert;font-family:'Inter Tight',system-ui,sans-serif;color:#f5efe2;line-height:1.5}",
    ".po-dash *{box-sizing:border-box}",
    ".po-dash h1,.po-dash h2,.po-dash h3{font-family:'Fraunces',Georgia,serif;font-weight:600;margin:0}",
    ".po-dash .po-head{display:flex;flex-wrap:wrap;align-items:baseline;gap:.6rem 1.2rem;padding:1rem 1.2rem;border-bottom:1px solid rgba(245,239,226,.14)}",
    ".po-dash .po-head h1{font-size:1.6rem}",
    ".po-dash .po-eyebrow{font-size:.78rem;letter-spacing:.08em;text-transform:uppercase;opacity:.65}",
    ".po-dash .po-meta{display:flex;flex-wrap:wrap;gap:.4rem 1rem;font-size:.85rem;opacity:.78;margin-left:auto}",
    ".po-dash .po-tabs{display:flex;flex-wrap:wrap;gap:.4rem;padding:.8rem 1.2rem;border-bottom:1px solid rgba(245,239,226,.14)}",
    ".po-dash .po-tab{padding:.45rem .9rem;border-radius:999px;border:1px solid rgba(245,239,226,.18);background:rgba(245,239,226,.04);color:inherit;font:inherit;font-size:.88rem;cursor:pointer}",
    ".po-dash .po-tab[aria-selected='true']{background:rgba(120,188,156,.18);border-color:rgba(120,188,156,.55)}",
    ".po-dash .po-tab:focus-visible{outline:2px solid #78bc9c;outline-offset:2px}",
    ".po-dash .po-toolbar{display:flex;flex-wrap:wrap;gap:.6rem;align-items:center;padding:.8rem 1.2rem;border-bottom:1px solid rgba(245,239,226,.14)}",
    ".po-dash .po-search{flex:1 1 240px;min-width:200px;padding:.55rem .8rem;border-radius:10px;border:1px solid rgba(245,239,226,.22);background:rgba(245,239,226,.05);color:inherit;font:inherit;font-size:.92rem}",
    ".po-dash .po-search:focus{outline:2px solid #78bc9c;outline-offset:1px}",
    ".po-dash .po-count{font-size:.85rem;opacity:.78}",
    ".po-dash .po-chart-wrap{padding:1rem 1.2rem;border-bottom:1px solid rgba(245,239,226,.14)}",
    ".po-dash .po-chart-wrap canvas{max-height:220px}",
    ".po-dash .po-table-wrap{padding:.4rem 0 1rem;overflow-x:auto}",
    ".po-dash table{width:100%;border-collapse:collapse;font-size:.88rem}",
    ".po-dash th,.po-dash td{text-align:left;padding:.55rem .9rem;border-bottom:1px solid rgba(245,239,226,.08);vertical-align:top}",
    ".po-dash th{font-weight:600;font-size:.78rem;text-transform:uppercase;letter-spacing:.06em;opacity:.7}",
    ".po-dash tr:hover td{background:rgba(245,239,226,.03)}",
    ".po-dash .po-msg{white-space:pre-wrap;max-width:520px}",
    ".po-dash .po-empty{padding:2rem 1.2rem;text-align:center;opacity:.7;font-size:.92rem}",
    ".po-dash .po-error{padding:.8rem 1.2rem;background:rgba(243,184,184,.12);border:1px solid rgba(243,184,184,.4);border-radius:10px;margin:1rem 1.2rem;color:#f3b8b8;font-size:.9rem}",
    ".po-dash[hidden]{display:none}",
    "@media print{body *{visibility:hidden}.po-dash,.po-dash *{visibility:visible}.po-dash{position:absolute;inset:0}}"
  ].join("\n");

  /* ============================================================
   * BOOT
   * ============================================================ */
  var root = document.getElementById(ROOT_ID);
  if (!root) {
    /* No root div on this page — bail silently so the script is safe to
       include accidentally on other pages. */
    return;
  }
  if (root.getAttribute("data-po") === "forms-v1") return; /* idempotent */
  root.setAttribute("data-po", "forms-v1");

  injectStyle();
  renderShell();

  var STATE = {
    rows: [],
    activeTab: "all",
    query: "",
    chart: null,
    lastFetch: null,
    error: null
  };

  loadDeps(function () {
    fetchData();
    setInterval(fetchData, REFRESH_MS);
  });

  /* ============================================================
   * RENDER
   * ============================================================ */
  function injectStyle() {
    if (document.getElementById("po-forms-style")) return;
    var s = document.createElement("style");
    s.id = "po-forms-style";
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function renderShell() {
    var author = readAuthor() || "guest";
    root.innerHTML = "" +
      '<section class="po-dash" id="po-forms-dash">' +
        '<header class="po-head">' +
          '<div>' +
            '<div class="po-eyebrow">Pain Ontario · forms inquiries</div>' +
            '<h1>Web inquiries</h1>' +
          '</div>' +
          '<div class="po-meta">' +
            '<span id="po-forms-author">Reading as: ' + escapeHtml(author) + '</span>' +
            '<span id="po-forms-updated"></span>' +
            '<span id="po-forms-count" class="po-count"></span>' +
          '</div>' +
        '</header>' +
        '<nav class="po-tabs" role="tablist" id="po-forms-tabs"></nav>' +
        '<div class="po-toolbar">' +
          '<input class="po-search" id="po-forms-search" type="search" placeholder="Filter by name, email, message…" aria-label="Filter inquiries" />' +
        '</div>' +
        '<div id="po-forms-error-slot"></div>' +
        '<div class="po-chart-wrap"><canvas id="po-forms-chart" aria-label="Submissions per day" role="img"></canvas></div>' +
        '<div class="po-table-wrap"><table id="po-forms-table"><thead></thead><tbody></tbody></table></div>' +
        '<div class="po-empty" id="po-forms-empty" hidden>No submissions match the current filters.</div>' +
      '</section>';

    /* Tabs */
    var tabsEl = document.getElementById("po-forms-tabs");
    FORM_TYPES.forEach(function (t) {
      var btn = document.createElement("button");
      btn.className = "po-tab";
      btn.type = "button";
      btn.setAttribute("role", "tab");
      btn.setAttribute("data-tab", t.id);
      btn.setAttribute("aria-selected", t.id === "all" ? "true" : "false");
      btn.textContent = t.label;
      btn.addEventListener("click", function () { setTab(t.id); });
      tabsEl.appendChild(btn);
    });

    document.getElementById("po-forms-search").addEventListener("input", function (e) {
      STATE.query = (e.target.value || "").toLowerCase().trim();
      render();
    });
  }

  function setTab(id) {
    STATE.activeTab = id;
    var tabs = root.querySelectorAll(".po-tab");
    for (var i = 0; i < tabs.length; i++) {
      tabs[i].setAttribute("aria-selected", tabs[i].getAttribute("data-tab") === id ? "true" : "false");
    }
    render();
  }

  function render() {
    var rows = filterRows(STATE.rows);
    renderTable(rows);
    renderChart(rows);
    renderMeta(rows);
  }

  function renderMeta(rows) {
    var count = document.getElementById("po-forms-count");
    if (count) count.textContent = rows.length + " row" + (rows.length === 1 ? "" : "s");

    var upd = document.getElementById("po-forms-updated");
    if (upd && STATE.lastFetch) {
      upd.textContent = "Updated " + formatDate(STATE.lastFetch, true);
    }
  }

  function renderTable(rows) {
    var thead = root.querySelector("#po-forms-table thead");
    var tbody = root.querySelector("#po-forms-table tbody");
    var empty = document.getElementById("po-forms-empty");
    if (!thead || !tbody) return;

    if (!rows.length) {
      thead.innerHTML = "";
      tbody.innerHTML = "";
      if (empty) empty.hidden = false;
      return;
    }
    if (empty) empty.hidden = true;

    var cols = columnsFor(STATE.activeTab);
    thead.innerHTML = "<tr>" + cols.map(function (c) {
      return "<th>" + escapeHtml(c.label) + "</th>";
    }).join("") + "</tr>";

    var html = "";
    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      html += "<tr>";
      for (var j = 0; j < cols.length; j++) {
        var v = pluck(r, cols[j].keys);
        var cls = cols[j].id === "message" ? ' class="po-msg"' : "";
        html += "<td" + cls + ">" + escapeHtml(v) + "</td>";
      }
      html += "</tr>";
    }
    tbody.innerHTML = html;
  }

  function columnsFor(tab) {
    var base = [
      { id: "submitted", label: "Submitted", keys: ["Timestamp", "Submitted", "Date", "Created"] },
      { id: "type", label: "Form type", keys: ["Form type", "Form Type", "Type", "Form"] },
      { id: "name", label: "Name", keys: ["Name", "Full name", "First name"] },
      { id: "email", label: "Email", keys: ["Email", "E-mail"] }
    ];
    if (tab === "contact" || tab === "all") {
      base.push({ id: "role", label: "Role", keys: ["Role", "Affiliation"] });
      base.push({ id: "message", label: "Message", keys: ["Message", "Comments", "Inquiry", "Body"] });
    } else if (tab === "feedback") {
      base.push({ id: "page", label: "Page", keys: ["Source page", "Page", "URL"] });
      base.push({ id: "message", label: "Feedback", keys: ["Message", "Feedback", "Comments"] });
    } else if (tab === "mailing") {
      base.push({ id: "page", label: "Source page", keys: ["Source page", "Page"] });
    }
    return base;
  }

  function renderChart(rows) {
    if (typeof Chart === "undefined") return;
    var canvas = document.getElementById("po-forms-chart");
    if (!canvas) return;

    var counts = {};
    for (var i = 0; i < rows.length; i++) {
      var d = parseDate(pluck(rows[i], ["Timestamp", "Submitted", "Date", "Created"]));
      if (!d) continue;
      var key = d.toISOString().slice(0, 10);
      counts[key] = (counts[key] || 0) + 1;
    }
    var labels = Object.keys(counts).sort();
    var values = labels.map(function (k) { return counts[k]; });

    if (STATE.chart) {
      STATE.chart.data.labels = labels;
      STATE.chart.data.datasets[0].data = values;
      STATE.chart.update();
      return;
    }

    STATE.chart = new Chart(canvas.getContext("2d"), {
      type: "line",
      data: {
        labels: labels,
        datasets: [{
          label: "Submissions per day",
          data: values,
          borderColor: "#78bc9c",
          backgroundColor: "rgba(120,188,156,.18)",
          tension: .25,
          fill: true,
          pointRadius: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { ticks: { color: "rgba(245,239,226,.78)" }, grid: { color: "rgba(245,239,226,.08)" } },
          y: { beginAtZero: true, ticks: { color: "rgba(245,239,226,.78)", precision: 0 }, grid: { color: "rgba(245,239,226,.08)" } }
        },
        plugins: {
          legend: { labels: { color: "rgba(245,239,226,.85)" } }
        }
      }
    });
  }

  /* ============================================================
   * DATA
   * ============================================================ */
  function fetchData() {
    if (typeof Papa === "undefined") return;

    /* Single-sheet mode (backward-compat) */
    if (SHEET_CSV) {
      Papa.parse(SHEET_CSV, {
        download: true, header: true, skipEmptyLines: true,
        complete: function (res) {
          STATE.rows = (res && res.data) ? res.data : [];
          STATE.lastFetch = new Date();
          STATE.error = null; clearError(); render();
        },
        error: function (err) {
          showError("Could not load sheet: " + (err && err.message ? err.message : err));
        }
      });
      return;
    }

    /* Multi-sheet mode: fetch each source, tag with Form type, merge */
    if (!SHEET_SOURCES || !SHEET_SOURCES.length) {
      showError("No sheet sources configured.");
      return;
    }

    var pending = SHEET_SOURCES.length;
    var combined = [];
    var anyError = null;

    SHEET_SOURCES.forEach(function (src) {
      Papa.parse(src.url, {
        download: true, header: true, skipEmptyLines: true,
        complete: function (res) {
          var rows = (res && res.data) ? res.data : [];
          /* Tag each row with the synthetic Form type column unless one is already present */
          for (var i = 0; i < rows.length; i++) {
            if (!rows[i]["Form type"] && !rows[i]["FormType"] && !rows[i]["form_type"]) {
              rows[i]["Form type"] = src.label;
            }
            rows[i]["__source"] = src.label;
          }
          combined = combined.concat(rows);
          if (--pending === 0) { afterAll(); }
        },
        error: function (err) {
          anyError = err;
          if (--pending === 0) { afterAll(); }
        }
      });
    });

    function afterAll() {
      /* Sort newest first if any row has a Timestamp / timestamp / Submitted column */
      var dateKey = null;
      for (var k = 0; k < combined.length && !dateKey; k++) {
        var row = combined[k];
        for (var key in row) {
          if (/timestamp|submitted|date|created/i.test(key)) { dateKey = key; break; }
        }
      }
      if (dateKey) {
        combined.sort(function (a, b) {
          var av = new Date(a[dateKey] || 0).getTime() || 0;
          var bv = new Date(b[dateKey] || 0).getTime() || 0;
          return bv - av;
        });
      }
      STATE.rows = combined;
      STATE.lastFetch = new Date();
      if (combined.length === 0 && anyError) {
        showError("Could not load any sheet: " + (anyError && anyError.message ? anyError.message : anyError));
      } else {
        STATE.error = null;
        clearError();
      }
      render();
    }
  }

  function filterRows(rows) {
    var out = [];
    var spec = null;
    for (var t = 0; t < FORM_TYPES.length; t++) {
      if (FORM_TYPES[t].id === STATE.activeTab) { spec = FORM_TYPES[t]; break; }
    }
    var q = STATE.query;

    for (var i = 0; i < rows.length; i++) {
      var r = rows[i];
      if (spec && spec.match) {
        var typeVal = pluck(r, ["Form type", "Form Type", "Type", "Form"]);
        if (!typeVal || !spec.match.test(typeVal)) continue;
      }
      if (q) {
        var hay = "";
        for (var k in r) {
          if (Object.prototype.hasOwnProperty.call(r, k)) hay += " " + (r[k] || "");
        }
        if (hay.toLowerCase().indexOf(q) === -1) continue;
      }
      out.push(r);
    }

    out.sort(function (a, b) {
      var da = parseDate(pluck(a, ["Timestamp", "Submitted", "Date", "Created"]));
      var db = parseDate(pluck(b, ["Timestamp", "Submitted", "Date", "Created"]));
      return (db ? db.getTime() : 0) - (da ? da.getTime() : 0);
    });
    return out;
  }

  /* ============================================================
   * UTILS
   * ============================================================ */
  function pluck(row, keys) {
    if (!row) return "";
    for (var i = 0; i < keys.length; i++) {
      if (row[keys[i]] != null && String(row[keys[i]]).length) return String(row[keys[i]]);
    }
    return "";
  }

  function parseDate(s) {
    if (!s) return null;
    var d = new Date(s);
    if (!isNaN(d.getTime())) return d;
    return null;
  }

  function formatDate(d, withTime) {
    if (!d) return "";
    try {
      var opts = { year: "numeric", month: "short", day: "2-digit" };
      if (withTime) { opts.hour = "2-digit"; opts.minute = "2-digit"; }
      return d.toLocaleString("en-CA", opts);
    } catch (e) {
      return d.toISOString();
    }
  }

  function escapeHtml(s) {
    if (s == null) return "";
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function readAuthor() {
    try { return localStorage.getItem(AUTHOR_KEY) || ""; } catch (e) { return ""; }
  }

  function showError(msg) {
    var slot = document.getElementById("po-forms-error-slot");
    if (!slot) return;
    slot.innerHTML = '<div class="po-error" role="alert">' + escapeHtml(msg) + "</div>";
  }
  function clearError() {
    var slot = document.getElementById("po-forms-error-slot");
    if (slot) slot.innerHTML = "";
  }

  /* ============================================================
   * DEPS
   * ============================================================ */
  function loadScript(src, cb) {
    var existing = document.querySelector('script[data-po-src="' + src + '"]');
    if (existing) { existing.addEventListener("load", cb); return; }
    var s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.setAttribute("data-po-src", src);
    s.addEventListener("load", cb);
    s.addEventListener("error", function () { showError("Failed to load " + src); });
    document.head.appendChild(s);
  }

  function loadDeps(cb) {
    var papaUrl = "https://cdn.jsdelivr.net/npm/papaparse@5.4.1/papaparse.min.js";
    var chartUrl = "https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js";

    function next() {
      if (typeof Chart !== "undefined") return cb();
      loadScript(chartUrl, cb);
    }
    if (typeof Papa !== "undefined") return next();
    loadScript(papaUrl, next);
  }
})();
