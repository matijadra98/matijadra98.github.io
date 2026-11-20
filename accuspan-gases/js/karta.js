/* Mapa pokrivenosti AccuSpan Gases — isti princip kao mapa distributera na Spantech sajtu (SPL/Website/izvor/js/karta.js).
   Korisnik 20.11.2026: India pokriva Indiju i Aziju, EU hub Evropu, UK firma ostatak sveta.
   Adrese, telefoni i mejlovi su sa accuspangases.com (contactus, accuspan-gases-india, accuspan-eu-distribution-hub). */
(function(){
  var REGIONS = [
    { key:'uk', label:'UK & Rest of World', name:'United Kingdom & Rest of World',
      org:'AccuSpan Gases UK', badge:'Manufacturing & head office',
      cov:'United Kingdom and all countries outside Europe and Asia',
      addr:'Unit 1a, Britannic Works, Broom Street, Hanley, Stoke-on-Trent, ST1 2ER, United Kingdom',
      tel:'+44 (0) 1782 616611', email:'info@accuspangases.com',
      note:'Many products are held in stock at our UK manufacturing plant and can be shipped next day.',
      page:'accuspan-gases-uk.html', pin:[-2.18,53.02], pinLabel:'Stoke', lab:[-9,4,'end'], countries:['United Kingdom','Isle of Man','Guernsey','Jersey'] },
    { key:'eu', label:'Europe', name:'Europe',
      org:'AccuSpan Gases EU Distribution Hub', badge:'Distribution hub',
      cov:'Europe — the Benelux region and the wider European Union',
      addr:'Spijkenisse, near Rotterdam, Netherlands',
      tel:'+44 (0) 1782 616611', email:'sales@accuspangases.com',
      note:'Reduce delivery times, lower shipping costs and respond quickly to customer needs in Benelux and the EU.',
      page:'accuspan-eu-distribution-hub.html', pin:[4.33,51.85], pinLabel:'Spijkenisse', lab:[9,-9,'start'],
      countries:['Albania','Austria','Belarus','Belgium','Bosnia and Herz.','Bulgaria','Croatia','Cyprus','N. Cyprus','Czechia','Denmark',
        'Estonia','Finland','France','Germany','Greece','Hungary','Iceland','Ireland','Italy','Kosovo','Latvia','Lithuania','Luxembourg',
        'Macedonia','Moldova','Montenegro','Netherlands','Norway','Poland','Portugal','Romania','Serbia','Slovakia','Slovenia','Spain',
        'Sweden','Switzerland','Ukraine','Russia','Andorra','Liechtenstein','Malta','Monaco','San Marino','Vatican','Faeroe Is.','Åland'] },
    { key:'in', label:'India & Asia', name:'India & Asia',
      org:'AccuSpan Calgas India Pvt Ltd', badge:'AccuSpan Gases India',
      cov:'India and Asia',
      addr:'Mumbai Headquarters: Dinsha Orchid CHS, Ulwe, Raigad, Maharashtra · Kolkata Sales Office: Salt Lake City, Kolkata',
      tel:'+91 810 8728 771', email:'nilesh.bangar@accuspangases.com',
      note:'Semiconductor and Solar PV specialty gases, calibration gases and accessories.',
      page:'accuspan-gases-india.html', pin:[73.03,18.97], pinLabel:'Mumbai', lab:[0,-16,'middle'],
      countries:['India','Afghanistan','Armenia','Azerbaijan','Bangladesh','Bhutan','Brunei','Cambodia','China','Georgia','Indonesia','Iran',
        'Iraq','Israel','Japan','Jordan','Kazakhstan','Kuwait','Kyrgyzstan','Laos','Lebanon','Malaysia','Mongolia','Myanmar','Nepal',
        'North Korea','Oman','Pakistan','Palestine','Philippines','Qatar','Saudi Arabia','South Korea','Sri Lanka','Syria','Taiwan',
        'Tajikistan','Thailand','Timor-Leste','Turkey','Turkmenistan','United Arab Emirates','Uzbekistan','Vietnam','Yemen',
        'Bahrain','Hong Kong','Macao','Maldives','Singapore','Siachen Glacier'] }
  ];
  var byCountry = {}, byKey = {};
  REGIONS.forEach(function(r){ byKey[r.key] = r; r.countries.forEach(function(c){ byCountry[c] = r.key; }); });
  function regionOf(name){ return byCountry[name] || 'uk'; }   // sve ostalo pokriva UK

  var tabs = document.getElementById('regionTabs');
  var panel = document.getElementById('mappanel');
  var stage = document.querySelector('.mapstage');
  var tip = document.getElementById('maptip');
  if (!tabs || !panel || !stage) return;
  var current = 'uk';

  var I = {
    pin:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
    tel:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 4h4l2 5-2.5 1.5a12 12 0 005 5L15 13l5 2v4a1 1 0 01-1 1A16 16 0 014 5a1 1 0 011-1z"/></svg>',
    mail:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>',
    info:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>'
  };
  var ARR = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 8h11M9 4l4 4-4 4"/></svg>';

  function render(key){
    current = key;
    var r = byKey[key];
    panel.className = 'mappanel k-' + key;
    panel.innerHTML =
      '<span class="pbadge">' + r.badge + '</span>' +
      '<h3>' + r.org + '</h3>' +
      '<div class="pcov">Covers: ' + r.cov + '</div>' +
      '<div class="prow">' + I.pin + '<span>' + r.addr + '</span></div>' +
      '<div class="prow">' + I.tel + '<a href="tel:' + r.tel.replace(/\(0\)|[^0-9+]/g,'') + '">' + r.tel + '</a></div>' +
      '<div class="prow">' + I.mail + '<a href="mailto:' + r.email + '">' + r.email + '</a></div>' +
      '<div class="prow">' + I.info + '<span>' + r.note + '</span></div>' +
      '<div class="pfoot"><a href="contactus.html" class="btn btn-primary">Contact us ' + ARR + '</a>' +
      '<a href="' + r.page + '" class="btn btn-ghost">' + r.org.replace('AccuSpan Calgas India Pvt Ltd','AccuSpan Gases India') + '</a></div>';
    Array.prototype.forEach.call(tabs.children, function(b){ b.classList.toggle('on', b.dataset.k === key); });
    if (window.__paint) window.__paint(key);
  }

  REGIONS.forEach(function(r){
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'rtab k-' + r.key; b.innerHTML = '<i></i>' + r.label; b.dataset.k = r.key;
    b.onclick = function(){ render(r.key); };
    tabs.appendChild(b);
  });
  render('uk');

  function fail(){ document.getElementById('mapfallback').style.display = 'flex'; }
  function loadScript(src){
    return new Promise(function(ok, ko){ var s = document.createElement('script'); s.src = src; s.async = true; s.onload = ok; s.onerror = ko; document.head.appendChild(s); });
  }
  function libs(){
    if (window.d3 && window.topojson) return Promise.resolve();
    return loadScript('https://cdnjs.cloudflare.com/ajax/libs/d3/7.8.5/d3.min.js')
      .then(function(){ return loadScript('https://cdnjs.cloudflare.com/ajax/libs/topojson/3.0.2/topojson.min.js'); });
  }
  function whenNear(el, fn){
    if (!('IntersectionObserver' in window)) { fn(); return; }
    var io = new IntersectionObserver(function(es){ if (es.some(function(e){ return e.isIntersecting; })) { io.disconnect(); fn(); } }, { rootMargin:'400px 0px' });
    io.observe(el);
  }
  whenNear(stage, function(){ libs().then(start, fail); });

  function start(){
    if (!window.d3 || !window.topojson) { fail(); return; }
    d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/countries-50m.json').then(function(world){
      var feats = topojson.feature(world, world.objects.countries).features.filter(function(f){ return f.properties.name !== 'Antarctica'; });
      var svg = d3.select('#worldmap'), g = svg.append('g'), gPins = svg.append('g');
      svg.attr('preserveAspectRatio', 'xMidYMid meet');
      function draw(){
        var w = stage.clientWidth, h = stage.clientHeight;
        svg.attr('viewBox', '0 0 ' + w + ' ' + h);
        // Merkator, kao na atlasu: oblici zemalja verni; krajnji sever i jug odsečeni (od 58° J do 80° S)
        var proj = d3.geoMercator().fitExtent([[6, 6], [w - 6, h - 6]], { type:'MultiPoint', coordinates:[[-180, -58], [180, 80]] });
        var path = d3.geoPath(proj);
        var sel = g.selectAll('path').data(feats);
        sel.enter().append('path')
          .on('mousemove', function(ev, d){
            var rect = stage.getBoundingClientRect();
            tip.textContent = d.properties.name + ' — ' + byKey[regionOf(d.properties.name)].org;
            tip.style.left = (ev.clientX - rect.left) + 'px'; tip.style.top = (ev.clientY - rect.top) + 'px'; tip.style.opacity = 1;
          })
          .on('mouseleave', function(){ tip.style.opacity = 0; })
          .on('click', function(ev, d){ render(regionOf(d.properties.name)); })
          .merge(sel)
          .attr('d', path)
          .attr('class', function(d){ return 'c k-' + regionOf(d.properties.name); })
          .attr('data-k', function(d){ return regionOf(d.properties.name); });
        gPins.selectAll('*').remove();
        REGIONS.forEach(function(r){
          var p = proj(r.pin); if (!p) return;
          gPins.append('circle').attr('class','halo').attr('cx',p[0]).attr('cy',p[1]).attr('r',9);
          gPins.append('circle').attr('class','pin').attr('cx',p[0]).attr('cy',p[1]).attr('r',4.5).style('cursor','pointer').on('click', function(){ render(r.key); });
          gPins.append('text').attr('class','plab').attr('x',p[0]+r.lab[0]).attr('y',p[1]+r.lab[1]).attr('text-anchor',r.lab[2]).text(r.pinLabel);
        });
        paint(current);
      }
      function paint(key){ g.selectAll('path').classed('dim', function(){ return this.getAttribute('data-k') !== key; }); }
      window.__paint = paint;
      draw();
      window.addEventListener('resize', function(){ clearTimeout(window.__mt); window.__mt = setTimeout(draw, 180); });
    }).catch(fail);
  }
})();
