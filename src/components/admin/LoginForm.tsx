'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

export default function LoginForm() {
  const { login, isLoggedIn, role } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Already logged in — redirect based on role
  if (isLoggedIn) {
    router.push(role === 'user' ? '/admin/reservations' : '/admin');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim()) {
      setError('Email dan password harus diisi');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await login(email.trim(), password);
      if (result.success) {
        // Role-based redirect will happen on re-render
      } else {
        setError(result.error || 'Login gagal');
      }
    } catch {
      setError('Terjadi kesalahan. Coba lagi.');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-xl font-display font-bold text-gray-900 mb-6 text-center">
        Masuk Admin Panel
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 border border-red-200">
            {error}
          </div>
        )}

        <Input
          id="login-email"
          label="Email"
          type="email"
          placeholder="admin@dumeneng.com"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(''); }}
          required
        />

        <Input
          id="login-password"
          label="Password"
          type="password"
          placeholder="Masukkan password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(''); }}
          required
        />

        <Button type="submit" className="w-full" isLoading={isSubmitting}>
          Login
        </Button>
      </form>

      <p className="text-xs text-gray-400 text-center mt-6">
        Hanya akun admin yang terdaftar dapat login
      </p>
    </div>
  );
}
