'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { useAuthStore } from '@/store';
import type { OtpPurpose } from '@/types';

function parseAccessTokenFromHash() {
  if (typeof window === 'undefined') {
    return '';
  }

  const hash = window.location.hash.startsWith('#') ? window.location.hash.slice(1) : window.location.hash;
  const hashParams = new URLSearchParams(hash);
  return hashParams.get('access_token') ?? '';
}

function createBrowserSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables.');
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  });
}

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const completeMagicLink = useAuthStore((state) => state.completeMagicLink);

  const [message, setMessage] = useState('Confirming your email link...');
  const [error, setError] = useState('');

  useEffect(() => {
    const complete = async () => {
      const rawPurpose = searchParams.get('purpose');
      const purpose: OtpPurpose = rawPurpose === 'register' ? 'register' : 'login';
      const code = searchParams.get('code') ?? '';
      let accessToken = parseAccessTokenFromHash();

      if (!accessToken && code) {
        try {
          const supabase = createBrowserSupabaseClient();
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);

          if (error || !data.session?.access_token) {
            throw new Error(error?.message ?? 'Unable to exchange confirmation code.');
          }

          accessToken = data.session.access_token;
        } catch (exchangeError) {
          setError(exchangeError instanceof Error ? exchangeError.message : 'Unable to complete confirmation.');
          setMessage('Unable to complete sign-in.');
          return;
        }
      }

      if (!accessToken) {
        setError('This confirmation link is missing required token data. Please request a new link.');
        setMessage('Unable to complete sign-in.');
        return;
      }

      try {
        await completeMagicLink(accessToken, purpose);
        setMessage('Email confirmed. Redirecting to your dashboard...');
        router.replace('/dashboard');
      } catch (err) {
        setError((err as Error).message);
        setMessage('Could not complete sign-in from email link.');
      }
    };

    void complete();
  }, [completeMagicLink, router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-lg rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900 mb-3">Email Confirmation</h1>
        <p className="text-gray-700 mb-4">{message}</p>
        {error && <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-3">{error}</p>}
        <div className="mt-5 flex gap-3">
          <Link href="/login" className="text-blue-600 hover:underline">
            Back to Login
          </Link>
          <Link href="/register" className="text-blue-600 hover:underline">
            Back to Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">Loading...</div>}>
      <AuthCallbackContent />
    </Suspense>
  );
}
