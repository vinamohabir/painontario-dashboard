/* Pain Ontario — board portal v2 (2026-05-06)
 * Lives at /dashboard/portal (Webflow page-password gated).
 *
 * Bootstrap embed (paste ONCE in the Webflow Embed):
 *   <div id="po-portal-root"></div>
 *   <script>
 *     (function(){
 *       var META="https://raw.githubusercontent.com/vinamohabir/painontario-dashboard/main/version.json";
 *       var CDN="https://cdn.jsdelivr.net/gh/vinamohabir/painontario-dashboard";
 *       fetch(META,{cache:"no-store"}).then(function(r){return r.ok?r.json():{portalJs:"main"};})
 *         .catch(function(){return{portalJs:"main"};})
 *         .then(function(d){var ref=d.portalJs||d.sha||"main";var s=document.createElement("script");
 *           s.src=CDN+"@"+ref+"/portal.js";s.defer=true;document.head.appendChild(s);});
 *     })();
 *   </script>
 *
 * v2 features:
 *  - Sticky header bar: Pain Ontario · Board portal | Reading as <name> · change
 *  - Top nav: Home / Quick links / Help
 *  - Home: greeting + countdown card (May 22 close) + 2 dashboard tiles
 *  - Quick links: Sheet, Drive folder, Make history, job posting, brand
 *  - Help: AI scoring rubric, how to comment, issue reporting
 *  - Full light + dark mode via custom-property tokens
 *  - prefers-reduced-motion respected
 *  - Keyboard nav, focus rings, aria-labels
 *  - localStorage author key shared with /dashboard/jobs and /dashboard/forms
 */
