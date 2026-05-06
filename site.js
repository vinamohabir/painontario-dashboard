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
!function(){var css=['html body .po-fab-stack{gap:.7rem!important;right:1.5rem!important;bottom:1.5rem!important;align-items:flex-end!important}','@media(min-width:768px){html body .po-fab-stack{bottom:5.5rem!important}}','html body button.po-tt,html body .po-fab,html body .po-fab-stack .po-tt{width:4rem!important;height:4rem!important;font-size:2rem!important;line-height:1!important;border-width:2px!important;box-shadow:0 8px 22px rgba(0,0,0,.24)!important}','@media(max-width:767px){html body button.po-tt,html body .po-fab,html body .po-fab-stack .po-tt{width:3.25rem!important;height:3.25rem!important;font-size:1.6rem!important}}','html body button.po-tt{display:flex!important}','html body .po-fab.po-up:not(.show){opacity:0!important;pointer-events:none!important}','html body .po-fab.po-up.show{opacity:1!important;pointer-events:auto!important}','html[data-theme="dark"] body button.po-tt,html[data-theme="dark"] body .po-fab{box-shadow:0 8px 26px rgba(0,0,0,.6)!important}','html body button.po-tt:hover,html body .po-fab:hover{transform:scale(1.06)!important}','.po-mode-chip{font:600 .72rem/1 system-ui,-apple-system,sans-serif;letter-spacing:.06em;text-transform:uppercase;padding:.32rem .65rem;border-radius:999px;background:#0f2540;color:#fff;box-shadow:0 4px 12px rgba(0,0,0,.18);user-select:none;pointer-events:auto;align-self:flex-end;opacity:0;transform:translateY(4px);transition:opacity .25s ease,transform .25s ease}','.po-mode-chip.show{opacity:1;transform:translateY(0)}','html[data-theme="dark"] .po-mode-chip{background:#b6d6c8;color:#0e1320;box-shadow:0 4px 14px rgba(0,0,0,.5)}'].join('');function inject(){if(!document.querySelector('style[data-po="bigtogglefinal"]')){var s=document.createElement('style');s.setAttribute('data-po','bigtogglefinal');s.textContent=css;document.head.appendChild(s);}}function adopt(){var stack=document.querySelector('.po-fab-stack');var tt=document.querySelector('.po-tt');if(stack && tt && tt.parentElement!==stack){stack.appendChild(tt);}}function chipText(){return document.documentElement.getAttribute('data-theme')==='dark'?'Dark mode':'Light mode';}var hideTimer=null;function flash(chip,duration){if(!chip)return;chip.textContent=chipText();chip.classList.add('show');if(hideTimer)clearTimeout(hideTimer);hideTimer=setTimeout(function(){chip.classList.remove('show');},duration||3000);}function ensureChip(initial){var stack=document.querySelector('.po-fab-stack');if(!stack)return;var chip=stack.querySelector('.po-mode-chip');if(!chip){chip=document.createElement('div');chip.className='po-mode-chip';chip.setAttribute('aria-live','polite');stack.insertBefore(chip,stack.firstChild);chip.addEventListener('mouseenter',function(){flash(chip,3000);});}chip.textContent=chipText();if(initial)flash(chip,3500);}function attachToggleHandler(){var tt=document.querySelector('.po-tt');if(!tt || tt.dataset.poChipBound)return;tt.dataset.poChipBound='1';tt.addEventListener('click',function(){setTimeout(function(){flash(document.querySelector('.po-mode-chip'),3000);},20);});}inject();adopt();ensureChip(true);attachToggleHandler();[120,400,1000,2000,4000].forEach(function(t){setTimeout(function(){inject();adopt();ensureChip(false);attachToggleHandler();},t);});new MutationObserver(function(){flash(document.querySelector('.po-mode-chip'),3000);}).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});}();

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

/* --- v2 additions: chip-strip restore + kicker-as-link + finsweet cmsfilter/cmssort loader --- */

