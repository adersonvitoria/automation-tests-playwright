import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';

test.describe('Users API - GET /api/users', () => {

  test.describe('Cenários Positivos', () => {

    test('deve listar usuários com paginação (página 1)', async ({ request }) => {
      await allure.epic('Users API');
      await allure.feature('Listagem de Usuários');
      await allure.story('Listar usuários com paginação');
      await allure.severity('critical');
      await allure.owner('QA Team');
      await allure.tag('API', 'GET', 'Users', 'Paginação');
      await allure.description(
        'Verifica se a API retorna a lista de usuários da página 1 com a estrutura correta de paginação, ' +
        'incluindo campos page, per_page, total, total_pages e array de dados com propriedades id, email, first_name, last_name e avatar.'
      );

      const response = await allure.step('Enviar GET /api/users?page=1', async () => {
        return await request.get('/api/users?page=1');
      });

      await allure.step('Validar status code 200', async () => {
        expect(response.status()).toBe(200);
      });

      await allure.step('Validar Content-Type application/json', async () => {
        expect(response.headers()['content-type']).toContain('application/json');
      });

      const body = await response.json();

      await allure.step('Validar estrutura de paginação', async () => {
        expect(body.page).toBe(1);
        expect(body.per_page).toBeGreaterThan(0);
        expect(body.total).toBeGreaterThan(0);
        expect(body.total_pages).toBeGreaterThan(0);
        expect(body.data).toBeInstanceOf(Array);
        expect(body.data.length).toBeGreaterThan(0);
      });

      await allure.step('Validar schema do usuário retornado', async () => {
        const user = body.data[0];
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('email');
        expect(user).toHaveProperty('first_name');
        expect(user).toHaveProperty('last_name');
        expect(user).toHaveProperty('avatar');
      });
    });

    test('deve listar usuários da página 2', async ({ request }) => {
      await allure.epic('Users API');
      await allure.feature('Listagem de Usuários');
      await allure.story('Listar usuários com paginação');
      await allure.severity('normal');
      await allure.owner('QA Team');
      await allure.tag('API', 'GET', 'Users', 'Paginação');
      await allure.description(
        'Verifica se a API retorna corretamente a segunda página de usuários, ' +
        'validando que o campo page é 2 e que o array de dados não está vazio.'
      );

      const response = await allure.step('Enviar GET /api/users?page=2', async () => {
        return await request.get('/api/users?page=2');
      });

      await allure.step('Validar status code 200', async () => {
        expect(response.status()).toBe(200);
      });

      const body = await response.json();

      await allure.step('Validar página 2 com dados', async () => {
        expect(body.page).toBe(2);
        expect(body.data).toBeInstanceOf(Array);
        expect(body.data.length).toBeGreaterThan(0);
      });
    });

    test('deve retornar um único usuário por ID', async ({ request }) => {
      await allure.epic('Users API');
      await allure.feature('Busca de Usuário');
      await allure.story('Buscar usuário por ID');
      await allure.severity('critical');
      await allure.owner('QA Team');
      await allure.tag('API', 'GET', 'Users', 'SingleResource');
      await allure.description(
        'Verifica se a API retorna os dados completos de um usuário específico por ID, ' +
        'incluindo id, email, first_name, last_name, avatar e bloco support.'
      );

      const response = await allure.step('Enviar GET /api/users/2', async () => {
        return await request.get('/api/users/2');
      });

      await allure.step('Validar status code 200 e Content-Type', async () => {
        expect(response.status()).toBe(200);
        expect(response.headers()['content-type']).toContain('application/json');
      });

      const body = await response.json();

      await allure.step('Validar dados do usuário retornado', async () => {
        expect(body.data).toBeDefined();
        expect(body.data.id).toBe(2);
        expect(body.data.email).toBeTruthy();
        expect(body.data.first_name).toBeTruthy();
        expect(body.data.last_name).toBeTruthy();
        expect(body.data.avatar).toContain('https://');
        expect(body.support).toBeDefined();
      });
    });

    test('deve validar schema completo do usuário', async ({ request }) => {
      await allure.epic('Users API');
      await allure.feature('Validação de Schema');
      await allure.story('Schema do objeto usuário');
      await allure.severity('critical');
      await allure.owner('QA Team');
      await allure.tag('API', 'GET', 'Users', 'Schema', 'Contrato');
      await allure.description(
        'Valida os tipos de dados de todos os campos do objeto usuário: ' +
        'id (number), email (string com formato válido), first_name (string), last_name (string), avatar (string).'
      );

      const response = await allure.step('Enviar GET /api/users/1', async () => {
        return await request.get('/api/users/1');
      });

      const body = await response.json();

      await allure.step('Validar tipos dos campos do schema', async () => {
        expect(typeof body.data.id).toBe('number');
        expect(typeof body.data.email).toBe('string');
        expect(typeof body.data.first_name).toBe('string');
        expect(typeof body.data.last_name).toBe('string');
        expect(typeof body.data.avatar).toBe('string');
      });

      await allure.step('Validar formato do email com regex', async () => {
        expect(body.data.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
      });
    });
  });

  test.describe('Cenários Negativos', () => {

    test('deve retornar 404 para usuário inexistente', async ({ request }) => {
      await allure.epic('Users API');
      await allure.feature('Busca de Usuário');
      await allure.story('Buscar usuário inexistente');
      await allure.severity('normal');
      await allure.owner('QA Team');
      await allure.tag('API', 'GET', 'Users', 'Negativo', '404');
      await allure.description(
        'Verifica se a API retorna status 404 e body vazio ao buscar um usuário com ID inexistente (9999).'
      );

      const response = await allure.step('Enviar GET /api/users/9999', async () => {
        return await request.get('/api/users/9999');
      });

      await allure.step('Validar status code 404', async () => {
        expect(response.status()).toBe(404);
      });

      await allure.step('Validar body vazio', async () => {
        const body = await response.json();
        expect(body).toEqual({});
      });
    });

    test('deve retornar resposta vazia para página sem dados', async ({ request }) => {
      await allure.epic('Users API');
      await allure.feature('Listagem de Usuários');
      await allure.story('Página sem dados');
      await allure.severity('minor');
      await allure.owner('QA Team');
      await allure.tag('API', 'GET', 'Users', 'Negativo', 'Paginação');
      await allure.description(
        'Verifica se a API retorna status 200 com array de dados vazio ao acessar uma página inexistente (999).'
      );

      const response = await allure.step('Enviar GET /api/users?page=999', async () => {
        return await request.get('/api/users?page=999');
      });

      await allure.step('Validar status 200 com data vazio', async () => {
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.data).toEqual([]);
      });
    });
  });
});

