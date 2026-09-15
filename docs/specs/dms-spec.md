# Especificação - Document Management System

## 1. Objetivo

O Document Management System (DMS) deve permitir que usuários enviem, consultem e baixem documentos armazenados localmente pela aplicação, mantendo os metadados em memória.

## 2. Escopo

### 2.1 Dentro do escopo

- Upload de documentos por formulário `multipart/form-data`.
- Armazenamento dos arquivos no filesystem local da aplicação.
- Uso obrigatório do `multer` com `diskStorage`.
- Geração de identificador único para cada documento.
- Registro dos metadados do documento em memória.
- Listagem dos documentos disponíveis.
- Download de um documento pelo identificador.
- Associação simples de cada documento a um usuário proprietário.
- Interface web React para upload, listagem e download.
- Comunicação entre frontend e backend via API HTTP.
- Testes automatizados dos principais fluxos do backend.
- Endpoint de verificação de saúde da aplicação.

### 2.2 Fora do escopo

- Armazenamento em provedores externos ou serviços de nuvem.
- Banco de dados persistente.
- Persistência dos metadados após o reinício do processo.
- Versionamento de documentos.
- Edição do conteúdo dos documentos.
- Exclusão de documentos.
- Compartilhamento entre usuários.
- Autenticação e autorização completas.
- Controle avançado de permissões.
- Busca textual dentro dos documentos.
- Conversão ou pré-visualização de arquivos.
- Auditoria persistente.
- Sincronização entre múltiplas instâncias do backend.

## 3. Premissas

- O backend será executado com Node.js e Express.
- O backend utilizará CommonJS.
- O frontend será executado com React e Vite utilizando ESM.
- O backend será responsável pela validação de entrada e pelas regras de negócio.
- O filesystem local será a única forma de armazenamento dos arquivos.
- Os metadados serão armazenados em memória por meio de um repositório em processo.
- O diretório de armazenamento será `backend/storage`.
- O frontend utilizará o prefixo `/api` durante o desenvolvimento.
- O proxy do Vite encaminhará `/api` para o backend local.
- O usuário será identificado inicialmente por um valor simples enviado pela requisição ou por um valor padrão definido pela aplicação, sem autenticação completa.

## 4. Usuários e atores

### 4.1 Usuário do sistema

Pode:

- Enviar um documento.
- Visualizar a lista de documentos.
- Baixar um documento disponível.

### 4.2 Frontend

Responsável por:

- Apresentar o formulário de upload.
- Enviar o arquivo para o backend.
- Exibir estados de carregamento e erro.
- Atualizar a lista após um upload bem-sucedido.
- Disponibilizar o download dos documentos.

### 4.3 Backend

Responsável por:

- Receber e validar requisições HTTP.
- Gravar os arquivos localmente.
- Criar e consultar metadados.
- Resolver o arquivo correspondente ao identificador.
- Retornar respostas HTTP consistentes.

## 5. Requisitos funcionais

| ID | Requisito |
| --- | --- |
| RF-01 | O sistema deve permitir o envio de um único documento por requisição. |
| RF-02 | O upload deve aceitar uma requisição `multipart/form-data` com um campo de arquivo definido pelo contrato da API. |
| RF-03 | O sistema deve rejeitar requisições sem arquivo. |
| RF-04 | O sistema deve gerar um identificador único para cada documento enviado. |
| RF-05 | O sistema deve armazenar o arquivo no diretório local configurado para armazenamento. |
| RF-06 | O sistema deve registrar os metadados do documento após o armazenamento bem-sucedido. |
| RF-07 | O sistema deve listar os metadados dos documentos armazenados durante a execução atual do processo. |
| RF-08 | O sistema deve permitir o download de um documento pelo identificador. |
| RF-09 | O sistema deve retornar erro adequado quando o identificador informado não existir. |
| RF-10 | O sistema deve retornar erro adequado quando o arquivo associado ao metadado não puder ser localizado. |
| RF-11 | O sistema deve associar cada documento a um proprietário. |
| RF-12 | O sistema deve disponibilizar um endpoint de saúde para verificar se o backend está ativo. |
| RF-13 | O frontend deve permitir selecionar um arquivo e iniciar o upload. |
| RF-14 | O frontend deve exibir os documentos retornados pela API. |
| RF-15 | O frontend deve disponibilizar uma ação de download para cada documento listado. |
| RF-16 | O frontend deve exibir mensagens de erro quando uma operação da API falhar. |
| RF-17 | O frontend deve atualizar a lista de documentos após um upload concluído com sucesso. |

