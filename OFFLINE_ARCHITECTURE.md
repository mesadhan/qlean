# Offline Architecture Diagram

## System Flow

```
┌─────────────────────────────────────────────────────────┐
│               User Views Quran Surah                    │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │  getSurahById(surahId)     │
        └────────────┬───────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │ Check RAM Cache            │
        │ (surahCache Map)           │
        └────┬──────────────────┬────┘
             │ HIT              │ MISS
             │                  │
             │                  ▼
             │         ┌──────────────────────┐
             │         │ Check Available      │
             │         │ Offline Translations │
             │         └──────┬───────────────┘
             │                │
             │                ▼
             │    ┌────────────────────────┐
             │    │ Do we have ALL         │
             │    │ translations offline?  │
             │    └────┬──────────────┬────┘
             │         │ YES          │ NO
             │         │              │
             │         ▼              ▼
             │    ┌────────────┐  ┌─────────────┐
             │    │ Load ALL   │  │ Try API     │
             │    │ from disk  │  │ first       │
             │    │ (JSON)     │  └────┬────────┘
             │    └────┬───────┘       │
             │         │               ▼
             │         │        ┌──────────────┐
             │         │        │ API Success? │
             │         │        └────┬─────┬───┘
             │         │             │ YES │ NO
             │         │             │     │
             │         │             ▼     ▼
             │         │         ┌─────────────┐
             │         │         │ Merge API   │ Try offline
             │         │         │ + offline   │ (fallback)
             │         │         └─────┬───────┘
             │         │               │
             └─────────┴───────────────┴─────────┐
                                                 │
                                                 ▼
                            ┌────────────────────────────┐
                            │ Return Surah with ayahs    │
                            │ (to browser)               │
                            └────────────────┬───────────┘
                                             │
                                             ▼
                        ┌────────────────────────────────┐
                        │ Cache in RAM                   │
                        │ (surahCache)                   │
                        └────────────────┬───────────────┘
                                         │
                                         ▼
                         ┌──────────────────────────────┐
                         │ Display to User              │
                         │ ✓ Arabic text                │
                         │ ✓ Translations               │
                         │ ✓ Fonts applied              │
                         └──────────────────────────────┘
```

## Data Storage Layers

```
┌──────────────────────────────────────────────────────┐
│  Layer 1: RAM Cache (surahCache Map)                 │
│  Speed: Instant (~1ms)                               │
│  Size: ~50 surahs max                                │
│  When: After first load of surah                     │
├──────────────────────────────────────────────────────┤
│  Layer 2: Offline Files (JSON on disk)               │
│  Speed: Fast (~50ms)                                 │
│  Size: ~10 MB (all 8 translations)                   │
│  Where: src/public/assets/data/translations/         │
├──────────────────────────────────────────────────────┤
│  Layer 3: Remote API (quran.com)                     │
│  Speed: Slow (~1-2 seconds)                          │
│  Size: Unlimited                                     │
│  When: If no offline + needs fresh data              │
└──────────────────────────────────────────────────────┘
```

## File Structure

```
src/public/assets/
├── data/
│   ├── translations/           ← OFFLINE DATA (Layer 2)
│   │   ├── mujibur.json       (114 surahs)
│   │   ├── rawai.json         (114 surahs)
│   │   ├── taisirul.json      (114 surahs)
│   │   ├── zakaria.json       (114 surahs)
│   │   ├── sahih.json         (114 surahs)
│   │   ├── pickthall.json     (114 surahs)
│   │   ├── yusufali.json      (114 surahs)
│   │   ├── hilali.json        (114 surahs)
│   │   ├── metadata.json      (translation info)
│   │   └── README.md          (guide)
│   └── (other data files)
└── fonts/
    ├── traditional/           ← CUSTOM FONTS
    ├── uthmani/
    ├── indopak/
    └── tajweed/
```

## Code Flow: Getting Surah 2 (Al-Baqarah)

```javascript
// 1. User visits /surah/2
GET /surah/2

// 2. Server calls getSurahById(2)
export async function getSurahById(id: number): Promise<Surah>

// 3. Check RAM cache
surahCache.has(2) → NO, continue

// 4. Get list of available offline translations
const availableOffline = getAvailableOfflineTranslations()
// Returns: ['mujibur', 'sahih', 'pickthall', ...]

// 5. Check if ALL needed translations are offline
const hasAllOfflineTranslations = TRANSLATION_EDITIONS.every(
  edition => !edition.apiId || availableOffline.includes(edition.id)
)

// 6a. IF all offline → Load only from disk
if (hasAllOfflineTranslations && availableOffline.length > 0) {
  for (let ayahNum = 1; ayahNum <= 286; ayahNum++) {
    const offlineData = loadOfflineTranslation('mujibur', 2)
    // Returns: { 1: "Alif Lam Mim", 2: "This is the Book...", ... }
  }
  return surah // From disk, instant
}

// 6b. IF missing translations → Use API with offline fallback
else {
  try {
    const response = await fetch(API_BASE + '/verses/by_chapter/2?translations=...')
    // Process API verses
    // Merge with any available offline data
  } catch (error) {
    // API failed, use only what we have offline
    // Return partial surah
  }
  return surah // From API + offline
}

// 7. Cache in RAM for next request
surahCache.set(2, surah)

// 8. Return to client
res.json(surah)
```

