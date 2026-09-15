'use client';

import { useAuth, roleLabels, type AppRole } from '@/components/auth';
import { useRouter } from 'next/navigation';
import {
  Mountain,
  Shield,
  Users,
  BarChart3,
  Footprints,
  Radio,
  Map,
  TreePine,
  RadioTower,
  Landmark,
  Eye,
  MapPin,
  ArrowRight,
  Loader2,
  CheckCircle2,
  Sparkles,
  Zap,
  Globe,
  Lock,
  Smartphone,
  Activity,
  LogOut,
  Database,
} from 'lucide-react';
import { useState, useEffect } from 'react';

const roleIcons: Record<AppRole, React.ReactNode> = {
  super_admin: <Shield className="w-5 h-5" />,
  park_manager: <TreePine className="w-5 h-5" />,
  ranger: <RadioTower className="w-5 h-5" />,
  operator: <Landmark className="w-5 h-5" />,
  finance: <BarChart3 className="w-5 h-5" />,
  auditor: <Eye className="w-5 h-5" />,
  visitor: <MapPin className="w-5 h-5" />,
};

const roleDescriptions: Record<AppRole, string> = {
  super_admin: 'Full system access — manage all parks, rangers, operators, API keys, budgets, and SLA monitoring across MPK.',
  park_manager: 'Oversight of park operations — ranger deployment, visitor analytics, facility bookings, and revenue tracking.',
  ranger: 'Field operations — checkpoint scanning, SOS dispatch, real-time trail monitoring, and family safe-zone alerts.',
  operator: 'Chalet & facility management — bookings, maintenance, revenue reporting, and smart lock integration.',
  finance: 'Financial dashboards — revenue tracking, budget allocation, audit trails, and expense reporting.',
  auditor: 'Read-only reporting — SLA compliance, audit logs, API usage, and cross-park analytics.',
  visitor: 'Hiking experience — trail discovery, live hike tracking, family booking, e-tickets, and wildlife viewing.',
};

const roleCapabilities: Record<AppRole, string[]> = {
  super_admin: ['Park Management', 'User Administration', 'API Keys', 'Budget Control', 'SLA Monitoring'],
  park_manager: ['Ranger Deployment', 'Visitor Analytics', 'Revenue Tracking', 'Incident Response'],
  ranger: ['Checkpoint Scanning', 'SOS Dispatch', 'Trail Monitoring', 'Family Alerts'],
  operator: ['Booking Management', 'Facility Maintenance', 'Revenue Reports', 'Smart Locks'],
  finance: ['Revenue Dashboard', 'Budget Allocation', 'Audit Trails', 'Expense Reports'],
  auditor: ['SLA Reports', 'Audit Logs', 'API Analytics', 'Cross-Park Insights'],
  visitor: ['Trail Discovery', 'Live Hiking', 'Family Booking', 'E-Tickets'],
};

type SocialProvider = {
  name: string;
  role: AppRole;
  color: string;
  hoverColor: string;
  icon: React.ReactNode;
  description: string;
};

const socialProviders: SocialProvider[] = [
  {
    name: 'Google',
    role: 'super_admin',
    color: 'bg-white border-2 border-gray-200 text-gray-700',
    hoverColor: 'hover:border-blue-400 hover:shadow-lg hover:shadow-blue-100',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
      </svg>
    ),
    description: 'Full admin access',
  },
  {
    name: 'Apple',
    role: 'ranger',
    color: 'bg-black text-white',
    hoverColor: 'hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-800/30',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
      </svg>
    ),
    description: 'Field operations',
  },
  {
    name: 'Facebook',
    role: 'park_manager',
    color: 'bg-[#1877F2] text-white',
    hoverColor: 'hover:bg-[#166FE5] hover:shadow-lg hover:shadow-[#1877F2]/30',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
    description: 'Park management',
  },
  {
    name: 'Instagram',
    role: 'operator',
    color: 'bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] text-white',
    hoverColor: 'hover:opacity-90 hover:shadow-lg hover:shadow-pink-400/30',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
    description: 'Facility operations',
  },
  {
    name: 'TikTok',
    role: 'finance',
    color: 'bg-black text-white',
    hoverColor: 'hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-800/30',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
    description: 'Financial dashboards',
  },
  {
    name: 'X',
    role: 'auditor',
    color: 'bg-black text-white',
    hoverColor: 'hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-800/30',
    icon: (
      <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    description: 'Read-only reports',
  },
];

