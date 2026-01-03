import { Surah, Ayah } from '../types/index.js';

// Quran.com API v4 base URL
const API_BASE = 'https://api.quran.com/api/v4';

// ============================================
// TRANSLATION CONFIGURATION
// ============================================
// Add new translations here - they will automatically appear in the UI
// Translation IDs from: https://api.quran.com/api/v4/resources/translations

export interface TranslationEdition {
  id: string;           // Unique identifier used in code
  apiId: number;        // Quran.com API translation ID
  label: string;        // Display label in UI
  language: 'bangla' | 'english' | 'urdu';  // Language group
  isDefault: boolean;   // Whether checked by default
}

export const TRANSLATION_EDITIONS: TranslationEdition[] = [
  // Bengali Translations (from Quran.com)
  // 161: Taisirul Quran (Tawheed Publication)
  // 163: Sheikh Mujibur Rahman (Darussalaam)
  // 213: Rawai Al-bayan
  // 162: Dr. Abu Bakr Muhammad Zakaria
  { id: 'taisirul', apiId: 161, label: 'তাইসীরুল কুরআন', language: 'bangla', isDefault: true },
  { id: 'mujibur', apiId: 163, label: 'শেখ মুজিবুর রহমান', language: 'bangla', isDefault: false },
  { id: 'rawai', apiId: 213, label: 'রাওয়াই আল-বায়ান', language: 'bangla', isDefault: false },
  { id: 'zakaria', apiId: 162, label: 'ড. আবু বকর মুহাম্মাদ যাকারিয়া', language: 'bangla', isDefault: false },

  // English Translations (from Quran.com)
  // 20: Saheeh International
  // 19: M. Pickthall
  // 22: A. Yusuf Ali
  // 203: Al-Hilali & Khan (replacing Arberry which is not available)
  { id: 'sahih', apiId: 20, label: 'Sahih International', language: 'english', isDefault: true },
  { id: 'pickthall', apiId: 19, label: 'Pickthall', language: 'english', isDefault: false },
  { id: 'yusufali', apiId: 22, label: 'Yusuf Ali', language: 'english', isDefault: false },
  { id: 'hilali', apiId: 203, label: 'Al-Hilali & Khan', language: 'english', isDefault: false },
];

// Helper to get editions by language
export function getTranslationsByLanguage(language: 'bangla' | 'english' | 'urdu'): TranslationEdition[] {
  return TRANSLATION_EDITIONS.filter(t => t.language === language);
}

// ============================================
// AUDIO CONFIGURATION
// ============================================
// Add new audio types and reciters here - they will automatically appear in the UI

export interface AudioType {
  id: string;           // Value for radio button
  label: string;        // Display label
  labelBn: string;      // Bengali label (optional)
  showsReciters: string[];  // Which reciter sections to show (e.g., ['arabic', 'english'])
}

export interface Reciter {
  id: string;           // Folder name for everyayah.com
  name: string;         // Display name
  language: 'arabic' | 'urdu' | 'english';  // Language/type
  isDefault?: boolean;  // Default selection
}

export const AUDIO_TYPES: AudioType[] = [
  { id: 'arabic', label: 'Arabic', labelBn: 'আরবি', showsReciters: ['arabic'] },
  { id: 'urdu', label: 'Urdu', labelBn: 'উর্দু', showsReciters: ['urdu'] },
  { id: 'english', label: 'English', labelBn: '', showsReciters: ['english'] },
  { id: 'both', label: 'Arabic + English', labelBn: '', showsReciters: ['arabic', 'english'] },
];

