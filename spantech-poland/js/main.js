/* ── mobile navigation drawer ──────────────────────────────────────────
   The header burger opens a slide-in panel below 1080px. Flyouts become
   tap-to-open accordions; hover alone is not a touch gesture. ──────── */
(function(){
  var toggle = document.querySelector('.mobtoggle');
  var nav    = document.querySelector('nav.main');
  var scrim  = document.getElementById('navscrim');
  if (!toggle || !nav) return;

  toggle.setAttribute('aria-expanded','false');
  toggle.setAttribute('aria-controls','mainnav');
  nav.id = 'mainnav';

  function setOpen(open){
    document.body.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
  }
  function isDrawer(){ return window.matchMedia('(max-width:1080px)').matches; }

  toggle.addEventListener('click', function(e){
    e.preventDefault();
    setOpen(!document.body.classList.contains('nav-open'));
  });
  if (scrim) scrim.addEventListener('click', function(){ setOpen(false); });
  /* the drawer covers the burger, so it carries its own close button */
  var close = nav.querySelector('.navclose');
  if (close) close.addEventListener('click', function(){ setOpen(false); });

  /* parent items with a flyout become accordions inside the drawer */
  nav.querySelectorAll(':scope > .item').forEach(function(item){
    var link = item.querySelector(':scope > a');
    var panel = item.querySelector(':scope > .mega, :scope > .submenu');
    if (!link || !panel) return;
    link.addEventListener('click', function(e){
      if (!isDrawer()) return;
      e.preventDefault();
      var open = item.classList.contains('is-open');
      nav.querySelectorAll(':scope > .item.is-open').forEach(function(o){ o.classList.remove('is-open'); });
      item.classList.toggle('is-open', !open);
    });
  });

  /* following a real link closes the drawer */
  nav.addEventListener('click', function(e){
    var a = e.target.closest('a');
    if (!a || !isDrawer()) return;
    if (a.parentElement && a.parentElement.classList.contains('item') &&
        a.parentElement.querySelector('.mega, .submenu')) return;
    setOpen(false);
  });

  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape') {
      setOpen(false);
      nav.querySelectorAll('.item.is-open').forEach(function(o){ o.classList.remove('is-open'); });
    }
  });

  /* resizing back up to desktop must not leave a locked page */
  window.addEventListener('resize', function(){
    if (!isDrawer()) {
      setOpen(false);
      nav.querySelectorAll('.item.is-open').forEach(function(o){ o.classList.remove('is-open'); });
    }
  });
})();

/* ── motion ────────────────────────────────────────────────────────────
   Scroll reveal, counters, condensing header, back-to-top. All of it
   no-ops when the OS asks for reduced motion. ──────────────────────── */
