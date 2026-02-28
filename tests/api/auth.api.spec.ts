import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';

test.describe('Auth API - POST /api/register', () => {

  test.describe('Cenários Positivos', () => {

    test('deve registrar usuário com credenciais válidas', async ({ request }) => {
      await allure.epic('API');
      await allure.feature('Auth');
      await allure.story('Registro com credenciais válidas');
      await allure.severity('blocker');
      await allure.owner('QA Team');
      await allure.tag('API', 'POST', 'Auth', 'Registro', 'Positivo');
      await allure.description(
        'Fluxo completo de registro: enviar email e senha válidos para /api/register. ' +
        'Espera-se status 200 com retorno de id (number) e token (string) no body.'
      );

      const payload = {
        email: 'eve.holt@reqres.in',
        password: 'pistol',
      };

      const response = await allure.step('Enviar POST /api/register com email e senha válidos', async () => {
        return await request.post('/api/register', { data: payload });
      });

      await allure.step('Validar status code 200', async () => {
        expect(response.status()).toBe(200);
      });

      await allure.step('Validar Content-Type application/json', async () => {
        expect(response.headers()['content-type']).toContain('application/json');
      });

      const body = await response.json();

      await allure.step('Validar presença e tipo do id e token', async () => {
        expect(body.id).toBeTruthy();
        expect(body.token).toBeTruthy();
        expect(typeof body.id).toBe('number');
        expect(typeof body.token).toBe('string');
      });
    });
  });

  test.describe('Cenários Negativos', () => {

    test('deve rejeitar registro sem senha', async ({ request }) => {
      await allure.epic('API');
      await allure.feature('Auth');
      await allure.story('Registro sem senha');
      await allure.severity('critical');
      await allure.owner('QA Team');
      await allure.tag('API', 'POST', 'Auth', 'Registro', 'Negativo', 'Validação');
      await allure.description(
        'Verifica se a API rejeita registro quando o campo password não é enviado. ' +
        'Espera-se status 400 com mensagem de erro "Missing password".'
      );

      const payload = { email: 'eve.holt@reqres.in' };

      const response = await allure.step('Enviar POST /api/register sem campo password', async () => {
        return await request.post('/api/register', { data: payload });
      });

      await allure.step('Validar status 400 Bad Request', async () => {
        expect(response.status()).toBe(400);
      });

      await allure.step('Validar mensagem de erro "Missing password"', async () => {
        const body = await response.json();
        expect(body.error).toBe('Missing password');
      });
    });

    test('deve rejeitar registro sem email', async ({ request }) => {
      await allure.epic('API');
      await allure.feature('Auth');
      await allure.story('Registro sem email');
      await allure.severity('critical');
      await allure.owner('QA Team');
      await allure.tag('API', 'POST', 'Auth', 'Registro', 'Negativo', 'Validação');
      await allure.description(
        'Verifica se a API rejeita registro quando o campo email não é enviado. ' +
        'Espera-se status 400 com mensagem "Missing email or username".'
      );

      const payload = { password: 'pistol' };

      const response = await allure.step('Enviar POST /api/register sem campo email', async () => {
        return await request.post('/api/register', { data: payload });
      });

      await allure.step('Validar rejeição com status 400', async () => {
        expect(response.status()).toBe(400);
        const body = await response.json();
        expect(body.error).toBe('Missing email or username');
      });
    });

    test('deve rejeitar registro com payload vazio', async ({ request }) => {
      await allure.epic('API');
      await allure.feature('Auth');
      await allure.story('Registro com payload vazio');
      await allure.severity('normal');
      await allure.owner('QA Team');
      await allure.tag('API', 'POST', 'Auth', 'Registro', 'Negativo', 'PayloadVazio');
      await allure.description(
        'Verifica se a API rejeita registro quando o payload está completamente vazio ({}).'
      );

      const response = await allure.step('Enviar POST /api/register com payload vazio', async () => {
        return await request.post('/api/register', { data: {} });
      });

      await allure.step('Validar rejeição com erro', async () => {
        expect(response.status()).toBe(400);
        const body = await response.json();
        expect(body.error).toBeTruthy();
      });
    });

    test('deve rejeitar registro com email não cadastrado na base', async ({ request }) => {
      await allure.epic('API');
      await allure.feature('Auth');
      await allure.story('Registro com email não cadastrado');
      await allure.severity('normal');
      await allure.owner('QA Team');
      await allure.tag('API', 'POST', 'Auth', 'Registro', 'Negativo');
      await allure.description(
        'Verifica se a API rejeita registro quando o email não está na base de dados permitida do reqres.in.'
      );

      const payload = {
        email: 'usuario.nao.existe@test.com',
        password: 'senha123',
      };

      const response = await allure.step('Enviar POST /api/register com email fora da base', async () => {
        return await request.post('/api/register', { data: payload });
      });

      await allure.step('Validar rejeição com status 400', async () => {
        expect(response.status()).toBe(400);
        const body = await response.json();
        expect(body.error).toBeTruthy();
      });
    });

    test('deve rejeitar registro com email inválido', async ({ request }) => {
      await allure.epic('API');
      await allure.feature('Auth');
      await allure.story('Registro com email inválido');
      await allure.severity('normal');
      await allure.owner('QA Team');
      await allure.tag('API', 'POST', 'Auth', 'Registro', 'Negativo', 'FormatoInválido');
      await allure.description(
        'Verifica se a API rejeita registro quando o email possui formato inválido (sem @ e domínio).'
      );

      const payload = {
        email: 'email-invalido',
        password: 'senha123',
      };

      const response = await allure.step('Enviar POST /api/register com email sem formato válido', async () => {
        return await request.post('/api/register', { data: payload });
      });

      await allure.step('Validar rejeição com status 400', async () => {
        expect(response.status()).toBe(400);
        const body = await response.json();
        expect(body.error).toBeTruthy();
      });
    });
  });
});