test.describe('Users API - POST /api/users', () => {

  test.describe('Cenários Positivos', () => {

    test('deve criar um novo usuário com dados válidos', async ({ request }) => {
      await allure.epic('Users API');
      await allure.feature('Criação de Usuário');
      await allure.story('Criar usuário com payload válido');
      await allure.severity('blocker');
      await allure.owner('QA Team');
      await allure.tag('API', 'POST', 'Users', 'CRUD');
      await allure.description(
        'Verifica se a API cria corretamente um novo usuário com name e job, ' +
        'retornando status 201 e body com os dados enviados mais id e createdAt.'
      );

      const payload = { name: 'João Silva', job: 'QA Engineer' };

      const response = await allure.step('Enviar POST /api/users com payload válido', async () => {
        return await request.post('/api/users', { data: payload });
      });

      await allure.step('Validar status code 201 Created', async () => {
        expect(response.status()).toBe(201);
        expect(response.headers()['content-type']).toContain('application/json');
      });

      await allure.step('Validar dados do usuário criado', async () => {
        const body = await response.json();
        expect(body.name).toBe(payload.name);
        expect(body.job).toBe(payload.job);
        expect(body.id).toBeTruthy();
        expect(body.createdAt).toBeTruthy();
      });
    });

    test('deve criar usuário com campos extras', async ({ request }) => {
      await allure.epic('Users API');
      await allure.feature('Criação de Usuário');
      await allure.story('Criar usuário com campos adicionais');
      await allure.severity('normal');
      await allure.owner('QA Team');
      await allure.tag('API', 'POST', 'Users', 'CamposExtras');
      await allure.description(
        'Verifica se a API aceita campos adicionais (email, department) além de name e job no payload de criação.'
      );

      const payload = {
        name: 'Maria Oliveira',
        job: 'Dev Lead',
        email: 'maria@test.com',
        department: 'Engineering',
      };

      const response = await allure.step('Enviar POST /api/users com campos extras', async () => {
        return await request.post('/api/users', { data: payload });
      });

      await allure.step('Validar criação com status 201', async () => {
        expect(response.status()).toBe(201);
        const body = await response.json();
        expect(body.name).toBe(payload.name);
        expect(body.id).toBeTruthy();
      });
    });
  });

  test.describe('Cenários Negativos', () => {

    test('deve aceitar payload vazio (API permissiva)', async ({ request }) => {
      await allure.epic('Users API');
      await allure.feature('Criação de Usuário');
      await allure.story('Payload vazio');
      await allure.severity('minor');
      await allure.owner('QA Team');
      await allure.tag('API', 'POST', 'Users', 'Negativo', 'PayloadVazio');
      await allure.description(
        'Verifica o comportamento da API ao receber payload vazio. A API é permissiva e retorna 201 mesmo sem dados.'
      );

      const response = await allure.step('Enviar POST /api/users com payload vazio {}', async () => {
        return await request.post('/api/users', { data: {} });
      });

      await allure.step('Validar que API aceita payload vazio (201)', async () => {
        expect(response.status()).toBe(201);
        const body = await response.json();
        expect(body.id).toBeTruthy();
        expect(body.createdAt).toBeTruthy();
      });
    });

    test('deve validar resposta com payload malformado (string)', async ({ request }) => {
      await allure.epic('Users API');
      await allure.feature('Criação de Usuário');
      await allure.story('Payload malformado');
      await allure.severity('normal');
      await allure.owner('QA Team');
      await allure.tag('API', 'POST', 'Users', 'Negativo', 'Malformado');
      await allure.description(
        'Verifica o comportamento da API ao receber um payload malformado (string em vez de JSON), ' +
        'com Content-Type text/plain. Aceita status 200, 201, 400 ou 415.'
      );

      const response = await allure.step('Enviar POST com payload string e Content-Type text/plain', async () => {
        return await request.post('/api/users', {
          data: 'texto-invalido',
          headers: { 'Content-Type': 'text/plain' },
        });
      });

      await allure.step('Validar que status é aceitável (200|201|400|415)', async () => {
        expect([200, 201, 400, 415]).toContain(response.status());
      });
    });
  });
});

