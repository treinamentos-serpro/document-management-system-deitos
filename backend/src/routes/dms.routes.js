const express = require('express');
const {
  upload,
  uploadDocumentController,
  listDocumentsController,
  downloadDocumentController,
} = require('../controllers/dms.controller');

const router = express.Router();

router.post('/upload', upload.single('file'), uploadDocumentController);
router.get('/documents', listDocumentsController);
router.get('/documents/:id/download', downloadDocumentController);

module.exports = router;
