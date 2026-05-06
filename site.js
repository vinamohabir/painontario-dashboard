/*!
 * Pain Ontario — site.js (consolidated runtime)
 * Source of truth: github.com/vinamohabir/painontario-dashboard
 * Served via jsDelivr; tag bump on every deploy.
 * Date: 2026-05-05 (v2 = footer + head consolidation)
 *
 * Contents (in execution order):
 *   01. v20 nav data-collapse stripper (was head, now footer-time)
 *   02. formstatesdarkb — dark-mode form done/fail styles (was head)
 *   03–17. 15 footer scripts in original document order
 *
 * Page-gated scripts self-check location.pathname so this file is safe
 * to load on every page. darklockb (pre-paint theme set) stays inline
 * in Header Code — it MUST run before first paint.
 */

/* v20 — strip Webflow's data-collapse so the menu can't be force-hidden when there's no hamburger button. */
(function(){function f(){document.querySelectorAll('.w-nav').forEach(function(n){if(n.hasAttribute('data-collapse'))n.setAttribute('data-collapse','none');var m=n.querySelector('.w-nav-menu');if(m&&m.style.display==='none')m.style.display=''})}if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',f)}else{f()}setTimeout(f,100);setTimeout(f,500);setTimeout(f,1500);window.addEventListener('resize',f)})();

/* v20 — auto-build .crumb breadcrumbs from URL path. */
(function(){var L={about:'About',advocacy:'Advocacy','news-updates':'News','resource-library':'Resources',legal:'Legal',why:'Why Pain Ontario',programs:'Programs','land-acknowledgement':'Land Acknowledgement',mpp:'Contact your MPP',briefings:'Briefings','recent-news':'Recent News','pain-connect':'Pain Connect',all:'All Resources','by-audience':'By Audience',contact:'Contact',donate:'Donate','privacy-policy':'Privacy Policy','terms-of-service':'Terms of Use','external-news':'External News'};function f(s){return L[s]||s.replace(/-/g,' ').replace(/\b\w/g,function(c){return c.toUpperCase()})}function b(){var p=window.location.pathname.replace(/\/+$/,'');var s=p.split('/').filter(Boolean);if(!s.length)return;var r=['<a href="/">Home</a>'];var a='';s.forEach(function(g,i){a+='/'+g;var l=f(g);r.push(i===s.length-1?'<span aria-current="page">'+l+'</span>':'<a href="'+a+'">'+l+'</a>')});var sep='<span class="crumb-sep" aria-hidden="true">›</span>';var h=r.join(' '+sep+' ');document.querySelectorAll('.crumb').forEach(function(e){e.innerHTML=h})}if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',b)}else{b()}})();

/* v20 — scroll-compress nav. */
(function(){if(window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;var t=80,on=false,ticking=false;function u(){var s=window.scrollY>t;if(s!==on){on=s;document.body.classList.toggle('nav-compressed',on)}ticking=false}function s(){if(!ticking){window.requestAnimationFrame(u);ticking=true}}window.addEventListener('scroll',s,{passive:true});u()})();

/* v22 — flip every form to method=post on load (Webflow new-form GET bug). */
(function(){function f(){document.querySelectorAll('form').forEach(function(x){if((x.method||'').toLowerCase()==='get')x.method='post'})}if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',f)}else{f()}})();

/* v21 — site-wide hiring banner. Auto-retires after 2026-05-23 00:00 ET. Dismiss persists in localStorage. */
(function(){
  if (new Date() > new Date('2026-05-23T00:00:00-04:00')) return;
  if (localStorage.getItem('po-ed-banner-dismissed') === 'v1') return;
  function mount(){
    if (document.querySelector('.po-ed-banner')) return;
    var b = document.createElement('div');
    b.className = 'po-ed-banner';
    b.setAttribute('role','region');
    b.setAttribute('aria-label','Hiring announcement');
    b.innerHTML = '<span>We’re hiring our founding Executive Director · <a href="/about/jobs">apply by May 22 →</a></span><button type="button" aria-label="Dismiss">×</button>';
    b.querySelector('button').addEventListener('click', function(){
      try { localStorage.setItem('po-ed-banner-dismissed','v1'); } catch(e){}
      b.remove();
    });
    document.body.insertBefore(b, document.body.firstChild);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();

/* v21 — /about/jobs application-form polish (file uploads, residency hint, screener-end card, submit). Self-gated. */
(function(){
  if (!/\/about\/jobs\/?$/i.test(location.pathname)) return;
  var c = '[data-po-form="ed-application"]{display:block;max-width:640px;margin-top:1.5rem}'
        + '[data-po-form="ed-application"] .w-file-upload{display:block;background:rgba(31,41,51,.03);border:1.5px dashed rgba(31,41,51,.28);border-radius:8px;padding:.95rem 1.05rem;margin:.2rem 0}'
        + '[data-po-form="ed-application"] .w-file-upload-default{display:flex;align-items:center;gap:.85rem;flex-wrap:wrap}'
        + '[data-po-form="ed-application"] .w-file-upload-label{display:inline-flex;align-items:center;gap:.4rem;border:1px solid #1F6B7E;background:#1F6B7E;color:#fff;padding:.5rem .9rem;border-radius:6px;font-size:.92rem;font-weight:500;cursor:pointer;transition:background .15s}'
        + '[data-po-form="ed-application"] .w-file-upload-label:hover{background:#17576A}'
        + '[data-po-form="ed-application"] .w-file-upload-label .w-icon-file-upload-icon{filter:invert(1)}'
        + '[data-po-form="ed-application"] .w-file-upload-info{font-size:.82rem;opacity:.7;color:inherit;margin-left:auto}'
        + '[data-po-form="ed-application"] [data-po-residency-note]{background:rgba(199,110,138,.08);border:1px solid rgba(199,110,138,.35);border-left:3px solid #C76E8A;border-radius:6px;padding:.7rem .9rem;font-size:.92rem;color:inherit;margin:.4rem 0 .2rem}'
        + '[data-po-form="ed-application"] [data-po-screener-end]{background:rgba(199,110,138,.08);border:1px solid rgba(199,110,138,.4);border-left:4px solid #C76E8A;border-radius:10px;padding:1.2rem 1.4rem;margin-top:1rem;font-size:.98rem;line-height:1.55}'
        + '[data-po-form="ed-application"] [data-po-phase="1"]{background:rgba(107,163,199,.06);border:1px solid rgba(107,163,199,.32);border-left:4px solid #6BA3C7;border-radius:10px;padding:1.1rem 1.2rem 1.3rem;margin:.5rem 0 1.25rem;display:grid;gap:.55rem}';
  var s = document.createElement('style'); s.textContent = c; document.head.appendChild(s);
})();

!function(){var css=['html[data-theme="dark"] .w-form-done{background:#171d2c!important;color:#f5ecd2!important;border:1px solid #3a4258!important;border-radius:14px!important;padding:1.5rem!important}','html[data-theme="dark"] .w-form-done *{color:#f5ecd2!important}','html[data-theme="dark"] .w-form-fail{background:#2a1820!important;color:#f6c1a3!important;border:1px solid #6a3a3a!important;border-radius:14px!important;padding:1rem 1.25rem!important}','html[data-theme="dark"] .w-form-fail *{color:#f6c1a3!important}'].join('');var s=document.createElement('style');s.setAttribute('data-po','formstatesdarkb');s.textContent=css;document.head.appendChild(s);}();

/* --- footer block 01 --- */
(function(){var css='html[data-theme="dark"]{color-scheme:dark;--po-bg:#0e1320;--po-bg2:#171d2c;--po-bg3:#1f2638;--po-fg:#f5ecd2;--po-fg-muted:#cdc4ad;--po-accent:#b6d6c8;--po-link:#c8e3d5;--po-border:#3a4258;--po-warn:#f6c1a3}html[data-theme="dark"] body{background-color:var(--po-bg)!important;color:var(--po-fg)!important}html[data-theme="dark"] section,html[data-theme="dark"] .band,html[data-theme="dark"] .hero,html[data-theme="dark"] section.hero,html[data-theme="dark"] [class*="hero"],html[data-theme="dark"] main{background-color:var(--po-bg)!important;background-image:none!important;color:var(--po-fg)!important}html[data-theme="dark"] section.soft,html[data-theme="dark"] .band.soft,html[data-theme="dark"] [class*="soft"],html[data-theme="dark"] .page-hero,html[data-theme="dark"] .equity-strip,html[data-theme="dark"] .signup,html[data-theme="dark"] .crisis-line,html[data-theme="dark"] .donate,html[data-theme="dark"] .partners,html[data-theme="dark"] .advocacy-band,html[data-theme="dark"] .advocacy-band .inner,html[data-theme="dark"] .signpost,html[data-theme="dark"] .signpost.crisis-card,html[data-theme="dark"] .contact-info,html[data-theme="dark"] .contact-card,html[data-theme="dark"] .info-block,html[data-theme="dark"] .news-item,html[data-theme="dark"] li.news-item,html[data-theme="dark"] .resource-card,html[data-theme="dark"] .resource-card-copy,html[data-theme="dark"] .resource-card-1,html[data-theme="dark"] .resource-item,html[data-theme="dark"] .resources-grid .resource-card,html[data-theme="dark"] #resources-grid .resource-card,html[data-theme="dark"] .audience-card,html[data-theme="dark"] [class*="audience-card"],html[data-theme="dark"] .audience-tile,html[data-theme="dark"] [class*="audience-card__"]{background-color:var(--po-bg2)!important;background-image:none!important;color:var(--po-fg)!important;border-color:var(--po-border)!important}html[data-theme="dark"] .resource-card *,html[data-theme="dark"] .news-item *,html[data-theme="dark"] .resource-item *,html[data-theme="dark"] .audience-card *,html[data-theme="dark"] [class*="audience-card"] *{color:var(--po-fg)!important}html[data-theme="dark"] .signpost.crisis-card{background-color:var(--po-bg3)!important;border:1px solid var(--po-warn)!important}html[data-theme="dark"] .signpost a[href^="tel:"],html[data-theme="dark"] .signpost a[href^="tel:"] strong{color:var(--po-warn)!important;text-decoration:underline}html[data-theme="dark"] footer,html[data-theme="dark"] .footer{background-color:#080c14!important;color:var(--po-fg)!important}html[data-theme="dark"] footer *,html[data-theme="dark"] .footer *{color:inherit!important}html[data-theme="dark"] footer .crisis-line,html[data-theme="dark"] .footer .crisis-line{background-color:var(--po-bg3)!important;color:var(--po-fg)!important;border-color:var(--po-border)!important}html[data-theme="dark"] footer .crisis-line a,html[data-theme="dark"] footer .crisis-line strong{color:var(--po-warn)!important;text-decoration:underline}html[data-theme="dark"] footer a,html[data-theme="dark"] .po-mnav a{color:var(--po-link)!important}html[data-theme="dark"] nav,html[data-theme="dark"] header,html[data-theme="dark"] [class*="nav"]{background-color:var(--po-bg2)!important;color:var(--po-fg)!important;border-color:var(--po-border)!important}html[data-theme="dark"] h1,html[data-theme="dark"] h2,html[data-theme="dark"] h3,html[data-theme="dark"] h4,html[data-theme="dark"] h5,html[data-theme="dark"] h6{color:var(--po-fg)!important}html[data-theme="dark"] p,html[data-theme="dark"] li,html[data-theme="dark"] td,html[data-theme="dark"] dd,html[data-theme="dark"] dt,html[data-theme="dark"] blockquote,html[data-theme="dark"] figcaption,html[data-theme="dark"] label,html[data-theme="dark"] strong,html[data-theme="dark"] em,html[data-theme="dark"] span{color:var(--po-fg)!important}html[data-theme="dark"] small,html[data-theme="dark"] .small,html[data-theme="dark"] .meta,html[data-theme="dark"] .kicker,html[data-theme="dark"] .crumb,html[data-theme="dark"] .po-crumb,html[data-theme="dark"] .funding-note,html[data-theme="dark"] .land,html[data-theme="dark"] .meta-row{color:var(--po-fg-muted)!important}html[data-theme="dark"] a{color:var(--po-link)!important}html[data-theme="dark"] a:hover{color:#fff!important}html[data-theme="dark"] a.btn,html[data-theme="dark"] .btn{background-color:var(--po-accent)!important;color:#0e1320!important;border-color:var(--po-accent)!important}html[data-theme="dark"] a.btn span,html[data-theme="dark"] a.btn strong,html[data-theme="dark"] .btn span,html[data-theme="dark"] .btn strong,html[data-theme="dark"] a.btn *{color:#0e1320!important}html[data-theme="dark"] a.btn-ghost,html[data-theme="dark"] a.btn-cream,html[data-theme="dark"] .btn-ghost,html[data-theme="dark"] .btn-cream{background-color:transparent!important;color:var(--po-fg)!important;border-color:var(--po-border)!important}html[data-theme="dark"] .chip,html[data-theme="dark"] .tag,html[data-theme="dark"] .pillar,html[data-theme="dark"] .tile,html[data-theme="dark"] .value,html[data-theme="dark"] .card,html[data-theme="dark"] .donate-grid .card{background-color:var(--po-bg3)!important;color:var(--po-fg)!important;border-color:var(--po-border)!important}html[data-theme="dark"] .partners-row span{color:var(--po-fg)!important;background-color:transparent!important}html[data-theme="dark"] hr{border-color:var(--po-border)!important}.po-tt{position:fixed;bottom:1.25rem;right:1.25rem;z-index:9999;width:2.75rem;height:2.75rem;border-radius:50%;border:1px solid #0f2540;background-color:rgba(255,255,255,.92);color:#0f2540;cursor:pointer;font:1.1rem/1 system-ui;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 10px rgba(0,0,0,.18);transition:transform .15s}html[data-theme="dark"] .po-tt{background-color:#1f2638!important;color:#f5ecd2!important;border-color:#3a4258!important}.po-tt:hover{transform:scale(1.06)}.po-tt:focus-visible{outline:2px solid #b6d6c8;outline-offset:2px}';var s=document.createElement('style');s.textContent=css;document.head.appendChild(s);var b=document.createElement('button');b.className='po-tt';b.setAttribute('aria-label','Toggle dark mode');function p(){var d=document.documentElement.getAttribute('data-theme')==='dark';b.textContent=d?'☾':'☼';b.setAttribute('aria-pressed',d?'true':'false');b.setAttribute('title',d?'Switch to light mode':'Switch to dark mode');b.setAttribute('aria-label',d?'Dark mode is on. Switch to light.':'Light mode is on. Switch to dark.');}b.onclick=function(){var c=document.documentElement.getAttribute('data-theme');var n=c==='dark'?'light':'dark';document.documentElement.setAttribute('data-theme',n);try{localStorage.setItem('po-theme',n);}catch(e){}p();};p();document.body.appendChild(b);})();

/* --- footer block 02 --- */
(function(){var css='.po-mn-trigger{position:fixed;top:.65rem;right:.75rem;z-index:10001;width:2.75rem;height:2.75rem;border-radius:50%;border:1px solid rgba(0,0,0,.18);background-color:rgba(255,255,255,.96);color:#0f2540;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 12px rgba(0,0,0,.18);padding:0}html[data-theme="dark"] .po-mn-trigger{background-color:#1f2638!important;color:#f5ecd2!important;border-color:#3a4258!important}.po-mn-trigger svg{width:1.25rem;height:1.25rem}.po-mn-overlay{position:fixed;inset:0;z-index:10000;background-color:rgba(0,0,0,.55);opacity:0;pointer-events:none;transition:opacity .25s}.po-mn-overlay.open{opacity:1;pointer-events:auto}.po-mn-drawer{position:fixed;top:0;right:0;bottom:0;width:min(85vw,360px);background-color:#fff7e8;color:#0f2540;z-index:10001;transform:translateX(100%);transition:transform .28s cubic-bezier(.2,.8,.2,1);overflow-y:auto;display:flex;flex-direction:column;padding:4rem 1.5rem 5rem 1.5rem;box-shadow:-12px 0 28px rgba(0,0,0,.2)}html[data-theme="dark"] .po-mn-drawer{background-color:#171d2c!important;color:#f5ecd2!important}.po-mn-drawer.open{transform:translateX(0)}.po-mn-overlay:not(.open),.po-mn-drawer:not(.open){pointer-events:none!important}.po-mn-drawer:not(.open)>.po-mn-close{display:none!important}.po-mn-close{position:absolute;top:.65rem;right:.75rem;width:2.5rem;height:2.5rem;border-radius:50%;border:1px solid currentColor;background-color:transparent;color:inherit;cursor:pointer;font-size:1.4rem;line-height:1;display:flex;align-items:center;justify-content:center;padding:0}.po-mn-section{font:600 .7rem/1 system-ui;letter-spacing:.08em;text-transform:uppercase;opacity:.6;margin:1.25rem 0 .5rem}.po-mn-link{display:block;padding:.65rem .25rem;font:500 1.05rem/1.3 ui-serif,Georgia,serif;color:inherit;text-decoration:none;border-bottom:1px solid rgba(0,0,0,.08)}html[data-theme="dark"] .po-mn-link{border-bottom-color:rgba(255,255,255,.08)}.po-mn-link[aria-current="page"]{color:#17576a;font-weight:700}html[data-theme="dark"] .po-mn-link[aria-current="page"]{color:#b6d6c8}.po-mn-cta{margin-top:1.25rem;display:block;text-align:center;padding:.85rem 1rem;border-radius:999px;background-color:#17576a;color:#fff;text-decoration:none;font-weight:600;font-size:.95rem}html[data-theme="dark"] .po-mn-cta{background-color:#b6d6c8!important;color:#0e1320!important}.po-mn-foot{margin-top:auto;padding-top:1.5rem;font-size:.78rem;opacity:.7}body.po-mn-locked{overflow:hidden}@media (min-width:992px){.po-mn-trigger,.po-mn-overlay,.po-mn-drawer{display:none!important}}';var s=document.createElement('style');s.textContent=css;document.head.appendChild(s);var t=document.createElement('button');t.className='po-mn-trigger';t.setAttribute('aria-label','Open menu');t.setAttribute('aria-expanded','false');t.setAttribute('title','Open menu');t.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>';document.body.appendChild(t);var o=document.createElement('div');o.className='po-mn-overlay';o.setAttribute('aria-hidden','true');document.body.appendChild(o);var d=document.createElement('aside');d.className='po-mn-drawer';d.setAttribute('aria-label','Site menu');d.setAttribute('aria-hidden','true');var p=location.pathname.replace(/\/$/,'')||'/';function lk(h,t){var c=p===h?' aria-current="page"':'';return '<a class="po-mn-link"'+c+' href="'+h+'">'+t+'</a>';}d.innerHTML='<button class="po-mn-close" aria-label="Close menu" type="button">×</button><div class="po-mn-section">About</div>'+lk('/about/why-pain-ontario','Why Pain Ontario')+lk('/about/board','Board')+lk('/about/programs','Programs')+lk('/about/jobs','Jobs')+lk('/about/land-acknowledgement','Land acknowledgement')+'<div class="po-mn-section">News</div>'+lk('/news-updates/pain-ontario-news','Pain Ontario News')+lk('/news-updates/in-the-media','In the media')+'<div class="po-mn-section">Advocacy</div>'+lk('/advocacy/mpp','Contact your MPP')+lk('/advocacy/briefings','Briefings')+'<div class="po-mn-section">Resources</div>'+lk('/resource-library/all','All resources')+lk('/resource-library/by-audience','By audience')+'<div class="po-mn-section">Get involved</div>'+lk('/contact','Contact')+'<a class="po-mn-cta" href="/donate">Donate</a><div class="po-mn-foot">In crisis? <a href="tel:911" style="color:inherit">9-1-1</a> · <a href="tel:988" style="color:inherit">9-8-8</a> · <a href="tel:811" style="color:inherit">8-1-1</a></div>';document.body.appendChild(d);function open(){d.classList.add('open');o.classList.add('open');d.setAttribute('aria-hidden','false');t.setAttribute('aria-expanded','true');document.body.classList.add('po-mn-locked');}function close(){d.classList.remove('open');o.classList.remove('open');d.setAttribute('aria-hidden','true');t.setAttribute('aria-expanded','false');document.body.classList.remove('po-mn-locked');}t.addEventListener('click',open);o.addEventListener('click',close);d.querySelector('.po-mn-close').addEventListener('click',close);document.addEventListener('keydown',function(e){if(e.key==='Escape'&&d.classList.contains('open'))close();});Array.from(d.querySelectorAll('.po-mn-link, .po-mn-cta')).forEach(function(a){a.addEventListener('click',function(){setTimeout(close,150);});});})();

/* --- footer block 03 --- */
(function(){var css='.po-fab-stack{position:fixed;right:1.25rem;bottom:1.25rem;z-index:9999;display:flex;flex-direction:column;gap:.5rem;align-items:flex-end}@media (max-width:767px){.po-fab-stack{bottom:5rem}}.po-fab,.po-fab-stack .po-tt{width:2.75rem;height:2.75rem;border-radius:50%;border:1px solid #0f2540;background:rgba(255,255,255,.92);color:#0f2540;cursor:pointer;font:1.1rem/1 system-ui;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 10px rgba(0,0,0,.18);transition:transform .15s,opacity .2s;position:static!important;right:auto!important;bottom:auto!important}html[data-theme="dark"] .po-fab,html[data-theme="dark"] .po-fab-stack .po-tt{background:#232940;color:#e8dfc8;border-color:#3a4258}.po-fab:hover,.po-fab-stack .po-tt:hover{transform:scale(1.06)}.po-fab:focus-visible,.po-fab-stack .po-tt:focus-visible{outline:2px solid #9cbdb1;outline-offset:2px}.po-fab.po-up{opacity:0;pointer-events:none}.po-fab.po-up.show{opacity:1;pointer-events:auto}.po-back{position:absolute;top:1rem;left:1rem;z-index:50;display:inline-flex;align-items:center;gap:.35rem;padding:.4rem .8rem;border-radius:999px;background:rgba(255,255,255,.85);border:1px solid currentColor;color:inherit;font:.8rem/1 system-ui;text-decoration:none}html[data-theme="dark"] .po-back{background:rgba(35,41,64,.85)}body > .po-tt{display:none!important}';var s=document.createElement('style');s.textContent=css;document.head.appendChild(s);var stack=document.createElement('div');stack.className='po-fab-stack';document.body.appendChild(stack);var up=document.createElement('button');up.className='po-fab po-up';up.setAttribute('aria-label','Scroll to top');up.setAttribute('title','Scroll to top');up.textContent='↑';up.onclick=function(){window.scrollTo({top:0,behavior:'smooth'});};stack.appendChild(up);var tries=0;var iv=setInterval(function(){var t=document.querySelector('.po-tt');if(t&&t.parentElement!==stack){stack.appendChild(t);clearInterval(iv);}else if(++tries>40)clearInterval(iv);},150);var os=function(){if(window.scrollY>400)up.classList.add('show');else up.classList.remove('show');};window.addEventListener('scroll',os,{passive:true});os();var p=location.pathname.replace(/\/$/,'');var sg=p.split('/').filter(Boolean);if(sg.length){var bk=document.createElement('a');bk.className='po-back';var pp='/'+sg.slice(0,-1).join('/');if(pp==='/')pp='/';bk.href=pp;bk.innerHTML='<span aria-hidden="true">←</span> Back';bk.onclick=function(e){if(history.length>1&&document.referrer){try{if(new URL(document.referrer).origin===location.origin){e.preventDefault();history.back();}}catch(_){}}};var h=document.querySelector('.page-hero,section.hero,body>section');if(h){if(getComputedStyle(h).position==='static')h.style.position='relative';h.appendChild(bk);}}})();

/* --- footer block 04 --- */
(function(){var css=''
+'@media (max-width:991px){.navbar,.navbar.w-nav,header.navbar{display:none!important}body{padding-top:0!important}}'
+'.po-ed-banner ~ .navbar,.po-ed-banner ~ * .navbar{top:36px!important}'
+'@media (max-width:480px){.po-ed-banner ~ .navbar,.po-ed-banner ~ * .navbar{top:32px!important}}'
+'html[data-theme="dark"] .navbar,html[data-theme="dark"] .navbar *,html[data-theme="dark"] .navbar a,html[data-theme="dark"] .navbar .nav-link,html[data-theme="dark"] .navbar .w-nav-link,html[data-theme="dark"] .nav-menu *,html[data-theme="dark"] .w-dropdown-list *{color:var(--po-fg,#f5ecd2)!important}'
+'html[data-theme="dark"] .navbar a:hover,html[data-theme="dark"] .navbar a:focus{color:var(--po-link,#c8e3d5)!important}'
+'html[data-theme="dark"] .navbar a.w--current,html[data-theme="dark"] .navbar [aria-current="page"]{color:var(--po-accent,#b6d6c8)!important}'
+'html[data-theme="dark"] .w-dropdown-list,html[data-theme="dark"] .nav-menu,html[data-theme="dark"] .dropdown-list{background-color:var(--po-bg2,#171d2c)!important;border-color:var(--po-border,#3a4258)!important}'
+'html[data-theme="dark"] input.w-input,html[data-theme="dark"] textarea.w-input,html[data-theme="dark"] select.w-input,html[data-theme="dark"] select.w-select,html[data-theme="dark"] form input,html[data-theme="dark"] form textarea,html[data-theme="dark"] form select,html[data-theme="dark"] form .w-embed select,html[data-theme="dark"] form .w-embed input,html[data-theme="dark"] form .w-embed textarea,html[data-theme="dark"] body form select.w-input{background-color:var(--po-bg3,#1f2638)!important;background-image:none!important;color:var(--po-fg,#f5ecd2)!important;border-color:var(--po-border,#3a4258)!important;caret-color:var(--po-fg,#f5ecd2)!important}'
+'html[data-theme="dark"] form input::placeholder,html[data-theme="dark"] form textarea::placeholder{color:var(--po-fg-muted,#cdc4ad)!important;opacity:.85}'
+'html[data-theme="dark"] form label,html[data-theme="dark"] .field-label,html[data-theme="dark"] .w-form-label{color:var(--po-fg,#f5ecd2)!important}'
+'.w-dyn-item .w-inline-block:has(>img),.w-dyn-item a.w-inline-block:has(>img){aspect-ratio:16/9!important;height:auto!important;display:block!important;overflow:hidden}'
+'.w-dyn-item .w-inline-block > img{width:100%!important;height:100%!important;object-fit:cover!important;object-position:50% 35%!important;display:block}';
var s=document.createElement('style');s.textContent=css;document.head.appendChild(s);})();

/* --- footer block 05 --- */
(function(){
  if (!/\/about\/jobs\/?$/i.test(location.pathname)) return;
  function init(){
    if (window.__POscreenerV7) return;
    window.__POscreenerV7 = true;

    var form = document.querySelector('[data-po-form="ed-application"]');
    if (!form) return;
    var fi = form.querySelector('form') || form;

    Array.prototype.forEach.call(document.querySelectorAll('[data-po-screener-end]'), function(el){ el.remove(); });
    Array.prototype.forEach.call(form.querySelectorAll('[data-po-phase]'), function(w){
      while (w.firstChild) {
        if (w.parentElement === fi || w.parentElement === form) {
          w.parentElement.insertBefore(w.firstChild, w);
        } else { w.remove(); break; }
      }
      w.remove();
    });

    var ont = fi.querySelector('select[data-name="Ontario-resident"]');
    var submit = fi.querySelector('[data-po-submit]');
    if (!ont || !submit) return;

    var oc = ont.cloneNode(true);
    ont.parentNode.replaceChild(oc, ont);
    ont = oc;

    var lab = null, prev = ont.previousElementSibling;
    while (prev) { if (prev.tagName === 'LABEL') { lab = prev; break; } prev = prev.previousElementSibling; }

    var p1 = document.createElement('div');
    p1.setAttribute('data-po-phase','1');
    p1.innerHTML = '<div style="font-size:.78rem;text-transform:uppercase;letter-spacing:.12em;font-weight:600;opacity:.7">Step 1 of 2 — eligibility</div>';
    fi.insertBefore(p1, fi.firstElementChild);
    if (lab) p1.appendChild(lab);
    p1.appendChild(ont);

    var cb = document.createElement('button');
    cb.type = 'button';
    cb.textContent = 'Continue →';
    cb.disabled = true;
    cb.style.cssText = 'justify-self:start;margin-top:.4rem;background:#1A1A1A;color:#F2EBDD;border:0;border-radius:999px;padding:.6rem 1.2rem;font-weight:600;cursor:not-allowed;opacity:.55';
    p1.appendChild(cb);

    var h = document.createElement('div');
    h.style.cssText = 'font-size:.85rem;opacity:.7';
    h.textContent = 'Pick an answer to continue.';
    p1.appendChild(h);

    var p2 = document.createElement('div');
    p2.setAttribute('data-po-phase','2');
    p2.style.cssText = 'display:none';
    fi.appendChild(p2);
    var moveQueue = [];
    Array.prototype.forEach.call(fi.children, function (el) { if (el !== p1 && el !== p2) moveQueue.push(el); });
    moveQueue.forEach(function (el) { p2.appendChild(el); });

    var ph = document.createElement('div');
    ph.style.cssText = 'display:flex;align-items:center;justify-content:space-between;gap:1rem;margin:.4rem 0 .85rem';
    var pt = document.createElement('div');
    pt.style.cssText = 'font-size:.78rem;text-transform:uppercase;letter-spacing:.12em;font-weight:600;opacity:.7';
    pt.textContent = 'Step 2 of 2 — application';
    var bk = document.createElement('button');
    bk.type = 'button';
    bk.textContent = '← Back to step 1';
    bk.style.cssText = 'background:transparent;border:0;color:inherit;font:inherit;cursor:pointer;text-decoration:underline;font-size:.85rem;opacity:.75;padding:0';
    ph.appendChild(pt); ph.appendChild(bk);
    p2.insertBefore(ph, p2.firstChild);

    var card = document.createElement('div');
    card.setAttribute('data-po-screener-end','1');
    card.setAttribute('role','status');
    card.style.cssText = 'display:none';
    card.innerHTML = '<strong style="display:block;margin-bottom:.4rem;font-size:1.05rem">Thanks for your interest.</strong><span>This role requires current Ontario residency, so we can’t proceed with this application. We’ll keep your contact on file for future opportunities you may be eligible for.</span>';
    var eb = document.createElement('button');
    eb.type = 'button';
    eb.textContent = '← Back to step 1';
    eb.style.cssText = 'margin-top:.85rem;background:transparent;border:0;color:inherit;font:inherit;cursor:pointer;text-decoration:underline;font-size:.9rem;opacity:.85;padding:0';
    card.appendChild(eb);
    form.appendChild(card);

    function lt(){ var o = ont.options[ont.selectedIndex]; return o ? (o.text || o.label || '').trim() : ''; }
    function g1(){ ont.selectedIndex = 0; p1.style.display = ''; p2.style.display = 'none'; card.style.display = 'none'; cb.disabled = true; cb.style.opacity = '.55'; cb.style.cursor = 'not-allowed'; h.style.display = ''; try { ont.focus(); } catch(e){} }
    function g2(){ p1.style.display = 'none'; card.style.display = 'none'; p2.style.display = ''; try { p2.scrollIntoView({behavior:'smooth',block:'start'}); } catch(e){} }
    function ge(){ p1.style.display = 'none'; p2.style.display = 'none'; card.style.display = 'block'; try { card.scrollIntoView({behavior:'smooth',block:'nearest'}); } catch(e){} }
    function oc2(){ var l = lt().toLowerCase(); var u = !l || /^select/i.test(l); cb.disabled = u; cb.style.opacity = u ? '.55' : '1'; cb.style.cursor = u ? 'not-allowed' : 'pointer'; h.style.display = u ? '' : 'none'; }
    function ok(){ var l = lt().toLowerCase(); if (!l || /^select/i.test(l)) return; if (l === 'no') return ge(); return g2(); }

    ont.addEventListener('change', oc2);
    cb.addEventListener('click', ok);
    bk.addEventListener('click', g1);
    eb.addEventListener('click', g1);
    oc2();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();

/* --- footer block 06 --- */
(function(){function isDark(){return document.documentElement.getAttribute('data-theme')==='dark';}function stamp(el){if(!el||el.nodeType!==1)return;if(!el.classList||!el.classList.contains('w-dropdown-list'))return;if(isDark()){el.style.setProperty('background-color','#171d2c','important');el.style.setProperty('background-image','none','important');el.style.setProperty('color','#f5ecd2','important');el.style.setProperty('border-color','#3a4258','important');el.style.setProperty('color-scheme','dark','important');[...el.querySelectorAll('a')].forEach(function(a){a.style.setProperty('background-color','transparent','important');a.style.setProperty('color','#f5ecd2','important');});}else{el.style.removeProperty('background-color');el.style.removeProperty('background-image');el.style.removeProperty('color');el.style.removeProperty('border-color');el.style.removeProperty('color-scheme');[...el.querySelectorAll('a')].forEach(function(a){a.style.removeProperty('background-color');a.style.removeProperty('color');});}}function stampAll(){[...document.querySelectorAll('.w-dropdown-list')].forEach(stamp);}stampAll();document.querySelectorAll('.w-dropdown-list').forEach(function(d){new MutationObserver(function(){stamp(d);}).observe(d,{attributes:true,attributeFilter:['class','style']});});new MutationObserver(function(m){m.forEach(function(x){if(x.type==='attributes'&&x.attributeName==='data-theme')stampAll();});}).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});document.addEventListener('mouseover',function(e){var t=e.target;if(t&&t.closest&&t.closest('.w-dropdown')){[...document.querySelectorAll('.w-dropdown-list')].forEach(stamp);}},true);})();

/* --- footer block 07 --- */
(function(){function patch(){var walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,null);var hit=null;var n;while(n=walker.nextNode()){if(/keep your contact on file/i.test(n.nodeValue)||/sign up for our updates/i.test(n.nodeValue)){hit=n;break;}}if(!hit)return false;var parent=hit.parentElement;if(!parent||parent.dataset.poApplyCopy==='1')return true;parent.dataset.poApplyCopy='1';parent.innerHTML='<strong>Thanks for your interest.</strong> This role requires current Ontario residency, so we can’t move ahead with this application. If you’d like to hear about future Pain Ontario openings, <a href="/#updates" style="color:#1F6B7E;font-weight:600;text-decoration:underline">sign up for email updates</a>.';return true;}if(!patch()){[200,500,1000,2000,4000,8000].forEach(function(d){setTimeout(patch,d);});}})();

/* --- footer block 08 --- */
(function(){
if(!/\/about\/jobs/.test(location.pathname))return;
var deadline=new Date('2026-05-22T17:00:00-04:00');
var d=Math.max(0,Math.ceil((deadline-new Date())/86400000));

var glance=document.createElement('div');glance.className='po-jbs';
glance.innerHTML='<span class="po-jbs-c"><strong>Hours</strong> 65/mo</span><span class="po-jbs-c"><strong>Pay</strong> $100/hr</span><span class="po-jbs-c"><strong>Term</strong> 18 mo</span><span class="po-jbs-c"><strong>Location</strong> Remote, ON</span><span class="po-jbs-c dl"><strong>Apply by</strong> May 22nd, 2026'+(d>0?' ('+d+'d)':'')+'</span>';
function injectGlance(){var existing=document.querySelector('.po-jbs');if(existing){existing.innerHTML=glance.innerHTML;return;}var a=[...document.querySelectorAll('h3')].find(function(h){return /Executive Director will/i.test(h.textContent);});if(a)a.parentElement.insertBefore(glance,a);}
injectGlance();

var applyH=[...document.querySelectorAll('h2')].find(function(h){return /Apply for this role/i.test(h.textContent);});
if(applyH&&!applyH.id)applyH.id='po-apply';
if(!document.querySelector('.po-jbs-st')){
  var sticky=document.createElement('a');sticky.className='po-jbs-st';sticky.href='#'+(applyH?applyH.id:'po-apply');
  sticky.innerHTML='<span>Apply</span>'+(d>=0?'<b>'+(d===0?'today':d+'d')+'</b>':'<b>closed</b>');
  document.body.appendChild(sticky);
  function upd(){var sc=window.scrollY>500;var aT=applyH?applyH.getBoundingClientRect().top:Infinity;sticky.classList.toggle('show',sc&&aT>200);}
  upd();window.addEventListener('scroll',upd,{passive:true});window.addEventListener('resize',upd,{passive:true});
}

function buildRC(){var h2=[...document.querySelectorAll('h2')].find(function(h){return /Currently hiring/i.test(h.textContent);});if(!h2)return;var h3=h2.parentElement.querySelector('h3');if(!h3||h3.dataset.poRc)return;var ps=[],n=h3.nextElementSibling;while(n&&n.tagName==='P'){ps.push(n);n=n.nextElementSibling;}var c=document.createElement('div');c.className='po-jbs-rc';c.innerHTML='<p class="eb">Open role</p><h3>Founding Executive Director</h3><p>A foundational leadership role to establish governance, secure sustainable funding, and build provincial partnerships for chronic pain care.</p><p>Full posting below. Questions: <a href="mailto:info@painontario.ca">info@painontario.ca</a>.</p>';h3.dataset.poRc='1';h3.parentElement.insertBefore(c,h3);h3.remove();ps.forEach(function(p){p.remove();});}
buildRC();

var equity=document.createElement('aside');equity.className='po-jbs-eq';equity.innerHTML='<h3>Whose voices we want at the table</h3><p>People with lived and living experience of chronic pain, Indigenous Peoples, Black and other racialized candidates, 2SLGBTQ+ candidates, Disabled candidates, and people from working-class and rural communities are particularly encouraged to apply.</p><p>If you need an accommodation at any stage of the process, write to <a href="mailto:info@painontario.ca">info@painontario.ca</a> and we will arrange it. You do not need to disclose a reason.</p>';
function injectEq(){var existing=document.querySelector('.po-jbs-eq');if(existing){existing.innerHTML=equity.innerHTML;return;}var anchor=[...document.querySelectorAll('p')].find(function(p){return /This role begins as a fractional/i.test(p.textContent);});if(anchor)anchor.parentElement.insertBefore(equity,anchor.nextSibling);}
injectEq();

var prHTML='<h3>Hiring process</h3><ol><li><b>Application</b>by May 22nd, 2026</li><li><b>You hear back</b>end of May, every candidate</li><li><b>Interview</b>early June (shortlisted only)</li><li><b>Decision</b>mid-June</li></ol>';
function injectPr(){var existing=document.querySelector('.po-jbs-pr');if(existing){existing.innerHTML=prHTML;return;}var a=document.querySelector('.po-jbs-eq')||[...document.querySelectorAll('p')].find(function(p){return /This role begins as a fractional/i.test(p.textContent);});if(a){var pr=document.createElement('section');pr.className='po-jbs-pr';pr.innerHTML=prHTML;a.parentElement.insertBefore(pr,a.nextSibling);}}
injectPr();

function ss(rx,k){var h=[...document.querySelectorAll('h3')].find(function(h){return rx.test(h.textContent);});if(!h||h.dataset.po)return;var sb=[],n=h.nextElementSibling;while(n&&n.tagName==='P'&&/^•/.test(n.textContent.trim())){sb.push(n);n=n.nextElementSibling;}if(!sb.length)return;var ul=document.createElement('ul');sb.forEach(function(p){var li=document.createElement('li');li.textContent=p.textContent.trim().replace(/^•\s*/,'');ul.appendChild(li);});var c=document.createElement('section');c.className='po-jbs-rs';c.innerHTML='<p class="kk">'+k+'</p>';var nh=h.cloneNode(true);nh.dataset.po='1';c.appendChild(nh);c.appendChild(ul);h.parentNode.insertBefore(c,h);h.remove();sb.forEach(function(p){p.remove();});}
function go(){injectGlance();buildRC();injectEq();injectPr();ss(/Executive Director will/i,'Responsibilities');ss(/We are looking for someone who is/i,'Profile');}
go();
[300,800,1500,3000].forEach(function(t){setTimeout(go,t);});
})();

/* --- footer block 09 --- */
!function(){var css=['html body .po-fab-stack{gap:.7rem!important;right:1.5rem!important;bottom:1.5rem!important;align-items:flex-end!important}','@media(min-width:768px){html body .po-fab-stack{bottom:5.5rem!important}}','html body button.po-tt,html body .po-fab,html body .po-fab-stack .po-tt{width:4rem!important;height:4rem!important;font-size:2rem!important;line-height:1!important;border-width:2px!important;box-shadow:0 8px 22px rgba(0,0,0,.24)!important}','@media(max-width:767px){html body button.po-tt,html body .po-fab,html body .po-fab-stack .po-tt{width:3.25rem!important;height:3.25rem!important;font-size:1.6rem!important}}','html body button.po-tt{display:flex!important}','html body .po-fab.po-up:not(.show){opacity:0!important;pointer-events:none!important}','html body .po-fab.po-up.show{opacity:1!important;pointer-events:auto!important}','html[data-theme="dark"] body button.po-tt,html[data-theme="dark"] body .po-fab{box-shadow:0 8px 26px rgba(0,0,0,.6)!important}','html body button.po-tt:hover,html body .po-fab:hover{transform:scale(1.06)!important}','.po-mode-chip{font:600 .72rem/1 system-ui,-apple-system,sans-serif;letter-spacing:.06em;text-transform:uppercase;padding:.32rem .65rem;border-radius:999px;background:#0f2540;color:#fff;box-shadow:0 4px 12px rgba(0,0,0,.18);user-select:none;pointer-events:auto;align-self:flex-end;opacity:0;transform:translateY(4px);transition:opacity .25s ease,transform .25s ease}','.po-mode-chip.show{opacity:1;transform:translateY(0)}','html[data-theme="dark"] .po-mode-chip{background:#b6d6c8!important;color:#0e1320!important;box-shadow:0 4px 14px rgba(0,0,0,.5)!important}','html[data-theme="dark"] .po-mode-chip *{color:#0e1320!important}'].join('');function inject(){if(!document.querySelector('style[data-po="bigtogglefinal"]')){var s=document.createElement('style');s.setAttribute('data-po','bigtogglefinal');s.textContent=css;document.head.appendChild(s);}}function adopt(){var stack=document.querySelector('.po-fab-stack');var tt=document.querySelector('.po-tt');if(stack && tt && tt.parentElement!==stack){stack.appendChild(tt);}}function chipText(){return document.documentElement.getAttribute('data-theme')==='dark'?'Dark mode':'Light mode';}var hideTimer=null;function flash(chip,duration){if(!chip)return;chip.textContent=chipText();chip.classList.add('show');if(hideTimer)clearTimeout(hideTimer);hideTimer=setTimeout(function(){chip.classList.remove('show');},duration||3000);}function ensureChip(initial){var stack=document.querySelector('.po-fab-stack');if(!stack)return;var chip=stack.querySelector('.po-mode-chip');if(!chip){chip=document.createElement('div');chip.className='po-mode-chip';chip.setAttribute('aria-live','polite');stack.insertBefore(chip,stack.firstChild);chip.addEventListener('mouseenter',function(){flash(chip,3000);});}chip.textContent=chipText();if(initial)flash(chip,3500);}function attachToggleHandler(){var tt=document.querySelector('.po-tt');if(!tt || tt.dataset.poChipBound)return;tt.dataset.poChipBound='1';tt.addEventListener('click',function(){setTimeout(function(){flash(document.querySelector('.po-mode-chip'),3000);},20);});}inject();adopt();ensureChip(true);attachToggleHandler();[120,400,1000,2000,4000].forEach(function(t){setTimeout(function(){inject();adopt();ensureChip(false);attachToggleHandler();},t);});new MutationObserver(function(){flash(document.querySelector('.po-mode-chip'),3000);}).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});}();

/* --- footer block 10 --- */
!function(){if(location.pathname!=='/' && !/^\/index/i.test(location.pathname))return;var css=['html body section .news-list{display:grid!important;grid-template-columns:1fr!important;gap:20px!important;max-width:760px}','html body section .news-item{margin:0!important;display:block!important}','html body section .news-item:has(a[href*="/news/pain-connect"]) img{display:none!important}','html body section .news-item a.w-inline-block{aspect-ratio:auto!important;display:flex!important;flex-direction:column!important;gap:8px!important;padding:20px 22px!important;height:auto!important;border:1px solid rgba(20,40,60,.12);border-radius:14px;background:rgba(255,255,255,.65)}','html[data-theme="dark"] body section .news-item a.w-inline-block{border-color:rgba(255,255,255,.08)!important;background:rgba(20,28,40,.45)!important}','html body section .news-item img.image-15{display:block!important;width:100%!important;max-height:160px!important;height:auto!important;object-fit:cover!important;border-radius:10px!important;margin-top:6px!important}','html body section .news-item img.image-15.w-dyn-bind-empty{display:none!important}','html body section .news-item p.w-dyn-bind-empty{display:none!important}'].join('');var s=document.createElement('style');s.setAttribute('data-po','homenewsfixfinal');s.textContent=css;document.head.appendChild(s);function hidePcImg(){var nodes=document.querySelectorAll('.news-item a[href*="/news/pain-connect"] img');nodes.forEach(function(img){img.style.display='none';});}hidePcImg();[120,400,1200,3000].forEach(function(t){setTimeout(hidePcImg,t);});}();

/* --- footer block 11 --- */
!function(){if(!/\/about\/jobs\/?$/i.test(location.pathname))return;var css='@media(min-width:768px){html body .po-fab-stack{bottom:5rem!important}}.po-jbs-st{box-shadow:0 6px 24px rgba(0,0,0,.18)}html[data-theme="dark"] .po-jbs-st{box-shadow:0 6px 24px rgba(0,0,0,.55)}';var s=document.createElement('style');s.setAttribute('data-po','jobsfabsfinal');s.textContent=css;document.head.appendChild(s);}();

/* --- footer block 12 --- */
!function(){if(!/\/about\/jobs\/?$/i.test(location.pathname))return;function fill(){var k=document.querySelector('.kicker');if(k && !k.textContent.trim()){k.textContent='Open roles';}}fill();[120,400,1200,3000].forEach(function(t){setTimeout(fill,t);});}();

/* --- footer block 13 --- */
(function(){if(!/\/about\/jobs/.test(location.pathname))return;document.body.setAttribute('data-pojobs','');var s=document.createElement('style');s.textContent='@media(min-width:992px){body[data-pojobs] .div-block-21.wrap{max-width:960px!important;width:auto!important;margin-left:auto!important;margin-right:auto!important}body[data-pojobs] .w-form:has(#wf-form-Job_Application_Form){max-width:none}}body[data-pojobs] .w-form-done,body[data-pojobs] .w-form-fail{border-radius:14px;padding:1.25rem 1.4rem;margin-top:1rem;line-height:1.5}body[data-pojobs] .w-form-done{background:rgba(120,188,156,0.16);border:1px solid rgba(120,188,156,0.45);color:var(--brand-cream,#f5efe2)}body[data-pojobs] .w-form-fail{background:rgba(220,120,120,0.16);border:1px solid rgba(220,120,120,0.45);color:var(--brand-cream,#f5efe2)}';document.head.appendChild(s);var DONE="Application received. We'll be in touch with all candidates by the end of May. Questions: info@painontario.ca.";var FAIL="That didn't go through. Please try again, or email your application directly to info@painontario.ca.";function p(){var d=document.querySelector('.w-form-done>div,.w-form-done'),f=document.querySelector('.w-form-fail>div,.w-form-fail');if(d&&d.textContent.trim()!==DONE)d.textContent=DONE;if(f&&f.textContent.trim()!==FAIL)f.textContent=FAIL}p();new MutationObserver(p).observe(document.body,{childList:true,subtree:true});})();

/* --- footer block 14 --- */
!function(){var WEBHOOK_URL='https://hook.eu1.make.com/i77her8hnsgb45478mmct3va6olu20ir';function injectGlobalSpacingFix(){if(!/^\/contact\/?$/i.test(location.pathname))return;if(document.querySelector('style[data-po="contact-spacing-v7"]'))return;var s=document.createElement('style');s.setAttribute('data-po','contact-spacing-v7');s.textContent='@supports(selector(:has(*))){section:has(>.wrap>#wf-form-Contact-Us-Form),section:has(#wf-form-Contact-Us-Form){padding-top:0!important}section:has(.signpost){padding-bottom:1rem!important}}';document.head.appendChild(s);}function addFooterLink(){var footer=document.querySelector('footer');if(!footer)return;if(footer.querySelector('.po-feedback-link'))return;var p=document.createElement('p');p.className='po-feedback-link';p.style.cssText='margin-top:1rem;font-size:.85rem;text-align:center;opacity:.85';p.innerHTML='<a href="/contact#feedback" style="color:inherit;text-decoration:underline">Found something hard to use, or have an idea? Let us know →</a>';footer.appendChild(p);}function buildSection(){if(!/^\/contact\/?$/i.test(location.pathname))return;var existing=document.getElementById('feedback');if(existing && existing.dataset.poV==='7')return;if(existing){existing.remove();}var volunteerH=Array.from(document.querySelectorAll('h2,h3')).find(function(h){return /^Volunteer\.?$/i.test((h.textContent||'').trim());});var anchorSection;if(volunteerH){anchorSection=volunteerH.closest('section')||volunteerH.parentElement;}if(!anchorSection){var contactForm=document.getElementById('wf-form-Contact-Us-Form')||document.querySelector('form[name*="Contact" i]')||document.querySelector('form');if(!contactForm)return;anchorSection=contactForm.closest('section')||contactForm.parentElement;}var hostWrap=anchorSection.querySelector('.wrap')||anchorSection.querySelector('[class*="wrap"]');var wrapClass=hostWrap?hostWrap.className:'wrap';var section=document.createElement('section');section.id='feedback';section.dataset.poV='7';section.className='po-feedback-section band';section.style.cssText='padding:1.5rem 0 3rem;background:transparent';section.innerHTML='<style>html[data-theme="dark"] .po-feedback-card{background:rgba(20,28,40,.55)!important;border-color:rgba(255,255,255,.1)!important}.po-feedback-card{padding:1.75rem;margin:0;border:1px solid rgba(20,40,60,.18);border-radius:14px;max-width:680px;background:rgba(255,255,255,.65)}.po-feedback-card h2{margin:0 0 .4rem;font-size:1.4rem}.po-feedback-card .po-feedback-intro{margin:0 0 1.2rem;font-size:.95rem;opacity:.85}.po-feedback-card form{display:flex;flex-direction:column;gap:1.1rem}.po-feedback-card fieldset{border:none;padding:0;margin:0;display:flex;flex-direction:column;gap:.45rem}.po-feedback-card legend{font-weight:600;margin-bottom:.55rem;padding:0;font-size:.95rem}.po-feedback-card label.po-fl{display:flex;flex-direction:column;gap:.4rem;font-size:.9rem}.po-feedback-card label.po-fr{display:flex;align-items:center;gap:.5rem;font-size:.9rem;cursor:pointer}.po-feedback-card input[type=email],.po-feedback-card textarea{padding:.65rem .8rem;border:1px solid rgba(20,40,60,.25);border-radius:10px;background:transparent;color:inherit;font:inherit;width:100%;box-sizing:border-box}html[data-theme="dark"] .po-feedback-card input[type=email],html[data-theme="dark"] .po-feedback-card textarea{border-color:rgba(255,255,255,.18)}.po-feedback-card input[type=email]:focus,.po-feedback-card textarea:focus{outline:2px solid #1F6B7E;outline-offset:1px}.po-feedback-card button{padding:.7rem 1.4rem;background:#1F6B7E;color:#fff;border:none;border-radius:999px;font-weight:600;cursor:pointer;align-self:flex-start;font:inherit}html[data-theme="dark"] .po-feedback-card button{background:#b6d6c8;color:#0e1320}.po-feedback-card button[disabled]{opacity:.6;cursor:wait}.po-feedback-card .po-feedback-note{margin-top:.6rem;font-size:.78rem;opacity:.7}.po-feedback-card .po-feedback-success{padding:1.2rem;border-radius:10px;background:rgba(31,107,126,.12);color:inherit;font-size:.95rem}html[data-theme="dark"] .po-feedback-card .po-feedback-success{background:rgba(182,214,200,.15)}</style><div class="'+wrapClass+'"><div class="po-feedback-card"><h2>Site feedback</h2><p class="po-feedback-intro">Found something hard to use, or have an idea for what we should add? Tell us. We will read it.</p><form id="po-feedback-form"><fieldset><legend>What kind of feedback?</legend><label class="po-fr"><input type="radio" name="kind" value="Accessibility issue" required> Accessibility issue</label><label class="po-fr"><input type="radio" name="kind" value="Feature suggestion"> Feature suggestion</label><label class="po-fr"><input type="radio" name="kind" value="Resource we should add"> A resource we should add</label><label class="po-fr"><input type="radio" name="kind" value="Something else"> Something else</label></fieldset><label class="po-fl"><span style="font-weight:600">What happened, or what would help? <span style="opacity:.6;font-weight:400">(optional)</span></span><textarea name="message" rows="5"></textarea></label><label class="po-fl"><span style="font-weight:600">Email if you would like a reply <span style="opacity:.6;font-weight:400">(optional)</span></span><input type="email" name="email" placeholder="you@example.com"></label><button type="submit">Send feedback</button><p class="po-feedback-note">We read every submission. If you would prefer email, write to <a href="mailto:info@painontario.ca" style="color:inherit">info@painontario.ca</a>.</p></form></div></div>';if(anchorSection.parentNode){if(anchorSection.nextSibling){anchorSection.parentNode.insertBefore(section,anchorSection.nextSibling);}else{anchorSection.parentNode.appendChild(section);}}else{document.body.appendChild(section);}var fb=document.getElementById('po-feedback-form');fb.addEventListener('submit',function(e){e.preventDefault();var btn=fb.querySelector('button[type=submit]');btn.disabled=true;btn.textContent='Sending...';var fd=new FormData(fb);var payload={kind:fd.get('kind')||'Site feedback',message:fd.get('message')||'',email:fd.get('email')||'',url:location.href,userAgent:navigator.userAgent,timestamp:new Date().toISOString()};var done=false;function showSuccess(){done=true;var card=section.querySelector('.po-feedback-card');if(card){var form=card.querySelector('#po-feedback-form');if(form){form.outerHTML='<div class="po-feedback-success"><strong>Thanks — got it.</strong> We read every submission. If you left an email, we will get back to you when we can.</div>';}}}function fallbackMailto(){if(done)return;done=true;var subject=encodeURIComponent('Pain Ontario site feedback: '+payload.kind);var bodyText='Type: '+payload.kind+'\n\nMessage:\n'+(payload.message||'(no message)')+'\n\nReply to: '+(payload.email||'(no reply email provided)');window.location.href='mailto:info@painontario.ca?subject='+subject+'&body='+encodeURIComponent(bodyText);btn.disabled=false;btn.textContent='Send feedback';}fetch(WEBHOOK_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),mode:'cors'}).then(function(r){if(r.ok)showSuccess();else fallbackMailto();}).catch(function(){fallbackMailto();});setTimeout(function(){if(!done)fallbackMailto();},6000);});if(location.hash==='#feedback'){section.scrollIntoView({behavior:'smooth',block:'start'});}}function init(){injectGlobalSpacingFix();addFooterLink();buildSection();}init();[120,400,1200,3000].forEach(function(t){setTimeout(init,t);});}();

/* --- footer block 15 --- */
!function(){if(!/\/about\/jobs\/?$/i.test(location.pathname))return;var p=function(){var e=document.querySelector('.po-jbs-eq');if(!e||e.dataset.v==='2')return!1;e.dataset.v='2';e.innerHTML='<h3>Who we want to hear from</h3><p>We\'re especially looking for applications from people with lived and living experience of chronic pain, Indigenous Peoples, Black and other racialized candidates, 2SLGBTQ+ candidates, Disabled candidates, and people from working-class and rural communities.</p><p>If you need an accommodation at any stage, write to <a href="mailto:info@painontario.ca">info@painontario.ca</a> and we\'ll arrange it. You don\'t need to disclose a reason.</p>';return!0};p();[200,500,1000,2000,4000].forEach(function(d){setTimeout(p,d)});var s=document.createElement('style');s.setAttribute('data-po','jobsequityandpillrestylev2');s.textContent='.po-jbs-st{background:#fff!important;color:#1F6B7E!important;border:1.5px solid #1F6B7E!important;font-weight:500!important;padding:.55rem 1.1rem!important;font-size:.95rem!important;border-radius:999px!important;box-shadow:0 2px 8px rgba(0,0,0,0.08)!important;display:inline-flex!important;align-items:center!important;gap:.4rem!important;text-decoration:none!important}.po-jbs-st:hover{background:#1F6B7E!important;color:#fff!important}.po-jbs-st b,.po-jbs-st span,.po-jbs-st small{background:transparent!important;color:inherit!important;opacity:.7!important;font-size:.78em!important;font-weight:400!important;padding:0!important;border-radius:0!important;letter-spacing:normal!important}html[data-theme="dark"] .po-jbs-st{background:rgba(31,107,126,0.15)!important;color:#f5ecd2!important;border-color:#f5ecd2!important}html[data-theme="dark"] .po-jbs-st:hover{background:#f5ecd2!important;color:#171d2c!important}html[data-theme="dark"] .po-jbs-st *{color:inherit!important}';document.head.appendChild(s)}();

/* --- v2 additions: chip-strip restore + kicker-as-link + finsweet cmsfilter/cmssort loader + cross-page prefetch hints --- */

/* Block -1: cross-page prefetch hints. Fires during browser idle so it doesn't compete with critical paint. /about/jobs visitors are likely to browse /resource-library next (Vina, 2026-05-05). */
(function(){
  var PREFETCH_MAP = {
    '/about/jobs': ['/resource-library/all']
  };
  var hits = PREFETCH_MAP[location.pathname];
  if (!hits || !hits.length) return;
  function fire(){
    hits.forEach(function(url){
      if (document.querySelector('link[rel="prefetch"][href="' + url + '"]')) return;
      var l = document.createElement('link');
      l.rel  = 'prefetch';
      l.href = url;
      l.as   = 'document';
      document.head.appendChild(l);
    });
  }
  if (window.requestIdleCallback) {
    requestIdleCallback(fire, { timeout: 2500 });
  } else {
    setTimeout(fire, 1200);
  }
})();


/* Block 0a: Load Finsweet cmsload + cmssort only.
   cmsload bypasses Webflow's 100-item CMS list cap (renders all 162 resources).
   cmssort handles the A-Z / Z-A / Recent / Source dropdown.
   cmsfilter is INTENTIONALLY NOT loaded — its dynamic-injection coordination is
   broken (cmsfilter.listInstances stays null, filtersData never populated, chip
   clicks narrow to 0). Block 0b below replaces it with a custom filter that
   reads [fs-cmsfilter-field] text content directly off each .w-dyn-item. */
(function(){
  if (window.__poFinsweetLoaded) return;
  var needsLoad = !!document.querySelector('[fs-cmsload-element]');
  var needsSort = !!document.querySelector('[fs-cmssort-element], [fs-cmssort-field]');
  if (!needsLoad && !needsSort) return;
  window.__poFinsweetLoaded = true;
  if (!window.fsAttributes) window.fsAttributes = [];

  function load(src){
    if (document.querySelector('script[src="' + src + '"]')) return;
    var s = document.createElement('script');
    s.src = src;
    s.async = false;
    document.head.appendChild(s);
  }
  if (needsLoad) load('https://cdn.jsdelivr.net/npm/@finsweet/attributes-cmsload@1/cmsload.js');
  if (needsSort) load('https://cdn.jsdelivr.net/npm/@finsweet/attributes-cmssort@1/cmssort.js');
})();

/* Block 0b: Custom filter for /resource-library — replaces broken Finsweet cmsfilter.
   Watches chip checkboxes (each has fs-cmsfilter-field=audience|format|age|region
   plus value=<token>). For each .w-dyn-item, reads its [fs-cmsfilter-field] text
   content into a values map, then shows/hides items based on which chips are checked.
   Also handles #res-search free-text search across name/source/audience text. */
(function(){
  if (!/\/resource-library/.test(location.pathname)) return;
  if (window.__poCustomFilter) return;

  var FIELDS = ['audience','format','age','region','source','name'];

  function tokens(text){
    return String(text || '').toLowerCase().split(/[\s,;|]+/).map(function(t){
      return t.replace(/[^a-z0-9-]/g, '');
    }).filter(Boolean);
  }

  function indexItems(items){
    Array.prototype.forEach.call(items, function(it){
      if (it.dataset.poFiltered) return;
      var values = {};
      FIELDS.forEach(function(f){
        values[f] = [];
        var nodes = it.querySelectorAll('[fs-cmsfilter-field="' + f + '"]');
        Array.prototype.forEach.call(nodes, function(n){
          tokens(n.textContent).forEach(function(t){ if (values[f].indexOf(t) === -1) values[f].push(t); });
        });
      });
      it.dataset.poFiltered = '1';
      it._poFilterValues = values;
      it._poFilterTextBlob = it.textContent.toLowerCase();
    });
  }

  function getActiveFilters(){
    var state = {};
    FIELDS.forEach(function(f){ state[f] = []; });
    var chips = document.querySelectorAll('.chip input[type="checkbox"]:checked, [fs-cmsfilter-field][type="checkbox"]:checked, [fs-cmsfilter-field][type="radio"]:checked');
    Array.prototype.forEach.call(chips, function(c){
      var field = c.getAttribute('fs-cmsfilter-field') || c.name;
      if (!field || FIELDS.indexOf(field) === -1) return;
      var v = (c.value || '').toLowerCase().trim();
      if (v && state[field].indexOf(v) === -1) state[field].push(v);
    });
    return state;
  }

  function getSearchText(){
    var s = document.querySelector('#res-search, input[name="res-search"], input[fs-cmsfilter-field="name,source"]');
    return s ? (s.value || '').trim().toLowerCase() : '';
  }

  function apply(){
    var items = document.querySelectorAll('.w-dyn-item');
    if (!items.length) return;
    indexItems(items);
    var state = getActiveFilters();
    var q = getSearchText();
    var visible = 0;
    Array.prototype.forEach.call(items, function(it){
      var keep = true;
      FIELDS.forEach(function(f){
        if (!keep) return;
        var sel = state[f];
        if (!sel.length) return;
        var have = it._poFilterValues[f] || [];
        var ok = sel.some(function(s){ return have.indexOf(s) !== -1; });
        if (!ok) keep = false;
      });
      if (keep && q) {
        keep = it._poFilterTextBlob.indexOf(q) !== -1;
      }
      /* Use class instead of inline display:none — the grid rule is
         display:block !important, so inline style alone won't win. */
      it.classList.toggle('po-filter-hidden', !keep);
      if (keep) visible++;
    });
    var counter = document.querySelector('#res-count');
    if (counter) counter.textContent = visible + ' resource' + (visible === 1 ? '' : 's');
    var empty = document.querySelector('#resources-empty');
    if (empty) empty.style.display = visible === 0 ? '' : 'none';
  }

  function bindOnce(){
    if (window.__poCustomFilter) return;
    window.__poCustomFilter = true;
    /* Webflow's .w-checkbox-input intercepts change events, so listen for
       both click + change on multiple plausible targets, then debounce
       apply() so duplicate firings don't matter. */
    function onChip(e){
      var t = e.target;
      if (!t || !t.matches) return;
      if (t.matches('.chip input, .chip label, .chip, [fs-cmsfilter-field], .w-checkbox-input, .w-form-formradioinput')
          || (t.closest && t.closest('.chip'))) {
        clearTimeout(window.__poFilterT2);
        window.__poFilterT2 = setTimeout(apply, 50);
      }
    }
    document.addEventListener('change', onChip, true);
    document.addEventListener('click', onChip, true);
    var search = document.querySelector('#res-search, input[name="res-search"], input[fs-cmsfilter-field="name,source"]');
    if (search) {
      search.addEventListener('input', function(){
        clearTimeout(window.__poFilterT);
        window.__poFilterT = setTimeout(apply, 120);
      });
    }
    /* Run after cmsload finishes rendering all items */
    if (!window.fsAttributes) window.fsAttributes = [];
    if (Array.isArray(window.fsAttributes)) {
      window.fsAttributes.push(['cmsload', function(){
        setTimeout(apply, 100);
        setTimeout(apply, 1200);
      }]);
    }
    /* Belt + braces: re-apply on a few timers in case cmsload callback misses */
    [800, 2500, 5000].forEach(function(ms){ setTimeout(apply, ms); });
    /* Also observe DOM for new items appearing (cmsload pagination/render) */
    var debounce;
    var mo = new MutationObserver(function(){
      clearTimeout(debounce);
      debounce = setTimeout(apply, 200);
    });
    var listEl = document.querySelector('[fs-cmsload-element="list"], [fs-cmsfilter-element="list"], .resources-grid');
    if (listEl) mo.observe(listEl, { childList: true, subtree: false });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindOnce);
  } else {
    bindOnce();
  }
})();


/* Block 0e: nav hover — visible accessible color shift + underline grow on
   .nav-link-7 / .w-nav-link / .w-dropdown-link. WCAG AA contrast in both
   modes; focus-visible state for keyboard; prefers-reduced-motion respected. */
(function(){
  if (document.querySelector('style[data-po="nav-hover-v1"]')) return;
  var s = document.createElement('style');
  s.setAttribute('data-po', 'nav-hover-v1');
  s.textContent = [
    /* Base — establish a relative anchor + smooth transitions */
    'html .nav-link-7,html .w-nav-link,html .w-dropdown-link{position:relative;transition:color .18s ease,background-color .18s ease!important}',

    /* Light mode hover: sky brand color + underline grows under text */
    'html .nav-link-7:hover,html .w-nav-link:hover{color:#1F6B7E!important}',
    'html .nav-link-7::after,html .w-nav-link::after{content:"";position:absolute;left:14px;right:14px;bottom:6px;height:2px;background:currentColor;transform:scaleX(0);transform-origin:center;transition:transform .2s ease;border-radius:2px;pointer-events:none}',
    'html .nav-link-7:hover::after,html .w-nav-link:hover::after,html .nav-link-7.w--current::after,html .w-nav-link.w--current::after{transform:scaleX(1)}',

    /* Dropdown items get a subtle pill-fill hover (no underline since they sit on a panel) */
    'html .w-dropdown-link::after{display:none}',
    'html .w-dropdown-link:hover{color:#1F6B7E!important;background-color:rgba(31,107,126,0.08)!important}',

    /* Dark mode: shift to brighter teal (#9bd6e8) for visible contrast on dark nav */
    'html[data-theme="dark"] .nav-link-7:hover,html[data-theme="dark"] .w-nav-link:hover{color:#9bd6e8!important}',
    'html[data-theme="dark"] .w-dropdown-link:hover{color:#c5e7f1!important;background-color:rgba(155,214,232,0.10)!important}',

    /* Focus-visible: 2px brand outline on keyboard nav */
    'html .nav-link-7:focus-visible,html .w-nav-link:focus-visible,html .w-dropdown-link:focus-visible{outline:2px solid #1F6B7E!important;outline-offset:2px!important;border-radius:6px!important}',
    'html[data-theme="dark"] .nav-link-7:focus-visible,html[data-theme="dark"] .w-nav-link:focus-visible,html[data-theme="dark"] .w-dropdown-link:focus-visible{outline-color:#9bd6e8!important}',

    /* Replace the existing 8.8px dot indicator on .w--current with the same
       underline used by hover, so the active state matches the hover treatment.
       Scope hides every .w--current::before/::after dot anywhere in the nav
       (covers .container-11.w--current logo dots that bleed in dark mode). */
    'html nav .w--current::before,html header .w--current::before,html .navbar .w--current::before,html .w-nav .w--current::before{display:none!important;content:none!important;background:transparent!important}',
    'html nav .w--current::after,html header .w--current::after,html .navbar .w--current::after,html .w-nav .w--current::after{background:transparent!important}',
    /* But put back our underline on the nav links specifically */
    'html .nav-link-7.w--current::after,html .w-nav-link.w--current::after{background:currentColor!important;transform:scaleX(1)!important}',
    'html .nav-link-7.w--current,html .w-nav-link.w--current{color:#1F6B7E!important}',
    'html[data-theme="dark"] .nav-link-7.w--current,html[data-theme="dark"] .w-nav-link.w--current{color:#9bd6e8!important}',

    /* Reduced-motion: keep color shift, drop the underline grow + transitions */
    '@media (prefers-reduced-motion: reduce){html .nav-link-7,html .w-nav-link,html .w-dropdown-link,html .nav-link-7::after,html .w-nav-link::after{transition:none!important}html .nav-link-7::after,html .w-nav-link::after{transform:scaleX(1);opacity:.5}html .nav-link-7:hover::after,html .w-nav-link:hover::after{opacity:1}}'
  ].join('');
  document.head.appendChild(s);
})();


/* Block 0c: /resource-library/by-audience — append Changemakers tile.
   Mirrors existing .audience-card markup. Idempotent. */
(function(){
  if (!/\/resource-library\/by-audience/.test(location.pathname)) return;
  function inject(){
    var grid = document.querySelector('.by-audience-grid');
    if (!grid) return;
    if (grid.querySelector('a[href*="audience=changemaker"]')) return;
    var a = document.createElement('a');
    a.href = '/resource-library/all?audience=changemaker';
    a.className = 'audience-card w-inline-block';
    a.setAttribute('aria-label', 'Resources for Changemakers');
    a.setAttribute('data-po', 'changemaker-tile-v1');
    a.innerHTML = '<div class="audience-card__inner"><p class="audience-card__eyebrow">For you</p><h2 class="audience-card__title">Changemakers</h2><p class="audience-card__blurb">Tools for advocates, community organizers, and people building public conversation about pain.</p><span class="audience-card__cta">See resources →</span></div>';
    grid.appendChild(a);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', inject);
  else inject();
  [400, 1200, 3000].forEach(function(ms){ setTimeout(inject, ms); });
})();


/* Block 0d: brand the Webflow password gate (visible when /dashboard/* is hit
   without page password). Webflow renders a stripped <form name="passwordform">
   page; site.js does load there. */
(function(){
  if (!document.querySelector('form[name="passwordform"], form[data-name="Password"], input[name="password"]')) return;
  if (document.querySelector('style[data-po="auth-gate-v1"]')) return;
  var s = document.createElement('style');
  s.setAttribute('data-po', 'auth-gate-v1');
  s.textContent = [
    'html,body{background:#f5efe2!important;color:#1F2933!important;font-family:"Inter Tight",system-ui,-apple-system,sans-serif!important;margin:0!important}',
    'html[data-theme="dark"] body{background:#0e1320!important;color:#f5ecd2!important}',
    'body{min-height:100vh!important;display:flex!important;align-items:center!important;justify-content:center!important;padding:2rem!important;box-sizing:border-box!important}',
    'form[name="passwordform"],form[data-name="Password"]{max-width:420px!important;width:100%!important;background:#fff!important;border-radius:18px!important;border:1px solid rgba(31,41,51,.08)!important;padding:2rem 1.75rem!important;box-shadow:0 18px 44px rgba(15,37,64,.12)!important}',
    'html[data-theme="dark"] form[name="passwordform"],html[data-theme="dark"] form[data-name="Password"]{background:#171d2c!important;border-color:#3a4258!important;box-shadow:0 18px 44px rgba(0,0,0,.45)!important}',
    'form[name="passwordform"]::before{content:"Pain Ontario";display:block;font:600 1.5rem/1.2 "Fraunces",Georgia,serif;color:#1F6B7E;margin-bottom:.5rem}',
    'html[data-theme="dark"] form[name="passwordform"]::before{color:#b6d6c8}',
    'form[name="passwordform"] h2,form[name="passwordform"] h3,form[name="passwordform"] p:first-of-type{font:500 .95rem/1.45 "Inter Tight",sans-serif;color:inherit;margin:0 0 1.25rem!important}',
    'form[name="passwordform"] label{display:block;font-weight:600;margin-bottom:.5rem!important;font-size:.9rem}',
    'form[name="passwordform"] input[type="password"]{width:100%!important;padding:.75rem .9rem!important;border:1px solid rgba(31,41,51,.25)!important;border-radius:10px!important;font:inherit!important;color:inherit!important;background:transparent!important;box-sizing:border-box!important;margin-bottom:1rem!important}',
    'form[name="passwordform"] input[type="password"]:focus{outline:2px solid #1F6B7E!important;outline-offset:1px!important}',
    'html[data-theme="dark"] form[name="passwordform"] input[type="password"]{border-color:#3a4258!important}',
    'form[name="passwordform"] input[type="submit"],form[name="passwordform"] button[type="submit"]{display:inline-block!important;padding:.75rem 1.5rem!important;background:#1F6B7E!important;color:#fff!important;border:none!important;border-radius:999px!important;font:600 .95rem/1 "Inter Tight",sans-serif!important;cursor:pointer!important;width:auto!important}',
    'html[data-theme="dark"] form[name="passwordform"] input[type="submit"],html[data-theme="dark"] form[name="passwordform"] button[type="submit"]{background:#b6d6c8!important;color:#0e1320!important}',
    'form[name="passwordform"] input[type="submit"]:hover,form[name="passwordform"] button[type="submit"]:hover{filter:brightness(.92)!important}',
    'form[name="passwordform"] .w-password-page-error,form[name="passwordform"] [class*="error"]{color:#b53535!important;font-size:.85rem;margin-top:.5rem!important}'
  ].join('');
  document.head.appendChild(s);
})();


/* Block A: full role-card CSS restore (chip strip + role card + equity band + hiring process timeline + 2-col responsibilities/profile with checkmark bullets) */
(function(){
  if (!/\/about\/jobs/.test(location.pathname)) return;
  if (document.querySelector('style[data-po="rolecard-full-v1"]')) return;
  var s = document.createElement('style');
  s.setAttribute('data-po', 'rolecard-full-v1');
  s.textContent = [
    /* chip strip */
    '.po-jbs{display:flex;flex-wrap:wrap;gap:8px;margin:18px auto 26px;max-width:1180px;padding:14px 18px;background:#EFEDE3;border-radius:20px;border:1px solid rgba(31,41,51,.08)}',
    '.po-jbs-c{display:inline-flex;align-items:center;gap:6px;padding:6px 12px;background:#fff;color:#1F2933;font:500 13px/1.3 "Inter Tight",sans-serif;border-radius:999px;border:1px solid rgba(31,41,51,.08)}',
    '.po-jbs-c strong{color:#1F6B7E}',
    '.po-jbs-c.dl{background:#1F6B7E;color:#fff;border-color:#17576A}',
    '.po-jbs-c.dl strong{color:#fff}',
    'html[data-theme="dark"] .po-jbs{background:#171d2c;border-color:#3a4258}',
    'html[data-theme="dark"] .po-jbs-c{background:#1f2638;color:#f5ecd2;border-color:#3a4258}',
    'html[data-theme="dark"] .po-jbs-c strong{color:#b6d6c8}',
    'html[data-theme="dark"] .po-jbs-c.dl{background:#b6d6c8;color:#0e1320;border-color:#b6d6c8}',
    'html[data-theme="dark"] .po-jbs-c.dl strong{color:#0e1320}',
    /* role card */
    '.po-jbs-rc{margin:18px auto 32px;max-width:1180px;padding:28px 32px;border-radius:24px;border:1px solid rgba(31,41,51,.12);background:#FBFAF3;display:flex;flex-direction:column;gap:12px;align-items:flex-start}',
    '.po-jbs-rc .eb{font:600 12px/1 sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#1F6B7E!important;margin:0}',
    '.po-jbs-rc h3{font:500 1.7rem/1.15 Fraunces,serif;margin:0;color:#1F2933!important}',
    '.po-jbs-rc p{margin:0;font-size:16px;line-height:1.55;color:#1F2933!important;max-width:780px}',
    '.po-jbs-rc a{color:#1F6B7E!important;font-weight:600}',
    'html[data-theme="dark"] .po-jbs-rc{background:#171d2c;border-color:#3a4258}',
    'html[data-theme="dark"] .po-jbs-rc .eb,html[data-theme="dark"] .po-jbs-rc a{color:#c8e3d5!important}',
    'html[data-theme="dark"] .po-jbs-rc h3,html[data-theme="dark"] .po-jbs-rc p{color:#f5ecd2!important}',
    /* equity band */
    '.po-jbs-eq{margin:32px auto;max-width:1180px;padding:28px;background:linear-gradient(180deg,#E8E2CC,#F2EDDC);border-radius:24px;border:1px solid rgba(31,41,51,.08)}',
    '.po-jbs-eq h3{font:500 1.4rem/1.2 Fraunces,Georgia,serif;margin:0 0 12px;color:#1F2933}',
    '.po-jbs-eq p{font-size:16px;line-height:1.6;color:#1F2933;margin:0 0 12px;max-width:780px}',
    '.po-jbs-eq p:last-child{margin:0}',
    '.po-jbs-eq a{color:#1F6B7E;font-weight:600}',
    'html[data-theme="dark"] .po-jbs-eq{background:#171d2c;border-color:#3a4258}',
    'html[data-theme="dark"] .po-jbs-eq h3,html[data-theme="dark"] .po-jbs-eq p{color:#f5ecd2}',
    'html[data-theme="dark"] .po-jbs-eq a{color:#c8e3d5}',
    /* hiring process timeline */
    '.po-jbs-pr{margin:32px auto;max-width:1180px}',
    '.po-jbs-pr h3{font:500 1.4rem/1.2 Fraunces,serif;margin:0 0 18px;color:inherit}',
    '.po-jbs-pr ol{list-style:none;padding:0;margin:0;display:grid;grid-template-columns:repeat(4,1fr);counter-reset:step;position:relative}',
    '.po-jbs-pr ol::before{content:"";position:absolute;top:18px;left:8%;right:8%;height:2px;background:currentColor;opacity:.2}',
    '.po-jbs-pr li{position:relative;padding:48px 8px 0;text-align:center;font-size:13px;line-height:1.4;opacity:.75;counter-increment:step}',
    '.po-jbs-pr li::before{content:counter(step);position:absolute;top:0;left:50%;transform:translateX(-50%);width:36px;height:36px;border-radius:50%;background:transparent;border:2px solid currentColor;font-weight:700;line-height:32px;opacity:.85}',
    '.po-jbs-pr li b{display:block;color:inherit;font-size:14px;margin-bottom:4px}',
    '@media(max-width:720px){.po-jbs-pr ol{grid-template-columns:1fr}.po-jbs-pr ol::before{display:none}.po-jbs-pr li{padding:0 0 8px 52px;text-align:left}.po-jbs-pr li::before{left:0;transform:none;top:2px}}',
    /* 2-col responsibilities / profile with checkmarks */
    '.po-jbs-rs{margin:32px auto;max-width:1180px;padding:28px;border-top:3px solid #1F6B7E;color:#1F2933!important}',
    '.po-jbs-rs .kk{font:600 12px/1 sans-serif;letter-spacing:.12em;text-transform:uppercase;color:#1F6B7E!important;margin:0 0 8px}',
    '.po-jbs-rs h3{font:500 1.5rem/1.2 Fraunces,serif;margin:0 0 20px;color:#1F2933!important}',
    '.po-jbs-rs ul{list-style:none;padding:0;margin:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:14px 32px}',
    '.po-jbs-rs li{position:relative;padding:0 0 0 26px;font-size:16px;line-height:1.5;color:#1F2933!important}',
    '.po-jbs-rs li:before{content:"\\2713";position:absolute;left:0;top:0;color:#1F6B7E!important;font-weight:700}',
    'html[data-theme="dark"] .po-jbs-rs,html[data-theme="dark"] .po-jbs-rs h3,html[data-theme="dark"] .po-jbs-rs li{color:#f5ecd2!important;border-color:#b6d6c8}',
    'html[data-theme="dark"] .po-jbs-rs .kk,html[data-theme="dark"] .po-jbs-rs li:before{color:#b6d6c8!important}'
  ].join('');
  document.head.appendChild(s);
})();

/* Block B: kicker as page link (site-wide) — refactored 2026-05-06
   Replaces kicker-link-v1 + kicker-link-fix-v1. Kickers now become
   real <a href> anchors (SEO, screen-reader "link" announcement,
   right-click "open in new tab", middle/Cmd/Ctrl-click). Smooth
   in-page scroll preserved for same-path #hash destinations. */
(function(){
  if (document.querySelector('style[data-po="kicker-href-v1"]')) return;

  /* Map kicker text -> destination. Lowercased keys.
     "open roles" / "open role" point at /about/jobs#po-apply
     (the H2 set by footer block 08), incorporating the
     kicker-link-fix-v1 override into the source map. */
  var KICKER_LINKS = {
    'open roles': '/about/jobs#po-apply',
    'open role':  '/about/jobs#po-apply',
    'about pain ontario': '/about',
    'who we are': '/about',
    'our work': '/advocacy',
    'advocacy': '/advocacy',
    'in the news': '/news-updates',
    'news': '/news-updates',
    'resources': '/resources',
    'find a resource': '/resources',
    'support our work': '/support',
    'donate': '/support',
    'get in touch': '/contact',
    'contact us': '/contact',
    'by audience': '/by-audience'
  };

  /* CSS — selectors target .kicker / a.kicker / .po-kicker so the
     refactored <a class="kicker"> picks up identical styling. */
  var s = document.createElement('style');
  s.setAttribute('data-po', 'kicker-href-v1');
  s.textContent = [
    'html a.kicker,html a.po-kicker,html .kicker[data-po-link],html .po-kicker[data-po-link]{cursor:pointer!important;text-decoration:none!important;color:#1F6B7E!important;letter-spacing:.08em!important;text-transform:uppercase!important;font-weight:600!important;display:inline-flex!important;align-items:center!important;gap:.4rem!important;border-radius:6px!important;padding:.1rem .15rem!important;transition:color .15s ease, background .15s ease, transform .15s ease!important}',
    'html a.kicker:hover,html a.po-kicker:hover,html .kicker[data-po-link]:hover,html .po-kicker[data-po-link]:hover{color:#155a6c!important;background:rgba(31,107,126,0.06)!important;transform:translateX(2px)!important}',
    'html a.kicker:focus-visible,html a.po-kicker:focus-visible,html .kicker[data-po-link]:focus-visible,html .po-kicker[data-po-link]:focus-visible{outline:2px solid #1F6B7E!important;outline-offset:2px!important}',
    'html a.kicker::after,html a.po-kicker::after,html .kicker[data-po-link]::after,html .po-kicker[data-po-link]::after{content:" \\2192"!important;font-size:.85em!important;opacity:.6!important;transition:transform .15s ease, opacity .15s ease!important}',
    'html a.kicker:hover::after,html a.po-kicker:hover::after,html .kicker[data-po-link]:hover::after,html .po-kicker[data-po-link]:hover::after{opacity:1!important;transform:translateX(2px)!important}',
    'html[data-theme="dark"] a.kicker,html[data-theme="dark"] a.po-kicker,html[data-theme="dark"] .kicker[data-po-link],html[data-theme="dark"] .po-kicker[data-po-link]{color:#9bd6e8!important}',
    'html[data-theme="dark"] a.kicker:hover,html[data-theme="dark"] a.po-kicker:hover,html[data-theme="dark"] .kicker[data-po-link]:hover,html[data-theme="dark"] .po-kicker[data-po-link]:hover{color:#c5e7f1!important;background:rgba(155,214,232,0.08)!important}',
    '@media (prefers-reduced-motion: reduce){a.kicker,a.po-kicker,.kicker[data-po-link],.po-kicker[data-po-link],a.kicker::after,a.po-kicker::after,.kicker[data-po-link]::after,.po-kicker[data-po-link]::after{transition:none!important;transform:none!important}a.kicker:hover,a.po-kicker:hover,.kicker[data-po-link]:hover,.po-kicker[data-po-link]:hover{transform:none!important}a.kicker:hover::after,a.po-kicker:hover::after,.kicker[data-po-link]:hover::after,.po-kicker[data-po-link]:hover::after{transform:none!important}}'
  ].join('');
  document.head.appendChild(s);

  function curPath(){
    return (location.pathname || '/').replace(/\/+$/, '') || '/';
  }

  function resolveDest(node){
    var explicit = node.getAttribute('data-href') || node.getAttribute('data-link-to') || '';
    if (explicit) return explicit;
    var t = (node.textContent || '').replace(/\s+/g,' ').trim().toLowerCase();
    return KICKER_LINKS[t] || '';
  }

  /* Smooth-scroll handler shared between cases. Bound on the <a>
     itself so middle/Cmd/Ctrl-click still let the browser open
     the destination in a new tab. */
  function attachSmoothScroll(anchor, dest){
    if (anchor.dataset.poKickerHrefBound === '1') return;
    anchor.dataset.poKickerHrefBound = '1';
    anchor.addEventListener('click', function(e){
      if (e.defaultPrevented) return;
      if (e.button && e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

      var hashIdx = dest.indexOf('#');
      var destPath = hashIdx === -1 ? dest : dest.slice(0, hashIdx);
      var destHash = hashIdx === -1 ? '' : dest.slice(hashIdx);
      var samePath = curPath() === destPath.replace(/\/+$/, '');
      if (!samePath || !destHash) return;

      var target = document.querySelector(destHash);
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (history && history.replaceState) {
        history.replaceState(null, '', destHash);
      }
    });
  }

  function wrapKicker(k){
    if (k.dataset.poKickerHref === '1') return null;

    var dest = resolveDest(k);
    if (!dest) { k.dataset.poKickerHref = '1'; return null; }

    var hashIdx = dest.indexOf('#');
    var destPath = hashIdx === -1 ? dest : dest.slice(0, hashIdx);
    var destHash = hashIdx === -1 ? '' : dest.slice(hashIdx);
    var samePath = curPath() === destPath.replace(/\/+$/, '');
    /* Self-skip: already at destination AND no hash to scroll to */
    if (samePath && !destHash) {
      k.removeAttribute('data-po-link');
      k.removeAttribute('role');
      k.removeAttribute('tabindex');
      k.style.cursor = '';
      k.dataset.poKickerHref = '1';
      return null;
    }

    /* Already inside an <a>? Use the existing anchor. */
    var parentA = k.closest('a');
    if (parentA) {
      if (!parentA.getAttribute('href')) {
        parentA.setAttribute('href', dest);
      }
      attachSmoothScroll(parentA, dest);
      k.dataset.poKickerHref = '1';
      return parentA;
    }

    /* Build a real <a> carrying the kicker's classes/attrs/children. */
    var a = document.createElement('a');
    a.setAttribute('href', dest);

    var i, attrs = k.attributes;
    for (i = 0; i < attrs.length; i++) {
      var name = attrs[i].name;
      var value = attrs[i].value;
      if (name === 'href') continue;
      if (name === 'role') continue;     /* <a> is implicit */
      if (name === 'tabindex') continue; /* <a href> is focusable */
      a.setAttribute(name, value);
    }
    while (k.firstChild) {
      a.appendChild(k.firstChild);
    }
    a.dataset.poKickerHref = '1';

    if (k.parentNode) {
      k.parentNode.replaceChild(a, k);
    }
    attachSmoothScroll(a, dest);
    return a;
  }

  function sweep(){
    var nodes = document.querySelectorAll('.kicker, .po-kicker');
    Array.prototype.forEach.call(nodes, function(k){
      if (k.dataset.poKickerHref === '1') return;
      wrapKicker(k);
    });
  }

  sweep();
  [250, 800, 2000, 4000].forEach(function(t){ setTimeout(sweep, t); });

  if (window.MutationObserver) {
    var debounceTimer = null;
    var mo = new MutationObserver(function(){
      if (debounceTimer) return;
      debounceTimer = setTimeout(function(){
        debounceTimer = null;
        sweep();
      }, 150);
    });
    var target = document.querySelector('main') || document.body;
    mo.observe(target, { childList: true, subtree: true });
  }
})();

/* === Page-level migrations (from per-page Custom Code, 2026-05-05) === */

/* /advocacy: recent advocacy news-list cards */
(function(){
  if (location.pathname !== '/advocacy' && !/^\/advocacy\b/.test(location.pathname)) return;
  if (document.querySelector('style[data-po="advocacy-news-list"]')) return;
  var s = document.createElement('style');
  s.setAttribute('data-po', 'advocacy-news-list');
  s.textContent = `/* ===== Recent advocacy cards (mpp page only) ===== */

  /* Container: clean vertical stack of cards */
  .news-list {
    list-style: none !important;
    padding: 0 !important;
    margin: 24px 0 0 !important;
    display: grid !important;
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    gap: 20px !important;
  }
  @media (max-width: 720px) {
    .news-list {
      grid-template-columns: 1fr !important;
    }
  }

  .news-item {
    list-style: none !important;
    margin: 0 !important;
    padding: 0 !important;
    background: #FBFAF3 !important;
    border: 1px solid rgba(23, 87, 106, 0.16) !important;
    border-radius: 14px !important;
    overflow: hidden !important;
    transition: transform 220ms ease, border-color 220ms ease, box-shadow 220ms ease !important;
  }

  .news-item:hover {
    transform: translateY(-3px) !important;
    border-color: rgba(23, 87, 106, 0.40) !important;
    box-shadow: 0 14px 32px -22px rgba(23, 87, 106, 0.45) !important;
  }

  /* The whole li is a single link */
  .news-item > a {
    display: grid !important;
    grid-template-rows: auto 1fr auto !important;
    gap: 14px !important;
    padding: 24px 26px 22px !important;
    text-decoration: none !important;
    color: inherit !important;
    height: 100% !important;
  }

  /* Date eyebrow at top */
  .news-item .date {
    display: inline-block !important;
    font-family: "Inter Tight", sans-serif !important;
    font-size: 0.72rem !important;
    letter-spacing: 0.16em !important;
    text-transform: uppercase !important;
    color: rgba(23, 87, 106, 0.78) !important;
    font-weight: 600 !important;
  }

  /* Title block (the unstyled div between .date and the arrow) */
  .news-item > a > div {
    font-family: "Fraunces", serif !important;
    font-size: 1.4rem !important;
    line-height: 1.18 !important;
    letter-spacing: -0.01em !important;
    color: #17576A !important;
    font-weight: 500 !important;
    margin: 0 !important;
  }
  .news-item > a > div * {
    font-family: inherit !important;
    color: inherit !important;
  }

  /* Subtitle / kicker paragraph inside the title block */
  .news-item > a > div p,
  .news-item > a > div span {
    display: block !important;
    font-family: "Inter Tight", sans-serif !important;
    font-size: 0.95rem !important;
    line-height: 1.45 !important;
    color: rgba(23, 87, 106, 0.72) !important;
    font-weight: 400 !important;
    margin-top: 6px !important;
    letter-spacing: 0 !important;
    text-transform: none !important;
  }

  /* Arrow at bottom — anchored bottom-right of card */
  .news-item [aria-hidden="true"] {
    justify-self: end !important;
    align-self: end !important;
    width: 38px !important;
    height: 38px !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    border-radius: 50% !important;
    background: #17576A !important;
    color: #FBFAF3 !important;
    font-size: 1rem !important;
    line-height: 1 !important;
    transition: background-color 220ms ease, transform 220ms ease !important;
  }

  .news-item:hover [aria-hidden="true"] {
    background: #6FC2D7 !important;
    color: #17576A !important;
    transform: translateX(2px) !important;
  }`;
  document.head.appendChild(s);
})();

/* /contact: textarea + placeholder polish */
(function(){
  if (!/^\/contact\b/.test(location.pathname)) return;
  if (document.querySelector('style[data-po="contact-textarea-polish"]')) return;
  var s = document.createElement('style');
  s.setAttribute('data-po', 'contact-textarea-polish');
  s.textContent = `textarea{
resize:none;
}
  ::placeholder {
  	transition: all 350ms ease;
  }
  
  .your-input-class:focus::placeholder {
  	transform: translate(20px, 0);
    opacity: 0.0;
  }
  
  .your-textarea-class:focus::placeholder {
  	transform: translate(20px, 0);
    opacity: 0.0;
  }`;
  document.head.appendChild(s);
})();

/* /contact: wrap/form layout */
(function(){
  if (!/^\/contact\b/.test(location.pathname)) return;
  if (document.querySelector('style[data-po="contact-wrap-layout"]')) return;
  var s = document.createElement('style');
  s.setAttribute('data-po', 'contact-wrap-layout');
  s.textContent = `@media (min-width: 992px) {
  body[data-pocontact] .div-block-21.wrap,
  body[data-pocontact] .wrap:has(form[data-name="Contact"]) {
    max-width: 960px !important;
    width: auto !important;
    margin-left: auto !important;
    margin-right: auto !important;
  }
  body[data-pocontact] .w-form:has(form[data-name="Contact"]) {
    max-width: none;
  }
}
body[data-pocontact] form[data-name="Contact"] ~ .w-form-done,
body[data-pocontact] form[data-name="Contact"] ~ .w-form-fail {
  border-radius: 14px;
  padding: 1.25rem 1.4rem;
  margin-top: 1rem;
  line-height: 1.5;
}
body[data-pocontact] form[data-name="Contact"] ~ .w-form-done {
  background: rgba(120, 188, 156, 0.16);
  border: 1px solid rgba(120, 188, 156, 0.45);
  color: var(--brand-cream, #f5efe2);
}
body[data-pocontact] form[data-name="Contact"] ~ .w-form-fail {
  background: rgba(220, 120, 120, 0.16);
  border: 1px solid rgba(220, 120, 120, 0.45);
  color: var(--brand-cream, #f5efe2);
}
body[data-pocontact] #feedback,
body[data-pocontact] .po-feedback-section,
body[data-pocontact] .po-feedback-link {
  display: none !important;
}`;
  document.head.appendChild(s);
})();

/* /contact: data-pocontact body marker + page logic */
(function () {
  if (!/^\/contact\/?$/i.test(location.pathname)) return;
  document.body.setAttribute('data-pocontact', '');
  var DONE = "Thanks — message received. We will be in touch when we can. If it is urgent, please also email info@painontario.ca.";
  var FAIL = "That did not send. Please try again, or email us directly at info@painontario.ca.";
  var TOPIC_OPTIONS = [
    { v: "", l: "Select one…" },
    { v: "General question or inquiry", l: "General question or inquiry" },
    { v: "Accessibility issue", l: "Accessibility issue" },
    { v: "Feature suggestion", l: "Feature suggestion" },
    { v: "A resource we should add", l: "A resource we should add" },
    { v: "Media or partnership", l: "Media or partnership" },
    { v: "Volunteering or contributing", l: "Volunteering or contributing" },
    { v: "Something else", l: "Something else" }
  ];
  function setupTopic() {
    var sel = document.querySelector('#topic');
    if (!sel || sel.dataset.poInit) return;
    sel.dataset.poInit = '1';
    sel.setAttribute('name', 'Topic');
    sel.innerHTML = '';
    TOPIC_OPTIONS.forEach(function (o) {
      var opt = document.createElement('option');
      opt.value = o.v;
      opt.textContent = o.l;
      sel.appendChild(opt);
    });
  }
  function patchMessages() {
    var cf = document.querySelector('form[data-name=\"Contact\"]');
    if (!cf) return;
    var w = cf.closest('.w-form');
    if (!w) return;
    var d = w.querySelector('.w-form-done > div, .w-form-done');
    var f = w.querySelector('.w-form-fail > div, .w-form-fail');
    if (d && d.textContent.trim() !== DONE) d.textContent = DONE;
    if (f && f.textContent.trim() !== FAIL) f.textContent = FAIL;
  }
  function tick() {
    setupTopic();
    patchMessages();
  }
  tick();
  new MutationObserver(tick).observe(document.body, { childList: true, subtree: true });
})();

/* /resource-library/*: filter UI styling */
(function(){
  if (!/^\/resource-library\b/.test(location.pathname)) return;
  if (document.querySelector('style[data-po="resources-filter-ui"]')) return;
  var s = document.createElement('style');
  s.setAttribute('data-po', 'resources-filter-ui');
  s.textContent = `/* Hide the actual checkbox visually but keep accessible */
.chip > input,
.chip .w-checkbox-input,
.chip .w-form-formcheckbox,
.chip .w-checkbox {
  position: absolute !important;
  width: 1px !important;
  height: 1px !important;
  padding: 0 !important;
  margin: -1px !important;
  overflow: hidden !important;
  clip: rect(0, 0, 0, 0) !important;
  white-space: nowrap !important;
  border: 0 !important;
  pointer-events: none !important;
  opacity: 0 !important;
}

/* Hide Webflow's default form labels inside chips */
.chip .w-form-label,
.chip [id="resource-tag"] { display: none !important; }

/* Default chip — soft brand outline */
.chip {
  cursor: pointer;
  user-select: none;
  transition: background-color 160ms ease, color 160ms ease, border-color 160ms ease, transform 120ms ease;
}
.chip:hover { border-color: rgba(111, 194, 215, 0.8) !important; background: rgba(111, 194, 215, 0.10) !important; }
.chip:focus-within { outline: 2px solid #1F6B7E; outline-offset: 2px; }

/* Active checked chip — brand sky-midnight, cream text */
.chip:has(input:checked) {
  background: #17576A !important;
  color: #FFFCF7 !important;
  border-color: #17576A !important;
}
.chip:has(input:checked):hover { background: #0F4756 !important; border-color: #0F4756 !important; }

/* Active filters summary panel */
.active-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  margin: 14px 0 6px;
  font-family: "Inter Tight", sans-serif;
  font-size: 14px;
}
.active-pills:empty { display: none; }
.active-pills .label {
  font-weight: 600;
  color: #5B6E7F;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  font-size: 11px;
  margin-right: 4px;
}
.active-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(111, 194, 215, 0.18);
  color: #17576A;
  padding: 4px 10px 4px 12px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 500;
}
.active-pill button {
  appearance: none;
  border: 0;
  background: transparent;
  color: #17576A;
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  padding: 0 0 0 2px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  transition: background 140ms ease;
}
.active-pill button:hover,
.active-pill button:focus-visible {
  background: rgba(23, 87, 106, 0.18);
  outline: none;
}
.active-pills .clear-all {
  margin-left: auto;
  color: #8C5E37;
  text-decoration: underline;
  text-underline-offset: 3px;
  font-weight: 600;
  background: transparent;
  border: 0;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 13px;
}
.active-pills .clear-all:hover,
.active-pills .clear-all:focus-visible {
  color: #1F2933;
  outline: none;
}

/* Result count */
.res-count-line {
  font-family: "Inter Tight", sans-serif;
  font-size: 13px;
  color: #6B7280;
  margin: 6px 0 16px;
  letter-spacing: 0.02em;
}

/* Empty state */
#resources-empty {
  text-align: center;
  padding: 40px 20px;
  color: #5B6E7F;
}

/* Hide stale custom load-more */
#res-load-more { display: none !important; }

/* Hide Finsweet helper text inside cards */
.fs-hidden { display: none !important; }

/* Hide Webflow's built-in pagination if present */
.resources-grid .w-pagination-wrapper { display: none !important; }

/* Sort label + dropdown inline */
*:has(> label[for="res-sort"]):has(> #res-sort) {
  display: flex !important;
  align-items: center !important;
  gap: 12px !important;
  flex-wrap: wrap !important;
  margin: 16px 0 24px !important;
}
label[for="res-sort"] {
  display: inline-block !important;
  margin: 0 !important;
  font-family: "Inter Tight", sans-serif !important;
  font-size: 14px !important;
  font-weight: 600 !important;
  color: #1F2933 !important;
  flex-shrink: 0 !important;
}
#res-sort {
  display: inline-block !important;
  width: auto !important;
  min-width: 220px !important;
  max-width: 320px !important;
  margin: 0 !important;

  /* v8: brand-styled select chrome instead of native browser default */
  appearance: none !important;
  -webkit-appearance: none !important;
  -moz-appearance: none !important;
  background-color: #FBFAF3 !important;
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path fill='%2317576A' d='M6 8 0 0h12z'/></svg>") !important;
  background-repeat: no-repeat !important;
  background-position: right 14px center !important;
  background-size: 12px 8px !important;
  border: 1px solid rgba(23, 87, 106, 0.30) !important;
  border-radius: 10px !important;
  padding: 10px 38px 10px 14px !important;
  font-family: "Inter Tight", sans-serif !important;
  font-size: 14px !important;
  color: #17576A !important;
  cursor: pointer !important;
  transition: border-color 160ms ease, box-shadow 160ms ease !important;
}
#res-sort:hover {
  border-color: rgba(23, 87, 106, 0.55) !important;
}
#res-sort:focus,
#res-sort:focus-visible {
  outline: none !important;
  border-color: #17576A !important;
  box-shadow: 0 0 0 3px rgba(111, 194, 215, 0.30) !important;
}

/* ====================================================================
   v5 — Force 2-col grid on the INNER <ul class="w-dyn-items"> only.
   Real DOM:
     #resources-grid  (.w-dyn-list, outer wrapper)
       ├─ ul.w-dyn-items.collection-list   ← THIS becomes the grid
       │    └─ li.w-dyn-item
       │         └─ div.resource-card      ← contains everything
       └─ div.w-dyn-empty                  ← hidden when items exist
   ==================================================================== */

/* Outer wrapper stays a normal block (was incorrectly grid'd in v4) */
#resources-grid,
.resources-grid {
  display: block !important;
}

/* The actual list becomes the responsive grid */
#resources-grid .w-dyn-items,
.resources-grid .w-dyn-items {
  display: grid !important;
  grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  gap: 24px !important;
  align-items: stretch !important;
  margin: 0 !important;
  padding: 0 !important;
  list-style: none !important;
  width: 100% !important;
}
@media (max-width: 720px) {
  #resources-grid .w-dyn-items,
  .resources-grid .w-dyn-items {
    grid-template-columns: 1fr !important;
  }
}

/* Filter-hidden items: must beat the grid's display:block !important rule. */
#resources-grid .w-dyn-items > .w-dyn-item.po-filter-hidden,
.resources-grid .w-dyn-items > .w-dyn-item.po-filter-hidden,
.w-dyn-item.po-filter-hidden { display: none !important; }

/* Each .w-dyn-item collection item: v9 force display: block so the card
   fills width naturally. Webflow's default flex-row was causing gap math
   that left the card narrower than its slot. */
#resources-grid .w-dyn-items > .w-dyn-item,
.resources-grid .w-dyn-items > .w-dyn-item {
  display: block !important;
  width: 100% !important;
  min-width: 0 !important;
  height: auto !important;
  align-self: stretch !important;
  margin: 0 !important;
  padding: 0 !important;
  gap: 0 !important;
  list-style: none !important;
}

/* .resource-card is the actual card chrome — fills its wrapper, equal-height.
   v9: max-width: none added (Designer had set 500px, which capped width).
   v9: removed gap from card flex; using explicit margins on children for
       cleaner control over the badge spacing. */
.resources-grid .resource-card,
#resources-grid .resource-card {
  display: flex !important;
  flex-direction: column !important;
  width: 100% !important;
  max-width: none !important;
  height: auto !important;
  min-height: 100% !important;
  max-height: none !important;
  min-width: 0 !important;
  box-sizing: border-box !important;
  background: #FBFAF3 !important;
  border: 1px solid rgba(23, 87, 106, 0.16) !important;
  border-radius: 14px !important;
  padding: 24px 26px 22px !important;
  gap: 12px !important;
  transition: border-color 220ms ease, box-shadow 220ms ease, transform 220ms ease !important;
}

.resources-grid .resource-card:hover,
#resources-grid .resource-card:hover {
  border-color: rgba(23, 87, 106, 0.40) !important;
  box-shadow: 0 14px 32px -22px rgba(23, 87, 106, 0.45) !important;
  transform: translateY(-2px) !important;
}

/* Defensive: clear any inner-block chrome that Designer may have applied
   (so we don't end up with a card-inside-a-card visual) */
.resources-grid .resource-card .card-summary,
.resources-grid .resource-card .card-summary > * {
  background: transparent !important;
  border: 0 !important;
  padding: 0 !important;
}

/* v9: drop the margin-top: auto trick that was pushing the badge BELOW
   the card edge in non-fixed-height columns. Use only the card flex gap
   (12px) plus a small extra margin on .card-badges for visual breathing
   room between the link and the format chip. Equal-height across rows
   still works via grid align-items: stretch + card height: 100%. */
.resources-grid .resource-card .card-link {
  margin-top: 4px !important;
}
.resources-grid .resource-card .card-badges {
  margin-top: 4px !important;
}

/* Webflow's empty-state block must not occupy width when present */
#resources-grid .w-dyn-empty,
.resources-grid .w-dyn-empty {
  grid-column: 1 / -1;
  width: 100% !important;
}

/* ====================================================================
   v7 — Force #resources-results-wrap to full content width.
   The Designer restructure left the grid + sort + pills in a sibling
   .wrap inside #resources-controls. That parent appears to constrain
   children to half-width via inherited flex/grid. Reset and span.
   ==================================================================== */

#resources-controls {
  display: block !important;
}
#resources-controls > .wrap {
  display: block !important;
  width: 100% !important;
  max-width: 1320px !important;
  margin-left: auto !important;
  margin-right: auto !important;
  padding-inline: clamp(20px, 4vw, 40px) !important;
  box-sizing: border-box !important;
}

#resources-results-wrap {
  display: block !important;
  width: 100% !important;
  max-width: 1320px !important;
  margin: 24px auto 0 !important;
  padding: 0 clamp(20px, 4vw, 40px) !important;
  grid-column: 1 / -1 !important;
  box-sizing: border-box !important;
}

/* Hide the redundant hardcoded "Active filters: Clear all" UI block —
   the v5 JS already renders an active-pills row with its own clear-all
   link inside #resources-results-wrap > .active-pills. */
[data-legacy-pills="true"] {
  display: none !important;
}`;
  document.head.appendChild(s);
})();

/* /resource-library/*: filter labels + chip wiring + counts */
(function () {
  'use strict';

  var LABELS = {
    audience: { 'lived-living-experience': 'Person with lived experience', 'caregiver': 'Caregiver', 'parent': 'Parent', 'healthcare': 'Healthcare provider', 'policymaker': 'Policymaker', 'changemaker': 'Changemaker' },
    format: { 'virtual-platform': 'Virtual Platform', 'virtual-course': 'Virtual Course', 'clinic-service': 'Clinic / Service', 'standard-guideline': 'Standard / Guideline', 'support-group': 'Support group', 'helpline': 'Helpline', 'pdf': 'PDF', 'organization': 'Organization', 'articles': 'Articles', 'video': 'Video', 'podcast': 'Podcast', 'mobile-app': 'Mobile App', 'report': 'Report' },
    age: { 'all-ages': 'All ages', 'infants': 'Infants (0–2)', 'children': 'Children (3–12)', 'adolescents': 'Adolescents (13–17)', 'young-adults': 'Young adults (18–25)', 'adults': 'Adults (26–64)', 'older-adults': 'Older adults (65+)' },
    region: { 'ontario-wide': 'Ontario-wide', 'national': 'National', 'toronto-gta': 'Toronto / GTA', 'hamilton': 'Hamilton', 'ottawa': 'Ottawa', 'london-sw': 'London / SW ON', 'kingston-se': 'Kingston / SE ON', 'thunder-bay-nw': 'Thunder Bay / NW ON', 'sudbury-ne': 'Sudbury / NE ON' }
  };

  function pretty(group, value) {
    return (LABELS[group] && LABELS[group][value]) || value.replace(/-/g, ' ').replace(/\b\w/g, function (c) { return c.toUpperCase(); });
  }

  function init() {
    var grid = document.getElementById('resources-grid');
    if (!grid) return;

    var search = document.getElementById('res-search');
    var clearBtn = document.getElementById('res-clear');
    var count = document.getElementById('res-count');
    var empty = document.getElementById('resources-empty');
    var sort = document.getElementById('res-sort');
    var pillsHost = document.querySelector('.active-pills') || document.getElementById('active-pills');

    var state = {
      audience: new Set(), format: new Set(), age: new Set(), region: new Set(),
      search: '', sort: 'name-asc'
    };

    function getCards() {
      return Array.prototype.slice.call(grid.querySelectorAll('.resource-card'));
    }
    function wrapperOf(card) { return card.closest('.w-dyn-item') || card; }

    function fieldText(card, fieldName) {
      var el = card.querySelector('[fs-cmsfilter-field="' + fieldName + '"]');
      if (el) return (el.textContent || '').trim().toLowerCase();
      var attr = card.getAttribute('data-' + fieldName);
      return (attr || '').trim().toLowerCase();
    }

    function matchGroup(text, set) {
      if (!set || set.size === 0) return true;
      var hit = false;
      set.forEach(function (v) { if (text.indexOf(v.toLowerCase()) !== -1) hit = true; });
      return hit;
    }

    function sortKey(card) {
      switch (state.sort) {
        case 'recent':
          return card.getAttribute('data-added') || card.getAttribute('data-recent') || '';
        case 'source':
          return fieldText(card, 'source') || (card.querySelector('.source-org, [data-source-organization]') ? (card.querySelector('.source-org, [data-source-organization]').textContent || '').trim().toLowerCase() : '');
        case 'name-asc':
        default:
          return fieldText(card, 'name') || (card.querySelector('h3') ? (card.querySelector('h3').textContent || '').trim().toLowerCase() : '');
      }
    }

    function applySort() {
      var cards = getCards();
      cards.sort(function (a, b) {
        var ka = sortKey(a), kb = sortKey(b);
        if (state.sort === 'recent') return kb.localeCompare(ka);
        if (state.sort === 'name-desc') return kb.localeCompare(ka);
        return ka.localeCompare(kb);
      });
      /* v15: physically reorder DOM (appendChild moves existing nodes).
         The CSS `order` property approach in v14 didn't visibly reorder
         items in the grid container — DOM reorder is bulletproof. */
      var listContainer = cards[0] && wrapperOf(cards[0]).parentNode;
      if (listContainer) {
        cards.forEach(function (c) { listContainer.appendChild(wrapperOf(c)); });
      }
    }

    function renderActivePills() {
      if (!pillsHost) return;
      var hasAny = state.search || ['audience','format','age','region'].some(function (k) { return state[k].size > 0; });
      pillsHost.innerHTML = '';
      if (!hasAny) return;

      var label = document.createElement('span');
      label.className = 'label';
      label.textContent = 'Active filters';
      pillsHost.appendChild(label);

      function pill(group, value, displayText) {
        var p = document.createElement('span');
        p.className = 'active-pill';
        p.textContent = displayText;
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.setAttribute('aria-label', 'Remove filter ' + displayText);
        btn.textContent = '×';
        btn.addEventListener('click', function () {
          if (group === 'search') {
            if (search) search.value = '';
            state.search = '';
          } else if (state[group]) {
            state[group].delete(value);
            var cb = document.querySelector('.chip input[type="checkbox"][name="' + group + '"][value="' + value + '"]');
            if (cb) cb.checked = false;
          }
          applyFilters();
        });
        p.appendChild(btn);
        pillsHost.appendChild(p);
      }

      ['audience','format','age','region'].forEach(function (group) {
        state[group].forEach(function (val) { pill(group, val, pretty(group, val)); });
      });
      if (state.search) pill('search', '', 'Search: ' + state.search);

      var clr = document.createElement('button');
      clr.type = 'button';
      clr.className = 'clear-all';
      clr.textContent = 'Clear all';
      clr.addEventListener('click', function () { resetAll(); });
      pillsHost.appendChild(clr);
    }

    function resetAll() {
      document.querySelectorAll('.chip input[type="checkbox"]').forEach(function (cb) { cb.checked = false; });
      if (search) search.value = '';
      ['audience','format','age','region'].forEach(function (k) { state[k].clear(); });
      state.search = '';
      applyFilters();
    }

    function applyFilters() {
      var cards = getCards();
      var visible = 0;
      cards.forEach(function (card) {
        var ok = true;
        if (ok && !matchGroup(fieldText(card, 'audience'), state.audience)) ok = false;
        if (ok && !matchGroup(fieldText(card, 'format'),   state.format))   ok = false;
        if (ok && !matchGroup(fieldText(card, 'age'),      state.age))      ok = false;
        if (ok && !matchGroup(fieldText(card, 'region'),   state.region))   ok = false;
        if (ok && state.search) {
          var hay = fieldText(card, 'name') + ' ' + fieldText(card, 'source');
          if (hay.indexOf(state.search) === -1) ok = false;
        }
        wrapperOf(card).style.display = ok ? '' : 'none';
        if (ok) visible++;
      });
      if (count) count.textContent = String(visible);
      if (empty) empty.style.display = (visible === 0) ? '' : 'none';
      renderActivePills();
      applySort();
    }

    function bindChips() {
      document.querySelectorAll('.chip').forEach(function (chip) {
        if (chip._poChipBound) return;
        chip._poChipBound = true;
        chip.addEventListener('click', function (e) {
          var input = chip.querySelector('input[type="checkbox"]');
          if (!input) return;
          if (e.target === input) return;
          e.preventDefault();
          input.checked = !input.checked;
          input.dispatchEvent(new Event('change', { bubbles: true }));
        });
      });
      document.querySelectorAll('.chip input[type="checkbox"]').forEach(function (cb) {
        if (cb._poBound) return;
        cb._poBound = true;
        cb.addEventListener('change', function () {
          var group = cb.name, val = cb.value;
          if (!state[group]) return;
          if (cb.checked) state[group].add(val);
          else state[group].delete(val);
          applyFilters();
        });
      });
    }

    bindChips();

    if (search) {
      var t;
      search.addEventListener('input', function () {
        clearTimeout(t);
        t = setTimeout(function () {
          state.search = search.value.trim().toLowerCase();
          applyFilters();
        }, 120);
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', function (e) {
        e.preventDefault();
        resetAll();
      });
    }

    if (sort) {
      sort.addEventListener('change', function () {
        state.sort = sort.value || 'name-asc';
        applySort();
      });
    }

    applyFilters();

    /* v12: re-bind chips and re-apply filters after Finsweet cmsload
       finishes fetching pages 2+ into the DOM. Without this hook, items
       past page 1 (101+) would be in the DOM but invisible to our JS. */
    window.fsAttributes = window.fsAttributes || [];
    window.fsAttributes.push(['cmsload', function () {
      bindChips();
      applyFilters();
    }]);
  }

  if (document.readyState !== 'loading') init();
  else document.addEventListener('DOMContentLoaded', init);
})();


/* === Theme gap-fill v1 (2026-05-05) — fix in-between mode glitches.
   Overrides selectors that lose the cascade to `!important` shorthand,
   redefines cream-tinted custom props inside dark theme so any
   var(--white)/var(--bg-mist)/var(--bg-base) flip automatically. === */
!function(){
  if (document.querySelector('style[data-po="themegapfillv1"]')) return;
  var css = [
    /* Dark nav mirrors light-mode character: subtle cream/mint confetti dots, sky-brand 2px accent stripe, soft drop shadow */
    'html[data-theme="dark"] .w-nav,html[data-theme="dark"] nav.w-nav{background-color:var(--po-bg2)!important;background-image:radial-gradient(circle,rgba(245,236,210,0.05) 1.4px,transparent 1.7px),radial-gradient(circle,rgba(182,214,200,0.06) 1.2px,transparent 1.5px),radial-gradient(circle,rgba(111,194,215,0.05) 1px,transparent 1.3px)!important;background-size:64px 64px,84px 84px,52px 52px!important;background-position:0 0,32px 32px,12px 18px!important;background-repeat:repeat!important;border:0!important;border-bottom:2px solid #6FC2D7!important;box-shadow:0 2px 14px rgba(0,0,0,.35)!important}',
    '@media screen and (max-width:479px){html[data-theme="dark"] .w-nav,html[data-theme="dark"] nav.w-nav{background-color:var(--po-bg2)!important;background-size:48px 48px,64px 64px,40px 40px!important}}',
    'html[data-theme="dark"] .w-nav .w-dropdown-list,html[data-theme="dark"] .w-nav .w-dropdown-list.w--open,html[data-theme="dark"] .w-nav .w-dropdown[aria-expanded="true"] .w-dropdown-list,html[data-theme="dark"] .w-nav .w-dropdown:hover .w-dropdown-list,html[data-theme="dark"] .w-nav .w-dropdown:focus-within .w-dropdown-list{background:var(--po-bg2)!important;border:1px solid var(--po-border)!important;color:var(--po-fg)!important}',
    'html[data-theme="dark"] .w-nav .w-dropdown-list a,html[data-theme="dark"] .w-nav .w-dropdown-list .w-dropdown-link{color:var(--po-fg)!important}',
    'html[data-theme="dark"] .w-nav .w-dropdown-list a:hover{background-color:var(--po-bg3)!important;color:var(--po-link)!important}',
    'html[data-theme="dark"] .signpost.crisis-card{background:var(--po-bg3)!important;border:1px solid var(--po-warn)!important;border-top:4px solid var(--po-warn)!important}',
    'html[data-theme="dark"] footer .crisis-line,html[data-theme="dark"] .footer .crisis-line{background:var(--po-bg3)!important;border:1px solid var(--po-border)!important;border-left:4px solid var(--po-warn)!important;color:var(--po-fg)!important}',
    'html[data-theme="dark"] .news-item,html[data-theme="dark"] li.news-item{background:var(--po-bg2)!important;border:1px solid var(--po-border)!important}',
    'html[data-theme="dark"] .white-bg{background-color:var(--po-bg2)!important}',
    'html[data-theme="dark"] .white{color:var(--po-fg)!important}',
    'html[data-theme="dark"] .blue-section{background-color:var(--po-bg3)!important;color:var(--po-fg)!important}',
    'html[data-theme="dark"] .black-section{background-color:#080c14!important;color:var(--po-fg)!important}',
    'html[data-theme="dark"] ::-webkit-scrollbar-thumb{background-color:var(--po-bg3)!important;border-radius:8px}',
    'html[data-theme="dark"] ::-webkit-scrollbar-track{background-color:var(--po-bg)!important}',
    'html[data-theme="dark"] .button.secondary .button__icon-block{border-color:var(--po-fg)!important}',
    'html[data-theme="dark"] .button.secondary:hover .button__icon-block{background-color:var(--po-fg)!important;color:var(--po-bg)!important}',
    'html[data-theme="dark"] .button:hover .button__icon-block{background-color:var(--po-accent)!important;color:var(--po-bg)!important}',
    'html[data-theme="dark"] a.btn-primary,html[data-theme="dark"] .btn-primary{background:var(--po-accent)!important;color:#0e1320!important;border-color:var(--po-accent)!important}',
    'html[data-theme="dark"] a.btn-primary:hover,html[data-theme="dark"] a.btn-primary:focus-visible,html[data-theme="dark"] .btn-primary:hover,html[data-theme="dark"] .btn-primary:focus-visible{background:#c8e3d5!important;border-color:#c8e3d5!important;color:#0e1320!important}',
    'html[data-theme="dark"] .btn-primary *{color:#0e1320!important}',
    'html[data-theme="dark"] .signpost .tag,html[data-theme="dark"] .signpost p.small{background:var(--po-bg3)!important;color:var(--po-fg)!important;border:1px solid var(--po-border)!important}',
    'html[data-theme="dark"] .signpost.crisis-card .tag{background:var(--po-warn)!important;color:#0e1320!important;border-color:var(--po-warn)!important}',
    'html[data-theme="dark"] .signpost ul li a{color:var(--po-link)!important}',
    'html[data-theme="dark"] .signpost.crisis-card ul li a{color:var(--po-warn)!important;text-decoration:underline}',
    'html[data-theme="dark"] .signpost p,html[data-theme="dark"] .signpost p.small{color:var(--po-fg-muted)!important}',
    'html[data-theme="dark"] body[data-pocontact] form[data-name="Contact"] ~ .w-form-done{background:rgba(120,188,156,0.10)!important;border:1px solid rgba(120,188,156,0.35)!important;color:var(--po-fg)!important}',
    'html[data-theme="dark"] body[data-pocontact] form[data-name="Contact"] ~ .w-form-fail{background:rgba(220,120,120,0.10)!important;border:1px solid rgba(220,120,120,0.35)!important;color:var(--po-warn)!important}',
    'html[data-theme="dark"]{--white:var(--po-bg2)!important;--bg-mist:var(--po-bg3)!important;--bg-base:var(--po-bg)!important;--bg-soft:var(--po-bg2)!important;--hero-top:var(--po-bg)!important;--hero-bot:var(--po-bg2)!important;--line:var(--po-border)!important}'
  ].join('');
  var s = document.createElement('style');
  s.setAttribute('data-po','themegapfillv1');
  s.textContent = css;
  document.head.appendChild(s);
}();


/* ============================================================
   AUDIT-DRIVEN PATCHES BUNDLE (2026-05-05 v1)
   Consolidated from 4 audit subagents:
   - patch_jobs_home_v1   (kicker, equity v2 watcher, ED banner suppress, card-eyebrow, font check)
   - patch_advocacy_byaudience_v1 (breadcrumb, dark gaps, full layout, URLSearchParams reader)
   - patch_resources_contact_v1 (DOM stubs, fieldset, Enter handler, label binding, GET→POST, dropdown polish, dark form widgets, restored feedback link)
   - patch_portal_v1 (a11y, leak prevention, Forms tile activator)
   ============================================================ */
/* ============================================================
   patch_jobs_home_v1.js
   2026-05-05 — appends to site.js after kicker-link-v1, jobsequity v2,
   po-ed-banner, and homenewsfixfinal blocks.
   Each IIFE is path-gated and idempotent (data-po marker + early return).
   Plain ES2015 only (no optional chaining, nullish coalescing, async/await).
   ============================================================ */

/* ------------------------------------------------------------
   Block 1 — kicker "Open roles" override
   ------------------------------------------------------------
   REMOVED 2026-05-06. The "open roles" → /about/jobs#po-apply
   override and same-path smooth-scroll behaviour now live in the
   refactored kicker-href-v1 block above (Block B). That block
   produces real <a href> anchors in the source map directly, so
   no later override is needed.
   ------------------------------------------------------------ */

/* ------------------------------------------------------------
   Block 2 — equity-band v2 dataset guard (/about/jobs only)
   ------------------------------------------------------------
   The legacy footer-block-08 build script (still loaded in v3
   ADDONS bundle / live_extract/role_card_script_21.js) re-fires
   injectEq at 300/800/1500/3000 ms with the OLD copy ("Whose
   voices we want at the table"). jobsequityandpillrestylev2
   stamps dataset.v='2' and the new copy ("Who we want to hear
   from") at 200/500/1000/2000/4000 ms — but block 08 has no
   dataset.v guard, so it clobbers v2 between v2's ticks.
   Fix: run our own watcher on the same cadence as block 08,
   re-applying v2 HTML and stamping dataset.v='2' whenever we
   find an .po-jbs-eq node lacking the v=2 marker.
   ------------------------------------------------------------ */
(function () {
  if (!/^\/about\/jobs(\/|$)/i.test(location.pathname)) return;
  if (document.querySelector('style[data-po="jobs-eq-v2-watcher"]')) return;
  var marker = document.createElement('style');
  marker.setAttribute('data-po', 'jobs-eq-v2-watcher');
  marker.textContent = '/* jobs-eq-v2-watcher active */';
  document.head.appendChild(marker);

  var V2_HTML =
    '<h3>Who we want to hear from</h3>' +
    '<p>We\'re especially looking for applications from people with lived and living experience of chronic pain, Indigenous Peoples, Black and other racialized candidates, 2SLGBTQ+ candidates, Disabled candidates, and people from working-class and rural communities.</p>' +
    '<p>If you need an accommodation at any stage, write to <a href="mailto:info@painontario.ca">info@painontario.ca</a> and we\'ll arrange it. You don\'t need to disclose a reason.</p>';

  function enforce() {
    var eq = document.querySelector('.po-jbs-eq');
    if (!eq) return false;
    if (eq.dataset.v === '2') return false;
    eq.innerHTML = V2_HTML;
    eq.dataset.v = '2';
    return true;
  }

  enforce();
  /* Tick alongside the legacy block-08 timers + a couple after
     to cover any delayed mutations. */
  [150, 350, 600, 900, 1100, 1700, 2200, 3100, 3500, 5000, 7500].forEach(function (ms) {
    setTimeout(enforce, ms);
  });

  /* Belt-and-braces: observe .po-jbs-eq for content swaps. */
  if (window.MutationObserver) {
    var debounce = null;
    var mo = new MutationObserver(function () {
      if (debounce) return;
      debounce = setTimeout(function () { debounce = null; enforce(); }, 60);
    });
    /* Wait for the node to exist, then attach. */
    var tries = 0;
    var iv = setInterval(function () {
      var eq = document.querySelector('.po-jbs-eq');
      if (eq) {
        mo.observe(eq, { childList: true, subtree: true, characterData: true });
        clearInterval(iv);
      } else if (++tries > 60) {
        clearInterval(iv);
      }
    }, 150);
  }
})();

/* ------------------------------------------------------------
   Block 3 — suppress ED hiring banner on /about/jobs
   ------------------------------------------------------------
   site.js v21 builds .po-ed-banner site-wide ("We're hiring our
   founding Executive Director · apply by May 22 →"). On the
   jobs page itself this duplicates the role card and pushes the
   nav down. Hide-and-remove any .po-ed-banner that lands on
   /about/jobs. Also persist the dismissal so the v21 mount()
   guard short-circuits on subsequent renders within this tab.
   ------------------------------------------------------------ */
(function () {
  if (!/^\/about\/jobs(\/|$)/i.test(location.pathname)) return;
  if (document.querySelector('style[data-po="jobs-ed-banner-suppress"]')) return;

  /* CSS belt: hide instantly if it paints before our JS runs. */
  var s = document.createElement('style');
  s.setAttribute('data-po', 'jobs-ed-banner-suppress');
  s.textContent = '.po-ed-banner{display:none!important}.po-ed-banner ~ .navbar,.po-ed-banner ~ * .navbar{top:0!important}';
  document.head.appendChild(s);

  function strip() {
    var nodes = document.querySelectorAll('.po-ed-banner');
    Array.prototype.forEach.call(nodes, function (n) {
      if (n && n.parentNode) n.parentNode.removeChild(n);
    });
  }
  strip();
  [50, 200, 500, 1500, 3000].forEach(function (ms) { setTimeout(strip, ms); });

  if (window.MutationObserver) {
    var t = null;
    var mo = new MutationObserver(function () {
      if (t) return;
      t = setTimeout(function () { t = null; strip(); }, 80);
    });
    mo.observe(document.body, { childList: true, subtree: false });
  }
})();

/* ------------------------------------------------------------
   Block 4 — homepage .card-eyebrow date styling
   ------------------------------------------------------------
   News CMS cards render <div class="card-eyebrow">May 5, 2026</div>
   but the inline CSS at site.js block 5 only targets
   .news-item a > .date. Mirror that .date style onto
   .card-eyebrow (matching values: 0.72rem Inter Tight, 0.16em
   letter-spacing, uppercase, weight 600, sky-midnight 78% alpha)
   plus a dark-mode tweak so it stays legible on #171d2c.
   ------------------------------------------------------------ */
(function () {
  if (!(location.pathname === '/' || /^\/index\b/i.test(location.pathname))) return;
  if (document.querySelector('style[data-po="card-eyebrow-fix-v1"]')) return;
  var s = document.createElement('style');
  s.setAttribute('data-po', 'card-eyebrow-fix-v1');
  s.textContent = [
    'html body section .news-item .card-eyebrow,',
    'html body section .news-item a .card-eyebrow,',
    'html body section .news-item a > .card-eyebrow{',
    'display:inline-block!important;',
    'font-family:"Inter Tight",sans-serif!important;',
    'font-size:0.72rem!important;',
    'letter-spacing:0.16em!important;',
    'text-transform:uppercase!important;',
    'color:rgba(23,87,106,0.78)!important;',
    'font-weight:600!important;',
    'margin:0 0 4px!important;',
    'opacity:1!important',
    '}',
    'html[data-theme="dark"] body section .news-item .card-eyebrow,',
    'html[data-theme="dark"] body section .news-item a .card-eyebrow{',
    'color:#cdc4ad!important',
    '}'
  ].join('');
  document.head.appendChild(s);
})();

/* ------------------------------------------------------------
   Block 5 — homepage Fraunces + Inter Tight font load (no-op
   guard if either family already resolves in computed style)
   ------------------------------------------------------------
   Audit flagged that WebFont.load only fetches Open Sans +
   Montserrat, with no Google Fonts <link> for the brand stack.
   Many builds DO render Fraunces/Inter Tight via inline
   @font-face in the head CSS, so we only inject the Google
   Fonts stylesheet when document.fonts.check() reports neither
   family is available. Idempotent + path-gated to /.
   ------------------------------------------------------------ */
(function () {
  if (!(location.pathname === '/' || /^\/index\b/i.test(location.pathname))) return;
  if (document.querySelector('link[data-po="brand-fonts-v1"]')) return;
  if (document.querySelector('style[data-po="brand-fonts-v1-checked"]')) return;

  function hasFamily(family) {
    try {
      if (document.fonts && typeof document.fonts.check === 'function') {
        return document.fonts.check('1rem "' + family + '"');
      }
    } catch (e) {}
    return false;
  }

  function ensure() {
    var hasFraunces = hasFamily('Fraunces');
    var hasInterTight = hasFamily('Inter Tight');

    /* Mark that we've evaluated, regardless of action taken. */
    var sentinel = document.createElement('style');
    sentinel.setAttribute('data-po', 'brand-fonts-v1-checked');
    sentinel.textContent = '/* brand-fonts-v1 evaluated: fraunces=' + hasFraunces + ' interTight=' + hasInterTight + ' */';
    document.head.appendChild(sentinel);

    if (hasFraunces && hasInterTight) return;

    /* Preconnect for faster handshake. */
    var pc1 = document.createElement('link');
    pc1.rel = 'preconnect';
    pc1.href = 'https://fonts.googleapis.com';
    document.head.appendChild(pc1);

    var pc2 = document.createElement('link');
    pc2.rel = 'preconnect';
    pc2.href = 'https://fonts.gstatic.com';
    pc2.crossOrigin = 'anonymous';
    document.head.appendChild(pc2);

    var link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:wght@400;500;600&family=Inter+Tight:wght@400;500;600&display=swap';
    link.setAttribute('data-po', 'brand-fonts-v1');
    document.head.appendChild(link);
  }

  /* document.fonts may not be ready immediately; wait for fonts.ready
     when supported, fall back to a short timer. */
  if (document.fonts && document.fonts.ready && typeof document.fonts.ready.then === 'function') {
    document.fonts.ready.then(ensure, ensure);
  } else {
    setTimeout(ensure, 250);
  }
})();

/* ============================================================
   patch_advocacy_byaudience_v1.js — 2026-05-05
   Append to /tmp/painontario-dashboard-clone/site.js, then bump
   version.json SHA. Self-contained, idempotent, ES2015 max,
   path-gated, no jQuery. Each block guards via data-po marker
   so duplicate appends are no-ops.

   Audits this patch closes:
     - audit_advocacy_v1_2026-05-05.md   items 3, theme rows 6+7
     - audit_byaudience_v1_2026-05-05.md items B1, B2

   NOT covered here (handed back to Vina in Designer):
     - Advocacy items 1, 2, 4, 5, 6, 7 (script-cleanup + markup)
     - by-audience B3 (add Parent + Changemaker cards), B4, B5,
       B6, B8 (markup + copy)
   ============================================================ */


/* ------------------------------------------------------------
   Block 1 — /advocacy*: inject .crumb host if page is missing
   one, then let the existing breadcrumb logic populate it.
   Scoped to /advocacy and any sub-route (mpp, briefings, etc.)
   ------------------------------------------------------------ */
(function () {
  if (!/^\/advocacy(\/|$)/.test(location.pathname)) return;
  if (document.documentElement.getAttribute('data-po-advocacy-crumb') === '1') return;

  function inject() {
    if (document.querySelector('.crumb')) {
      document.documentElement.setAttribute('data-po-advocacy-crumb', '1');
      return true;
    }
    var hero = document.querySelector('.page-hero .wrap')
            || document.querySelector('.page-hero');
    if (!hero) return false;
    var nav = document.createElement('nav');
    nav.className = 'crumb';
    nav.setAttribute('aria-label', 'Breadcrumb');
    nav.setAttribute('data-po', 'advocacy-crumb-host');
    nav.innerHTML = '<a href="/">Home</a> › Advocacy';
    hero.insertBefore(nav, hero.firstChild);
    document.documentElement.setAttribute('data-po-advocacy-crumb', '1');
    return true;
  }

  function run() {
    if (inject()) return;
    [120, 400, 1200].forEach(function (t) { setTimeout(inject, t); });
  }

  if (document.readyState !== 'loading') run();
  else document.addEventListener('DOMContentLoaded', run);
})();


/* ------------------------------------------------------------
   Block 2 — /advocacy*: dark-mode coverage gaps.
   .news-item .date stays low-contrast on #171d2c.
   .news-item [aria-hidden] arrow keeps brand-dark on dark bg.
   ------------------------------------------------------------ */
(function () {
  if (!/^\/advocacy(\/|$)/.test(location.pathname)) return;
  if (document.querySelector('style[data-po="advocacy-dark-gaps-v1"]')) return;
  var s = document.createElement('style');
  s.setAttribute('data-po', 'advocacy-dark-gaps-v1');
  s.textContent = [
    'html[data-theme="dark"] .news-item .date{color:#c8e3d5!important}',
    'html[data-theme="dark"] .news-item [aria-hidden="true"]{color:#c8e3d5!important;opacity:.85}'
  ].join('');
  document.head.appendChild(s);
})();


/* ------------------------------------------------------------
   Block 3 — /by-audience: full layout CSS for the grid + cards.
   Brand-consistent (cream light / .po-bg2 dark, Fraunces + Inter
   Tight, brand accent focus ring, hover-lift with reduced-motion
   opt-out). Only 4 of 6 audience cards are surfaced today (Parent
   + Changemaker still missing) — that's a Webflow Designer task
   for Vina, not a CSS one.
   ------------------------------------------------------------ */
(function () {
  if (!/^\/by-audience(\/|$)/.test(location.pathname)) return;
  if (document.querySelector('style[data-po="by-audience-layout-v1"]')) return;
  var s = document.createElement('style');
  s.setAttribute('data-po', 'by-audience-layout-v1');
  s.textContent = [
    /* page wrap */
    '.by-audience-main{max-width:1180px;margin:0 auto;padding:0 28px}',
    '.by-audience-hero{padding:64px 0 24px}',
    '.by-audience-hero h1{font-family:"Fraunces",Georgia,serif;font-size:clamp(2.4rem,6vw,4.4rem);margin:0 0 .3em;color:var(--po-ink,#1F2933)}',
    '.by-audience-hero .lede{font-family:"Inter Tight",system-ui,sans-serif;font-size:1.1rem;color:var(--po-slate,#5B6E7F);max-width:60ch;margin:0 0 24px}',
    /* grid: 4 / 2 / 1 */
    '.by-audience-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.4rem;max-width:1180px;margin:2.4rem auto;padding:0}',
    '@media (max-width:991px){.by-audience-grid{grid-template-columns:repeat(2,1fr)}}',
    '@media (max-width:639px){.by-audience-grid{grid-template-columns:1fr}}',
    /* card — light */
    '.audience-card{display:block;background:#FBFAF3;border:1px solid rgba(20,40,60,.08);border-top:4px solid var(--po-accent,#1F6B7E);border-radius:18px;padding:1.2rem;text-decoration:none;color:var(--po-ink,#1F2933);box-shadow:0 2px 8px rgba(20,40,60,.06);transition:transform .18s ease,box-shadow .18s ease,border-color .18s ease}',
    '.audience-card:nth-child(2){border-top-color:#1F6B1D}',
    '.audience-card:nth-child(3){border-top-color:#8C5E37}',
    '.audience-card:nth-child(4){border-top-color:#0F3B5C}',
    '.audience-card:hover{transform:translateY(-3px);box-shadow:0 8px 22px rgba(20,40,60,.12);color:var(--po-ink,#1F2933)}',
    '.audience-card:focus-visible{outline:2px solid var(--po-accent,#1F6B7E);outline-offset:2px}',
    '.audience-card__inner{display:block}',
    '.audience-card__eyebrow{font-family:"Inter Tight",system-ui,sans-serif;font-size:.72rem;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:var(--po-green-forest,#1F6B1D);margin:0 0 .55rem}',
    '.audience-card__title{font-family:"Fraunces",Georgia,serif;font-style:italic;font-weight:500;font-size:1.4rem;line-height:1.2;margin:0 0 .45rem;color:var(--po-ink,#1F2933)}',
    '.audience-card__body,.audience-card__blurb{font-family:"Inter Tight",system-ui,sans-serif;font-size:.95rem;line-height:1.5;color:var(--po-slate,#5B6E7F);margin:0 0 .8rem;max-width:34ch}',
    '.audience-card__cta{display:inline-flex;align-items:center;gap:6px;font-weight:600;font-size:.88rem;color:var(--po-accent,#17576A)}',
    /* dark counterpart */
    'html[data-theme="dark"] .audience-card{background:var(--po-bg2,#171d2c);border-color:#3a4258;color:#f5ecd2;box-shadow:0 2px 10px rgba(0,0,0,.4)}',
    'html[data-theme="dark"] .audience-card:hover{box-shadow:0 10px 26px rgba(0,0,0,.55);color:#f5ecd2}',
    'html[data-theme="dark"] .audience-card__title,html[data-theme="dark"] .audience-card__body,html[data-theme="dark"] .audience-card__blurb{color:#f5ecd2}',
    'html[data-theme="dark"] .audience-card__eyebrow{color:#b6d6c8}',
    'html[data-theme="dark"] .audience-card__cta{color:#c8e3d5}',
    'html[data-theme="dark"] .by-audience-hero .lede{color:#dfe7d8}',
    /* reduced motion opt-out */
    '@media (prefers-reduced-motion: reduce){.audience-card{transition:none}.audience-card:hover{transform:none}}'
  ].join('');
  document.head.appendChild(s);
})();


/* ------------------------------------------------------------
   Block 4 — /resource-library/*: ingest ?audience= (and
   ?format=, ?age=, ?region= for parity) from the URL by ticking
   the matching chip checkbox. Click triggers the existing
   bindChips change-listener so cmsfilter applies the filter.
   Runs on DOMContentLoaded + 500ms + 1500ms because Finsweet
   may not have hydrated chips on first paint. Idempotent: each
   checkbox is only ticked once per (group,value) pair.
   ------------------------------------------------------------ */
(function () {
  if (!/^\/resource-library(\/|$)/.test(location.pathname)) return;

  var GROUPS = ['audience', 'format', 'age', 'region'];
  var done = Object.create(null);

  function tick() {
    var qp;
    try { qp = new URLSearchParams(location.search); } catch (e) { return; }
    var anyTicked = false;
    GROUPS.forEach(function (g) {
      var raw = qp.get(g);
      if (!raw) return;
      raw.split(',').forEach(function (v) {
        v = (v || '').trim();
        if (!v) return;
        var key = g + '=' + v;
        if (done[key]) return;
        var sel = 'input[type="checkbox"][name="' + g + '"][value="' + v.replace(/"/g, '\\"') + '"]';
        var cb = document.querySelector(sel);
        if (!cb) return;
        if (!cb.checked) {
          cb.checked = true;
          cb.dispatchEvent(new Event('change', { bubbles: true }));
        }
        done[key] = true;
        anyTicked = true;
      });
    });
    return anyTicked;
  }

  function run() {
    tick();
    setTimeout(tick, 500);
    setTimeout(tick, 1500);
  }

  if (document.readyState !== 'loading') run();
  else document.addEventListener('DOMContentLoaded', run);

  /* Re-run after Finsweet cmsload (chips may render with the list) */
  window.fsAttributes = window.fsAttributes || [];
  window.fsAttributes.push(['cmsload', function () {
    tick();
    setTimeout(tick, 300);
  }]);
})();

/* =====================================================================
   patch_resources_contact_v1.js
   Date:    2026-05-05
   Target:  appended to site.js (single runtime, SHA-pinned via jsDelivr)
   Scope:   /resource-library/* and /contact
   Purpose: Fix audit findings from
              audit_resources_v1_2026-05-05.md
              audit_contact_v1_2026-05-05.md
   Notes:   Each block is path-gated and idempotent via data-po= markers.
            Plain JS, ES2015 max, no template literals where avoidable.
   ===================================================================== */

/* ---------------------------------------------------------------------
   BLOCK A — /resource-library/*: missing DOM nodes (#res-count, #resources-empty)
   Audit ref: resources #1
   Inserts placeholder elements site.js already references but the page
   does not provide. Idempotent via data-po-injected attributes on the
   created nodes themselves; rerunning is a no-op.
   --------------------------------------------------------------------- */
(function () {
  if (!/^\/resource-library\b/i.test(location.pathname)) return;

  function injectStubs() {
    if (document.body && document.body.dataset.poResStubs === '1') return;

    var form = document.querySelector('form[fs-cmsfilter-element="filters"]')
            || (document.getElementById('res-search') ? document.getElementById('res-search').form : null);
    var grid = document.getElementById('resources-grid');
    if (!form && !grid) return;

    /* #res-count: tucked just inside the form, after the legend or chip-row */
    if (!document.getElementById('res-count') && form) {
      var count = document.createElement('span');
      count.id = 'res-count';
      count.className = 'res-count-line';
      count.setAttribute('data-po', 'res-count-stub');
      count.setAttribute('aria-live', 'polite');
      count.textContent = '';
      var firstChip = form.querySelector('.chip-row, fieldset');
      if (firstChip && firstChip.parentNode) {
        firstChip.parentNode.insertBefore(count, firstChip);
      } else {
        form.insertBefore(count, form.firstChild);
      }
    }

    /* #resources-empty: placed after the grid */
    if (!document.getElementById('resources-empty') && grid) {
      var empty = document.createElement('div');
      empty.id = 'resources-empty';
      empty.setAttribute('data-po', 'resources-empty-stub');
      empty.hidden = true;
      empty.style.display = 'none';
      empty.textContent = 'No matches — try clearing a filter.';
      if (grid.parentNode) {
        if (grid.nextSibling) {
          grid.parentNode.insertBefore(empty, grid.nextSibling);
        } else {
          grid.parentNode.appendChild(empty);
        }
      }
    }

    if (document.body) document.body.dataset.poResStubs = '1';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectStubs);
  } else {
    injectStubs();
  }
  /* defensive re-runs: Finsweet cmsload may swap the grid in late */
  [120, 400, 1200, 3000].forEach(function (t) { setTimeout(injectStubs, t); });
})();

/* ---------------------------------------------------------------------
   BLOCK B — /resource-library/*: fieldset/legend styling + dark-mode controls
   Audit ref: resources #2, #4, #5
   --------------------------------------------------------------------- */
(function () {
  if (!/^\/resource-library\b/i.test(location.pathname)) return;
  if (document.querySelector('style[data-po="resources-fieldset-darkmode"]')) return;

  var darkChevron =
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path fill='%23f5ecd2' d='M6 8 0 0h12z'/></svg>\")";

  var css = [
    /* fieldset + legend reset */
    'fieldset.chip-row{border:0;padding:0;margin:0 0 1rem;display:flex;flex-wrap:wrap;gap:8px;align-items:center}',
    'fieldset.chip-row legend{font:600 11px/1.4 "Inter Tight",sans-serif;letter-spacing:.08em;text-transform:uppercase;color:var(--po-fg-muted,#6b7280);margin:0 0 .45rem;padding:0;float:left;width:100%}',

    /* dark-mode legend label */
    'html[data-theme="dark"] fieldset.chip-row legend{color:#cdc4ad!important}',

    /* dark-mode controls */
    'html[data-theme="dark"] #res-search{background-color:#1f2638!important;color:#f5ecd2!important;border-color:#3a4258!important}',
    'html[data-theme="dark"] #res-search::placeholder{color:#cdc4ad!important;opacity:.7}',
    'html[data-theme="dark"] #res-sort{background-color:#1f2638!important;color:#f5ecd2!important;border-color:#3a4258!important;background-image:' + darkChevron + '!important}',

    /* dark-mode active-pill cluster */
    'html[data-theme="dark"] .active-pill{background:#1f2638!important;color:#c8e3d5!important;border-color:#3a4258!important}',
    'html[data-theme="dark"] .active-pill button{color:#c8e3d5!important}',
    'html[data-theme="dark"] .active-pills .label{color:#cdc4ad!important}',
    'html[data-theme="dark"] .active-pills .clear-all{color:#f6c1a3!important}',
    'html[data-theme="dark"] .res-count-line{color:#cdc4ad!important}',

    /* dark-mode chip checked state */
    'html[data-theme="dark"] .chip:has(input:checked){background:#b6d6c8!important;color:#0e1320!important;border-color:#b6d6c8!important}'
  ].join('');

  var s = document.createElement('style');
  s.setAttribute('data-po', 'resources-fieldset-darkmode');
  s.textContent = css;
  document.head.appendChild(s);
})();

/* ---------------------------------------------------------------------
   BLOCK C — /resource-library/*: prevent Enter-key form submit wipe
   Audit ref: resources #3
   The filter form has method=get; pressing Enter in #res-search reloads
   to '?' and erases all filter state. Suppress the submit + Enter on
   the search input.
   --------------------------------------------------------------------- */
(function () {
  if (!/^\/resource-library\b/i.test(location.pathname)) return;

  function bindFormGuards() {
    var search = document.getElementById('res-search');
    var form = (search && search.form)
            || document.querySelector('form[fs-cmsfilter-element="filters"]');
    if (!form) return;
    if (form.dataset.poFormGuard === '1') return;
    form.dataset.poFormGuard = '1';

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      e.stopPropagation();
      return false;
    });
    form.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && e.target && e.target.matches && e.target.matches('#res-search')) {
        e.preventDefault();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bindFormGuards);
  } else {
    bindFormGuards();
  }
  [120, 400, 1200].forEach(function (t) { setTimeout(bindFormGuards, t); });
})();

/* ---------------------------------------------------------------------
   BLOCK D — /contact: bind orphaned <label for=""> attributes
   Audit ref: contact B1
   For each known input id (fn, ln, em, role, msg), find a sibling/
   ancestor empty <label for=""> and set its for attribute. If no label
   text is present, also set aria-label on the input as a defensive
   fallback. Idempotent via data-po-labelled marker on the input.
   --------------------------------------------------------------------- */
(function () {
  if (!/^\/contact\/?$/i.test(location.pathname)) return;

  var FIELDS = [
    ['fn',   'First name'],
    ['ln',   'Last name'],
    ['em',   'Email address'],
    ['role', "I'm reaching out as…"],
    ['msg',  'Message']
  ];

  function patchLabels() {
    FIELDS.forEach(function (pair) {
      var id = pair[0];
      var fallback = pair[1];
      var input = document.getElementById(id);
      if (!input) return;
      if (input.dataset.poLabelled === '1') return;

      /* Try to find a label that is ancestor or earlier sibling */
      var lbl = null;
      var row = input.closest('.field-row, .form-field, .w-embed, div, fieldset');
      if (row) {
        lbl = row.querySelector('label[for=""]');
        if (!lbl) {
          /* climb one level if needed */
          var parent = row.parentElement;
          if (parent) lbl = parent.querySelector('label[for=""]');
        }
      }
      /* Sibling-walk fallback */
      if (!lbl) {
        var sib = input.previousElementSibling;
        while (sib) {
          if (sib.tagName === 'LABEL' && (sib.getAttribute('for') === '' || !sib.getAttribute('for'))) {
            lbl = sib; break;
          }
          sib = sib.previousElementSibling;
        }
      }

      if (lbl && (!lbl.getAttribute('for'))) {
        lbl.setAttribute('for', id);
        lbl.setAttribute('data-po', 'label-bound');
      }

      /* Defensive aria-label if the label has no text content */
      var labelText = lbl ? (lbl.textContent || '').trim() : '';
      if (!labelText && !input.getAttribute('aria-label')) {
        input.setAttribute('aria-label', fallback);
      }
      input.dataset.poLabelled = '1';
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', patchLabels);
  } else {
    patchLabels();
  }
  [120, 400, 1200, 3000].forEach(function (t) { setTimeout(patchLabels, t); });
})();

/* ---------------------------------------------------------------------
   BLOCK E — /contact: flip form method=get to method=post
   Audit ref: contact B2
   Webhook (contactwebhookv4/v5) intercepts via JS so method does not
   matter functionally, but post is safer for the no-JS fallback so
   form values do not leak into the URL/referer chain.
   --------------------------------------------------------------------- */
(function () {
  if (!/^\/contact\/?$/i.test(location.pathname)) return;

  function flipMethod() {
    var forms = document.querySelectorAll('form');
    for (var i = 0; i < forms.length; i++) {
      var f = forms[i];
      if (f.dataset.poMethodFlipped === '1') continue;
      var m = (f.getAttribute('method') || '').toLowerCase();
      if (m !== 'post') {
        f.setAttribute('method', 'post');
        f.dataset.poMethodFlipped = '1';
        f.setAttribute('data-po-orig-method', m || 'get');
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', flipMethod);
  } else {
    flipMethod();
  }
  [60, 240, 800].forEach(function (t) { setTimeout(flipMethod, t); });
})();

/* ---------------------------------------------------------------------
   BLOCK F — /contact: hide topic <select> until setupTopic hydrates
   Audit ref: contact B3
   The Designer ships stub options ("First/Second/Third choice"); site.js
   setupTopic overwrites them at runtime, but the pre-hydration paint
   shows the stubs. Hide the select until a non-stub option is detected.
   --------------------------------------------------------------------- */
(function () {
  if (!/^\/contact\/?$/i.test(location.pathname)) return;
  if (document.querySelector('style[data-po="contact-topic-prehydrate"]')) return;

  var s = document.createElement('style');
  s.setAttribute('data-po', 'contact-topic-prehydrate');
  s.textContent =
    '#topic[data-po-prehydrate="1"]{visibility:hidden!important}' +
    '#topic[data-po-prehydrate="0"]{visibility:visible}';
  document.head.appendChild(s);

  var STUB_RE = /^(first|second|third)\s+choice$/i;

  function hideUntilHydrated() {
    var sel = document.getElementById('topic');
    if (!sel) return;
    if (sel.dataset.poTopicGate === '1') return;

    /* If first option is a stub, hide */
    var firstReal = null;
    for (var i = 0; i < sel.options.length; i++) {
      var o = sel.options[i];
      var label = (o.textContent || '').trim();
      if (label && !STUB_RE.test(label) && label.toLowerCase() !== 'select one…' && o.value !== '') {
        firstReal = o; break;
      }
    }
    if (!firstReal) {
      sel.setAttribute('data-po-prehydrate', '1');
      sel.dataset.poTopicGate = '1';
      var reveal = function () {
        var changed = false;
        for (var j = 0; j < sel.options.length; j++) {
          var lbl = (sel.options[j].textContent || '').trim();
          if (lbl && !STUB_RE.test(lbl)) { changed = true; break; }
        }
        if (changed) {
          sel.setAttribute('data-po-prehydrate', '0');
          if (mo) mo.disconnect();
        }
      };
      var mo = new MutationObserver(reveal);
      mo.observe(sel, { childList: true, subtree: true, characterData: true });
      /* hard ceiling: reveal after 4s no matter what so users are never trapped */
      setTimeout(function () {
        sel.setAttribute('data-po-prehydrate', '0');
        if (mo) mo.disconnect();
      }, 4000);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hideUntilHydrated);
  } else {
    hideUntilHydrated();
  }
  [60, 200, 600].forEach(function (t) { setTimeout(hideUntilHydrated, t); });
})();

/* ---------------------------------------------------------------------
   BLOCK G — /contact: dark-mode coverage for .w-form widgets
   Audit ref: contact B-theme-gap
   Themes input/select/textarea + placeholder + select chevron under
   html[data-theme="dark"]. Uses var fallbacks so it survives missing
   tokens.
   --------------------------------------------------------------------- */
(function () {
  if (!/^\/contact\/?$/i.test(location.pathname)) return;
  if (document.querySelector('style[data-po="contact-form-darkmode"]')) return;

  var darkChevron =
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'><path fill='%23f5ecd2' d='M6 8 0 0h12z'/></svg>\")";

  var css = [
    'html[data-theme="dark"] .w-form input,',
    'html[data-theme="dark"] .w-form select,',
    'html[data-theme="dark"] .w-form textarea{',
      'background-color:var(--po-bg2,#1f2638)!important;',
      'color:var(--po-fg,#f5ecd2)!important;',
      'border-color:var(--po-border,#3a4258)!important;',
    '}',
    'html[data-theme="dark"] .w-form input::placeholder,',
    'html[data-theme="dark"] .w-form textarea::placeholder{',
      'color:var(--po-fg-muted,#cdc4ad)!important;',
      'opacity:.65;',
    '}',
    'html[data-theme="dark"] .w-form select,',
    'html[data-theme="dark"] .w-embed select{',
      'background-image:' + darkChevron + '!important;',
    '}',
    /* focus ring on submit (audit B9 — same dark-mode block) */
    '.w-form input[type="submit"]:focus-visible{outline:3px solid #1F6B7E!important;outline-offset:3px!important}',
    'html[data-theme="dark"] .w-form input[type="submit"]:focus-visible{outline-color:#b6d6c8!important}'
  ].join('');

  var s = document.createElement('style');
  s.setAttribute('data-po', 'contact-form-darkmode');
  s.textContent = css;
  document.head.appendChild(s);
})();

/* ---------------------------------------------------------------------
   BLOCK H — /contact: restore feedback link
   Audit ref: contact B6 (recommendation: REMOVE the suppression)
   Existing site.js (contact-wrap-layout block) sets:
     body[data-pocontact] #feedback,
     body[data-pocontact] .po-feedback-section,
     body[data-pocontact] .po-feedback-link { display:none !important }
   Override the .po-feedback-link rule with higher specificity so the
   footer link reappears. Leaves the other two suppressed (the on-page
   #feedback section is still injected separately by the contact
   feedback block at line 253 — which sets data-pocontact AFTER suppression
   conflict, so we explicitly allow it through here too).
   --------------------------------------------------------------------- */
(function () {
  if (!/^\/contact\/?$/i.test(location.pathname)) return;
  if (document.querySelector('style[data-po="contact-feedback-restore"]')) return;

  var css = [
    'html body[data-pocontact] .po-feedback-link{display:block!important}',
    'html body[data-pocontact] #feedback,',
    'html body[data-pocontact] .po-feedback-section{display:block!important}'
  ].join('');

  var s = document.createElement('style');
  s.setAttribute('data-po', 'contact-feedback-restore');
  s.textContent = css;
  document.head.appendChild(s);
})();

/* end patch_resources_contact_v1.js */

/* Pain Ontario — /portal patches v1 (2026-05-05)
 *
 * Three IIFEs, all path-gated to /^\/portal/. Idempotent via data-po-* markers.
 *
 * 1) A11Y + leak fixes for the portal embed:
 *    - .po-soon tile: drop pointer-events:none, add tabindex=-1 + aria-disabled
 *      so keyboard users skip past it but screen readers still announce it.
 *    - aria-label on the name <select> and "someone else" <input>.
 *    - :focus-visible rings on .po-tile, .po-change, .po-btn (cream-on-navy
 *      kills the default outline).
 *    - Hide site.js mobile-nav drawer, FAB stack, back link, and dark toggle
 *      via CSS so the public IA doesn't leak into a confidential page.
 *      (Cheaper than re-gating each site.js IIFE; no JS handlers fire because
 *      the elements are display:none before they render.)
 *
 * 2) Forms tile activation:
 *    Flips the .po-soon tile to a live link to /dashboard/forms when either
 *    location.search includes ?activate-forms OR window.__poFormsActive===true.
 *    Vina enables it by adding `<script>window.__poFormsActive=true;</script>`
 *    to /portal Page Custom Code once /dashboard/forms exists.
 *
 * Paste into /portal Page Custom Code (Footer) below the existing embed.
 */
(function () {
  if (!/^\/portal/.test(location.pathname)) return;

  /* ---------- 1. a11y + leak fixes ---------- */
  (function patchA11y() {
    if (document.documentElement.getAttribute("data-po-portal-patched") === "v1") return;
    document.documentElement.setAttribute("data-po-portal-patched", "v1");

    // Mark <body> so the CSS overrides scope cleanly.
    document.body.setAttribute("data-po-portal", "");

    var css = [
      // Override the pointer-events trap on the soon tile.
      ".po-portal .po-tile.po-soon{opacity:.6;cursor:not-allowed;pointer-events:auto}",
      ".po-portal .po-tile.po-soon:hover{transform:none;border-color:rgba(245,239,226,.14);background:rgba(245,239,226,.05)}",
      // Focus rings — cream-on-navy needs an explicit ring.
      ".po-portal .po-tile:focus-visible{outline:2px solid #78bc9c;outline-offset:2px;border-radius:18px}",
      ".po-portal .po-change:focus-visible{outline:2px solid #78bc9c;outline-offset:2px;border-radius:4px}",
      ".po-portal .po-btn:focus-visible{outline:2px solid #78bc9c;outline-offset:2px}",
      // Hide site-wide affordances on /portal (mobile nav drawer, FAB, back link, dark toggle).
      "body[data-po-portal] .po-mn-trigger,",
      "body[data-po-portal] .po-mn-drawer,",
      "body[data-po-portal] .po-mn-scrim,",
      "body[data-po-portal] .po-fab-stack,",
      "body[data-po-portal] .po-back,",
      "body[data-po-portal] .po-tt{display:none !important}"
    ].join("\n");

    var styleEl = document.createElement("style");
    styleEl.setAttribute("data-po", "portal-patch-v1");
    styleEl.textContent = css;
    document.head.appendChild(styleEl);

    // DOM patches — run after the embed renders. The embed inlines its script,
    // so by the time this IIFE fires the nodes already exist; still guard with
    // a tiny RAF in case the order changes.
    function applyDom() {
      var soon = document.querySelector(".po-portal .po-tile.po-soon");
      if (soon && soon.getAttribute("data-po-soon-patched") !== "1") {
        soon.setAttribute("data-po-soon-patched", "1");
        soon.setAttribute("tabindex", "-1");
        // aria-disabled is already present in the embed; ensure it's set.
        if (!soon.hasAttribute("aria-disabled")) soon.setAttribute("aria-disabled", "true");
        // Stop Enter/click jumping the page to # before aria-disabled fires.
        soon.addEventListener("click", function (e) { e.preventDefault(); });
      }

      var sel = document.getElementById("po-name-select");
      if (sel && !sel.getAttribute("aria-label")) sel.setAttribute("aria-label", "Pick your name");

      var oth = document.getElementById("po-other-input");
      if (oth && !oth.getAttribute("aria-label")) oth.setAttribute("aria-label", "Type your name");
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", applyDom, { once: true });
    } else {
      applyDom();
    }
  })();

  /* ---------- 2. Forms tile activation (opt-in) ---------- */
  (function patchFormsTile() {
    var activate = /[?&]activate-forms(?:=|&|$)/.test(location.search) ||
                   window.__poFormsActive === true;
    if (!activate) return;

    function flip() {
      var tile = document.querySelector(".po-portal .po-tile.po-soon");
      if (!tile || tile.getAttribute("data-po-forms-active") === "1") return;
      tile.setAttribute("data-po-forms-active", "1");

      tile.classList.remove("po-soon");
      tile.removeAttribute("aria-disabled");
      tile.removeAttribute("tabindex");
      tile.setAttribute("href", "/dashboard/forms");

      var eyebrow = tile.querySelector(".po-tile-eyebrow");
      if (eyebrow) eyebrow.textContent = "Forms — open";

      var cta = tile.querySelector(".po-tile-cta");
      if (cta) cta.textContent = "Open /dashboard/forms →";
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", flip, { once: true });
    } else {
      flip();
    }
  })();
})();

/* ============================================================
   FORM-TERRITORY RESTORE BUNDLE (2026-05-05 v1)
   Restores 8 form-territory scripts that were deleted along with
   the legacy App-applied scripts. Each is path-gated and idempotent.
   Sourced from cdn.prod.website-files.com archive — these are the
   exact bytes that were running pre-cutover.

   Restored:
   - pojobsfilepickv7b      — file upload UI for resume + cover letter
   - pojobssubmitv7         — form submit handler
   - po_ed_jobs_prescreener_v7 — Ontario residency / age screener
   - po_ed_jobs_form_styles_v2 — form widget styling
   - pojobsmobilefixv1      — mobile-specific job-form fixes
   - pojobsrolecarddedup    — dedup helper for role card injection
   - contactwebhookv4       — Make.com webhook for /contact form
   - pocontactpolishv1      — /contact form polish

   Plus a separate fix for the recursive .po-jbs-rc nesting bug
   (idempotency check on h3.dataset.poRc fails because h3 is removed,
   so subsequent runs find the new h3 inside the wrapper and re-wrap).
   ============================================================ */

/* === Recursive role-card nesting fix === */
(function () {
  if (!/^\/about\/jobs(\/|$)/i.test(location.pathname)) return;
  if (document.querySelector('style[data-po="rolecard-recursion-fix-v1"]')) return;
  var marker = document.createElement('style');
  marker.setAttribute('data-po', 'rolecard-recursion-fix-v1');
  marker.textContent = '/* rolecard-recursion-fix-v1 active */';
  document.head.appendChild(marker);

  /* Body-level marker so the role-card builder cannot rerun once it
     has produced its single .po-jbs-rc wrapper. The original guard
     used h3.dataset.poRc but h3 gets removed, so the next tick finds
     a fresh h3 inside the wrapper and re-wraps. */
  function lock() {
    if (document.body.dataset.poJbsRcBuilt === '1') return;
    var rcs = document.querySelectorAll('.po-jbs-rc');
    if (rcs.length === 0) return;
    /* If multiple .po-jbs-rc already exist (recursion already happened),
       keep the OUTERMOST one and remove the rest's wrappers — preserve
       only the innermost content by replacing with a clean rebuild. */
    if (rcs.length > 1) {
      /* Find the deepest .po-jbs-rc — its content is the canonical one. */
      var deepest = null, depth = -1;
      Array.prototype.forEach.call(rcs, function (rc) {
        var d = 0;
        var p = rc.parentElement;
        while (p) { if (p.classList && p.classList.contains('po-jbs-rc')) d++; p = p.parentElement; }
        if (d > depth) { depth = d; deepest = rc; }
      });
      var topMost = rcs[0];
      if (deepest && topMost && deepest !== topMost) {
        topMost.innerHTML = deepest.innerHTML;
      }
      /* Remove all but the topmost. */
      Array.prototype.forEach.call(rcs, function (rc) {
        if (rc !== topMost && rc.parentNode) rc.parentNode.removeChild(rc);
      });
    }
    document.body.dataset.poJbsRcBuilt = '1';
  }
  lock();
  /* Catch later builder ticks */
  [200, 500, 1200, 3500].forEach(function (ms) { setTimeout(lock, ms); });

  if (window.MutationObserver) {
    var t = null;
    var mo = new MutationObserver(function () {
      if (t) return;
      t = setTimeout(function () { t = null; lock(); }, 80);
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }
})();

/* === pojobsfilepickv7b (file upload UI) === */
!function(){if(!/\/about\/jobs\/?$/i.test(location.pathname))return;function R(){if(window.__POjobsFP7)return;window.__POjobsFP7=!0;var W=document.querySelector('[data-po-form="ed-application"]');if(!W)return;var F=W.querySelector("form");if(!F)return;var P="display:flex;align-items:center;gap:.85rem;flex-wrap:wrap;background:rgba(31,41,51,.03);border:1.5px dashed rgba(31,41,51,.28);border-radius:8px;padding:.75rem .9rem;margin:.2rem 0",B="display:inline-flex;align-items:center;border:1px solid #1F6B7E;background:#1F6B7E;color:#fff;padding:.5rem .9rem;border-radius:6px;font-weight:600;font-size:.92rem;cursor:pointer",I="font-size:.92rem;opacity:.75;flex:1;min-width:120px;overflow-wrap:anywhere";Array.prototype.forEach.call(F.querySelectorAll(".w-file-upload"),function(w){var i=w.querySelector('input[type="file"]');if(!i)return;var c=i.cloneNode();c.style.display="none";c.id=i.id;c.removeAttribute("aria-hidden");c.removeAttribute("tabindex");c.classList.remove("w-file-upload-input");var p=document.createElement("div");p.style.cssText=P;var b=document.createElement("button");b.type="button";b.textContent="Choose file";b.style.cssText=B;b.addEventListener("click",function(){c.click()});var n=document.createElement("span");n.style.cssText=I;n.textContent="No file chosen - max 10 MB";c.addEventListener("change",function(){if(c.files&&c.files[0]){var f=c.files[0],m=(f.size/1048576).toFixed(2);if(f.size>10485760){n.textContent="File too large ("+m+" MB) - max 10 MB";n.style.color="#C76E8A";c.value="";return}n.textContent=f.name+" - "+m+" MB (click Choose file to replace)";n.style.color=""}else n.textContent="No file chosen - max 10 MB"});p.appendChild(b);p.appendChild(n);p.appendChild(c);w.parentNode.replaceChild(p,w)});console.log("[PO-jobs FP v7b] pickers rebuilt")}"loading"===document.readyState?document.addEventListener("DOMContentLoaded",R):R()}();

/* === pojobssubmitv7 (form submit handler with file upload) === */
!function(){if(!/\/about\/jobs\/?$/i.test(location.pathname))return;var W="https://hook.eu1.make.com/3spfohh09gkehuwdguh3oeme7opn99d9";function R(){if(window.__POjobsSB7)return;window.__POjobsSB7=!0;var W1=document.querySelector('[data-po-form="ed-application"]');if(!W1)return;var F=W1.querySelector("form");if(!F)return;var D=W1.querySelector(".w-form-done"),X=W1.querySelector(".w-form-fail");F.addEventListener("submit",function(e){e.preventDefault();e.stopPropagation();e.stopImmediatePropagation();var s=F.querySelector('[data-po-submit], input[type="submit"], button[type="submit"]'),o=s?(s.value||s.textContent):"";if(s){s.disabled=!0;if("value"in s)s.value="Sending...";else s.textContent="Sending..."}var fd=new FormData(F);Array.prototype.forEach.call(F.querySelectorAll('input[type="file"]'),function(fi){if(fi.files&&fi.files[0]&&fi.name){fd.set(fi.name,fi.files[0],fi.files[0].name);console.log("[PO-jobs SB v7] explicit file append:",fi.name,fi.files[0].name,fi.files[0].size+"b");}});fd.append("source","painontario.ca/about/jobs");fd.append("submittedAt",new Date().toISOString());var _dbg=[];fd.forEach(function(v,k){_dbg.push(k+"="+(v&&v.name?"[File "+v.name+" "+v.size+"b]":(""+v).slice(0,40)));});console.log("[PO-jobs SB v7] FormData entries:",_dbg);fetch(W,{method:"POST",body:fd}).then(function(r){if(!r.ok)throw new Error("HTTP "+r.status);F.style.display="none";if(D){D.style.display="block";D.scrollIntoView({behavior:"smooth",block:"nearest"})}else alert("Application sent. Thank you.")}).catch(function(err){console.error("[PO-jobs] submit failed",err);if(X){X.style.display="block";X.scrollIntoView({behavior:"smooth",block:"nearest"})}if(s){s.disabled=!1;if("value"in s)s.value=o||"Submit";else s.textContent=o||"Submit"}});return!1},!0);console.log("[PO-jobs SB v7] submit hijack active")}"loading"===document.readyState?document.addEventListener("DOMContentLoaded",R):R()}();

/* === po_ed_jobs_prescreener_v7 === */
(function(){function init(){if(window.__POscreenerV7)return;window.__POscreenerV7=true;var form=document.querySelector('[data-po-form="ed-application"]');if(!form)return;var fi=form.querySelector('form')||form;Array.prototype.forEach.call(document.querySelectorAll('[data-po-screener-end]'),function(el){el.remove();});Array.prototype.forEach.call(form.querySelectorAll('[data-po-phase]'),function(w){while(w.firstChild){if(w.parentElement===fi||w.parentElement===form){w.parentElement.insertBefore(w.firstChild,w);}else{w.remove();break;}}w.remove();});var ont=fi.querySelector('select[data-name="Ontario-resident"]');var submit=fi.querySelector('[data-po-submit]');if(!ont||!submit)return;var oc=ont.cloneNode(true);ont.parentNode.replaceChild(oc,ont);ont=oc;var lab=null,p=ont.previousElementSibling;while(p){if(p.tagName==='LABEL'){lab=p;break;}p=p.previousElementSibling;}var p1=document.createElement('div');p1.setAttribute('data-po-phase','1');p1.style.cssText='background:rgba(107,163,199,.06);border:1px solid rgba(107,163,199,.32);border-left:4px solid #6BA3C7;border-radius:10px;padding:1.1rem 1.2rem 1.3rem;margin:.5rem 0 1.25rem;display:grid;gap:.55rem;grid-column:1/-1';p1.innerHTML='<div style="font-size:.78rem;text-transform:uppercase;letter-spacing:.12em;font-weight:600;opacity:.7">Step 1 of 2 — eligibility</div>';fi.insertBefore(p1,fi.firstElementChild);if(lab)p1.appendChild(lab);p1.appendChild(ont);var cb=document.createElement('button');cb.type='button';cb.textContent='Continue →';cb.disabled=true;cb.style.cssText='justify-self:start;margin-top:.4rem;background:#1A1A1A;color:#F2EBDD;border:0;border-radius:999px;padding:.6rem 1.2rem;font-weight:600;cursor:not-allowed;opacity:.55';p1.appendChild(cb);var h=document.createElement('div');h.style.cssText='font-size:.85rem;opacity:.7';h.textContent='Pick an answer to continue.';p1.appendChild(h);var p2=document.createElement('div');p2.setAttribute('data-po-phase','2');p2.style.cssText='display:none;grid-column:1/-1';fi.appendChild(p2);var mq=[];Array.prototype.forEach.call(fi.children,function(el){if(el!==p1&&el!==p2)mq.push(el);});mq.forEach(function(el){p2.appendChild(el);});var ph=document.createElement('div');ph.style.cssText='display:flex;align-items:center;justify-content:space-between;gap:1rem;margin:.4rem 0 .85rem';var pt=document.createElement('div');pt.style.cssText='font-size:.78rem;text-transform:uppercase;letter-spacing:.12em;font-weight:600;opacity:.7';pt.textContent='Step 2 of 2 — application';var bk=document.createElement('button');bk.type='button';bk.textContent='← Back to step 1';bk.style.cssText='background:transparent;border:0;color:inherit;font:inherit;cursor:pointer;text-decoration:underline;font-size:.85rem;opacity:.75;padding:0';ph.appendChild(pt);ph.appendChild(bk);p2.insertBefore(ph,p2.firstChild);var card=document.createElement('div');card.setAttribute('data-po-screener-end','1');card.setAttribute('role','status');card.style.cssText='display:none;background:rgba(199,110,138,.08);border:1px solid rgba(199,110,138,.4);border-left:4px solid #C76E8A;border-radius:10px;padding:1.2rem 1.4rem;margin-top:1rem;font-size:.98rem;line-height:1.55';card.innerHTML='<strong style="display:block;margin-bottom:.4rem;font-size:1.05rem">Thanks for your interest.</strong><span>This role requires current Ontario residency, so we can’t proceed with this application. We’ll keep your contact on file for future opportunities you may be eligible for.</span>';var eb=document.createElement('button');eb.type='button';eb.textContent='← Back to step 1';eb.style.cssText='margin-top:.85rem;background:transparent;border:0;color:inherit;font:inherit;cursor:pointer;text-decoration:underline;font-size:.9rem;opacity:.85;padding:0';card.appendChild(eb);form.appendChild(card);function lt(){var o=ont.options[ont.selectedIndex];return o?(o.text||o.label||'').trim():'';}function g1(){ont.selectedIndex=0;p1.style.display='';p2.style.display='none';card.style.display='none';cb.disabled=true;cb.style.opacity='.55';cb.style.cursor='not-allowed';h.style.display='';try{ont.focus();}catch(e){}}function g2(){p1.style.display='none';card.style.display='none';p2.style.display='';try{p2.scrollIntoView({behavior:'smooth',block:'start'});}catch(e){}}function ge(){p1.style.display='none';p2.style.display='none';card.style.display='block';try{card.scrollIntoView({behavior:'smooth',block:'nearest'});}catch(e){}}function oc2(){var l=lt().toLowerCase();var u=!l||/^select/i.test(l);cb.disabled=u;cb.style.opacity=u?'.55':'1';cb.style.cursor=u?'not-allowed':'pointer';h.style.display=u?'':'none';}function ok(){var l=lt().toLowerCase();if(!l||/^select/i.test(l))return;if(l==='no')return ge();return g2();}ont.addEventListener('change',oc2);cb.addEventListener('click',ok);bk.addEventListener('click',g1);eb.addEventListener('click',g1);oc2();console.log('[PO-prescreen v7] active');}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();})();

/* === po_ed_jobs_form_styles_v2 === */
(function(){if(!/\/about\/jobs\/?$/i.test(location.pathname))return;var c='[data-po-form="ed-application"]{display:block;max-width:640px;margin-top:1.5rem}[data-po-form="ed-application"] form{display:grid;grid-template-columns:1fr 1fr;gap:.65rem 1rem}[data-po-form="ed-application"] label{grid-column:1 / -1;font-weight:600;font-size:.92rem;margin:.85rem 0 .15rem;color:inherit}[data-po-form="ed-application"] label[for="First-Name"],[data-po-form="ed-application"] input#First-Name,[data-po-form="ed-application"] label[for="Last-Name"],[data-po-form="ed-application"] input#Last-Name{grid-column:auto}[data-po-form="ed-application"] .w-input,[data-po-form="ed-application"] .w-select,[data-po-form="ed-application"] textarea{grid-column:1 / -1;width:100%;border:1px solid rgba(31,41,51,.22);border-radius:8px;padding:.65rem .85rem;font:inherit;background:rgba(255,255,255,.5);color:inherit;transition:border-color .15s,box-shadow .15s}[data-po-form="ed-application"] textarea{min-height:120px;resize:vertical}[data-po-form="ed-application"] .w-input:focus,[data-po-form="ed-application"] .w-select:focus,[data-po-form="ed-application"] textarea:focus{border-color:#1F6B7E;box-shadow:0 0 0 3px rgba(31,107,126,.18);outline:none}[data-po-form="ed-application"] .w-file-upload{grid-column:1 / -1;display:block;background:rgba(31,41,51,.03);border:1.5px dashed rgba(31,41,51,.28);border-radius:8px;padding:.95rem 1.05rem;margin:.2rem 0}[data-po-form="ed-application"] .w-file-upload-default{display:flex;align-items:center;gap:.85rem;flex-wrap:wrap}[data-po-form="ed-application"] .w-file-upload-label{display:inline-flex;align-items:center;gap:.4rem;border:1px solid #1F6B7E;background:#1F6B7E;color:#fff;padding:.5rem .9rem;border-radius:6px;font-size:.92rem;font-weight:500;cursor:pointer;transition:background .15s}[data-po-form="ed-application"] .w-file-upload-label:hover{background:#17576A}[data-po-form="ed-application"] .w-file-upload-label .w-icon-file-upload-icon{filter:invert(1)}[data-po-form="ed-application"] .w-file-upload-info{font-size:.82rem;opacity:.7;color:inherit}[data-po-form="ed-application"] .w-file-upload-success{display:flex;align-items:center;gap:.5rem;background:rgba(92,206,89,.15);padding:.4rem .65rem;border-radius:6px;margin-top:.5rem}[data-po-form="ed-application"] [data-po-residency-note]{grid-column:1 / -1;background:rgba(199,110,138,.08);border:1px solid rgba(199,110,138,.35);border-left:3px solid #C76E8A;border-radius:6px;padding:.7rem .9rem;font-size:.92rem;color:inherit;margin:.4rem 0 .2rem}[data-po-form="ed-application"] [data-po-submit]{grid-column:1 / -1;justify-self:start;margin-top:1rem;background:#1F2933;color:#FBFAF3;border:0;border-radius:999px;padding:.8rem 1.6rem;font-weight:600;font-size:.95rem;cursor:pointer;transition:background .15s,opacity .15s}[data-po-form="ed-application"] [data-po-submit]:hover{background:#000}[data-po-form="ed-application"] [data-po-submit][disabled],[data-po-form="ed-application"] [data-po-submit].po-submit-blocked{opacity:.45;cursor:not-allowed;background:#1F2933}@media(max-width:640px){[data-po-form="ed-application"] form{grid-template-columns:1fr}}';var s=document.createElement('style');s.textContent=c;document.head.appendChild(s);})();

/* === pojobsmobilefixv1 === */
!function(){
if(!/\/about\/jobs\/?$/i.test(location.pathname))return;
var css=[
'.po-jbs-pr li::before{background:#1F6B7E!important;color:#fff!important;border:none!important;opacity:1!important;line-height:36px!important}',
'.po-jbs-pr li{opacity:1!important}',
'html[data-theme="dark"] .po-jbs-pr li::before{background:#b6d6c8!important;color:#0e1320!important;border:none!important}',
'.signpost:empty,.signpost.po-jbs-empty{display:none!important}',
'@media(max-width:767px){.po-jbs-st{bottom:9.5rem!important}.po-fab-stack{bottom:1.25rem!important}}',
'@media(min-width:768px){.po-jbs-st{bottom:1.5rem!important}}'
].join('');
var s=document.createElement('style');s.setAttribute('data-po','jobs-mfx-v1');s.textContent=css;document.head.appendChild(s);
function sweep(){
  var nodes=document.querySelectorAll('.signpost');
  nodes.forEach(function(n){
    var t=(n.textContent||'').trim();
    var hasMedia=n.querySelector('img,svg,video,iframe,a,button');
    if(!t&&!hasMedia)n.classList.add('po-jbs-empty');
  });
}
sweep();
[200,600,1500,3000,6000].forEach(function(t){setTimeout(sweep,t);});
}();

/* === pojobsrolecarddedup === */
!function(){if(!/\/about\/jobs\/?$/i.test(location.pathname))return;function fix(){var h2=[...document.querySelectorAll("h2")].find(function(h){return /Currently hiring/i.test(h.textContent)});if(!h2)return;var cs=document.querySelectorAll(".po-jbs-rc");if(!cs.length)return;cs.forEach(function(c){c.remove()});var n=document.createElement("div");n.className="po-jbs-rc";n.innerHTML='<p class="eb">Open role</p><h3 data-po-rc="1">Founding Executive Director</h3><p>A foundational leadership role to establish governance, secure sustainable funding, and build provincial partnerships for chronic pain care.</p><p>Full posting below. Questions: <a href="mailto:info@painontario.ca">info@painontario.ca</a>.</p>';h2.parentElement.insertBefore(n,h2.nextSibling);console.log("[PO-jobs RC dedup] reset to single card")}fix();[100,500,1000,2000,3500,5000].forEach(function(t){setTimeout(fix,t)})}();

/* === contactwebhookv4 === */
!function(){if(!/^\/contact\/?$/i.test(location.pathname))return;var H="https://hook.eu1.make.com/r5zlpjipart2yozo6sikm93iq2w2myi2",T=["","General question or inquiry","Accessibility issue","Feature suggestion","A resource we should add","Media or partnership","Volunteering or contributing","Something else"],q=document.querySelector.bind(document);function st(){var s=q("#topic");if(!s||s.dataset.poI)return;s.dataset.poI="1";s.setAttribute("name","Topic");s.innerHTML="";T.forEach(function(v){var p=document.createElement("option");p.value=v;p.textContent=v||"Select one…";s.appendChild(p)})}function ss(f,s){var w=f.closest(".w-form");if(!w)return;var d=w.querySelector(".w-form-done"),x=w.querySelector(".w-form-fail");"done"===s?(f.style.display="none",d&&(d.style.display="block"),x&&(x.style.display="none")):(x&&(x.style.display="block"),d&&(d.style.display="none"))}function as(){var f=q('form[data-name="Contact"]');if(!f||f.dataset.poS)return;f.dataset.poS="1";f.addEventListener("submit",function(e){e.preventDefault();e.stopImmediatePropagation();var b=f.querySelector('input[type=submit],button[type=submit]'),v=b?b.value:null;b&&(b.value=b.getAttribute("data-wait")||"Please wait…",b.disabled=!0);var V=function(s){return(f.querySelector(s)||{}).value||""};fetch(H,{method:"POST",mode:"cors",headers:{"Content-Type":"application/json"},body:JSON.stringify({payload:{name:"Contact",submittedAt:new Date().toISOString(),pageUrl:location.href,data:{"First-Name":V("#fn"),"Last-Name":V("#ln"),Email:V("#em"),Role:V("#role"),Topic:V("#topic"),Message:V("#msg")}}})}).then(function(r){if(!r.ok)throw 0;ss(f,"done");try{f.reset()}catch(_){}}).catch(function(){ss(f,"fail");b&&(b.value=v||"Send message",b.disabled=!1)})},!0)}function tk(){st();as()}tk();new MutationObserver(tk).observe(document.body,{childList:!0,subtree:!0})}();

/* === pocontactpolishv1 === */
/* === pocontactpolishv1 — safe variant (no body-wide MutationObserver)
   Replaces the original 1.6 KB version. Same CSS + same message
   override texts. Drops the body-wide childList+subtree observer
   that was freezing the /contact renderer when combined with the
   other observers added in the audit-driven patches.
   Retries the text-set on a few setTimeout ticks instead. */
(function () {
  if (!/^\/contact\/?$/i.test(location.pathname)) return;
  if (document.body.hasAttribute('data-pocontact')) return;
  document.body.setAttribute('data-pocontact', '');

  var s = document.createElement('style');
  s.setAttribute('data-po', 'pocontactpolish-safe-v1');
  s.textContent = '@media(min-width:992px){body[data-pocontact] .div-block-21.wrap{max-width:960px!important;width:auto!important;margin-left:auto!important;margin-right:auto!important}body[data-pocontact] .w-form:has(form[data-name="Contact"]){max-width:none}}body[data-pocontact] form[data-name="Contact"] ~ .w-form-done,body[data-pocontact] form[data-name="Contact"] ~ .w-form-fail{border-radius:14px;padding:1.25rem 1.4rem;margin-top:1rem;line-height:1.5}body[data-pocontact] form[data-name="Contact"] ~ .w-form-done{background:rgba(120,188,156,0.16);border:1px solid rgba(120,188,156,0.45);color:var(--brand-cream,#f5efe2)}body[data-pocontact] form[data-name="Contact"] ~ .w-form-fail{background:rgba(220,120,120,0.16);border:1px solid rgba(220,120,120,0.45);color:var(--brand-cream,#f5efe2)}';
  document.head.appendChild(s);

  var DONE = "Thanks — message received. We'll be in touch when we can. If it's urgent, please also email info@painontario.ca.";
  var FAIL = "That didn't send. Please try again, or email us directly at info@painontario.ca.";

  function p() {
    var cf = document.querySelector('form[data-name="Contact"]');
    if (!cf) return;
    var w = cf.closest('.w-form');
    if (!w) return;
    var d = w.querySelector('.w-form-done > div, .w-form-done');
    var f = w.querySelector('.w-form-fail > div, .w-form-fail');
    if (d && d.textContent.trim() !== DONE) d.textContent = DONE;
    if (f && f.textContent.trim() !== FAIL) f.textContent = FAIL;
  }
  p();
  [200, 600, 1500, 3500].forEach(function (t) { setTimeout(p, t); });
})();



/* === Dashboard back-to-portal arrow (2026-05-06)
   Adds a small "← Portal" link at top-left of /dashboard/jobs and
   /dashboard/forms so board members can navigate back without using
   browser back. Path-gated, idempotent, dark-mode tuned. */
!function(){
  if (!/^\/dashboard\/(jobs|forms)(\/|$)/.test(location.pathname)) return;
  if (document.querySelector('[data-po="dashboard-portal-back"]')) return;
  if (document.getElementById('po-dash-back')) return;

  function inject(){
    if (document.getElementById('po-dash-back')) return;
    if (!document.body) return;
    var s = document.createElement('style');
    s.setAttribute('data-po', 'dashboard-portal-back');
    s.textContent = (
      '#po-dash-back{position:fixed;top:1rem;left:1rem;z-index:9990;'
      + 'display:inline-flex;align-items:center;gap:.45rem;'
      + 'padding:.5rem .85rem;border-radius:999px;'
      + 'background:rgba(245,239,226,.08);'
      + 'border:1px solid rgba(245,239,226,.22);'
      + 'color:#f5efe2;font:500 .82rem/1 "Inter Tight",system-ui,sans-serif;'
      + 'text-decoration:none;cursor:pointer;'
      + 'backdrop-filter:saturate(140%) blur(4px);'
      + '-webkit-backdrop-filter:saturate(140%) blur(4px);'
      + 'transition:background .15s ease,border-color .15s ease,transform .15s ease}'
      + '#po-dash-back:hover{background:rgba(120,188,156,.16);border-color:rgba(120,188,156,.55);transform:translateX(-2px);color:#f5efe2}'
      + '#po-dash-back:focus-visible{outline:2px solid #78bc9c;outline-offset:2px}'
      + '#po-dash-back .po-bk-arrow{font-size:1em;line-height:1;display:inline-block;transition:transform .15s ease}'
      + '#po-dash-back:hover .po-bk-arrow{transform:translateX(-2px)}'
      + 'html[data-theme="light"] #po-dash-back{background:rgba(31,107,126,.08);border-color:rgba(31,107,126,.32);color:#1F6B7E}'
      + 'html[data-theme="light"] #po-dash-back:hover{background:rgba(31,107,126,.14);border-color:rgba(31,107,126,.55);color:#1F6B7E}'
      + '@media (prefers-reduced-motion: reduce){#po-dash-back,#po-dash-back .po-bk-arrow{transition:none!important;transform:none!important}}'
      + '@media print{#po-dash-back{display:none!important}}'
    );
    document.head.appendChild(s);

    var a = document.createElement('a');
    a.id = 'po-dash-back';
    a.href = '/dashboard/portal';
    a.setAttribute('aria-label', 'Back to board portal');
    a.innerHTML = '<span class="po-bk-arrow" aria-hidden="true">←</span> <span>Portal</span>';
    document.body.appendChild(a);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inject);
  } else {
    inject();
  }
  /* Re-injection guard if dashboard.js wipes the DOM later */
  setTimeout(inject, 1500);
  setTimeout(inject, 5000);
}();


/* === A11y + QI bundle (2026-05-06)
   - JSON-LD Organization + WebSite schema (site-wide)
   - Skip-link element (one is rendered, target #main)
   - <main> landmark wrap when not already present
   - Nav aria-label patches
   - File input aria-label patches on /about/jobs
   - Tap-target size CSS bumps (≥44x44 per WCAG 2.5.5) */
!function(){
  /* JSON-LD: Organization + WebSite. Injected once, idempotent. */
  if (!document.querySelector('script[type="application/ld+json"][data-po="org-schema"]')) {
    var orgSchema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Organization",
          "@id": "https://www.painontario.ca/#organization",
          "name": "Pain Ontario",
          "url": "https://www.painontario.ca/",
          "logo": "https://www.painontario.ca/images/painontario-logo.svg",
          "description": "Pain Ontario is a community-based nonprofit working to transform how pain is understood and cared for across Ontario, grounded in lived and living experience.",
          "sameAs": [
            "https://www.linkedin.com/company/pain-ontario",
            "https://twitter.com/painontario"
          ]
        },
        {
          "@type": "WebSite",
          "@id": "https://www.painontario.ca/#website",
          "url": "https://www.painontario.ca/",
          "name": "Pain Ontario",
          "publisher": { "@id": "https://www.painontario.ca/#organization" },
          "inLanguage": "en-CA"
        }
      ]
    };
    var s1 = document.createElement('script');
    s1.setAttribute('type', 'application/ld+json');
    s1.setAttribute('data-po', 'org-schema');
    s1.textContent = JSON.stringify(orgSchema);
    document.head.appendChild(s1);
  }

  /* Tap-target size + a11y CSS */
  if (!document.querySelector('style[data-po="a11y-tap-skip"]')) {
    var s2 = document.createElement('style');
    s2.setAttribute('data-po', 'a11y-tap-skip');
    s2.textContent = (
      /* Skip link: visible on focus only */
      '.po-skip-link{position:absolute;left:1rem;top:-3rem;z-index:10000;'
      + 'background:#1F6B7E;color:#fff;padding:.7rem 1rem;'
      + 'border-radius:.5rem;font:600 .9rem/1 "Inter Tight",system-ui,sans-serif;'
      + 'text-decoration:none;transition:top .15s ease}'
      + '.po-skip-link:focus,.po-skip-link:focus-visible{top:1rem;outline:2px solid #fff;outline-offset:2px}'
      + 'html[data-theme="dark"] .po-skip-link,html[data-theme="dark"] .po-skip-link:focus,html[data-theme="dark"] .po-skip-link:focus-visible{background:#78bc9c!important;color:#0e1320!important}'
      /* Tap target floor: 44px for nav links + buttons + tile arrows.
         Conservative — only widens when below floor; leaves text rules alone. */
      + '@media (max-width:991px){'
      +   '.w-nav-link,.w-nav-menu a,nav a,.po-fab,.po-tt,.po-mn-trigger,'
      +   '.po-mn-close,button[aria-label="Close menu"]{'
      +     'min-height:44px!important;min-width:44px!important;'
      +     'display:inline-flex;align-items:center;justify-content:center}'
      + '}'
      /* Reduced motion: kill-switch (audit said only 3 in 40KB CSS) */
      + '@media (prefers-reduced-motion: reduce){'
      +   '*,*::before,*::after{'
      +     'animation-duration:0.001ms!important;'
      +     'animation-iteration-count:1!important;'
      +     'transition-duration:0.001ms!important;'
      +     'scroll-behavior:auto!important}'
      + '}'
    );
    document.head.appendChild(s2);
  }

  /* Skip-link element + main landmark, idempotent */
  function injectA11yLandmarks(){
    if (!document.body) return;
    /* Skip link: render once at top of body, point to #main */
    if (!document.querySelector('.po-skip-link')) {
      var sl = document.createElement('a');
      sl.className = 'po-skip-link';
      sl.href = '#main';
      sl.textContent = 'Skip to main content';
      document.body.insertBefore(sl, document.body.firstChild);
    }
    /* If no <main> exists, find the first <section> after the nav and wrap with id="main" */
    if (!document.querySelector('main, [role="main"], #main')) {
      var firstSection = null;
      var children = document.body.children;
      var inMain = false;
      for (var i = 0; i < children.length; i++) {
        var c = children[i];
        if (c.tagName === 'NAV' || c.classList.contains('w-nav') || c.classList.contains('navbar')) { inMain = true; continue; }
        if (inMain && (c.tagName === 'SECTION' || c.classList.contains('section') || c.classList.contains('hero') || c.classList.contains('page-hero'))) { firstSection = c; break; }
      }
      if (firstSection && !firstSection.id) {
        firstSection.id = 'main';
        firstSection.setAttribute('role', 'main');
      }
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectA11yLandmarks);
  } else {
    injectA11yLandmarks();
  }
  setTimeout(injectA11yLandmarks, 1500);

  /* Nav aria-labels (don't override existing) */
  function labelNavs(){
    var headerNav = document.querySelector('header nav, .navbar nav, nav.w-nav, nav.navbar');
    if (headerNav && !headerNav.getAttribute('aria-label')) {
      headerNav.setAttribute('aria-label', 'Site primary navigation');
    }
    var footerNav = document.querySelector('footer nav, .footer nav');
    if (footerNav && !footerNav.getAttribute('aria-label')) {
      footerNav.setAttribute('aria-label', 'Footer navigation');
    }
    var dropdowns = document.querySelectorAll('nav .w-dropdown-list');
    Array.prototype.forEach.call(dropdowns, function(d){
      if (!d.getAttribute('aria-label')) {
        var trigger = d.parentElement && d.parentElement.querySelector('.w-dropdown-toggle');
        var label = trigger ? (trigger.textContent || '').trim() : 'Submenu';
        d.setAttribute('aria-label', label + ' submenu');
      }
    });
  }
  labelNavs();
  setTimeout(labelNavs, 1200);

  /* /about/jobs file inputs aria-label */
  if (/^\/about\/jobs(\/|$)/.test(location.pathname)) {
    function labelFiles(){
      var resume = document.querySelector('input[type="file"][name="Resume"]');
      var cover = document.querySelector('input[type="file"][name="Cover-Letter"]');
      if (resume && !resume.getAttribute('aria-label')) {
        resume.setAttribute('aria-label', 'Upload your resume (PDF, DOC, or DOCX, max 5 MB)');
      }
      if (cover && !cover.getAttribute('aria-label')) {
        cover.setAttribute('aria-label', 'Upload your cover letter (optional)');
      }
    }
    labelFiles();
    setTimeout(labelFiles, 1500);
    setTimeout(labelFiles, 4000);
  }

  /* /by-audience tile aria-labels (audit P1) */
  if (/^\/by-audience|^\/resource-library\/by-audience/.test(location.pathname)) {
    function labelAudienceTiles(){
      var tiles = document.querySelectorAll('.audience-card');
      Array.prototype.forEach.call(tiles, function(tile){
        if (tile.getAttribute('aria-label')) return;
        var title = tile.querySelector('.audience-card__title, h2, h3');
        var t = title ? (title.textContent || '').trim() : '';
        if (t) tile.setAttribute('aria-label', 'Resources for ' + t);
      });
    }
    labelAudienceTiles();
    setTimeout(labelAudienceTiles, 1500);
  }
}();


/* === OG meta polish (2026-05-06)
   News detail pages serve <meta property="og:type" content="website"> by
   Webflow default. Override to "article" so LinkedIn/FB/Slack/Twitter
   render the rich news preview correctly. JS-injected — most modern
   social crawlers (LI, FB, Slack, X) execute JS before scraping OG. */
!function(){
  /* News detail URL shape: /news/<slug> per Webflow CMS template path */
  if (!/^\/news\/[a-z0-9-]+/.test(location.pathname)) return;
  if (document.querySelector('meta[property="og:type"][data-po="news-article"]')) return;

  function setOg(prop, content){
    var existing = document.querySelector('meta[property="' + prop + '"]');
    if (existing) {
      existing.setAttribute('content', content);
      existing.setAttribute('data-po', 'news-article');
    } else {
      var m = document.createElement('meta');
      m.setAttribute('property', prop);
      m.setAttribute('content', content);
      m.setAttribute('data-po', 'news-article');
      document.head.appendChild(m);
    }
  }
  setOg('og:type', 'article');

  /* Add NewsArticle JSON-LD if not present (one block, idempotent) */
  if (!document.querySelector('script[type="application/ld+json"][data-po="news-article-schema"]')) {
    var titleEl = document.querySelector('h1');
    var dateEl = document.querySelector('[class*="date"], time');
    var descMeta = document.querySelector('meta[name="description"]');
    var imageMeta = document.querySelector('meta[property="og:image"]');
    var schema = {
      "@context": "https://schema.org",
      "@type": "NewsArticle",
      "headline": (titleEl ? (titleEl.textContent || '').trim() : document.title).slice(0, 110),
      "description": descMeta ? descMeta.getAttribute('content') : '',
      "datePublished": dateEl ? (dateEl.getAttribute('datetime') || (dateEl.textContent || '').trim()) : '',
      "image": imageMeta ? imageMeta.getAttribute('content') : '',
      "author": { "@type": "Organization", "name": "Pain Ontario" },
      "publisher": { "@id": "https://www.painontario.ca/#organization" },
      "mainEntityOfPage": { "@type": "WebPage", "@id": location.href }
    };
    var s = document.createElement('script');
    s.setAttribute('type', 'application/ld+json');
    s.setAttribute('data-po', 'news-article-schema');
    s.textContent = JSON.stringify(schema);
    document.head.appendChild(s);
  }
}();

/* ----------------------------------------------------------------
   pop_logo_plate_v1 (2026-05-06)
   Adult POP portal logo (Logo5_revised-removebg-preview.png) was
   exported with the white hand stripped to transparency, so on the
   dark-mode resource-library page the hand vanishes into the navy
   background. Drop a soft cream rounded plate behind both POP logo
   wrappers in dark mode so the light/transparent areas read white
   against a consistent surface, matching the rest of the dark theme.
   Path-gated to /resource-library/.
---------------------------------------------------------------- */
(function(){
  if (!/^\/resource-library\b/.test(location.pathname)) return;
  if (document.documentElement.getAttribute('data-po-pop-plate') === 'v1') return;
  document.documentElement.setAttribute('data-po-pop-plate', 'v1');
  var css =
    'html[data-theme="dark"] .inline-section-0 .div-block-19{'+
      'background-color:#f5ecd2;'+
      'border-radius:18px;'+
      'padding:14px;'+
      'display:inline-block;'+
      'box-shadow:0 1px 0 rgba(255,255,255,.04) inset, 0 2px 10px rgba(0,0,0,.18);'+
    '}'+
    'html[data-theme="dark"] .inline-section-0 .div-block-19 img{'+
      'display:block;'+
      'background:transparent!important;'+
    '}';
  var s = document.createElement('style');
  s.setAttribute('data-po', 'pop-logo-plate');
  s.textContent = css;
  document.head.appendChild(s);
})();

/* navdarkbrand-v1 — dark-mode nav: sage active dot + hover pill (Pain Ontario circular brand). */
(function(){
  if(document.querySelector('style[data-po="navdarkbrand-v1"]'))return;
  var css = [
    /* Active link — sage filled dot, drop italic + underline */
    'html[data-theme="dark"] .navbar a.w--current,',
    'html[data-theme="dark"] .navbar [aria-current="page"]{',
      'position:relative;',
      'font-style:normal!important;',
      'text-decoration:none!important;',
      'padding-left:1.15rem!important;',
      'color:var(--po-accent,#b6d6c8)!important;',
    '}',
    'html[data-theme="dark"] .navbar a.w--current::before,',
    'html[data-theme="dark"] .navbar [aria-current="page"]::before{',
      'content:"";',
      'position:absolute;',
      'left:0;',
      'top:50%;',
      'transform:translateY(-50%);',
      'width:.55rem;height:.55rem;',
      'border-radius:50%;',
      'background:var(--po-accent,#b6d6c8);',
      'box-shadow:0 0 0 4px rgba(120,188,156,.18);',
    '}',
    /* Nav links — pill on hover */
    'html[data-theme="dark"] .navbar .nav-menu a,',
    'html[data-theme="dark"] .navbar .nav-link,',
    'html[data-theme="dark"] .navbar .w-nav-link{',
      'border-radius:999px;',
      'padding:.4rem .85rem!important;',
      'transition:background-color .15s ease, color .15s ease;',
    '}',
    'html[data-theme="dark"] .navbar .nav-menu a:hover,',
    'html[data-theme="dark"] .navbar .nav-link:hover,',
    'html[data-theme="dark"] .navbar .w-nav-link:hover{',
      'background-color:rgba(120,188,156,.14)!important;',
      'color:#fff!important;',
    '}',
    /* Slightly more space between brand block and nav menu */
    'html[data-theme="dark"] .navbar .container-8,',
    'html[data-theme="dark"] header.navbar > [class*="container"]{',
      'gap:1.4rem;',
    '}'
  ].join('');
  var s = document.createElement('style');
  s.setAttribute('data-po','navdarkbrand-v1');
  s.textContent = css;
  document.head.appendChild(s);
})();

/* navdarkdots-v1 — sage + warm dot cluster in dark-mode navbar (PO motif). */
(function(){
  if(document.querySelector('style[data-po="navdarkdots-v1"]'))return;
  var css = [
    '.po-nav-dots{',
      'position:absolute;right:10rem;top:50%;transform:translateY(-50%);',
      'display:none;align-items:center;gap:.55rem;',
      'pointer-events:none;z-index:1;',
    '}',
    '@media(min-width:992px){html[data-theme="dark"] .po-nav-dots{display:flex}}',
    '.po-nav-dots span{',
      'display:block;width:.42rem;height:.42rem;border-radius:50%;',
      'opacity:.78;',
    '}',
    '.po-nav-dots .d-sage{background:#78bc9c}',
    '.po-nav-dots .d-sage-soft{background:#b5d9c5}',
    '.po-nav-dots .d-warm{background:#bf8a60}',
    /* Slightly larger right-edge breathing room to host the dots */
    '@media(min-width:992px){html[data-theme="dark"] .navbar{position:relative}}'
  ].join('');
  var s = document.createElement('style');
  s.setAttribute('data-po','navdarkdots-v1');
  s.textContent = css;
  document.head.appendChild(s);

  function place(){
    var navs = document.querySelectorAll('.navbar');
    navs.forEach(function(nav){
      if(nav.querySelector('.po-nav-dots'))return;
      var d = document.createElement('div');
      d.className = 'po-nav-dots';
      d.setAttribute('aria-hidden','true');
      d.innerHTML = '<span class="d-sage"></span>'
                  + '<span class="d-warm"></span>'
                  + '<span class="d-sage-soft"></span>'
                  + '<span class="d-sage"></span>'
                  + '<span class="d-warm"></span>';
      nav.appendChild(d);
    });
  }
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded', place);
  }else{ place(); }
  setTimeout(place, 300);
  setTimeout(place, 1500);
})();

