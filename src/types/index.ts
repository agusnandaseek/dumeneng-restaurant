export interface RestaurantProfile {
  name: string;
  slogan: string;
  address: string;
  whatsappNumber: string;
  operationalHours: string;
  mapsEmbedUrl: string;
  heroImageUrl: string;
}

export interface MenuItem {
  id: number;
  name: string;
  category: 'Makanan' | 'Minuman' | 'Dessert';
  description: string;
  price: number;
  imageUrl: string;
  isAvailable: boolean;
}

export interface GalleryItem {
  id: number;
  imageUrl: string;
  caption: string;
}

export interface Review {
  id: number;
  name: string;
  rating: number;
  text: string;
  date: string;
}

export interface ReservationFormData {
  name: string;
  guests: number;
  date: string;
  time: string;
  notes: string;
}

export type MenuCategory = 'Makanan' | 'Minuman' | 'Dessert';

export interface Reservation {
  id: number;
  name: string;
  guests: number;
  date: string;
  time: string;
  notes: string;
  createdAt: string;
}
