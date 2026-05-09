/* ═══════════════════════════════════════════════════════════════
   OTILIA PELÁEZ — ANIMACIONES PREMIUM v2
   Particles · 3D Tilt · Scroll Reveal · Parallax · HUD
═══════════════════════════════════════════════════════════════ */
(function(){
'use strict';

/* ── 1. CANVAS PARTICLE SYSTEM ─────────────────────────────── */
function initHeroParticles(){
  var hero = document.getElementById('hero');
  if(!hero) return;

  var canvas = document.createElement('canvas');
  canvas.id = 'ap-hero-canvas';
  hero.insertBefore(canvas, hero.firstChild);

  var ctx = canvas.getContext('2d');
  var W, H, particles = [], mouse = {x: -999, y: -999};

  function resize(){
    W = canvas.width  = hero.offsetWidth;
    H = canvas.height = hero.offsetHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  var PARTICLE_COUNT = Math.min(70, Math.floor(W / 14));
  var COLORS = ['rgba(212,175,55,', 'rgba(245,197,24,', 'rgba(255,248,220,', 'rgba(255,255,255,'];

  function createParticle(){
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2.2 + .4,
      speedX: (Math.random() - .5) * .35,
      speedY: -(Math.random() * .6 + .15),
      opacity: Math.random() * .6 + .2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      twinkleSpeed: Math.random() * .02 + .005,
      twinkleDir: 1
    };
  }
  for(var i=0; i<PARTICLE_COUNT; i++) particles.push(createParticle());

  function drawConnections(){
    for(var a=0; a<particles.length; a++){
      for(var b=a+1; b<particles.length; b++){
        var dx = particles[a].x - particles[b].x;
        var dy = particles[a].y - particles[b].y;
        var dist = Math.sqrt(dx*dx + dy*dy);
        if(dist < 110){
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.strokeStyle = 'rgba(212,175,55,' + (.12 * (1 - dist/110)).toFixed(3) + ')';
          ctx.lineWidth = .5;
          ctx.stroke();
        }
      }
    }
  }

  var raf;
  function animate(){
    ctx.clearRect(0, 0, W, H);
    drawConnections();
    particles.forEach(function(p){
      // Twinkle
      p.opacity += p.twinkleSpeed * p.twinkleDir;
      if(p.opacity > .85 || p.opacity < .1) p.twinkleDir *= -1;

      // Mouse repulsion
      var mdx = p.x - mouse.x, mdy = p.y - mouse.y;
      var md = Math.sqrt(mdx*mdx + mdy*mdy);
      if(md < 100){
        var force = (100 - md) / 100;
        p.x += mdx / md * force * 1.5;
        p.y += mdy / md * force * 1.5;
      }

      p.x += p.speedX;
      p.y += p.speedY;
      if(p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
      if(p.x < -10) p.x = W + 10;
      if(p.x > W + 10) p.x = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI*2);
      ctx.fillStyle = p.color + p.opacity.toFixed(2) + ')';
      ctx.fill();

      // Glow on bright particles
      if(p.opacity > .6){
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 2.5, 0, Math.PI*2);
        ctx.fillStyle = p.color + (p.opacity * .15).toFixed(2) + ')';
        ctx.fill();
      }
    });
    raf = requestAnimationFrame(animate);
  }
  animate();

  hero.addEventListener('mousemove', function(e){
    var rect = hero.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  hero.addEventListener('mouseleave', function(){ mouse.x = -999; mouse.y = -999; });
}

/* ── 2. HERO SETUP (scan line, orbit, wave) ────────────────── */
function setupHero(){
  var hero = document.getElementById('hero');
  if(!hero) return;

  // Scan line
  var scan = document.createElement('div');
  scan.id = 'ap-scanline';
  hero.appendChild(scan);

  // Bottom wave — fill matches white sections below hero
  var wave = document.createElement('div');
  wave.id = 'ap-hero-wave';
  wave.innerHTML = '<svg viewBox="0 0 1440 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg"><path d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z" fill="#ffffff"/></svg>';
  hero.appendChild(wave);

  // Floating shapes
  var shapes = [
    {w:300,h:300,t:'20%',l:'-8%',color:'rgba(212,175,55,1)'},
    {w:200,h:200,t:'60%',l:'80%',color:'rgba(212,175,55,1)'},
    {w:150,h:150,t:'5%', l:'60%',color:'rgba(255,255,255,1)'}
  ];
  shapes.forEach(function(s){
    var el = document.createElement('div');
    el.className = 'ap-float-shape';
    el.style.cssText = 'width:'+s.w+'px;height:'+s.h+'px;top:'+s.t+';left:'+s.l+';background:'+s.color;
    hero.insertBefore(el, hero.firstChild);
  });

  // Wrap logo
  var logoEl = hero.querySelector('.hero-badge-logo');
  if(logoEl){
    var wrap = document.createElement('div');
    wrap.className = 'ap-logo-wrap';
    logoEl.parentNode.insertBefore(wrap, logoEl);
    wrap.appendChild(logoEl);
    ['ap-orbit ap-orbit-1','ap-orbit ap-orbit-2','ap-halo','ap-halo ap-halo-2'].forEach(function(cls){
      var ring = document.createElement('div');
      ring.className = cls;
      wrap.appendChild(ring);
    });
    var bw = logoEl.closest('.hero-badge-wrap');
    if(bw) bw.insertBefore(wrap, bw.firstChild);
  }

  // Shimmer on h1 span — skip if gradient-text already handles it
  var heroSpan = hero.querySelector('h1 span');
  if(heroSpan && !heroSpan.classList.contains('gradient-text')){
    heroSpan.classList.add('ap-shimmer-text');
    heroSpan.setAttribute('data-text', heroSpan.textContent);
  }

  // HUD badge class
  var badge = hero.querySelector('.hero-badge');
  if(badge){
    badge.classList.add('ap-hud-badge');
    var dot = document.createElement('span');
    dot.className = 'ap-hud-dot';
    badge.insertBefore(dot, badge.firstChild);
  }
}

/* ── 3. IMPROVED INTERSECTION OBSERVER (scroll reveal) ─────── */
function initReveal(){
  var CLASSES = ['ap-reveal ap-up','ap-reveal ap-left','ap-reveal ap-right','ap-reveal ap-scale','ap-reveal ap-flip'];

  // Mark elements with ap-reveal
  var selectors = [
    '.valor-card','#hero .stats-bar','.nivel-card',
    '.section-title','.maestro-card','.anuncio-card',
    '.about-logo','.ap-banner-wrap','.ap-directora-wrap'
  ];
  selectors.forEach(function(sel, si){
    document.querySelectorAll(sel).forEach(function(el, i){
      if(el.classList.contains('ap-reveal')) return;
      var type = ['ap-up','ap-scale','ap-flip','ap-left','ap-right'][si % 5];
      el.classList.add('ap-reveal', type);
      el.setAttribute('data-delay', (i % 5) + 1);
    });
  });

  // Also mark existing .reveal elements
  document.querySelectorAll('.reveal:not(.ap-reveal)').forEach(function(el, i){
    el.classList.add('ap-reveal', 'ap-up');
    el.setAttribute('data-delay', (i % 5) + 1);
  });

  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        e.target.classList.add('ap-done');
        io.unobserve(e.target);
      }
    });
  }, {threshold: 0.12, rootMargin: '0px 0px -40px 0px'});

  document.querySelectorAll('.ap-reveal').forEach(function(el){
    // If old reveal system already revealed this element, mark done immediately
    if(el.classList.contains('revealed')){
      el.classList.add('ap-done');
    } else {
      io.observe(el);
    }
  });
}

