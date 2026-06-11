'use client';

import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import type { MenuItem, MenuCategory } from '@/types';
import { formatCurrency } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import ImageUpload from '@/components/ui/ImageUpload';
import Modal from '@/components/ui/Modal';

const CATEGORIES: MenuCategory[] = ['Makanan', 'Minuman', 'Dessert'];

const emptyForm: Omit<MenuItem, 'id'> = {
  name: '',
  category: 'Makanan',
  description: '',
  price: 0,
  imageUrl: '',
  isAvailable: true,
};

export default function MenuManager() {
  const { menus, setMenus } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MenuItem | null>(null);
  const [form, setForm] = useState<Omit<MenuItem, 'id'>>(emptyForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const openAdd = () => {
    setEditingItem(null);
    setForm(emptyForm);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEdit = (item: MenuItem) => {
    setEditingItem(item);
    setForm({
      name: item.name,
      category: item.category,
      description: item.description,
      price: item.price,
      imageUrl: item.imageUrl,
      isAvailable: item.isAvailable,
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateForm = (): boolean => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Nama menu harus diisi';
    if (!form.description.trim()) errs.description = 'Deskripsi harus diisi';
    if (!form.price || form.price <= 0) errs.price = 'Harga harus lebih dari 0';
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    if (editingItem) {
      setMenus(
        menus.map((m) =>
          m.id === editingItem.id ? { ...form, id: editingItem.id } : m
        )
      );
    } else {
      const newId = Math.max(...menus.map((m) => m.id), 0) + 1;
      setMenus([...menus, { ...form, id: newId }]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setMenus(menus.filter((m) => m.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-900">
          Manajemen Menu
        </h1>
        <Button onClick={openAdd}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Tambah Menu
        </Button>
      </div>

      {/* Table */}
      {menus.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Foto</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Kategori</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Harga</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Status</th>
                  <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {menus.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center text-gray-400 text-xs">No img</div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-900 text-sm">{item.name}</p>
                      <p className="text-xs text-gray-500 line-clamp-1 mt-0.5 max-w-[200px]">{item.description}</p>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">{item.category}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-gray-900 text-sm">{formatCurrency(item.price)}</span>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {item.isAvailable ? (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Tersedia</span>
                      ) : (
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">Habis</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(item)} className="p-2 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center" title="Edit">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                        <button onClick={() => setDeleteTarget(item)} className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center" title="Hapus">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
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
          <span className="text-4xl mb-3 block">🍽️</span>
          <p className="text-gray-500 mb-4">Belum ada menu.</p>
          <Button size="sm" onClick={openAdd}>Tambah Menu Pertama</Button>
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem ? 'Edit Menu' : 'Tambah Menu Baru'} size="lg">
        <div className="space-y-4">
          <Input
            id="menu-name"
            label="Nama Menu"
            value={form.name}
            onChange={(e) => { setForm((p) => ({ ...p, name: e.target.value })); if (formErrors.name) setFormErrors((p) => ({ ...p, name: '' })); }}
            error={formErrors.name}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Kategori</label>
            <div className="flex gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, category: cat }))}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${form.category === cat ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <Textarea
            id="menu-desc"
            label="Deskripsi"
            value={form.description}
            onChange={(e) => { setForm((p) => ({ ...p, description: e.target.value })); if (formErrors.description) setFormErrors((p) => ({ ...p, description: '' })); }}
            error={formErrors.description}
          />
          <Input
            id="menu-price"
            label="Harga (Rp)"
            type="number"
            min="0"
            value={form.price || ''}
            onChange={(e) => { setForm((p) => ({ ...p, price: parseInt(e.target.value) || 0 })); if (formErrors.price) setFormErrors((p) => ({ ...p, price: '' })); }}
            error={formErrors.price}
          />
          <ImageUpload label="Foto Menu" value={form.imageUrl} onChange={(url) => setForm((p) => ({ ...p, imageUrl: url }))} />
          <label className="flex items-center gap-3 cursor-pointer py-2">
            <input type="checkbox" checked={form.isAvailable} onChange={(e) => setForm((p) => ({ ...p, isAvailable: e.target.checked }))} className="w-5 h-5 rounded border-gray-300 text-primary-500 focus:ring-primary-400" />
            <span className="text-sm font-medium text-gray-700">Tersedia</span>
          </label>
          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave} className="flex-1">{editingItem ? 'Simpan Perubahan' : 'Tambah Menu'}</Button>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="flex-1">Batal</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Hapus Menu" size="sm">
        <p className="text-gray-600 mb-6">
          Yakin ingin menghapus menu <strong className="text-gray-900">&quot;{deleteTarget?.name}&quot;</strong>?
        </p>
        <div className="flex gap-3">
          <Button variant="danger" onClick={handleDelete} className="flex-1">Ya, Hapus</Button>
          <Button variant="ghost" onClick={() => setDeleteTarget(null)} className="flex-1">Batal</Button>
        </div>
      </Modal>
    </div>
  );
}
