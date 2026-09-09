import { PublicNavbar } from "@/components/layout/public-navbar";
import { SearchFilters } from "@/components/marketplace/search-filters";
import { ProviderCard } from "@/components/marketplace/provider-card";
import { EmptyState } from "@/components/ui/primitives";
import { Search, ShieldCheck, CalendarCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { isLocale, localizedPath, type Locale } from "@/lib/i18n/config";
import { getDictionary, format } from "@/lib/i18n/get-dictionary";
import { notFound } from "next/navigation";
import { getMockProviders } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export default async function HomePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string; city?: string; type?: string; state?: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const dict = getDictionary(locale);
  const searchParamsResolved = await searchParams;

  // Default to Kuala Lumpur coordinates for server-side initial render
  const userLat = 3.139;
  const userLon = 101.6869;

  const rows = getMockProviders({
    city: searchParamsResolved.city,
    type: searchParamsResolved.type,
    state: searchParamsResolved.state,
    q: searchParamsResolved.q,
    sort: "nearest",
    userLat,
    userLon,
  });

  const hasFilters = Boolean(
    searchParamsResolved.q ||
      (searchParamsResolved.city && searchParamsResolved.city !== "all") ||
      (searchParamsResolved.type && searchParamsResolved.type !== "all") ||
      (searchParamsResolved.state && searchParamsResolved.state !== "all")
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <PublicNavbar locale={locale} />

      {/* Hero Section with Background Image */}
      <section className="relative overflow-hidden border-b border-slate-200">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: 'url("/images/landing/hero-spa.jpg")' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-teal-900/80 via-teal-700/60 to-teal-500/20" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> {dict.home.badge}
            </span>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">{dict.home.title}</h1>
            <p className="mt-4 text-lg text-white/90 sm:text-xl">{dict.home.subtitle}</p>
          </div>
          <div className="mx-auto mt-10 max-w-3xl">
            <SearchFilters />
          </div>

          {/* How It Works - with images */}
          <div className="mx-auto mt-16">
            <h2 className="text-center text-2xl font-bold text-white mb-10">How It Works</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {/* Step 1: Discover */}
              <div className="relative rounded-2xl overflow-hidden bg-white/10 backdrop-blur-sm p-6 border border-white/20">
                <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10" style={{ backgroundImage: 'url("/images/landing/discover.jpg")' }} />
                <div className="relative flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center backdrop-blur">
                    <Search className="h-6 w-6 text-teal-400" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white">{dict.home.stepDiscoverTitle}</p>
                    <p className="mt-1 text-sm text-white/80">{dict.home.stepDiscoverDesc}</p>
                  </div>
                </div>
              </div>

              {/* Step 2: Book */}
              <div className="relative rounded-2xl overflow-hidden bg-white/10 backdrop-blur-sm p-6 border border-white/20">
                <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10" style={{ backgroundImage: 'url("/images/landing/book.jpg")' }} />
                <div className="relative flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center backdrop-blur">
                    <CalendarCheck className="h-6 w-6 text-teal-400" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white">{dict.home.stepBookTitle}</p>
                    <p className="mt-1 text-sm text-white/80">{dict.home.stepBookDesc}</p>
                  </div>
                </div>
              </div>

              {/* Step 3: Relax */}
              <div className="relative rounded-2xl overflow-hidden bg-white/10 backdrop-blur-sm p-6 border border-white/20">
                <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10" style={{ backgroundImage: 'url("/images/landing/relax.jpg")' }} />
                <div className="relative flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-teal-500/20 flex items-center justify-center backdrop-blur">
                    <ShieldCheck className="h-6 w-6 text-teal-400" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-white">{dict.home.stepRelaxTitle}</p>
                    <p className="mt-1 text-sm text-white/80">{dict.home.stepRelaxDesc}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wellness Benefits Section */}
      <section className="relative py-20 sm:py-28">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-5" style={{ backgroundImage: 'url("/images/landing/wellness-bg.jpg")' }} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Why Choose Serenity</h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Trusted by thousands across Malaysia for authentic wellness experiences
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <BenefitCard icon="🏆" title={dict.home.stepDiscoverTitle} desc="Verified, licensed professionals with real reviews" />
            <BenefitCard icon="💰" title="Transparent Pricing" desc="Clear, upfront pricing in MYR — no hidden fees" />
            <BenefitCard icon="📍" title="Near You" desc="Providers across all 15 Malaysian states & territories" />
            <BenefitCard icon="🔒" title="Secure Booking" desc="Safe, encrypted payments & instant confirmations" />
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">
            {hasFilters
              ? rows.length === 1
                ? dict.home.resultOne
                : format(dict.home.resultMany, { count: rows.length })
              : dict.home.popularProviders}
          </h2>
          {hasFilters && (
            <Link href={localizedPath(locale, "/")} className="text-sm font-medium text-teal-700 hover:underline">
              {dict.home.clearFilters}
            </Link>
          )}
        </div>

        {rows.length === 0 ? (
          <EmptyState icon={<Search className="h-6 w-6" />} title={dict.home.noProvidersTitle} description={dict.home.noProvidersDesc} />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} locale={locale} dict={dict} />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-slate-200 bg-white py-8 text-center text-sm text-slate-500">
        {dict.home.footer}
      </footer>
    </div>
  );
}

function BenefitCard({ icon, title, desc }: { icon: string; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-lg transition-shadow">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{desc}</p>
    </div>
  );
}