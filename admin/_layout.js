// Shared admin utilities — included in every admin page

const TBP = {
  // Redirect to login if not authenticated
  async requireAuth() {
    const res = await fetch('/api/me');
    if (!res.ok) { location.href = '/admin/login.html'; return null; }
    const user = await res.json();
    document.getElementById('userNombre').textContent = user.nombre;
    document.getElementById('userRol').textContent    = user.rol === 'admin' ? 'Administrador' : 'Editor';
    if (user.rol !== 'admin') {
      document.querySelectorAll('.admin-only').forEach(el => el.remove());
    }
    return user;
  },

  async logout() {
    await fetch('/api/logout', { method: 'POST' });
    location.href = '/admin/login.html';
  },

  toast(msg, type = 'ok') {
    let t = document.getElementById('tbpToast');
    if (!t) { t = document.createElement('div'); t.id = 'tbpToast'; document.body.appendChild(t); }
    t.textContent  = msg;
    t.className    = 'toast' + (type === 'error' ? ' error' : '');
    t.style.cssText = `
      position:fixed;bottom:24px;right:24px;z-index:9999;
      background:${type==='error'?'#c0392b':'#0C0D0F'};
      color:${type==='error'?'#fff':'#F5C31A'};
      font-family:'Bebas Neue',sans-serif;font-size:17px;letter-spacing:.06em;
      padding:14px 24px;border:3px solid ${type==='error'?'#c0392b':'#F5C31A'};
      opacity:0;transform:translateY(60px);transition:all .3s;
    `;
    requestAnimationFrame(() => {
      t.style.opacity = '1'; t.style.transform = 'translateY(0)';
    });
    setTimeout(() => { t.style.opacity = '0'; t.style.transform = 'translateY(60px)'; }, 3000);
  },

  confirm(msg) {
    return window.confirm(msg);
  },

  fmtFecha(iso) {
    return new Date(iso).toLocaleDateString('es-CO', { day:'numeric', month:'short', year:'numeric' });
  },

  catLabel(cat) {
    const map = { noticias:'Noticias', política:'Política', economía:'Economía', ambiente:'Ambiente', internacional:'Internacional', urgente:'Urgente' };
    return map[cat] || cat;
  }
};
