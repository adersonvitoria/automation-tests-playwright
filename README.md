# Automation Tests - Playwright + Cucumber

Projeto de automação de testes cobrindo **API Testing** e **E2E Testing** com Playwright, Cucumber BDD, Allure Reports e integração com CI/CD via GitHub Actions.

## Descrição

Este projeto implementa uma suíte completa de testes automatizados:

- **Testes de API**: Validação de endpoints REST (GET, POST, PUT, PATCH, DELETE) com cenários positivos e negativos utilizando a API pública [Reqres.in](https://reqres.in)
- **Testes E2E**: Fluxos de ponta a ponta com Cucumber BDD (login, navegação, checkout) utilizando [SauceDemo](https://www.saucedemo.com) como aplicação alvo
- **Allure Reports**: Relatórios detalhados com anotações completas (epic, feature, story, severity, steps, description) para API e E2E
- **CI/CD**: Pipeline GitHub Actions que executa automaticamente todos os testes a cada commit com geração de Allure Report consolidado

## Arquitetura / Estrutura de Pastas

```
automation-tests-playwright/
├── .github/
│   └── workflows/
│       └── ci.yml                    # Pipeline CI/CD (GitHub Actions + Allure)
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
│   ├── api/                          # Testes de API (Playwright + Allure)
│   │   ├── users.api.spec.ts         # Testes CRUD de usuários (com anotações Allure)
│   │   └── auth.api.spec.ts          # Testes de autenticação e recursos (com anotações Allure)
│   └── e2e/
│       ├── features/                 # Arquivos Gherkin (.feature) com tags Allure
│       │   ├── login.feature         # Cenários de login (@severity, @story, @tag)
│       │   └── checkout.feature      # Cenários de checkout (@severity, @story, @tag)
│       └── steps/                    # Step Definitions
│           ├── login.steps.ts        # Implementação dos steps de login
│           └── checkout.steps.ts     # Implementação dos steps de checkout
├── scripts/
│   └── generate-cucumber-report.js   # Geração de relatório HTML do Cucumber
├── reports/                          # Relatórios gerados (gitignored)
├── allure-results/                   # Resultados Allure brutos (gitignored)
│   ├── api/                          # Resultados dos testes de API
│   └── e2e/                          # Resultados dos testes E2E
├── allure-report/                    # Relatório Allure HTML (gitignored)
├── playwright.config.ts              # Configuração Playwright + Allure Reporter
├── cucumber.js                       # Configuração Cucumber + Allure Formatter
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
| Cucumber         | >= 12.x |
| Allure Playwright| >= 3.x  |
| Allure CucumberJS| >= 3.x  |
| tsx              | >= 4.x  |

## Pré-requisitos

- [Node.js](https://nodejs.org/) versão 20 ou superior
- npm (incluído com o Node.js)
- Java Runtime (JRE) 8+ para o Allure CLI (opcional, para visualizar relatórios localmente)

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
# A key já está configurada no .env.example (REQRES_API_KEY=reqres_7b4880206ffa4e6b8429a7291998c7c5)
```

> **Importante**: A API Reqres.in requer uma chave de API gratuita. Crie sua conta em [app.reqres.in](https://app.reqres.in) e gere uma key para incluir no arquivo `.env`.

## Como Executar os Testes

### Testes de API

```bash
npm run test:api
```

Executa todos os testes de API utilizando o Playwright Test Runner contra a API Reqres.in. Os resultados Allure são gerados automaticamente em `allure-results/api/`.

### Testes E2E (Cucumber)

```bash
npm run test:e2e
```

Executa todos os cenários BDD escritos em Gherkin utilizando Cucumber + Playwright. Os resultados Allure são gerados automaticamente em `allure-results/e2e/`.

### Todos os Testes

```bash
npm run test:all
```

Executa sequencialmente os testes de API e E2E.

## Allure Reports

### Gerar relatório consolidado

```bash
npm run allure:generate
```

Gera o relatório HTML consolidado em `allure-report/` a partir dos resultados de API e E2E.

### Visualizar relatório

```bash
npm run allure:open
```

Abre o relatório Allure gerado no navegador padrão.

### Servir relatório temporário

```bash
npm run allure:serve
```

Gera e abre o relatório Allure diretamente sem salvar em disco.

### Anotações Allure nos Testes

#### Testes de API (Playwright)

Cada teste de API possui anotações completas utilizando `allure-js-commons`:

- **`@allure.epic`**: Agrupamento de alto nível (ex: "Users API", "Auth API")
- **`@allure.feature`**: Funcionalidade testada (ex: "Listagem de Usuários", "Login")
- **`@allure.story`**: Cenário/fluxo específico (ex: "Listar usuários com paginação")
- **`@allure.severity`**: Nível de severidade (`blocker`, `critical`, `normal`, `minor`, `trivial`)
- **`@allure.owner`**: Responsável pelo teste ("QA Team")
- **`@allure.tag`**: Tags para categorização (ex: "API", "GET", "Users", "CRUD")
- **`@allure.description`**: Descrição detalhada do propósito e fluxo do teste
- **`@allure.step`**: Cada ação e validação é encapsulada como um step nomeado no relatório

#### Testes E2E (Cucumber)

Os feature files possuem tags que são mapeadas automaticamente para labels Allure:

- **`@epic:E2E`**: Agrupamento como "E2E"
- **`@feature:Login`** / **`@feature:Checkout`**: Funcionalidade testada
- **`@severity:blocker|critical|normal|minor`**: Severidade do cenário
- **`@story:LoginValido`** / **`@story:CheckoutCompleto`**: Story/fluxo específico
- **`@tag:smoke`** / **`@tag:regressao`** / **`@tag:seguranca`**: Tags de categorização
- **`@owner:QATeam`**: Responsável pelos cenários

## Outros Relatórios

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

### API (38 cenários)

| Método | Endpoint            | Positivos | Negativos | Severidade |
|--------|---------------------|-----------|-----------|------------|
| GET    | /api/users          | 4         | 2         | critical   |
| POST   | /api/users          | 2         | 2         | blocker    |
| PUT    | /api/users/:id      | 2         | 2         | critical   |
| PATCH  | /api/users/:id      | 1         | -         | critical   |
| DELETE | /api/users/:id      | 1         | 1         | critical   |
| POST   | /api/register       | 1         | 5         | blocker    |
| POST   | /api/login          | 1         | 5         | blocker    |
| GET    | /api/unknown        | 2         | 1         | normal     |
| GET    | /api/users?delay=3  | 1         | -         | normal     |
| -      | Headers/Segurança   | 4         | -         | critical   |

### E2E - Login (7 cenários)

| Cenário | Tipo | Severidade |
|---------|------|------------|
| Login com credenciais válidas | Positivo | blocker |
| Login com senha incorreta | Negativo | critical |
| Login com usuário inexistente | Negativo | critical |
| Login com campos vazios | Negativo | critical |
| Login com senha em branco | Negativo | critical |
| Login com usuário bloqueado | Negativo | critical |
| Navegação pós-login | Positivo | normal |

### E2E - Checkout (7 cenários)

| Cenário | Tipo | Severidade |
|---------|------|------------|
| Checkout completo (1 produto) | Positivo | blocker |
| Checkout com múltiplos produtos | Positivo | critical |
| Checkout sem primeiro nome | Negativo | critical |
| Checkout sem sobrenome | Negativo | critical |
| Checkout sem CEP | Negativo | critical |
| Checkout com campos vazios | Negativo | normal |
| Verificação de valores no resumo | Positivo | normal |

## CI/CD

O pipeline GitHub Actions (`.github/workflows/ci.yml`) executa automaticamente:

1. **Testes de API** - Playwright + Allure Reporter (resultados em artefatos)
2. **Testes E2E** - Cucumber + Allure Formatter (screenshots em caso de falha)
3. **Testes de Carga** - Integração com k6 + geração de Allure Results
4. **Allure Report Consolidado** - Combina resultados de API, E2E e k6 em um relatório único
5. **Resumo** - Tabela consolidada dos resultados

Relatórios são salvos como artefatos por 30 dias. O artefato `allure-report-consolidated` contém o relatório HTML completo.

## Boas Práticas Aplicadas

- **Page Object Model (POM)**: Separação clara entre lógica de teste e interação com a UI
- **BDD com Cucumber**: Features escritas em Gherkin (português) para documentação viva
- **Allure Reports**: Relatórios detalhados com anotações completas (epic/feature/story/severity/steps/description)
- **Screenshot on Failure**: Captura automática de evidências em cenários com falha
- **Cenários Positivos e Negativos**: Cobertura abrangente incluindo edge cases
- **TypeScript**: Tipagem estática para maior confiabilidade do código
- **Relatórios Múltiplos**: Playwright HTML, Cucumber HTML, e Allure Reports para máxima visibilidade
- **CI/CD**: Execução automatizada a cada commit com upload de artefatos e relatório Allure consolidado
