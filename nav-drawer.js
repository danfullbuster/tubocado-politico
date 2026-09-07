/* Tu Bocado Político — Mobile nav drawer */
(function () {
  'use strict';

  const ITEMS = [
    { href: '/noticias.html',  ico: '📰', label: 'Noticias' },
    { href: '/opinion.html',   ico: '🗣️',  label: 'Opinión' },
    { href: '/explicame.html', ico: '💡',  label: 'Explícame eso' },
    { href: '/bocados.html',   ico: '🥙',  label: 'Bocados rápidos' },
    { href: '/nosotros.html',  ico: '👥',  label: 'Nosotros' },
  ];

  function init() {
    const nav = document.querySelector('nav.nav');
    if (!nav) return;

    // Mark active link
    const path = location.pathname.replace(/^\//, '') || 'index.html';

    // Hamburger button
    const ham = document.createElement('button');
    ham.className = 'nav-hamburger';
    ham.setAttribute('aria-label', 'Abrir menú');
    ham.innerHTML = '<span></span><span></span><span></span>';
    nav.appendChild(ham);

    // Overlay
    const overlay = document.createElement('div');
    overlay.className = 'nav-drawer-overlay';
    document.body.appendChild(overlay);

    // Drawer
    const drawer = document.createElement('nav');
    drawer.className = 'nav-drawer';
    drawer.setAttribute('aria-label', 'Secciones');
    drawer.innerHTML = `
      <div class="nav-drawer-head">
        <a class="nav-drawer-brand" href="/index.html">TU<span>/</span>BOCADO</a>
        <button class="nav-drawer-close" aria-label="Cerrar menú">✕</button>
      </div>
      <div class="nav-drawer-items">
        ${ITEMS.map(i => {
          const active = path === i.href.replace(/^\//, '') ? ' active' : '';
          return `<a class="nav-drawer-item${active}" href="${i.href}"><span class="di-ico">${i.ico}</span>${i.label}</a>`;
        }).join('')}
      </div>
      <div class="nav-drawer-foot">
        <a class="nav-drawer-cta" href="/suscribirme.html">Suscribirme →</a>
      </div>
    `;
    document.body.appendChild(drawer);

    function open() {
      drawer.classList.add('open');
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
      ham.setAttribute('aria-expanded', 'true');
    }
    function close() {
      drawer.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
      ham.setAttribute('aria-expanded', 'false');
    }

    ham.addEventListener('click', open);
    overlay.addEventListener('click', close);
    drawer.querySelector('.nav-drawer-close').addEventListener('click', close);
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
