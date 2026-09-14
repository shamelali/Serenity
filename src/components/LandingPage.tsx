'use client';

import { useAuth, roleLabels, type AppRole } from '@/components/auth';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LandingPage() {
  const {
    loginWithGoogle,
    loginWithFacebook,
    loginWithApple,
    loginWithInstagram,
    loginWithTikTok,
    loginWithX,
    loginWithEmail,
    login,
    logout,
    isLoading,
  } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      router.push('/');
    } catch {
      setLoginError('Failed to sign in with Google');
    }
  };

  const handleFacebookLogin = async () => {
    try {
      await loginWithFacebook();
      router.push('/');
    } catch {
      setLoginError('Failed to sign in with Facebook');
    }
  };

  const handleAppleLogin = async () => {
    try {
      await loginWithApple();
      router.push('/');
    } catch {
      setLoginError('Failed to sign in with Apple');
    }
  };

  const handleInstagramLogin = async () => {
    try {
      await loginWithInstagram();
      router.push('/');
    } catch {
      setLoginError('Failed to sign in with Instagram');
    }
  };

  const handleTikTokLogin = async () => {
    try {
      await loginWithTikTok();
      router.push('/');
    } catch {
      setLoginError('Failed to sign in with TikTok');
    }
  };

  const handleXLogin = async () => {
    try {
      await loginWithX();
      router.push('/');
    } catch {
      setLoginError('Failed to sign in with X');
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
      await loginWithEmail(email, password);
      router.push('/');
    } catch {
      setLoginError('Failed to sign in with email. Please check your credentials.');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto" />
          <p className="mt-4 text-lg text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="w-full max-w-md space-y-8">
        {/* Logo and Title */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center">
              <span className="text-2xl font-bold text-white">&#9968;</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Smart Gunung Lambak
          </h1>
          <p className="text-lg text-gray-600">
            Visitor, Ranger, Command Centre, Admin, IoT &amp; API Platform
          </p>
        </div>

        {/* Login Form */}
        <div className="space-y-6">
          {/* Error Message */}
          {loginError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {loginError}
            </div>
          )}

          {/* Social Login Buttons */}
          <div className="space-y-3">
            <p className="text-center text-sm text-gray-500">Continue with</p>

            {/* Google */}
            <button
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center px-5 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <div className="h-6 w-6 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold mr-3">G</div>
              <span className="text-gray-800 font-medium">Sign in with Google</span>
            </button>

            {/* Apple */}
            <button
              onClick={handleAppleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center px-5 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <div className="h-6 w-6 rounded-full bg-black flex items-center justify-center text-white text-xs font-bold mr-3">&#63743;</div>
              <span className="text-gray-800 font-medium">Sign in with Apple</span>
            </button>

            {/* Facebook */}
            <button
              onClick={handleFacebookLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center px-5 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <div className="h-6 w-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold mr-3">f</div>
              <span className="text-gray-800 font-medium">Sign in with Facebook</span>
            </button>

            {/* Instagram */}
            <button
              onClick={handleInstagramLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center px-5 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <div className="h-6 w-6 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold mr-3">IG</div>
              <span className="text-gray-800 font-medium">Sign in with Instagram</span>
            </button>

            {/* TikTok */}
            <button
              onClick={handleTikTokLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center px-5 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <div className="h-6 w-6 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-bold mr-3">T</div>
              <span className="text-gray-800 font-medium">Sign in with TikTok</span>
            </button>

            {/* X */}
            <button
              onClick={handleXLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center px-5 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              <div className="h-6 w-6 rounded-full bg-black flex items-center justify-center text-white text-xs font-bold mr-3">X</div>
              <span className="text-gray-800 font-medium">Sign in with X</span>
            </button>
          </div>

          {/* Email Login Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="border-t pt-4">
              <p className="text-center text-sm text-gray-500 mb-4">Or sign in with email</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Enter your email"
              />
            </div>
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="flex items-end">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all pr-16"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-0 bottom-0 my-auto text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center px-5 py-3 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign in with Email'}
            </button>
          </form>

          {/* Role Demo Buttons */}
          <div className="border-t pt-4">
            <p className="text-center text-sm text-gray-500 mb-3">Quick demo login</p>
            <div className="grid grid-cols-2 gap-2">
              {(Object.entries(roleLabels) as [AppRole, string][]).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => login(key)}
                  disabled={isLoading}
                  className="px-3 py-2 text-xs font-medium border border-gray-200 rounded-lg hover:bg-indigo-50 hover:border-indigo-300 transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-400 disabled:opacity-50 text-gray-700"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Smart Gunung Lambak. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
