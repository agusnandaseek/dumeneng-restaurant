'use client';

import { useState, useRef, useEffect } from 'react';
import type { MenuItem, MenuCategory } from '@/types';
import { formatCurrency } from '@/lib/utils';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface MenuSectionProps {
  menus: MenuItem[];
}

const categories: { key: MenuCategory; label: string; icon: string }[] = [
  { key: 'Makanan', label: 'Makanan', icon: '🍛' },
  { key: 'Minuman', label: 'Minuman', icon: '🍹' },
  { key: 'Dessert', label: 'Dessert', icon: '🍰' },
];

function MenuCard({ item, index }: { item: MenuItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
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
    <div
      ref={ref}
      className={`${visible ? 'animate-fade-in-up' : 'opacity-0'}`}
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <Card hover className="flex flex-col h-full">
        <div className="relative aspect-[3/2] overflow-hidden">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          {!item.isAvailable && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-bold text-lg bg-red-500/90 px-4 py-1.5 rounded-full">
                Habis
              </span>
            </div>
          )}
        </div>
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
            <span className="text-lg font-bold text-primary-600 whitespace-nowrap">
              {formatCurrency(item.price)}
            </span>
          </div>
          <p className="text-sm text-gray-500 line-clamp-2 flex-1">
            {item.description}
          </p>
        </div>
      </Card>
    </div>
  );
}

export default function MenuSection({ menus }: MenuSectionProps) {
  const [activeCategory, setActiveCategory] = useState<MenuCategory>('Makanan');
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const filteredMenus = menus.filter((m) => m.category === activeCategory);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      // Scroll to the menu content after it opens
      setTimeout(() => {
        contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  };

  return (
    <section id="menu" className="py-16 md:py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-3">
            Menu Kami
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto mb-8">
            Hidangan istimewa yang dibuat dengan bahan segar dan resep turun-temurun
          </p>

          {/* CTA Button — toggles menu visibility */}
          <Button size="lg" onClick={toggleMenu}>
            {isOpen ? (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Sembunyikan Menu
              </>
            ) : (
              <>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path
                    fillRule="evenodd"
                    d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                    clipRule="evenodd"
                  />
                </svg>
                Lihat Menu Kami
              </>
            )}
          </Button>
        </div>

        {/* Menu Content — animated reveal */}
        <div
          ref={contentRef}
          className={`overflow-hidden transition-all duration-500 ease-in-out ${
            isOpen ? 'max-h-[4000px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          {/* Category Tabs */}
          <div className="flex justify-center gap-2 mb-10 pt-2">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-5 py-3 rounded-full font-medium text-sm md:text-base transition-all duration-200 min-h-[44px] ${
                  activeCategory === cat.key
                    ? 'bg-primary-500 text-white shadow-md shadow-primary-500/30'
                    : 'bg-white text-gray-600 hover:bg-gray-100 shadow-sm'
                }`}
              >
                <span className="mr-1.5">{cat.icon}</span>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Menu Grid */}
          {filteredMenus.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMenus.map((item, i) => (
                <MenuCard key={item.id} item={item} index={i} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto mb-3 opacity-50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <p>Belum ada menu untuk kategori ini</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