(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* which elements animate in, and how they stagger within a group */
  var GROUPS = [
    ['.cband-head > *', 70],
    ['.cstat', 80],
    ['.sec-head', 0],
    ['.tile', 70],
    ['.ind', 60],
    ['.prod', 60],
    ['.res-card', 90],
    ['.band-cell', 0],
    ['.why-img, .why .why-item', 80],
    ['.story > div, .story-media', 90],
    ['.tl-row', 70],
    ['.pillar', 70],
    ['.person', 80],
    ['.office', 70],
    ['.value', 70],
    ['.dcount', 0],
    ['.feat', 0],
    ['.post', 50],
    ['.mapwrap', 0],
    ['.pcta .wrap > *', 90]
  ];

  function mark(root){
    GROUPS.forEach(function(g){
      var sel = g[0], step = g[1];
      root.querySelectorAll(sel).forEach(function(el){
        if (el.classList.contains('reveal')) return;
        el.classList.add('reveal');
        /* stagger counts from zero within each parent, so every row
           of tiles or cards cascades rather than the whole page */
        var parent = el.parentElement;
        if (parent.__revealIdx === undefined) parent.__revealIdx = 0;
        var idx = parent.__revealIdx++;
        if (step) el.style.setProperty('--d', Math.min(idx * step, 400) + 'ms');
      });
    });
  }

  var io = null;
  if ('IntersectionObserver' in window && !reduce) {
    io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        io.unobserve(en.target);
        if (en.target.dataset.count) countUp(en.target);
      });
    }, {rootMargin: '0px 0px -8% 0px', threshold: 0.12});
  }

  function observe(root){
    root.querySelectorAll('.reveal').forEach(function(el){
      if (el.classList.contains('in')) return;
      if (io) io.observe(el); else el.classList.add('in');
    });
    root.querySelectorAll('[data-count]').forEach(function(el){
      if (io) io.observe(el); else el.textContent = el.dataset.count + (el.dataset.suffix || '');
    });
  }

  /* ── counters: only on plain integers, and never on a year ── */
  function prepCounters(root){
    root.querySelectorAll('.cstat b, .stats .stat b, .dcount b').forEach(function(el){
      if (el.dataset.count) return;
      var raw = el.textContent.trim();
      var m = raw.match(/^(\d+)(\D*)$/);
      if (!m) return;
      var n = parseInt(m[1], 10);
      if (n > 1900) return;            /* 1977 is a date, not a quantity */
      el.dataset.count = String(n);
      el.dataset.suffix = m[2] || '';
      if (!reduce) { el.textContent = '0' + (m[2] || ''); el.classList.add('reveal'); }
    });
  }

  function countUp(el){
    var target = parseInt(el.dataset.count, 10), suffix = el.dataset.suffix || '';
    if (reduce) { el.textContent = target + suffix; return; }
    var dur = 900, t0 = null;
    function frame(t){
      if (t0 === null) t0 = t;
      var p = Math.min((t - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(frame);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(frame);
  }

  function scan(root){
    root = root || document;
    prepCounters(root);
    mark(root);
    observe(root);
  }
  window.__revealScan = scan;
  scan(document);

  /* ── condensing header + back-to-top ── */
  var top = document.getElementById('totop');
  var ticking = false;
  function onScroll(){
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function(){
      var y = window.pageYOffset;
      document.body.classList.toggle('scrolled', y > 40);
      document.body.classList.toggle('scrolled-far', y > 700);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();
  if (top) top.addEventListener('click', function(){
    window.scrollTo({top:0, behavior: reduce ? 'auto' : 'smooth'});
  });
})();

/* ── images fade in once loaded ────────────────────────────────────────
   Only images still loading get the class, so cached ones never flash. */
(function(){
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('main img').forEach(function(img){
    if (img.complete && img.naturalWidth > 0) return;
    img.classList.add('img-wait');
    img.addEventListener('load', function(){
      img.classList.remove('img-wait'); img.classList.add('img-in');
    }, {once: true});
    img.addEventListener('error', function(){ img.classList.remove('img-wait'); }, {once: true});
  });
})();

/* ── image fallback ────────────────────────────────────────────────────
   Images are hot-linked from spantech.co.uk. If the recipient's network
   blocks it, or the file is opened in an email preview pane, mark the
   container so CSS can show the alt text instead of a broken icon. ─── */
(function(){
  function fail(img){
    var box = img.parentElement;
    if (!box || box.classList.contains('imgfail')) return;
    box.classList.add('imgfail');
    box.setAttribute('data-label', img.getAttribute('alt') || 'Image unavailable');
  }
  function check(img){
    if (img.complete && img.naturalWidth === 0) fail(img);
  }
  document.querySelectorAll('img').forEach(function(img){
    img.addEventListener('error', function(){ fail(img); });
    check(img);
    /* lazy images may not have started yet — re-check once settled */
    img.addEventListener('load', function(){ if (img.naturalWidth === 0) fail(img); });
  });
  window.addEventListener('load', function(){
    document.querySelectorAll('img').forEach(check);
  });
})();

/* ── newsletter signup (footer) ────────────────────────────────────────
   On Odoo the email goes to the mailing list "Spantech Products Ltd
   Newsletter" (id 1) through Odoo's own website_mass_mailing route.
   In the static preview there is no server, so it only shows a note. ── */
(function(){
  var LIST_ID = 1;
  document.querySelectorAll('form.nform').forEach(function(form){
    var input = form.querySelector('input[type=email]');
    var btn = form.querySelector('button');
    var msg = document.createElement('p');
    msg.className = 'nform-msg'; msg.setAttribute('role','status');
    form.appendChild(msg);
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var email = (input.value || '').trim();
      if (!input.checkValidity() || !email) { msg.textContent = 'Please enter a valid email address.'; input.focus(); return; }
      if (location.protocol === 'file:') { msg.textContent = 'Preview only: on the live site this subscribes ' + email + '.'; return; }
      btn.disabled = true;
      fetch('/website_mass_mailing/subscribe', {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({jsonrpc: '2.0', method: 'call', params: {list_id: LIST_ID, value: email, subscription_type: 'email'}})
      }).then(function(r){ return r.json(); }).then(function(j){
        var ok = j && j.result && j.result.toast_type !== 'danger';
        msg.textContent = ok ? 'Thank you, you are subscribed.' : ((j && j.result && j.result.toast_content) || 'Sorry, something went wrong. Please email sales@spantech.co.uk.');
        if (ok) input.value = '';
      }).catch(function(){
        msg.textContent = 'Sorry, something went wrong. Please email sales@spantech.co.uk.';
      }).then(function(){ btn.disabled = false; });
    });
  });
})();

/* ══ ACCESSIBILITY FOR ODOO'S OWN PAGES (shop, product, blog) ══
   Odoo's templates and older content blocks skip heading levels, leave the quantity and search
   fields without a label and put tabs in a list without roles. Nothing changes visually. */
(function(){
  var wrap = document.getElementById('wrap');
  if (!wrap) return;                                   // only on the Odoo site, not in the preview
  wrap.querySelectorAll('input[name="add_qty"]:not([aria-label])').forEach(function(i){ i.setAttribute('aria-label', 'Quantity'); });
  document.querySelectorAll('input[type="search"]:not([aria-label])').forEach(function(i){
    if (!(i.id && document.querySelector('label[for="' + i.id + '"]'))) i.setAttribute('aria-label', 'Search');
  });
  wrap.querySelectorAll('[role="tablist"] > li:not([role])').forEach(function(li){ li.setAttribute('role', 'presentation'); });
  // headings: a level that skips (h1 -> h6) gets aria-level with the right one
  var stek = [];
  wrap.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach(function(h){
    var nivo = +h.tagName.charAt(1);
    while (stek.length && stek[stek.length - 1][0] >= nivo) stek.pop();
    var roditelj = stek.length ? stek[stek.length - 1][1] : 0;
    var pravi = +h.getAttribute('aria-level') || (roditelj ? Math.min(nivo, roditelj + 1) : nivo);
    if (pravi !== nivo && !h.hasAttribute('aria-level')) h.setAttribute('aria-level', pravi);
    stek.push([nivo, pravi]);
  });
})();
