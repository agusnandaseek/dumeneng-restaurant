'use client';

import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

export default function ReservationManager() {
  const { reservations, deleteReservation } = useData();
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const [filterDate, setFilterDate] = useState('');

  const filtered = filterDate
    ? reservations.filter((r) => r.date === filterDate)
    : reservations;

  // Sort newest first
  const sorted = [...filtered].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const formatDateTime = (iso: string) => {
    const d = new Date(iso);
    return d.toLocaleString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const uniqueDates = [...new Set(reservations.map((r) => r.date))].sort();

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Data Reservasi</h1>
          <p className="text-sm text-gray-500 mt-1">
            Total: {reservations.length} reservasi
          </p>
        </div>
      </div>

      {/* Date filter */}
      {uniqueDates.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setFilterDate('')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors min-h-[44px] ${!filterDate ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border'}`}
          >
            Semua
          </button>
          {uniqueDates.map((d) => (
            <button
              key={d}
              onClick={() => setFilterDate(d)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors min-h-[44px] ${filterDate === d ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-100 border'}`}
            >
              {d}
            </button>
          ))}
        </div>
      )}

      {sorted.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Nama</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tamu</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tanggal</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Waktu</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Catatan</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Dibuat</th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {sorted.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3"><p className="font-medium text-gray-900 text-sm">{r.name}</p></td>
                    <td className="px-4 py-3 text-center"><span className="text-sm text-gray-700">{r.guests}</span></td>
                    <td className="px-4 py-3"><span className="text-sm text-gray-700">{r.date}</span></td>
                    <td className="px-4 py-3"><span className="text-sm text-gray-700">{r.time}</span></td>
                    <td className="px-4 py-3 hidden md:table-cell"><p className="text-sm text-gray-500 line-clamp-1 max-w-[180px]">{r.notes || '-'}</p></td>
                    <td className="px-4 py-3 hidden lg:table-cell"><span className="text-xs text-gray-400">{formatDateTime(r.createdAt)}</span></td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setDeleteTarget(r.id)} className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center" title="Hapus">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl shadow-md">
          <span className="text-4xl mb-3 block">📋</span>
          <p className="text-gray-500 mb-1">{reservations.length === 0 ? 'Belum ada reservasi.' : 'Tidak ada reservasi untuk tanggal ini.'}</p>
          <p className="text-sm text-gray-400">Reservasi akan muncul saat pelanggan mengisi form reservasi di landing page.</p>
        </div>
      )}

      <Modal isOpen={deleteTarget !== null} onClose={() => setDeleteTarget(null)} title="Hapus Reservasi" size="sm">
        <p className="text-gray-600 mb-6">Yakin ingin menghapus reservasi ini?</p>
        <div className="flex gap-3">
          <Button variant="danger" onClick={() => { if (deleteTarget !== null) { deleteReservation(deleteTarget); setDeleteTarget(null); } }} className="flex-1">Ya, Hapus</Button>
          <Button variant="ghost" onClick={() => setDeleteTarget(null)} className="flex-1">Batal</Button>
        </div>
      </Modal>
    </div>
  );
}
