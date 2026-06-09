# Integrações Inbox

As integrações do Inbox se comunicam através da API nativa do navegador `window.postMessage`.

A integração é aberta em uma nova janela (popup) e pode:

- Solicitar informações da conversa atual.
- Receber atualizações da conversa.
- Executar ações no Inbox.

---

# Como executar o projeto
Para executar esse projeto, utilizei a biblioteca `http-server`, com o comando `npx hhtp-server -p 9999`

---

# Solicitando dados da conversa

A integração pode solicitar informações da conversa utilizando uma mensagem do tipo `get`.

## Estrutura

```ts
{
  type: 'get',
  payload: {
    fields: (Field | '*')[]
    customFields?: string[]
  }
}
```

## Campos disponíveis

| Campo        | Descrição                   |
| ------------ | --------------------------- |
| contactName  | Nome do contato             |
| contactId    | ID do contato               |
| contactPhone | Telefone do contato         |
| chatId       | ID da conversa              |
| createdAt    | Data de criação da conversa |
| updatedAt    | Última atualização          |
| closedAt     | Data de encerramento        |
| tags         | Tags da conversa            |
| department   | Departamento                |

## Exemplos

### Solicitar campos específicos

```js
{
  type: 'get',
  payload: {
    fields: ['contactName', 'chatId']
  }
}
```

### Solicitar todos os campos

```js
{
  type: 'get',
  payload: {
    fields: ['*']
  }
}
```

### Solicitar campos personalizados

Obs: se o campo personalizado não estiver cadastrado para o contato, uma mensagem de erro será recebida.

```js
{
  type: 'get',
  payload: {
    fields: ['*'],
    customFields: ['cpf', 'cnpj']
  }
}
```

---

# Recebendo dados

Após uma requisição `get`, o Inbox responderá com uma mensagem do tipo `chat_context`.

## Estrutura

```ts
{
  type: 'chat_context',
  payload: {
    contactName?: string
    contactId?: number
    contactPhone?: string
    chatId?: number
    createdAt?: string
    updatedAt?: string
    closedAt?: string
    tags?: unknown[]
    department?: string
    customFields?: {
      [token: string]: any
    }
  }
}
```

## Exemplo

```json
{
  "type": "chat_context",
  "payload": {
    "contactName": "João Silva",
    "chatId": 123,
    "customFields": {
      "cpf": "12345678900"
    }
  }
}
```

---

# Executando ações

A integração pode enviar comandos para o Inbox através de mensagens do tipo `action`.

## Estrutura

```ts
{
  type: 'action',
  payload: {
    action: string
  }
}
```

## Ações disponíveis

### replace_writingbar_content

Substitui o conteúdo atual da barra de digitação.

#### Exemplo

```js
{
  type: 'action',
  payload: {
    action: 'replace_writingbar_content',
    message: 'Olá! Como posso ajudar?'
  }
}
```

---

# Tratamento de erros

Caso ocorra algum erro durante a comunicação, o Inbox responderá com uma mensagem `integration_error`.

## Estrutura

```ts
{
  type: 'integration_error',
  error: {
    code: number
    description: string
  }
}
```

## Códigos de erro

| Código | Descrição                   |
| ------ | --------------------------- |
| 1001   | Campo solicitado não existe |
| 1002   | Falha ao carregar conversa  |
| 1003   | Custom Field não encontrado |
| 2001   | Ação desconhecida           |
