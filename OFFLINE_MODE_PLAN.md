# Offline Mode Implementation Plan

## Overview
Create a comprehensive offline mode system allowing users to:
1. Manually download and use local fonts
2. Load translations from local JSON files instead of API
3. Work completely offline with bundled data
4. Add custom translation authors and metadata
5. Gracefully fallback to API when offline data is unavailable

---

## Directory Structure

```
src/
├── public/
│   ├── icons/
│   └── assets/
│       ├── fonts/                          [NEW] User fonts folder
│       │   ├── README.md                   Instructions
│       │   ├── uthmani/                    Uthmani font
│       │   ├── indopak/                    IndoPak font
│       │   └── tajweed/                    Tajweed font
│       │
│       └── data/                           [NEW] Offline data
│           ├── translations/               All translations
│           │   ├── mujibur.json           Bengali translation
│           │   ├── rawai.json
│           │   ├── taisirul.json
│           │   ├── zakaria.json
│           │   ├── sahih.json             English translation
│           │   ├── pickthall.json
│           │   ├── yusufali.json
│           │   └── hilali.json
│           │
│           ├── metadata.json               [NEW] Translation metadata
│           │   - authors
│           │   - timestamps
│           │   - versions
│           │   - source
│           │
│           └── surahs.json                 [NEW] Surah metadata
│
├── server/
│   ├── services/
│   │   ├── quranApi.ts                    [MODIFY] Keep existing
│   │   └── offlineManager.ts              [NEW] Offline data management
│   │
│   └── helpers/
│       └── translationLoader.ts            [NEW] Load from disk/API
│
└── views/
    └── ...
```

---

## Implementation Steps

### 1. Create Offline Manager Helper (`src/server/helpers/translationLoader.ts`)
- Check if offline translation exists
- Load translation from JSON file
- Fallback to API if offline unavailable
- Cache management
- Handle translation metadata (author, version, etc.)

### 2. Create Offline Data Manager (`src/server/services/offlineManager.ts`)
- Initialize offline folder structure
- Check available offline translations
- Return list of offline vs API translations
- Validate offline data integrity
- Handle metadata updates

### 3. Modify API Service (`src/server/services/quranApi.ts`)
- Add offline mode detection
- Integrate translation loader
- Check offline first, fallback to API
- Skip API calls if offline data complete
- Add metadata handling

### 4. Create Directory Structure
- `src/public/assets/fonts/` - For user fonts
- `src/public/assets/data/translations/` - For translation JSONs
- `src/public/assets/data/` - Metadata files

### 5. Create Sample Offline Data
- Convert one API translation to offline JSON
- Create metadata.json template
- Create README with instructions

### 6. Add Configuration
- Add offline mode flag to config
- Track which translations are offline
- Allow users to prefer offline when available

---

## Data Format

### Translation JSON Format
```json
{
  "surah_id": 1,
  "surah_name": "Al-Fatiha",
  "verses": [
    {
      "ayah_number": 1,
      "text": "Translation text here..."
    },
    {
      "ayah_number": 2,
      "text": "Translation text here..."
    }
  ]
}
```

### Metadata JSON Format
```json
{
  "translations": {
    "mujibur": {
      "label": "শেখ মুজিবুর রহমান",
      "language": "bangla",
      "author": "Sheikh Mujibur Rahman",
      "translator": "Sheikh Mujibur Rahman",
      "version": "1.0",
      "year": 2024,
      "source": "Offline Bundle",
      "isOffline": true,
      "lastUpdated": "2024-01-09"
    }
  }
}
```

---

## API Changes (Backward Compatible)

### Translation Interface Enhancement
```typescript
export interface TranslationEdition {
  id: string;
  apiId?: number;                    // Optional for offline-only
  label: string;
  language: 'bangla' | 'english' | 'urdu';
  author?: string;                   // NEW: Translation author
  translator?: string;               // NEW: Who did the translation
  isDefault: boolean;
  isOffline?: boolean;               // NEW: Loaded from offline
  source?: string;                   // NEW: API or Offline Bundle
  order: number;
}
```

### getSurahById Enhancement
- Try offline first
- Fall back to API
- Return combined result if both available

---

## Benefits

✅ **Offline Capability** - Full Quran access without internet
✅ **Customizable** - Users can add their own fonts/translations
✅ **Backward Compatible** - Existing API still works
✅ **Faster Loading** - JSON files faster than API calls
✅ **User Control** - Choose offline vs API
✅ **Bundleable** - Can create offline bundles for distribution
✅ **Author Credit** - Track translation authors

---

## Testing Strategy

1. **Verify offline data loads** when files exist
2. **Verify API fallback** when offline unavailable
3. **Verify metadata applies** correctly
4. **Verify font loading** from assets folder
5. **Verify caching** works properly
6. **Verify no breaking changes** to existing functionality
7. **Test offline + online mode switching**

---

## Rollout Plan

1. ✅ Review this plan
2. Create helper functions (non-breaking)
3. Create directory structure
4. Add offline manager
5. Integrate into API service (with fallbacks)
6. Test thoroughly
7. Create sample offline bundle
8. Document usage

---

## Risk Assessment

**Low Risk** - All changes are additive with fallbacks
- Existing API calls preserved
- Offline is optional feature
- Complete backward compatibility
- No database changes

---