## 6. Regras de negócio

| ID | Regra |
| --- | --- |
| RN-01 | Um documento somente deve ser registrado nos metadados depois que o arquivo for salvo com sucesso. |
| RN-02 | O identificador público do documento não deve depender do nome original do arquivo. |
| RN-03 | O nome original deve ser preservado apenas como metadado para exibição. |
| RN-04 | O nome físico do arquivo pode ser diferente do nome original para evitar colisões. |
| RN-05 | O download deve localizar o arquivo por dados controlados pelo sistema, e não diretamente por um caminho recebido do cliente. |
| RN-06 | Um documento inexistente deve resultar em resposta HTTP `404`. |
| RN-07 | Uma requisição de upload sem arquivo deve resultar em resposta HTTP `400`. |
| RN-08 | O proprietário deve ser registrado em todos os documentos criados. |
| RN-09 | A listagem deve retornar somente os metadados conhecidos pelo repositório em memória. |
| RN-10 | O reinício do backend pode causar a perda dos metadados mantidos em memória, mesmo que arquivos antigos permaneçam no filesystem. |

## 7. Requisitos não funcionais

| ID | Requisito |
| --- | --- |
| RNF-01 | Os arquivos devem ser gravados exclusivamente no filesystem local da aplicação. |
| RNF-02 | O upload deve utilizar `multer` configurado com `diskStorage`. |
| RNF-03 | Os metadados devem ser mantidos em memória nesta primeira versão. |
| RNF-04 | A aplicação deve seguir o fluxo de dependência `routes -> controllers -> services -> repositories`. |
| RNF-05 | As rotas não devem conter regras de negócio. |
| RNF-06 | Os controllers devem tratar entrada e saída HTTP, deixando as regras para os services. |
| RNF-07 | Os services não devem depender diretamente dos objetos `req` e `res`. |
| RNF-08 | Os repositories devem encapsular a persistência dos metadados e o acesso aos arquivos. |
| RNF-09 | A configuração deve ser feita por variáveis de ambiente sempre que aplicável, seguindo o princípio 12-Factor. |
| RNF-10 | O backend deve retornar JSON nos erros da API, exceto quando o contrato indicar conteúdo binário. |
| RNF-11 | O sistema deve tratar falhas de leitura, escrita e localização de arquivos sem expor detalhes internos desnecessários. |
| RNF-12 | A aplicação deve ser compatível com os scripts existentes de desenvolvimento e teste. |
| RNF-13 | O frontend deve consumir o backend por `fetch`. |
| RNF-14 | O frontend deve utilizar componentes funcionais e React Hooks. |
| RNF-15 | O layout deve permanecer utilizável em telas desktop e mobile. |

## 8. Modelo de dados

### 8.1 Documento

| Campo | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `id` | `string` | Sim | Identificador único público do documento. |
| `originalName` | `string` | Sim | Nome original enviado pelo usuário. |
| `storedName` | `string` | Sim | Nome utilizado para armazenar o arquivo localmente. Não deve ser exposto como caminho arbitrário para o cliente. |
| `storagePath` | `string` | Sim | Referência controlada ao arquivo no armazenamento local. |
| `size` | `number` | Sim | Tamanho do arquivo em bytes. |
| `mimeType` | `string` | Sim | Tipo MIME informado ou detectado no upload. |
| `uploadedAt` | `string` | Sim | Data e hora do upload no formato ISO 8601. |
| `owner` | `string` | Sim | Identificador simples do usuário proprietário. |

### 8.2 Exemplo de metadado retornado

```json
{
  "id": "9f5e1a2c-2d4c-4f1b-9a1d-123456789abc",
  "originalName": "relatorio.pdf",
  "size": 24576,
  "mimeType": "application/pdf",
  "uploadedAt": "2026-09-15T12:00:00.000Z",
  "owner": "default-user"
}
```

O campo `storagePath` ou qualquer caminho físico interno não deve ser retornado ao cliente.

### 8.3 Repositórios

O backend deve possuir responsabilidades separadas para:

- Repositório de metadados em memória:
  - inserir documento;
  - listar documentos;
  - buscar documento por identificador.
- Repositório ou serviço de arquivos locais:
  - armazenar o arquivo recebido pelo `multer`;
  - verificar a existência do arquivo;
  - obter o caminho controlado para download.

A implementação pode utilizar dois repositórios distintos ou um repositório local composto, desde que a separação entre regra de negócio e persistência seja preservada.

## 9. Contratos de API

### 9.1 Convenções gerais

