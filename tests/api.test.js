// Tests de integración — Tu Bocado Político
// Requiere el servidor corriendo en localhost:3000
// Ejecutar: npm test

'use strict';
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

const BASE = 'http://localhost:3000';

async function req(path, opts = {}) {
  return fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...opts.headers },
    ...opts,
  });
}
async function getJson(path, opts = {}) {
  const r = await req(path, opts);
  return { status: r.status, body: await r.json() };
}

// ── Servidor ────────────────────────────────────────────────────────
describe('Servidor', () => {
  test('responde en localhost:3000', async () => {
    const r = await req('/');
    assert.ok(r.status < 500);
  });
});

// ── GET /api/noticias ───────────────────────────────────────────────
describe('GET /api/noticias', () => {
  test('retorna 200 con array', async () => {
    const { status, body } = await getJson('/api/noticias');
    assert.strictEqual(status, 200);
    assert.ok(Array.isArray(body));
  });

  test('artículos tienen los campos requeridos', async () => {
    const { body } = await getJson('/api/noticias');
    if (!body.length) return;
    const campos = ['id', 'titulo', 'cuerpo', 'categoria', 'publicada', 'created_at'];
    for (const campo of campos) assert.ok(campo in body[0], `falta: ${campo}`);
  });

  test('solo retorna artículos publicados', async () => {
    const { body } = await getJson('/api/noticias');
    for (const n of body) assert.strictEqual(n.publicada, true);
  });
});

// ── GET /api/noticias/:id ───────────────────────────────────────────
describe('GET /api/noticias/:id', () => {
  test('retorna 404 para ID inexistente', async () => {
    const { status } = await getJson('/api/noticias/999999');
    assert.strictEqual(status, 404);
  });

  test('retorna el artículo correcto por ID', async () => {
    const { body: lista } = await getJson('/api/noticias');
    if (!lista.length) return;
    const { status, body } = await getJson(`/api/noticias/${lista[0].id}`);
    assert.strictEqual(status, 200);
    assert.strictEqual(body.id, lista[0].id);
  });
});

// ── Autenticación ────────────────────────────────────────────────────
describe('GET /api/me', () => {
  test('retorna 401 sin sesión', async () => {
    const { status } = await getJson('/api/me');
    assert.strictEqual(status, 401);
  });
});

describe('POST /api/login', () => {
  test('retorna 401 con credenciales incorrectas', async () => {
    const { status, body } = await getJson('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'falso@test.com', password: 'wrong' }),
    });
    assert.strictEqual(status, 401);
    assert.ok(body.error);
  });

  test('retorna 401 con contraseña incorrecta', async () => {
    const { status } = await getJson('/api/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'natalia@tubocadopolitico.com', password: 'mala' }),
    });
    assert.strictEqual(status, 401);
  });
});

// ── Rutas admin sin sesión ───────────────────────────────────────────
describe('Rutas admin (sin autenticación)', () => {
  const rutas = [
    ['GET',    '/api/admin/noticias'],
    ['POST',   '/api/admin/noticias'],
    ['PUT',    '/api/admin/noticias/1'],
    ['DELETE', '/api/admin/noticias/1'],
    ['GET',    '/api/admin/suscriptores'],
    ['GET',    '/api/admin/usuarios'],
  ];

  for (const [method, ruta] of rutas) {
    test(`${method} ${ruta} → 401 o 403`, async () => {
      const { status } = await getJson(ruta, {
        method,
        body: method !== 'GET' ? JSON.stringify({}) : undefined,
      });
      assert.ok([401, 403].includes(status), `esperaba 401/403, recibió ${status}`);
    });
  }
});

// ── Suscriptores (validación) ────────────────────────────────────────
describe('POST /api/suscriptores', () => {
  test('retorna 400 sin nombre', async () => {
    const { status } = await getJson('/api/suscriptores', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@test.com' }),
    });
    assert.strictEqual(status, 400);
  });

  test('retorna 400 sin email', async () => {
    const { status } = await getJson('/api/suscriptores', {
      method: 'POST',
      body: JSON.stringify({ nombre: 'Test' }),
    });
    assert.strictEqual(status, 400);
  });
});
