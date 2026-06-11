'use client';

import { useAuth } from '@/contexts/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

// Pages that users with 'user' role CAN access
const USER_ALLOWED = ['/admin/reservations'];

// Pages that don't need auth
const PUBLIC = ['/admin/login'];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, role, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isPublic = PUBLIC.includes(pathname);

  useEffect(() => {
    if (loading) return;

    if (!isLoggedIn && !isPublic) {
      router.push('/admin/login');
      return;
    }

    if (isLoggedIn) {
      // Role-based access: 'user' role can only access USER_ALLOWED pages
      if (role === 'user' && !USER_ALLOWED.includes(pathname) && !isPublic) {
        router.push('/admin/reservations');
      }

      // Redirect /admin/login to appropriate page when already logged in
      if (isPublic) {
        router.push(role === 'user' ? '/admin/reservations' : '/admin');
      }
    }
  }, [loading, isLoggedIn, role, isPublic, pathname, router]);

  if (loading) return <LoadingSpinner fullScreen />;

  if (isPublic) return <>{children}</>;

  if (!isLoggedIn) return null;

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 md:px-8 sticky top-0 z-10">
          <div className="flex-1 lg:ml-10" />
          <h2 className="text-sm text-gray-500">Panel Admin</h2>
        </header>
        <main className="flex-1 p-4 md:p-8 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