- Base URL do backend: `/`.
- Base URL utilizada pelo frontend em desenvolvimento: `/api`.
- Content-Type das respostas JSON: `application/json`.
- Identificadores são tratados como strings.
- Datas são retornadas no formato ISO 8601.
- O corpo dos erros deve seguir o formato:

```json
{
  "error": {
    "code": "DOCUMENT_NOT_FOUND",
    "message": "Documento não encontrado."
  }
}
```

### 9.2 `GET /health`

Verifica se o backend está disponível.

#### Resposta de sucesso

- Status: `200 OK`

```json
{
  "status": "ok"
}
```

### 9.3 `POST /upload`

Envia um documento para armazenamento local.

#### Requisição

- Content-Type: `multipart/form-data`
- Campo obrigatório: `file`
- Campo opcional: `owner`

Exemplo conceitual:

```text
file: relatorio.pdf
owner: usuario-1
```

Quando `owner` não for informado, o backend deve utilizar o valor padrão definido pela configuração da aplicação.

#### Resposta de sucesso

- Status: `201 Created`
- Content-Type: `application/json`

```json
{
  "id": "9f5e1a2c-2d4c-4f1b-9a1d-123456789abc",
  "originalName": "relatorio.pdf",
  "size": 24576,
  "mimeType": "application/pdf",
  "uploadedAt": "2026-09-15T12:00:00.000Z",
  "owner": "usuario-1"
}
```

#### Erros esperados

| Status | Código | Situação |
| --- | --- | --- |
| `400` | `FILE_REQUIRED` | Nenhum arquivo foi enviado. |
| `400` | `INVALID_UPLOAD` | A requisição multipart é inválida. |
| `413` | `FILE_TOO_LARGE` | O arquivo excede o limite configurado, caso exista. |
| `500` | `FILE_STORAGE_ERROR` | Falha ao gravar o arquivo no filesystem. |

### 9.4 `GET /documents`

Lista os metadados dos documentos conhecidos pelo processo atual.

#### Resposta de sucesso

- Status: `200 OK`
- Content-Type: `application/json`

```json
{
  "documents": [
    {
      "id": "9f5e1a2c-2d4c-4f1b-9a1d-123456789abc",
      "originalName": "relatorio.pdf",
      "size": 24576,
      "mimeType": "application/pdf",
      "uploadedAt": "2026-09-15T12:00:00.000Z",
      "owner": "usuario-1"
    }
  ]
}
```

Quando não houver documentos:

```json
{
  "documents": []
}
```

#### Erros esperados

| Status | Código | Situação |
| --- | --- | --- |
| `500` | `DOCUMENT_LIST_ERROR` | Falha ao consultar o repositório de metadados. |

### 9.5 `GET /documents/:id/download`

Baixa o conteúdo binário do documento identificado por `id`.

#### Parâmetros

| Parâmetro | Tipo | Obrigatório | Descrição |
| --- | --- | --- | --- |
| `id` | `string` | Sim | Identificador público do documento. |

#### Resposta de sucesso

- Status: `200 OK`
- Corpo: conteúdo binário do arquivo
- Content-Type: tipo MIME registrado para o documento
- Content-Disposition: anexo com o nome original do arquivo

#### Erros esperados

| Status | Código | Situação |
| --- | --- | --- |
| `404` | `DOCUMENT_NOT_FOUND` | Não existe metadado para o identificador. |
| `404` | `FILE_NOT_FOUND` | O metadado existe, mas o arquivo não está disponível. |
| `500` | `FILE_READ_ERROR` | Falha ao ler ou transmitir o arquivo. |

## 10. Arquitetura

### 10.1 Backend

A organização deve seguir a Clean Architecture simples definida pelo projeto:

```text
backend/src/
  app.js
  routes/
  controllers/
  services/
  repositories/
```

#### `routes/`

- Define os endpoints.
- Configura o middleware do `multer`.
- Encaminha as requisições para os controllers.
- Não implementa regras de negócio.

#### `controllers/`

- Lê parâmetros, campos e arquivos da requisição.
- Executa validações básicas de entrada.
- Chama os services.
- Converte resultados e erros em respostas HTTP.

#### `services/`

- Implementa as regras de negócio.
- Coordena armazenamento do arquivo e registro dos metadados.
- Decide os erros de domínio, como documento inexistente.
- Não deve depender diretamente dos objetos `req` e `res`.

#### `repositories/`

- Encapsula o armazenamento dos metadados em memória.
- Encapsula o acesso aos arquivos no filesystem local.
- Não deve conhecer detalhes da camada HTTP.

