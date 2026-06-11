'use client';

import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import type { Review } from '@/types';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Modal from '@/components/ui/Modal';
import StarRating from '@/components/ui/StarRating';

const emptyForm: Omit<Review, 'id'> = { name: '', rating: 5, text: '', date: '' };

export default function ReviewsManager() {
  const { reviews, setReviews } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Review | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Review | null>(null);
  const [form, setForm] = useState<Omit<Review, 'id'>>(emptyForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const openAdd = () => { setEditingItem(null); setForm(emptyForm); setFormErrors({}); setIsModalOpen(true); };
  const openEdit = (item: Review) => { setEditingItem(item); setForm({ name: item.name, rating: item.rating, text: item.text, date: item.date }); setFormErrors({}); setIsModalOpen(true); };

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Nama harus diisi';
    if (!form.text.trim()) e.text = 'Ulasan harus diisi';
    if (!form.date.trim()) e.date = 'Tanggal harus diisi';
    if (form.rating < 1 || form.rating > 5) e.rating = 'Rating 1-5';
    setFormErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    if (editingItem) {
      setReviews(reviews.map((r) => r.id === editingItem.id ? { ...form, id: editingItem.id } : r));
    } else {
      const newId = Math.max(...reviews.map((r) => r.id), 0) + 1;
      setReviews([...reviews, { ...form, id: newId }]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => { if (deleteTarget) { setReviews(reviews.filter((r) => r.id !== deleteTarget.id)); setDeleteTarget(null); } };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-900">Manajemen Ulasan</h1>
        <Button onClick={openAdd}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
          Tambah Ulasan
        </Button>
      </div>

      {reviews.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Ulasan</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {reviews.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3"><p className="font-medium text-gray-900 text-sm">{r.name}</p></td>
                    <td className="px-4 py-3"><StarRating rating={r.rating} size="sm" /></td>
                    <td className="px-4 py-3 hidden md:table-cell"><p className="text-sm text-gray-500 line-clamp-1 max-w-[250px]">{r.text}</p></td>
                    <td className="px-4 py-3"><span className="text-xs text-gray-500">{r.date}</span></td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(r)} className="p-2 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center" title="Edit"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg></button>
                        <button onClick={() => setDeleteTarget(r)} className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center" title="Hapus"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl shadow-md">
          <span className="text-4xl mb-3 block">⭐</span>
          <p className="text-gray-500 mb-4">Belum ada ulasan.</p>
          <Button size="sm" onClick={openAdd}>Tambah Ulasan Pertama</Button>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Ulasan' : 'Tambah Ulasan Baru'} size="md">
        <div className="space-y-4">
          <Input id="rev-name" label="Nama" value={form.name} onChange={(e) => { setForm((p) => ({ ...p, name: e.target.value })); if (formErrors.name) setFormErrors((p) => ({ ...p, name: '' })); }} error={formErrors.name} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <button key={s} type="button" onClick={() => setForm((p) => ({ ...p, rating: s }))} className="min-h-[44px] min-w-[44px] flex items-center justify-center">
                  <svg className={`h-7 w-7 transition-colors ${s <= form.rating ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'}`} viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                </button>
              ))}
            </div>
            {formErrors.rating && <p className="mt-1 text-sm text-red-500">{formErrors.rating}</p>}
          </div>
          <Textarea id="rev-text" label="Ulasan" value={form.text} onChange={(e) => { setForm((p) => ({ ...p, text: e.target.value })); if (formErrors.text) setFormErrors((p) => ({ ...p, text: '' })); }} error={formErrors.text} />
          <Input id="rev-date" label="Tanggal (contoh: 15 Mei 2026)" value={form.date} onChange={(e) => { setForm((p) => ({ ...p, date: e.target.value })); if (formErrors.date) setFormErrors((p) => ({ ...p, date: '' })); }} error={formErrors.date} placeholder="15 Juni 2026" />
          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave} className="flex-1">{editingItem ? 'Simpan' : 'Tambah'}</Button>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="flex-1">Batal</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Hapus Ulasan" size="sm">
        <p className="text-gray-600 mb-6">Yakin ingin menghapus ulasan dari <strong>{deleteTarget?.name}</strong>?</p>
        <div className="flex gap-3">
          <Button variant="danger" onClick={handleDelete} className="flex-1">Ya, Hapus</Button>
          <Button variant="ghost" onClick={() => setDeleteTarget(null)} className="flex-1">Batal</Button>
        </div>
      </Modal>
    </div>
  );
}
