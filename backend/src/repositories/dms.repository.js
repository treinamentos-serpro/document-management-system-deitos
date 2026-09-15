const fs = require('node:fs');
const path = require('node:path');
const { randomUUID } = require('node:crypto');

const storageDirectory = path.resolve(__dirname, '..', '..', 'storage');
const documents = new Map();

fs.mkdirSync(storageDirectory, { recursive: true });

function createDocumentEntry({ originalName, storedName, size, mimeType, owner }) {
  const document = {
    id: randomUUID(),
    originalName,
    storedName,
    storagePath: path.join(storageDirectory, storedName),
    size,
    mimeType,
    uploadedAt: new Date().toISOString(),
    owner,
  };

  documents.set(document.id, document);
  return { ...document };
}

function listDocuments() {
  return Array.from(documents.values()).map((document) => ({ ...document }));
}

function findDocumentById(id) {
  const document = documents.get(id);
  return document ? { ...document } : null;
}

function fileExists(filePath) {
  return fs.existsSync(filePath);
}

module.exports = {
  storageDirectory,
  createDocumentEntry,
  listDocuments,
  findDocumentById,
  fileExists,
};