/* ── 4. 3D TILT EFFECT ─────────────────────────────────────── */
function initTilt(){
  var cards = document.querySelectorAll('.valor-card, .nivel-card, .kpi-card');
  cards.forEach(function(card){
    card.classList.add('ap-tilt');

    // Add shine layer
    var shine = document.createElement('div');
    shine.className = 'ap-tilt-shine';
    card.style.position = 'relative';
    card.appendChild(shine);

    card.addEventListener('mousemove', function(e){
      var rect = card.getBoundingClientRect();
      var cx = rect.left + rect.width  / 2;
      var cy = rect.top  + rect.height / 2;
      var dx = e.clientX - cx;
      var dy = e.clientY - cy;
      var maxTilt = 12;
      var rx = (-dy / (rect.height / 2) * maxTilt).toFixed(2);
      var ry = ( dx / (rect.width  / 2) * maxTilt).toFixed(2);
      card.style.transform = 'perspective(800px) rotateX('+rx+'deg) rotateY('+ry+'deg) translateZ(6px)';

      // Shine position
      var pct_x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
      var pct_y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
      shine.style.setProperty('--mx', pct_x + '%');
      shine.style.setProperty('--my', pct_y + '%');
    });

    card.addEventListener('mouseleave', function(){
      card.style.transform = '';
    });
  });
}

/* ── 5. HERO PARALLAX ON SCROLL ────────────────────────────── */
function initParallax(){
  var hero = document.getElementById('hero');
  if(!hero) return;
  var heroContent = hero.querySelector('div[style*="z-index"]') || hero.firstElementChild;

  window.addEventListener('scroll', function(){
    var scrolled = window.pageYOffset;
    if(scrolled > hero.offsetHeight) return;
    var speed = scrolled * .35;
    if(heroContent) heroContent.style.transform = 'translateY(' + speed + 'px)';
    hero.style.backgroundPositionY = (scrolled * .5) + 'px';
  }, {passive: true});
}

