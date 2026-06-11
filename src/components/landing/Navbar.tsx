'use client';

import { useState, useEffect, useCallback } from 'react';
import type { RestaurantProfile } from '@/types';
import { scrollToSection } from '@/lib/utils';
import Button from '@/components/ui/Button';

interface NavbarProps {
  profile: RestaurantProfile;
}

const navLinks = [
  { id: 'menu', label: 'Menu' },
  { id: 'gallery', label: 'Galeri' },
  { id: 'location', label: 'Lokasi' },
  { id: 'reviews', label: 'Ulasan' },
  { id: 'reservation', label: 'Reservasi' },
];

const NAV_HEIGHT = 80; // offset for fixed navbar

export default function Navbar({ profile }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  // Smooth scroll to section
  const handleNavClick = useCallback((id: string) => {
    setIsMobileMenuOpen(false);
    scrollToSection(id);
  }, []);

  // Track scroll position + active section via IntersectionObserver
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    // IntersectionObserver for active section tracking
    const sectionIds = navLinks.map((l) => l.id);
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        {
          // Trigger when section enters the top area (accounting for navbar)
          rootMargin: `-${NAV_HEIGHT}px 0px -60% 0px`,
          threshold: 0,
        }
      );
      observer.observe(el);
      observers.push(observer);
    });

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      observers.forEach((o) => o.disconnect());
    };
  }, []);


  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-sm shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <button
            onClick={() => handleNavClick('top')}
            className={`text-2xl font-display font-bold transition-colors ${
              isScrolled ? 'text-primary-600' : 'text-white'
            }`}
          >
            {profile.name}
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-0">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 min-h-[44px] ${
                    isScrolled
                      ? isActive
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                      : isActive
                        ? 'text-white bg-white/15'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {link.label}
                  {/* Active indicator dot */}
                  {isActive && (
                    <span
                      className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full transition-colors ${
                        isScrolled ? 'bg-primary-500' : 'bg-white'
                      }`}
                    />
                  )}
                </button>
              );
            })}
            <Button
              size="sm"
              onClick={() => handleNavClick('reservation')}
              className="ml-3"
            >
              Reservasi
            </Button>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center ${
              isScrolled ? 'text-gray-600' : 'text-white'
            }`}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t shadow-xl animate-[fadeIn_0.2s_ease-out]">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`block w-full text-left px-4 py-3 rounded-lg font-medium transition-all duration-200 min-h-[44px] ${
                    isActive
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-gray-700 hover:bg-primary-50 hover:text-primary-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
                    )}
                    {link.label}
                  </div>
                </button>
              );
            })}
            <Button
              className="w-full mt-3"
              onClick={() => handleNavClick('reservation')}
            >
              Reservasi Sekarang
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
