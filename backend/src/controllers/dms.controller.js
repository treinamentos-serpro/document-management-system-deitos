const path = require('node:path');
const multer = require('multer');
const { DmsServiceError, uploadDocument, listDocuments, downloadDocument } = require('../services/dms.service');

const storageDirectory = path.resolve(__dirname, '..', '..', 'storage');
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, storageDirectory);
  },
  filename: (_req, file, cb) => {
    const safeName = `${Date.now()}-${Math.random().toString(16).slice(2)}-${file.originalname.replace(/\s+/g, '-')}`;
    cb(null, safeName);
  },
});

const upload = multer({
  storage,
  limits: {
    files: 1,
  },
});

function handleError(res, error) {
  if (error instanceof DmsServiceError) {
    return res.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message,
      },
    });
  }

  return res.status(500).json({
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Erro interno ao processar a solicitação.',
    },
  });
}

async function uploadDocumentController(req, res) {
  try {
    const file = Array.isArray(req.files) ? req.files[0] : req.file;
    const owner = req.body?.owner || 'default-user';

    const createdDocument = uploadDocument(file, owner);

    return res.status(201).json(createdDocument);
  } catch (error) {
    return handleError(res, error);
  }
}

async function listDocumentsController(_req, res) {
  try {
    return res.json({ documents: listDocuments() });
  } catch (error) {
    return handleError(res, error);
  }
}

async function downloadDocumentController(req, res) {
  try {
    const { document, filePath } = downloadDocument(req.params.id);
    return res.download(filePath, document.originalName);
  } catch (error) {
    return handleError(res, error);
  }
}

module.exports = {
  upload,
  uploadDocumentController,
  listDocumentsController,
  downloadDocumentController,
};
