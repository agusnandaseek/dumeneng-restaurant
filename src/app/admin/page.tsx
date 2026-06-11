'use client';

import { useData } from '@/contexts/DataContext';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const { menus, gallery, reviews, reservations } = useData();

  const statLinks = [
    { href: '/admin/menu', label: 'Total Menu', value: menus.length, color: 'bg-primary-50 text-primary-700 border-primary-200', icon: '🍛' },
    { href: '/admin/gallery', label: 'Total Foto', value: gallery.length, color: 'bg-secondary-50 text-secondary-700 border-secondary-200', icon: '📷' },
    { href: '/admin/reviews', label: 'Ulasan', value: reviews.length, color: 'bg-amber-50 text-amber-700 border-amber-200', icon: '⭐' },
    { href: '/admin/reservations', label: 'Reservasi Masuk', value: reservations.length, color: 'bg-green-50 text-green-700 border-green-200', icon: '📋' },
  ];

  const quickActions = [
    { href: '/admin/menu', label: 'Kelola Menu', desc: 'Tambah, edit, atau hapus menu', icon: '🍛' },
    { href: '/admin/gallery', label: 'Kelola Galeri', desc: 'Upload atau hapus foto', icon: '📷' },
    { href: '/admin/reviews', label: 'Kelola Ulasan', desc: 'Tambah atau hapus ulasan', icon: '⭐' },
    { href: '/admin/reservations', label: 'Lihat Reservasi', desc: 'Data reservasi pelanggan', icon: '📋' },
    { href: '/admin/profile', label: 'Edit Profil', desc: 'Ubah info restoran', icon: '🏠' },
    { href: '/admin/settings', label: 'Pengaturan', desc: 'Username & password', icon: '⚙️' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-display font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {statLinks.map((stat) => (
          <Link key={stat.label} href={stat.href} className={`rounded-2xl border p-5 transition-all duration-200 hover:shadow-md ${stat.color}`}>
            <div className="flex items-center gap-2 mb-2"><span className="text-xl">{stat.icon}</span><p className="text-xs font-medium opacity-75">{stat.label}</p></div>
            <p className="text-2xl font-bold">{stat.value}</p>
          </Link>
        ))}
      </div>

      <h2 className="text-lg font-bold text-gray-900 mb-4">Aksi Cepat</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quickActions.map((a) => (
          <Link key={a.href} href={a.href} className="bg-white rounded-2xl border border-gray-200 p-5 hover:shadow-md hover:border-primary-200 transition-all duration-200">
            <span className="text-2xl mb-2 block">{a.icon}</span>
            <h3 className="font-semibold text-gray-900 mb-1">{a.label}</h3>
            <p className="text-sm text-gray-500">{a.desc}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 bg-blue-50 border border-blue-200 rounded-2xl p-5">
        <div className="flex items-start gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
          <div>
            <p className="text-sm font-medium text-blue-800 mb-1">Data Tersimpan di Browser</p>
            <p className="text-sm text-blue-600">Semua perubahan (menu, galeri, ulasan, profil) disimpan di localStorage. Reservasi juga tercatat. Gunakan Reset di Pengaturan untuk mengembalikan data awal.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
