'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useData } from '@/contexts/DataContext';
import Button from '@/components/ui/Button';

export default function SettingsForm() {
  const { user, role } = useAuth();
  const { resetAll } = useData();
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [resetConfirm, setResetConfirm] = useState(false);

  const handleResetData = async () => {
    try {
      await resetAll();
      setResetConfirm(false);
      setMessage({ type: 'success', text: 'Semua data telah dikembalikan ke pengaturan awal.' });
    } catch {
      setMessage({ type: 'error', text: 'Gagal mereset data. Coba lagi.' });
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-gray-900 mb-6">Pengaturan</h1>

      {message && (
        <div className={`mb-6 rounded-xl px-4 py-3 text-sm animate-slide-up flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-600'}`}>
          {message.type === 'success' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
          )}
          {message.text}
        </div>
      )}

      {/* Account Info */}
      <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 mb-6">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Informasi Akun</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Email</span>
            <span className="font-medium text-gray-900">{user?.email || '-'}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-gray-100">
            <span className="text-gray-500">Role</span>
            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${role === 'admin' ? 'bg-primary-100 text-primary-700' : 'bg-secondary-100 text-secondary-700'}`}>
              {role === 'admin' ? 'Admin (Akses Penuh)' : 'Staff (Reservasi Saja)'}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-500">Manajemen User</span>
            <span className="text-gray-400 text-xs">
              {role === 'admin' ? 'Gunakan halaman Pengguna untuk menambah/menghapus akun' : 'Hanya Admin yang dapat mengelola user'}
            </span>
          </div>
        </div>
      </div>

      {/* Data Reset */}
      <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 border border-red-200">
        <h2 className="text-lg font-bold text-red-700 mb-1">Reset Semua Data</h2>
        <p className="text-sm text-gray-500 mb-6">
          Mengembalikan semua data (profil, menu, galeri, ulasan) ke pengaturan awal. Reservasi yang ada akan dihapus. Tindakan ini tidak dapat dikembalikan.
        </p>
        {!resetConfirm ? (
          <Button variant="danger" onClick={() => setResetConfirm(true)}>Reset Semua Data</Button>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3 items-start">
            <Button variant="danger" onClick={handleResetData}>Ya, Reset Semua Data</Button>
            <Button variant="ghost" onClick={() => setResetConfirm(false)}>Batal</Button>
          </div>
        )}
      </div>
    </div>
  );
}
