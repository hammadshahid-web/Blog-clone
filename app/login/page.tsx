'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import axios from 'axios';
import { useAuthStore } from '@/stores/use-auth-store';
import { Terminal, Lock, Mail, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

// 1. Zod Validation Schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('from') || '/';

  const setAuth = useAuthStore((state) => state.setAuth);
  const [serverError, setServerError] = useState<string | null>(null);

  // 2. React Hook Form Setup
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'ali@devpulse.com',
      password: 'Password123!',
    },
  });

  // 3. Form Submit Handler
  const onSubmit = async (data: LoginFormValues) => {
    try {
      setServerError(null);
      const res = await axios.post('/api/auth/login', data);

      // Save user & token to Zustand state
      setAuth(res.data.user, res.data.accessToken);

      // Redirect back to intended page or home
      router.push(redirectTo);
      router.refresh();
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Login failed. Please check credentials.');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl">
        
        {/* Header Logo & Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 bg-blue-600/10 text-blue-600 dark:text-blue-400 rounded-xl mb-2">
            <Terminal className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Welcome Back</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Sign in to access your author dashboard & write articles
          </p>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-sm animate-in fade-in">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          {/* Email Input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
              <input
                {...register('email')}
                type="email"
                placeholder="ali@devpulse.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
              />
            </div>
            {errors.email && (
              <p className="text-xs text-red-500 font-medium pl-1">{errors.email.message}</p>
            )}
          </div>

          {/* Password Input */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <Link href="/forgot-password" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
              <input
                {...register('password')}
                type="password"
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 transition"
              />
            </div>
            {errors.password && (
              <p className="text-xs text-red-500 font-medium pl-1">{errors.password.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Signing in...
              </>
            ) : (
              <>
                Sign In <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </form>

        {/* Demo Credentials Hint */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800/60 rounded-xl text-center text-xs text-slate-500 space-y-1">
          <p className="font-semibold text-slate-700 dark:text-slate-300">Demo Login Credentials:</p>
          <p>Email: <code className="text-blue-600">ali@devpulse.com</code></p>
          <p>Password: <code className="text-blue-600">Password123!</code></p>
        </div>

      </div>
    </div>
  );
}