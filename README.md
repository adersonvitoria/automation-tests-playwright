# Automation Tests - Playwright + Cucumber

Projeto de automação de testes cobrindo **API Testing** e **E2E Testing** com Playwright, Cucumber BDD e integração com CI/CD via GitHub Actions.

## Descrição

Este projeto implementa uma suíte completa de testes automatizados:

- **Testes de API**: Validação de endpoints REST (GET, POST, PUT, PATCH, DELETE) com cenários positivos e negativos utilizando a API pública [Reqres.in](https://reqres.in)
- **Testes E2E**: Fluxos de ponta a ponta com Cucumber BDD (login, navegação, checkout) utilizando [SauceDemo](https://www.saucedemo.com) como aplicação alvo
- **CI/CD**: Pipeline GitHub Actions que executa automaticamente todos os testes a cada commit

## Arquitetura / Estrutura de Pastas

```
automation-tests-playwright/
├── .github/
│   └── workflows/
│       └── ci.yml                    # Pipeline CI/CD (GitHub Actions)
├── src/
│   ├── config/
│   │   └── environments.ts           # Configurações de ambiente
│   ├── pages/                        # Page Object Model (POM)
│   │   ├── BasePage.ts               # Classe base com métodos reutilizáveis
│   │   ├── LoginPage.ts              # Page object da tela de login
│   │   ├── InventoryPage.ts          # Page object do catálogo de produtos
│   │   ├── CartPage.ts               # Page object do carrinho
│   │   ├── CheckoutStepOnePage.ts    # Page object do formulário de checkout
│   │   ├── CheckoutStepTwoPage.ts    # Page object da revisão do pedido
│   │   └── CheckoutCompletePage.ts   # Page object da confirmação
│   └── support/
│       ├── world.ts                  # Cucumber World (contexto compartilhado)
│       └── hooks.ts                  # Before/After hooks + screenshot on failure
├── tests/
│   ├── api/                          # Testes de API (Playwright Test Runner)
│   │   ├── users.api.spec.ts         # Testes CRUD de usuários
│   │   └── auth.api.spec.ts          # Testes de autenticação e recursos
│   └── e2e/
│       ├── features/                 # Arquivos Gherkin (.feature)
│       │   ├── login.feature         # Cenários de login
│       │   └── checkout.feature      # Cenários de checkout
│       └── steps/                    # Step Definitions
│           ├── login.steps.ts        # Implementação dos steps de login
│           └── checkout.steps.ts     # Implementação dos steps de checkout
├── scripts/
│   └── generate-cucumber-report.js   # Geração de relatório HTML do Cucumber
├── reports/                          # Relatórios gerados (gitignored)
├── playwright.config.ts              # Configuração do Playwright (API tests)
├── cucumber.js                       # Configuração do Cucumber (E2E tests)
├── tsconfig.json                     # Configuração TypeScript
├── package.json                      # Dependências e scripts
└── README.md
```

## Versões Utilizadas

| Tecnologia       | Versão  |
|------------------|---------|
| Node.js          | >= 20.x |
| TypeScript       | >= 5.x  |
| Playwright       | >= 1.49 |
| Cucumber         | >= 11.x |
| tsx              | >= 4.x  |

## Pré-requisitos

- [Node.js](https://nodejs.org/) versão 20 ou superior
- npm (incluído com o Node.js)

## Instalação

```bash
# Clonar o repositório
git clone <url-do-repositorio>
cd automation-tests-playwright

# Instalar dependências
npm install

# Instalar navegadores do Playwright
npx playwright install --with-deps chromium

# Configurar API key do Reqres.in
cp .env.example .env
# Editar .env e adicionar sua API key (obtenha em: https://app.reqres.in/?next=/api-keys)
```

> **Importante**: A API Reqres.in requer uma chave de API gratuita. Crie sua conta em [app.reqres.in](https://app.reqres.in) e gere uma key para incluir no arquivo `.env`.

## Como Executar os Testes

### Testes de API

```bash
npm run test:api
```

Executa todos os testes de API utilizando o Playwright Test Runner contra a API Reqres.in.

### Testes E2E (Cucumber)

```bash
npm run test:e2e
```

Executa todos os cenários BDD escritos em Gherkin utilizando Cucumber + Playwright.

### Todos os Testes

```bash
npm run test:all
```

Executa sequencialmente os testes de API e E2E.

## Gerar Relatórios

### Relatório de API (Playwright HTML Report)

```bash
npm run report:api
```

Abre o relatório HTML interativo do Playwright no navegador.

### Relatório E2E (Cucumber HTML Report)

```bash
npm run report:e2e
```

Gera relatório HTML detalhado em `reports/cucumber/html-report/`.

## Cobertura de Testes

### API (29 cenários)

| Método | Endpoint            | Positivos | Negativos |
|--------|---------------------|-----------|-----------|
| GET    | /api/users          | 4         | 2         |
| POST   | /api/users          | 2         | 2         |
| PUT    | /api/users/:id      | 2         | 2         |
| PATCH  | /api/users/:id      | 1         | -         |
| DELETE | /api/users/:id      | 1         | 1         |
| POST   | /api/register       | 1         | 5         |
| POST   | /api/login          | 1         | 4         |
| GET    | /api/unknown        | 2         | 1         |
| GET    | /api/users?delay=3  | 1         | -         |
| -      | Headers/Segurança   | 4         | -         |

### E2E - Login (7 cenários)

- Login com credenciais válidas
- Login com senha incorreta
- Login com usuário inexistente
- Login com campos vazios
- Login com senha em branco
- Login com usuário bloqueado
- Navegação pós-login

### E2E - Checkout (7 cenários)

- Checkout completo com um produto
- Checkout com múltiplos produtos
- Checkout sem primeiro nome
- Checkout sem sobrenome
- Checkout sem CEP
- Checkout com todos os campos vazios
- Verificação de valores no resumo

## CI/CD

O pipeline GitHub Actions (`.github/workflows/ci.yml`) executa automaticamente:

1. **Testes de API** - em paralelo
2. **Testes E2E** - com instalação de navegadores
3. **Testes de Carga** - integração com k6
4. **Resumo** - tabela consolidada dos resultados

Relatórios são salvos como artefatos por 30 dias.

## Boas Práticas Aplicadas

- **Page Object Model (POM)**: Separação clara entre lógica de teste e interação com a UI
- **BDD com Cucumber**: Features escritas em Gherkin (português) para documentação viva
- **Screenshot on Failure**: Captura automática de evidências em cenários com falha
- **Cenários Positivos e Negativos**: Cobertura abrangente incluindo edge cases
- **TypeScript**: Tipagem estática para maior confiabilidade do código
- **Relatórios**: Geração automática de reports HTML para API e E2E
- **CI/CD**: Execução automatizada a cada commit com upload de artefatos
