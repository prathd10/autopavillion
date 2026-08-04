import React, { useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { ikUrl } from '../lib/imagekit';
import { UploadCloud, X, Loader2, Image as ImageIcon } from 'lucide-react';

export default function ImageUploader({ value = [], onChange, label, maxFiles = 10, previewOpts }) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFiles(e.dataTransfer.files);
    }
  };

  const handleChange = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFiles(e.target.files);
    }
  };

  const processFiles = async (files) => {
    if (value.length + files.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} images.`);
      return;
    }

    setUploading(true);
    const newUrls = [...value];

    try {
      // 1. Fetch authentication signature from our backend
      // We check both local port (3001) and relative path for Vercel/production
      const authRes = await fetch('http://localhost:3001/api/imagekit-auth').catch(() => fetch('/api/imagekit-auth'));
      if (!authRes.ok) throw new Error('Failed to fetch upload signature');
      const auth = await authRes.json();

      // 2. Upload each file directly to ImageKit
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('publicKey', import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY);
        formData.append('signature', auth.signature);
        formData.append('expire', auth.expire);
        formData.append('token', auth.token);
        formData.append('fileName', file.name);
        formData.append('folder', '/cars'); // Organize uploads into a cars folder

        const uploadRes = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
          method: 'POST',
          body: formData
        });

        if (!uploadRes.ok) {
          const err = await uploadRes.json();
          throw new Error(err.message || 'Upload failed');
        }

        const data = await uploadRes.json();
        // The API returns the URL of the uploaded image. 
        // We extract just the relative path so it works with our ikUrl() helper
        const url = new URL(data.url);
        newUrls.push(url.pathname);
      }
    } catch (err) {
      console.error('Upload failed:', err);
      alert(`Upload Failed: ${err.message}`);
    }

    onChange(newUrls);
    setUploading(false);
    
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = (indexToRemove) => {
    onChange(value.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="space-y-4">
      {/* Drag & Drop Area */}
      <div 
        className={`relative w-full p-8 rounded-3xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center text-center cursor-pointer overflow-hidden
          ${dragActive ? 'border-white bg-white/10' : 'border-white/20 bg-black/40 hover:bg-white/5 hover:border-white/40'}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          ref={fileInputRef}
          type="file" 
          multiple 
          accept="image/jpeg, image/png, image/webp" 
          onChange={handleChange} 
          className="hidden" 
        />
        
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
            <p className="text-xs font-bold tracking-widest uppercase text-white">Uploading securely...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-zinc-400">
              <UploadCloud size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-white mb-1">Click to upload or drag & drop</p>
              <p className="text-[10px] tracking-widest uppercase text-zinc-500">
                JPEG, PNG, WEBP (Max {maxFiles} files)
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Previews Grid */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {value.map((url, i) => (
            <div key={i} className="relative group rounded-2xl overflow-hidden bg-black/60 border border-white/10 aspect-video">
              <img
                src={ikUrl(url, previewOpts)}
                alt=""
                className="w-full h-full object-cover"
                onError={e => { e.target.style.display = 'none'; }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300" />
              
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-red-500/90 text-white flex items-center justify-center
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-500 scale-90 group-hover:scale-100 shadow-xl"
              >
                <X size={14} />
              </button>
              
              <span className="absolute bottom-2 left-2 text-[9px] font-bold tracking-widest uppercase bg-black/80 backdrop-blur-md rounded-md px-2 py-1 text-white border border-white/10">
                #{i + 1}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
