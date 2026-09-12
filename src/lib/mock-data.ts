import type { Provider } from "@/db/schema";

type MockProvider = Provider & { latitude?: number; longitude?: number };

export const MOCK_PROVIDERS: MockProvider[] = [
  {
    id: "prov-1",
    userId: "user-1",
    businessName: "Urban Retreat Spa",
    type: "spa",
    tagline: "Kesan spa premi di jantung Kuala Lumpur",
    description:
      "Urban Retreat Spa menawarkan pengalaman kesihatan holistik dengan rawatan tanda tangan seperti Urutan Melayu Tradisional, Aromaterapi, dan Rawatan Muka Organik. Terletak di Bangsar, kami menyediakan persekitaran yang tenang untuk anda bersantai dan memulihkan tenaga.",
    city: "Kuala Lumpur",
    state: "kul",
    address: "12, Jalan Telawi 3, Bangsar Baru, 59100 Kuala Lumpur",
    phone: "+60 12-345 6789",
    email: "hello@urbanretreatspa.my",
    imageUrl: "/images/providers/urban-retreat.jpg",
    priceFrom: "180",
    rating: "4.8",
    reviewCount: 127,
    isActive: true,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-11-20"),
    latitude: 3.1390,
    longitude: 101.6869,
  },
  {
    id: "prov-2",
    userId: "user-2",
    businessName: "Heritage Wellness Centre",
    type: "wellness_center",
    tagline: "Rawatan tradisional Melayu & Cina moden",
    description:
      "Menggabungkan bijaksana tradisional Melayu (urut, cupping, herba) dengan amalan kesihatan moden. Pakar kami disahkan oleh Kementerian Kesihatan Malaysia. Khidmatkan Rawatan Pascabersalin, Urutan Terapi, dan Program Detoks.",
    city: "Kuala Lumpur",
    state: "kul",
    address: "Tingkat 2, Blok C, Plaza Mont Kiara, 50480 Kuala Lumpur",
    phone: "+60 19-876 5432",
    email: "care@heritagewellness.my",
    imageUrl: "/images/providers/heritage-wellness.jpg",
    priceFrom: "150",
    rating: "4.6",
    reviewCount: 89,
    isActive: true,
    createdAt: new Date("2023-11-10"),
    updatedAt: new Date("2024-10-15"),
    latitude: 3.1729,
    longitude: 101.6543,
  },
  {
    id: "prov-3",
    userId: "user-3",
    businessName: "Penang Harmony Massage",
    type: "massage_center",
    tagline: "Urutan terapi di Georgetown, Penang",
    description:
      "Beroperasi sejak 2010 di kawasan warisan UNESCO. Pakar urutan Sweden, Deep Tissue, Hot Stone, dan Reflekologi Kaki. Semua terapis berlesen dan berkelayakan Diploma Terapi Urutan. Dijangkau dari Lebuh Chulia.",
    city: "George Town",
    state: "pns",
    address: "88, Lebuh Chulia, 10200 George Town, Pulau Pinang",
    phone: "+60 16-555 0123",
    email: "book@penangharmony.com",
    imageUrl: "/images/providers/penang-harmony.jpg",
    priceFrom: "120",
    rating: "4.7",
    reviewCount: 203,
    isActive: true,
    createdAt: new Date("2023-08-22"),
    updatedAt: new Date("2024-11-01"),
    latitude: 5.4164,
    longitude: 100.3327,
  },
  {
    id: "prov-4",
    userId: "user-4",
    businessName: "Johor Bahru Physio & Rehab",
    type: "physiotherapy",
    tagline: "Fisioterapi & rehabilitasi sukan profesional",
    description:
      "Klinik fisioterapi berlesen penuh dengan pakar perehab sukan. Rawatan untuk cedera sukan, nyeri belakang, pemulihan pasca-bedah, dan kondisi kronik. Perlengkapan moden: terapi gelombang kejut, ultrasound, gym rehabilitasi.",
    city: "Johor Bahru",
    state: "jhr",
    address: "No. 15, Jalan Molek 1/10, Taman Molek, 81100 Johor Bahru",
    phone: "+60 17-777 8899",
    email: "info@jbphysio.my",
    imageUrl: "/images/providers/jb-physio.jpg",
    priceFrom: "200",
    rating: "4.9",
    reviewCount: 156,
    isActive: true,
    createdAt: new Date("2023-05-18"),
    updatedAt: new Date("2024-11-25"),
    latitude: 1.4927,
    longitude: 103.7414,
  },
  {
    id: "prov-5",
    userId: "user-5",
    businessName: "Seri Ayu Spa & Wellness",
    type: "spa",
    tagline: "Spa Islamik & halal-certified di Shah Alam",
    description:
      "Spa pertama di Selangor dengan sijil Halal JAKIM. Rawatan untuk wanita sahaja oleh terapis wanita. Paket khas: Mandi Bunga, Urutan Pasca Bersalin, Rawatan Muka Halal. Ruang persendirian & fasiliti solat disediakan.",
    city: "Shah Alam",
    state: "sgr",
    address: "Lot 3-2, Seksyen 13, 40100 Shah Alam, Selangor",
    phone: "+60 13-222 3344",
    email: "salam@seriayu.my",
    imageUrl: "/images/providers/seri-ayu.jpg",
    priceFrom: "160",
    rating: "4.8",
    reviewCount: 94,
    isActive: true,
    createdAt: new Date("2024-02-14"),
    updatedAt: new Date("2024-11-10"),
    latitude: 3.0733,
    longitude: 101.5185,
  },
  {
    id: "prov-6",
    userId: "user-6",
    businessName: "Kota Kinabalu Healing Hands",
    type: "therapist",
    tagline: "Terapis urutan berpengalaman 15+ tahun",
    description:
      "Terapis senior berpengalaman di hospital swasta & spa resort. Pakar Urutan Terapi Klinikal, Pijat Reflekologi, dan Rawatan Penderita Stroke. Servis ke rumah/tempat tinggal tersedia di kawasan KK & Tuaran.",
    city: "Kota Kinabalu",
    state: "sbh",
    address: "Blok B, Lorong Lintas Plaza, 88300 Kota Kinabalu, Sabah",
    phone: "+60 14-999 0011",
    email: "healing@kkhands.my",
    imageUrl: "/images/providers/kk-healing.jpg",
    priceFrom: "100",
    rating: "4.5",
    reviewCount: 67,
    isActive: true,
    createdAt: new Date("2023-12-01"),
    updatedAt: new Date("2024-10-20"),
    latitude: 5.9804,
    longitude: 116.0735,
  },
  {
    id: "prov-7",
    userId: "user-7",
    businessName: "Ipoh Traditional Wellness",
    type: "wellness_center",
    tagline: "Warisan urutan & herba Ipoh sejak 1985",
    description:
      "Ditubuhkan oleh Tok Urut Pak Wan. Warisan 3 generasi dalam urutan tradisional Melayu, ramuan herba asli Perak, dan cupping therapy. Popular: Urutan Buah Pinggang, Minyak Ubat Cap Rambutan.",
    city: "Ipoh",
    state: "pgk",
    address: "22, Jalan Sultan Abdul Jalil, 30300 Ipoh, Perak",
    phone: "+60 11-2345 6789",
    email: "warisan@ipohwellness.my",
    imageUrl: "/images/providers/ipoh-traditional.jpg",
    priceFrom: "90",
    rating: "4.7",
    reviewCount: 134,
    isActive: true,
    createdAt: new Date("2022-06-30"),
    updatedAt: new Date("2024-09-15"),
    latitude: 4.5975,
    longitude: 101.0901,
  },
  {
    id: "prov-8",
    userId: "user-8",
    businessName: "Melaka Chill Spa",
    type: "spa",
    tagline: "Santai di bandar sejarah dengan pemandangan sungai",
    description:
      "Spa boutique di tepi Sungai Melaka dengan pemandangan menakjubkan. Rawatan inspirasi Peranakan: Urutan Minyak Cengkih, Mandi Susu Kambing, Scrub Kopi Luwak. Sesuai untuk pasangan & lawatan romatik.",
    city: "Melaka",
    state: "mlk",
    address: "No. 5, Jalan Merdeka, 75000 Melaka",
    phone: "+60 18-444 5566",
    email: "relax@melakachill.my",
    imageUrl: "/images/providers/melaka-chill.jpg",
    priceFrom: "220",
    rating: "4.6",
    reviewCount: 78,
    isActive: true,
    createdAt: new Date("2024-03-20"),
    updatedAt: new Date("2024-11-18"),
    latitude: 2.1896,
    longitude: 102.2498,
  },
  {
    id: "prov-9",
    userId: "user-9",
    businessName: "Kuching Wellness Hub",
    type: "wellness_center",
    tagline: "Pusat kesejahteraan komprehensif di Sarawak",
    description:
      "Di bawah satu bumbung: Fisioterapi, Kiropraktik, Psikologi, Nutrisi, dan Kelas Yoga/Pilates. Fasiliti: Gym rehab, kolam hidroterapi, studio yoga. Panel klinik KWSP, SOCSO, & insurans utama.",
    city: "Kuching",
    state: "swk",
    address: "Tingkat 3, The Spring Shopping Mall, Jalan Simpang Tiga, 93350 Kuching",
    phone: "+60 10-888 7777",
    email: "hub@kuchingwellness.my",
    imageUrl: "/images/providers/kuching-hub.jpg",
    priceFrom: "180",
    rating: "4.7",
    reviewCount: 112,
    isActive: true,
    createdAt: new Date("2023-09-12"),
    updatedAt: new Date("2024-11-05"),
    latitude: 1.5533,
    longitude: 110.3592,
  },
  {
    id: "prov-10",
    userId: "user-10",
    businessName: "Alor Setar Chiropractic Care",
    type: "chiropractor",
    tagline: "Kiropraktor berlesen ACA & AMCA di Utara",
    description:
      "Rawatan tulang belakang & saraf tanpa bedah. Pakar: Sakit kepala migren, kesan whiplash, skoliosis, dan penyesuaian bayi/kanak-kanak. Peralatan moden: Meja Flexion-Distraction, Digital X-Ray dalam premis.",
    city: "Alor Setar",
    state: "kdh",
    address: "No. 1, Lorong Stadium 2, 05100 Alor Setar, Kedah",
    phone: "+60 12-666 7788",
    email: "spine@alasetarchiro.my",
    imageUrl: "/images/providers/alasetar-chiro.jpg",
    priceFrom: "150",
    rating: "4.8",
    reviewCount: 53,
    isActive: true,
    createdAt: new Date("2024-01-08"),
    updatedAt: new Date("2024-10-30"),
    latitude: 6.1248,
    longitude: 100.3677,
  },
];

