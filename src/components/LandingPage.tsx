'use client';

import { useAuth, roleLabels, users, type AppRole } from '@/components/auth';
import { Mountain, Shield, TreePine, Users, BarChart3, Lock, MapPin } from 'lucide-react';
import { useState } from 'react';

const socialProviders = [
  { name: 'Google', color: 'bg-white border-2 border-gray-300 text-gray-700 hover:bg-gray-50', icon: () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
  )},
  { name: 'Apple', color: 'bg-black text-white hover:bg-gray-800', icon: () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
  )},
  { name: 'Facebook', color: 'bg-[#1877F2] text-white hover:bg-[#166FE5]', icon: () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
  )},
  { name: 'Instagram', color: 'bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] text-white hover:opacity-90', icon: () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
  )},
  { name: 'TikTok', color: 'bg-black text-white hover:bg-gray-800', icon: () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>
  )},
  { name: 'X (Twitter)', color: 'bg-black text-white hover:bg-gray-800', icon: () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
  )},
];

const roleConfig: Record<AppRole, { icon: React.ReactNode; color: string; description: string }> = {
  super_admin: { icon: <Shield className="w-5 h-5" />, color: 'bg-red-500 hover:bg-red-600', description: 'Full system control' },
  park_manager: { icon: <Mountain className="w-5 h-5" />, color: 'bg-emerald-600 hover:bg-emerald-700', description: 'Park-wide management' },
  ranger: { icon: <TreePine className="w-5 h-5" />, color: 'bg-green-600 hover:bg-green-700', description: 'Trail & visitor patrol' },
  operator: { icon: <Users className="w-5 h-5" />, color: 'bg-blue-600 hover:bg-blue-700', description: 'Chalet & booking ops' },
  finance: { icon: <BarChart3 className="w-5 h-5" />, color: 'bg-amber-600 hover:bg-amber-700', description: 'Revenue & budget' },
  auditor: { icon: <Lock className="w-5 h-5" />, color: 'bg-slate-600 hover:bg-slate-700', description: 'Read-only audit' },
  visitor: { icon: <MapPin className="w-5 h-5" />, color: 'bg-teal-600 hover:bg-teal-700', description: 'Browse trails & hike' },
};

export function LandingPage() {
  const { loginWithGoogle, loginWithFacebook, loginWithApple, loginWithInstagram, loginWithTikTok, loginWithX, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showDemoPanel, setShowDemoPanel] = useState(false);

  const socialHandlers: Record<string, () => void> = {
    Google: loginWithGoogle,
    Facebook: loginWithFacebook,
    Apple: loginWithApple,
    Instagram: loginWithInstagram,
    TikTok: loginWithTikTok,
    'X (Twitter)': loginWithX,
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedRole = Object.values(users).find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );
    if (matchedRole) {
      login(matchedRole.role);
    } else {
      login('visitor');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900">
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Mountain className="w-12 h-12 text-emerald-300" />
            <h1 className="text-4xl font-bold text-white">Smart Gunung Lambak</h1>
          </div>
          <p className="text-emerald-200 text-lg max-w-md mx-auto">
            Smart mountain management platform for hikers, rangers, and park operators.
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Sign in to continue</h2>

          {/* Social Login Buttons */}
          <div className="space-y-3 mb-6">
            {socialProviders.map((provider) => {
              const Icon = provider.icon;
              return (
                <button
                  key={provider.name}
                  onClick={socialHandlers[provider.name]}
                  className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${provider.color}`}
                >
                  <Icon />
                  Continue with {provider.name}
                </button>
              );
            })}
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-sm text-gray-400">or sign in with email</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          {/* Email/Password Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4 mb-6">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
            />
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-xl transition-colors"
            >
              Sign In
            </button>
          </form>

          <p className="text-xs text-gray-400 text-center -mt-2 mb-4">
            Try: admin@mpk.gov.my (Super Admin) · ranger.hafiz@mpk.gov.my (Ranger) · visitor@example.com (Visitor)
          </p>

          {/* Demo Role Login */}
          <div className="border-t border-gray-100 pt-6">
            <button
              onClick={() => setShowDemoPanel(!showDemoPanel)}
              className="w-full text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
            >
              {showDemoPanel ? 'Hide' : 'Show'} demo role login
            </button>

            {showDemoPanel && (
              <div className="mt-4 space-y-2">
                {(Object.keys(roleConfig) as AppRole[]).map((role) => {
                  const config = roleConfig[role];
                  const user = users[role];
                  return (
                    <button
                      key={role}
                      onClick={() => login(role)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white font-medium transition-all duration-200 ${config.color}`}
                    >
                      {config.icon}
                      <div className="text-left flex-1">
                        <div className="text-sm font-semibold">{user.name}</div>
                        <div className="text-xs opacity-80">{config.description}</div>
                      </div>
                      <span className="text-xs opacity-60 bg-white/20 px-2 py-1 rounded-lg">
                        {roleLabels[role]}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-emerald-300/60 text-xs mt-8">
          Smart Gunung Lambak &copy; 2026 &middot; Built for MPK
        </p>
      </div>
    </div>
  );
}
