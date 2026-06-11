import type { ReservationFormData } from '@/types';

export function formatReservationMessage(
  data: ReservationFormData,
  restaurantName: string
): string {
  const lines = [
    `Halo, saya ingin reservasi meja di ${restaurantName}.`,
    '',
    '--- Detail Reservasi ---',
    `Nama: ${data.name}`,
    `Jumlah Tamu: ${data.guests} orang`,
    `Tanggal: ${data.date}`,
    `Waktu: ${data.time}`,
    `Catatan: ${data.notes || '-'}`,
    '',
    'Terima kasih.',
  ];
  return lines.join('\n');
}

export function getWhatsAppLink(phoneNumber: string, message: string): string {
  const cleaned = phoneNumber.replace(/[^0-9]/g, '');
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${cleaned}?text=${encoded}`;
}
