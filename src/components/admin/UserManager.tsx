'use client';

import { useState, useEffect } from 'react';
import { useAuth, AdminRole } from '@/contexts/AuthContext';
import { collection, getDocs, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Modal from '@/components/ui/Modal';

interface AdminUser {
  uid: string;
  email: string;
  role: AdminRole;
  createdAt: string;
}

export default function UserManager() {
  const { role: currentRole } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AdminUser | null>(null);
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState<AdminRole>('user');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Subscribe to admins collection
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'admins'), (snap) => {
      setUsers(snap.docs.map((d) => ({ uid: d.id, ...d.data() } as AdminUser)));
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formEmail.trim() || !formPassword.trim()) {
      setError('Email dan password harus diisi');
      return;
    }
    if (formPassword.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    try {
      // Create Firebase Auth user
      const userCred = await createUserWithEmailAndPassword(auth, formEmail.trim(), formPassword);

      // Save to admins collection
      await setDoc(doc(db, 'admins', userCred.user.uid), {
        email: formEmail.trim(),
        role: formRole,
        createdAt: new Date().toISOString(),
      });

      // Sign back in as current admin (creating a user switches the auth state)
      // The onAuthStateChanged will handle this

      setSuccess(`User ${formEmail} berhasil dibuat!`);
      setFormEmail('');
      setFormPassword('');
      setFormRole('user');
      setIsModalOpen(false);
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        setError('Email sudah digunakan');
      } else {
        setError(err.message || 'Gagal membuat user');
      }
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteDoc(doc(db, 'admins', deleteTarget.uid));
      // Note: This only removes from Firestore. Actual Firebase Auth user deletion requires Admin SDK (API route).
      // For now, the user won't be able to login because the admins collection check will fail.
      setDeleteTarget(null);
    } catch {
      setError('Gagal menghapus user');
    }
  };

  if (currentRole !== 'admin') return null;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Manajemen Pengguna</h1>
          <p className="text-sm text-gray-500 mt-1">Kelola akun admin dan staff</p>
        </div>
        <Button onClick={() => { setFormEmail(''); setFormPassword(''); setFormRole('user'); setError(''); setIsModalOpen(true); }}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg>
          Tambah User
        </Button>
      </div>

      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm animate-slide-up">{success}</div>
      )}

      {loading ? (
        <div className="text-center py-16 text-gray-400">Memuat...</div>
      ) : users.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <table className="w-full">
            <thead><tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Role</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Dibuat</th>
              <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Aksi</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((u) => (
                <tr key={u.uid} className="hover:bg-gray-50/50">
                  <td className="px-4 py-3 font-medium text-sm">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${u.role === 'admin' ? 'bg-primary-100 text-primary-700' : 'bg-secondary-100 text-secondary-700'}`}>
                      {u.role === 'admin' ? 'Admin' : 'Staff'}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-sm text-gray-500">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString('id-ID') : '-'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setDeleteTarget(u)} className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors min-h-[44px] min-w-[44px]" title="Hapus">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl shadow-md">
          <span className="text-4xl mb-3 block">👥</span>
          <p className="text-gray-500">Belum ada user terdaftar.</p>
        </div>
      )}

      {/* Add User Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Tambah User Baru" size="md">
        <form onSubmit={handleCreateUser} className="space-y-4">
          {error && <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 border border-red-200">{error}</div>}
          <Input id="user-email" label="Email" type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} placeholder="staff@dumeneng.com" required />
          <Input id="user-pw" label="Password" type="password" value={formPassword} onChange={(e) => setFormPassword(e.target.value)} placeholder="Minimal 6 karakter" required />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <div className="flex gap-2">
              {(['admin', 'user'] as AdminRole[]).map((r) => (
                <button key={r} type="button" onClick={() => setFormRole(r)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors min-h-[44px] ${formRole === r ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {r === 'admin' ? '🔑 Admin' : '👤 Staff'}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-1.5">
              {formRole === 'admin' ? 'Admin: akses penuh ke semua fitur' : 'Staff: hanya bisa mengakses tab Reservasi'}
            </p>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit" className="flex-1">Buat User</Button>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="flex-1">Batal</Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Hapus User" size="sm">
        <p className="text-gray-600 mb-6">Yakin ingin menghapus user <strong>{deleteTarget?.email}</strong>?</p>
        <div className="flex gap-3">
          <Button variant="danger" onClick={handleDelete} className="flex-1">Ya, Hapus</Button>
          <Button variant="ghost" onClick={() => setDeleteTarget(null)} className="flex-1">Batal</Button>
        </div>
      </Modal>
    </div>
  );
}
