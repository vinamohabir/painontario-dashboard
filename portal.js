/* Pain Ontario — board portal (2026-05-06)
 * Lives at /dashboard/portal (Webflow page-password gated).
 * Injects: name picker step, then tile picker step.
 * Author identity stored in localStorage.po_dash_author so /dashboard/jobs
 * and /dashboard/forms can attribute comments.
 *
 * Bootstrap embed (paste ONCE in the Webflow Embed):
 *   <div id="po-portal-root"></div>
 *   <script>
 *     (function(){
 *       var META = "https://raw.githubusercontent.com/vinamohabir/painontario-dashboard/main/version.json";
 *       var CDN  = "https://cdn.jsdelivr.net/gh/vinamohabir/painontario-dashboard";
 *       fetch(META,{cache:"no-store"}).then(function(r){return r.ok?r.json():{portalJs:"main"};})
 *         .catch(function(){return{portalJs:"main"};})
 *         .then(function(d){var ref=d.portalJs||d.sha||"main";var s=document.createElement("script");
 *           s.src=CDN+"@"+ref+"/portal.js";s.defer=true;document.head.appendChild(s);});
 *     })();
 *   </script>
 *
 * Features:
 *  - Name dropdown sourced from board members + "Someone else" reveal input
 *  - Two active tiles: ED applicant dashboard + Forms inquiries
 *  - Persists author name in localStorage so dashboards attribute comments
 *  - Properly themed for both light AND dark mode (was dark-only)
 *  - prefers-reduced-motion respected
 *  - Focus rings, aria-labels, keyboard nav
 */