const features = [
  { icon: <Footprints className="w-5 h-5" />, title: 'Trail Management', desc: 'GPS waypoints, difficulty ratings, real-time conditions' },
  { icon: <Radio className="w-5 h-5" />, title: 'Ranger Ops', desc: 'Live tracking, SOS dispatch, checkpoint scanning' },
  { icon: <Users className="w-5 h-5" />, title: 'Visitor Safety', desc: 'Family alerts, safe zones, group tracking' },
  { icon: <Map className="w-5 h-5" />, title: 'Twin Map', desc: '3D terrain, live positions, trail overlays' },
  { icon: <BarChart3 className="w-5 h-5" />, title: 'Analytics', desc: 'Revenue, visitor stats, SLA monitoring' },
  { icon: <Shield className="w-5 h-5" />, title: 'RBAC + MFA', desc: '7 roles, per-panel access, audit logging' },
];

type View = 'home' | 'logging-in';

export function LandingPage() {
  const { login, logout, user } = useAuth();
  const router = useRouter();
  const [view, setView] = useState<View>('home');
  const [loggingInProvider, setLoggingInProvider] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (user.role !== 'visitor') {
      setIsAuthenticated(true);
    }
  }, [user.role]);

  const roleRoutes: Record<string, string> = {
    super_admin: '/admin',
    park_manager: '/park-manager',
    ranger: '/ranger',
    operator: '/operator',
    finance: '/finance',
    auditor: '/auditor',
    visitor: '/visitor',
  };

  const handleSocialLogin = (provider: SocialProvider) => {
    router.push(roleRoutes[provider.role] || '/');
  };

  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    setView('home');
    setLoggingInProvider(null);
  };

  // Already logged in - show logged in state
  if (isAuthenticated && user.role !== 'visitor') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900">
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">Welcome Back!</h2>
            <p className="text-emerald-200 mb-2">{user.name}</p>
            <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-full text-sm font-bold mb-6">
              {roleIcons[user.role]}
              {roleLabels[user.role]}
            </div>
            <p className="text-emerald-200/70 text-sm mb-6">
              Your app is loading in the background. You can also logout and try a different role.
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleLogout}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Switch Role
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Logging in animation
  if (view === 'logging-in' && loggingInProvider) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900">
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
            <Loader2 className="w-12 h-12 text-emerald-600 animate-spin mx-auto mb-4" />
            <h2 className="text-xl font-black text-gray-900 mb-2">Signing in with {loggingInProvider}</h2>
            <p className="text-gray-500 text-sm">Connecting to {loggingInProvider} OAuth...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 via-green-800 to-teal-900">
      <div className="flex flex-col min-h-screen">

        {/* ─── HERO SECTION ─── */}
        <header className="relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 bg-emerald-300 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-teal-300 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-6xl mx-auto px-4 py-12 md:py-20">
            <div className="text-center">
              {/* Demo Badge */}
              <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 px-4 py-1.5 rounded-full text-xs font-bold mb-6 border border-emerald-500/30">
                <Sparkles className="w-3 h-3" />
                DEMO ENVIRONMENT
              </div>

              {/* Logo */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
                  <Mountain className="w-10 h-10 text-emerald-300" />
                </div>
              </div>

              {/* Title */}
              <h1 className="text-5xl md:text-7xl font-black text-white mb-4 tracking-tight">
                malim
              </h1>
              <p className="text-emerald-200 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
                Smart mountain management platform for hikers, rangers, and park operators.
                <br className="hidden md:block" />
                Real-time trail monitoring, visitor safety, and operational dashboards.
              </p>

              {/* Quick Stats */}
              <div className="flex justify-center gap-6 md:gap-12 mb-8">
                {[
                  { icon: <MapPin className="w-4 h-4" />, label: 'Parks', value: '4' },
                  { icon: <Footprints className="w-4 h-4" />, label: 'Trails', value: '8' },
                  { icon: <Users className="w-4 h-4" />, label: 'Roles', value: '7' },
                  { icon: <Zap className="w-4 h-4" />, label: 'API Endpoints', value: '22' },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-emerald-300 flex justify-center mb-1">{stat.icon}</div>
                    <div className="text-white font-black text-xl">{stat.value}</div>
                    <div className="text-emerald-200/60 text-xs">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* ─── SOCIAL LOGIN GRID ─── */}
        <section className="max-w-6xl mx-auto px-4 pb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-white mb-2">Choose Your Login</h2>
            <p className="text-emerald-200/70 text-sm">Each social login grants access to a different role</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {socialProviders.map((provider) => (
              <button
                key={provider.name}
                onClick={() => handleSocialLogin(provider)}
                className={`relative group flex flex-col items-center gap-3 p-5 rounded-2xl transition-all duration-200 ${provider.color} ${provider.hoverColor}`}
              >
                {/* Provider Icon */}
                <div className="w-10 h-10 flex items-center justify-center">
                  {provider.icon}
                </div>

                {/* Provider Name */}
                <div className="text-center">
                  <div className="font-bold text-sm">Continue with {provider.name}</div>
                  <div className="text-xs opacity-60 mt-1">{provider.description}</div>
                </div>

                {/* Role Badge */}
                <div className="absolute top-2 right-2 bg-black/20 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {roleLabels[provider.role]}
                </div>

                {/* Arrow indicator */}
                <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all absolute bottom-3 right-3" />
              </button>
            ))}
          </div>
        </section>

        {/* ─── VISITOR CTA ─── */}
        <section className="max-w-6xl mx-auto px-4 pb-12">
          <div className="max-w-3xl mx-auto">
            <button
              onClick={() => router.push('/visitor')}
              className="w-full flex items-center justify-center gap-4 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-lg py-5 rounded-2xl transition-all duration-200 hover:shadow-xl hover:shadow-emerald-500/30 hover:-translate-y-0.5"
            >
              <Footprints className="w-6 h-6" />
              <span>Continue as Visitor</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-center text-emerald-200/50 text-xs mt-3">
              Explore trails, book facilities, and track your hike — no admin access
            </p>
          </div>
        </section>

        {/* ─── FEATURES GRID ─── */}
        <section className="max-w-6xl mx-auto px-4 pb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-white mb-2">Platform Features</h2>
            <p className="text-emerald-200/70 text-sm">Built for MPK Kluang smart park management</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {features.map((f) => (
              <div key={f.title} className="bg-white/10 backdrop-blur-sm rounded-xl p-5 text-center hover:bg-white/15 transition">
                <div className="text-emerald-300 flex justify-center mb-3">{f.icon}</div>
                <h3 className="text-white font-bold text-sm mb-1">{f.title}</h3>
                <p className="text-emerald-200/70 text-xs">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── ROLE DETAILS ─── */}
        <section className="max-w-6xl mx-auto px-4 pb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-black text-white mb-2">Role Capabilities</h2>
            <p className="text-emerald-200/70 text-sm">What each role can access</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(Object.keys(roleLabels) as AppRole[]).filter(r => r !== 'visitor').map((role) => {
              const provider = socialProviders.find(p => p.role === role);
              return (
                <div key={role} className="bg-white/10 backdrop-blur-sm rounded-xl p-5 hover:bg-white/15 transition">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-emerald-300">{roleIcons[role]}</div>
                    <div>
                      <span className="text-white font-bold text-sm">{roleLabels[role]}</span>
                      {provider && (
                        <div className="text-emerald-200/60 text-xs flex items-center gap-1 mt-0.5">
                          via {provider.name}
                        </div>
                      )}
                    </div>
                  </div>
                  <p className="text-emerald-200/60 text-xs leading-relaxed mb-3">{roleDescriptions[role]}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {roleCapabilities[role].map((cap) => (
                      <span key={cap} className="bg-emerald-500/20 text-emerald-300 text-[10px] px-2 py-0.5 rounded-full font-bold">
                        {cap}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ─── TECH STACK ─── */}
        <section className="max-w-6xl mx-auto px-4 pb-12">
          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8">
            <div className="text-center mb-6">
              <h2 className="text-xl font-black text-white mb-2">Built With</h2>
            </div>
            <div className="flex flex-wrap justify-center gap-4">
              {[
                { icon: <Globe className="w-4 h-4" />, label: 'Next.js 16' },
                { icon: <Lock className="w-4 h-4" />, label: 'TypeScript' },
                { icon: <Database className="w-4 h-4" />, label: 'PostgreSQL' },
                { icon: <Smartphone className="w-4 h-4" />, label: 'PWA Ready' },
                { icon: <Activity className="w-4 h-4" />, label: 'Real-time IoT' },
                { icon: <Shield className="w-4 h-4" />, label: 'RBAC Security' },
              ].map((tech) => (
                <div key={tech.label} className="flex items-center gap-2 text-emerald-300 text-sm">
                  {tech.icon}
                  <span>{tech.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FOOTER ─── */}
        <footer className="mt-auto">
          <div className="max-w-6xl mx-auto px-4 py-6">
            <div className="text-center">
              <p className="text-emerald-300/60 text-xs">
                malim &copy; 2026 &middot; Built for MPK Kluang &middot; Demo Environment
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}


