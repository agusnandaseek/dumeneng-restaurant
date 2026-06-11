'use client';

import { useState, useMemo } from 'react';
import type { RestaurantProfile } from '@/types';
import { useData } from '@/contexts/DataContext';
import { formatReservationMessage, getWhatsAppLink } from '@/lib/whatsapp';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';

interface ReservationSectionProps {
  profile: RestaurantProfile;
}

interface FormErrors {
  name?: string;
  guests?: string;
  date?: string;
  time?: string;
}

export default function ReservationSection({ profile }: ReservationSectionProps) {
  const { addReservation } = useData();
  const [name, setName] = useState('');
  const [guests, setGuests] = useState('2');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  // Get today's date string in YYYY-MM-DD format for min attribute
  const todayStr = useMemo(() => {
    const d = new Date();
    return d.toISOString().split('T')[0];
  }, []);

  const validate = (): boolean => {
    const errs: FormErrors = {};

    if (!name.trim()) {
      errs.name = 'Nama harus diisi';
    }

    const guestNum = parseInt(guests, 10);
    if (!guests || isNaN(guestNum) || guestNum < 1) {
      errs.guests = 'Minimal 1 tamu';
    } else if (guestNum > 50) {
      errs.guests = 'Maksimal 50 tamu — untuk acara besar, hubungi kami langsung';
    }

    if (!date) {
      errs.date = 'Tanggal harus diisi';
    } else if (date < todayStr) {
      errs.date = 'Tanggal tidak boleh di masa lalu';
    }

    if (!time) {
      errs.time = 'Waktu harus diisi';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(false);

    if (!validate()) return;

    const message = formatReservationMessage(
      {
        name: name.trim(),
        guests: parseInt(guests, 10),
        date,
        time,
        notes,
      },
      profile.name
    );

    const link = getWhatsAppLink(profile.whatsappNumber, message);
    setSubmitted(true);

    // Save to reservation records (Firestore)
    const reservationData = {
      name: name.trim(),
      guests: parseInt(guests, 10),
      date,
      time,
      notes,
    };
    addReservation(reservationData);

    // Sync to Google Calendar (fire-and-forget)
    fetch('/api/reservations/sync-calendar', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reservationData),
    }).catch(() => {}); // silently fail — calendar sync is optional

    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="reservation" className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-3">
            Reservasi Meja
          </h2>
          <p className="text-gray-500">
            Isi form di bawah dan kami akan menerima pesan reservasi Anda melalui WhatsApp
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          {submitted ? (
            /* Success State */
            <div className="text-center py-8 animate-slide-up">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-600"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Berhasil!
              </h3>
              <p className="text-gray-500 mb-6">
                WhatsApp akan terbuka dengan pesan reservasi yang sudah terformat.
                <br />
                <span className="text-sm text-gray-400">
                  Jika tidak terbuka, klik tombol di bawah.
                </span>
              </p>
              <Button
                variant="outline"
                onClick={() => setSubmitted(false)}
              >
                Kirim Reservasi Baru
              </Button>
            </div>
          ) : (
            /* Form */
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <Input
                id="res-name"
                label="Nama Lengkap"
                placeholder="Contoh: Budi Santoso"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((p) => ({ ...p, name: undefined }));
                }}
                error={errors.name}
                required
              />

              <Input
                id="res-guests"
                label="Jumlah Tamu"
                type="number"
                min="1"
                max="50"
                placeholder="2"
                value={guests}
                onChange={(e) => {
                  setGuests(e.target.value);
                  if (errors.guests) setErrors((p) => ({ ...p, guests: undefined }));
                }}
                error={errors.guests}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <Input
                  id="res-date"
                  label="Tanggal"
                  type="date"
                  min={todayStr}
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    if (errors.date) setErrors((p) => ({ ...p, date: undefined }));
                  }}
                  error={errors.date}
                  required
                />

                <Input
                  id="res-time"
                  label="Waktu"
                  type="time"
                  value={time}
                  onChange={(e) => {
                    setTime(e.target.value);
                    if (errors.time) setErrors((p) => ({ ...p, time: undefined }));
                  }}
                  error={errors.time}
                  required
                />
              </div>

              <Textarea
                id="res-notes"
                label="Catatan Khusus (opsional)"
                placeholder="Contoh: Minta area outdoor, alergi kacang, dll."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />

              <Button type="submit" size="lg" className="w-full mt-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
                </svg>
                Kirim via WhatsApp
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
