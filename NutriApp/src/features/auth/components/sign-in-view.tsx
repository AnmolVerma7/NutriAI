'use client';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useActionState } from 'react';
import { login } from '../actions';

export default function SignInViewPage({ stars }: { stars: number }) {
  const [state, formAction, isPending] = useActionState(login, null);

  return (
    <div className='bg-background/40 w-full rounded-xl border p-6 backdrop-blur-md'>
      <div className='flex flex-col space-y-2 text-center'>
        <h1 className='text-2xl font-semibold tracking-tight'>Sign In</h1>
        <p className='text-muted-foreground text-sm'>
          Enter your email below to sign in to your account
        </p>
      </div>

      <div className='mt-6 grid w-full gap-6'>
        <form action={formAction}>
          {state?.error && (
            <div className='mb-4 text-sm text-red-500'>{state.error}</div>
          )}
          <div className='grid gap-2'>
            <div className='grid gap-1'>
              <label className='sr-only' htmlFor='email'>
                Email
              </label>
              <input
                id='email'
                name='email'
                placeholder='name@example.com'
                type='email'
                autoCapitalize='none'
                autoComplete='email'
                autoCorrect='off'
                className='border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50'
                required
              />
            </div>
            <div className='grid gap-1'>
              <label className='sr-only' htmlFor='password'>
                Password
              </label>
              <input
                id='password'
                name='password'
                placeholder='Password'
                type='password'
                autoCapitalize='none'
                autoComplete='current-password'
                autoCorrect='off'
                className='border-input placeholder:text-muted-foreground focus-visible:ring-ring flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50'
                required
              />
            </div>
            <button
              disabled={isPending}
              className='focus-visible:ring-ring bg-primary text-primary-foreground hover:bg-primary/90 inline-flex h-9 items-center justify-center rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap shadow transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50'
            >
              {isPending ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>
        <div className='text-center text-sm'>
          Don&apos;t have an account?{' '}
          <Link
            href='/auth/sign-up'
            className='hover:text-primary underline underline-offset-4'
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
