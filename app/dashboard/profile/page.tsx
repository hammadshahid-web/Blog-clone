'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, Mail, Shield, Save } from 'lucide-react';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  bio: z.string().max(200, 'Bio must be under 200 characters').optional(),
});

type ProfileInputs = z.infer<typeof profileSchema>;

export default function UserProfilePage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileInputs>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: 'Alex Morgan',
      email: 'alex@devpulse.io',
      bio: 'Full-stack developer & tech writer.',
    },
  });

  const onSubmit = async (data: ProfileInputs) => {
    console.log('Updated Profile:', data);
    // Submit update to backend API
  };

  return (
    <div className="max-w-3xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          User Profile
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
          Manage your personal info and public identity.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              {...register('fullName')}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          {errors.fullName && (
            <p className="text-xs text-red-500 mt-1">{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              {...register('email')}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
            Bio
          </label>
          <textarea
            rows={4}
            {...register('bio')}
            className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          {errors.bio && (
            <p className="text-xs text-red-500 mt-1">{errors.bio.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/25 transition disabled:opacity-50"
        >
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </form>
    </div>
  );
}