test.describe('Auth API - POST /api/login', () => {

  test.describe('Cenários Positivos', () => {

    test('deve autenticar com credenciais válidas', async ({ request }) => {
      await allure.epic('API');
      await allure.feature('Auth');
      await allure.story('Login com credenciais válidas');
      await allure.severity('blocker');
      await allure.owner('QA Team');
      await allure.tag('API', 'POST', 'Auth', 'Login', 'Positivo');
      await allure.description(
        'Fluxo completo de login: enviar email e senha válidos para /api/login. ' +
        'Espera-se status 200 com retorno de token (string não vazia) no body.'
      );

      const payload = {
        email: 'eve.holt@reqres.in',
        password: 'cityslicka',
      };

      const response = await allure.step('Enviar POST /api/login com credenciais válidas', async () => {
        return await request.post('/api/login', { data: payload });
      });

      await allure.step('Validar status 200 e Content-Type', async () => {
        expect(response.status()).toBe(200);
        expect(response.headers()['content-type']).toContain('application/json');
      });

      await allure.step('Validar token no body da resposta', async () => {
        const body = await response.json();
        expect(body.token).toBeTruthy();
        expect(typeof body.token).toBe('string');
        expect(body.token.length).toBeGreaterThan(0);
      });
    });
  });

  test.describe('Cenários Negativos', () => {

    test('deve rejeitar login sem senha', async ({ request }) => {
      await allure.epic('API');
      await allure.feature('Auth');
      await allure.story('Login sem senha');
      await allure.severity('critical');
      await allure.owner('QA Team');
      await allure.tag('API', 'POST', 'Auth', 'Login', 'Negativo', 'Validação');
      await allure.description(
        'Verifica se a API rejeita login sem o campo password, retornando 400 com "Missing password".'
      );

      const payload = { email: 'eve.holt@reqres.in' };

      const response = await allure.step('Enviar POST /api/login sem password', async () => {
        return await request.post('/api/login', { data: payload });
      });

      await allure.step('Validar rejeição com mensagem de erro', async () => {
        expect(response.status()).toBe(400);
        const body = await response.json();
        expect(body.error).toBe('Missing password');
      });
    });

    test('deve rejeitar login sem email', async ({ request }) => {
      await allure.epic('API');
      await allure.feature('Auth');
      await allure.story('Login sem email');
      await allure.severity('critical');
      await allure.owner('QA Team');
      await allure.tag('API', 'POST', 'Auth', 'Login', 'Negativo', 'Validação');
      await allure.description(
        'Verifica se a API rejeita login sem o campo email, retornando 400 com "Missing email or username".'
      );

      const payload = { password: 'cityslicka' };

      const response = await allure.step('Enviar POST /api/login sem email', async () => {
        return await request.post('/api/login', { data: payload });
      });

      await allure.step('Validar rejeição com mensagem de erro', async () => {
        expect(response.status()).toBe(400);
        const body = await response.json();
        expect(body.error).toBe('Missing email or username');
      });
    });

    test('deve rejeitar login com payload vazio', async ({ request }) => {
      await allure.epic('API');
      await allure.feature('Auth');
      await allure.story('Login com payload vazio');
      await allure.severity('normal');
      await allure.owner('QA Team');
      await allure.tag('API', 'POST', 'Auth', 'Login', 'Negativo', 'PayloadVazio');
      await allure.description(
        'Verifica se a API rejeita login quando o payload está completamente vazio ({}).'
      );

      const response = await allure.step('Enviar POST /api/login com payload vazio', async () => {
        return await request.post('/api/login', { data: {} });
      });

      await allure.step('Validar rejeição com status 400', async () => {
        expect(response.status()).toBe(400);
        const body = await response.json();
        expect(body.error).toBeTruthy();
      });
    });

    test('deve rejeitar login com email não cadastrado', async ({ request }) => {
      await allure.epic('API');
      await allure.feature('Auth');
      await allure.story('Login com email não cadastrado');
      await allure.severity('normal');
      await allure.owner('QA Team');
      await allure.tag('API', 'POST', 'Auth', 'Login', 'Negativo');
      await allure.description(
        'Verifica se a API retorna "user not found" ao tentar login com email não registrado na base.'
      );

      const payload = {
        email: 'naoexiste@test.com',
        password: 'qualquersenha',
      };

      const response = await allure.step('Enviar POST /api/login com email inexistente', async () => {
        return await request.post('/api/login', { data: payload });
      });

      await allure.step('Validar rejeição com "user not found"', async () => {
        expect(response.status()).toBe(400);
        const body = await response.json();
        expect(body.error).toBe('user not found');
      });
    });

    test('deve rejeitar login com campos nulos', async ({ request }) => {
      await allure.epic('API');
      await allure.feature('Auth');
      await allure.story('Login com campos nulos');
      await allure.severity('normal');
      await allure.owner('QA Team');
      await allure.tag('API', 'POST', 'Auth', 'Login', 'Negativo', 'CamposNulos');
      await allure.description(
        'Verifica se a API rejeita login quando email e password são enviados como null.'
      );

      const payload = { email: null, password: null };

      const response = await allure.step('Enviar POST /api/login com email=null e password=null', async () => {
        return await request.post('/api/login', { data: payload });
      });

      await allure.step('Validar rejeição com status 400', async () => {
        expect(response.status()).toBe(400);
        const body = await response.json();
        expect(body.error).toBeTruthy();
      });
    });
  });
});

