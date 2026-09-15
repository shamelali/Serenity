'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Baby,
  Bird,
  CalendarCheck,
  Castle,
  ChevronRight,
  Compass,
  Download,
  LogOut,
  MapPin,
  Mountain,
  Moon,
  PersonStanding,
  QrCode,
  ShieldCheck,
  ShowerHead,
  Siren,
  Sun,
  Tent,
  TriangleAlert,
  UtensilsCrossed,
  Waves,
  X,
  Languages,
} from 'lucide-react';
import { useAuth, roleLabels, roleColors } from './auth';
import type { FamilyRelation } from '@/lib/family';
import type { Booking, DashboardSnapshot, Facility, Language, SosAlert, ViewKey } from '@/lib/types';
import { Pill, ProgressBar } from './ui';

type ModalState =
  | { type: 'booking'; facility: Facility }
  | { type: 'booking-result'; booking: Booking }
  | { type: 'ticket' }
  | { type: 'sos-confirm' }
  | { type: 'sos-result'; alert: SosAlert }
  | { type: 'family'; relation: FamilyRelation }
  | { type: 'wildlife'; zone: { code: 'A' | 'B' | 'C'; en: string; bm: string; risk: 'high' | 'medium' | 'low' } }
  | { type: 'detail'; message: string }
  | null;

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};

const facilityIcon: Record<string, React.ElementType> = {
  car_park: Castle,
  chalet: Castle,
  pool: Waves,
  bbq: UtensilsCrossed,
  camping: Tent,
  toilet: ShowerHead,
  waste_bin: TriangleAlert,
};

const t = (lang: Language, en: string, bm: string) => (lang === 'BM' ? bm : en);

