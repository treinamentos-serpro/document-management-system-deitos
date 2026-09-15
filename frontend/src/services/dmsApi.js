// Cliente de API do DMS. Centraliza as chamadas fetch ao backend via /api.

const API_BASE_URL = '/api';

async function parseErrorResponse(response) {
  try {
    const body = await response.json();
    return body?.error?.message || 'Erro ao comunicar com o servidor.';
  } catch {
    return 'Erro ao comunicar com o servidor.';
  }
}

export async function uploadDocument(file, owner) {
  const formData = new FormData();
  formData.append('file', file);
  if (owner) {
    formData.append('owner', owner);
  }

  const response = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(await parseErrorResponse(response));
  }

  return response.json();
}

export async function listDocuments() {
  const response = await fetch(`${API_BASE_URL}/documents`);

  if (!response.ok) {
    throw new Error(await parseErrorResponse(response));
  }

  const { documents } = await response.json();
  return documents;
}

export function getDownloadUrl(documentId) {
  return `${API_BASE_URL}/documents/${documentId}/download`;
}
