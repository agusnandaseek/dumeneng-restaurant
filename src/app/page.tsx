'use client';

import { useData } from '@/contexts/DataContext';
import Navbar from '@/components/landing/Navbar';
import HeroSection from '@/components/landing/HeroSection';
import MenuSection from '@/components/landing/MenuSection';
import GallerySection from '@/components/landing/GallerySection';
import LocationSection from '@/components/landing/LocationSection';
import ReviewsSection from '@/components/landing/ReviewsSection';
import ReservationSection from '@/components/landing/ReservationSection';
import Footer from '@/components/landing/Footer';

export default function HomePage() {
  const { profile, menus, gallery, reviews } = useData();

  return (
    <main>
      <Navbar profile={profile} />
      <HeroSection profile={profile} />
      <MenuSection menus={menus} />
      <GallerySection gallery={gallery} />
      <LocationSection profile={profile} />
      <ReviewsSection reviews={reviews} />
      <ReservationSection profile={profile} />
      <Footer profile={profile} />
    </main>
  );
}
