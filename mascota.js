/* Tu Bocado Político — Brayan Sleyder (tinguá bogotana) 8-bit v1 */
(function () {
  'use strict';

  // ── Paleta ────────────────────────────────────────────────────
  const P = {
    _: null,
    A: '#1a1a28',   // outline muy oscuro
    B: '#2a2a3e',   // body oscuro (cabeza, cuerpo base)
    C: '#3c3c54',   // body slate medio
    D: '#7a5528',   // espalda marrón (back)
    E: '#cc2200',   // pico y escudo rojo
    F: '#f0c820',   // punta pico amarilla
    G: '#dcdcec',   // franja blanca flanco / undertail
    H: '#b8d038',   // patas verde-amarillo
    I: '#dd2800',   // escudo rojo frontal (igual a E pero semántico)
    J: '#b8d038',   // patas (igual a H)
    K: '#4a3020',   // ala/espalda oscura
    M: '#c8860a',   // galleta relleno
    N: '#8b4513',   // galleta borde
    O: '#f0b040',   // galleta brillo
  };

  const _='_',A='A',B='B',C='C',D='D',E='E',F='F',G='G',H='H',I='I',J='J',K='K',M='M',N='N',O='O';

  // ── Frames base (12×16) ───────────────────────────────────────
  // Tinguá mirando a la derecha. Escudo rojo en la frente, pico rojo+amarillo,
  // cuerpo oscuro, espalda marrón, franja blanca en el flanco.
  const IDLE_A = [
    [_,_,_,_,I,I,I,_,_,_,_,_],   // escudo frontal
    [_,_,_,I,B,B,I,B,_,_,_,_],   // cabeza + escudo
    [_,_,_,B,B,E,E,E,F,_,_,_],   // cabeza + pico rojo + tip amarillo
    [_,_,_,_,B,D,B,_,_,_,_,_],   // cuello
    [_,_,A,B,D,D,D,B,A,_,_,_],   // espalda
    [_,A,B,C,D,D,C,C,B,A,_,_],   // cuerpo
    [A,B,C,D,D,C,C,C,C,B,_,_],   // cuerpo ancho
    [B,C,G,G,C,C,C,C,B,_,_,_],   // franja blanca flanco
    [B,C,G,C,C,C,C,B,_,_,_,_],   // vientre
    [_,B,C,C,C,C,B,_,_,_,_,_],   // bajo cuerpo
    [_,_,B,G,G,B,_,_,_,_,_,_],   // undertail blanco
    [_,_,_,B,B,_,_,_,_,_,_,_],   // cola
    [_,_,_,J,_,J,_,_,_,_,_,_],   // patas
    [_,_,J,J,_,J,J,_,_,_,_,_],   // pies
    [_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_],
  ];
  const IDLE_B = [
    [_,_,_,_,I,I,I,_,_,_,_,_],
    [_,_,_,I,B,B,I,B,_,_,_,_],
    [_,_,_,B,B,E,E,E,F,_,_,_],
    [_,_,_,_,B,D,B,_,_,_,_,_],
    [_,_,A,B,D,D,D,B,A,_,_,_],
    [_,A,B,C,D,D,C,C,B,A,_,_],
    [A,B,G,D,D,C,C,C,C,B,_,_],   // franja blanca en posición diferente (cola arriba)
    [B,C,G,G,C,C,C,C,B,_,_,_],
    [B,C,C,C,C,C,C,B,_,_,_,_],
    [_,B,C,C,C,C,B,_,_,_,_,_],
    [_,_,B,G,G,B,_,_,_,_,_,_],
    [_,_,_,B,B,_,_,_,_,_,_,_],
    [_,_,_,J,_,J,_,_,_,_,_,_],
    [_,_,J,J,_,J,J,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_],
  ];
  // Frame gordo (14×17)
  const FAT_A = [
    [_,_,_,_,_,I,I,I,_,_,_,_,_,_],
    [_,_,_,_,I,B,B,I,B,_,_,_,_,_],
    [_,_,_,_,B,B,E,E,E,F,_,_,_,_],
    [_,_,_,_,_,B,D,B,_,_,_,_,_,_],
    [_,_,_,A,B,D,D,D,B,A,_,_,_,_],
    [_,_,A,B,C,D,D,D,C,B,A,_,_,_],
    [_,A,B,C,D,D,D,C,C,C,B,A,_,_],
    [A,B,C,D,D,D,C,C,C,C,C,B,_,_],
    [B,C,G,G,G,C,C,C,C,C,B,_,_,_],
    [B,C,G,G,C,C,C,C,C,B,_,_,_,_],
    [B,C,C,C,C,C,C,C,B,_,_,_,_,_],
    [_,B,C,C,C,C,C,B,_,_,_,_,_,_],
    [_,_,B,G,G,G,B,_,_,_,_,_,_,_],
    [_,_,_,B,B,B,_,_,_,_,_,_,_,_],
    [_,_,_,_,J,_,J,_,_,_,_,_,_,_],
    [_,_,_,J,J,_,J,J,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  ];
  const FAT_B = [
    [_,_,_,_,_,I,I,I,_,_,_,_,_,_],
    [_,_,_,_,I,B,B,I,B,_,_,_,_,_],
    [_,_,_,_,B,B,E,E,E,F,_,_,_,_],
    [_,_,_,_,_,B,D,B,_,_,_,_,_,_],
    [_,_,_,A,B,D,D,D,B,A,_,_,_,_],
    [_,_,A,B,C,D,D,D,C,B,A,_,_,_],
    [_,A,B,C,D,D,D,C,C,C,B,A,_,_],
    [A,B,G,D,D,D,C,C,C,C,C,B,_,_],
    [B,C,G,G,G,C,C,C,C,C,B,_,_,_],
    [B,C,G,C,C,C,C,C,C,B,_,_,_,_],
    [B,C,C,C,C,C,C,C,B,_,_,_,_,_],
    [_,B,C,C,C,C,C,B,_,_,_,_,_,_],
    [_,_,B,G,G,G,B,_,_,_,_,_,_,_],
    [_,_,_,B,B,B,_,_,_,_,_,_,_,_],
    [_,_,_,_,J,_,J,_,_,_,_,_,_,_],
    [_,_,_,J,J,_,J,J,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_,_,_],
  ];
  // Frame comiendo (pico extendido)
  const EAT_A = [
    [_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,I,I,I,_,_,_,_,_],
    [_,_,_,I,B,B,I,B,_,_,_,_],
    [_,_,_,B,B,E,E,E,F,_,_,_],
    [_,_,A,B,D,D,D,B,A,_,_,_],
    [_,A,B,C,D,D,C,C,B,A,_,_],
    [A,B,C,D,D,C,C,C,C,B,_,_],
    [B,C,G,G,C,C,C,C,B,_,_,_],
    [B,C,G,C,C,C,C,B,_,_,_,_],
    [_,B,C,C,C,C,B,_,_,_,_,_],
    [_,_,B,G,G,B,_,_,_,_,_,_],
    [_,_,_,B,B,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,J,_,J,_,_,_,_,_,_],
    [_,_,J,J,_,J,J,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_],
  ];
  const EAT_B = [
    [_,_,_,_,I,I,I,_,_,_,_,_],
    [_,_,_,I,B,B,I,B,_,_,_,_],
    [_,_,_,B,B,E,E,E,_,_,_,_],   // pico abierto arriba
    [_,_,_,_,_,E,E,F,F,_,_,_],   // mandíbula inferior
    [_,_,A,B,D,D,D,B,A,_,_,_],
    [_,A,B,C,D,D,C,C,B,A,_,_],
    [A,B,C,D,D,C,C,C,C,B,_,_],
    [B,C,G,G,C,C,C,C,B,_,_,_],
    [B,C,G,C,C,C,C,B,_,_,_,_],
    [_,B,C,C,C,C,B,_,_,_,_,_],
    [_,_,B,G,G,B,_,_,_,_,_,_],
    [_,_,_,B,B,_,_,_,_,_,_,_],
    [_,_,_,J,_,J,_,_,_,_,_,_],
    [_,_,J,J,_,J,J,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_],
    [_,_,_,_,_,_,_,_,_,_,_,_],
  ];
  // Milhojas colombiana 10×12 (capas de hojaldre + crema + glasé)
  // M=hojaldre dorado, O=hojaldre claro, N=borde/sombra, G=crema blanca, F=glasé azúcar
  const COOKIE = [
    [_,_,N,N,N,N,N,N,_,_],   // glasé arriba
    [_,N,F,F,F,F,F,F,N,_],   // glasé blanco
    [N,F,F,O,F,F,O,F,F,N],   // glasé con brillo
    [N,N,N,N,N,N,N,N,N,N],   // borde capa 1
    [N,M,M,O,M,M,O,M,M,N],   // hojaldre 1
    [N,G,G,G,G,G,G,G,G,N],   // crema
    [N,G,G,G,G,G,G,G,G,N],   // crema
    [N,N,N,N,N,N,N,N,N,N],   // borde capa 2
    [N,M,O,M,M,O,M,M,O,N],   // hojaldre 2
    [N,M,M,M,M,M,M,M,M,N],   // hojaldre 2 base
    [_,N,N,N,N,N,N,N,N,_],   // base
    [_,_,_,_,_,_,_,_,_,_],
  ];

  // ── Frases ───────────────────────────────────────────────────
  const FRASES_COMER = [
    '¡Ay, qué chimba de milhojas, parce! 🥐',
    '¡Gracias! Las tinguás también merecemos milhojas 🐦',
    '¡Crico crico! ¡Más capas, más crema!',
    '¡Qué delicia! Mejor que los peces del Juan Amarillo 🌿',
    '¡Eso sí es política de verdad, parcero! 🇨🇴',
    '¡Mmm! La democracia sabe a milhojas hoy 😏',
    '¡Juepucha, qué rica! Dame otra plis 🙏',
    '¡Tô engordando pero feliz! 😄',
    '¡Crico! Ya no quepo en el humedal de La Conejera 🌿',
    '¡Mejor que los peces del Jaboque, oe!',
  ];
  const FRASES_GORDO = [
    '¡Crico crico! Ya estoy gordito 😅',
    '¡Me estás engordando con tanto bocado! 🍪',
    '¡Barrigón pero feliz, parce! 🇨🇴',
    '¡Tanto bocado y ya no puedo volar de humedal en humedal! 😂',
  ];
  const FRASES_TRUCO = [
    '¡Crico! ¿Eso o no es un truco? 🎪',
    '¡Así hace la tinguá política! 💫',
    '¡Mejor que el Congreso, oe! 🎭',
    '¡Aprendo trucos más rápido que las reformas! 🔄',
  ];
  const FRASES_IDLE = [
    '¿Sabías que vivo en el humedal La Vaca? 🌿 Los políticos, no.',
    'Crico crico... ¿me das un bocadito, parce? 🍞',
    'Yo ví cuando aprobaron esa ley. Estaba en el humedal Córdoba.',
    'El Congreso tiene 108 senadores. El humedal Jaboque: 108 problemas. ¿Coincidencia? 🤔',
    'Suscríbete al boletín — llega fresquito cada lunes 📩',
    'Crico crico... la política se entiende mejor con bocados 💛',
    '¿Leíste la noticia de hoy? Dale clic y te cuento',
    '¡Ey! No me mires así, soy un ave protegida 🐦',
    'En Bogotá destruyen más humedales que votos válidos hay 😅',
    '¡Política sin rollos! Eso es lo que hace TBP 🇨🇴',
    '¿Quién drena los humedales bogotanos? Yo lo sé... 🤔',
    '¡Ey parce! ¿Me vas a dar galleta o qué?',
    'Me llamo Brayan Sleyder. Soy la tinguá más informada del humedal.',
    '¡Crico! Aquí Brayan, reportando desde La Conejera 📡',
  ];

  // ── Niveles de gordura ────────────────────────────────────────
  const GORDURA = [
    { galletas: 0,  label: 'Brayan Sleyder',       scale: 1.0  },
    { galletas: 3,  label: 'Brayan Bien Comido',   scale: 1.25 },
    { galletas: 6,  label: 'Brayan Barrigón',      scale: 1.5  },
    { galletas: 10, label: 'Brayan Mazacote',      scale: 1.8  },
    { galletas: 15, label: 'MEGA BRAYAN SLEYDER',  scale: 2.1  },
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

    // ── Tab lateral ──
    const tab = document.createElement('button');
    tab.title = 'Brayan Sleyder';
    Object.assign(tab.style, {
      position:'fixed', right:'0', bottom:'100px', zIndex:'9989',
      background:'rgba(12,13,15,0.85)', border:'2px solid rgba(245,195,26,0.45)',
      borderRight:'none', cursor:'pointer', padding:'10px 6px',
      display:'flex', flexDirection:'column', alignItems:'center', gap:'4px',
      transition:'background .15s, border-color .15s',
      backdropFilter:'blur(4px)',
    });
    tab.innerHTML = '<span style="font-size:18px;line-height:1">🐦</span><span style="font-family:\'Bebas Neue\',sans-serif;font-size:9px;color:#F5C31A;letter-spacing:.1em;writing-mode:vertical-rl;transform:rotate(180deg)">BRAYAN</span>';
    tab.addEventListener('mouseenter', () => { tab.style.background='rgba(245,195,26,0.15)'; tab.style.borderColor='rgba(245,195,26,0.8)'; });
    tab.addEventListener('mouseleave', () => { tab.style.background='rgba(12,13,15,0.85)'; tab.style.borderColor='rgba(245,195,26,0.45)'; });
    document.body.appendChild(tab);

    // ── Botón cerrar ──
    const btnClose = document.createElement('button');
    btnClose.textContent = '✕';
    btnClose.title = 'Esconder a Brayan';
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

    // ── Canvas tinguá ──
    const canvas = document.createElement('canvas');
    canvas.width = FCW; canvas.height = FCH;
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
    badge.textContent = 'DELGADITO';

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
    cookieCanvas.width = 10*S; cookieCanvas.height = 12*S;
    Object.assign(cookieCanvas.style, { imageRendering:'pixelated', display:'block' });
    const cctx = cookieCanvas.getContext('2d');
    cctx.imageSmoothingEnabled = false;
    dibujar(cctx, COOKIE);

    const btnGalleta = mkBtn('', 'Dale una milhojas a Brayan 🥐');
    btnGalleta.prepend(cookieCanvas);
    const galletaLbl = document.createElement('span');
    galletaLbl.textContent = 'MILHOJAS';
    btnGalleta.appendChild(galletaLbl);

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
    let haciendo   = false;

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

    function darGalleta() {
      galletasComidas++;
      state = 'eating'; stateTimer = 80;
      const nivelAnt = getNivel(galletasComidas - 1);
      const nivelNow = getNivel(galletasComidas);
      esFat = galletasComidas >= 6;
      if (nivelNow !== nivelAnt) {
        badge.textContent = nivelNow.label.toUpperCase();
        mostrarBurbuja(FRASES_GORDO[Math.floor(Math.random() * FRASES_GORDO.length)]);
        canvas.classList.remove('tbp-jump');
        requestAnimationFrame(() => canvas.classList.add('tbp-jump'));
        setTimeout(() => canvas.classList.remove('tbp-jump'), 700);
      } else {
        mostrarBurbuja(FRASES_COMER[Math.floor(Math.random() * FRASES_COMER.length)]);
      }
      applyScale();
      try { localStorage.setItem('tbp-galletas', galletasComidas); } catch(e) {}
      counter.textContent = galletasComidas === 1 ? '1 milhojas comida 🥐' : `${galletasComidas} milhojas comidas 🥐`;
      btnGalleta.style.transform = 'scale(0.88)';
      setTimeout(() => btnGalleta.style.transform = 'scale(1)', 150);
    }

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
    badge.textContent = getNivel(galletasComidas).label.toUpperCase();
    counter.textContent = galletasComidas > 0 ? `${galletasComidas} milhojas comidas 🥐` : '0 milhojas';
    setVisible(false);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