test.describe('Auth API - Validações de Segurança', () => {

  test('não deve expor dados sensíveis no registro bem-sucedido', async ({ request }) => {
    await allure.epic('API');
    await allure.feature('Auth');
    await allure.story('Proteção de dados sensíveis no registro');
    await allure.severity('critical');
    await allure.owner('QA Team');
    await allure.tag('API', 'POST', 'Auth', 'Segurança', 'DataLeakage');
    await allure.description(
      'Validação de segurança: verifica que a API NÃO retorna a senha do usuário no body ' +
      'da resposta de registro bem-sucedido, prevenindo vazamento de dados sensíveis.'
    );

    const payload = {
      email: 'eve.holt@reqres.in',
      password: 'pistol',
    };

    const response = await allure.step('Enviar registro com credenciais válidas', async () => {
      return await request.post('/api/register', { data: payload });
    });

    const body = await response.json();

    await allure.step('Verificar ausência de password no body', async () => {
      expect(body).not.toHaveProperty('password');
    });

    await allure.step('Verificar que o valor da senha não aparece no body', async () => {
      expect(JSON.stringify(body)).not.toContain('pistol');
    });
  });

  test('não deve expor dados sensíveis no login bem-sucedido', async ({ request }) => {
    await allure.epic('API');
    await allure.feature('Auth');
    await allure.story('Proteção de dados sensíveis no login');
    await allure.severity('critical');
    await allure.owner('QA Team');
    await allure.tag('API', 'POST', 'Auth', 'Segurança', 'DataLeakage');
    await allure.description(
      'Validação de segurança: verifica que a API NÃO retorna a senha do usuário no body ' +
      'da resposta de login bem-sucedido, prevenindo vazamento de dados sensíveis.'
    );

    const payload = {
      email: 'eve.holt@reqres.in',
      password: 'cityslicka',
    };

    const response = await allure.step('Enviar login com credenciais válidas', async () => {
      return await request.post('/api/login', { data: payload });
    });

    const body = await response.json();

    await allure.step('Verificar ausência de password no body', async () => {
      expect(body).not.toHaveProperty('password');
    });

    await allure.step('Verificar que o valor da senha não aparece no body', async () => {
      expect(JSON.stringify(body)).not.toContain('cityslicka');
    });
  });
});