test.describe('Users API - PUT /api/users', () => {

  test.describe('Cenários Positivos', () => {

    test('deve atualizar usuário existente completamente', async ({ request }) => {
      await allure.epic('Users API');
      await allure.feature('Atualização de Usuário');
      await allure.story('Atualização completa via PUT');
      await allure.severity('critical');
      await allure.owner('QA Team');
      await allure.tag('API', 'PUT', 'Users', 'CRUD');
      await allure.description(
        'Verifica se a API atualiza corretamente todos os campos de um usuário via PUT, ' +
        'retornando status 200 com os dados atualizados e timestamp updatedAt.'
      );

      const payload = { name: 'Carlos Atualizado', job: 'Senior QA' };

      const response = await allure.step('Enviar PUT /api/users/2 com dados completos', async () => {
        return await request.put('/api/users/2', { data: payload });
      });

      await allure.step('Validar status 200 e Content-Type', async () => {
        expect(response.status()).toBe(200);
        expect(response.headers()['content-type']).toContain('application/json');
      });

      await allure.step('Validar dados atualizados no body', async () => {
        const body = await response.json();
        expect(body.name).toBe(payload.name);
        expect(body.job).toBe(payload.job);
        expect(body.updatedAt).toBeTruthy();
      });
    });

    test('deve atualizar apenas um campo via PUT', async ({ request }) => {
      await allure.epic('Users API');
      await allure.feature('Atualização de Usuário');
      await allure.story('Atualização parcial via PUT');
      await allure.severity('normal');
      await allure.owner('QA Team');
      await allure.tag('API', 'PUT', 'Users', 'Parcial');
      await allure.description(
        'Verifica se a API aceita atualização via PUT enviando apenas o campo name.'
      );

      const payload = { name: 'Somente Nome' };

      const response = await allure.step('Enviar PUT /api/users/2 com apenas name', async () => {
        return await request.put('/api/users/2', { data: payload });
      });

      await allure.step('Validar atualização parcial', async () => {
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.name).toBe(payload.name);
        expect(body.updatedAt).toBeTruthy();
      });
    });
  });

  test.describe('Cenários Negativos', () => {

    test('deve tratar PUT com payload vazio', async ({ request }) => {
      await allure.epic('Users API');
      await allure.feature('Atualização de Usuário');
      await allure.story('PUT com payload vazio');
      await allure.severity('minor');
      await allure.owner('QA Team');
      await allure.tag('API', 'PUT', 'Users', 'Negativo', 'PayloadVazio');
      await allure.description(
        'Verifica o comportamento da API ao enviar PUT com payload vazio. Deve retornar 200 com updatedAt.'
      );

      const response = await allure.step('Enviar PUT /api/users/2 com payload vazio', async () => {
        return await request.put('/api/users/2', { data: {} });
      });

      await allure.step('Validar resposta com updatedAt', async () => {
        expect(response.status()).toBe(200);
        const body = await response.json();
        expect(body.updatedAt).toBeTruthy();
      });
    });

    test('deve tratar PUT para ID inexistente (API mock)', async ({ request }) => {
      await allure.epic('Users API');
      await allure.feature('Atualização de Usuário');
      await allure.story('PUT para ID inexistente');
      await allure.severity('normal');
      await allure.owner('QA Team');
      await allure.tag('API', 'PUT', 'Users', 'Negativo', 'IDInexistente');
      await allure.description(
        'Verifica o comportamento da API mock ao enviar PUT para um ID inexistente (99999). ' +
        'A API reqres.in retorna 200 mesmo para IDs inexistentes por ser uma API de mock.'
      );

      const payload = { name: 'Fantasma', job: 'Ghost' };

      const response = await allure.step('Enviar PUT /api/users/99999', async () => {
        return await request.put('/api/users/99999', { data: payload });
      });

      await allure.step('Validar que API mock retorna 200', async () => {
        expect(response.status()).toBe(200);
      });
    });
  });
});

