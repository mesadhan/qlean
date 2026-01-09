# Offline Translations

This directory contains offline translation data in JSON format. These translations are loaded locally instead of from the API, enabling offline functionality.

## Directory Structure

```
translations/
├── mujibur.json          - Bengali: Sheikh Mujibur Rahman
├── rawai.json            - Bengali: Rawai Al-bayan
├── taisirul.json         - Bengali: Taisirul Quran
├── zakaria.json          - Bengali: Dr. Abu Bakr Zakaria
├── sahih.json            - English: Sahih International
├── pickthall.json        - English: Pickthall
├── yusufali.json         - English: Yusuf Ali
└── hilali.json           - English: Al-Hilali & Khan
```

## File Format

Each translation file contains a JSON array of surah objects:

```json
[
  {
    "surah_id": 1,
    "surah_name": "Al-Fatihah",
    "verses": [
      {
        "ayah_number": 1,
        "text": "Translation text for verse 1..."
      },
      {
        "ayah_number": 2,
        "text": "Translation text for verse 2..."
      }
    ]
  },
  {
    "surah_id": 2,
    "surah_name": "Al-Baqarah",
    "verses": [
      // ... verses for surah 2
    ]
  }
]
```

Or use object format (alternative):

```json
{
  "1": {
    "surah_id": 1,
    "surah_name": "Al-Fatihah",
    "verses": [
      {
        "ayah_number": 1,
        "text": "Translation text for verse 1..."
      }
    ]
  },
  "2": {
    "surah_id": 2,
    "surah_name": "Al-Baqarah",
    "verses": []
  }
}
```

## How to Add Custom Translations

### 1. Prepare Translation Data
Create a JSON file with the format shown above, containing:
- Surah ID (1-114)
- Surah name
- Ayah numbers (1 - totalAyahs)
- Translation text for each ayah

### 2. File Naming
Name your file after the translation ID (lowercase, no spaces):
- `{translation_id}.json`

Examples:
```
mujibur.json
myFavouriteTranslation.json
customTranslation.json
```

### 3. Place in Directory
Put your JSON file in this `translations/` folder

### 4. Update Metadata
Edit `../metadata.json` to add your translation metadata:

```json
{
  "translations": {
    "yourTranslationId": {
      "label": "Display Name in UI",
      "language": "bangla",
      "author": "Translator Name",
      "translator": "Translator Name",
      "version": "1.0",
      "year": 2024,
      "source": "Offline Bundle",
      "isOffline": true,
      "lastUpdated": "2024-01-09"
    }
  }
}
```

### 5. Update TRANSLATION_EDITIONS
Add your translation to `src/server/services/quranApi.ts`:

```typescript
{ 
  id: 'yourTranslationId', 
  label: 'Display Name in UI', 
  language: 'bangla' or 'english' or 'urdu',
  author: 'Translator Name',
  isDefault: false, 
  order: 5 
}
```

### 6. Restart Application
The application will automatically detect and load your translation

## Example: Adding a Bengali Translation

### Step 1: Create `mybengali.json`
```json
[
  {
    "surah_id": 1,
    "surah_name": "Al-Fatihah",
    "verses": [
      {
        "ayah_number": 1,
        "text": "শুরু করছি আল্লাহর নামে যিনি পরম করুণাময় ও অত্যন্ত দয়ালু"
      },
      {
        "ayah_number": 2,
        "text": "সকল প্রশংসা বিশ্বজাহানের প্রতিপালক আল্লাহর জন্য"
      }
      // ... more verses
    ]
  },
  {
    "surah_id": 2,
    "surah_name": "Al-Baqarah",
    // ... verses for surah 2
  }
  // ... more surahs
]
```

### Step 2: Update metadata.json
```json
{
  "translations": {
    "mybengali": {
      "label": "আমার বেঙ্গল অনুবাদ",
      "language": "bangla",
      "author": "আপনার নাম",
      "translator": "আপনার নাম",
      "version": "1.0",
      "year": 2024,
      "source": "Offline Bundle",
      "isOffline": true,
      "lastUpdated": "2024-01-09"
    }
  }
}
```

