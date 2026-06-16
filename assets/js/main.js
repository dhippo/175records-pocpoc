/* ============================================================
   175 RECORDS — "LIGHTS OUT" · interactions
   ============================================================ */
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine   = window.matchMedia('(pointer: fine)').matches;

  /* ---------------- Lights-out intro ---------------- */
  const intro = document.querySelector('.intro');
  const killIntro = () => intro && intro.classList.add('off');
  if (intro) {
    window.addEventListener('load', () => setTimeout(killIntro, reduce ? 150 : 650));
    setTimeout(killIntro, 1600); // safety
  }

  /* ---------------- Custom cursor (projector) ---------------- */
  if (fine && !reduce) {
    document.body.classList.add('has-cursor');
    const ring  = document.createElement('div'); ring.className  = 'cursor-ring glow';
    const dot   = document.createElement('div'); dot.className   = 'cursor-dot';
    const label = document.createElement('div'); label.className = 'cursor-label';
    document.body.append(ring, dot, label);

    let rx = innerWidth/2, ry = innerHeight/2, dx = rx, dy = ry;
    addEventListener('mousemove', e => { rx = e.clientX; ry = e.clientY; });
    const loop = () => {
      dx += (rx - dx) * .18; dy += (ry - dy) * .18;
      ring.style.transform = `translate(${dx}px,${dy}px) translate(-50%,-50%)`;
      dot.style.transform  = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      label.style.left = rx + 'px'; label.style.top = (ry + 46) + 'px';
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);

    const hoverSel = 'a, button, .ev, [data-cursor]';
    document.querySelectorAll(hoverSel).forEach(el => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
        label.textContent = el.getAttribute('data-cursor-label') || '';
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
        label.textContent = '';
      });
    });
  }

  /* ---------------- Spotlight reveal on photos ---------------- */
  document.querySelectorAll('.reveal').forEach(rv => {
    const color = rv.querySelector('.color');
    if (!color) return;
    const set = (x, y) => { color.style.setProperty('--rx', x+'px'); color.style.setProperty('--ry', y+'px'); };
    // hero spotlight follows the global cursor; cards follow local cursor
    const global = rv.dataset.reveal === 'global';
    const target = global ? window : rv;
    const move = e => {
      const r = rv.getBoundingClientRect();
      set(e.clientX - r.left, e.clientY - r.top);
    };
    if (reduce) { color.style.maskImage = 'none'; color.style.webkitMaskImage = 'none'; return; }
    target.addEventListener('mousemove', move);
    if (!global) rv.addEventListener('mouseleave', () => set(-400, -400));
  });

  /* ---------------- Scroll reveals ---------------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => { if (en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target);} });
  }, { threshold: .14 });
  document.querySelectorAll('.up').forEach(el => io.observe(el));

  /* ---------------- Light parallax (watermark / star) ---------------- */
  if (!reduce) {
    const layers = [...document.querySelectorAll('[data-parallax]')];
    let ticking = false;
    addEventListener('scroll', () => {
      if (ticking) return; ticking = true;
      requestAnimationFrame(() => {
        const y = scrollY;
        layers.forEach(l => {
          const s = parseFloat(l.dataset.parallax) || .15;
          l.style.transform = `translateY(${y * s}px)`;
        });
        ticking = false;
      });
    }, { passive:true });
  }

  /* ---------------- Marquee (seamless duplicate) ---------------- */
  document.querySelectorAll('.marquee .track').forEach(tr => {
    tr.innerHTML += tr.innerHTML; // duplicate for -50% loop
  });

  /* ---------------- i18n EN / FR ---------------- */
  const apply = (lang) => {
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-en]').forEach(el => {
      const v = el.getAttribute('data-' + lang);
      if (v !== null) el.innerHTML = v;
    });
    document.querySelectorAll('.lang button').forEach(b =>
      b.classList.toggle('active', b.dataset.lang === lang));
    try { localStorage.setItem('lang', lang); } catch(e){}
  };
  let lang = 'en';
  try { lang = localStorage.getItem('lang') || 'en'; } catch(e){}
  apply(lang);
  document.querySelectorAll('.lang button').forEach(b =>
    b.addEventListener('click', () => apply(b.dataset.lang)));

  /* ---------------- Event detail overlay ---------------- */
  const detail = document.querySelector('.detail');
  if (detail) {
    const dPoster = detail.querySelector('.poster-full img');
    const dTitle  = detail.querySelector('[data-d="title"]');
    const dTag    = detail.querySelector('[data-d="tag"]');
    const dVenue  = detail.querySelector('[data-d="venue"]');
    const dDate   = detail.querySelector('[data-d="date"]');
    const dLineup = detail.querySelector('[data-d="lineup"]');
    const dDesc   = detail.querySelector('[data-d="desc"]');
    const open = (ev) => {
      const d = ev.dataset;
      detail.style.setProperty('--ev', d.color);
      dPoster.src = ev.querySelector('img').src;
      dPoster.alt = d.title;
      dTitle.textContent = d.title;
      dTag.textContent   = d.genre;
      dVenue.textContent = d.venue;
      dDate.textContent  = d.date;
      dLineup.innerHTML  = (d.lineup||'').split(',').map(n => `<b>${n.trim()}</b>`).join('');
      dDesc.textContent  = d['desc'+(document.documentElement.lang==='fr'?'Fr':'En')] || d.descEn || '';
      detail.classList.add('open');
      document.body.style.overflow = 'hidden';
    };
    const close = () => { detail.classList.remove('open'); document.body.style.overflow=''; };
    document.querySelectorAll('.ev').forEach(ev => {
      ev.addEventListener('click', () => open(ev));
      ev.setAttribute('tabindex','0');
      ev.addEventListener('keydown', e => { if(e.key==='Enter') open(ev); });
    });
    detail.querySelector('.close').addEventListener('click', close);
    detail.querySelector('.scrim').addEventListener('click', close);
    addEventListener('keydown', e => { if(e.key==='Escape') close(); });
  }

  /* ---------------- Page transition shutter ---------------- */
  const shutter = document.querySelector('.shutter');
  if (shutter) {
    const internal = a => a && a.host === location.host && /\.html$/.test(a.pathname) &&
                          !a.hasAttribute('data-noanim') && a.target !== '_blank';
    document.addEventListener('click', e => {
      const a = e.target.closest('a');
      if (!internal(a)) return;
      if (a.pathname === location.pathname) return;
      e.preventDefault();
      shutter.classList.add('in');
      setTimeout(() => { location.href = a.href; }, reduce ? 0 : 460);
    });
  }
})();