test.describe('Users API - PATCH /api/users', () => {

  test('deve atualizar parcialmente um usuário', async ({ request }) => {
    await allure.epic('Users API');
    await allure.feature('Atualização Parcial');
    await allure.story('PATCH para atualizar campo específico');
    await allure.severity('critical');
    await allure.owner('QA Team');
    await allure.tag('API', 'PATCH', 'Users', 'CRUD');
    await allure.description(
      'Verifica se a API atualiza parcialmente um usuário via PATCH, ' +
      'enviando apenas o campo job e validando que retorna o dado atualizado com updatedAt.'
    );

    const payload = { job: 'Tech Lead' };

    const response = await allure.step('Enviar PATCH /api/users/2 com { job }', async () => {
      return await request.patch('/api/users/2', { data: payload });
    });

    await allure.step('Validar atualização parcial', async () => {
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.job).toBe(payload.job);
      expect(body.updatedAt).toBeTruthy();
    });
  });
});

test.describe('Users API - DELETE /api/users', () => {

  test.describe('Cenários Positivos', () => {

    test('deve deletar usuário existente com sucesso', async ({ request }) => {
      await allure.epic('Users API');
      await allure.feature('Exclusão de Usuário');
      await allure.story('Deletar usuário existente');
      await allure.severity('critical');
      await allure.owner('QA Team');
      await allure.tag('API', 'DELETE', 'Users', 'CRUD');
      await allure.description(
        'Verifica se a API deleta corretamente um usuário existente, retornando status 204 No Content com body vazio.'
      );

      const response = await allure.step('Enviar DELETE /api/users/2', async () => {
        return await request.delete('/api/users/2');
      });

      await allure.step('Validar status 204 No Content', async () => {
        expect(response.status()).toBe(204);
      });

      await allure.step('Validar body vazio', async () => {
        expect(response.body.length).toBeFalsy;
      });
    });
  });

  test.describe('Cenários Negativos', () => {

    test('deve tratar DELETE para ID inexistente', async ({ request }) => {
      await allure.epic('Users API');
      await allure.feature('Exclusão de Usuário');
      await allure.story('Deletar ID inexistente');
      await allure.severity('normal');
      await allure.owner('QA Team');
      await allure.tag('API', 'DELETE', 'Users', 'Negativo');
      await allure.description(
        'Verifica o comportamento da API ao tentar deletar um usuário com ID inexistente (99999). ' +
        'A API reqres.in retorna 204 por ser uma API mock.'
      );

      const response = await allure.step('Enviar DELETE /api/users/99999', async () => {
        return await request.delete('/api/users/99999');
      });

      await allure.step('Validar que API mock retorna 204', async () => {
        expect(response.status()).toBe(204);
      });
    });
  });
});

