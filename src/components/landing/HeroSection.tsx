'use client';

import type { RestaurantProfile } from '@/types';
import { scrollToSection } from '@/lib/utils';
import Button from '@/components/ui/Button';

interface HeroSectionProps {
  profile: RestaurantProfile;
}

export default function HeroSection({ profile }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient overlay (fallback if image fails) */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-secondary-900" />

      {/* Background Image */}
      <img
        src={profile.heroImageUrl}
        alt={profile.name}
        className="absolute inset-0 w-full h-full object-cover opacity-50"
      />

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-white mb-4 leading-tight">
          {profile.name}
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-white/80 font-light mb-8 max-w-2xl mx-auto">
          {profile.slogan}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" onClick={() => scrollToSection('reservation')}>
            Reservasi Sekarang
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-white/40 text-white hover:bg-white/10 hover:border-white/60"
            onClick={() => scrollToSection('menu')}
          >
            Lihat Menu
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <button
        onClick={() => scrollToSection('menu')}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/60 hover:text-white transition-colors animate-bounce"
        aria-label="Scroll ke bawah"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-8 w-8"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </button>
    </section>
  );
}
