'use client';

import { useState } from 'react';
import { Bell, Moon, Lock, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(true);

    return (
        <div className="max-w-3xl space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
                    Account Settings
                </h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                    Customize system preferences and security options.
                </p>
            </div>

            <div className="space-y-6">
                {/* Preference Toggles */}
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                        Preferences
                    </h2>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Bell className="w-5 h-5 text-slate-500" />
                            <div>
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">Email Notifications</p>
                                <p className="text-xs text-slate-500">Receive email alerts on comments and updates.</p>
                            </div>
                        </div>
                        <input
                            type="checkbox"
                            checked={notifications}
                            onChange={(e) => setNotifications(e.target.checked)}
                            className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                        />
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                            <Moon className="w-5 h-5 text-slate-500" />
                            <div>
                                <p className="text-sm font-semibold text-slate-900 dark:text-white">Dark Mode Preference</p>
                                <p className="text-xs text-slate-500">Sync interface appearance with system default.</p>
                            </div>
                        </div>
                        <input
                            type="checkbox"
                            checked={darkMode}
                            onChange={(e) => setDarkMode(e.target.checked)}
                            className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                        />
                    </div>
                </div>

                {/* Security Section */}
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                    <div className="flex items-center gap-3 text-slate-900 dark:text-white font-bold">
                        <Lock className="w-5 h-5 text-blue-500" />
                        Security & Password
                    </div>
                    <p className="text-xs text-slate-500">
                        Update your account password or invalidate active sessions.
                    </p>
                    <Link
                        href="/reset-password"
                        className="inline-flex items-center justify-center px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                    >
                        Change Password
                    </Link>
                </div>
            </div>
        </div>
    );
}