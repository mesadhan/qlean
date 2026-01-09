import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const DATA_BASE_PATH = path.join(__dirname, '../../public/assets/data');
const TRANSLATIONS_PATH = path.join(DATA_BASE_PATH, 'translations');
const METADATA_PATH = path.join(DATA_BASE_PATH, 'metadata.json');

// Cache for offline data
const offlineTranslationCache = new Map<string, any>();
const offlineMetadataCache: any = {};

// Initialize offline paths
export function initializeOfflinePaths() {
  const paths = [DATA_BASE_PATH, TRANSLATIONS_PATH];
  
  paths.forEach(dirPath => {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
      console.log(`Created offline data directory: ${dirPath}`);
    }
  });
}

// Load translation metadata from file
export function loadOfflineMetadata(): Record<string, any> {
  if (Object.keys(offlineMetadataCache).length > 0) {
    return offlineMetadataCache;
  }

  if (!fs.existsSync(METADATA_PATH)) {
    return {};
  }

  try {
    const data = fs.readFileSync(METADATA_PATH, 'utf-8');
    const parsed = JSON.parse(data);
    Object.assign(offlineMetadataCache, parsed);
    return parsed;
  } catch (error) {
    console.error('Error loading offline metadata:', error);
    return {};
  }
}

// Save translation metadata to file
export function saveOfflineMetadata(metadata: Record<string, any>) {
  try {
    fs.mkdirSync(DATA_BASE_PATH, { recursive: true });
    fs.writeFileSync(METADATA_PATH, JSON.stringify(metadata, null, 2));
    Object.assign(offlineMetadataCache, metadata);
    return true;
  } catch (error) {
    console.error('Error saving offline metadata:', error);
    return false;
  }
}

// Interface for offline translation data
export interface OfflineTranslation {
  surah_id: number;
  surah_name: string;
  verses: Array<{
    ayah_number: number;
    text: string;
  }>;
}

// Load a single offline translation for a surah
export function loadOfflineTranslation(
  translationId: string,
  surahId: number
): Record<number, string> | null {
  const cacheKey = `${translationId}_${surahId}`;
  
  if (offlineTranslationCache.has(cacheKey)) {
    return offlineTranslationCache.get(cacheKey);
  }

  const filePath = path.join(TRANSLATIONS_PATH, `${translationId}.json`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    const allTranslations = JSON.parse(data);

    // Support both formats:
    // 1. Array of surahs
    // 2. Object with surah IDs as keys
    let surahData: any;

    if (Array.isArray(allTranslations)) {
      surahData = allTranslations.find((s: any) => s.surah_id === surahId);
    } else {
      surahData = allTranslations[surahId];
    }

    if (!surahData || !surahData.verses) {
      return null;
    }

    // Convert to ayah_number -> text mapping
    const translations: Record<number, string> = {};
    surahData.verses.forEach((verse: any) => {
      translations[verse.ayah_number] = verse.text || '';
    });

    // Cache the result
    offlineTranslationCache.set(cacheKey, translations);
    return translations;
  } catch (error) {
    console.error(`Error loading offline translation ${translationId} for surah ${surahId}:`, error);
    return null;
  }
}

// Get all available offline translations
export function getAvailableOfflineTranslations(): string[] {
  if (!fs.existsSync(TRANSLATIONS_PATH)) {
    return [];
  }

  try {
    const files = fs.readdirSync(TRANSLATIONS_PATH);
    return files
      .filter(file => file.endsWith('.json'))
      .map(file => file.replace('.json', ''));
  } catch (error) {
    console.error('Error reading offline translations:', error);
    return [];
  }
}

// Check if translation is available offline
export function isTranslationOffline(translationId: string): boolean {
  const filePath = path.join(TRANSLATIONS_PATH, `${translationId}.json`);
  return fs.existsSync(filePath);
}

// Save offline translation data
export function saveOfflineTranslation(
  translationId: string,
  data: OfflineTranslation | OfflineTranslation[]
): boolean {
  try {
    fs.mkdirSync(TRANSLATIONS_PATH, { recursive: true });
    const filePath = path.join(TRANSLATIONS_PATH, `${translationId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    
    // Clear cache for this translation
    offlineTranslationCache.forEach((_, key) => {
      if (key.startsWith(`${translationId}_`)) {
        offlineTranslationCache.delete(key);
      }
    });
    
    return true;
  } catch (error) {
    console.error(`Error saving offline translation ${translationId}:`, error);
    return false;
  }
}

// Get translation metadata for offline version
export function getOfflineTranslationMetadata(translationId: string): any {
  const metadata = loadOfflineMetadata();
  return metadata.translations?.[translationId] || null;
}

// Update translation metadata
export function updateOfflineTranslationMetadata(
  translationId: string,
  meta: any
): boolean {
  const metadata = loadOfflineMetadata();
  
  if (!metadata.translations) {
    metadata.translations = {};
  }

  metadata.translations[translationId] = {
    ...metadata.translations[translationId],
    ...meta,
    lastUpdated: new Date().toISOString()
  };

  return saveOfflineMetadata(metadata);
}

// Clear offline cache
export function clearOfflineCache() {
  offlineTranslationCache.clear();
  Object.keys(offlineMetadataCache).forEach(key => {
    delete offlineMetadataCache[key];
  });
}

// Get offline data summary
export function getOfflineDataSummary(): {
  available: string[];
  path: string;
  total: number;
} {
  return {
    available: getAvailableOfflineTranslations(),
    path: TRANSLATIONS_PATH,
    total: getAvailableOfflineTranslations().length
  };
}
