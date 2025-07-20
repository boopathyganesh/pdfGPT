'use client';

import { useState } from 'react';

export default function FileUpload({ onUpload }: { onUpload: (welcome: string) => void }) {
    const [files, setFiles] = useState<File[]>([]);
    const [loading, setLoading] = useState(false);

    const handleUpload = async () => {
        if (!files.length) return;

        setLoading(true);
        const formData = new FormData();

        files.forEach((file) => {
            formData.append("files", file); 
        });

        const res = await fetch("http://localhost:8000/upload", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();
        setLoading(false);

        if (data.notice) {
            onUpload("Hi! I'm ready to answer your questions based on the uploaded document(s). Ask me anything!");
        }
    };

    return (
        <div className="flex gap-4 items-center mb-4 border border-white p-2 px-4 rounded-2xl">
            <input
                type="file"
                multiple
                accept="application/pdf"
                onChange={(e) => setFiles(Array.from(e.target.files || []))}
                className="file-input file-input-bordered"
            />
            <button
                onClick={handleUpload}
                disabled={!files.length || loading}
                className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50"
            >
                {loading ? 'Uploading...' : 'Upload'}
            </button>
        </div>
    );
}
