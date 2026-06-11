'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import type { RestaurantProfile, MenuItem, GalleryItem, Review, Reservation } from '@/types';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  addDoc,
  deleteDoc,
  onSnapshot,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Static fallback data — used ONLY if Firestore is empty
import defaultProfile from '@/data/profile.json';
import defaultMenus from '@/data/menus.json';
import defaultGallery from '@/data/gallery.json';
import defaultReviews from '@/data/reviews.json';

interface DataContextValue {
  profile: RestaurantProfile;
  menus: MenuItem[];
  gallery: GalleryItem[];
  reviews: Review[];
  reservations: Reservation[];
  setProfile: (p: RestaurantProfile) => Promise<void>;
  setMenus: (m: MenuItem[]) => Promise<void>;
  setGallery: (g: GalleryItem[]) => Promise<void>;
  setReviews: (r: Review[]) => Promise<void>;
  addReservation: (r: Omit<Reservation, 'id' | 'createdAt'>) => Promise<string | null>;
  deleteReservation: (id: number) => Promise<void>;
  resetAll: () => Promise<void>;
  loading: boolean;
}

const DataContext = createContext<DataContextValue>({
  profile: defaultProfile,
  menus: defaultMenus as MenuItem[],
  gallery: defaultGallery as GalleryItem[],
  reviews: defaultReviews as Review[],
  reservations: [],
  setProfile: async () => {},
  setMenus: async () => {},
  setGallery: async () => {},
  setReviews: async () => {},
  addReservation: async () => null,
  deleteReservation: async () => {},
  resetAll: async () => {},
  loading: true,
});

// Firestore collection references
const PROFILE_DOC = 'restaurant_profile/main';
const MENUS_COL = 'menus';
const GALLERY_COL = 'galleries';
const REVIEWS_COL = 'reviews';
const RESERVATIONS_COL = 'reservations';

// Seed Firestore with defaults if empty
async function seedIfEmpty() {
  const profileSnap = await getDocs(collection(db, 'restaurant_profile'));
  if (!profileSnap.empty) return; // already seeded

  const batch = writeBatch(db);

  // Seed profile
  batch.set(doc(db, PROFILE_DOC), { ...defaultProfile, updatedAt: new Date().toISOString() });

  // Seed menus
  for (const item of defaultMenus as MenuItem[]) {
    const ref = doc(collection(db, MENUS_COL));
    batch.set(ref, { ...item });
  }

  for (const item of defaultGallery as GalleryItem[]) {
    const ref = doc(collection(db, GALLERY_COL));
    batch.set(ref, { ...item });
  }

  for (const item of defaultReviews as Review[]) {
    const ref = doc(collection(db, REVIEWS_COL));
    batch.set(ref, { ...item });
  }

  await batch.commit();
}

function mapDoc<T>(doc: any): T {
  return { id: doc.id, ...doc.data() } as T;
}

export function DataProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<RestaurantProfile>(defaultProfile);
  const [menus, setMenusState] = useState<MenuItem[]>([]);
  const [gallery, setGalleryState] = useState<GalleryItem[]>([]);
  const [reviews, setReviewsState] = useState<Review[]>([]);
  const [reservations, setReservationsState] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  // Subscribe to Firestore collections
  useEffect(() => {
    seedIfEmpty();

    const unsubs: (() => void)[] = [];

    // Profile
    const unsubProfile = onSnapshot(doc(db, PROFILE_DOC), (snap) => {
      if (snap.exists()) setProfileState(snap.data() as RestaurantProfile);
    });
    unsubs.push(unsubProfile);

    // Menus
    const unsubMenus = onSnapshot(collection(db, MENUS_COL), (snap) => {
      setMenusState(snap.docs.map((d) => d.data() as unknown as MenuItem));
    });
    unsubs.push(unsubMenus);

    // Gallery
    const unsubGallery = onSnapshot(collection(db, GALLERY_COL), (snap) => {
      setGalleryState(snap.docs.map((d) => d.data() as unknown as GalleryItem));
    });
    unsubs.push(unsubGallery);

    // Reviews
    const unsubReviews = onSnapshot(collection(db, REVIEWS_COL), (snap) => {
      setReviewsState(snap.docs.map((d) => d.data() as unknown as Review));
    });
    unsubs.push(unsubReviews);

    // Reservations
    const unsubReservations = onSnapshot(collection(db, RESERVATIONS_COL), (snap) => {
      setReservationsState(
        snap.docs.map((d) => d.data() as unknown as Reservation)
      );
    });
    unsubs.push(unsubReservations);

    setLoading(false);

    return () => unsubs.forEach((u) => u());
  }, []);

  // --- Setters ---

  const setProfile = useCallback(async (p: RestaurantProfile) => {
    await setDoc(doc(db, PROFILE_DOC), { ...p, updatedAt: new Date().toISOString() });
  }, []);

  const setMenus = useCallback(async (m: MenuItem[]) => {
    const snap = await getDocs(collection(db, MENUS_COL));
    const batch = writeBatch(db);
    snap.docs.forEach((d) => batch.delete(d.ref));
    m.forEach((item) => batch.set(doc(collection(db, MENUS_COL)), item));
    await batch.commit();
  }, []);

  const setGallery = useCallback(async (g: GalleryItem[]) => {
    const snap = await getDocs(collection(db, GALLERY_COL));
    const batch = writeBatch(db);
    snap.docs.forEach((d) => batch.delete(d.ref));
    g.forEach((item) => batch.set(doc(collection(db, GALLERY_COL)), item));
    await batch.commit();
  }, []);

  const setReviews = useCallback(async (r: Review[]) => {
    const snap = await getDocs(collection(db, REVIEWS_COL));
    const batch = writeBatch(db);
    snap.docs.forEach((d) => batch.delete(d.ref));
    r.forEach((item) => batch.set(doc(collection(db, REVIEWS_COL)), item));
    await batch.commit();
  }, []);

  const addReservation = useCallback(async (data: Omit<Reservation, 'id' | 'createdAt'>) => {
    // Generate numeric ID for reservation
    const snap = await getDocs(collection(db, RESERVATIONS_COL));
    const maxId = snap.docs.reduce((max, d) => Math.max(max, d.data().id || 0), 0);
    const newId = maxId + 1;
    await addDoc(collection(db, RESERVATIONS_COL), {
      ...data,
      id: newId,
      createdAt: new Date().toISOString(),
    });
    return String(newId);
  }, []);

  const deleteReservation = useCallback(async (id: number) => {
    const snap = await getDocs(collection(db, RESERVATIONS_COL));
    const docToDelete = snap.docs.find((d) => d.data().id === id);
    if (docToDelete) {
      await deleteDoc(docToDelete.ref);
    }
  }, []);

  const resetAll = useCallback(async () => {
    // Delete all and re-seed
    const collections = [MENUS_COL, GALLERY_COL, REVIEWS_COL, RESERVATIONS_COL];
    for (const colName of collections) {
      const snap = await getDocs(collection(db, colName));
      const batch = writeBatch(db);
      snap.docs.forEach((d) => batch.delete(d.ref));
      await batch.commit();
    }
    // Re-seed
    await setDoc(doc(db, PROFILE_DOC), { ...defaultProfile, updatedAt: new Date().toISOString() });
    await seedIfEmpty();
  }, []);

  return (
    <DataContext.Provider
      value={{
        profile, menus, gallery, reviews, reservations,
        setProfile, setMenus, setGallery, setReviews,
        addReservation, deleteReservation,
        resetAll, loading,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  return useContext(DataContext);
}
