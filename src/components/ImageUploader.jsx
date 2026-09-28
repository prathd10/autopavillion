import React, { useState, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { ikUrl } from '../lib/imagekit';
import { UploadCloud, X, Loader2, GripVertical, ChevronLeft, ChevronRight, Star } from 'lucide-react';

export default function ImageUploader({ 
  value = [], 
  onChange, 
  label: _label, 
  maxFiles = null, 
  previewOpts,
  purpose = 'inventory',
  folder = '/autopavilion/cars'
}) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const fileInputRef = useRef(null);

  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
  const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

  /* ─── File Upload Drag & Drop ────────────────────────────────── */
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
    if (maxFiles && value.length + files.length > maxFiles) {
      alert(`You can only upload up to ${maxFiles} images.`);
      return;
    }

    // Client-side file validation
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!ALLOWED_TYPES.includes(file.type)) {
        alert(`Invalid file format: "${file.name}". Only JPEG, PNG, and WebP images are allowed.`);
        return;
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        alert(`File too large: "${file.name}". Maximum allowed size is 10 MB.`);
        return;
      }
    }

    setUploading(true);
    const newUrls = [...value];

    try {
      // Get current auth session if available
      const { data: { session } } = await supabase.auth.getSession();
      const authHeaders = {};
      if (session?.access_token) {
        authHeaders['Authorization'] = `Bearer ${session.access_token}`;
      }

      // Upload each file directly to ImageKit
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // 1. Fetch an authenticated upload signature from backend
        const authRes = await fetch(`/api/imagekit-auth?purpose=${encodeURIComponent(purpose)}`, {
          headers: authHeaders
        });
        if (!authRes.ok) {
          const errData = await authRes.json().catch(() => ({}));
          throw new Error(errData.error || 'Failed to fetch upload signature');
        }
        const auth = await authRes.json();
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('publicKey', import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY);
        formData.append('signature', auth.signature);
        formData.append('expire', auth.expire);
        formData.append('token', auth.token);
        formData.append('fileName', file.name.replace(/[^a-zA-Z0-9._-]/g, '_'));
        formData.append('folder', folder);

        const uploadRes = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
          method: 'POST',
          body: formData
        });

        if (!uploadRes.ok) {
          const err = await uploadRes.json();
          throw new Error(err.message || 'Upload failed');
        }

        const data = await uploadRes.json();
        // Save the relative filePath (e.g. /autopavillion/cars/filename.jpg) so it resolves correctly with our ikUrl helper
        newUrls.push(data.filePath);
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

  /* ─── Image Reordering Logic ─────────────────────────────────── */
  const moveItem = (fromIndex, toIndex) => {
    if (
      fromIndex === toIndex ||
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= value.length ||
      toIndex >= value.length
    ) {
      return;
    }
    const reordered = [...value];
    const [movedItem] = reordered.splice(fromIndex, 1);
    reordered.splice(toIndex, 0, movedItem);
    onChange(reordered);
  };

  const handleCardDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString());
  };

  const handleCardDragOver = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleCardDragEnter = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOverIndex(index);
  };

  const handleCardDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleCardDrop = (e, targetIndex) => {
    e.preventDefault();
    e.stopPropagation();

    const rawFrom = e.dataTransfer.getData('text/plain');
    const fromIndex = draggedIndex !== null ? draggedIndex : parseInt(rawFrom, 10);

    if (fromIndex !== null && !isNaN(fromIndex) && fromIndex !== targetIndex) {
      moveItem(fromIndex, targetIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleCardDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
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
                JPEG, PNG, WEBP{maxFiles ? ` (Max ${maxFiles} files)` : ''}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Previews Grid with Reordering */}
      {value.length > 0 && (
        <div className="space-y-3 pt-1">
          <div className="flex flex-wrap items-center justify-between gap-2 px-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold tracking-widest uppercase text-white">
                Uploaded Images ({value.length})
              </span>
              <span className="hidden sm:inline-block text-[10px] text-zinc-400 font-medium">
                • #1 is primary cover photo
              </span>
            </div>
            {value.length > 1 && (
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-zinc-300 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full select-none">
                <GripVertical size={12} className="text-zinc-400" />
                <span>Drag cards to reorder</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {value.map((url, i) => {
              const isCover = i === 0;
              const isBeingDragged = draggedIndex === i;
              const isDropTarget = dragOverIndex === i && draggedIndex !== i;

              return (
                <div 
                  key={`${url}-${i}`}
                  draggable={value.length > 1 && !uploading}
                  onDragStart={(e) => handleCardDragStart(e, i)}
                  onDragOver={(e) => handleCardDragOver(e, i)}
                  onDragEnter={(e) => handleCardDragEnter(e, i)}
                  onDragLeave={handleCardDragLeave}
                  onDrop={(e) => handleCardDrop(e, i)}
                  onDragEnd={handleCardDragEnd}
                  className={`relative group rounded-2xl overflow-hidden bg-black/60 border aspect-video transition-all duration-200 select-none
                    ${value.length > 1 ? 'cursor-grab active:cursor-grabbing' : ''}
                    ${isBeingDragged ? 'opacity-35 scale-95 border-dashed border-white/60 ring-2 ring-white/30' : ''}
                    ${isDropTarget ? 'border-white ring-2 ring-white scale-[1.03] shadow-[0_0_25px_rgba(255,255,255,0.25)] z-10' : 'border-white/10 hover:border-white/30'}
                  `}
                >
                  <img
                    src={ikUrl(url, previewOpts)}
                    alt=""
                    draggable={false}
                    className="w-full h-full object-cover pointer-events-none select-none"
                    onError={e => { e.target.style.display = 'none'; }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 pointer-events-none" />

                  {/* Drop Target Indicator Badge */}
                  {isDropTarget && (
                    <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px] flex items-center justify-center pointer-events-none z-30">
                      <div className="px-3 py-1.5 rounded-full bg-black/90 text-white border border-white/40 text-[10px] font-extrabold tracking-widest uppercase shadow-2xl flex items-center gap-1.5 animate-pulse">
                        <GripVertical size={12} className="text-white" />
                        <span>Move to #{i + 1}</span>
                      </div>
                    </div>
                  )}

                  {/* Drag Handle Tag (Top-Left) */}
                  {value.length > 1 && (
                    <div 
                      className="absolute top-2 left-2 z-20 flex items-center gap-1 px-2 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-white/15 text-zinc-300 group-hover:text-white shadow-lg pointer-events-none transition-all duration-200"
                      title="Drag to reorder"
                    >
                      <GripVertical size={12} className="text-zinc-400 group-hover:text-white" />
                      <span className="text-[9px] font-bold tracking-wider uppercase">Drag</span>
                    </div>
                  )}

                  {/* Delete Button (Top-Right) */}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeImage(i); }}
                    className="absolute top-2 right-2 z-20 w-7 h-7 rounded-full bg-red-500/90 text-white flex items-center justify-center
                      opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-500 hover:scale-110 shadow-xl cursor-pointer"
                    title="Delete image"
                  >
                    <X size={13} />
                  </button>

                  {/* Cover Badge or Index Number (Bottom-Left) */}
                  {isCover ? (
                    <div className="absolute bottom-2 left-2 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-400 text-black font-black text-[9px] tracking-wider uppercase shadow-xl border border-amber-300 select-none pointer-events-none">
                      <Star size={10} className="fill-black stroke-black" />
                      <span>Main Cover</span>
                    </div>
                  ) : (
                    <div className="absolute bottom-2 left-2 z-20 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md border border-white/15 text-zinc-200 font-bold text-[9px] tracking-widest uppercase select-none pointer-events-none">
                      #{i + 1}
                    </div>
                  )}

                  {/* Quick Shift / Cover Actions (Bottom-Right on Hover) */}
                  {value.length > 1 && (
                    <div className="absolute bottom-2 right-2 z-20 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {!isCover && (
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); moveItem(i, 0); }}
                          className="px-2 py-1 rounded-md bg-black/85 backdrop-blur-md border border-amber-400/40 text-amber-300 hover:text-amber-200 hover:bg-amber-400/20 text-[9px] font-bold tracking-wider uppercase transition-colors shadow-lg cursor-pointer"
                          title="Set as Main Cover Photo"
                        >
                          Make Cover
                        </button>
                      )}
                      {i > 0 && (
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); moveItem(i, i - 1); }}
                          className="w-6 h-6 rounded-md bg-black/85 backdrop-blur-md border border-white/20 text-zinc-300 hover:text-white hover:bg-white/20 flex items-center justify-center transition-colors shadow-lg cursor-pointer"
                          title="Move left"
                        >
                          <ChevronLeft size={12} />
                        </button>
                      )}
                      {i < value.length - 1 && (
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); moveItem(i, i + 1); }}
                          className="w-6 h-6 rounded-md bg-black/85 backdrop-blur-md border border-white/20 text-zinc-300 hover:text-white hover:bg-white/20 flex items-center justify-center transition-colors shadow-lg cursor-pointer"
                          title="Move right"
                        >
                          <ChevronRight size={12} />
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

