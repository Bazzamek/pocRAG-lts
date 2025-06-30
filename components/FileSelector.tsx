// app/dashboard/FileSelector.tsx
'use client';

import { useState, useRef } from 'react';

interface FileSelectorProps {
  files: string[];
}

export default function FileSelector({ files }: FileSelectorProps) {
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadMode, setUploadMode] = useState<'server' | 'upload'>('upload');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === 'text/plain') {
      setUploadedFile(file);
      setError(null);
    } else {
      setError('Wybierz plik .txt');
      setUploadedFile(null);
    }
  };

  const loadDocumentFromUpload = async () => {
    if (!uploadedFile) {
      setError('Wybierz plik z komputera');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const fileContent = await uploadedFile.text();
      
      const response = await fetch('/api/rag/loader', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          fileContent: fileContent,
          fileName: uploadedFile.name,
          metadata: { 
            loadedBy: 'dashboard',
            fileName: uploadedFile.name,
            fileSize: uploadedFile.size,
            loadedAt: new Date().toISOString()
          }
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Wystąpił błąd');
      }
      
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd');
    } finally {
      setLoading(false);
    }
  };

  const loadDocumentFromServer = async () => {
    if (!selectedFile) {
      setError('Wybierz plik');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await fetch('/api/rag/loader', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          filePath: `./docs/${selectedFile}`,
          metadata: { 
            loadedBy: 'dashboard',
            fileName: selectedFile,
            loadedAt: new Date().toISOString()
          }
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Wystąpił błąd');
      }
      
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wystąpił błąd');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Wybór trybu */}
      <div className="flex gap-4">
        <button
          onClick={() => setUploadMode('upload')}
          className={`px-4 py-2 rounded ${
            uploadMode === 'upload' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700'
          }`}
        >
          Upload z komputera
        </button>
        {files.length > 0 && (
          <button
            onClick={() => setUploadMode('server')}
            className={`px-4 py-2 rounded ${
              uploadMode === 'server' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
          >
            Pliki z serwera
          </button>
        )}
      </div>

      {uploadMode === 'upload' && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Wybierz plik .txt z komputera:
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt"
              onChange={handleFileUpload}
              className="w-full p-2 border border-gray-300 rounded-md"
              disabled={loading}
            />
            {uploadedFile && (
              <p className="text-sm text-gray-600 mt-1">
                Wybrany plik: {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>

          <button
            onClick={loadDocumentFromUpload}
            disabled={loading || !uploadedFile}
            className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-green-600"
          >
            {loading ? 'Ładowanie...' : 'Załaduj plik z komputera'}
          </button>
        </div>
      )}

      {uploadMode === 'server' && files.length > 0 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Wybierz plik z serwera:
            </label>
            <select
              value={selectedFile}
              onChange={(e) => setSelectedFile(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              disabled={loading}
            >
              <option value="">-- Wybierz plik --</option>
              {files.map((file) => (
                <option key={file} value={file}>
                  {file}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={loadDocumentFromServer}
            disabled={loading || !selectedFile}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-blue-600"
          >
            {loading ? 'Ładowanie...' : 'Załaduj z serwera'}
          </button>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded border border-red-300">
          <strong>Błąd:</strong> {error}
        </div>
      )}
      
      {result && (
        <div className="p-4 bg-green-100 text-green-700 rounded border border-green-300">
          <strong>Sukces</strong> {result.message}
          <div className="mt-2 text-sm">
            <p>Liczba chunkow: {result.data.chunksCount}</p>
            <p>Plik: {uploadMode === 'upload' ? uploadedFile?.name : selectedFile}</p>
          </div>
        </div>
      )}
    </div>
  );
}
