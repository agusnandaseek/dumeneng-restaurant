'use client';

import { useState, useEffect, useRef } from 'react';
import type { GalleryItem } from '@/types';

interface GallerySectionProps {
  gallery: GalleryItem[];
}

function GalleryCard({
  photo,
  index,
  onClick,
}: {
  photo: GalleryItem;
  index: number;
  onClick: () => void;
}) {
  const ref = useRef<HTMLButtonElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.unobserve(el);
  }, []);

  return (
    <button
      ref={ref}
      onClick={onClick}
      className={`group relative aspect-square rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 ${
        visible ? 'animate-fade-in-up' : 'opacity-0'
      }`}
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <img
        src={photo.imageUrl}
        alt={photo.caption}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
        <p className="text-white text-xs font-medium text-left line-clamp-2">
          {photo.caption}
        </p>
      </div>
      {/* Zoom icon */}
      <div className="absolute top-2 right-2 bg-white/90 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-md">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-gray-700"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </button>
  );
}

export default function GallerySection({ gallery }: GallerySectionProps) {
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryItem | null>(null);

  if (gallery.length === 0) {
    return (
      <section id="gallery" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-3">
            Galeri
          </h2>
          <p className="text-gray-400 mt-8">Belum ada foto galeri</p>
        </div>
      </section>
    );
  }

  return (
    <section id="gallery" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-3">
            Galeri
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Suasana nyaman dan instagramable untuk setiap momen spesial Anda
          </p>
        </div>

        {/* Photo Grid — 2 cols on mobile, 3 on lg */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {gallery.map((photo, i) => (
            <GalleryCard
              key={photo.id}
              photo={photo}
              index={i}
              onClick={() => setSelectedPhoto(photo)}
            />
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="relative z-10 max-w-4xl w-full animate-[fadeIn_0.2s_ease-out]">
            <img
              src={selectedPhoto.imageUrl}
              alt={selectedPhoto.caption}
              className="w-full rounded-2xl shadow-2xl"
            />
            <p className="text-white text-center mt-4 font-medium">
              {selectedPhoto.caption}
            </p>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedPhoto(null);
              }}
              className="absolute -top-12 right-0 text-white/80 hover:text-white p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