export const ARABIC_RECITERS: Reciter[] = [
  { id: 'Alafasy_128kbps', name: 'Mishary Rashid Alafasy', language: 'arabic', isDefault: true },
  { id: 'Abdul_Basit_Murattal_192kbps', name: 'Abdul Basit (Murattal)', language: 'arabic' },
  { id: 'Abdul_Basit_Mujawwad_128kbps', name: 'Abdul Basit (Mujawwad)', language: 'arabic' },
  { id: 'Husary_128kbps', name: 'Mahmoud Khalil Al-Husary', language: 'arabic' },
  { id: 'Minshawy_Murattal_128kbps', name: 'Mohamed Siddiq El-Minshawi', language: 'arabic' },
  { id: 'Ahmed_ibn_Ali_al_Ajamy_128kbps_ketaballah.net', name: 'Ahmed ibn Ali al-Ajamy', language: 'arabic' },
  { id: 'Muhammad_Ayyoub_128kbps', name: 'Muhammad Ayyoub', language: 'arabic' },
  { id: 'Muhammad_Jibreel_128kbps', name: 'Muhammad Jibreel', language: 'arabic' },
  { id: 'Maher_AlMuworrkly_128kbps', name: 'Maher Al-Muaiqly', language: 'arabic' },
  { id: 'Saood_ash-Shuraym_128kbps', name: 'Saood Ash-Shuraym', language: 'arabic' },
];

export const URDU_RECITERS: Reciter[] = [
  { id: 'urdu_shamshad_ali_khan_46kbps', name: 'Shamshad Ali Khan', language: 'urdu', isDefault: true },
];

export const ENGLISH_RECITERS: Reciter[] = [
  { id: 'English/Sahih_Intnl_Ibrahim_Walk_192kbps', name: 'Sahih International (Ibrahim Walk)', language: 'english', isDefault: true },
];

// Combined config export for easy access
export const AUDIO_CONFIG = {
  types: AUDIO_TYPES,
  reciters: {
    arabic: ARABIC_RECITERS,
    urdu: URDU_RECITERS,
    english: ENGLISH_RECITERS,
  }
};

// Export all config for routes
export const APP_CONFIG = {
  translations: TRANSLATION_EDITIONS,
  translationsByLanguage: {
    bangla: getTranslationsByLanguage('bangla'),
    english: getTranslationsByLanguage('english'),
  },
  audio: AUDIO_CONFIG,
};

// ============================================
// TRANSLATION ID MAPPINGS (Quran.com API v4)
// ============================================
const TRANSLATION_IDS = {
  // Bengali
  taisirul: 161,    // Taisirul Quran
  mujibur: 163,     // Sheikh Mujibur Rahman
  rawai: 213,       // Rawai Al-bayan
  zakaria: 162,     // Dr. Abu Bakr Muhammad Zakaria
  // English
  sahih: 20,        // Saheeh International
  pickthall: 19,    // M. Pickthall
  yusufali: 22,     // A. Yusuf Ali
  hilali: 203,      // Al-Hilali & Khan
};

// Cache for surah data
const surahCache: Map<number, Surah> = new Map();
const surahListCache: Surah[] = [];

