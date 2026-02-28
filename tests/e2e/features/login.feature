# language: pt

@allure.label.epic:E2E @allure.label.owner:QATeam
Funcionalidade: Login na aplicação
  Como um usuário do SauceDemo
  Eu quero fazer login na aplicação
  Para acessar o catálogo de produtos

  @allure.label.severity:blocker @allure.label.story:LoginValido @smoke @regressao
  Cenário: Login com credenciais válidas
    Dado que estou na página de login
    Quando eu preencho o usuário "standard_user" e a senha "secret_sauce"
    E clico no botão de login
    Então devo ser redirecionado para a página de inventário
    E devo visualizar a lista de produtos

  @allure.label.severity:critical @allure.label.story:LoginInvalido @regressao
  Cenário: Login com senha incorreta
    Dado que estou na página de login
    Quando eu preencho o usuário "standard_user" e a senha "senha_errada"
    E clico no botão de login
    Então devo ver a mensagem de erro "Epic sadface: Username and password do not match any user in this service"

  @severity:critical @story:LoginInvalido @tag:regressao
  Cenário: Login com usuário inexistente
    Dado que estou na página de login
    Quando eu preencho o usuário "usuario_fantasma" e a senha "secret_sauce"
    E clico no botão de login
    Então devo ver a mensagem de erro "Epic sadface: Username and password do not match any user in this service"

  @allure.label.severity:critical @allure.label.story:ValidacaoCampos @regressao
  Cenário: Login com campos vazios
    Dado que estou na página de login
    Quando clico no botão de login
    Então devo ver a mensagem de erro "Epic sadface: Username is required"

  @allure.label.severity:critical @allure.label.story:ValidacaoCampos @regressao
  Cenário: Login com senha em branco
    Dado que estou na página de login
    Quando eu preencho o usuário "standard_user" e a senha ""
    E clico no botão de login
    Então devo ver a mensagem de erro "Epic sadface: Password is required"

  @allure.label.severity:critical @allure.label.story:UsuarioBloqueado @regressao @seguranca
  Cenário: Login com usuário bloqueado
    Dado que estou na página de login
    Quando eu preencho o usuário "locked_out_user" e a senha "secret_sauce"
    E clico no botão de login
    Então devo ver a mensagem de erro "Epic sadface: Sorry, this user has been locked out."

  @allure.label.severity:normal @allure.label.story:NavegacaoPosLogin @regressao
  Cenário: Navegação após login válido
    Dado que estou na página de login
    Quando eu preencho o usuário "standard_user" e a senha "secret_sauce"
    E clico no botão de login
    Então a URL deve conter "inventory"
    E o título da página de inventário deve ser "Products"
