import { test, expect } from '@playwright/test';

test.describe('Auth API - POST /api/register', () => {

  test.describe('Cenários Positivos', () => {

    test('deve registrar usuário com credenciais válidas', async ({ request }) => {
      const payload = {
        email: 'eve.holt@reqres.in',
        password: 'pistol',
      };

      const response = await request.post('/api/register', { data: payload });

      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toContain('application/json');

      const body = await response.json();
      expect(body.id).toBeTruthy();
      expect(body.token).toBeTruthy();
      expect(typeof body.id).toBe('number');
      expect(typeof body.token).toBe('string');
    });
  });

  test.describe('Cenários Negativos', () => {

    test('deve rejeitar registro sem senha', async ({ request }) => {
      const payload = { email: 'eve.holt@reqres.in' };

      const response = await request.post('/api/register', { data: payload });

      expect(response.status()).toBe(400);

      const body = await response.json();
      expect(body.error).toBe('Missing password');
    });

    test('deve rejeitar registro sem email', async ({ request }) => {
      const payload = { password: 'pistol' };

      const response = await request.post('/api/register', { data: payload });

      expect(response.status()).toBe(400);

      const body = await response.json();
      expect(body.error).toBe('Missing email or username');
    });

    test('deve rejeitar registro com payload vazio', async ({ request }) => {
      const response = await request.post('/api/register', { data: {} });

      expect(response.status()).toBe(400);

      const body = await response.json();
      expect(body.error).toBeTruthy();
    });

    test('deve rejeitar registro com email não cadastrado na base', async ({ request }) => {
      const payload = {
        email: 'usuario.nao.existe@test.com',
        password: 'senha123',
      };

      const response = await request.post('/api/register', { data: payload });

      expect(response.status()).toBe(400);

      const body = await response.json();
      expect(body.error).toBeTruthy();
    });

    test('deve rejeitar registro com email inválido', async ({ request }) => {
      const payload = {
        email: 'email-invalido',
        password: 'senha123',
      };

      const response = await request.post('/api/register', { data: payload });

      expect(response.status()).toBe(400);

      const body = await response.json();
      expect(body.error).toBeTruthy();
    });
  });
});

test.describe('Auth API - POST /api/login', () => {

  test.describe('Cenários Positivos', () => {

    test('deve autenticar com credenciais válidas', async ({ request }) => {
      const payload = {
        email: 'eve.holt@reqres.in',
        password: 'cityslicka',
      };

      const response = await request.post('/api/login', { data: payload });

      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toContain('application/json');

      const body = await response.json();
      expect(body.token).toBeTruthy();
      expect(typeof body.token).toBe('string');
      expect(body.token.length).toBeGreaterThan(0);
    });
  });

  test.describe('Cenários Negativos', () => {

    test('deve rejeitar login sem senha', async ({ request }) => {
      const payload = { email: 'eve.holt@reqres.in' };

      const response = await request.post('/api/login', { data: payload });

      expect(response.status()).toBe(400);

      const body = await response.json();
      expect(body.error).toBe('Missing password');
    });

    test('deve rejeitar login sem email', async ({ request }) => {
      const payload = { password: 'cityslicka' };

      const response = await request.post('/api/login', { data: payload });

      expect(response.status()).toBe(400);

      const body = await response.json();
      expect(body.error).toBe('Missing email or username');
    });

    test('deve rejeitar login com payload vazio', async ({ request }) => {
      const response = await request.post('/api/login', { data: {} });

      expect(response.status()).toBe(400);

      const body = await response.json();
      expect(body.error).toBeTruthy();
    });

    test('deve rejeitar login com email não cadastrado', async ({ request }) => {
      const payload = {
        email: 'naoexiste@test.com',
        password: 'qualquersenha',
      };

      const response = await request.post('/api/login', { data: payload });

      expect(response.status()).toBe(400);

      const body = await response.json();
      expect(body.error).toBe('user not found');
    });

    test('deve rejeitar login com campos nulos', async ({ request }) => {
      const payload = { email: null, password: null };

      const response = await request.post('/api/login', { data: payload });

      expect(response.status()).toBe(400);

      const body = await response.json();
      expect(body.error).toBeTruthy();
    });
  });
});

test.describe('Auth API - Validações de Segurança', () => {

  test('não deve expor dados sensíveis no registro bem-sucedido', async ({ request }) => {
    const payload = {
      email: 'eve.holt@reqres.in',
      password: 'pistol',
    };

    const response = await request.post('/api/register', { data: payload });
    const body = await response.json();

    // Não deve retornar a senha no body
    expect(body).not.toHaveProperty('password');
    expect(JSON.stringify(body)).not.toContain('pistol');
  });

  test('não deve expor dados sensíveis no login bem-sucedido', async ({ request }) => {
    const payload = {
      email: 'eve.holt@reqres.in',
      password: 'cityslicka',
    };

    const response = await request.post('/api/login', { data: payload });
    const body = await response.json();

    expect(body).not.toHaveProperty('password');
    expect(JSON.stringify(body)).not.toContain('cityslicka');
  });
});

test.describe('Resources API - GET /api/unknown', () => {

  test('deve listar recursos com estrutura correta', async ({ request }) => {
    const response = await request.get('/api/unknown');

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.data).toBeInstanceOf(Array);
    expect(body.data.length).toBeGreaterThan(0);

    const resource = body.data[0];
    expect(resource).toHaveProperty('id');
    expect(resource).toHaveProperty('name');
    expect(resource).toHaveProperty('year');
    expect(resource).toHaveProperty('color');
    expect(resource).toHaveProperty('pantone_value');
  });

  test('deve retornar recurso único por ID', async ({ request }) => {
    const response = await request.get('/api/unknown/2');

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.data.id).toBe(2);
    expect(body.data.name).toBeTruthy();
  });

  test('deve retornar 404 para recurso inexistente', async ({ request }) => {
    const response = await request.get('/api/unknown/23');

    expect(response.status()).toBe(404);
  });
});

test.describe('API - Delayed Response', () => {

  test('deve lidar com resposta com delay de 3 segundos', async ({ request }) => {
    const start = Date.now();

    const response = await request.get('/api/users?delay=3');
    const elapsed = Date.now() - start;

    expect(response.status()).toBe(200);
    expect(elapsed).toBeGreaterThanOrEqual(2500);

    const body = await response.json();
    expect(body.data).toBeInstanceOf(Array);
  });
});
