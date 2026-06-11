'use client';

import { useState } from 'react';
import type { RestaurantProfile } from '@/types';

interface LocationSectionProps {
  profile: RestaurantProfile;
}

export default function LocationSection({ profile }: LocationSectionProps) {
  const [mapError, setMapError] = useState(false);

  return (
    <section id="location" className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-3">
            Lokasi
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Kunjungi kami di lokasi strategis dengan akses mudah dan parkiran luas
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Info Card */}
          <div className="lg:col-span-2 space-y-6">
            {/* Address */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-start gap-4">
                <div className="bg-primary-100 rounded-xl p-3 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Alamat</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{profile.address}</p>
                  <a
                    href={`https://www.google.com/maps/search/${encodeURIComponent(profile.name + ' ' + profile.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-2 text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
                  >
                    Buka di Google Maps
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="bg-white rounded-2xl shadow-md p-6">
              <div className="flex items-start gap-4">
                <div className="bg-secondary-100 rounded-xl p-3 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Jam Buka</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{profile.operationalHours}</p>
                </div>
              </div>
            </div>

            {/* WhatsApp Quick Contact */}
            <a
              href={`https://wa.me/${profile.whatsappNumber.replace(/[^0-9]/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-green-500 hover:bg-green-600 text-white rounded-2xl shadow-md p-6 transition-all duration-200 hover:shadow-lg"
            >
              <div className="flex items-center gap-4">
                <div className="bg-white/20 rounded-xl p-3 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold mb-0.5">Chat via WhatsApp</h3>
                  <p className="text-sm opacity-90">Tanya atau reservasi langsung</p>
                </div>
              </div>
            </a>
          </div>

          {/* Map Embed */}
          <div className="lg:col-span-3">
            <div className="rounded-2xl overflow-hidden shadow-lg bg-gray-200 min-h-[400px] relative">
              {!mapError ? (
                <iframe
                  src={profile.mapsEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: 400 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lokasi D'Umeneng Warung"
                  className="w-full h-full"
                  onError={() => setMapError(true)}
                  onLoad={(e) => {
                    // Google Maps doesn't fire onError for embed rejections.
                    // Fallback: if loaded content is blank after short delay, show error.
                    const iframe = e.currentTarget;
                    setTimeout(() => {
                      try {
                        if (iframe.contentDocument?.body?.innerHTML === '') {
                          setMapError(true);
                        }
                      } catch {
                        // Cross-origin — can't check. Keep showing.
                      }
                    }, 2000);
                  }}
                />
              ) : (
                /* Fallback when map fails */
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gradient-to-br from-gray-100 to-gray-200">
                  <div className="bg-white rounded-2xl shadow-lg p-8 max-w-sm w-full">
                    <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{profile.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{profile.address}</p>
                    <p className="text-xs text-gray-400 mb-6">{profile.operationalHours}</p>
                    <a
                      href={`https://www.google.com/maps/search/${encodeURIComponent(profile.name + ' ' + profile.address)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors shadow-md"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      Buka di Google Maps
                    </a>
                    <p className="text-xs text-gray-400 mt-4">
                      Peta interaktif tidak dapat dimuat di sini.
                      <br />
                      Klik tombol di atas untuk melihat lokasi kami.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
