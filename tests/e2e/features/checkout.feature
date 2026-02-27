# language: pt

Funcionalidade: Checkout de produtos
  Como um cliente autenticado
  Eu quero finalizar a compra de produtos
  Para completar minha experiência de compra

  Contexto:
    Dado que estou logado com usuário "standard_user" e senha "secret_sauce"

  Cenário: Checkout completo com um único produto
    Quando eu adiciono o primeiro produto ao carrinho
    E navego até o carrinho
    Então devo ver 1 item no carrinho
    Quando prossigo para o checkout
    E preencho o formulário com nome "João", sobrenome "Silva" e CEP "01001-000"
    E continuo para a revisão do pedido
    Então devo ver o resumo do pedido
    Quando finalizo a compra
    Então devo ver a mensagem de confirmação "Thank you for your order!"

  Cenário: Checkout com múltiplos produtos
    Quando eu adiciono 3 produtos ao carrinho
    E navego até o carrinho
    Então devo ver 3 itens no carrinho
    Quando prossigo para o checkout
    E preencho o formulário com nome "Maria", sobrenome "Oliveira" e CEP "22041-080"
    E continuo para a revisão do pedido
    Então devo ver o resumo do pedido com 3 itens
    Quando finalizo a compra
    Então devo ver a mensagem de confirmação "Thank you for your order!"

  Cenário: Checkout sem preencher o primeiro nome
    Quando eu adiciono o primeiro produto ao carrinho
    E navego até o carrinho
    E prossigo para o checkout
    E preencho o formulário com nome "", sobrenome "Silva" e CEP "01001-000"
    E continuo para a revisão do pedido
    Então devo ver o erro de checkout "Error: First Name is required"

  Cenário: Checkout sem preencher o sobrenome
    Quando eu adiciono o primeiro produto ao carrinho
    E navego até o carrinho
    E prossigo para o checkout
    E preencho o formulário com nome "João", sobrenome "" e CEP "01001-000"
    E continuo para a revisão do pedido
    Então devo ver o erro de checkout "Error: Last Name is required"

  Cenário: Checkout sem preencher o CEP
    Quando eu adiciono o primeiro produto ao carrinho
    E navego até o carrinho
    E prossigo para o checkout
    E preencho o formulário com nome "João", sobrenome "Silva" e CEP ""
    E continuo para a revisão do pedido
    Então devo ver o erro de checkout "Error: Postal Code is required"

  Cenário: Checkout com todos os campos obrigatórios vazios
    Quando eu adiciono o primeiro produto ao carrinho
    E navego até o carrinho
    E prossigo para o checkout
    E continuo para a revisão do pedido
    Então devo ver o erro de checkout "Error: First Name is required"

  Cenário: Verificar valores no resumo do pedido
    Quando eu adiciono o primeiro produto ao carrinho
    E navego até o carrinho
    E prossigo para o checkout
    E preencho o formulário com nome "Carlos", sobrenome "Souza" e CEP "30130-000"
    E continuo para a revisão do pedido
    Então o resumo deve exibir subtotal, impostos e total
