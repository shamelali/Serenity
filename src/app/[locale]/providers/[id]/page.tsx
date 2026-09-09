import { notFound } from "next/navigation";
import { PublicNavbar } from "@/components/layout/public-navbar";
import { BookingWidget } from "@/components/marketplace/booking-widget";
import { StaticStars } from "@/components/ui/star-rating";
import { Badge, EmptyState } from "@/components/ui/primitives";
import { formatCurrency, formatDuration, formatTime, initials } from "@/lib/utils";
import { MapPin, Phone, Mail, MessageSquareText, Star } from "lucide-react";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/get-dictionary";
import { MOCK_PROVIDERS } from "@/lib/mock-data";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return MOCK_PROVIDERS.map((p) => ({ id: p.id }));
}

export default async function ProviderDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale: rawLocale, id } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const dict = getDictionary(locale);

  const provider = MOCK_PROVIDERS.find((p) => p.id === id);
  if (!provider) notFound();

  // Mock services data
  const mockServices = [
    {
      id: "svc-1",
      name: provider.type === "spa" ? "Traditional Malay Massage" : "Swedish Massage",
      description: "Full body relaxation massage with traditional techniques",
      durationMinutes: 60,
      price: Number(provider.priceFrom),
      category: "Massage",
      isActive: true,
    },
    {
      id: "svc-2",
      name: "Aromatherapy Session",
      description: "Essential oil therapy for stress relief and wellness",
      durationMinutes: 90,
      price: Number(provider.priceFrom) + 50,
      category: "Therapy",
      isActive: true,
    },
    {
      id: "svc-3",
      name: "Hot Stone Therapy",
      description: "Heated stones for deep muscle relaxation",
      durationMinutes: 75,
      price: Number(provider.priceFrom) + 80,
      category: "Massage",
      isActive: true,
    },
  ];

  // Mock availability
  const mockAvailability = [
    { id: "av-1", dayOfWeek: 1, startTime: "09:00", endTime: "18:00", isActive: true },
    { id: "av-2", dayOfWeek: 2, startTime: "09:00", endTime: "18:00", isActive: true },
    { id: "av-3", dayOfWeek: 3, startTime: "09:00", endTime: "18:00", isActive: true },
    { id: "av-4", dayOfWeek: 4, startTime: "09:00", endTime: "18:00", isActive: true },
    { id: "av-5", dayOfWeek: 5, startTime: "09:00", endTime: "17:00", isActive: true },
    { id: "av-6", dayOfWeek: 6, startTime: "10:00", endTime: "16:00", isActive: true },
  ];

  // Mock reviews
  const mockReviews = [
    {
      id: "rev-1",
      rating: 5,
      comment: "Excellent service! Very professional and relaxing atmosphere. Highly recommended.",
      createdAt: new Date("2024-11-15"),
      customerName: "Ahmad R.",
    },
    {
      id: "rev-2",
      rating: 4,
      comment: "Great experience overall. The therapist was skilled and attentive.",
      createdAt: new Date("2024-11-10"),
      customerName: "Siti N.",
    },
    {
      id: "rev-3",
      rating: 5,
      comment: "Best massage in town! Will definitely come back.",
      createdAt: new Date("2024-11-05"),
      customerName: "Lim K.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <PublicNavbar locale={locale} />

      {/* Hero with Provider Image */}
      <div className="relative bg-gradient-to-br from-teal-600 to-emerald-700 py-10 text-white">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20" style={{ backgroundImage: `url("${provider.imageUrl}")` }} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <Badge className="bg-white/15 text-white">{dict.providerTypes[provider.type]}</Badge>
              <h1 className="mt-3 text-3xl font-bold sm:text-4xl">{provider.businessName}</h1>
              <p className="mt-2 max-w-2xl text-teal-50">{provider.tagline}</p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-teal-50">
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" /> {provider.address ? `${provider.address}, ` : ""}
                  {provider.city}
                </span>
                {provider.phone && (
                  <span className="flex items-center gap-1.5">
                    <Phone className="h-4 w-4" /> {provider.phone}
                  </span>
                )}
                {provider.email && (
                  <span className="flex items-center gap-1.5">
                    <Mail className="h-4 w-4" /> {provider.email}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3">
              <StaticStars value={Number(provider.rating)} />
              <span className="font-semibold">{Number(provider.rating).toFixed(1)}</span>
              <span className="text-sm text-teal-100">({provider.reviewCount} reviews)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Provider Image Gallery */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-sm">
          <div className="aspect-video bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url("${provider.imageUrl}")` }} />
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-8 sm:px-6 lg:grid-cols-3 lg:px-8">
        <div className="space-y-8 lg:col-span-2">
          <section>
            <h2 className="text-lg font-semibold text-slate-900">{dict.providerDetail.about}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">{provider.description || dict.providerDetail.aboutFallback}</p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900">{dict.providerDetail.services}</h2>
            <div className="mt-3 divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white">
              {mockServices.map((service) => (
                <div key={service.id} className="flex items-center justify-between gap-4 p-4">
                  <div>
                    <p className="font-medium text-slate-900">{service.name}</p>
                    <p className="mt-0.5 text-sm text-slate-500">{service.description}</p>
                    <div className="mt-1.5 flex items-center gap-2 text-xs text-slate-400">
                      <Badge variant="neutral">{service.category}</Badge>
                      <span>{formatDuration(service.durationMinutes)}</span>
                    </div>
                  </div>
                  <p className="shrink-0 font-semibold text-slate-900">{formatCurrency(service.price)}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-slate-900">{dict.providerDetail.weeklyAvailability}</h2>
            <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {mockAvailability.map((a) => (
                <div key={a.id} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm">
                  <p className="font-medium text-slate-800">{dict.days[a.dayOfWeek as keyof typeof dict.days]}</p>
                  <p className="text-xs text-slate-500">
                    {formatTime(a.startTime)} – {formatTime(a.endTime)}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900">
              <Star className="h-5 w-5 text-amber-500" /> {dict.providerDetail.reviews} ({mockReviews.length})
            </h2>
            <div className="mt-3 space-y-3">
              {mockReviews.map((r) => (
                <div key={r.id} className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-xs font-semibold text-teal-700">
                        {initials(r.customerName)}
                      </span>
                      <p className="text-sm font-medium text-slate-800">{r.customerName}</p>
                    </div>
                    <StaticStars value={r.rating} size={14} />
                  </div>
                  <p className="mt-2 text-sm text-slate-600">{r.comment}</p>
                  <p className="mt-1 text-xs text-slate-400">{formatTime(r.createdAt.toString())}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div>
          <BookingWidget providerId={provider.id} services={mockServices} currentUserRole={null} />
        </div>
      </div>
    </div>
  );
}