(function () {
  "use strict";

  var ROOT_ID = "po-portal-root";
  var KEY = "po_dash_author";
  var ED_CLOSE = new Date("2026-05-22T23:59:59-04:00");

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
      cta: "Open dashboard →",
      href: "/dashboard/jobs"
    },
    {
      eyebrow: "Inquiries — open",
      title: "Forms inquiries",
      body: "Contact form submissions, mailing list signups, and site feedback in one view. Tabs by form type, search, and a line chart of activity.",
      cta: "Open dashboard →",
      href: "/dashboard/forms"
    }
  ];

  var QUICK_LINKS = [
    { label: "ED Applications Sheet", url: "https://docs.google.com/spreadsheets/d/1JXly9t0KC-hZiOAerGw9S2F8HKHiBD_6QybaTsZu7zk/edit", desc: "Raw applicant data + AI scores + comments" },
    { label: "Make scenario history", url: "https://eu1.make.com/scenarios/5573933/edit", desc: "See submissions as they come in, debug errors" },
    { label: "Live ED job posting", url: "/about/jobs", desc: "Public-facing posting on painontario.ca" },
    { label: "Board members (Webflow CMS)", url: "https://webflow.com/dashboard/sites/pain-ontario-b42b68f8a5c786e1eed4cf7231/cms", desc: "Edit board roster (changes propagate to portal name picker on next deploy)" },
    { label: "Pain Ontario homepage", url: "/", desc: "Public site front" }
  ];

  var FAQ = [
    {
      q: "How does AI scoring work?",
      a: "Each new application is scored 1-5 on five criteria (Strategy, Start-up, Fundraising, Health, Equity) by Anthropic Claude using Arun's rubric. The overall score is sum × 4 (so 0-100). The 'flag' is a one-phrase summary like \"Strong fundraising + equity\" or \"Earlier-career.\" Scores are advisory — board members make final calls."
    },
    {
      q: "How do I leave a comment on an applicant?",
      a: "Open the ED applicant dashboard, click an applicant row to expand. The comment box is at the bottom of the expanded panel. Your comment is attributed to the name you picked when you logged into the portal."
    },
    {
      q: "I see something off in the data — what do I do?",
      a: "Email Vina at vina.mohabir@gmail.com. Common issues: scores look wrong (the rubric prompt may need tuning), an applicant didn't appear (Make scenario likely errored — check History tab in Make)."
    },
    {
      q: "Can I export the applicant list?",
      a: "On the ED applicant dashboard, click the CSV export button in the toolbar to download visible rows. Shortlist toggles + filters apply to the export."
    }
  ];

  /* ============================================================
   * CSS — works in light + dark via custom-property tokens.
   * ============================================================ */
  var CSS = [
    ".po-portal{",
      "all:revert;",
      "font-family:'Inter Tight',system-ui,-apple-system,'Segoe UI',sans-serif;",
      "--pp-fg:#1F2933;",
      "--pp-fg-muted:#5B6E7F;",
      "--pp-bg:#FBFAF3;",
      "--pp-bg-soft:#EFEDE3;",
      "--pp-bg-card:#fff;",
      "--pp-border:rgba(31,41,51,.12);",
      "--pp-border-strong:rgba(31,107,126,.32);",
      "--pp-accent:#1F6B7E;",
      "--pp-accent-deep:#155a6c;",
      "--pp-accent-soft:rgba(31,107,126,.10);",
      "--pp-warn:#bf8a60;",
      "--pp-focus:#1F6B7E;",
      "color:var(--pp-fg);",
    "}",
    "html[data-theme='dark'] .po-portal{",
      "--pp-fg:#f5efe2;",
      "--pp-fg-muted:rgba(245,239,226,.65);",
      "--pp-bg:transparent;",
      "--pp-bg-soft:rgba(245,239,226,.04);",
      "--pp-bg-card:rgba(245,239,226,.06);",
      "--pp-border:rgba(245,239,226,.14);",
      "--pp-border-strong:rgba(120,188,156,.55);",
      "--pp-accent:#78bc9c;",
      "--pp-accent-deep:#5fa284;",
      "--pp-accent-soft:rgba(120,188,156,.12);",
      "--pp-warn:#e0a978;",
      "--pp-focus:#78bc9c;",
    "}",
    /* Header */
    ".po-portal .po-pp-head{",
      "position:sticky;top:0;z-index:10;",
      "display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;",
      "gap:.6rem 1.2rem;padding:.85rem 1.5rem;",
      "background:var(--pp-bg-card);border-bottom:1px solid var(--pp-border);",
      "backdrop-filter:saturate(140%) blur(6px);",
      "-webkit-backdrop-filter:saturate(140%) blur(6px);",
    "}",
    ".po-portal .po-pp-brand{display:inline-flex;align-items:center;gap:.55rem;font-weight:600;font-size:.92rem;letter-spacing:.02em}",
    ".po-portal .po-pp-brand .po-pp-logo{display:inline-flex;width:1.6rem;height:1.6rem;border-radius:50%;background:var(--pp-accent-soft);color:var(--pp-accent);align-items:center;justify-content:center;font-family:'Fraunces',serif;font-style:italic;font-weight:600}",
    ".po-portal .po-pp-brand-sub{color:var(--pp-fg-muted);font-weight:400;letter-spacing:.06em;text-transform:uppercase;font-size:.74rem;margin-left:.4rem}",
    ".po-portal .po-pp-greeting{display:inline-flex;align-items:center;gap:.55rem;flex-wrap:wrap;font-size:.86rem;color:var(--pp-fg-muted)}",
    ".po-portal .po-pp-greeting strong{color:var(--pp-fg);font-weight:600}",
    ".po-portal .po-pp-change{",
      "background:none;border:none;padding:0;color:var(--pp-fg-muted);font:inherit;font-size:.82rem;",
      "text-decoration:underline;cursor:pointer;min-height:24px;",
    "}",
    ".po-portal .po-pp-change:hover{color:var(--pp-fg)}",
    ".po-portal .po-pp-change:focus-visible{outline:2px solid var(--pp-focus);outline-offset:3px;border-radius:2px}",
    /* Top nav */
    ".po-portal .po-pp-nav{",
      "display:flex;gap:.4rem;flex-wrap:wrap;",
      "padding:.7rem 1.5rem .9rem;border-bottom:1px solid var(--pp-border);",
    "}",
    ".po-portal .po-pp-tab{",
      "padding:.55rem 1rem;border-radius:999px;border:1px solid transparent;",
      "background:transparent;color:var(--pp-fg-muted);",
      "font:inherit;font-size:.88rem;font-weight:500;cursor:pointer;",
      "transition:background .15s ease,color .15s ease,border-color .15s ease;",
    "}",
    ".po-portal .po-pp-tab:hover{color:var(--pp-fg);background:var(--pp-bg-soft)}",
    ".po-portal .po-pp-tab[aria-selected='true']{",
      "background:var(--pp-accent-soft);color:var(--pp-accent);border-color:var(--pp-border-strong);",
    "}",
    ".po-portal .po-pp-tab:focus-visible{outline:2px solid var(--pp-focus);outline-offset:2px}",
    /* Main content */
    ".po-portal .po-pp-main{padding:2rem 1.5rem 4rem;max-width:960px;margin:0 auto}",
    ".po-portal .po-pp-view{display:none}",
    ".po-portal .po-pp-view[data-active]{display:block}",
    /* Headings */
    ".po-portal h1,.po-portal h2,.po-portal h3{font-family:'Fraunces',Georgia,serif;font-weight:600;margin:0;color:var(--pp-fg);text-wrap:balance}",
    ".po-portal h1{font-size:2.4rem;line-height:1.15;margin-bottom:.2rem}",
    ".po-portal h2{font-size:1.4rem;margin-bottom:.6rem}",
    ".po-portal h3{font-size:1.1rem;margin-bottom:.4rem}",
    ".po-portal .po-pp-intro{margin:.4rem 0 1.6rem;font-size:1rem;line-height:1.6;color:var(--pp-fg-muted);max-width:62ch}",
    /* Countdown card */
    ".po-portal .po-pp-cd{",
      "display:flex;align-items:center;gap:1rem;flex-wrap:wrap;",
      "background:var(--pp-bg-soft);border:1px solid var(--pp-border);border-left:4px solid var(--pp-warn);",
      "padding:1rem 1.2rem;border-radius:14px;margin:0 0 1.6rem;",
    "}",
    ".po-portal .po-pp-cd-num{font-family:'Fraunces',serif;font-weight:600;font-size:2.4rem;line-height:1;color:var(--pp-warn);min-width:3ch}",
    ".po-portal .po-pp-cd-text{flex:1;min-width:200px}",
    ".po-portal .po-pp-cd-text strong{color:var(--pp-fg);font-weight:600;display:block;margin-bottom:.2rem}",
    ".po-portal .po-pp-cd-text span{color:var(--pp-fg-muted);font-size:.9rem}",
    /* Tile grid */
    ".po-portal .po-pp-grid{display:grid;gap:1.1rem;grid-template-columns:1fr;margin-bottom:2rem}",
    "@media(min-width:720px){.po-portal .po-pp-grid{grid-template-columns:1fr 1fr}}",
    ".po-portal .po-pp-tile{",
      "display:flex;flex-direction:column;gap:.5rem;padding:1.4rem 1.5rem;border-radius:18px;",
      "background:var(--pp-bg-card);border:1px solid var(--pp-border);color:var(--pp-fg);text-decoration:none;",
      "transition:transform .12s ease,border-color .12s ease,background .12s ease;",
    "}",
    ".po-portal .po-pp-tile:hover{transform:translateY(-2px);border-color:var(--pp-border-strong)}",
    ".po-portal .po-pp-tile:focus-visible{outline:2px solid var(--pp-focus);outline-offset:3px}",
    ".po-portal .po-pp-tile-eyebrow{font-size:.72rem;text-transform:uppercase;letter-spacing:.08em;color:var(--pp-accent);font-weight:600}",
    ".po-portal .po-pp-tile-title{font-family:'Fraunces',serif;font-size:1.3rem;font-weight:600;color:var(--pp-fg);line-height:1.2}",
    ".po-portal .po-pp-tile-body{font-size:.9rem;line-height:1.5;color:var(--pp-fg-muted)}",
    ".po-portal .po-pp-tile-cta{font-size:.85rem;color:var(--pp-accent);margin-top:.4rem;font-weight:500}",
    /* Quick links list */
    ".po-portal .po-pp-links{display:grid;gap:.6rem;margin-top:.6rem}",
    ".po-portal .po-pp-link{",
      "display:flex;align-items:flex-start;gap:.85rem;padding:.95rem 1.1rem;border-radius:12px;",
      "background:var(--pp-bg-soft);border:1px solid var(--pp-border);text-decoration:none;color:var(--pp-fg);",
      "transition:background .12s ease,border-color .12s ease;",
    "}",
    ".po-portal .po-pp-link:hover{background:var(--pp-accent-soft);border-color:var(--pp-border-strong)}",
    ".po-portal .po-pp-link:focus-visible{outline:2px solid var(--pp-focus);outline-offset:3px}",
    ".po-portal .po-pp-link-arrow{color:var(--pp-accent);font-size:1rem;line-height:1.5;transition:transform .12s ease}",
    ".po-portal .po-pp-link:hover .po-pp-link-arrow{transform:translateX(3px)}",
    ".po-portal .po-pp-link-text{flex:1;min-width:0}",
    ".po-portal .po-pp-link-text strong{display:block;color:var(--pp-fg);font-weight:600;margin-bottom:.1rem;font-size:.95rem}",
    ".po-portal .po-pp-link-text span{color:var(--pp-fg-muted);font-size:.85rem;line-height:1.4}",
    /* Help */
    ".po-portal .po-pp-faq{display:flex;flex-direction:column;gap:.6rem;margin-top:.6rem}",
    ".po-portal .po-pp-faq-item{",
      "background:var(--pp-bg-soft);border:1px solid var(--pp-border);",
      "border-radius:12px;padding:.95rem 1.1rem;",
    "}",
    ".po-portal .po-pp-faq-item summary{cursor:pointer;font-weight:600;font-size:.95rem;color:var(--pp-fg);outline:none;list-style:none;display:flex;justify-content:space-between;align-items:center;gap:.5rem;min-height:24px}",
    ".po-portal .po-pp-faq-item summary::-webkit-details-marker{display:none}",
    ".po-portal .po-pp-faq-item summary:focus-visible{outline:2px solid var(--pp-focus);outline-offset:3px;border-radius:6px}",
    ".po-portal .po-pp-faq-item summary::after{content:'+';color:var(--pp-fg-muted);font-size:1.1rem;line-height:1;font-weight:400;transition:transform .15s ease}",
    ".po-portal .po-pp-faq-item[open] summary::after{transform:rotate(45deg)}",
    ".po-portal .po-pp-faq-item p{margin:.6rem 0 0;font-size:.92rem;line-height:1.55;color:var(--pp-fg-muted);max-width:62ch}",
    /* Footer note */
    ".po-portal .po-pp-note{margin-top:2.4rem;padding:.95rem 1.1rem;border-radius:12px;background:var(--pp-bg-soft);border:1px solid var(--pp-border);font-size:.83rem;line-height:1.55;color:var(--pp-fg-muted);max-width:62ch}",
    ".po-portal .po-pp-note strong{color:var(--pp-fg)}",
    /* Login (name picker) */
    ".po-portal .po-pp-login{max-width:920px;margin:0 auto;padding:3rem 1.5rem}",
    ".po-portal .po-pp-form{display:flex;gap:.6rem;flex-wrap:wrap;max-width:480px}",
    ".po-portal .po-pp-select,.po-portal .po-pp-input{",
      "flex:1 1 240px;padding:.8rem 1rem;border-radius:12px;",
      "border:1px solid var(--pp-border);background:var(--pp-bg-card);",
      "color:var(--pp-fg);font:inherit;font-size:1rem;",
    "}",
    ".po-portal .po-pp-select option{background:#FBFAF3;color:#1F2933}",
    "html[data-theme='dark'] .po-portal .po-pp-select option{background:#14222e;color:#f5efe2}",
    ".po-portal .po-pp-select:focus-visible,.po-portal .po-pp-input:focus-visible{outline:2px solid var(--pp-focus);outline-offset:2px}",
    ".po-portal .po-pp-other-input{flex-basis:100% !important}",
    ".po-portal .po-pp-btn{",
      "padding:.8rem 1.4rem;border-radius:999px;border:none;",
      "background:var(--pp-accent);color:#fff;font-weight:600;cursor:pointer;font:inherit;min-height:44px;",
    "}",
    "html[data-theme='dark'] .po-portal .po-pp-btn{color:#0e1320}",
    ".po-portal .po-pp-btn:hover{background:var(--pp-accent-deep)}",
    ".po-portal .po-pp-btn:focus-visible{outline:2px solid var(--pp-focus);outline-offset:2px}",
    ".po-portal [hidden]{display:none !important}",
    /* Reduced motion */
    "@media(prefers-reduced-motion:reduce){",
      ".po-portal *,.po-portal *::before,.po-portal *::after{transition:none !important;animation:none !important}",
      ".po-portal .po-pp-tile:hover,.po-portal .po-pp-link:hover .po-pp-link-arrow{transform:none !important}",
    "}"
  ].join("");

  /* ============================================================
   * HTML scaffold builders
   * ============================================================ */
  function escHtml(s){
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function buildLogin(){
    var nameOpts = '<option value="">Select your name…</option>'
      + BOARD.map(function(n){ return '<option value="'+escHtml(n)+'">'+escHtml(n)+'</option>'; }).join("")
      + '<option value="__other__">Someone else (committee, guest)</option>';
    return ''
      + '<section class="po-pp-login">'
        + '<h1>Welcome to the board portal</h1>'
        + '<p class="po-pp-intro">Pick your name so any notes you leave on applicants are attributed to you. Pick the same name each time and your notes thread together.</p>'
        + '<form class="po-pp-form" id="po-pp-login-form">'
          + '<select class="po-pp-select" id="po-pp-name-select" aria-label="Select your name" required>' + nameOpts + '</select>'
          + '<input class="po-pp-input po-pp-other-input" id="po-pp-other-input" type="text" placeholder="Type your name" aria-label="Type your name" hidden style="display:none" />'
          + '<button class="po-pp-btn" type="submit">Continue</button>'
        + '</form>'
      + '</section>';
  }

  function daysLeft(){
    var ms = ED_CLOSE.getTime() - Date.now();
    return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
  }

  function buildHome(){
    var d = daysLeft();
    var dLabel = d === 0 ? "Today" : (d === 1 ? "1 day" : d + " days");
    var tileHtml = TILES.map(function(t){
      return '<a class="po-pp-tile" href="'+escHtml(t.href)+'" aria-label="'+escHtml(t.title+': '+t.body)+'">'
        + '<span class="po-pp-tile-eyebrow">'+escHtml(t.eyebrow)+'</span>'
        + '<span class="po-pp-tile-title">'+escHtml(t.title)+'</span>'
        + '<span class="po-pp-tile-body">'+escHtml(t.body)+'</span>'
        + '<span class="po-pp-tile-cta">'+escHtml(t.cta)+'</span>'
      + '</a>';
    }).join("");
    return ''
      + '<h1 id="po-pp-headline">What do you want to see?</h1>'
      + '<p class="po-pp-intro">Each dashboard has its own password. Your name carries through so any notes you leave are attributed to you.</p>'
      + '<div class="po-pp-cd" role="status" aria-live="polite">'
        + '<div class="po-pp-cd-num">'+dLabel+'</div>'
        + '<div class="po-pp-cd-text"><strong>Until ED applications close</strong><span>'
          + (d === 0 ? "Final day — applications close at 11:59 pm EDT today." : "May 22, 2026 at 11:59 pm EDT.")
        + '</span></div>'
      + '</div>'
      + '<div class="po-pp-grid">' + tileHtml + '</div>'
      + '<p class="po-pp-note"><strong>Reminder.</strong> Both dashboards include real applicant and inquirer information. Treat the URLs and passwords as confidential. If a board member rotates off, ask Vina to update the passwords.</p>';
  }

  function buildLinks(){
    var html = QUICK_LINKS.map(function(l){
      var isExternal = /^https?:/i.test(l.url);
      var rel = isExternal ? ' target="_blank" rel="noopener"' : '';
      return '<a class="po-pp-link" href="'+escHtml(l.url)+'"' + rel + ' aria-label="'+escHtml(l.label+': '+l.desc)+'">'
        + '<span class="po-pp-link-text"><strong>'+escHtml(l.label)+'</strong><span>'+escHtml(l.desc)+'</span></span>'
        + '<span class="po-pp-link-arrow" aria-hidden="true">→</span>'
      + '</a>';
    }).join("");
    return ''
      + '<h1>Quick links</h1>'
      + '<p class="po-pp-intro">Common destinations behind the dashboards. External links open in a new tab.</p>'
      + '<div class="po-pp-links">' + html + '</div>';
  }

  function buildHelp(){
    var html = FAQ.map(function(item){
      return '<details class="po-pp-faq-item">'
        + '<summary>'+escHtml(item.q)+'</summary>'
        + '<p>'+escHtml(item.a)+'</p>'
      + '</details>';
    }).join("");
    return ''
      + '<h1>Help</h1>'
      + '<p class="po-pp-intro">How the dashboards and AI scoring work, and what to do if something looks off.</p>'
      + '<div class="po-pp-faq">' + html + '</div>'
      + '<p class="po-pp-note"><strong>Issue not covered here?</strong> Email Vina at vina.mohabir@gmail.com — the dashboard architecture, scoring rubric, and forms pipeline are still iterating; bug reports are welcome.</p>';
  }

  function buildShell(){
    return ''
      + '<header class="po-pp-head">'
        + '<div class="po-pp-brand"><span class="po-pp-logo">P</span> Pain Ontario <span class="po-pp-brand-sub">Board portal</span></div>'
        + '<div class="po-pp-greeting">'
          + 'Reading as <strong id="po-pp-name"></strong>'
          + '<button type="button" class="po-pp-change" id="po-pp-change">change</button>'
        + '</div>'
      + '</header>'
      + '<nav class="po-pp-nav" aria-label="Portal sections" role="tablist">'
        + '<button type="button" class="po-pp-tab" role="tab" data-view="home" aria-selected="true">Home</button>'
        + '<button type="button" class="po-pp-tab" role="tab" data-view="links" aria-selected="false">Quick links</button>'
        + '<button type="button" class="po-pp-tab" role="tab" data-view="help" aria-selected="false">Help</button>'
      + '</nav>'
      + '<main class="po-pp-main">'
        + '<section class="po-pp-view" data-view="home" data-active>'+buildHome()+'</section>'
        + '<section class="po-pp-view" data-view="links">'+buildLinks()+'</section>'
        + '<section class="po-pp-view" data-view="help">'+buildHelp()+'</section>'
      + '</main>';
  }

  /* ============================================================
   * Mount + wire
   * ============================================================ */
  function mount(){
    var root = document.getElementById(ROOT_ID);
    if (!root) return;
    if (root.dataset.poBuilt === "v2") return;
    root.dataset.poBuilt = "v2";

    if (!document.querySelector('style[data-po="portal-css-v2"]')) {
      var s = document.createElement("style");
      s.setAttribute("data-po", "portal-css-v2");
      s.textContent = CSS;
      document.head.appendChild(s);
    }

    var saved = "";
    try { saved = localStorage.getItem(KEY) || ""; } catch (e) {}

    if (!saved) {
      root.innerHTML = '<div class="po-portal">' + buildLogin() + '</div>';
      wireLogin(root);
    } else {
      root.innerHTML = '<div class="po-portal">' + buildShell() + '</div>';
      setName(saved);
      wireShell(root);
    }
  }

  function $(sel, ctx){ return (ctx || document).querySelector(sel); }
  function $$(sel, ctx){ return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }

  function showOther(visible){
    var inp = $("#po-pp-other-input");
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
    var el = $("#po-pp-name");
    if (el) el.textContent = name;
    var head = $("#po-pp-headline");
    if (head) {
      var parts = name.split(" ");
      var first = parts[0];
      if (/^Dr\.?$/i.test(first) && parts[1]) first = parts[1].replace(/[.,]$/, "");
      head.textContent = "Welcome, " + first + ". What do you want to see?";
    }
  }

  function wireLogin(root){
    var sel = $("#po-pp-name-select", root);
    var form = $("#po-pp-login-form", root);
    if (sel) {
      sel.addEventListener("change", function(){
        showOther(this.value === "__other__");
      });
    }
    if (form) {
      form.addEventListener("submit", function(e){
        e.preventDefault();
        var v = $("#po-pp-name-select").value;
        var name = v === "__other__" ? $("#po-pp-other-input").value : v;
        if (!name) return;
        try { localStorage.setItem(KEY, name); } catch(e){}
        mount();  /* re-render with shell */
      });
    }
  }

  function wireShell(root){
    var changeBtn = $("#po-pp-change", root);
    if (changeBtn) {
      changeBtn.addEventListener("click", function(){
        try { localStorage.removeItem(KEY); } catch(e){}
        delete root.dataset.poBuilt;
        mount();  /* back to login */
      });
    }
    var tabs = $$(".po-pp-tab", root);
    var views = $$(".po-pp-view", root);
    function showView(id){
      tabs.forEach(function(t){
        var on = t.dataset.view === id;
        t.setAttribute("aria-selected", on ? "true" : "false");
      });
      views.forEach(function(v){
        if (v.dataset.view === id) v.dataset.active = "";
        else delete v.dataset.active;
      });
    }
    tabs.forEach(function(t){
      t.addEventListener("click", function(){ showView(t.dataset.view); });
    });
    /* Keyboard arrows on tab strip */
    tabs.forEach(function(t, i){
      t.addEventListener("keydown", function(e){
        if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
          e.preventDefault();
          var dir = e.key === "ArrowLeft" ? -1 : 1;
          var next = tabs[(i + dir + tabs.length) % tabs.length];
          if (next) { next.focus(); next.click(); }
        }
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mount);
  } else {
    mount();
  }
})();
