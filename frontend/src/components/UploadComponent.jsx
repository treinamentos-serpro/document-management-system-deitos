import { useState } from 'react';
import { uploadDocument } from '../services/dmsApi';

// Formulário simples para envio de um documento ao backend.
export default function UploadComponent({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [owner, setOwner] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  function handleFileChange(event) {
    setFile(event.target.files[0] || null);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!file) {
      setErrorMessage('Selecione um arquivo para enviar.');
      return;
    }

    setIsUploading(true);
    setErrorMessage('');

    try {
      const document = await uploadDocument(file, owner);
      setFile(null);
      setOwner('');
      event.target.reset();
      onUploadSuccess?.(document);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Enviar documento</h2>
      <div>
        <label htmlFor="file">Arquivo</label>
        <input id="file" type="file" onChange={handleFileChange} />
      </div>
      <div>
        <label htmlFor="owner">Proprietário</label>
        <input
          id="owner"
          type="text"
          value={owner}
          onChange={(event) => setOwner(event.target.value)}
          placeholder="default-user"
        />
      </div>
      <button type="submit" disabled={isUploading}>
        {isUploading ? 'Enviando...' : 'Enviar'}
      </button>
      {errorMessage && <p role="alert">{errorMessage}</p>}
    </form>
  );
}
