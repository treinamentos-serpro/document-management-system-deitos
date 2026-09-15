const repository = require('../repositories/dms.repository');

class DmsServiceError extends Error {
  constructor(code, message, statusCode = 400) {
    super(message);
    this.name = 'DmsServiceError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

function uploadDocument(file, owner) {
  if (!file) {
    throw new DmsServiceError('NO_FILE', 'Arquivo obrigatório.', 400);
  }

  const document = repository.createDocumentEntry({
    originalName: file.originalname,
    storedName: file.filename,
    size: file.size,
    mimeType: file.mimetype,
    owner: owner || 'default-user',
  });

  return {
    id: document.id,
    originalName: document.originalName,
    size: document.size,
    mimeType: document.mimeType,
    uploadedAt: document.uploadedAt,
    owner: document.owner,
  };
}

function listDocuments() {
  return repository.listDocuments().map((document) => ({
    id: document.id,
    originalName: document.originalName,
    size: document.size,
    mimeType: document.mimeType,
    uploadedAt: document.uploadedAt,
    owner: document.owner,
  }));
}

function downloadDocument(documentId) {
  const document = repository.findDocumentById(documentId);

  if (!document) {
    throw new DmsServiceError('DOCUMENT_NOT_FOUND', 'Documento não encontrado.', 404);
  }

  const fileExists = repository.fileExists(document.storagePath);
  if (!fileExists) {
    throw new DmsServiceError('FILE_NOT_FOUND', 'Arquivo do documento não encontrado.', 404);
  }

  return {
    document,
    filePath: document.storagePath,
  };
}

module.exports = {
  DmsServiceError,
  uploadDocument,
  listDocuments,
  downloadDocument,
};
