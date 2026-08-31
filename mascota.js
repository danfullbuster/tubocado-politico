/* Tu Bocado Político — Loro político 8-bit v2 */
(function () {
  'use strict';

  // ── Paleta ────────────────────────────────────────────────────
  const P = {
    _: null,
    A: '#0a1f05',   // verde muy oscuro (outline)
    B: '#1e5c0a',   // verde oscuro (cuerpo)
    C: '#3a8c1a',   // verde medio
    D: '#65cc30',   // verde claro (plumas)
    E: '#FF3300',   // rojo vivo (cabeza)
    F: '#FF7A00',   // naranja vivo (pico arriba)
    G: '#F5C31A',   // amarillo TBP (pico abajo, patas)
    H: '#ffffff',   // blanco (ojo)
    I: '#000000',   // negro (pupila)
    J: '#F5C31A',   // amarillo patas
    K: '#3D56F0',   // azul TBP (acento ala)
    M: '#c8860a',   // galleta relleno
    N: '#8b4513',   // galleta borde
    O: '#f0b040',   // galleta brillo
  };

  // Variables de pixel art (una por letra de paleta)
  const _='_',A='A',B='B',C='C',D='D',E='E',F='F',G='G',H='H',I='I',J='J',K='K',M='M',N='N',O='O';

  // ── Frames base (12×16) ───────────────────────────────────────
  const IDLE_A = [
    [_,_,_,E,E,E,E,_,_,_,_,_],
    [_,_,E,E,E,E,E,E,_,_,_,_],
    [_,_,E,F,F,E,E,E,_,_,_,_],
    [_,_,E,F,H,I,E,E,_,_,_,_],
    [_,_,_,G,G,_,_,_,_,_,_,_],
    [_,A,B,B,B,B,B,A,_,_,_,_],
    [A,B,C,C,B,B,C,B,A,_,_,_],
    [B,C,C,C,C,C,C,C,B,_,_,_],
    [B,C,D,C,C,C,D,C,B,_,_,_],
    [B,C,K,C,C,C,K,C,B,_,_,_],
    [_,B,B,C,C,C,B,B,_,_,_,_],
    [_,_,A,B,C,B,A,_,_,_,_,_],
    [_,_,_,D,D,D,_,_,_,_,_,_],
    [_,_,_,J,_,J,_,_,_,_,_,_],
    [_,_,J,J,_,J,J,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_],
  ];
  const IDLE_B = [
    [_,_,_,E,E,E,E,_,_,_,_,_],
    [_,_,E,E,E,E,E,E,_,_,_,_],
    [_,_,E,F,F,E,E,E,_,_,_,_],
    [_,_,E,F,H,I,E,E,_,_,_,_],
    [_,_,_,G,G,_,_,_,_,_,_,_],
    [_,A,B,B,B,B,B,A,_,_,_,_],
    [A,B,C,C,B,B,C,B,A,_,_,_],
    [B,C,C,C,C,C,C,C,B,_,_,_],
    [B,D,D,C,C,C,D,D,B,_,_,_],
    [B,C,K,C,C,C,K,C,B,_,_,_],
    [_,B,B,C,C,C,B,B,_,_,_,_],
    [_,_,A,D,C,D,A,_,_,_,_,_],
    [_,_,_,D,D,D,_,_,_,_,_,_],
    [_,_,_,J,_,J,_,_,_,_,_,_],
    [_,_,J,J,_,J,J,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_],
  ];
  // Frame gordo (cuerpo más ancho, 14 cols × 17 filas)
  const FAT_A = [
    [_,_,_,_,E,E,E,E,_,_,_,_,_,_],
    [_,_,_,E,E,E,E,E,E,_,_,_,_,_],
    [_,_,_,E,F,F,F,E,E,E,_,_,_,_],
    [_,_,_,E,F,H,I,E,E,E,_,_,_,_],
    [_,_,_,_,G,G,G,_,_,_,_,_,_,_],
    [_,_,A,B,B,B,B,B,B,A,_,_,_,_],
    [_,A,B,C,C,C,B,C,B,B,A,_,_,_],
    [A,B,C,C,C,C,C,C,C,C,B,A,_,_],
    [B,C,C,D,C,C,C,D,C,C,C,B,_,_],
    [B,C,K,C,C,C,C,C,K,C,C,B,_,_],
    [B,C,C,C,C,C,C,C,C,C,C,B,_,_],
    [_,B,B,C,C,C,C,C,B,B,_,_,_,_],
    [_,_,A,B,D,C,C,D,A,_,_,_,_,_],
    [_,_,_,_,D,D,D,_,_,_,_,_,_,_],
    [_,_,_,_,J,_,J,_,_,_,_,_,_,_],
    [_,_,_,J,J,_,J,J,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  ];
  const FAT_B = [
    [_,_,_,_,E,E,E,E,_,_,_,_,_,_],
    [_,_,_,E,E,E,E,E,E,_,_,_,_,_],
    [_,_,_,E,F,F,F,E,E,E,_,_,_,_],
    [_,_,_,E,F,H,I,E,E,E,_,_,_,_],
    [_,_,_,_,G,G,G,_,_,_,_,_,_,_],
    [_,_,A,B,B,B,B,B,B,A,_,_,_,_],
    [_,A,B,C,C,C,B,C,B,B,A,_,_,_],
    [A,B,C,C,C,C,C,C,C,C,B,A,_,_],
    [B,D,D,D,C,C,C,D,D,D,C,B,_,_],
    [B,C,K,C,C,C,C,C,K,C,C,B,_,_],
    [B,C,C,C,C,C,C,C,C,C,C,B,_,_],
    [_,B,B,D,C,C,C,C,B,B,_,_,_,_],
    [_,_,A,B,D,C,C,D,A,_,_,_,_,_],
    [_,_,_,_,D,D,D,_,_,_,_,_,_,_],
    [_,_,_,_,J,_,J,_,_,_,_,_,_,_],
    [_,_,_,J,J,_,J,J,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  ];
  // Frame comiendo (pico abierto)
  const EAT_A = [
    [_,_,_,E,E,E,E,_,_,_,_,_],
    [_,_,E,E,E,E,E,E,_,_,_,_],
    [_,_,E,F,F,F,E,E,_,_,_,_],
    [_,_,E,F,H,I,E,E,_,_,_,_],
    [_,F,F,F,_,_,_,_,_,_,_,_],
    [_,_,G,G,G,_,_,_,_,_,_,_],
    [_,A,B,B,B,B,B,A,_,_,_,_],
    [A,B,C,C,B,B,C,B,A,_,_,_],
    [B,C,C,C,C,C,C,C,B,_,_,_],
    [B,C,D,C,C,C,D,C,B,_,_,_],
    [B,C,K,C,C,C,K,C,B,_,_,_],
    [_,B,B,C,C,C,B,B,_,_,_,_],
    [_,_,A,B,C,B,A,_,_,_,_,_],
    [_,_,_,D,D,D,_,_,_,_,_,_],
    [_,_,_,J,_,J,_,_,_,_,_,_],
    [_,_,J,J,_,J,J,_,_,_,_,_],
  ];
  const EAT_B = [
    [_,_,_,E,E,E,E,_,_,_,_,_],
    [_,_,E,E,E,E,E,E,_,_,_,_],
    [_,_,E,F,F,E,E,E,_,_,_,_],
    [_,_,E,F,H,I,E,E,_,_,_,_],
    [_,_,F,F,_,_,_,_,_,_,_,_],
    [_,_,G,G,_,_,_,_,_,_,_,_],
    [_,A,B,B,B,B,B,A,_,_,_,_],
    [A,B,C,C,B,B,C,B,A,_,_,_],
    [B,C,C,C,C,C,C,C,B,_,_,_],
    [B,C,D,C,C,C,D,C,B,_,_,_],
    [B,C,K,C,C,C,K,C,B,_,_,_],
    [_,B,B,C,C,C,B,B,_,_,_,_],
    [_,_,A,B,C,B,A,_,_,_,_,_],
    [_,_,_,D,D,D,_,_,_,_,_,_],
    [_,_,_,J,_,J,_,_,_,_,_,_],
    [_,_,J,J,_,J,J,_,_,_,_,_],
  ];
  // Galleta 10×10
  const COOKIE = [
    [_,_,N,N,N,N,N,N,_,_],
    [_,N,M,M,M,M,M,M,N,_],
    [N,M,M,N,M,M,M,M,M,N],
    [N,M,N,M,O,N,M,M,M,N],
    [N,M,M,O,M,M,N,M,M,N],
    [N,M,M,M,M,O,M,M,N,N],
    [N,M,N,M,M,M,M,N,M,N],
    [N,M,M,M,N,M,M,M,M,N],
    [_,N,M,M,M,M,M,M,N,_],
    [_,_,N,N,N,N,N,N,_,_],
  ];

  // ── Frases ───────────────────────────────────────────────────
  const FRASES_COMER = [
    '¡Uy qué rico bocado político, parce! 🍪',
    '¡Qué delicia! ¿Me das otra galletica?',
    '¡Mmm! Ahora sí entiendo la reforma 😏',
    '¡Gracias! La política me da mucha hambre...',
    '¡Eso sí se puede masticar! 🇨🇴',
    '¡Más, más! Soy adicto a los bocados políticos 🗳️',
    '¡Juepucha, qué buena! Dame otra plis 🙏',
    '¡Tô engordando pero valió la pena! 😄',
    '¡Uy llave, ya estoy lleno pero quiero más!',
    '¡Esto es mejor que cualquier debate del Congreso!',
  ];
  const FRASES_GORDO = [
    '¡Uy, ya estoy gordito! 😅',
    '¡Me estás engordando con tanto bocado! 🍪',
    '¡Barrigón pero feliz, parce! 🇨🇴',
    '¡Tanto bocado político y ya no quepo! 😂',
  ];
  const FRASES_TRUCO = [
    '¡Tachán! ¿Eso o no es un truco? 🎪',
    '¡Así hace el loro político! 💫',
    '¡Mejor que el Congreso, jaja! 🎭',
    '¡Aprendo trucos más rápido que las reformas! 🔄',
  ];
  const FRASES_IDLE = [
    '¿Sabías que en Colombia puedes votar desde los 18? 🗳️',
    'La política no muerde... ¡pero yo sí! 😅',
    '¿Leíste la noticia de hoy?',
    'El Congreso tiene 108 senadores. ¿Sabes quién es el tuyo?',
    'Dale clic a la galleta y aliméntame 🍪',
    '¡Política que sí se puede masticar! 💛',
    '¿Quién le mete la mano a tu bolsillo? 🤔',
    '¡Ey! ¿Me vas a dar galleta o qué, parce?',
    'Suscríbete al boletín — llega fresquito cada lunes 📩',
  ];

  // ── Niveles de gordura ────────────────────────────────────────
  const GORDURA = [
    { galletas: 0,  label: 'Flaquito',    scale: 1.0  },
    { galletas: 3,  label: 'Gordito',     scale: 1.25 },
    { galletas: 6,  label: 'Barrigón',    scale: 1.5  },
    { galletas: 10, label: 'Mazacote',    scale: 1.8  },
    { galletas: 15, label: 'MEGA GORDO',  scale: 2.1  },
  ];

  function getNivel(n) {
    let nivel = GORDURA[0];
    for (const g of GORDURA) { if (n >= g.galletas) nivel = g; }
    return nivel;
  }

  // ── Dibujar pixel art ─────────────────────────────────────────
  function dibujar(ctx, grid) {
    const S = 5;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (let r = 0; r < grid.length; r++) {
      for (let c = 0; c < grid[r].length; c++) {
        const col = P[grid[r][c]];
        if (!col) continue;
        ctx.fillStyle = col;
        ctx.fillRect(c * S, r * S, S, S);
      }
    }
  }

  // ── Inyectar CSS animaciones ──────────────────────────────────
  function injectCSS() {
    const s = document.createElement('style');
    s.textContent = `
      @keyframes tbp-spin {
        0%   { transform: rotate(0deg)   scale(var(--fs,1)); }
        30%  { transform: rotate(200deg) scale(calc(var(--fs,1)*1.3)); }
        60%  { transform: rotate(340deg) scale(calc(var(--fs,1)*0.8)); }
        80%  { transform: rotate(380deg) scale(calc(var(--fs,1)*1.15)); }
        100% { transform: rotate(360deg) scale(var(--fs,1)); }
      }
      @keyframes tbp-jump {
        0%,100% { transform: translateY(0)    scale(var(--fs,1)); }
        30%     { transform: translateY(-24px) scale(var(--fs,1)); }
        60%     { transform: translateY(-10px) scale(var(--fs,1)); }
      }
      .tbp-spin { animation: tbp-spin .8s cubic-bezier(.36,.07,.19,.97) forwards !important; }
      .tbp-jump { animation: tbp-jump .6s ease-in-out !important; }
    `;
    document.head.appendChild(s);
  }

  // ── Init ─────────────────────────────────────────────────────
  async function init() {
    injectCSS();

    const S = 5, COLS = 12, ROWS = 16;
    const CW = COLS * S, CH = ROWS * S;
    const FCOLS = 14, FROWS = 17;
    const FCW = FCOLS * S, FCH = FROWS * S;

    // Cargar noticias recientes para frases
    try {
      const r = await fetch('/api/noticias');
      if (r.ok) {
        const news = await r.json();
        news.slice(0, 6).forEach(n => {
          FRASES_IDLE.push(`📰 Última hora: "${n.titulo.substring(0,55)}${n.titulo.length>55?'…':''}"`);
        });
      }
    } catch(e) {}

    // ── Contenedor ──
    const wrap = document.createElement('div');
    wrap.id = 'tbp-mascota';
    Object.assign(wrap.style, {
      position:'fixed', bottom:'16px', right:'16px', zIndex:'9990',
      userSelect:'none', display:'flex', flexDirection:'column', alignItems:'center',
      background:'rgba(12,13,15,0.78)', border:'2px solid rgba(245,195,26,0.35)',
      padding:'10px 10px 8px', backdropFilter:'blur(4px)',
    });

    // ── Tab lateral (siempre visible, toggle) ──
    const tab = document.createElement('button');
    tab.title = 'El lorito político';
    Object.assign(tab.style, {
      position:'fixed', right:'0', bottom:'100px', zIndex:'9989',
      background:'rgba(12,13,15,0.85)', border:'2px solid rgba(245,195,26,0.45)',
      borderRight:'none', cursor:'pointer', padding:'10px 6px',
      display:'flex', flexDirection:'column', alignItems:'center', gap:'4px',
      transition:'background .15s, border-color .15s',
      backdropFilter:'blur(4px)',
    });
    tab.innerHTML = '<span style="font-size:18px;line-height:1">🦜</span><span style="font-family:\'Bebas Neue\',sans-serif;font-size:9px;color:#F5C31A;letter-spacing:.1em;writing-mode:vertical-rl;transform:rotate(180deg)">LORO</span>';
    tab.addEventListener('mouseenter', () => { tab.style.background='rgba(245,195,26,0.15)'; tab.style.borderColor='rgba(245,195,26,0.8)'; });
    tab.addEventListener('mouseleave', () => { tab.style.background='rgba(12,13,15,0.85)'; tab.style.borderColor='rgba(245,195,26,0.45)'; });
    document.body.appendChild(tab);

    // ── Botón cerrar (X) ──
    const btnClose = document.createElement('button');
    btnClose.textContent = '✕';
    btnClose.title = 'Esconder al lorito';
    Object.assign(btnClose.style, {
      position:'absolute', top:'4px', right:'6px',
      background:'none', border:'none', cursor:'pointer',
      color:'rgba(245,195,26,0.4)', fontSize:'12px', lineHeight:'1',
      padding:'2px 4px', transition:'color .15s',
    });
    btnClose.addEventListener('mouseenter', () => btnClose.style.color = '#F5C31A');
    btnClose.addEventListener('mouseleave', () => btnClose.style.color = 'rgba(245,195,26,0.4)');

    function setVisible(v) {
      wrap.style.display = v ? 'flex' : 'none';
      tab.style.display  = v ? 'none' : 'flex';
    }
    btnClose.addEventListener('click', () => setVisible(false));
    tab.addEventListener('click', () => setVisible(true));

    wrap.style.position = 'fixed';
    wrap.appendChild(btnClose);

    // ── Burbuja ──
    const bubble = document.createElement('div');
    Object.assign(bubble.style, {
      background:'#0C0D0F', color:'#F5C31A',
      fontFamily:'"DM Sans","Segoe UI",sans-serif',
      fontSize:'12px', fontWeight:'600', lineHeight:'1.4',
      padding:'8px 12px', border:'2px solid #F5C31A',
      maxWidth:'180px', textAlign:'center',
      opacity:'0', transform:'translateY(6px)',
      transition:'opacity .25s,transform .25s',
      marginBottom:'6px', position:'relative', boxSizing:'border-box',
    });
    const arrow = document.createElement('span');
    Object.assign(arrow.style, {
      position:'absolute', bottom:'-8px', left:'50%', transform:'translateX(-50%)',
      width:'0', height:'0',
      borderLeft:'6px solid transparent', borderRight:'6px solid transparent',
      borderTop:'8px solid #F5C31A',
    });
    const bubbleTxt = document.createElement('span');
    bubble.appendChild(arrow); bubble.appendChild(bubbleTxt);

    // ── Canvas loro ──
    const canvas = document.createElement('canvas');
    canvas.width = FCW; canvas.height = FCH;   // usa el mayor (gordo)
    Object.assign(canvas.style, {
      imageRendering:'pixelated', display:'block', cursor:'pointer',
      transformOrigin:'center bottom',
    });
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // ── Badge nivel ──
    const badge = document.createElement('div');
    Object.assign(badge.style, {
      fontFamily:'"Bebas Neue",sans-serif', fontSize:'10px',
      letterSpacing:'.1em', color:'#F5C31A', margin:'2px 0 4px',
    });
    badge.textContent = 'FLAQUITO';

    // ── Botones ──
    const btnRow = document.createElement('div');
    Object.assign(btnRow.style, { display:'flex', gap:'6px', marginTop:'4px' });

    function mkBtn(label, title) {
      const b = document.createElement('button');
      b.title = title;
      Object.assign(b.style, {
        background:'none', border:'2px solid #F5C31A', cursor:'pointer',
        padding:'4px 8px', display:'flex', alignItems:'center', gap:'5px',
        transition:'border-color .15s, transform .1s',
        fontFamily:'"Bebas Neue",sans-serif', fontSize:'11px',
        letterSpacing:'.08em', color:'#F5C31A', whiteSpace:'nowrap',
      });
      b.textContent = label;
      b.addEventListener('mouseenter', () => b.style.borderColor='#fff');
      b.addEventListener('mouseleave', () => b.style.borderColor='#F5C31A');
      return b;
    }

    // Botón galleta
    const cookieCanvas = document.createElement('canvas');
    cookieCanvas.width = 10*S; cookieCanvas.height = 10*S;
    Object.assign(cookieCanvas.style, { imageRendering:'pixelated', display:'block' });
    const cctx = cookieCanvas.getContext('2d');
    cctx.imageSmoothingEnabled = false;
    dibujar(cctx, COOKIE);

    const btnGalleta = mkBtn('', 'Aliméntame con una galletica 🍪');
    btnGalleta.prepend(cookieCanvas);
    const galletaLbl = document.createElement('span');
    galletaLbl.textContent = 'GALLETA';
    btnGalleta.appendChild(galletaLbl);

    // Botón truco
    const btnTruco = mkBtn('🎪 TRUCO', 'Hazme hacer un truco');

    btnRow.appendChild(btnGalleta);
    btnRow.appendChild(btnTruco);

    // ── Contador ──
    const counter = document.createElement('div');
    Object.assign(counter.style, {
      fontFamily:'"Bebas Neue",sans-serif', fontSize:'10px',
      letterSpacing:'.08em', color:'rgba(245,195,26,.4)', marginTop:'3px',
    });
    counter.textContent = '0 galletas';

    wrap.appendChild(bubble);
    wrap.appendChild(canvas);
    wrap.appendChild(badge);
    wrap.appendChild(btnRow);
    wrap.appendChild(counter);
    document.body.appendChild(wrap);

    // ── Estado ──
    let state      = 'idle';
    let stateTimer = 180;
    let speechTimer = 0;
    let galletasComidas = (() => { try { return parseInt(localStorage.getItem('tbp-galletas')||'0')||0; } catch(e){ return 0; } })();
    let idleTimer  = Math.floor(Math.random() * 400) + 300;
    let esFat      = galletasComidas >= 6;
    let tick       = 0;
    let haciendo   = false;   // truco en curso

    function fatScale() { return getNivel(galletasComidas).scale; }

    function applyScale() {
      const fs = fatScale();
      canvas.style.setProperty('--fs', fs);
      canvas.style.transform = `scale(${fs})`;
    }

    function mostrarBurbuja(msg, dur = 230) {
      bubbleTxt.textContent = msg;
      bubble.style.opacity = '1'; bubble.style.transform = 'translateY(0)';
      speechTimer = dur;
    }
    function ocultarBurbuja() {
      bubble.style.opacity = '0'; bubble.style.transform = 'translateY(6px)';
    }

    // ── Dar galleta ──
    function darGalleta() {
      galletasComidas++;
      state = 'eating'; stateTimer = 80;

      const nivelAnt = getNivel(galletasComidas - 1);
      const nivelNow = getNivel(galletasComidas);
      esFat = galletasComidas >= 6;

      // ¿Subió de nivel?
      if (nivelNow !== nivelAnt) {
        badge.textContent = nivelNow.label.toUpperCase();
        const frase = FRASES_GORDO[Math.floor(Math.random() * FRASES_GORDO.length)];
        mostrarBurbuja(frase);
        // pequeño bounce al engordar
        canvas.classList.remove('tbp-jump');
        requestAnimationFrame(() => canvas.classList.add('tbp-jump'));
        setTimeout(() => canvas.classList.remove('tbp-jump'), 700);
      } else {
        mostrarBurbuja(FRASES_COMER[Math.floor(Math.random() * FRASES_COMER.length)]);
      }

      applyScale();
      try { localStorage.setItem('tbp-galletas', galletasComidas); } catch(e) {}
      counter.textContent = galletasComidas === 1 ? '1 galleta comida 🍪' : `${galletasComidas} galletas comidas 🍪`;
      btnGalleta.style.transform = 'scale(0.88)';
      setTimeout(() => btnGalleta.style.transform = 'scale(1)', 150);
    }

    // ── Truco ──
    function hacerTruco() {
      if (haciendo) return;
      haciendo = true;
      const tricks = ['tbp-spin', 'tbp-jump'];
      const t = tricks[Math.floor(Math.random() * tricks.length)];
      canvas.style.transform = '';
      canvas.classList.remove('tbp-spin', 'tbp-jump');
      requestAnimationFrame(() => {
        canvas.classList.add(t);
        mostrarBurbuja(FRASES_TRUCO[Math.floor(Math.random() * FRASES_TRUCO.length)]);
      });
      setTimeout(() => {
        canvas.classList.remove(t);
        applyScale();
        haciendo = false;
      }, t === 'tbp-spin' ? 900 : 700);
    }

    btnGalleta.addEventListener('click', darGalleta);
    btnTruco.addEventListener('click', hacerTruco);
    canvas.addEventListener('click', () => {
      mostrarBurbuja(FRASES_IDLE[Math.floor(Math.random() * FRASES_IDLE.length)]);
    });

    // ── Loop de animación ──
    function loop() {
      tick++;
      const f = Math.floor(tick / 18) % 2;
      let art;
      if (state === 'eating') {
        art = Math.floor(tick / 5) % 2 === 0 ? EAT_A : EAT_B;
      } else if (esFat) {
        art = f === 0 ? FAT_A : FAT_B;
      } else {
        art = f === 0 ? IDLE_A : IDLE_B;
      }
      dibujar(ctx, art);

      // Timers
      stateTimer--;
      if (stateTimer <= 0) { state = 'idle'; stateTimer = 120; }
      if (speechTimer > 0 && --speechTimer === 0) ocultarBurbuja();
      if (--idleTimer <= 0 && state !== 'eating') {
        mostrarBurbuja(FRASES_IDLE[Math.floor(Math.random() * FRASES_IDLE.length)], 220);
        idleTimer = Math.floor(Math.random() * 500) + 350;
      }

      requestAnimationFrame(loop);
    }
    loop();
    applyScale();
    // Iniciar el badge y counter con el estado guardado
    badge.textContent = getNivel(galletasComidas).label.toUpperCase();
    counter.textContent = galletasComidas > 0 ? `${galletasComidas} galleta${galletasComidas===1?'':' comidas'} 🍪` : '0 galletas';
    // Empezar colapsado (solo tab lateral visible)
    setVisible(false);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
