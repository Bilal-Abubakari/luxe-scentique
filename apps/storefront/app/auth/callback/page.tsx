'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { setToken } from '../../../lib/auth';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'processing' | 'error'>('processing');

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      return;
    }

    try {
      setToken(token);
      // Redirect to homepage after storing token
      router.replace('/');
    } catch {
      setStatus('error');
    }
  }, [searchParams, router]);

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="bg-white rounded-xl border border-onyx-100 p-10 shadow-sm max-w-sm w-full text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-10 h-10 mx-auto mb-4 text-red-400"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
          <h1 className="font-display text-xl text-onyx mb-2">Authentication Failed</h1>
          <p className="text-onyx-400 text-sm mb-6">
            We could not complete your sign-in. No token was provided.
          </p>
          <a
            href="/"
            className="btn-gold inline-block"
            aria-label="Return to homepage"
          >
            Return Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <output
      className="min-h-screen bg-cream flex flex-col items-center justify-center gap-4"
      aria-label="Completing sign in"
    >
      <div
        className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin"
        aria-hidden="true"
      />
      <div className="text-center">
        <h1 className="font-display text-xl text-onyx mb-1">Signing you in…</h1>
        <p className="text-onyx-400 text-sm">Please wait while we complete your authentication.</p>
      </div>
    </output>
  );
}