// Surah metadata (name, transliteration, translation, type)
const SURAH_METADATA: Array<{ name: string; transliteration: string; banglish: string; translation: string; type: 'Meccan' | 'Medinan'; totalAyahs: number }> = [
  { name: 'الفاتحة', transliteration: 'Al-Fatihah', banglish: 'আল-ফাতিহা', translation: 'সূচনা', type: 'Meccan', totalAyahs: 7 },
  { name: 'البقرة', transliteration: 'Al-Baqarah', banglish: 'আল-বাকারা', translation: 'গাভী', type: 'Medinan', totalAyahs: 286 },
  { name: 'آل عمران', transliteration: 'Aal-E-Imran', banglish: 'আল-ইমরান', translation: 'ইমরানের পরিবার', type: 'Medinan', totalAyahs: 200 },
  { name: 'النساء', transliteration: 'An-Nisa', banglish: 'আন-নিসা', translation: 'নারী', type: 'Medinan', totalAyahs: 176 },
  { name: 'المائدة', transliteration: 'Al-Maidah', banglish: 'আল-মায়িদাহ', translation: 'খাদ্য পরিবেশিত টেবিল', type: 'Medinan', totalAyahs: 120 },
  { name: 'الأنعام', transliteration: 'Al-Anam', banglish: 'আল-আনআম', translation: 'গবাদি পশু', type: 'Meccan', totalAyahs: 165 },
  { name: 'الأعراف', transliteration: 'Al-Araf', banglish: 'আল-আরাফ', translation: 'উঁচু স্থানসমূহ', type: 'Meccan', totalAyahs: 206 },
  { name: 'الأنفال', transliteration: 'Al-Anfal', banglish: 'আল-আনফাল', translation: 'যুদ্ধলব্ধ সম্পদ', type: 'Medinan', totalAyahs: 75 },
  { name: 'التوبة', transliteration: 'At-Tawbah', banglish: 'আত-তাওবাহ', translation: 'অনুশোচনা', type: 'Medinan', totalAyahs: 129 },
  { name: 'يونس', transliteration: 'Yunus', banglish: 'ইউনুস', translation: 'ইউনুস', type: 'Meccan', totalAyahs: 109 },
  { name: 'هود', transliteration: 'Hud', banglish: 'হুদ', translation: 'হুদ', type: 'Meccan', totalAyahs: 123 },
  { name: 'يوسف', transliteration: 'Yusuf', banglish: 'ইউসুফ', translation: 'ইউসুফ', type: 'Meccan', totalAyahs: 111 },
  { name: 'الرعد', transliteration: 'Ar-Rad', banglish: 'আর-রাদ', translation: 'বজ্রপাত', type: 'Medinan', totalAyahs: 43 },
  { name: 'إبراهيم', transliteration: 'Ibrahim', banglish: 'ইব্রাহীম', translation: 'ইব্রাহিম', type: 'Meccan', totalAyahs: 52 },
  { name: 'الحجر', transliteration: 'Al-Hijr', banglish: 'আল-হিজর', translation: 'পাথুরে পাহাড়', type: 'Meccan', totalAyahs: 99 },
  { name: 'النحل', transliteration: 'An-Nahl', banglish: 'আন-নাহল', translation: 'মৌমাছি', type: 'Meccan', totalAyahs: 128 },
  { name: 'الإسراء', transliteration: 'Al-Isra', banglish: 'আল-ইসরা', translation: 'রাতের যাত্রা', type: 'Meccan', totalAyahs: 111 },
  { name: 'الكهف', transliteration: 'Al-Kahf', banglish: 'আল-কাহফ', translation: 'গুহা', type: 'Meccan', totalAyahs: 110 },
  { name: 'مريم', transliteration: 'Maryam', banglish: 'মারইয়াম', translation: 'মারইয়াম', type: 'Meccan', totalAyahs: 98 },
  { name: 'طه', transliteration: 'Taha', banglish: 'ত্বা-হা', translation: 'তা-হা', type: 'Meccan', totalAyahs: 135 },
  { name: 'الأنبياء', transliteration: 'Al-Anbiya', banglish: 'আল-আম্বিয়া', translation: 'নবীগণ', type: 'Meccan', totalAyahs: 112 },
  { name: 'الحج', transliteration: 'Al-Hajj', banglish: 'আল-হজ্জ', translation: 'হজ্জ', type: 'Medinan', totalAyahs: 78 },
  { name: 'المؤمنون', transliteration: 'Al-Muminun', banglish: 'আল-মুমিনুন', translation: 'বিশ্বাসীগণ', type: 'Meccan', totalAyahs: 118 },
  { name: 'النور', transliteration: 'An-Nur', banglish: 'আন-নূর', translation: 'আলো', type: 'Medinan', totalAyahs: 64 },
  { name: 'الفرقان', transliteration: 'Al-Furqan', banglish: 'আল-ফুরকান', translation: 'মানদণ্ড', type: 'Meccan', totalAyahs: 77 },
  { name: 'الشعراء', transliteration: 'Ash-Shuara', banglish: 'আশ-শুআরা', translation: 'কবিগণ', type: 'Meccan', totalAyahs: 227 },
  { name: 'النمل', transliteration: 'An-Naml', banglish: 'আন-নামল', translation: 'পিপীলিকা', type: 'Meccan', totalAyahs: 93 },
  { name: 'القصص', transliteration: 'Al-Qasas', banglish: 'আল-কাসাস', translation: 'কাহিনী', type: 'Meccan', totalAyahs: 88 },
  { name: 'العنكبوت', transliteration: 'Al-Ankabut', banglish: 'আল-আনকাবুত', translation: 'মাকড়সা', type: 'Meccan', totalAyahs: 69 },
  { name: 'الروم', transliteration: 'Ar-Rum', banglish: 'আর-রূম', translation: 'রোমানরা', type: 'Meccan', totalAyahs: 60 },
  { name: 'لقمان', transliteration: 'Luqman', banglish: 'লুকমান', translation: 'লুকমান', type: 'Meccan', totalAyahs: 34 },
  { name: 'السجدة', transliteration: 'As-Sajdah', banglish: 'আস-সাজদাহ', translation: 'সিজদা', type: 'Meccan', totalAyahs: 30 },
  { name: 'الأحزاب', transliteration: 'Al-Ahzab', banglish: 'আল-আহযাব', translation: 'সম্মিলিত বাহিনী', type: 'Medinan', totalAyahs: 73 },
  { name: 'سبأ', transliteration: 'Saba', banglish: 'সাবা', translation: 'সাবা', type: 'Meccan', totalAyahs: 54 },
  { name: 'فاطر', transliteration: 'Fatir', banglish: 'ফাতির', translation: 'স্রষ্টা', type: 'Meccan', totalAyahs: 45 },
  { name: 'يس', transliteration: 'Ya-Sin', banglish: 'ইয়াসীন', translation: 'ইয়া-সীন', type: 'Meccan', totalAyahs: 83 },
  { name: 'الصافات', transliteration: 'As-Saffat', banglish: 'আস-সাফফাত', translation: 'সারিবদ্ধ', type: 'Meccan', totalAyahs: 182 },
  { name: 'ص', transliteration: 'Sad', banglish: 'সোয়াদ', translation: 'সোয়াদ', type: 'Meccan', totalAyahs: 88 },
  { name: 'الزمر', transliteration: 'Az-Zumar', banglish: 'আয-যুমার', translation: 'দলসমূহ', type: 'Meccan', totalAyahs: 75 },
  { name: 'غافر', transliteration: 'Ghafir', banglish: 'গাফির', translation: 'ক্ষমাশীল', type: 'Meccan', totalAyahs: 85 },
  { name: 'فصلت', transliteration: 'Fussilat', banglish: 'ফুসসিলাত', translation: 'বিশদ বিবরণ', type: 'Meccan', totalAyahs: 54 },
  { name: 'الشورى', transliteration: 'Ash-Shura', banglish: 'আশ-শূরা', translation: 'পরামর্শ', type: 'Meccan', totalAyahs: 53 },
  { name: 'الزخرف', transliteration: 'Az-Zukhruf', banglish: 'আয-যুখরুফ', translation: 'সোনার অলংকার', type: 'Meccan', totalAyahs: 89 },
  { name: 'الدخان', transliteration: 'Ad-Dukhan', banglish: 'আদ-দুখান', translation: 'ধোঁয়া', type: 'Meccan', totalAyahs: 59 },
  { name: 'الجاثية', transliteration: 'Al-Jathiyah', banglish: 'আল-জাসিয়াহ', translation: 'নতজানু', type: 'Meccan', totalAyahs: 37 },
  { name: 'الأحقاف', transliteration: 'Al-Ahqaf', banglish: 'আল-আহকাফ', translation: 'বালুর পাহাড়', type: 'Meccan', totalAyahs: 35 },
  { name: 'محمد', transliteration: 'Muhammad', banglish: 'মুহাম্মাদ', translation: 'মুহাম্মদ', type: 'Medinan', totalAyahs: 38 },
  { name: 'الفتح', transliteration: 'Al-Fath', banglish: 'আল-ফাতহ', translation: 'বিজয়', type: 'Medinan', totalAyahs: 29 },
  { name: 'الحجرات', transliteration: 'Al-Hujurat', banglish: 'আল-হুজুরাত', translation: 'কক্ষসমূহ', type: 'Medinan', totalAyahs: 18 },
  { name: 'ق', transliteration: 'Qaf', banglish: 'ক্বাফ', translation: 'ক্বাফ', type: 'Meccan', totalAyahs: 45 },
  { name: 'الذاريات', transliteration: 'Adh-Dhariyat', banglish: 'আয-যারিয়াত', translation: 'বিক্ষেপকারী বাতাস', type: 'Meccan', totalAyahs: 60 },
  { name: 'الطور', transliteration: 'At-Tur', banglish: 'আত-তূর', translation: 'পর্বত', type: 'Meccan', totalAyahs: 49 },
  { name: 'النجم', transliteration: 'An-Najm', banglish: 'আন-নাজম', translation: 'তারা', type: 'Meccan', totalAyahs: 62 },
  { name: 'القمر', transliteration: 'Al-Qamar', banglish: 'আল-কামার', translation: 'চাঁদ', type: 'Meccan', totalAyahs: 55 },
  { name: 'الرحمن', transliteration: 'Ar-Rahman', banglish: 'আর-রাহমান', translation: 'পরম দয়ালু', type: 'Medinan', totalAyahs: 78 },
  { name: 'الواقعة', transliteration: 'Al-Waqiah', banglish: 'আল-ওয়াকিয়াহ', translation: 'অবশ্যম্ভাবী ঘটনা', type: 'Meccan', totalAyahs: 96 },
  { name: 'الحديد', transliteration: 'Al-Hadid', banglish: 'আল-হাদীদ', translation: 'লোহা', type: 'Medinan', totalAyahs: 29 },
  { name: 'المجادلة', transliteration: 'Al-Mujadila', banglish: 'আল-মুজাদালাহ', translation: 'অনুযোগকারিণী', type: 'Medinan', totalAyahs: 22 },
  { name: 'الحشر', transliteration: 'Al-Hashr', banglish: 'আল-হাশর', translation: 'সমাবেশ', type: 'Medinan', totalAyahs: 24 },
  { name: 'الممتحنة', transliteration: 'Al-Mumtahanah', banglish: 'আল-মুমতাহিনাহ', translation: 'পরীক্ষিতা নারী', type: 'Medinan', totalAyahs: 13 },
  { name: 'الصف', transliteration: 'As-Saff', banglish: 'আস-সাফ', translation: 'সারিবদ্ধ সৈন্যদল', type: 'Medinan', totalAyahs: 14 },
  { name: 'الجمعة', transliteration: 'Al-Jumuah', banglish: 'আল-জুমুআহ', translation: 'জুমআ', type: 'Medinan', totalAyahs: 11 },
  { name: 'المنافقون', transliteration: 'Al-Munafiqun', banglish: 'আল-মুনাফিকুন', translation: 'মুনাফিকগণ', type: 'Medinan', totalAyahs: 11 },
  { name: 'التغابن', transliteration: 'At-Taghabun', banglish: 'আত-তাগাবুন', translation: 'মোহ অপসারণ', type: 'Medinan', totalAyahs: 18 },
  { name: 'الطلاق', transliteration: 'At-Talaq', banglish: 'আত-তালাক', translation: 'তালাক', type: 'Medinan', totalAyahs: 12 },
  { name: 'التحريم', transliteration: 'At-Tahrim', banglish: 'আত-তাহরীম', translation: 'নিষিদ্ধকরণ', type: 'Medinan', totalAyahs: 12 },
  { name: 'الملك', transliteration: 'Al-Mulk', banglish: 'আল-মুলক', translation: 'সার্বভৌমত্ব', type: 'Meccan', totalAyahs: 30 },
  { name: 'القلم', transliteration: 'Al-Qalam', banglish: 'আল-কলম', translation: 'কলম', type: 'Meccan', totalAyahs: 52 },
  { name: 'الحاقة', transliteration: 'Al-Haqqah', banglish: 'আল-হাক্কাহ', translation: 'নিশ্চিত সত্য', type: 'Meccan', totalAyahs: 52 },
  { name: 'المعارج', transliteration: 'Al-Maarij', banglish: 'আল-মাআরিজ', translation: 'উন্নয়নের সোপান', type: 'Meccan', totalAyahs: 44 },
  { name: 'نوح', transliteration: 'Nuh', banglish: 'নূহ', translation: 'নূহ', type: 'Meccan', totalAyahs: 28 },
  { name: 'الجن', transliteration: 'Al-Jinn', banglish: 'আল-জিন', translation: 'জিন', type: 'Meccan', totalAyahs: 28 },
  { name: 'المزمل', transliteration: 'Al-Muzzammil', banglish: 'আল-মুযযাম্মিল', translation: 'বস্ত্রাবৃত', type: 'Meccan', totalAyahs: 20 },
  { name: 'المدثر', transliteration: 'Al-Muddaththir', banglish: 'আল-মুদ্দাসসির', translation: 'চাদরাবৃত', type: 'Meccan', totalAyahs: 56 },
  { name: 'القيامة', transliteration: 'Al-Qiyamah', banglish: 'আল-কিয়ামাহ', translation: 'কিয়ামত', type: 'Meccan', totalAyahs: 40 },
  { name: 'الإنسان', transliteration: 'Al-Insan', banglish: 'আল-ইনসান', translation: 'মানুষ', type: 'Medinan', totalAyahs: 31 },
  { name: 'المرسلات', transliteration: 'Al-Mursalat', banglish: 'আল-মুরসালাত', translation: 'প্রেরিত পবনমালা', type: 'Meccan', totalAyahs: 50 },
  { name: 'النبأ', transliteration: 'An-Naba', banglish: 'আন-নাবা', translation: 'সংবাদ', type: 'Meccan', totalAyahs: 40 },
  { name: 'النازعات', transliteration: 'An-Naziat', banglish: 'আন-নাযিআত', translation: 'প্রচেষ্টাকারী', type: 'Meccan', totalAyahs: 46 },
  { name: 'عبس', transliteration: 'Abasa', banglish: 'আবাসা', translation: 'ভ্রুকুটি করা', type: 'Meccan', totalAyahs: 42 },
  { name: 'التكوير', transliteration: 'At-Takwir', banglish: 'আত-তাকভীর', translation: 'গুটিয়ে নেওয়া', type: 'Meccan', totalAyahs: 29 },
  { name: 'الانفطار', transliteration: 'Al-Infitar', banglish: 'আল-ইনফিতার', translation: 'বিদীর্ণ করা', type: 'Meccan', totalAyahs: 19 },
  { name: 'المطففين', transliteration: 'Al-Mutaffifin', banglish: 'আল-মুতাফফিফীন', translation: 'প্রতারণাকারী', type: 'Meccan', totalAyahs: 36 },
  { name: 'الانشقاق', transliteration: 'Al-Inshiqaq', banglish: 'আল-ইনশিকাক', translation: 'খণ্ড-বিখণ্ড করা', type: 'Meccan', totalAyahs: 25 },
  { name: 'البروج', transliteration: 'Al-Buruj', banglish: 'আল-বুরূজ', translation: 'নক্ষত্রপুঞ্জ', type: 'Meccan', totalAyahs: 22 },
  { name: 'الطارق', transliteration: 'At-Tariq', banglish: 'আত-তারিক', translation: 'রাতের আগন্তুক', type: 'Meccan', totalAyahs: 17 },
  { name: 'الأعلى', transliteration: 'Al-Ala', banglish: 'আল-আলা', translation: 'সর্বোচ্চ', type: 'Meccan', totalAyahs: 19 },
  { name: 'الغاشية', transliteration: 'Al-Ghashiyah', banglish: 'আল-গাশিয়াহ', translation: 'বিহ্বলকর ঘটনা', type: 'Meccan', totalAyahs: 26 },
  { name: 'الفجر', transliteration: 'Al-Fajr', banglish: 'আল-ফাজর', translation: 'ভোর', type: 'Meccan', totalAyahs: 30 },
  { name: 'البلد', transliteration: 'Al-Balad', banglish: 'আল-বালাদ', translation: 'নগর', type: 'Meccan', totalAyahs: 20 },
  { name: 'الشمس', transliteration: 'Ash-Shams', banglish: 'আশ-শামস', translation: 'সূর্য', type: 'Meccan', totalAyahs: 15 },
  { name: 'الليل', transliteration: 'Al-Layl', banglish: 'আল-লাইল', translation: 'রাত', type: 'Meccan', totalAyahs: 21 },
  { name: 'الضحى', transliteration: 'Ad-Duhaa', banglish: 'আদ-দুহা', translation: 'পূর্বাহ্নের সূর্যকিরণ', type: 'Meccan', totalAyahs: 11 },
  { name: 'الشرح', transliteration: 'Ash-Sharh', banglish: 'আশ-শারহ', translation: 'বক্ষ প্রশস্তকরণ', type: 'Meccan', totalAyahs: 8 },
  { name: 'التين', transliteration: 'At-Tin', banglish: 'আত-তীন', translation: 'ডুমুর', type: 'Meccan', totalAyahs: 8 },
  { name: 'العلق', transliteration: 'Al-Alaq', banglish: 'আল-আলাক', translation: 'রক্তপিণ্ড', type: 'Meccan', totalAyahs: 19 },
  { name: 'القدر', transliteration: 'Al-Qadr', banglish: 'আল-কদর', translation: 'মহিমান্বিত রাত', type: 'Meccan', totalAyahs: 5 },
  { name: 'البينة', transliteration: 'Al-Bayyinah', banglish: 'আল-বাইয়িনাহ', translation: 'সুস্পষ্ট প্রমাণ', type: 'Medinan', totalAyahs: 8 },
  { name: 'الزلزلة', transliteration: 'Az-Zalzalah', banglish: 'আয-যালযালাহ', translation: 'ভূমিকম্প', type: 'Medinan', totalAyahs: 8 },
  { name: 'العاديات', transliteration: 'Al-Adiyat', banglish: 'আল-আদিয়াত', translation: 'অভিযানকারী', type: 'Meccan', totalAyahs: 11 },
  { name: 'القارعة', transliteration: 'Al-Qariah', banglish: 'আল-কারিআহ', translation: 'মহাসংকট', type: 'Meccan', totalAyahs: 11 },
  { name: 'التكاثر', transliteration: 'At-Takathur', banglish: 'আত-তাকাসুর', translation: 'প্রাচুর্যের প্রতিযোগিতা', type: 'Meccan', totalAyahs: 8 },
  { name: 'العصر', transliteration: 'Al-Asr', banglish: 'আল-আসর', translation: 'সময়', type: 'Meccan', totalAyahs: 3 },
  { name: 'الهمزة', transliteration: 'Al-Humazah', banglish: 'আল-হুমাযাহ', translation: 'পরনিন্দাকারী', type: 'Meccan', totalAyahs: 9 },
  { name: 'الفيل', transliteration: 'Al-Fil', banglish: 'আল-ফীল', translation: 'হাতি', type: 'Meccan', totalAyahs: 5 },
  { name: 'قريش', transliteration: 'Quraysh', banglish: 'কুরাইশ', translation: 'কুরাইশ', type: 'Meccan', totalAyahs: 4 },
  { name: 'الماعون', transliteration: 'Al-Maun', banglish: 'আল-মাঊন', translation: 'সাহায্য-সামগ্রী', type: 'Meccan', totalAyahs: 7 },
  { name: 'الكوثر', transliteration: 'Al-Kawthar', banglish: 'আল-কাওসার', translation: 'প্রাচুর্য', type: 'Meccan', totalAyahs: 3 },
  { name: 'الكافرون', transliteration: 'Al-Kafirun', banglish: 'আল-কাফিরূন', translation: 'অবিশ্বাসীগণ', type: 'Meccan', totalAyahs: 6 },
  { name: 'النصر', transliteration: 'An-Nasr', banglish: 'আন-নাসর', translation: 'সাহায্য', type: 'Medinan', totalAyahs: 3 },
  { name: 'المسد', transliteration: 'Al-Masad', banglish: 'আল-মাসাদ', translation: 'পাম ফাইবার', type: 'Meccan', totalAyahs: 5 },
  { name: 'الإخلاص', transliteration: 'Al-Ikhlas', banglish: 'আল-ইখলাস', translation: 'একনিষ্ঠতা', type: 'Meccan', totalAyahs: 4 },
  { name: 'الفلق', transliteration: 'Al-Falaq', banglish: 'আল-ফালাক', translation: 'প্রভাত', type: 'Meccan', totalAyahs: 5 },
  { name: 'الناس', transliteration: 'An-Nas', banglish: 'আন-নাস', translation: 'মানুষ', type: 'Meccan', totalAyahs: 6 }
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
    banglish: meta.banglish,
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
    // Build translation IDs string for the API request
    const allTranslationIds = Object.values(TRANSLATION_IDS).join(',');
    
    // Fetch verses with Arabic text and all translations in a single request
    // Quran.com API v4 format: /verses/by_chapter/{chapter_id}?translations=id1,id2,...&fields=text_uthmani
    const response = await fetch(
      `${API_BASE}/verses/by_chapter/${id}?translations=${allTranslationIds}&fields=text_uthmani&per_page=300`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch surah ${id}: ${response.status}`);
    }

    const data: any = await response.json();
    const verses = data.verses || [];

    const metadata = SURAH_METADATA[id - 1];
    
    // Helper to find translation text by resource_id
    const getTranslation = (translations: any[], resourceId: number): string => {
      const translation = translations?.find((t: any) => t.resource_id === resourceId);
      // Remove HTML footnotes like <sup foot_note=xxx>n</sup>
      return translation?.text?.replace(/<sup[^>]*>.*?<\/sup>/g, '') || '';
    };

    const ayahs: Ayah[] = verses.map((verse: any) => ({
      number: verse.verse_number,
      text: verse.text_uthmani || '',
      // Bengali translations
      translation: getTranslation(verse.translations, TRANSLATION_IDS.taisirul),
      banglaMujibur: getTranslation(verse.translations, TRANSLATION_IDS.mujibur),
      banglaRawai: getTranslation(verse.translations, TRANSLATION_IDS.rawai),
      banglaZakaria: getTranslation(verse.translations, TRANSLATION_IDS.zakaria),
      // English translations
      englishTranslation: getTranslation(verse.translations, TRANSLATION_IDS.sahih),
      englishPickthall: getTranslation(verse.translations, TRANSLATION_IDS.pickthall),
      englishYusufali: getTranslation(verse.translations, TRANSLATION_IDS.yusufali),
      englishHilali: getTranslation(verse.translations, TRANSLATION_IDS.hilali)
    }));

    const surah: Surah = {
      id,
      name: metadata.name,
      transliteration: metadata.transliteration,
      banglish: metadata.banglish,
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
      banglish: metadata.banglish,
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
    surah.translation.toLowerCase().includes(q) ||
    (surah.banglish && surah.banglish.toLowerCase().includes(q))
  );
}

// Clear cache (useful for updates)
export function clearCache(): void {
  surahCache.clear();
  surahListCache.length = 0;
}