### 10.2 Frontend

A organização deve seguir a estrutura existente:

```text
frontend/src/
  App.jsx
  components/
  pages/
  services/
```

Componentes previstos:

- Componente de upload.
- Componente de listagem de documentos.
- Ação ou componente de download.
- Estados de carregamento, sucesso e erro.

O acesso HTTP deve ficar em `services/`, evitando chamadas `fetch` espalhadas pelos componentes.

## 11. Configuração

As configurações devem ser obtidas de variáveis de ambiente quando aplicável.

Variáveis previstas:

| Variável | Padrão sugerido | Descrição |
| --- | --- | --- |
| `PORT` | `3000` | Porta do backend. |
| `STORAGE_DIR` | `backend/storage` | Diretório local dos arquivos enviados. |
| `DEFAULT_OWNER` | `default-user` | Proprietário utilizado quando nenhum usuário for informado. |
| `MAX_FILE_SIZE` | Definido pela aplicação | Limite opcional de tamanho do upload em bytes. |

A aplicação deve criar ou validar o diretório de armazenamento antes de aceitar uploads, quando essa responsabilidade não for delegada ao ambiente de execução.

## 12. Segurança e integridade

- O caminho do arquivo nunca deve ser construído diretamente a partir de entrada livre do cliente.
- O identificador público deve ser separado do nome original do arquivo.
- O download deve utilizar apenas caminhos previamente registrados e controlados pelo backend.
- O nome original deve ser tratado como dado não confiável.
- O backend deve evitar retornar stack traces ou caminhos absolutos em respostas de erro.
- Limites de tamanho e tipos de arquivo podem ser configurados sem alterar o contrato principal.
- A autenticação completa não faz parte desta versão; o campo `owner` não representa uma autorização real.

## 13. Plano de execução em etapas

### Etapa 1 - Preparação e configuração

Arquivos envolvidos:

- `backend/src/app.js`
- `backend/src/config/` ou módulo equivalente, se necessário
- `backend/storage/`
- `backend/package.json`

Atividades:

- Definir configurações de ambiente.
- Garantir o diretório de armazenamento local.
- Preservar o endpoint `/health`.
- Preparar o registro das rotas da aplicação.

Critérios de aceite:

- O backend inicia com `npm start`.
- O endpoint `/health` continua respondendo `200`.
- O caminho de armazenamento é local e configurável.
- Nenhum provedor externo é utilizado.

### Etapa 2 - Implementação do armazenamento e metadados

Arquivos envolvidos:

- `backend/src/repositories/`
- `backend/src/services/`
- `backend/src/controllers/`
- `backend/src/routes/`

Atividades:

- Implementar o repositório de metadados em memória.
- Implementar o armazenamento local com `multer` e `diskStorage`.
- Implementar o service de upload.
- Definir o identificador, nome físico, tamanho, MIME type, data e proprietário.
- Garantir que os metadados só sejam registrados após o arquivo ser salvo.

Critérios de aceite:

- Um arquivo enviado é gravado em `backend/storage` ou no diretório configurado.
- O nome físico não depende diretamente do nome recebido.
- O documento criado possui todos os metadados obrigatórios.
- Falhas de armazenamento não criam metadados incompletos.

### Etapa 3 - API de upload

Arquivos envolvidos:

- `backend/src/routes/`
- `backend/src/controllers/`
- `backend/src/services/`

Atividades:

- Implementar `POST /upload`.
- Configurar o middleware de upload.
- Validar a presença do campo `file`.
- Retornar `201 Created` com os metadados públicos.

Critérios de aceite:

- Upload válido retorna `201`.
- Upload sem arquivo retorna `400`.
- A resposta não expõe o caminho físico interno.
- Erros de escrita retornam um contrato JSON consistente.

### Etapa 4 - API de listagem

Arquivos envolvidos:

- `backend/src/routes/`
- `backend/src/controllers/`
- `backend/src/services/`
- `backend/src/repositories/`

Atividades:

- Implementar `GET /documents`.
- Retornar os documentos registrados no processo atual.
- Garantir resposta vazia quando não houver documentos.

Critérios de aceite:

- A rota retorna `200`.
- A resposta possui a propriedade `documents`.
- A lista contém somente metadados públicos.
- A lista reflete os uploads realizados durante a execução atual.

### Etapa 5 - API de download

Arquivos envolvidos:

- `backend/src/routes/`
- `backend/src/controllers/`
- `backend/src/services/`
- `backend/src/repositories/`

Atividades:

- Implementar `GET /documents/:id/download`.
- Resolver o documento pelo identificador.
- Validar a existência do arquivo.
- Transmitir o conteúdo binário com headers apropriados.

Critérios de aceite:

- Um identificador válido retorna o arquivo correto.
- O nome original é utilizado no `Content-Disposition`.
- Um identificador inexistente retorna `404`.
- Um arquivo removido ou indisponível retorna `404`.
- O endpoint não permite traversal de diretório.

### Etapa 6 - Interface frontend

Arquivos envolvidos:

- `frontend/src/App.jsx`
- `frontend/src/components/`
- `frontend/src/pages/`
- `frontend/src/services/`

Atividades:

- Implementar o serviço HTTP com `fetch`.
- Criar o fluxo de upload.
- Criar a listagem de documentos.
- Criar a ação de download.
- Tratar carregamento, sucesso, lista vazia e erros.
- Integrar com o prefixo `/api` configurado no Vite.

Critérios de aceite:

- O usuário consegue selecionar e enviar um arquivo.
- A lista é carregada ao abrir a aplicação.
- Um upload bem-sucedido atualiza a lista.
- Cada documento possui uma ação de download.
- Falhas da API são exibidas de maneira compreensível.
- A interface funciona no desktop e em telas menores.

### Etapa 7 - Testes automatizados

Arquivos envolvidos:

- `backend/test/app.test.js`
- Novos arquivos de teste em `backend/test/`, se necessário

Atividades:

- Testar o endpoint `/health`.
- Testar upload válido.
- Testar upload sem arquivo.
- Testar listagem vazia e listagem após upload.
- Testar download válido.
- Testar identificador inexistente.
- Isolar ou limpar o diretório de armazenamento utilizado pelos testes.

Critérios de aceite:

- `npm test` executa sem falhas.
- Os testes não dependem de serviços externos.
- Os testes não deixam arquivos temporários persistentes sem necessidade.
- Os principais contratos HTTP estão cobertos.

### Etapa 8 - Validação final

Arquivos envolvidos:

- Backend, frontend e documentação produzidos nas etapas anteriores.

Atividades:

- Executar os testes do backend.
- Executar o build do frontend.
- Validar o fluxo manual upload -> listagem -> download.
- Verificar respostas de erro.
- Revisar se a arquitetura mantém o fluxo `routes -> controllers -> services -> repositories`.

Critérios de aceite:

- O backend inicia corretamente.
- O frontend conclui o build sem erros.
- O fluxo completo funciona com armazenamento local.
- Não há dependências de armazenamento externo.
- A documentação e os contratos implementados permanecem coerentes.

## 14. Riscos e decisões

### Risco 1 - Perda dos metadados no reinício

Como os metadados ficam em memória, o backend perde a capacidade de localizar documentos antigos após reiniciar.

Decisão: aceitar essa limitação nesta fase, documentando que a persistência em banco está fora do escopo.

### Risco 2 - Arquivos órfãos

Uma falha após o armazenamento do arquivo e antes do registro do metadado pode deixar um arquivo sem referência.

Decisão: o service deve registrar os metadados somente após o armazenamento concluído e, quando possível, remover o arquivo caso o registro falhe.

### Risco 3 - Colisão de nomes

Nomes originais podem ser iguais para arquivos diferentes.

Decisão: utilizar um nome físico gerado pelo sistema e manter o nome original somente como metadado.

### Risco 4 - Caminhos manipulados pelo cliente

Usar diretamente um nome ou caminho enviado pelo cliente pode permitir acesso indevido ao filesystem.

Decisão: o cliente fornece apenas o identificador público; o backend resolve o caminho armazenado internamente.

### Risco 5 - Ausência de autenticação

O campo `owner` não garante identidade nem autorização.

Decisão: manter a associação simples por usuário como requisito funcional inicial e deixar autenticação real fora do escopo.

## 15. Critérios gerais de aceite

- O usuário consegue enviar um documento pela interface.
- O arquivo é gravado somente no filesystem local.
- O backend utiliza `multer` com `diskStorage`.
- Os metadados são mantidos em memória.
- O documento enviado aparece na listagem.
- O documento pode ser baixado pelo identificador.
- Erros de entrada, documento inexistente e falhas de armazenamento possuem respostas adequadas.
- A arquitetura respeita `routes -> controllers -> services -> repositories`.
- O backend passa nos testes automatizados.
- O frontend conclui o build.
- Nenhum arquivo de implementação de backend ou frontend é criado como parte desta etapa de especificação.