(function () {
  "use strict";

  var ROOT_ID = "po-portal-root";
  var KEY = "po_dash_author";

  var BOARD = [
    "Dr. Rachael Bosma",
    "Dr. Fiona Campbell",
    "Dr. Arun Radhakrishnan",
    "Dr. Jaris Swidrovich",
    "Jennifer Daly-Cyr",
    "Dr. Deepa Kattail",
    "Vina Mohabir"
  ];

  var TILES = [
    {
      eyebrow: "ED hire — open",
      title: "ED applicant dashboard",
      body: "Live applicant tracking with AI rubric scores, per-criterion radars, comment threads, and the May 22 close-date countdown.",
      cta: "Open /dashboard/jobs →",
      href: "/dashboard/jobs"
    },
    {
      eyebrow: "Forms — open",
      title: "Forms inquiries",
      body: "Contact form submissions, mailing list signups, and site feedback in one view. Tabs by form type, search, and a line chart of activity.",
      cta: "Open /dashboard/forms →",
      href: "/dashboard/forms"
    }
  ];

  /* ============================================================
   * CSS — works in BOTH light and dark mode via tokens that flip
   * on html[data-theme="dark"]. Default tokens are LIGHT-mode safe.
   * ============================================================ */
  var CSS = [
    ".po-portal{",
      "all:revert;",
      "font-family:'Inter Tight',system-ui,-apple-system,'Segoe UI',sans-serif;",
      "--pp-fg:#1F2933;",
      "--pp-fg-muted:#5B6E7F;",
      "--pp-bg:#FBFAF3;",
      "--pp-bg-soft:#EFEDE3;",
      "--pp-border:rgba(31,41,51,.12);",
      "--pp-border-strong:rgba(31,107,126,.28);",
      "--pp-accent:#1F6B7E;",
      "--pp-accent-deep:#155a6c;",
      "--pp-focus:#1F6B7E;",
      "color:var(--pp-fg);",
    "}",
    "html[data-theme='dark'] .po-portal{",
      "--pp-fg:#f5efe2;",
      "--pp-fg-muted:rgba(245,239,226,.65);",
      "--pp-bg:transparent;",
      "--pp-bg-soft:rgba(245,239,226,.05);",
      "--pp-border:rgba(245,239,226,.14);",
      "--pp-border-strong:rgba(120,188,156,.55);",
      "--pp-accent:#78bc9c;",
      "--pp-accent-deep:#155a6c;",
      "--pp-focus:#78bc9c;",
    "}",
    ".po-portal h1,.po-portal h2{font-family:'Fraunces',Georgia,serif;font-weight:600;margin:0;color:var(--pp-fg)}",
    ".po-portal h1{font-size:2.4rem;line-height:1.15}",
    ".po-portal h2{font-size:1.25rem}",
    ".po-portal .po-shell{max-width:920px;margin:0 auto;padding:3rem 1.25rem}",
    ".po-portal .po-step{display:none}",
    ".po-portal .po-step[data-active]{display:block}",
    ".po-portal .po-intro{margin:.85rem 0 1.6rem;font-size:1rem;line-height:1.6;color:var(--pp-fg-muted);max-width:56ch}",
    ".po-portal .po-form{display:flex;gap:.6rem;flex-wrap:wrap;max-width:480px}",
    ".po-portal .po-select,.po-portal .po-input{",
      "flex:1 1 240px;padding:.8rem 1rem;border-radius:12px;",
      "border:1px solid var(--pp-border);",
      "background:var(--pp-bg-soft);",
      "color:var(--pp-fg);font:inherit;font-size:1rem;",
    "}",
    ".po-portal .po-select option{background:#FBFAF3;color:#1F2933}",
    "html[data-theme='dark'] .po-portal .po-select option{background:#14222e;color:#f5efe2}",
    ".po-portal .po-select:focus-visible,.po-portal .po-input:focus-visible{outline:2px solid var(--pp-focus);outline-offset:2px}",
    ".po-portal .po-other-input{flex-basis:100% !important}",
    ".po-portal .po-btn{",
      "padding:.8rem 1.4rem;border-radius:999px;border:none;",
      "background:var(--pp-accent);color:#fff;font-weight:600;cursor:pointer;font:inherit;",
      "min-height:44px;",
    "}",
    "html[data-theme='dark'] .po-portal .po-btn{color:#0e1320}",
    ".po-portal .po-btn:hover{background:var(--pp-accent-deep)}",
    ".po-portal .po-btn:focus-visible{outline:2px solid var(--pp-focus);outline-offset:2px}",
    ".po-portal .po-btn[disabled]{opacity:.55;cursor:not-allowed}",
    ".po-portal .po-greeting{display:flex;align-items:baseline;gap:.55rem;flex-wrap:wrap;margin-bottom:.6rem}",
    ".po-portal .po-greeting .po-eyebrow{font-size:.78rem;color:var(--pp-fg-muted);letter-spacing:.08em;text-transform:uppercase}",
    ".po-portal .po-change{",
      "font-size:.82rem;color:var(--pp-fg-muted);cursor:pointer;",
      "background:none;border:none;padding:0;text-decoration:underline;font:inherit;",
      "min-height:24px;",
    "}",
    ".po-portal .po-change:hover{color:var(--pp-fg)}",
    ".po-portal .po-change:focus-visible{outline:2px solid var(--pp-focus);outline-offset:4px;border-radius:2px}",
    ".po-portal .po-grid{display:grid;gap:1.1rem;grid-template-columns:1fr;margin-top:1.4rem}",
    "@media(min-width:720px){.po-portal .po-grid{grid-template-columns:1fr 1fr}}",
    ".po-portal .po-tile{",
      "display:flex;flex-direction:column;gap:.5rem;padding:1.4rem 1.5rem;border-radius:18px;",
      "background:var(--pp-bg-soft);border:1px solid var(--pp-border);color:var(--pp-fg);text-decoration:none;",
      "transition:transform .12s ease,border-color .12s ease,background .12s ease;",
    "}",
    ".po-portal .po-tile:hover{transform:translateY(-2px);border-color:var(--pp-border-strong)}",
    "html[data-theme='dark'] .po-portal .po-tile:hover{background:rgba(120,188,156,.08)}",
    ".po-portal .po-tile:focus-visible{outline:2px solid var(--pp-focus);outline-offset:3px}",
    ".po-portal .po-tile-eyebrow{font-size:.72rem;text-transform:uppercase;letter-spacing:.08em;color:var(--pp-fg-muted)}",
    ".po-portal .po-tile-title{font-family:'Fraunces',serif;font-size:1.4rem;font-weight:600;color:var(--pp-fg)}",
    ".po-portal .po-tile-body{font-size:.9rem;line-height:1.5;color:var(--pp-fg-muted)}",
    ".po-portal .po-tile-cta{font-size:.82rem;color:var(--pp-fg-muted);margin-top:.4rem}",
    ".po-portal .po-note{margin-top:2rem;font-size:.82rem;color:var(--pp-fg-muted);line-height:1.55;max-width:56ch}",
    ".po-portal .po-note strong{color:var(--pp-fg)}",
    ".po-portal [hidden]{display:none !important}",
    "@media(prefers-reduced-motion:reduce){",
      ".po-portal .po-tile{transition:none}",
      ".po-portal .po-tile:hover{transform:none}",
    "}"
  ].join("");

  /* ============================================================
   * HTML scaffold
   * ============================================================ */
  function buildHTML(){
    var nameOpts = '<option value="">Select your name…</option>'
      + BOARD.map(function(n){ return '<option value="'+n+'">'+n+'</option>'; }).join("")
      + '<option value="__other__">Someone else (committee, guest)</option>';
    var tileHtml = TILES.map(function(t){
      return '<a class="po-tile" href="'+t.href+'" aria-label="'+t.title+': '+t.body+'">'
        + '<span class="po-tile-eyebrow">'+t.eyebrow+'</span>'
        + '<span class="po-tile-title">'+t.title+'</span>'
        + '<span class="po-tile-body">'+t.body+'</span>'
        + '<span class="po-tile-cta">'+t.cta+'</span>'
        + '</a>';
    }).join("");
    return '<div class="po-portal"><div class="po-shell">'
      + '<section class="po-step" data-step="login" data-active>'
        + '<h1>Welcome to the board portal</h1>'
        + '<p class="po-intro">Pick your name so any notes you leave on applicants are attributed to you. Pick the same name each time and your notes thread together.</p>'
        + '<form class="po-form" id="po-login-form">'
          + '<select class="po-select" id="po-name-select" aria-label="Select your name" required>' + nameOpts + '</select>'
          + '<input class="po-input po-other-input" id="po-other-input" type="text" placeholder="Type your name" aria-label="Type your name" hidden style="display:none" />'
          + '<button class="po-btn" type="submit">Continue</button>'
        + '</form>'
      + '</section>'
      + '<section class="po-step" data-step="picker">'
        + '<div class="po-greeting">'
          + '<span class="po-eyebrow">Reading as</span>'
          + '<h2 id="po-name-display"></h2>'
          + '<button type="button" class="po-change" id="po-change">change</button>'
        + '</div>'
        + '<h1 id="po-welcome-headline">What do you want to see?</h1>'
        + '<p class="po-intro">Each dashboard has its own password to keep applicant and inquirer information protected. Your name carries through so any notes you leave are attributed to you.</p>'
        + '<div class="po-grid">' + tileHtml + '</div>'
        + '<p class="po-note"><strong>Reminder.</strong> Both dashboards include real applicant and inquirer information. Treat the URLs and passwords as confidential. If a board member rotates off, ask Vina to update the passwords.</p>'
      + '</section>'
    + '</div></div>';
  }

  /* ============================================================
   * Init
   * ============================================================ */
  function init(){
    var root = document.getElementById(ROOT_ID);
    if (!root) return;
    if (root.dataset.poBuilt === "1") return;
    root.dataset.poBuilt = "1";

    if (!document.querySelector('style[data-po="portal-css"]')) {
      var s = document.createElement("style");
      s.setAttribute("data-po", "portal-css");
      s.textContent = CSS;
      document.head.appendChild(s);
    }

    root.innerHTML = buildHTML();
    wire();
  }

  function $(s, c){ return (c || document).querySelector(s); }

  function wire(){
    function show(step){
      var steps = document.querySelectorAll(".po-step");
      Array.prototype.forEach.call(steps, function(s){
        if (s.dataset.step === step) s.dataset.active = ""; else delete s.dataset.active;
      });
    }
    function showOther(visible){
      var inp = $("#po-other-input");
      if (!inp) return;
      if (visible) {
        inp.removeAttribute("hidden");
        inp.style.display = "block";
        setTimeout(function(){ inp.focus(); }, 30);
      } else {
        inp.setAttribute("hidden", "");
        inp.style.display = "none";
        inp.value = "";
      }
    }
    function setName(name){
      name = (name || "").trim();
      if (!name) return;
      try { localStorage.setItem(KEY, name); } catch (e) {}
      $("#po-name-display").textContent = name;
      var parts = name.split(" ");
      var first = parts[0];
      if (/^Dr\.?$/i.test(first) && parts[1]) first = parts[1].replace(/[.,]$/, "");
      $("#po-welcome-headline").textContent = "Welcome, " + first + ". What do you want to see?";
      show("picker");
    }
    function clearName(){
      try { localStorage.removeItem(KEY); } catch (e) {}
      var sel = $("#po-name-select"); if (sel) sel.value = "";
      showOther(false);
      show("login");
    }

    $("#po-name-select").addEventListener("change", function(){
      showOther(this.value === "__other__");
    });
    $("#po-login-form").addEventListener("submit", function(e){
      e.preventDefault();
      var sel = $("#po-name-select").value;
      var name = sel === "__other__" ? $("#po-other-input").value : sel;
      setName(name);
    });
    $("#po-change").addEventListener("click", clearName);

    showOther(false);
    var saved = "";
    try { saved = localStorage.getItem(KEY) || ""; } catch (e) {}
    if (saved) setName(saved);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
