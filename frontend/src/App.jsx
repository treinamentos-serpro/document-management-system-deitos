import { useState } from 'react';
import UploadComponent from './components/UploadComponent';
import DocumentList from './components/DocumentList';

// Componente raiz: monta o upload e a listagem de documentos.
export default function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  function handleUploadSuccess() {
    setRefreshKey((previousKey) => previousKey + 1);
  }

  return (
    <main style={{ fontFamily: 'system-ui, sans-serif', padding: '2rem' }}>
      <h1>Document Management System</h1>
      <UploadComponent onUploadSuccess={handleUploadSuccess} />
      <DocumentList refreshKey={refreshKey} />
    </main>
  );
}