test.describe('Users API - Validação de Headers', () => {

  test('deve retornar headers obrigatórios na resposta', async ({ request }) => {
    await allure.epic('Users API');
    await allure.feature('Validação de Headers');
    await allure.story('Headers obrigatórios na resposta');
    await allure.severity('normal');
    await allure.owner('QA Team');
    await allure.tag('API', 'GET', 'Headers', 'Segurança');
    await allure.description(
      'Verifica se a resposta da API contém os headers HTTP obrigatórios, incluindo Content-Type application/json.'
    );

    const response = await allure.step('Enviar GET /api/users?page=1', async () => {
      return await request.get('/api/users?page=1');
    });

    await allure.step('Validar presença de Content-Type', async () => {
      expect(response.headers()['content-type']).toContain('application/json');
      expect(response.headers()).toHaveProperty('content-type');
    });
  });

  test('deve aceitar requisição com Accept header customizado', async ({ request }) => {
    await allure.epic('Users API');
    await allure.feature('Validação de Headers');
    await allure.story('Accept header customizado');
    await allure.severity('minor');
    await allure.owner('QA Team');
    await allure.tag('API', 'GET', 'Headers', 'ContentNegotiation');
    await allure.description(
      'Verifica se a API processa corretamente requisições com header Accept: application/json customizado.'
    );

    const response = await allure.step('Enviar GET com Accept: application/json', async () => {
      return await request.get('/api/users/1', {
        headers: { 'Accept': 'application/json' },
      });
    });

    await allure.step('Validar resposta 200 com Content-Type correto', async () => {
      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toContain('application/json');
    });
  });
});

test.describe('Users API - Métodos HTTP Inválidos', () => {

  test('deve tratar método HEAD corretamente', async ({ request }) => {
    await allure.epic('Users API');
    await allure.feature('Métodos HTTP');
    await allure.story('Método HEAD');
    await allure.severity('minor');
    await allure.owner('QA Team');
    await allure.tag('API', 'HEAD', 'Segurança', 'HTTP');
    await allure.description(
      'Verifica como a API trata requisições HEAD. Aceita status 200, 204, 403 ou 405 como respostas válidas.'
    );

    const response = await allure.step('Enviar HEAD /api/users/1', async () => {
      return await request.head('/api/users/1');
    });

    await allure.step('Validar status aceitável (200|204|403|405)', async () => {
      expect([200, 204, 403, 405]).toContain(response.status());
    });
  });
});
