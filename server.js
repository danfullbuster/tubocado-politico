require('dotenv').config({ path: require('path').join(__dirname, '.env') });
require('dns').setDefaultResultOrder('ipv4first');
const express    = require('express');
const session    = require('express-session');
const bcrypt     = require('bcryptjs');
const path       = require('path');
const nodemailer = require('nodemailer');
const { MongoClient } = require('mongodb');

const app  = express();
const PORT = process.env.PORT || 3000;

let db;

// ── MongoDB ──────────────────────────────────────────────────────────
async function connect() {
  if (!process.env.MONGODB_URI || process.env.MONGODB_URI.includes('USUARIO')) {
    throw new Error('Configura MONGODB_URI en el archivo .env');
  }
  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  db = client.db('tbp');
  console.log('✅  MongoDB conectado');
}

async function nextId(col) {
  const last = await db.collection(col).findOne({}, { sort: { id: -1 } });
  return last ? last.id + 1 : 1;
}

async function seed() {
  const count = await db.collection('usuarios').countDocuments();
  if (count > 0) return;
  const hash = (pw) => bcrypt.hashSync(pw, bcrypt.genSaltSync(10));
  await db.collection('usuarios').insertMany([
    { id:1, nombre:'Natalia', email:'natalia@tubocadopolitico.com', password: hash(process.env.ADMIN_PASSWORD_NATI  || 'tbp2024nati'),  rol:'admin', created_at: new Date() },
    { id:2, nombre:'Andrés',  email:'andres@tubocadopolitico.com',  password: hash(process.env.ADMIN_PASSWORD_ANDRE || 'tbp2024andre'), rol:'admin', created_at: new Date() },
  ]);
  console.log('✅  Usuarios iniciales creados');
}

// ── Middleware ───────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 8 * 60 * 60 * 1000 },
}));

// Bloquear acceso directo a archivos sensibles del servidor
app.use((req, res, next) => {
  const blocked = /^\/(?:server\.[jst]\w*|\.env|CREDENCIALES\.\w+|data\/|package(?:-lock)?\.json|node_modules\/|tests\/|start\.bat)/i;
  if (blocked.test(req.path)) return res.status(403).end();
  next();
});

app.use(express.static(__dirname));

function auth(req, res, next) {
  if (!req.session.user) return res.status(401).json({ error: 'No autorizado' });
  next();
}
function adminOnly(req, res, next) {
  if (!req.session.user || req.session.user.rol !== 'admin')
    return res.status(403).json({ error: 'Solo administradores' });
  next();
}

// ── AUTH ─────────────────────────────────────────────────────────────
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await db.collection('usuarios').findOne({ email });
    if (!user || !bcrypt.compareSync(password, user.password))
      return res.status(401).json({ error: 'Email o contraseña incorrectos' });
    req.session.user = { id: user.id, nombre: user.nombre, email: user.email, rol: user.rol };
    res.json({ ok: true, user: req.session.user });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ ok: true });
});

app.get('/api/me', (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: 'No autenticado' });
  res.json(req.session.user);
});

