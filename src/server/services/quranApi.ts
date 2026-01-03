import { Surah, Ayah } from '../types/index.js';

// Al-Quran Cloud API base URL
const API_BASE = 'https://api.alquran.cloud/v1';

// Translation editions
const BANGLA_EDITION = 'bn.bengali';
const ENGLISH_EDITION = 'en.sahih';
const ARABIC_EDITION = 'quran-uthmani';

// Cache for surah data
const surahCache: Map<number, Surah> = new Map();
const surahListCache: Surah[] = [];

// Surah metadata (name, transliteration, translation, type)
const SURAH_METADATA: Array<{ name: string; transliteration: string; translation: string; type: 'Meccan' | 'Medinan'; totalAyahs: number }> = [
  { name: 'الفاتحة', transliteration: 'Al-Fatihah', translation: 'সূচনা', type: 'Meccan', totalAyahs: 7 },
  { name: 'البقرة', transliteration: 'Al-Baqarah', translation: 'গাভী', type: 'Medinan', totalAyahs: 286 },
  { name: 'آل عمران', transliteration: 'Aal-E-Imran', translation: 'ইমরানের পরিবার', type: 'Medinan', totalAyahs: 200 },
  { name: 'النساء', transliteration: 'An-Nisa', translation: 'নারী', type: 'Medinan', totalAyahs: 176 },
  { name: 'المائدة', transliteration: 'Al-Maidah', translation: 'খাদ্য পরিবেশিত টেবিল', type: 'Medinan', totalAyahs: 120 },
  { name: 'الأنعام', transliteration: 'Al-Anam', translation: 'গবাদি পশু', type: 'Meccan', totalAyahs: 165 },
  { name: 'الأعراف', transliteration: 'Al-Araf', translation: 'উঁচু স্থানসমূহ', type: 'Meccan', totalAyahs: 206 },
  { name: 'الأنفال', transliteration: 'Al-Anfal', translation: 'যুদ্ধলব্ধ সম্পদ', type: 'Medinan', totalAyahs: 75 },
  { name: 'التوبة', transliteration: 'At-Tawbah', translation: 'অনুশোচনা', type: 'Medinan', totalAyahs: 129 },
  { name: 'يونس', transliteration: 'Yunus', translation: 'ইউনুস', type: 'Meccan', totalAyahs: 109 },
  { name: 'هود', transliteration: 'Hud', translation: 'হুদ', type: 'Meccan', totalAyahs: 123 },
  { name: 'يوسف', transliteration: 'Yusuf', translation: 'ইউসুফ', type: 'Meccan', totalAyahs: 111 },
  { name: 'الرعد', transliteration: 'Ar-Rad', translation: 'বজ্রপাত', type: 'Medinan', totalAyahs: 43 },
  { name: 'إبراهيم', transliteration: 'Ibrahim', translation: 'ইব্রাহিম', type: 'Meccan', totalAyahs: 52 },
  { name: 'الحجر', transliteration: 'Al-Hijr', translation: 'পাথুরে পাহাড়', type: 'Meccan', totalAyahs: 99 },
  { name: 'النحل', transliteration: 'An-Nahl', translation: 'মৌমাছি', type: 'Meccan', totalAyahs: 128 },
  { name: 'الإسراء', transliteration: 'Al-Isra', translation: 'রাতের যাত্রা', type: 'Meccan', totalAyahs: 111 },
  { name: 'الكهف', transliteration: 'Al-Kahf', translation: 'গুহা', type: 'Meccan', totalAyahs: 110 },
  { name: 'مريم', transliteration: 'Maryam', translation: 'মারইয়াম', type: 'Meccan', totalAyahs: 98 },
  { name: 'طه', transliteration: 'Taha', translation: 'তা-হা', type: 'Meccan', totalAyahs: 135 },
  { name: 'الأنبياء', transliteration: 'Al-Anbiya', translation: 'নবীগণ', type: 'Meccan', totalAyahs: 112 },
  { name: 'الحج', transliteration: 'Al-Hajj', translation: 'হজ্জ', type: 'Medinan', totalAyahs: 78 },
  { name: 'المؤمنون', transliteration: 'Al-Muminun', translation: 'বিশ্বাসীগণ', type: 'Meccan', totalAyahs: 118 },
  { name: 'النور', transliteration: 'An-Nur', translation: 'আলো', type: 'Medinan', totalAyahs: 64 },
  { name: 'الفرقان', transliteration: 'Al-Furqan', translation: 'মানদণ্ড', type: 'Meccan', totalAyahs: 77 },
  { name: 'الشعراء', transliteration: 'Ash-Shuara', translation: 'কবিগণ', type: 'Meccan', totalAyahs: 227 },
  { name: 'النمل', transliteration: 'An-Naml', translation: 'পিপীলিকা', type: 'Meccan', totalAyahs: 93 },
  { name: 'القصص', transliteration: 'Al-Qasas', translation: 'কাহিনী', type: 'Meccan', totalAyahs: 88 },
  { name: 'العنكبوت', transliteration: 'Al-Ankabut', translation: 'মাকড়সা', type: 'Meccan', totalAyahs: 69 },
  { name: 'الروم', transliteration: 'Ar-Rum', translation: 'রোমানরা', type: 'Meccan', totalAyahs: 60 },
  { name: 'لقمان', transliteration: 'Luqman', translation: 'লুকমান', type: 'Meccan', totalAyahs: 34 },
  { name: 'السجدة', transliteration: 'As-Sajdah', translation: 'সিজদা', type: 'Meccan', totalAyahs: 30 },
  { name: 'الأحزاب', transliteration: 'Al-Ahzab', translation: 'সম্মিলিত বাহিনী', type: 'Medinan', totalAyahs: 73 },
  { name: 'سبأ', transliteration: 'Saba', translation: 'সাবা', type: 'Meccan', totalAyahs: 54 },
  { name: 'فاطر', transliteration: 'Fatir', translation: 'স্রষ্টা', type: 'Meccan', totalAyahs: 45 },
  { name: 'يس', transliteration: 'Ya-Sin', translation: 'ইয়া-সীন', type: 'Meccan', totalAyahs: 83 },
  { name: 'الصافات', transliteration: 'As-Saffat', translation: 'সারিবদ্ধ', type: 'Meccan', totalAyahs: 182 },
  { name: 'ص', transliteration: 'Sad', translation: 'সোয়াদ', type: 'Meccan', totalAyahs: 88 },
  { name: 'الزمر', transliteration: 'Az-Zumar', translation: 'দলসমূহ', type: 'Meccan', totalAyahs: 75 },
  { name: 'غافر', transliteration: 'Ghafir', translation: 'ক্ষমাশীল', type: 'Meccan', totalAyahs: 85 },
  { name: 'فصلت', transliteration: 'Fussilat', translation: 'বিশদ বিবরণ', type: 'Meccan', totalAyahs: 54 },
  { name: 'الشورى', transliteration: 'Ash-Shura', translation: 'পরামর্শ', type: 'Meccan', totalAyahs: 53 },
  { name: 'الزخرف', transliteration: 'Az-Zukhruf', translation: 'সোনার অলংকার', type: 'Meccan', totalAyahs: 89 },
  { name: 'الدخان', transliteration: 'Ad-Dukhan', translation: 'ধোঁয়া', type: 'Meccan', totalAyahs: 59 },
  { name: 'الجاثية', transliteration: 'Al-Jathiyah', translation: 'নতজানু', type: 'Meccan', totalAyahs: 37 },
  { name: 'الأحقاف', transliteration: 'Al-Ahqaf', translation: 'বালুর পাহাড়', type: 'Meccan', totalAyahs: 35 },
  { name: 'محمد', transliteration: 'Muhammad', translation: 'মুহাম্মদ', type: 'Medinan', totalAyahs: 38 },
  { name: 'الفتح', transliteration: 'Al-Fath', translation: 'বিজয়', type: 'Medinan', totalAyahs: 29 },
  { name: 'الحجرات', transliteration: 'Al-Hujurat', translation: 'কক্ষসমূহ', type: 'Medinan', totalAyahs: 18 },
  { name: 'ق', transliteration: 'Qaf', translation: 'ক্বাফ', type: 'Meccan', totalAyahs: 45 },
  { name: 'الذاريات', transliteration: 'Adh-Dhariyat', translation: 'বিক্ষেপকারী বাতাস', type: 'Meccan', totalAyahs: 60 },
  { name: 'الطور', transliteration: 'At-Tur', translation: 'পর্বত', type: 'Meccan', totalAyahs: 49 },
  { name: 'النجم', transliteration: 'An-Najm', translation: 'তারা', type: 'Meccan', totalAyahs: 62 },
  { name: 'القمر', transliteration: 'Al-Qamar', translation: 'চাঁদ', type: 'Meccan', totalAyahs: 55 },
  { name: 'الرحمن', transliteration: 'Ar-Rahman', translation: 'পরম দয়ালু', type: 'Medinan', totalAyahs: 78 },
  { name: 'الواقعة', transliteration: 'Al-Waqiah', translation: 'অবশ্যম্ভাবী ঘটনা', type: 'Meccan', totalAyahs: 96 },
  { name: 'الحديد', transliteration: 'Al-Hadid', translation: 'লোহা', type: 'Medinan', totalAyahs: 29 },
  { name: 'المجادلة', transliteration: 'Al-Mujadila', translation: 'অনুযোগকারিণী', type: 'Medinan', totalAyahs: 22 },
  { name: 'الحشر', transliteration: 'Al-Hashr', translation: 'সমাবেশ', type: 'Medinan', totalAyahs: 24 },
  { name: 'الممتحنة', transliteration: 'Al-Mumtahanah', translation: 'পরীক্ষিতা নারী', type: 'Medinan', totalAyahs: 13 },
  { name: 'الصف', transliteration: 'As-Saff', translation: 'সারিবদ্ধ সৈন্যদল', type: 'Medinan', totalAyahs: 14 },
  { name: 'الجمعة', transliteration: 'Al-Jumuah', translation: 'জুমআ', type: 'Medinan', totalAyahs: 11 },
  { name: 'المنافقون', transliteration: 'Al-Munafiqun', translation: 'মুনাফিকগণ', type: 'Medinan', totalAyahs: 11 },
  { name: 'التغابن', transliteration: 'At-Taghabun', translation: 'মোহ অপসারণ', type: 'Medinan', totalAyahs: 18 },
  { name: 'الطلاق', transliteration: 'At-Talaq', translation: 'তালাক', type: 'Medinan', totalAyahs: 12 },
  { name: 'التحريم', transliteration: 'At-Tahrim', translation: 'নিষিদ্ধকরণ', type: 'Medinan', totalAyahs: 12 },
  { name: 'الملك', transliteration: 'Al-Mulk', translation: 'সার্বভৌমত্ব', type: 'Meccan', totalAyahs: 30 },
  { name: 'القلم', transliteration: 'Al-Qalam', translation: 'কলম', type: 'Meccan', totalAyahs: 52 },
  { name: 'الحاقة', transliteration: 'Al-Haqqah', translation: 'নিশ্চিত সত্য', type: 'Meccan', totalAyahs: 52 },
  { name: 'المعارج', transliteration: 'Al-Maarij', translation: 'উন্নয়নের সোপান', type: 'Meccan', totalAyahs: 44 },
  { name: 'نوح', transliteration: 'Nuh', translation: 'নূহ', type: 'Meccan', totalAyahs: 28 },
  { name: 'الجن', transliteration: 'Al-Jinn', translation: 'জিন', type: 'Meccan', totalAyahs: 28 },
  { name: 'المزمل', transliteration: 'Al-Muzzammil', translation: 'বস্ত্রাবৃত', type: 'Meccan', totalAyahs: 20 },
  { name: 'المدثر', transliteration: 'Al-Muddaththir', translation: 'চাদরাবৃত', type: 'Meccan', totalAyahs: 56 },
  { name: 'القيامة', transliteration: 'Al-Qiyamah', translation: 'কিয়ামত', type: 'Meccan', totalAyahs: 40 },
  { name: 'الإنسان', transliteration: 'Al-Insan', translation: 'মানুষ', type: 'Medinan', totalAyahs: 31 },
  { name: 'المرسلات', transliteration: 'Al-Mursalat', translation: 'প্রেরিত পবনমালা', type: 'Meccan', totalAyahs: 50 },
  { name: 'النبأ', transliteration: 'An-Naba', translation: 'সংবাদ', type: 'Meccan', totalAyahs: 40 },
  { name: 'النازعات', transliteration: 'An-Naziat', translation: 'প্রচেষ্টাকারী', type: 'Meccan', totalAyahs: 46 },
  { name: 'عبس', transliteration: 'Abasa', translation: 'ভ্রুকুটি করা', type: 'Meccan', totalAyahs: 42 },
  { name: 'التكوير', transliteration: 'At-Takwir', translation: 'গুটিয়ে নেওয়া', type: 'Meccan', totalAyahs: 29 },
  { name: 'الانفطار', transliteration: 'Al-Infitar', translation: 'বিদীর্ণ করা', type: 'Meccan', totalAyahs: 19 },
  { name: 'المطففين', transliteration: 'Al-Mutaffifin', translation: 'প্রতারণাকারী', type: 'Meccan', totalAyahs: 36 },
  { name: 'الانشقاق', transliteration: 'Al-Inshiqaq', translation: 'খণ্ড-বিখণ্ড করা', type: 'Meccan', totalAyahs: 25 },
  { name: 'البروج', transliteration: 'Al-Buruj', translation: 'নক্ষত্রপুঞ্জ', type: 'Meccan', totalAyahs: 22 },
  { name: 'الطارق', transliteration: 'At-Tariq', translation: 'রাতের আগন্তুক', type: 'Meccan', totalAyahs: 17 },
  { name: 'الأعلى', transliteration: 'Al-Ala', translation: 'সর্বোচ্চ', type: 'Meccan', totalAyahs: 19 },
  { name: 'الغاشية', transliteration: 'Al-Ghashiyah', translation: 'বিহ্বলকর ঘটনা', type: 'Meccan', totalAyahs: 26 },
  { name: 'الفجر', transliteration: 'Al-Fajr', translation: 'ভোর', type: 'Meccan', totalAyahs: 30 },
  { name: 'البلد', transliteration: 'Al-Balad', translation: 'নগর', type: 'Meccan', totalAyahs: 20 },
  { name: 'الشمس', transliteration: 'Ash-Shams', translation: 'সূর্য', type: 'Meccan', totalAyahs: 15 },
  { name: 'الليل', transliteration: 'Al-Layl', translation: 'রাত', type: 'Meccan', totalAyahs: 21 },
  { name: 'الضحى', transliteration: 'Ad-Duhaa', translation: 'পূর্বাহ্নের সূর্যকিরণ', type: 'Meccan', totalAyahs: 11 },
  { name: 'الشرح', transliteration: 'Ash-Sharh', translation: 'বক্ষ প্রশস্তকরণ', type: 'Meccan', totalAyahs: 8 },
  { name: 'التين', transliteration: 'At-Tin', translation: 'ডুমুর', type: 'Meccan', totalAyahs: 8 },
  { name: 'العلق', transliteration: 'Al-Alaq', translation: 'রক্তপিণ্ড', type: 'Meccan', totalAyahs: 19 },
  { name: 'القدر', transliteration: 'Al-Qadr', translation: 'মহিমান্বিত রাত', type: 'Meccan', totalAyahs: 5 },
  { name: 'البينة', transliteration: 'Al-Bayyinah', translation: 'সুস্পষ্ট প্রমাণ', type: 'Medinan', totalAyahs: 8 },
  { name: 'الزلزلة', transliteration: 'Az-Zalzalah', translation: 'ভূমিকম্প', type: 'Medinan', totalAyahs: 8 },
  { name: 'العاديات', transliteration: 'Al-Adiyat', translation: 'অভিযানকারী', type: 'Meccan', totalAyahs: 11 },
  { name: 'القارعة', transliteration: 'Al-Qariah', translation: 'মহাসংকট', type: 'Meccan', totalAyahs: 11 },
  { name: 'التكاثر', transliteration: 'At-Takathur', translation: 'প্রাচুর্যের প্রতিযোগিতা', type: 'Meccan', totalAyahs: 8 },
  { name: 'العصر', transliteration: 'Al-Asr', translation: 'সময়', type: 'Meccan', totalAyahs: 3 },
  { name: 'الهمزة', transliteration: 'Al-Humazah', translation: 'পরনিন্দাকারী', type: 'Meccan', totalAyahs: 9 },
  { name: 'الفيل', transliteration: 'Al-Fil', translation: 'হাতি', type: 'Meccan', totalAyahs: 5 },
  { name: 'قريش', transliteration: 'Quraysh', translation: 'কুরাইশ', type: 'Meccan', totalAyahs: 4 },
  { name: 'الماعون', transliteration: 'Al-Maun', translation: 'সাহায্য-সামগ্রী', type: 'Meccan', totalAyahs: 7 },
  { name: 'الكوثر', transliteration: 'Al-Kawthar', translation: 'প্রাচুর্য', type: 'Meccan', totalAyahs: 3 },
  { name: 'الكافرون', transliteration: 'Al-Kafirun', translation: 'অবিশ্বাসীগণ', type: 'Meccan', totalAyahs: 6 },
  { name: 'النصر', transliteration: 'An-Nasr', translation: 'সাহায্য', type: 'Medinan', totalAyahs: 3 },
  { name: 'المسد', transliteration: 'Al-Masad', translation: 'পাম ফাইবার', type: 'Meccan', totalAyahs: 5 },
  { name: 'الإخلاص', transliteration: 'Al-Ikhlas', translation: 'একনিষ্ঠতা', type: 'Meccan', totalAyahs: 4 },
  { name: 'الفلق', transliteration: 'Al-Falaq', translation: 'প্রভাত', type: 'Meccan', totalAyahs: 5 },
  { name: 'الناس', transliteration: 'An-Nas', translation: 'মানুষ', type: 'Meccan', totalAyahs: 6 }
];