export function VisitorView() {
  const auth = useAuth();
  const [data, setData] = useState<DashboardSnapshot | null>(null);
  const [lang, setLang] = useState<Language>('EN');
  const [dark, setDark] = useState(false);
  const [safeZone, setSafeZone] = useState(true);
  const [modal, setModal] = useState<ModalState>(null);
  const [bookingName, setBookingName] = useState('');
  const [partySize, setPartySize] = useState(4);
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().slice(0, 10));
  const [wildlifeNote, setWildlifeNote] = useState('');
  const [familyName, setFamilyName] = useState('');
  const [familyAge, setFamilyAge] = useState<number | ''>('');
  const [familyMembers, setFamilyMembers] = useState<{ id: string; name: string; age: number | null; status: string; distanceM: number; battery: number }[]>([]);
  const [stamps, setStamps] = useState<Record<string, boolean>>({});
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const label = useCallback((en: string, bm: string) => (lang === 'BM' ? bm : en), [lang]);

  useEffect(() => {
    let active = true;
    fetch('/api/v1/dashboard', { cache: 'no-store' })
      .then((r) => r.json())
      .then((snapshot: DashboardSnapshot) => {
        if (active) setData(snapshot);
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  useEffect(() => {
    const handler = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const carPark = data?.facilities.find((f) => f.type === 'car_park');
  const bookable = data?.facilities.filter((f) => ['chalet', 'pool', 'bbq', 'camping'].includes(f.type)) ?? [];
  const freeSpots = carPark ? carPark.capacity - carPark.occupied : 0;

  function handleStamp(code: string) {
    setStamps((prev) => ({ ...prev, [code]: true }));
  }

  function addFamilyMember() {
    if (!familyName.trim()) return;
    const member = {
      id: Date.now().toString(),
      name: familyName.trim(),
      age: familyAge === '' ? null : Number(familyAge),
      status: 'in_zone',
      distanceM: Math.floor(Math.random() * 40) + 5,
      battery: Math.floor(Math.random() * 40) + 60,
    };
    setFamilyMembers((prev) => [...prev, member]);
    setFamilyName('');
    setFamilyAge('');
    setModal(null);
  }

  function removeFamilyMember(id: string) {
    setFamilyMembers((prev) => prev.filter((m) => m.id !== id));
  }

  async function submitBooking() {
    if (modal?.type !== 'booking') return;
    try {
      const response = await fetch('/api/v1/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ facilityId: modal.facility.id, guestName: bookingName || auth.user.name, partySize, checkInDate: bookingDate }),
      });
      const payload = await response.json();
      setModal({ type: 'booking-result', booking: payload.booking });
    } catch {
      setModal(null);
    }
  }

  const checkpoints = data?.checkpoints ?? [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-forest-900">
      {/* ─── TOP BAR ─── */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-forest-500 dark:bg-forest-800/95">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-brand-600 text-white">
              <Mountain className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-sm font-black">malim</h1>
              <p className="text-[10px] font-bold text-slate-500 dark:text-emerald-100/70">{label('Visitor mode', 'Mod pelawat')}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setLang((v) => (v === 'EN' ? 'BM' : 'EN'))} className="rounded-full border border-slate-200 px-2.5 py-1 text-[10px] font-bold dark:border-forest-500">
              <Languages className="mr-1 inline h-3 w-3" />{lang}
            </button>
            <button type="button" onClick={() => setDark((v) => !v)} className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 dark:border-forest-500">
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button type="button" onClick={async () => { await auth.logout(); window.location.href = '/'; }} className="grid h-8 w-8 place-items-center rounded-full border border-slate-200 text-slate-400 hover:border-red-400 hover:text-red-500 dark:border-forest-500">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-4 space-y-4">
        {/* ─── WELCOME HERO ─── */}
        <section className="rounded-3xl bg-gradient-to-br from-brand-600 to-teal-500 p-5 text-white">
          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-100">{label('Gunung Lambak Recreational Forest', 'Hutan Rekreasi Gunung Lambak')}</p>
          <h2 className="mt-2 text-xl font-black">{label('Welcome, hiker!', 'Selamat datang, pendaki!')}</h2>
          <p className="mt-1 text-xs text-blue-100">{label('4.2 km family loop • 8 trails • twin peaks 405m', 'Gelung keluarga 4.2 km • 8 denai • puncak kembar 405m')}</p>

          <div className="mt-4 grid grid-cols-3 gap-2">
            <div className="rounded-2xl bg-white/15 p-3 text-center backdrop-blur">
              <div className="text-xl font-black">{data?.visitorsToday ?? '—'}</div>
              <div className="text-[10px] font-bold uppercase">{label('Visitors', 'Pelawat')}</div>
            </div>
            <div className="rounded-2xl bg-white/15 p-3 text-center backdrop-blur">
              <div className="text-xl font-black">{data?.visitorsOnTrail ?? '—'}</div>
              <div className="text-[10px] font-bold uppercase">{label('On trail', 'Di denai')}</div>
            </div>
            <div className="rounded-2xl bg-white/15 p-3 text-center backdrop-blur">
              <div className="text-xl font-black">{data?.points ?? 0}</div>
              <div className="text-[10px] font-bold uppercase">{label('Points', 'Mata')}</div>
            </div>
          </div>
        </section>

        {/* ─── QUICK ACTIONS ─── */}
        <section className="grid grid-cols-2 gap-3">
          <button type="button" onClick={() => setActiveSection(activeSection === 'trails' ? null : 'trails')} className="rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:shadow-md dark:border-forest-500 dark:bg-forest-800">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300">
              <Compass className="h-5 w-5" />
            </div>
            <div className="mt-3 text-sm font-black">{label('Explore Trails', 'Terokai Denai')}</div>
            <div className="text-[10px] font-bold text-slate-500 dark:text-emerald-100/70">{label('8 trails with GPS', '8 denai dengan GPS')}</div>
          </button>

          <button type="button" onClick={() => setActiveSection(activeSection === 'booking' ? null : 'booking')} className="rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:shadow-md dark:border-forest-500 dark:bg-forest-800">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-300">
              <CalendarCheck className="h-5 w-5" />
            </div>
            <div className="mt-3 text-sm font-black">{label('Book Facilities', 'Tempah Fasiliti')}</div>
            <div className="text-[10px] font-bold text-slate-500 dark:text-emerald-100/70">{label('Chalets, pools, BBQ', 'Chalet, kolam, BBQ')}</div>
          </button>

          <button type="button" onClick={() => setActiveSection(activeSection === 'safety' ? null : 'safety')} className="rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:shadow-md dark:border-forest-500 dark:bg-forest-800">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div className="mt-3 text-sm font-black">{label('Family Safety', 'Keselamatan Keluarga')}</div>
            <div className="text-[10px] font-bold text-slate-500 dark:text-emerald-100/70">{label('Safe zone & links', 'Zon selamat & pautan')}</div>
          </button>

          <button type="button" onClick={() => setActiveSection(activeSection === 'passport' ? null : 'passport')} className="rounded-2xl border border-slate-200 bg-white p-4 text-left transition hover:shadow-md dark:border-forest-500 dark:bg-forest-800">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-300">
              <QrCode className="h-5 w-5" />
            </div>
            <div className="mt-3 text-sm font-black">{label('Trail Passport', 'Pasport Denai')}</div>
            <div className="text-[10px] font-bold text-slate-500 dark:text-emerald-100/70">{label('Stamp checkpoints', 'Cop checkpoint')}</div>
          </button>
        </section>

        {/* ─── TRAILS SECTION ─── */}
        {activeSection === 'trails' && (
          <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-forest-500 dark:bg-forest-800">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-black">{label('Explore Trails', 'Terokai Denai')}</h3>
              <button type="button" onClick={() => setActiveSection(null)} className="text-slate-400"><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-2">
              {[
                { name: 'Family Loop', nameBm: 'Gelung Keluarga', dist: '4.2 km', diff: 'Easy', color: 'bg-green-100 text-green-700' },
                { name: 'Summit Trail', nameBm: 'Denai Puncak', dist: '3.8 km', diff: 'Moderate', color: 'bg-amber-100 text-amber-700' },
                { name: 'North Ridge', nameBm: 'Bukit Utara', dist: '5.1 km', diff: 'Hard', color: 'bg-red-100 text-red-700' },
                { name: 'Waterfall Path', nameBm: 'Laluan Air Terjun', dist: '2.5 km', diff: 'Easy', color: 'bg-green-100 text-green-700' },
                { name: 'Heritage Walk', nameBm: 'Jalan Warisan', dist: '3.0 km', diff: 'Easy', color: 'bg-green-100 text-green-700' },
                { name: 'Bird Watch Trail', nameBm: 'Denai Pemerhati Burung', dist: '2.8 km', diff: 'Easy', color: 'bg-green-100 text-green-700' },
                { name: 'Campsite Trek', nameBm: 'Jalur Kem', dist: '4.5 km', diff: 'Moderate', color: 'bg-amber-100 text-amber-700' },
                { name: 'Peak Challenge', nameBm: 'Cabaran Puncak', dist: '6.2 km', diff: 'Hard', color: 'bg-red-100 text-red-700' },
              ].map((trail) => (
                <div key={trail.name} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3 dark:border-forest-600 dark:bg-forest-900">
                  <div>
                    <div className="text-xs font-black">{label(trail.name, trail.nameBm)}</div>
                    <div className="text-[10px] font-bold text-slate-500">{trail.dist}</div>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${trail.color}`}>{trail.diff}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ─── CAR PARK ─── */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-forest-500 dark:bg-forest-800">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black">{label('Car Park', 'Parkir')}</h3>
              <p className="text-[10px] font-bold text-slate-500">{freeSpots} {label('spots free', 'tempat kosong')}</p>
            </div>
            <Pill tone={freeSpots < 20 ? 'amber' : 'green'}>{freeSpots}/{carPark?.capacity ?? 120}</Pill>
          </div>
          <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-forest-900">
            <div
              className={`h-full rounded-full transition-all ${freeSpots < 20 ? 'bg-amber-500' : 'bg-emerald-500'}`}
              style={{ width: `${carPark ? ((carPark.capacity - carPark.occupied) / carPark.capacity) * 100 : 100}%` }}
            />
          </div>
          <button type="button" onClick={() => setModal({ type: 'ticket' })} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-brand-700">
            <QrCode className="h-4 w-4" /> {label('Get e-Ticket', 'Dapatkan e-Tiket')}
          </button>
        </section>

        {/* ─── BOOKING SECTION ─── */}
        {activeSection === 'booking' && (
          <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-forest-500 dark:bg-forest-800">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-black">{label('Book a Facility', 'Tempah Fasiliti')}</h3>
              <button type="button" onClick={() => setActiveSection(null)} className="text-slate-400"><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-2">
              {bookable.map((facility) => {
                const Icon = facilityIcon[facility.type] ?? Castle;
                const pct = Math.round((facility.occupied / facility.capacity) * 100);
                return (
                  <button key={facility.id} type="button" onClick={() => setModal({ type: 'booking', facility })} className="flex w-full items-center gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 text-left transition hover:shadow-md dark:border-forest-600 dark:bg-forest-900">
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-100 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-black">{label(facility.nameEn, facility.nameBm)}</div>
                      <div className="text-[10px] font-bold text-slate-500">RM{facility.priceMyr} • {facility.occupied}/{facility.capacity} {label('booked', 'ditempah')}</div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* ─── SAFETY SECTION ─── */}
        {activeSection === 'safety' && (
          <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-forest-500 dark:bg-forest-800">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-black">{label('Family Safety', 'Keselamatan Keluarga')}</h3>
              <button type="button" onClick={() => setActiveSection(null)} className="text-slate-400"><X className="h-4 w-4" /></button>
            </div>

            {/* Safe zone toggle */}
            <button type="button" onClick={() => setSafeZone((v) => !v)} className={`mb-3 flex w-full items-center justify-between rounded-xl p-3 text-xs font-bold ${safeZone ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-slate-100 text-slate-600 dark:bg-forest-900 dark:text-emerald-100/70'}`}>
              <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> {label('50m Safe Zone Alert', 'Amaran Zon Selamat 50m')}</span>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-black ${safeZone ? 'bg-green-500 text-white' : 'bg-slate-300 text-slate-600'}`}>{safeZone ? 'ON' : 'OFF'}</span>
            </button>

            {/* Family members */}
            {familyMembers.length > 0 && (
              <div className="mb-3 space-y-1.5">
                {familyMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2 text-[11px] font-bold dark:bg-forest-900">
                    <span>{member.name} • {member.age ?? '—'}y</span>
                    <div className="flex items-center gap-2">
                      <Pill tone="green">{member.distanceM}m</Pill>
                      <button type="button" onClick={() => removeFamilyMember(member.id)} className="text-slate-400 hover:text-red-500"><X className="h-3 w-3" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Add member buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button type="button" onClick={() => { setFamilyName(''); setFamilyAge(''); setModal({ type: 'family', relation: 'child' }); }} className="rounded-xl border border-dashed border-slate-300 p-2.5 text-center text-[11px] font-bold text-slate-600 hover:border-brand-600 dark:border-forest-500 dark:text-emerald-100/70">
                <Baby className="mx-auto mb-1 h-4 w-4" /> {label('Add child', 'Tambah anak')}
              </button>
              <button type="button" onClick={() => { setFamilyName(''); setFamilyAge(68); setModal({ type: 'family', relation: 'elderly' }); }} className="rounded-xl border border-dashed border-slate-300 p-2.5 text-center text-[11px] font-bold text-slate-600 hover:border-brand-600 dark:border-forest-500 dark:text-emerald-100/70">
                <PersonStanding className="mx-auto mb-1 h-4 w-4" /> {label('Add elderly', 'Tambah warga emas')}
              </button>
            </div>
          </section>
        )}

        {/* ─── PASSPORT SECTION ─── */}
        {activeSection === 'passport' && (
          <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-forest-500 dark:bg-forest-800">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-black">{label('Trail Passport', 'Pasport Denai')}</h3>
              <button type="button" onClick={() => setActiveSection(null)} className="text-slate-400"><X className="h-4 w-4" /></button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {checkpoints.map((cp) => (
                <button key={cp.code} type="button" onClick={() => handleStamp(cp.code)} className={`rounded-xl border p-3 text-center transition ${stamps[cp.code] ? 'border-green-200 bg-green-50 dark:border-teal-400/30 dark:bg-forest-800' : 'border-dashed border-slate-300 bg-slate-50 hover:border-brand-600 dark:border-forest-500 dark:bg-forest-900'}`}>
                  <div className={`mx-auto grid h-8 w-8 place-items-center rounded-full ${stamps[cp.code] ? 'bg-green-600 text-white' : 'bg-brand-600 text-white'}`}>
                    {stamps[cp.code] ? <CalendarCheck className="h-4 w-4" /> : <QrCode className="h-4 w-4" />}
                  </div>
                  <div className="mt-1.5 text-[11px] font-black">{cp.name}</div>
                  <div className="text-[9px] font-bold text-slate-500">{cp.altitude ? `${cp.altitude}m` : cp.code}</div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ─── WILDLIFE SIGHTINGS ─── */}
        <section className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-forest-500 dark:bg-forest-800">
          <h3 className="mb-3 text-sm font-black">{label('Wildlife Sightings', 'Pemerhatian Hidupan')}</h3>
          <div className="space-y-2">
            {[
              { code: 'A' as const, en: 'Long-tailed macaque', bm: 'Kera ekor panjang', risk: 'high' as const, color: 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-900' },
              { code: 'B' as const, en: 'Pig-tailed macaque', bm: 'Beruk', risk: 'medium' as const, color: 'bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-900' },
              { code: 'C' as const, en: 'Dusky leaf monkey', bm: 'Lotong cengkung', risk: 'low' as const, color: 'bg-green-50 border-green-200 dark:bg-emerald-950/20 dark:border-emerald-900' },
            ].map((zone) => (
              <button key={zone.code} type="button" onClick={() => { setWildlifeNote(''); setModal({ type: 'wildlife', zone: { code: zone.code, en: zone.en, bm: zone.bm, risk: zone.risk } }); }} className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition hover:shadow-md ${zone.color}`}>
                <Bird className="h-5 w-5 shrink-0" />
                <div className="flex-1">
                  <div className="text-xs font-black">{label(zone.en, zone.bm)}</div>
                  <div className="text-[10px] font-bold opacity-70">{label('Tap to report', 'Tekan untuk lapor')}</div>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 opacity-50" />
              </button>
            ))}
          </div>
        </section>

        {/* ─── INSTAL APP ─── */}
        {installPrompt && (
          <button type="button" onClick={async () => { await installPrompt.prompt(); setInstallPrompt(null); }} className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white p-3 text-xs font-bold text-slate-700 transition hover:shadow-md dark:border-forest-500 dark:bg-forest-800 dark:text-emerald-100">
            <Download className="h-4 w-4" /> {label('Install malim app', 'Pasang aplikasi malim')}
          </button>
        )}
      </main>

      {/* ─── SOS BUTTON ─── */}
      <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2">
        <button type="button" onClick={() => setModal({ type: 'sos-confirm' })} className="grid h-20 w-20 place-items-center rounded-full bg-red-600 text-white shadow-2xl shadow-red-600/40 transition active:scale-95">
          <Siren className="h-8 w-8" />
        </button>
        <div className="mt-1 text-center text-[10px] font-bold text-red-600">SOS</div>
      </div>

      {/* ─── MODALS ─── */}
      {modal && (
        <div className="fixed inset-0 z-[70] grid place-items-center p-4">
          <button type="button" aria-label="Close" className="absolute inset-0 bg-black/45 backdrop-blur-sm" onClick={() => setModal(null)} />
          <div className="card relative max-h-[86vh] w-full max-w-md overflow-auto bg-white p-5 dark:bg-forest-700">
            <button type="button" onClick={() => setModal(null)} className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-slate-100 dark:bg-forest-900"><X className="h-4 w-4" /></button>

            {modal.type === 'booking' && (
              <>
                <h3 className="pr-8 text-sm font-black">{label('Book', 'Tempah')} {label(modal.facility.nameEn, modal.facility.nameBm)}</h3>
                <div className="mt-4 space-y-3">
                  <label className="block text-xs font-black">{label('Your name', 'Nama anda')}
                    <input value={bookingName} onChange={(e) => setBookingName(e.target.value)} placeholder={auth.user.name} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 dark:border-forest-500 dark:bg-forest-900" />
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="block text-xs font-black">{label('Party size', 'Saiz kumpulan')}
                      <input type="number" min="1" max="20" value={partySize} onChange={(e) => setPartySize(Number(e.target.value))} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 dark:border-forest-500 dark:bg-forest-900" />
                    </label>
                    <label className="block text-xs font-black">{label('Date', 'Tarikh')}
                      <input type="date" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 dark:border-forest-500 dark:bg-forest-900" />
                    </label>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 text-xs font-bold dark:bg-forest-900">RM{modal.facility.priceMyr}</div>
                  <button type="button" onClick={submitBooking} className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-brand-700">
                    <CalendarCheck className="h-4 w-4" /> {label('Confirm booking', 'Sahkan tempahan')}
                  </button>
                </div>
              </>
            )}

            {modal.type === 'booking-result' && (
              <div className="text-center">
                <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-green-100 text-green-600"><CalendarCheck className="h-8 w-8" /></div>
                <h3 className="mt-3 text-sm font-black">{label('Booking confirmed!', 'Tempahan disahkan!')}</h3>
                <p className="mt-1 text-xs font-bold text-slate-500">{modal.booking.guestName} • {modal.booking.partySize} pax • {modal.booking.checkInDate}</p>
                {modal.booking.smartLockPin && <Pill tone="green">PIN: {modal.booking.smartLockPin}</Pill>}
              </div>
            )}

            {modal.type === 'ticket' && (
              <div className="text-center">
                <div className="mx-auto mb-3 grid h-40 w-40 place-items-center rounded-2xl border-2 border-brand-600 bg-white p-3">
                  <div>
                    <div className="mx-auto mb-2 grid h-20 w-20 grid-cols-5 gap-0.5">
                      {Array.from({ length: 25 }, (_, i) => <span key={i} className={[0, 1, 2, 5, 7, 10, 12, 14, 17, 19, 22, 23, 24, 6, 16, 18].includes(i) ? 'bg-slate-950' : 'bg-white'} />)}
                    </div>
                    <div className="font-mono text-[10px] font-black text-slate-950">LAMBAK-ENTRY</div>
                  </div>
                </div>
                <h3 className="text-sm font-black">{label('Your e-Ticket', 'e-Tiket anda')}</h3>
                <p className="mt-1 text-xs font-bold text-slate-500">{label('Show this QR code at the entrance', 'Tunjukkan kod QR ini di pintu masuk')}</p>
              </div>
            )}

            {modal.type === 'sos-confirm' && (
              <div className="text-center">
                <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-red-100 text-3xl">🚨</div>
                <h3 className="mt-3 text-base font-black">{label('Send emergency SOS?', 'Hantar SOS kecemasan?')}</h3>
                <p className="mt-2 text-xs font-bold text-slate-500">{label('GPS, battery, and family links will be sent to rescue teams.', 'GPS, bateri, dan pautan keluarga akan dihantar kepada pasukan penyelamat.')}</p>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setModal(null)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold dark:border-forest-500">{label('Cancel', 'Batal')}</button>
                  <button type="button" onClick={() => setModal({ type: 'sos-result', alert: { id: '1', name: auth.user.name, etaMinutes: 8, latitude: 2.0, longitude: 103.0, familyCount: familyMembers.length, battery: 78, status: 'dispatched', createdAt: new Date().toISOString() } })} className="rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold text-white">{label('Send SOS', 'Hantar SOS')}</button>
                </div>
              </div>
            )}

            {modal.type === 'sos-result' && (
              <div className="text-center">
                <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-red-100 text-3xl">🚑</div>
                <h3 className="mt-3 text-base font-black">{label('SOS dispatched!', 'SOS dihantar!')}</h3>
                <p className="mt-2 text-xs font-bold text-slate-500">{label('Rescue team is on the way. ETA', 'Pasukan penyelamat dalam perjalanan. ETA')} <strong>{modal.alert.etaMinutes} min</strong></p>
                <button type="button" onClick={() => setModal(null)} className="mt-4 rounded-xl bg-brand-600 px-6 py-2.5 text-xs font-bold text-white">{label('OK', 'OK')}</button>
              </div>
            )}

            {modal.type === 'family' && (
              <>
                <h3 className="pr-8 text-sm font-black">{modal.relation === 'child' ? label('Link a child', 'Paut kanak-kanak') : label('Link an elderly member', 'Paut ahli warga emas')}</h3>
                <div className="mt-4 space-y-3">
                  <label className="block text-xs font-black">{label('Name', 'Nama')}
                    <input value={familyName} onChange={(e) => setFamilyName(e.target.value)} placeholder={label('e.g. Aisyah', 'cth. Aisyah')} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 dark:border-forest-500 dark:bg-forest-900" />
                  </label>
                  <label className="block text-xs font-black">{label('Age', 'Umur')}
                    <input type="number" min="0" max="120" value={familyAge} onChange={(e) => setFamilyAge(e.target.value === '' ? '' : Number(e.target.value))} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 dark:border-forest-500 dark:bg-forest-900" />
                  </label>
                  <button type="button" onClick={addFamilyMember} className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-brand-700">
                    <ShieldCheck className="h-4 w-4" /> {label('Enable safe zone', 'Aktif zon selamat')}
                  </button>
                </div>
              </>
            )}

            {modal.type === 'wildlife' && (
              <>
                <h3 className="pr-8 text-sm font-black">{label('Report Sighting', 'Lapor Pemerhatian')}</h3>
                <p className="mt-1 text-xs font-bold text-slate-500">{label(modal.zone.en, modal.zone.bm)}</p>
                <label className="mt-3 block text-xs font-black">{label('Note (optional)', 'Nota (pilihan)')}
                  <textarea value={wildlifeNote} onChange={(e) => setWildlifeNote(e.target.value)} rows={3} placeholder={label('e.g. group near bin', 'cth. kumpulan berhampiran tong')} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 dark:border-forest-500 dark:bg-forest-900" />
                </label>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setModal(null)} className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-bold dark:border-forest-500">{label('Cancel', 'Batal')}</button>
                  <button type="button" onClick={() => setModal(null)} className="rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-bold text-white">{label('Report', 'Lapor')}</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
