'use client';

import { useState } from 'react';

export default function FileUpload({ onUpload }: { onUpload: (welcome:string) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    setLoading(true);

    const res = await fetch('http://localhost:8000/upload', {
      method: 'POST',
      body: formData,
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      onUpload(data.welcome);
    } else {
      alert('Upload failed!');
    }
  };

  return (
    <div className="flex gap-4 items-center mb-4 border border-white p-2 px-4 rounded-2xl">
      <input
        type="file"
        accept=".pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="file-input file-input-bordered"
      />
      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
      >
        {loading ? 'Uploading...' : 'Upload'}
      </button>
    </div>
  );
}
