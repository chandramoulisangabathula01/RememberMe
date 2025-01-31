'use client';

import { signIn } from 'next-auth/react';
import { Button } from '@/components/ui/button';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-sm space-y-6 rounded-lg border bg-card p-8 shadow-sm">
        <h1 className="text-center text-2xl font-bold">Welcome Back</h1>
        <Button
          className="w-full"
          onClick={() => signIn('github')}
        >
          Sign in with GitHub
        </Button>
      </div>
    </div>
  );
} 