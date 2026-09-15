import { getDownloadUrl } from '../services/dmsApi';

// Link de download de um documento identificado por id.
export default function DownloadButton({ documentId, fileName }) {
  return (
    <a href={getDownloadUrl(documentId)} download={fileName}>
      Baixar
    </a>
  );
}