/* ── 6. UPGRADE IMAGES (banner + directora) ─────────────────── */
function upgradeImages(){
  // Banner
  var banners = document.querySelectorAll('img[src*="banner_escuela"], [src*="banner"]');
  banners.forEach(function(img){
    if(img.closest('.ap-banner-wrap')) return;
    var wrap = document.createElement('div');
    wrap.className = 'ap-banner-wrap ap-reveal ap-up';
    var overlay = document.createElement('div');
    overlay.className = 'ap-banner-overlay';
    img.parentNode.insertBefore(wrap, img);
    wrap.appendChild(img);
    wrap.appendChild(overlay);
  });

  // Logo images (not in hero)
  document.querySelectorAll('.about-logo img, .about-logo svg').forEach(function(img){
    img.style.filter = 'drop-shadow(0 8px 24px rgba(212,175,55,.55))';
  });

  // Directora / maestro fotos circulares
  document.querySelectorAll('.maestro-foto, #directora-foto-m').forEach(function(el){
    if(el.closest('.ap-directora-wrap')) return;
    var wrap = document.createElement('div');
    wrap.className = 'ap-directora-wrap';
    var ring = document.createElement('div');
    ring.className = 'ap-directora-ring';
    el.parentNode.insertBefore(wrap, el);
    wrap.appendChild(el);
    wrap.appendChild(ring);
  });
}

/* ── 7. ANIMATED COUNTER (mejorado) ───────────────────────────*/
function upgradeCounters(){
  var counterEls = document.querySelectorAll('.stat-item .num');
  var animated = false;
  var io = new IntersectionObserver(function(entries){
    if(animated) return;
    if(entries.some(function(e){ return e.isIntersecting; })){
      animated = true;
      counterEls.forEach(function(el, i){
        var finalText = el.textContent || el.innerText;
        var finalNum  = parseInt(finalText.replace(/\D/g,'')) || 0;
        var suffix    = finalText.replace(/[\d,]/g,'').trim();
        el.textContent = '0';
        setTimeout(function(){
          var start = 0, duration = 1600, startTime = null;
          var ease = function(t){ return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1; };
          function step(ts){
            if(!startTime) startTime = ts;
            var progress = Math.min((ts - startTime) / duration, 1);
            var val = Math.round(ease(progress) * finalNum);
            el.textContent = val.toLocaleString() + suffix;
            if(progress < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
        }, i * 120);
      });
    }
  }, {threshold: .3});
  counterEls.forEach(function(el){ io.observe(el); });
}

/* ── 8. NAV SCROLL EFFECT ──────────────────────────────────── */
function initNavScroll(){
  var nav = document.getElementById('public-navbar');
  if(!nav) return;
  window.addEventListener('scroll', function(){
    if(window.pageYOffset > 60){
      nav.style.boxShadow = '0 4px 30px rgba(0,0,0,.18), 0 1px 0 rgba(212,175,55,.25)';
    } else {
      nav.style.boxShadow = '0 2px 16px rgba(0,0,0,.1)';
    }
  }, {passive:true});
}

/* ── 9. HUD CORNERS en secciones clave ─────────────────────── */
function addHudCorners(){
  var secs = document.querySelectorAll('.section, [style*="padding:60px"]');
  secs.forEach(function(s){ s.classList.add('ap-hud-section'); });
}

/* ── 10. LOGO NAV pulse ─────────────────────────────────────── */
function upgradeNavLogo(){
  var logoImgs = document.querySelectorAll('.nav-logo-img, #page-loader img');
  logoImgs.forEach(function(img){
    img.style.transition = 'filter .4s, transform .4s';
  });
}

/* ── 11. SCROLL PROGRESS BAR ───────────────────────────────── */
function initScrollProgress(){
  var bar = document.createElement('div');
  bar.id = 'ap-scroll-progress';
  document.body.insertBefore(bar, document.body.firstChild);

  window.addEventListener('scroll', function(){
    var scrolled = window.pageYOffset;
    var total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (total > 0 ? (scrolled / total * 100) : 0).toFixed(2) + '%';
  }, {passive: true});
}

/* ── 12. BACK TO TOP BUTTON ────────────────────────────────── */
function initBackToTop(){
  var btn = document.createElement('button');
  btn.id = 'ap-back-top';
  btn.title = 'Volver al inicio';
  btn.innerHTML = '↑';
  btn.setAttribute('aria-label', 'Volver al inicio');
  document.body.appendChild(btn);

  window.addEventListener('scroll', function(){
    if(window.pageYOffset > 400){
      btn.classList.add('ap-visible');
    } else {
      btn.classList.remove('ap-visible');
    }
  }, {passive: true});

  btn.addEventListener('click', function(){
    window.scrollTo({top: 0, behavior: 'smooth'});
  });
}

/* ── INIT ───────────────────────────────────────────────────── */
function init(){
  setupHero();
  initHeroParticles();
  initReveal();
  upgradeImages();
  upgradeCounters();
  initNavScroll();
  addHudCorners();
  upgradeNavLogo();
  initScrollProgress();
  initBackToTop();

  // Tilt after a tick (ensures cards are rendered)
  setTimeout(initTilt, 200);
  // Parallax (subtle, only desktop)
  if(window.innerWidth > 768) initParallax();
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

})();