## Key Functions

```typescript
// Check if translation files exist
getAvailableOfflineTranslations(): string[]
// Returns: ['mujibur', 'sahih', 'pickthall', ...]

// Load one translation for one surah
loadOfflineTranslation(translationId: string, surahId: number): Record<number, string> | null
// Returns: { 1: "Text 1", 2: "Text 2", ... }

// Get all offline info
getOfflineStatus(): OfflineStatus
// Returns: { available: ['mujibur', ...], fonts: [...], completeness: 87.5% }

// Save translation to disk (used by bundle script)
saveOfflineTranslation(translationId: string, data: OfflineTranslation[]): boolean
```

## Sequence Diagram

```
User              Browser          Server          Disk (JSON)
 │                  │                │                 │
 │─ Click Surah 2 ─>│                │                 │
 │                  │─ GET /surah/2 ─>│                 │
 │                  │                 │ getSurahById(2) │
 │                  │                 │ ────────────────>
 │                  │                 │ Check cache → NO
 │                  │                 │ ────────────────>
 │                  │                 │ Check offline → YES (mujibur.json exists)
 │                  │                 │ ────────────────>
 │                  │                 │ Load mujibur.json
 │                  │                 │<────────────────
 │                  │                 │ Load pickthall.json
 │                  │                 │<────────────────
 │                  │                 │ Merge all data
 │                  │                 │ Return surah object
 │                  │<─ JSON (surah) ─│
 │<─ HTML (rendered)─│
 │ Display Surah 2  │
 │                  │

TIME COMPARISON:
- With offline: 50ms (disk read)
- Without offline, API up: 2000ms (network)
- Without offline, API down: ERROR
```

## Performance Metrics

```
Scenario 1: Cold Start (No Cache)
├─ With offline files:     50-100ms
├─ With API (online):      2000-3000ms
└─ With API (offline):     ERROR

Scenario 2: Warm (Cached)
├─ From RAM cache:         1-5ms
├─ From API cache:         (not used)
└─ Fast either way

Scenario 3: No Internet
├─ With offline files:     50-100ms ✓
├─ Without offline:        ERROR ✗
└─ Hybrid (has some):      50-100ms (use what's offline)

Total Bundle Size:
├─ All 8 translations:     ~10-15 MB
├─ Compressed (ZIP):       ~3-5 MB
├─ On disk after extract:  ~10-15 MB
└─ In RAM (when loading):  ~50 MB per 50 surahs
```

## Offline Bundle Script Flow

```
npm run offline:bundle
         │
         ▼
Fetch surah metadata (114 surahs)
         │
         ├─> Surah 1: Al-Fatihah (7 ayahs)
         ├─> Surah 2: Al-Baqarah (286 ayahs)
         ├─> ... 112 more
         │
         ▼
For each of 8 translations:
    │
    ├─> mujibur (Bengali)
    │   ├─ Fetch verses/by_chapter/1?translations=163
    │   ├─ Fetch verses/by_chapter/2?translations=163
    │   ├─ ... 112 more
    │   └─ Save as mujibur.json
    │
    ├─> rawai (Bengali)
    │   ├─ Fetch 114 surahs
    │   └─ Save as rawai.json
    │
    ├─> taisirul (Bengali)
    ├─> zakaria (Bengali)
    ├─> sahih (English)
    ├─> pickthall (English)
    ├─> yusufali (English)
    └─> hilali (English)
         │
         ▼
Total: 114 × 8 = 912 API calls
Time: 5-15 minutes (with rate limiting)
Result: 8 JSON files (~10 MB total)
```

---

## When to Use Each Layer

| Scenario | Layer Used | Result |
|----------|-----------|--------|
| First load, offline files exist | Layer 2 | ✓ Works, fast |
| First load, offline files missing, API up | Layer 3 | ✓ Works, slower |
| First load, offline files missing, API down | ERROR | ✗ Fails |
| Second load of same surah | Layer 1 | ✓ Works, instant |
| Subsequent loads of different surahs | Layer 2+1 | ✓ Works, fast |
| After offline bundle created | Layer 2+1 | ✓ Works always |

---

**System is designed to be:** Fast → Reliable → Works Offline