test.describe('Resources API - GET /api/unknown', () => {

  test('deve listar recursos com estrutura correta', async ({ request }) => {
    await allure.epic('API');
    await allure.feature('Resources');
    await allure.story('Listar recursos com schema correto');
    await allure.severity('normal');
    await allure.owner('QA Team');
    await allure.tag('API', 'GET', 'Resources', 'Schema');
    await allure.description(
      'Verifica se a API retorna a lista de recursos (cores Pantone) com schema correto: ' +
      'id, name, year, color e pantone_value.'
    );

    const response = await allure.step('Enviar GET /api/unknown', async () => {
      return await request.get('/api/unknown');
    });

    await allure.step('Validar status 200', async () => {
      expect(response.status()).toBe(200);
    });

    const body = await response.json();

    await allure.step('Validar estrutura do array de recursos', async () => {
      expect(body.data).toBeInstanceOf(Array);
      expect(body.data.length).toBeGreaterThan(0);
    });

    await allure.step('Validar schema do recurso', async () => {
      const resource = body.data[0];
      expect(resource).toHaveProperty('id');
      expect(resource).toHaveProperty('name');
      expect(resource).toHaveProperty('year');
      expect(resource).toHaveProperty('color');
      expect(resource).toHaveProperty('pantone_value');
    });
  });

  test('deve retornar recurso único por ID', async ({ request }) => {
    await allure.epic('API');
    await allure.feature('Resources');
    await allure.story('Buscar recurso por ID');
    await allure.severity('normal');
    await allure.owner('QA Team');
    await allure.tag('API', 'GET', 'Resources', 'SingleResource');
    await allure.description(
      'Verifica se a API retorna corretamente um recurso específico por ID com campos id e name.'
    );

    const response = await allure.step('Enviar GET /api/unknown/2', async () => {
      return await request.get('/api/unknown/2');
    });

    await allure.step('Validar recurso retornado', async () => {
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.data.id).toBe(2);
      expect(body.data.name).toBeTruthy();
    });
  });

  test('deve retornar 404 para recurso inexistente', async ({ request }) => {
    await allure.epic('API');
    await allure.feature('Resources');
    await allure.story('Buscar recurso inexistente');
    await allure.severity('minor');
    await allure.owner('QA Team');
    await allure.tag('API', 'GET', 'Resources', 'Negativo', '404');
    await allure.description(
      'Verifica se a API retorna status 404 ao buscar um recurso com ID inexistente (23).'
    );

    const response = await allure.step('Enviar GET /api/unknown/23', async () => {
      return await request.get('/api/unknown/23');
    });

    await allure.step('Validar status 404', async () => {
      expect(response.status()).toBe(404);
    });
  });
});

test.describe('API - Delayed Response', () => {

  test('deve lidar com resposta com delay de 3 segundos', async ({ request }) => {
    await allure.epic('API');
    await allure.feature('Performance');
    await allure.story('Timeout e delay de resposta');
    await allure.severity('normal');
    await allure.owner('QA Team');
    await allure.tag('API', 'GET', 'Performance', 'Delay', 'Timeout');
    await allure.description(
      'Verifica se a API consegue retornar dados corretamente mesmo com um delay forçado de 3 segundos, ' +
      'validando que o tempo de resposta real é >= 2.5s e que os dados retornados são válidos.'
    );

    const start = Date.now();

    const response = await allure.step('Enviar GET /api/users?delay=3', async () => {
      return await request.get('/api/users?delay=3');
    });

    const elapsed = Date.now() - start;

    await allure.step(`Validar tempo de resposta >= 2.5s (real: ${elapsed}ms)`, async () => {
      expect(response.status()).toBe(200);
      expect(elapsed).toBeGreaterThanOrEqual(2500);
    });

    await allure.step('Validar dados retornados após delay', async () => {
      const body = await response.json();
      expect(body.data).toBeInstanceOf(Array);
    });
  });
});
