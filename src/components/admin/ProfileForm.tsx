'use client';

import { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import type { RestaurantProfile } from '@/types';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import ImageUpload from '@/components/ui/ImageUpload';
import Button from '@/components/ui/Button';

export default function ProfileForm() {
  const { profile, setProfile } = useData();
  const [form, setForm] = useState<RestaurantProfile>({ ...profile });
  const [saved, setSaved] = useState(false);

  const handleChange = (field: keyof RestaurantProfile, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    setProfile(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleReset = () => {
    setForm({ ...profile });
    setSaved(false);
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-display font-bold text-gray-900">Profil Restoran</h1>
        <div className="flex gap-3">
          <Button variant="outline" size="sm" onClick={handleReset}>Reset</Button>
          <Button size="sm" onClick={handleSave}>Simpan Perubahan</Button>
        </div>
      </div>

      {saved && (
        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm animate-slide-up flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Data berhasil disimpan ke localStorage!
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-md p-6 md:p-8 space-y-5">
        <Input id="prof-name" label="Nama Restoran" value={form.name} onChange={(e) => handleChange('name', e.target.value)} required />
        <Input id="prof-slogan" label="Slogan" value={form.slogan} onChange={(e) => handleChange('slogan', e.target.value)} required />
        <Textarea id="prof-address" label="Alamat" value={form.address} onChange={(e) => handleChange('address', e.target.value)} required />
        <Input id="prof-wa" label="Nomor WhatsApp (format internasional, contoh: 6281234567890)" value={form.whatsappNumber} onChange={(e) => handleChange('whatsappNumber', e.target.value)} required />
        <Input id="prof-hours" label="Jam Operasional" value={form.operationalHours} onChange={(e) => handleChange('operationalHours', e.target.value)} placeholder="Contoh: Senin - Minggu, 10:00 - 22:00 WIB" required />
        <Textarea id="prof-maps" label="Google Maps Embed URL" value={form.mapsEmbedUrl} onChange={(e) => handleChange('mapsEmbedUrl', e.target.value)} required />
        <ImageUpload label="Gambar Hero (Background)" value={form.heroImageUrl} onChange={(url) => handleChange('heroImageUrl', url)} />
        <Input id="prof-hero" label="Atau URL Gambar Hero" value={form.heroImageUrl} onChange={(e) => handleChange('heroImageUrl', e.target.value)} placeholder="https://placehold.co/1920x1080/..." />
      </div>
    </div>
  );
}
