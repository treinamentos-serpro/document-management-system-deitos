const { test, before, after } = require('node:test');
const assert = require('node:assert');
const { once } = require('node:events');
const app = require('../src/app');

let server;
let baseUrl;

before(async () => {
  server = app.listen(0);
  await once(server, 'listening');
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error);
        return;
      }
      resolve();
    });
  });
});

test('o app backend é exportado', () => {
  assert.ok(app, 'o app deve estar definido');
  assert.strictEqual(typeof app, 'function', 'o app Express deve ser uma função');
});

test('POST /upload cria um documento e salva o arquivo', async () => {
  const formData = new FormData();
  formData.append('file', new Blob(['hello world'], { type: 'text/plain' }), 'sample.txt');
  formData.append('owner', 'user-1');

  const response = await fetch(`${baseUrl}/upload`, {
    method: 'POST',
    body: formData,
  });

  assert.strictEqual(response.status, 201, 'o upload deve retornar 201');

  const payload = await response.json();
  assert.strictEqual(payload.owner, 'user-1');
  assert.strictEqual(payload.originalName, 'sample.txt');
  assert.strictEqual(payload.size, 11);
  assert.ok(payload.id, 'o documento deve ter um identificador');
  assert.ok(payload.uploadedAt, 'o documento deve registrar a data do upload');
});

test('GET /documents retorna a lista de metadados', async () => {
  const response = await fetch(`${baseUrl}/documents`);
  assert.strictEqual(response.status, 200, 'a listagem deve responder 200');

  const payload = await response.json();
  assert.ok(payload.documents, 'a resposta deve conter a propriedade documents');
  assert.ok(Array.isArray(payload.documents), 'documents deve ser um array');
  assert.ok(payload.documents.length >= 1, 'deve haver pelo menos um documento');
});

test('GET /documents/:id/download baixa o arquivo correto', async () => {
  const uploadResponse = await fetch(`${baseUrl}/upload`, {
    method: 'POST',
    body: (() => {
      const formData = new FormData();
      formData.append('file', new Blob(['arquivo de teste'], { type: 'text/plain' }), 'download.txt');
      return formData;
    })(),
  });

  const uploaded = await uploadResponse.json();
  const response = await fetch(`${baseUrl}/documents/${uploaded.id}/download`);

  assert.strictEqual(response.status, 200, 'o download deve responder 200');
  assert.strictEqual(await response.text(), 'arquivo de teste');
  assert.match(response.headers.get('content-disposition') || '', /download\.txt/i);
});
