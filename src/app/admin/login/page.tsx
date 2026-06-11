'use client';

import LoginForm from '@/components/admin/LoginForm';

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-700 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-display font-bold text-white">
            Admin Panel
          </h1>
          <p className="text-white/80 mt-2">D&apos;Umeneng Restoran</p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
