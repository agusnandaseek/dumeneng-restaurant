import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import { DataProvider } from '@/contexts/DataContext';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "D'Umeneng — Restoran Istimewa di Yogyakarta",
  description:
    "Nikmati hidangan istimewa dalam suasana teduh di D'Umeneng, Yogyakarta. Reservasi meja mudah via WhatsApp!",
  keywords: 'restoran, jogja, yogyakarta, kuliner, nasi goreng, sate, makan malam',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body
        className={`${inter.variable} ${playfair.variable} font-body antialiased text-gray-900 bg-white`}
      >
        <DataProvider>
          <AuthProvider>{children}</AuthProvider>
        </DataProvider>
      </body>
    </html>
  );
}
