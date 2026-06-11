'use client';

import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import type { GalleryItem } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ImageUpload from '@/components/ui/ImageUpload';
import Modal from '@/components/ui/Modal';

export default function GalleryManager() {
  const { gallery, setGallery } = useData();
  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [error, setError] = useState('');

  const handleAdd = () => {
    if (!newImageUrl) {
      setError('Foto harus diupload');
      return;
    }
    if (!newCaption.trim()) {
      setError('Caption harus diisi');
      return;
    }
    const newId = Math.max(...gallery.map((p) => p.id), 0) + 1;
    setGallery([...gallery, { id: newId, imageUrl: newImageUrl, caption: newCaption.trim() }]);
    setNewImageUrl('');
    setNewCaption('');
    setError('');
    setShowAddForm(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setGallery(gallery.filter((p) => p.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-900">Manajemen Galeri</h1>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Tambah Foto
        </Button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-2xl shadow-md p-6 mb-6 animate-slide-up">
          <h3 className="font-bold text-gray-900 mb-4">Upload Foto Baru</h3>
          <div className="space-y-4">
            <ImageUpload label="Foto" value={newImageUrl} onChange={(url) => { setNewImageUrl(url); setError(''); }} />
            <Input id="gallery-caption" label="Caption" placeholder="Deskripsikan foto..." value={newCaption} onChange={(e) => { setNewCaption(e.target.value); setError(''); }} />
            {error && <p className="text-sm text-red-500">{error}</p>}
            <div className="flex gap-3">
              <Button onClick={handleAdd}>Simpan Foto</Button>
              <Button variant="ghost" onClick={() => setShowAddForm(false)}>Batal</Button>
            </div>
          </div>
        </div>
      )}

      {gallery.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {gallery.map((photo) => (
            <div key={photo.id} className="bg-white rounded-2xl shadow-md overflow-hidden group">
              <div className="relative aspect-[4/3]">
                <img src={photo.imageUrl} alt={photo.caption} className="w-full h-full object-cover" />
                <button
                  onClick={() => setDeleteTarget(photo)}
                  className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 min-h-[44px] min-w-[44px] flex items-center justify-center shadow-md"
                  title="Hapus foto"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-600">{photo.caption}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl shadow-md">
          <span className="text-4xl mb-3 block">🖼️</span>
          <p className="text-gray-500 mb-4">Belum ada foto galeri.</p>
          <Button size="sm" onClick={() => setShowAddForm(true)}>Tambah Foto Pertama</Button>
        </div>
      )}

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Hapus Foto" size="sm">
        <p className="text-gray-600 mb-6">
          Yakin ingin menghapus foto <strong className="text-gray-900">&quot;{deleteTarget?.caption}&quot;</strong>?
        </p>
        <div className="flex gap-3">
          <Button variant="danger" onClick={handleDelete} className="flex-1">Ya, Hapus</Button>
          <Button variant="ghost" onClick={() => setDeleteTarget(null)} className="flex-1">Batal</Button>
        </div>
      </Modal>
    </div>
  );
}