// ── NOTICIAS (público) ────────────────────────────────────────────────
app.get('/api/noticias', async (req, res) => {
  try {
    const noticias = await db.collection('noticias')
      .find({ publicada: true })
      .sort({ created_at: -1 })
      .toArray();
    res.json(noticias);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/noticias/:id', async (req, res) => {
  try {
    const n = await db.collection('noticias').findOne({ publicada: true, id: parseInt(req.params.id) });
    if (!n) return res.status(404).json({ error: 'No encontrada' });
    res.json(n);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── SUSCRIPTORES ──────────────────────────────────────────────────────
app.post('/api/suscriptores', async (req, res) => {
  try {
    const { nombre, email, fuente, temas } = req.body;
    if (!nombre?.trim() || !email?.trim())
      return res.status(400).json({ error: 'Nombre y email requeridos' });
    const emailNorm = email.trim().toLowerCase();
    if (await db.collection('suscriptores').findOne({ email: emailNorm }))
      return res.status(400).json({ error: 'Ya estás suscrito con ese correo' });
    await db.collection('suscriptores').insertOne({
      id: Date.now(),
      nombre: nombre.trim(),
      email: emailNorm,
      fuente: fuente || '',
      temas: temas || [],
      created_at: new Date(),
    });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/admin/suscriptores', adminOnly, async (req, res) => {
  try {
    res.json(await db.collection('suscriptores').find().sort({ created_at: -1 }).toArray());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── NOTICIAS (admin) ──────────────────────────────────────────────────
app.get('/api/admin/noticias', auth, async (req, res) => {
  try {
    res.json(await db.collection('noticias').find().sort({ created_at: -1 }).toArray());
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/admin/noticias', auth, async (req, res) => {
  try {
    const { titulo, subtitulo, cuerpo, categoria, imagen_url, destacada } = req.body;
    if (!titulo?.trim() || !cuerpo?.trim())
      return res.status(400).json({ error: 'Título y contenido son obligatorios' });
    const nueva = {
      id:           await nextId('noticias'),
      titulo:       titulo.trim(),
      subtitulo:    subtitulo?.trim() || '',
      cuerpo:       cuerpo.trim(),
      categoria:    categoria || 'noticias',
      autor_id:     req.session.user.id,
      autor_nombre: req.session.user.nombre,
      imagen_url:   imagen_url?.trim() || '',
      destacada:    destacada === true || destacada === 'true',
      publicada:    true,
      created_at:   new Date(),
      updated_at:   new Date(),
    };
    await db.collection('noticias').insertOne(nueva);
    res.json({ ok: true, noticia: nueva });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/admin/noticias/:id', auth, async (req, res) => {
  try {
    const id  = parseInt(req.params.id);
    const doc = await db.collection('noticias').findOne({ id });
    if (!doc) return res.status(404).json({ error: 'Noticia no encontrada' });
    const update = {
      titulo:     req.body.titulo?.trim()     || doc.titulo,
      subtitulo:  req.body.subtitulo?.trim()  ?? doc.subtitulo,
      cuerpo:     req.body.cuerpo?.trim()     || doc.cuerpo,
      categoria:  req.body.categoria          || doc.categoria,
      imagen_url: req.body.imagen_url?.trim() ?? doc.imagen_url,
      destacada:  req.body.destacada === true || req.body.destacada === 'true',
      publicada:  req.body.publicada !== false && req.body.publicada !== 'false',
      updated_at: new Date(),
    };
    await db.collection('noticias').updateOne({ id }, { $set: update });
    res.json({ ok: true, noticia: { ...doc, ...update } });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/admin/noticias/:id', auth, async (req, res) => {
  try {
    await db.collection('noticias').deleteOne({ id: parseInt(req.params.id) });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── USUARIOS ──────────────────────────────────────────────────────────
app.get('/api/admin/usuarios', adminOnly, async (req, res) => {
  try {
    const usuarios = await db.collection('usuarios').find().toArray();
    res.json(usuarios.map(u => ({ ...u, password: undefined, _id: undefined })));
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/admin/usuarios', adminOnly, async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;
    if (!nombre || !email || !password)
      return res.status(400).json({ error: 'Nombre, email y contraseña son obligatorios' });
    if (await db.collection('usuarios').findOne({ email: email.trim().toLowerCase() }))
      return res.status(400).json({ error: 'Ya existe un usuario con ese email' });
    const nuevo = {
      id:         await nextId('usuarios'),
      nombre:     nombre.trim(),
      email:      email.trim().toLowerCase(),
      password:   bcrypt.hashSync(password, bcrypt.genSaltSync(10)),
      rol:        rol || 'editor',
      created_at: new Date(),
    };
    await db.collection('usuarios').insertOne(nuevo);
    res.json({ ok: true, usuario: { ...nuevo, password: undefined, _id: undefined } });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.put('/api/admin/usuarios/:id/password', adminOnly, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (!req.body.password) return res.status(400).json({ error: 'Nueva contraseña requerida' });
    const result = await db.collection('usuarios').updateOne(
      { id },
      { $set: { password: bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10)) } }
    );
    if (result.matchedCount === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.delete('/api/admin/usuarios/:id', adminOnly, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (req.session.user.id === id) return res.status(400).json({ error: 'No puedes eliminarte a ti mismo' });
    await db.collection('usuarios').deleteOne({ id });
    res.json({ ok: true });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// ── EMAIL ─────────────────────────────────────────────────────────────
function createTransporter() {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) return null;
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
    connectionTimeout: 12000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
  });
}

function buildEmailHtml(asunto, cuerpo, nombre) {
  const paragraphs = cuerpo.split(/\n\n+/)
    .map(p => `<p style="margin:0 0 18px;font-size:16px;line-height:1.7;color:#1a1a1a;">${p.replace(/\n/g,'<br>')}</p>`)
    .join('');
  const saludo = nombre ? `<p style="margin:0 0 18px;font-size:16px;line-height:1.7;color:#1a1a1a;">Hola ${nombre},</p>` : '';
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f4f4f4;font-family:'Helvetica Neue',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-top:6px solid #F5C31A;">
        <!-- Header -->
        <tr><td style="background:#0C0D0F;padding:20px 32px;">
          <span style="font-family:Impact,Arial Black,sans-serif;font-size:26px;letter-spacing:.05em;color:#F5C31A;">TU<span style="color:rgba(245,195,26,.45)">/</span>BOCADO</span>
          <span style="font-family:Arial,sans-serif;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:rgba(245,195,26,.5);margin-left:12px;">POLÍTICO</span>
        </td></tr>
        <!-- Subject bar -->
        <tr><td style="background:#F5C31A;padding:14px 32px;">
          <span style="font-family:Impact,Arial Black,sans-serif;font-size:18px;letter-spacing:.03em;color:#0C0D0F;text-transform:uppercase;">${asunto}</span>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:32px 32px 8px;">${saludo}${paragraphs}</td></tr>
        <!-- CTA -->
        <tr><td style="padding:8px 32px 32px;text-align:center;">
          <a href="https://tubocado-politico-production.up.railway.app" style="display:inline-block;background:#0C0D0F;color:#F5C31A;font-family:Impact,Arial Black,sans-serif;font-size:16px;letter-spacing:.08em;text-decoration:none;padding:14px 32px;text-transform:uppercase;">Ver todas las noticias →</a>
        </td></tr>
        <!-- Footer -->
        <tr><td style="background:#f4f4f4;padding:20px 32px;border-top:2px solid #e4e4e4;">
          <p style="margin:0;font-size:12px;color:#888;text-align:center;line-height:1.6;">
            Recibiste esto porque te suscribiste a Tu Bocado Político.<br>
            Para cancelar tu suscripción responde este correo con el asunto "Cancelar".
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

app.get('/api/admin/newsletter/status', auth, async (req, res) => {
  const configurado = !!(process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD);
  if (!configurado) return res.json({ configurado: false });
  try {
    const t = createTransporter();
    await t.verify();
    res.json({ configurado: true, conexion: 'ok', usuario: process.env.GMAIL_USER });
  } catch(e) {
    res.json({ configurado: true, conexion: 'error', error: e.message });
  }
});

app.post('/api/admin/newsletter', auth, async (req, res) => {
  try {
    const { asunto, cuerpo } = req.body;
    if (!asunto?.trim() || !cuerpo?.trim())
      return res.status(400).json({ error: 'Asunto y contenido son obligatorios' });

    const transporter = createTransporter();
    if (!transporter)
      return res.status(503).json({ error: 'Correo no configurado. Agrega GMAIL_USER y GMAIL_APP_PASSWORD en las variables de entorno.' });

    const suscriptores = await db.collection('suscriptores').find().toArray();
    if (!suscriptores.length)
      return res.status(400).json({ error: 'No hay suscriptores registrados' });

    let enviados = 0, errores = 0;
    for (const s of suscriptores) {
      try {
        await transporter.sendMail({
          from: `"Tu Bocado Político" <${process.env.GMAIL_USER}>`,
          to: s.email,
          subject: asunto,
          html: buildEmailHtml(asunto, cuerpo, s.nombre),
        });
        enviados++;
      } catch(e) {
        errores++;
      }
    }

    await db.collection('newsletters').insertOne({
      id: Date.now(),
      asunto,
      enviado_por: req.session.user.nombre,
      total: suscriptores.length,
      enviados,
      errores,
      created_at: new Date(),
    });

    res.json({ ok: true, enviados, errores, total: suscriptores.length });
  } catch(e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/admin/newsletters', auth, async (req, res) => {
  try {
    res.json(await db.collection('newsletters').find().sort({ created_at: -1 }).limit(20).toArray());
  } catch(e) { res.status(500).json({ error: e.message }); }
});

// ── Start ─────────────────────────────────────────────────────────────
connect()
  .then(() => seed())
  .then(() => {
    app.listen(PORT, () => {
      console.log(`\n🟡  Tu Bocado Político — servidor corriendo`);
      console.log(`    Sitio:  http://localhost:${PORT}`);
      console.log(`    Admin:  http://localhost:${PORT}/admin/login.html\n`);
    });
  })
  .catch(err => {
    console.error('❌  Error al iniciar:', err.message);
    process.exit(1);
  });
