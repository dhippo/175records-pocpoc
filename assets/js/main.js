/* ============================================================
   175 RECORDS — interactions
   ============================================================ */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine   = matchMedia('(pointer: fine)').matches;
  const store = {
    get:(k,d)=>{try{return localStorage.getItem(k)||d}catch(e){return d}},
    set:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}}
  };

  /* ---------- Theme (light default / dark) ---------- */
  const applyTheme = (t) => {
    document.documentElement.setAttribute('data-theme', t);
    document.querySelectorAll('[data-theme-btn]').forEach(b =>
      b.classList.toggle('active', b.dataset.themeBtn === t));
    store.set('theme', t);
  };
  applyTheme(store.get('theme','light'));
  document.querySelectorAll('[data-theme-btn]').forEach(b =>
    b.addEventListener('click', () => applyTheme(b.dataset.themeBtn)));

  /* ---------- Intro ---------- */
  const intro = document.querySelector('.intro');
  if (intro){
    const kill = () => intro.classList.add('off');
    addEventListener('load', () => setTimeout(kill, reduce ? 150 : 1100));
    setTimeout(kill, 2400);
  }

  /* ---------- Custom cursor ---------- */
  if (fine && !reduce){
    document.body.classList.add('has-cursor');
    const ring=document.createElement('div'); ring.className='cursor-ring glow';
    const dot=document.createElement('div'); dot.className='cursor-dot';
    const label=document.createElement('div'); label.className='cursor-label';
    document.body.append(ring,dot,label);
    let rx=innerWidth/2, ry=innerHeight/2, dx=rx, dy=ry;
    addEventListener('mousemove', e => {rx=e.clientX; ry=e.clientY;});
    (function loop(){
      dx+=(rx-dx)*.18; dy+=(ry-dy)*.18;
      ring.style.transform=`translate(${dx}px,${dy}px) translate(-50%,-50%)`;
      dot.style.transform=`translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      label.style.left=rx+'px'; label.style.top=(ry+46)+'px';
      requestAnimationFrame(loop);
    })();
    document.querySelectorAll('a,button,.ev,[data-cursor]').forEach(el=>{
      el.addEventListener('mouseenter',()=>{document.body.classList.add('cursor-hover');label.textContent=el.getAttribute('data-cursor-label')||'';});
      el.addEventListener('mouseleave',()=>{document.body.classList.remove('cursor-hover');label.textContent='';});
    });
  }

  /* ---------- Spotlight reveal ---------- */
  document.querySelectorAll('.reveal').forEach(rv=>{
    const color=rv.querySelector('.color'); if(!color) return;
    if(reduce){color.style.maskImage='none';color.style.webkitMaskImage='none';return;}
    const set=(x,y)=>{color.style.setProperty('--rx',x+'px');color.style.setProperty('--ry',y+'px');};
    const global=rv.dataset.reveal==='global';
    const move=e=>{const r=rv.getBoundingClientRect();set(e.clientX-r.left,e.clientY-r.top);};
    (global?window:rv).addEventListener('mousemove',move);
    if(!global) rv.addEventListener('mouseleave',()=>set(-400,-400));
  });

  /* ---------- Scroll reveals ---------- */
  const io=new IntersectionObserver((es)=>{es.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}});},{threshold:.12});
  document.querySelectorAll('.up').forEach(el=>io.observe(el));

  /* ---------- Parallax ---------- */
  if(!reduce){
    const layers=[...document.querySelectorAll('[data-parallax]')];
    if(layers.length){let t=false;addEventListener('scroll',()=>{if(t)return;t=true;requestAnimationFrame(()=>{const y=scrollY;layers.forEach(l=>{l.style.transform=`translateY(${y*(parseFloat(l.dataset.parallax)||.15)}px)`;});t=false;});},{passive:true});}
  }

  /* ---------- Marquee duplicate ---------- */
  document.querySelectorAll('.marquee .track').forEach(tr=>{tr.innerHTML+=tr.innerHTML;});

  /* ---------- i18n EN/FR ---------- */
  const applyLang=(lang)=>{
    document.documentElement.lang=lang;
    document.querySelectorAll('[data-en]').forEach(el=>{const v=el.getAttribute('data-'+lang);if(v!==null)el.innerHTML=v;});
    document.querySelectorAll('[data-lang-btn]').forEach(b=>b.classList.toggle('active',b.dataset.langBtn===lang));
    store.set('lang',lang);
  };
  applyLang(store.get('lang','en'));
  document.querySelectorAll('[data-lang-btn]').forEach(b=>b.addEventListener('click',()=>applyLang(b.dataset.langBtn)));

  /* ---------- Event detail ---------- */
  const detail=document.querySelector('.detail');
  if(detail){
    const q=s=>detail.querySelector(s);
    const dPoster=q('.poster-full img'),dTitle=q('[data-d="title"]'),dTag=q('[data-d="tag"]'),
          dVenue=q('[data-d="venue"]'),dDate=q('[data-d="date"]'),dLineup=q('[data-d="lineup"]'),dDesc=q('[data-d="desc"]');
    const open=ev=>{const d=ev.dataset;
      detail.style.setProperty('--ev',d.color);
      dPoster.src=ev.querySelector('img').src; dPoster.alt=d.title;
      dTitle.textContent=d.title; dTag.textContent=d.genre; dVenue.textContent=d.venue; dDate.textContent=d.date;
      dLineup.innerHTML=(d.lineup||'').split(',').map(n=>`<b>${n.trim()}</b>`).join('');
      dDesc.textContent=d['desc'+(document.documentElement.lang==='fr'?'Fr':'En')]||d.descEn||'';
      detail.classList.add('open'); document.body.style.overflow='hidden';};
    const close=()=>{detail.classList.remove('open');document.body.style.overflow='';};
    document.querySelectorAll('.ev').forEach(ev=>{
      if(ev.tagName==='A') return; /* preview cards link out */
      ev.setAttribute('tabindex','0');
      ev.addEventListener('click',()=>open(ev));
      ev.addEventListener('keydown',e=>{if(e.key==='Enter')open(ev);});
    });
    q('.close').addEventListener('click',close);
    q('.scrim').addEventListener('click',close);
    addEventListener('keydown',e=>{if(e.key==='Escape')close();});
  }

  /* ---------- Newsletter (front-only) ---------- */
  document.querySelectorAll('form[data-news]').forEach(f=>{
    f.addEventListener('submit',e=>{e.preventDefault();
      f.querySelector('.field').style.display='none';
      const ok=f.querySelector('.ok'); if(ok)ok.style.display='block';});
  });

  /* ---------- Header over hero (white) vs past hero (dark) ---------- */
  const head = document.querySelector('.site-head');
  const heroHome = document.querySelector('.hero-home');
  const heroAny = document.querySelector('.hero, .about-hero');
  if(head && (heroHome || heroAny)){
    const update = () => {
      const hh = head.offsetHeight || 64;
      if(heroHome) document.body.classList.toggle('over-hero', heroHome.getBoundingClientRect().bottom > hh + 4);
      if(heroAny) document.body.classList.toggle('scrolled', heroAny.getBoundingClientRect().bottom <= hh + 4);
    };
    update();
    addEventListener('scroll', update, {passive:true});
    addEventListener('resize', update);
  }

  /* ---------- Mobile menu ---------- */
  const navToggle=document.querySelector('.nav-toggle');
  const nav=document.querySelector('.nav');
  if(navToggle&&nav){
    const closeNav=()=>{navToggle.classList.remove('open');nav.classList.remove('open');document.body.classList.remove('menu-open');navToggle.setAttribute('aria-expanded','false');};
    navToggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');navToggle.classList.toggle('open',open);document.body.classList.toggle('menu-open',open);navToggle.setAttribute('aria-expanded',open);});
    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeNav));
    addEventListener('keydown',e=>{if(e.key==='Escape')closeNav();});
    addEventListener('resize',()=>{if(innerWidth>760)closeNav();});
  }

  /* ---------- Info modal (coming soon) ---------- */
  const modal=document.querySelector('.modal');
  if(modal){
    const mTag=modal.querySelector('[data-m="tag"]'),mTitle=modal.querySelector('[data-m="title"]'),mMsg=modal.querySelector('[data-m="msg"]');
    const L=()=>document.documentElement.lang==='fr'?'Fr':'En';
    const openModal=el=>{const d=el.dataset,l=L();
      mTag.textContent=d['tag'+l]||d.tagEn||'';
      mTitle.textContent=d['title'+l]||d.titleEn||'';
      mMsg.textContent=d['msg'+l]||d.msgEn||'';
      modal.classList.add('open');document.body.style.overflow='hidden';};
    const closeModal=()=>{modal.classList.remove('open');document.body.style.overflow='';};
    document.querySelectorAll('[data-modal]').forEach(b=>b.addEventListener('click',e=>{e.preventDefault();openModal(b);}));
    modal.querySelector('.close').addEventListener('click',closeModal);
    modal.querySelector('.scrim').addEventListener('click',closeModal);
    addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});
  }

  /* ---------- Page transition shutter ---------- */
  const shutter=document.querySelector('.shutter');
  if(shutter){
    const internal=a=>a&&a.host===location.host&&/\.html$/.test(a.pathname)&&!a.hasAttribute('data-noanim')&&a.target!=='_blank';
    document.addEventListener('click',e=>{
      const a=e.target.closest('a'); if(!internal(a))return;
      if(a.pathname===location.pathname)return;
      e.preventDefault(); shutter.classList.add('in');
      setTimeout(()=>{location.href=a.href;}, reduce?0:460);
    });
  }
})();