### Step 3: Update quranApi.ts
Add to `TRANSLATION_EDITIONS`:
```typescript
{ 
  id: 'mybengali', 
  label: 'আমার বেঙ্গল অনুবাদ', 
  language: 'bangla',
  author: 'আপনার নাম',
  isDefault: false, 
  order: 5 
}
```

## Data Validation

Use this validation checklist:

- [ ] All 114 surahs included
- [ ] Each surah has correct ayah count
- [ ] Ayah numbers are sequential (1 to totalAyahs)
- [ ] No missing verses
- [ ] Valid JSON syntax (use JSON validator)
- [ ] Text content is accurate
- [ ] File is UTF-8 encoded
- [ ] File size is reasonable (< 10MB)

## Performance Tips

### File Size Optimization
1. **Remove unnecessary spaces**: Minify JSON
2. **Use compression**: GZIP for smaller downloads
3. **Split large files**: One file per language is fine
4. **Use modern format**: JSON is most efficient

### Loading Performance
1. Application caches translations in memory
2. Translations load on-demand by surah
3. No API calls needed once loaded locally
4. Subsequent reads are instant

### Recommended Size
- Single translation: 2-5 MB
- All translations: < 50 MB
- Acceptable for offline bundles

## Translation Sources

### Public Translation APIs
- Quran.com API - Free, comprehensive
- Quran Cloud API - Free, multiple translations
- Islamic Network API - Free, well-documented

### Manual Translation
- Licensed translations with permission
- Original translations
- Custom annotations

### Format Conversion
Convert from other formats:
```javascript
// From CSV to JSON
// From XML to JSON
// From Database to JSON
```

Tools:
- https://www.convertcsv.com/csv-to-json.htm
- Online JSON editors
- Node.js scripts

## Offline Bundle Creation

### Create Complete Bundle
1. Add all translation files to `translations/`
2. Update `metadata.json`
3. Update fonts in `fonts/` directory
4. Package everything for distribution

### Bundle Structure
```
quran-offline-bundle/
├── data/
│   ├── translations/
│   │   ├── mujibur.json
│   │   ├── sahih.json
│   │   └── ...
│   └── metadata.json
├── fonts/
│   ├── traditional/
│   ├── uthmani/
│   ├── indopak/
│   └── tajweed/
└── README.md
```

### Distribution
- Compress as ZIP or TAR
- Provide installation instructions
- Include version information
- Document translations included

## Metadata Fields

### Required
- `label` - Display name in UI
- `language` - Language code (bangla, english, urdu)
- `author` - Translation author

### Optional
- `translator` - Who performed translation
- `version` - Translation version number
- `year` - Year of translation
- `source` - Source (API, Offline Bundle, Manual)
- `isOffline` - Loaded from offline (auto-detected)
- `lastUpdated` - Last update date

## Supported Languages

- `bangla` - Bengali
- `english` - English
- `urdu` - Urdu

To add other languages:
1. Create translation files
2. Add language code to metadata
3. Update `TranslationEdition` interface in code
4. Update UI language selectors

## Troubleshooting

### Translation not appearing
1. Check file is in `translations/` folder
2. Verify JSON is valid (use validator)
3. Check metadata.json has entry
4. Restart application
5. Clear browser cache

### Translation shows as "undefined"
1. Verify ayah numbers are correct
2. Check text field is not empty
3. Validate JSON structure
4. Check surah_id matches ayah_number

### Wrong translation content
1. Verify source text is correct
2. Check for encoding issues (UTF-8)
3. Validate JSON escaping (quotes, newlines)
4. Compare with source

### Performance slow
1. Check file size (shouldn't exceed 10MB)
2. Minify JSON if large
3. Check system resources
4. Review browser console for errors

## Resources

- **Quran API Documentation**: https://quran.api-docs.io/
- **JSON Format**: https://www.json.org/
- **UTF-8 Encoding**: https://unicode.org/
- **Offline Storage**: Browser IndexedDB, LocalStorage

## License

Ensure translations have proper licensing:
- Verify copyright status
- Check for usage restrictions
- Include proper attribution
- Respect author rights

## Support

For questions about offline translations:
1. Check this README
2. Review example files
3. Validate your JSON
4. Check application logs
5. Contact developers
