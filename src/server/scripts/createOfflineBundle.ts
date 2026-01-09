/**
 * Script to create offline translation bundle
 * This fetches translations from Quran.com API and saves them locally
 * Usage: npx tsx src/server/scripts/createOfflineBundle.ts
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const API_BASE = 'https://api.quran.com/api/v4';

// Translation configurations to fetch
const TRANSLATIONS_TO_FETCH = [
  { id: 'mujibur', apiId: 163, label: 'Sheikh Mujibur Rahman' },
  { id: 'rawai', apiId: 213, label: 'Rawai Al-bayan' },
  { id: 'taisirul', apiId: 161, label: 'Taisirul Quran' },
  { id: 'zakaria', apiId: 162, label: 'Dr. Abu Bakr Muhammad Zakaria' },
  { id: 'sahih', apiId: 20, label: 'Sahih International' },
  { id: 'pickthall', apiId: 19, label: 'Pickthall' },
  { id: 'yusufali', apiId: 22, label: 'Yusuf Ali' },
  { id: 'hilali', apiId: 203, label: 'Al-Hilali & Khan' },
];

const TRANSLATIONS_DIR = path.join(__dirname, '../../public/assets/data/translations');

interface AyahData {
  ayah_number: number;
  text: string;
}

interface SurahData {
  surah_id: number;
  surah_name: string;
  verses: AyahData[];
}

// Sleep helper
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Fetch translation for a single surah with retry logic
async function fetchSurahTranslation(
  surahId: number,
  translationApiId: number,
  translationId: string,
  retries = 3
): Promise<AyahData[]> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(
        `${API_BASE}/verses/by_chapter/${surahId}?translations=${translationApiId}&per_page=300`
      );

      if (!response.ok) {
        if (response.status === 429) {
          const delay = Math.pow(2, attempt) * 1000;
          console.log(
            `  ⏳ Rate limited on attempt ${attempt}/${retries}, waiting ${delay}ms...`
          );
          await sleep(delay);
          continue;
        }
        throw new Error(`HTTP ${response.status}`);
      }

      const data: any = await response.json();
      const verses = data.verses || [];

      return verses.map((verse: any) => ({
        ayah_number: verse.verse_number,
        text:
          verse.translations?.[0]?.text?.replace(/<sup[^>]*>.*?<\/sup>/g, '') ||
          '',
      }));
    } catch (error) {
      if (attempt === retries) {
        console.error(
          `  ❌ Failed to fetch surah ${surahId} (${translationId}):`,
          error
        );
        return [];
      }
      const delay = Math.pow(2, attempt) * 1000;
      console.log(`  ⚠️  Attempt ${attempt}/${retries} failed, retrying in ${delay}ms...`);
      await sleep(delay);
    }
  }
  return [];
}

// Get surah metadata
async function getSurahMetadata(): Promise<
  Map<number, { name: string; transliteration: string }>
> {
  try {
    const response = await fetch(`${API_BASE}/chapters`);
    const data: any = await response.json();
    const metadata = new Map();

    (data.chapters || []).forEach((chapter: any) => {
      metadata.set(chapter.id, {
        name: chapter.name,
        transliteration: chapter.transliteration_en,
      });
    });

    return metadata;
  } catch (error) {
    console.error('Failed to fetch surah metadata:', error);
    return new Map();
  }
}

// Main function to create offline bundle
async function createOfflineBundle() {
  console.log('🚀 Starting offline translation bundle creation...\n');

  // Create translations directory if it doesn't exist
  if (!fs.existsSync(TRANSLATIONS_DIR)) {
    fs.mkdirSync(TRANSLATIONS_DIR, { recursive: true });
    console.log(`📁 Created directory: ${TRANSLATIONS_DIR}\n`);
  }

  // Get surah metadata
  console.log('📖 Fetching surah metadata...');
  const surahMetadata = await getSurahMetadata();
  if (surahMetadata.size === 0) {
    console.error('❌ Failed to fetch surah metadata. Aborting.');
    return;
  }
  console.log(`✅ Got metadata for ${surahMetadata.size} surahs\n`);

  // Fetch each translation
  for (const translation of TRANSLATIONS_TO_FETCH) {
    console.log(
      `\n📥 Fetching ${translation.label} (${translation.id})...`
    );

    const translationData: Record<number, SurahData> = {};
    let successCount = 0;
    let failureCount = 0;

    // Fetch all 114 surahs for this translation
    for (let surahId = 1; surahId <= 114; surahId++) {
      const metadata = surahMetadata.get(surahId);
      if (!metadata) {
        console.log(`  ⚠️  Skipping surah ${surahId}: no metadata`);
        continue;
      }

      const verses = await fetchSurahTranslation(
        surahId,
        translation.apiId,
        translation.id
      );

      if (verses.length > 0) {
        translationData[surahId] = {
          surah_id: surahId,
          surah_name: metadata.name,
          verses,
        };
        successCount++;

        // Progress indicator
        if (surahId % 10 === 0) {
          console.log(`  ✓ Processed surah ${surahId}/${114}`);
        }

        // Rate limiting: small delay between requests
        await sleep(100);
      } else {
        failureCount++;
        console.log(`  ✗ Failed to fetch surah ${surahId}`);
      }
    }

    // Save translation file
    if (successCount > 0) {
      const outputPath = path.join(TRANSLATIONS_DIR, `${translation.id}.json`);

      // Convert to array format expected by the app
      const translationArray = Array.from({ length: 114 }, (_, i) =>
        translationData[i + 1]
      ).filter(Boolean);

      fs.writeFileSync(outputPath, JSON.stringify(translationArray, null, 2));

      console.log(
        `\n✅ Saved ${translation.id}.json (${successCount} surahs, ${failureCount} failed)`
      );
      console.log(`   File: ${outputPath}`);
    } else {
      console.log(`\n❌ Failed to save ${translation.id}.json (no data)`);
    }
  }

  console.log('\n✨ Offline bundle creation complete!');
  console.log(`📁 Translations saved to: ${TRANSLATIONS_DIR}`);
  console.log(
    '\n💡 Tip: You can now run the app offline or with this data cached locally.'
  );
}

// Run the script
createOfflineBundle().catch(console.error);