// Fetch all surahs (metadata only for listing)
export async function getAllSurahs(): Promise<Surah[]> {
  if (surahListCache.length > 0) {
    return surahListCache;
  }

  const surahs: Surah[] = SURAH_METADATA.map((meta, index) => ({
    id: index + 1,
    name: meta.name,
    transliteration: meta.transliteration,
    translation: meta.translation,
    type: meta.type,
    totalAyahs: meta.totalAyahs
  }));

  surahListCache.push(...surahs);
  return surahs;
}

// Fetch a single surah with all ayahs
export async function getSurahById(id: number): Promise<Surah | null> {
  if (id < 1 || id > 114) {
    return null;
  }

  // Check cache first
  if (surahCache.has(id)) {
    return surahCache.get(id)!;
  }

  try {
    // Fetch Arabic text, Bangla and English translations in parallel
    const [arabicResponse, banglaResponse, englishResponse] = await Promise.all([
      fetch(`${API_BASE}/surah/${id}/${ARABIC_EDITION}`),
      fetch(`${API_BASE}/surah/${id}/${BANGLA_EDITION}`),
      fetch(`${API_BASE}/surah/${id}/${ENGLISH_EDITION}`)
    ]);

    if (!arabicResponse.ok || !banglaResponse.ok || !englishResponse.ok) {
      throw new Error('Failed to fetch surah data');
    }

    const arabicData = await arabicResponse.json();
    const banglaData = await banglaResponse.json();
    const englishData = await englishResponse.json();

    const metadata = SURAH_METADATA[id - 1];
    const arabicAyahs = arabicData.data.ayahs;
    const banglaAyahs = banglaData.data.ayahs;
    const englishAyahs = englishData.data.ayahs;

    const ayahs: Ayah[] = arabicAyahs.map((ayah: any, index: number) => ({
      number: ayah.numberInSurah,
      text: ayah.text,
      translation: banglaAyahs[index]?.text || '',
      englishTranslation: englishAyahs[index]?.text || ''
    }));

    const surah: Surah = {
      id,
      name: metadata.name,
      transliteration: metadata.transliteration,
      translation: metadata.translation,
      type: metadata.type,
      totalAyahs: metadata.totalAyahs,
      ayahs
    };

    // Cache the surah
    surahCache.set(id, surah);
    return surah;

  } catch (error) {
    console.error(`Error fetching surah ${id}:`, error);
    
    // Return metadata without ayahs on error
    const metadata = SURAH_METADATA[id - 1];
    return {
      id,
      name: metadata.name,
      transliteration: metadata.transliteration,
      translation: metadata.translation,
      type: metadata.type,
      totalAyahs: metadata.totalAyahs,
      ayahs: []
    };
  }
}

// Search surahs by name or content
export async function searchSurahs(query: string): Promise<Surah[]> {
  const allSurahs = await getAllSurahs();
  const q = query.toLowerCase();

  return allSurahs.filter(surah =>
    surah.name.includes(query) ||
    surah.transliteration.toLowerCase().includes(q) ||
    surah.translation.toLowerCase().includes(q)
  );
}

// Clear cache (useful for updates)
export function clearCache(): void {
  surahCache.clear();
  surahListCache.length = 0;
}
