require('dotenv').config();
const express  = require('express');
const session  = require('express-session');
const bcrypt   = require('bcryptjs');
const path     = require('path');
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