export const MOCK_CITIES = [
  "Kuala Lumpur",
  "George Town",
  "Johor Bahru",
  "Shah Alam",
  "Kota Kinabalu",
  "Ipoh",
  "Melaka",
  "Kuching",
  "Alor Setar",
];

export const SORT_OPTIONS = [
  { value: "nearest", labelKey: "sort.nearest" },
  { value: "rating", labelKey: "sort.rating" },
  { value: "price_low", labelKey: "sort.priceLow" },
  { value: "price_high", labelKey: "sort.priceHigh" },
  { value: "name", labelKey: "sort.name" },
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number]["value"];

function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function getMockProviders(filters?: {
  city?: string;
  type?: string;
  state?: string;
  q?: string;
  sort?: SortOption;
  userLat?: number;
  userLon?: number;
}): Provider[] {
  let results = MOCK_PROVIDERS.filter((p) => p.isActive);

  if (filters?.city && filters.city !== "all") {
    results = results.filter((p) => p.city === filters.city);
  }
  if (filters?.type && filters.type !== "all") {
    results = results.filter((p) => p.type === filters.type);
  }
  if (filters?.state && filters.state !== "all") {
    results = results.filter((p) => p.state === filters.state);
  }
  if (filters?.q) {
    const query = filters.q.toLowerCase();
    results = results.filter(
      (p) =>
        p.businessName.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.tagline?.toLowerCase().includes(query)
    );
  }

  const sort = filters?.sort ?? "nearest";
  const userLat = filters?.userLat ?? 3.139;
  const userLon = filters?.userLon ?? 101.6869;

  switch (sort) {
    case "nearest":
      results.sort((a, b) => {
        const distA = a.latitude && a.longitude
          ? haversineDistance(userLat, userLon, a.latitude, a.longitude)
          : Infinity;
        const distB = b.latitude && b.longitude
          ? haversineDistance(userLat, userLon, b.latitude, b.longitude)
          : Infinity;
        return distA - distB;
      });
      break;
    case "rating":
      results.sort((a, b) => Number(b.rating) - Number(a.rating));
      break;
    case "price_low":
      results.sort((a, b) => Number(a.priceFrom) - Number(b.priceFrom));
      break;
    case "price_high":
      results.sort((a, b) => Number(b.priceFrom) - Number(a.priceFrom));
      break;
    case "name":
    default:
      results.sort((a, b) => a.businessName.localeCompare(b.businessName));
  }

  return results;
}