/* Block 0: Finsweet cmsfilter + cmssort loader. cmsload (pagination) was already loaded by an App-applied script. cmsfilter loaded too late for cmsload's auto-init, so we explicitly re-init after the script lands. */
(function(){
  if (window.__poFinsweetLoaded) return;
  var needsFilter = !!document.querySelector('[fs-cmsfilter-element], [fs-cmsfilter-field]');
  var needsSort   = !!document.querySelector('[fs-cmssort-element], [fs-cmssort-field]');
  if (!needsFilter && !needsSort) return;
  window.__poFinsweetLoaded = true;
  window.fsAttributes = window.fsAttributes || [];

  function load(src, onload){
    if (document.querySelector('script[src="' + src + '"]')) { onload && onload(); return; }
    var s = document.createElement('script');
    s.src = src; s.async = true; s.defer = true;
    s.onload = onload || null;
    document.head.appendChild(s);
  }

  function reInit(name){
    var mod = window.fsAttributes && window.fsAttributes[name];
    if (!mod) return;
    try { mod.destroy && mod.destroy(); } catch(e){}
    try { mod.init && mod.init(); } catch(e){}
  }

  if (needsFilter) {
    load('https://cdn.jsdelivr.net/npm/@finsweet/attributes-cmsfilter@1/cmsfilter.js', function(){
      [50, 300, 900, 2000].forEach(function(d){ setTimeout(function(){ reInit('cmsfilter'); }, d); });
    });
  }
  if (needsSort) {
    load('https://cdn.jsdelivr.net/npm/@finsweet/attributes-cmssort@1/cmssort.js', function(){
      [50, 300, 900, 2000].forEach(function(d){ setTimeout(function(){ reInit('cmssort'); }, d); });
    });
  }
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

/* Block B: kicker as page link (site-wide) */
(function(){
  if (document.querySelector('style[data-po="kicker-link-v1"]')) return;

  /* Map kicker text → destination. Lowercased keys. Add new entries here. */
  var KICKER_LINKS = {
    'open roles': '/about/jobs#open-roles',
    'open role':  '/about/jobs#open-roles',
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

  /* CSS — small uppercase, brand-coloured, link-styled */
  var s = document.createElement('style');
  s.setAttribute('data-po', 'kicker-link-v1');
  s.textContent = [
    'html .kicker[data-po-link],html a.kicker,html a .kicker,html .po-kicker[data-po-link]{cursor:pointer!important;text-decoration:none!important;color:#1F6B7E!important;letter-spacing:.08em!important;text-transform:uppercase!important;font-weight:600!important;display:inline-flex!important;align-items:center!important;gap:.4rem!important;border-radius:6px!important;padding:.1rem .15rem!important;transition:color .15s ease, background .15s ease, transform .15s ease!important}',
    'html .kicker[data-po-link]:hover,html a.kicker:hover .kicker,html a:hover>.kicker,html .po-kicker[data-po-link]:hover{color:#155a6c!important;background:rgba(31,107,126,0.06)!important;transform:translateX(2px)!important}',
    'html .kicker[data-po-link]:focus-visible,html .po-kicker[data-po-link]:focus-visible{outline:2px solid #1F6B7E!important;outline-offset:2px!important}',
    'html .kicker[data-po-link]::after,html .po-kicker[data-po-link]::after{content:" \\2192"!important;font-size:.85em!important;opacity:.6!important;transition:transform .15s ease, opacity .15s ease!important}',
    'html .kicker[data-po-link]:hover::after,html .po-kicker[data-po-link]:hover::after{opacity:1!important;transform:translateX(2px)!important}',
    'html[data-theme="dark"] .kicker[data-po-link],html[data-theme="dark"] .po-kicker[data-po-link]{color:#9bd6e8!important}',
    'html[data-theme="dark"] .kicker[data-po-link]:hover,html[data-theme="dark"] .po-kicker[data-po-link]:hover{color:#c5e7f1!important;background:rgba(155,214,232,0.08)!important}',
    '@media (prefers-reduced-motion: reduce){.kicker[data-po-link],.kicker[data-po-link]::after{transition:none!important;transform:none!important}.kicker[data-po-link]:hover{transform:none!important}.kicker[data-po-link]:hover::after{transform:none!important}}'
  ].join('');
  document.head.appendChild(s);

  function wireKickers(){
    var kickers = document.querySelectorAll('.kicker, .po-kicker');
    kickers.forEach(function(k){
      if (k.dataset.poLinkWired) return;
      /* If already inside an <a>, leave it alone */
      if (k.closest('a')) { k.dataset.poLinkWired = '1'; return; }
      /* Resolve destination: explicit data-href wins, then text-map lookup */
      var dest = k.getAttribute('data-href') || k.getAttribute('data-link-to') || '';
      if (!dest) {
        var t = (k.textContent || '').replace(/\s+/g,' ').trim().toLowerCase();
        dest = KICKER_LINKS[t] || '';
      }
      if (!dest) { k.dataset.poLinkWired = '1'; return; }
      k.setAttribute('data-po-link', '');
      k.setAttribute('role', 'link');
      k.setAttribute('tabindex', '0');
      k.style.cursor = 'pointer';
      k.addEventListener('click', function(e){
        if (e.target.closest('a')) return;
        location.href = dest;
      });
      k.addEventListener('keydown', function(e){
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          location.href = dest;
        }
      });
      k.dataset.poLinkWired = '1';
    });
  }
  wireKickers();
  [250, 800, 2000].forEach(function(t){ setTimeout(wireKickers, t); });

  /* Re-run when CMS lists or page sections render later */
  if (window.MutationObserver) {
    var debounceTimer = null;
    var mo = new MutationObserver(function(){
      if (debounceTimer) return;
      debounceTimer = setTimeout(function(){
        debounceTimer = null;
        wireKickers();
      }, 150);
    });
    /* Observe ONLY <main> if present, fall back to body. attributes:false to keep cost low. */
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
  max-width: none !important;
  margin-left: 0 !important;
  margin-right: 0 !important;
}

#resources-results-wrap {
  display: block !important;
  width: 100% !important;
  max-width: none !important;
  margin: 24px auto 0 !important;
  padding: 0 !important;
  grid-column: 1 / -1 !important;
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
