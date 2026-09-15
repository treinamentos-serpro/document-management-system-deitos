---
description: Gera testes com Vitest e React Testing Library para um componente ou serviço do frontend.
name: gerar-testes-frontend
argument-hint: caminho do arquivo (ex. frontend/src/components/UploadComponent.jsx)
agent: agent
---

# Gerar testes do frontend

Gere testes automatizados para o arquivo `${input:arquivo:caminho do arquivo}` usando `vitest` e `@testing-library/react`.

Requisitos:

- Se `vitest`, `@testing-library/react`, `@testing-library/jest-dom` e `jsdom` não estiverem em `frontend/package.json`, adicione-os como devDependencies e configure o ambiente `jsdom` no `vite.config.js` (bloco `test`).
- Para componentes, renderize com `render` da Testing Library e prefira consultas acessíveis (`getByRole`, `getByLabelText`).
- Simule chamadas ao backend fazendo mock de `fetch` ou do módulo em `frontend/src/services`; não faça chamadas de rede reais.
- Cubra os casos de sucesso e de erro principais (ex.: sucesso no upload, erro retornado pela API, lista vazia).
- Mantenha os testes isolados, legíveis e sem duplicação de setup (use `beforeEach` quando fizer sentido).
- Coloque o arquivo de teste ao lado do arquivo testado, com o sufixo `.test.jsx` (ou `.test.js` para módulos sem JSX).
