'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { logoutUser } from '@/services/auth.service';
import { User } from '@/types/auth.types';

export default function HomePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const storedUser = localStorage.getItem('user');

    if (!token) {
      router.replace('/login');
      return;
    }

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser) as User;
        // Schedule state update outside synchronous effect execution
        queueMicrotask(() => {
          setUser(parsedUser);
          setCheckingAuth(false);
        });
      } catch {
        logoutUser();
        router.replace('/login');
        return;
      }
    }else {
      queueMicrotask(() => setCheckingAuth(false));
    }
  }, [router]);

  const handleLogout = (): void => {
    logoutUser();
    router.replace('/login');
  };

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-400">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="flex items-center justify-between border-b border-zinc-800 px-8 py-4">
        <h1 className="text-lg font-bold text-indigo-400">Prompt2Component</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-zinc-400">
            Welcome, <strong className="text-white">{user?.username ?? 'Developer'}</strong>
          </span>
          <button
            onClick={handleLogout}
            className="rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs text-zinc-300 transition hover:bg-zinc-700"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="mx-auto flex max-w-4xl flex-col items-center justify-center px-4 py-24 text-center">
        <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
          Build React Components with <span className="text-indigo-500">Plain English</span>
        </h2>
        <p className="mt-4 text-base text-zinc-400">
          Describe the UI you need, generate code automatically, edit it in Monaco, and test the output in real-time.
        </p>
        <div className="mt-8 flex gap-4">
          <Link
            href="/builder2"
            className="rounded-md bg-indigo-600 px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-indigo-500"
          >
            Launch Builder
          </Link>
        </div>
      </main>
    </div>
  );
}