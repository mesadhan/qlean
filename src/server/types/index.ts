export interface Ayah {
  number: number;
  text: string;
  translation: string;       // Bangla translation
  englishTranslation?: string;  // English translation
}

export interface Reciter {
  id: string;
  name: string;
  arabicName: string;
  style?: string;
}

export interface Translator {
  id: string;
  name: string;
  language: 'bangla' | 'english';
}

export interface Surah {
  id: number;
  name: string;
  transliteration: string;
  translation: string;
  type: 'Meccan' | 'Medinan';
  totalAyahs: number;
  ayahs?: Ayah[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Audio sources for Quran recitation
export const RECITERS: Reciter[] = [
  { id: 'ar.alafasy', name: 'Mishary Rashid Alafasy', arabicName: 'مشاري راشد العفاسي' },
  { id: 'ar.abdulbasitmurattal', name: 'Abdul Basit (Murattal)', arabicName: 'عبد الباسط عبد الصمد' },
  { id: 'ar.abdulsamad', name: 'Abdul Basit (Mujawwad)', arabicName: 'عبد الباسط عبد الصمد - مجود' },
  { id: 'ar.husary', name: 'Mahmoud Khalil Al-Husary', arabicName: 'محمود خليل الحصري' },
  { id: 'ar.minshawi', name: 'Mohamed Siddiq El-Minshawi', arabicName: 'محمد صديق المنشاوي' },
  { id: 'ar.ahmedajamy', name: 'Ahmed ibn Ali al-Ajamy', arabicName: 'أحمد بن علي العجمي' },
  { id: 'ar.muhammadayyoub', name: 'Muhammad Ayyoub', arabicName: 'محمد أيوب' },
  { id: 'ar.muhammadjibreel', name: 'Muhammad Jibreel', arabicName: 'محمد جبريل' },
  { id: 'ar.maaborualaoaili', name: 'Maher Al Muaiqly', arabicName: 'ماهر المعيقلي' },
  { id: 'ar.saaboruduwali', name: 'Saad Al-Ghamdi', arabicName: 'سعد الغامدي' }
];

// Audio URL builders
export const getAyahAudioUrl = (surahId: number, ayahNumber: number, reciterId: string = 'ar.alafasy'): string => {
  // Using alquran.cloud API for audio
  return `https://cdn.islamic.network/quran/audio/128/${reciterId}/${getGlobalAyahNumber(surahId, ayahNumber)}.mp3`;
};

export const getSurahAudioUrl = (surahId: number, reciterId: string = 'ar.alafasy'): string => {
  // Full surah audio from everyayah.com
  const paddedSurah = String(surahId).padStart(3, '0');
  const reciterMap: Record<string, string> = {
    'ar.alafasy': 'Alafasy_128kbps',
    'ar.abdulbasitmurattal': 'Abdul_Basit_Murattal_192kbps',
    'ar.abdulsamad': 'AbdulSamad_64kbps_QuranExplorer.Com',
    'ar.husary': 'Husary_128kbps',
    'ar.minshawi': 'Minshawy_Murattal_128kbps',
    'ar.ahmedajamy': 'ahmed_ibn_ali_al_ajamy_128kbps',
    'ar.muhammadayyoub': 'Muhammad_Ayyoub_128kbps',
    'ar.muhammadjibreel': 'Muhammad_Jibreel_128kbps',
    'ar.maaborualaoaili': 'MashorAlafasySudais_128kbps',
    'ar.saaboruduwali': 'Ghamadi_40kbps'
  };
  const reciterFolder = reciterMap[reciterId] || 'Alafasy_128kbps';
  return `https://download.quranicaudio.com/quran/${reciterFolder}/${paddedSurah}.mp3`;
};

// Helper to calculate global ayah number (1-6236)
const SURAH_AYAH_COUNTS = [7,286,200,176,120,165,206,75,129,109,123,111,43,52,99,128,111,110,98,135,112,78,118,64,77,227,93,88,69,60,34,30,73,54,45,83,182,88,75,85,54,53,89,59,37,35,38,29,18,45,60,49,62,55,78,96,29,22,24,13,14,11,11,18,12,12,30,52,52,44,28,28,20,56,40,31,50,40,46,42,29,19,36,25,22,17,19,26,30,20,15,21,11,8,8,19,5,8,8,11,11,8,3,9,5,4,7,3,6,3,5,4,5,6];

function getGlobalAyahNumber(surahId: number, ayahNumber: number): number {
  let globalNumber = 0;
  for (let i = 0; i < surahId - 1; i++) {
    globalNumber += SURAH_AYAH_COUNTS[i];
  }
  return globalNumber + ayahNumber;
}