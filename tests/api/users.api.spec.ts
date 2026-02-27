import { test, expect } from '@playwright/test';

test.describe('Users API - GET /api/users', () => {

  test.describe('Cenários Positivos', () => {

    test('deve listar usuários com paginação (página 1)', async ({ request }) => {
      const response = await request.get('/api/users?page=1');

      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toContain('application/json');

      const body = await response.json();
      expect(body.page).toBe(1);
      expect(body.per_page).toBeGreaterThan(0);
      expect(body.total).toBeGreaterThan(0);
      expect(body.total_pages).toBeGreaterThan(0);
      expect(body.data).toBeInstanceOf(Array);
      expect(body.data.length).toBeGreaterThan(0);

      const user = body.data[0];
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('first_name');
      expect(user).toHaveProperty('last_name');
      expect(user).toHaveProperty('avatar');
    });

    test('deve listar usuários da página 2', async ({ request }) => {
      const response = await request.get('/api/users?page=2');

      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body.page).toBe(2);
      expect(body.data).toBeInstanceOf(Array);
      expect(body.data.length).toBeGreaterThan(0);
    });

    test('deve retornar um único usuário por ID', async ({ request }) => {
      const response = await request.get('/api/users/2');

      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toContain('application/json');

      const body = await response.json();
      expect(body.data).toBeDefined();
      expect(body.data.id).toBe(2);
      expect(body.data.email).toBeTruthy();
      expect(body.data.first_name).toBeTruthy();
      expect(body.data.last_name).toBeTruthy();
      expect(body.data.avatar).toContain('https://');
      expect(body.support).toBeDefined();
    });

    test('deve validar schema completo do usuário', async ({ request }) => {
      const response = await request.get('/api/users/1');
      const body = await response.json();

      expect(typeof body.data.id).toBe('number');
      expect(typeof body.data.email).toBe('string');
      expect(typeof body.data.first_name).toBe('string');
      expect(typeof body.data.last_name).toBe('string');
      expect(typeof body.data.avatar).toBe('string');
      expect(body.data.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    });
  });

  test.describe('Cenários Negativos', () => {

    test('deve retornar 404 para usuário inexistente', async ({ request }) => {
      const response = await request.get('/api/users/9999');

      expect(response.status()).toBe(404);

      const body = await response.json();
      expect(body).toEqual({});
    });

    test('deve retornar resposta vazia para página sem dados', async ({ request }) => {
      const response = await request.get('/api/users?page=999');

      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body.data).toEqual([]);
    });
  });
});

test.describe('Users API - POST /api/users', () => {

  test.describe('Cenários Positivos', () => {

    test('deve criar um novo usuário com dados válidos', async ({ request }) => {
      const payload = { name: 'João Silva', job: 'QA Engineer' };

      const response = await request.post('/api/users', { data: payload });

      expect(response.status()).toBe(201);
      expect(response.headers()['content-type']).toContain('application/json');

      const body = await response.json();
      expect(body.name).toBe(payload.name);
      expect(body.job).toBe(payload.job);
      expect(body.id).toBeTruthy();
      expect(body.createdAt).toBeTruthy();
    });

    test('deve criar usuário com campos extras', async ({ request }) => {
      const payload = {
        name: 'Maria Oliveira',
        job: 'Dev Lead',
        email: 'maria@test.com',
        department: 'Engineering',
      };

      const response = await request.post('/api/users', { data: payload });

      expect(response.status()).toBe(201);

      const body = await response.json();
      expect(body.name).toBe(payload.name);
      expect(body.id).toBeTruthy();
    });
  });

  test.describe('Cenários Negativos', () => {

    test('deve aceitar payload vazio (API permissiva)', async ({ request }) => {
      const response = await request.post('/api/users', { data: {} });

      expect(response.status()).toBe(201);

      const body = await response.json();
      expect(body.id).toBeTruthy();
      expect(body.createdAt).toBeTruthy();
    });

    test('deve validar resposta com payload malformado (string)', async ({ request }) => {
      const response = await request.post('/api/users', {
        data: 'texto-invalido',
        headers: { 'Content-Type': 'text/plain' },
      });

      expect([200, 201, 400, 415]).toContain(response.status());
    });
  });
});

test.describe('Users API - PUT /api/users', () => {

  test.describe('Cenários Positivos', () => {

    test('deve atualizar usuário existente completamente', async ({ request }) => {
      const payload = { name: 'Carlos Atualizado', job: 'Senior QA' };

      const response = await request.put('/api/users/2', { data: payload });

      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toContain('application/json');

      const body = await response.json();
      expect(body.name).toBe(payload.name);
      expect(body.job).toBe(payload.job);
      expect(body.updatedAt).toBeTruthy();
    });

    test('deve atualizar apenas um campo via PUT', async ({ request }) => {
      const payload = { name: 'Somente Nome' };

      const response = await request.put('/api/users/2', { data: payload });

      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body.name).toBe(payload.name);
      expect(body.updatedAt).toBeTruthy();
    });
  });

  test.describe('Cenários Negativos', () => {

    test('deve tratar PUT com payload vazio', async ({ request }) => {
      const response = await request.put('/api/users/2', { data: {} });

      expect(response.status()).toBe(200);

      const body = await response.json();
      expect(body.updatedAt).toBeTruthy();
    });

    test('deve tratar PUT para ID inexistente (API mock)', async ({ request }) => {
      const payload = { name: 'Fantasma', job: 'Ghost' };
      const response = await request.put('/api/users/99999', { data: payload });

      // reqres.in retorna 200 mesmo para IDs inexistentes (comportamento de mock)
      expect(response.status()).toBe(200);
    });
  });
});

test.describe('Users API - PATCH /api/users', () => {

  test('deve atualizar parcialmente um usuário', async ({ request }) => {
    const payload = { job: 'Tech Lead' };

    const response = await request.patch('/api/users/2', { data: payload });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.job).toBe(payload.job);
    expect(body.updatedAt).toBeTruthy();
  });
});

test.describe('Users API - DELETE /api/users', () => {

  test.describe('Cenários Positivos', () => {

    test('deve deletar usuário existente com sucesso', async ({ request }) => {
      const response = await request.delete('/api/users/2');

      expect(response.status()).toBe(204);
      expect(response.body.length).toBeFalsy;
    });
  });

  test.describe('Cenários Negativos', () => {

    test('deve tratar DELETE para ID inexistente', async ({ request }) => {
      const response = await request.delete('/api/users/99999');

      // reqres.in retorna 204 mesmo para IDs inexistentes
      expect(response.status()).toBe(204);
    });
  });
});

test.describe('Users API - Validação de Headers', () => {

  test('deve retornar headers obrigatórios na resposta', async ({ request }) => {
    const response = await request.get('/api/users?page=1');

    expect(response.headers()['content-type']).toContain('application/json');
    expect(response.headers()).toHaveProperty('content-type');
  });

  test('deve aceitar requisição com Accept header customizado', async ({ request }) => {
    const response = await request.get('/api/users/1', {
      headers: { 'Accept': 'application/json' },
    });

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
  });
});

test.describe('Users API - Métodos HTTP Inválidos', () => {

  test('deve tratar método HEAD corretamente', async ({ request }) => {
    const response = await request.head('/api/users/1');

    expect([200, 204, 403, 405]).toContain(response.status());
  });
});
