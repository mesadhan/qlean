# Offline Mode Setup Guide

## Problem We're Solving

When your application can't reach the Quran.com API (no internet, API down, etc.), users see empty surahs. This guide shows you how to create a complete offline bundle that works without any internet connection.

## Two Approaches

### Approach 1: Quick Test (Single Translation)
Good for testing if offline mode works.

### Approach 2: Complete Bundle (All Translations)
Good for production or offline-first apps.

---

## Approach 1: Quick Manual Offline Bundle

### Step 1: Create Test Translation File

Create file: `src/public/assets/data/translations/mujibur.json`

```json
[
  {
    "surah_id": 2,
    "surah_name": "Al-Baqarah",
    "verses": [
      {
        "ayah_number": 1,
        "text": "আলিফ লাম মীম"
      },
      {
        "ayah_number": 2,
        "text": "এটি সেই কিতাব যাতে সন্দেহের অবকাশ নেই"
      }
    ]
  }
]
```

### Step 2: Restart App

```bash
npm run dev
```

### Step 3: Test

1. Go to Surah 2 (Al-Baqarah)
2. You should see the Bengali translation
3. Ctrl+Shift+I → Console
4. Look for: `✓ Loaded surah 2 from offline bundle`

---

## Approach 2: Automatic Offline Bundle (Recommended)

Use the provided script to fetch all translations from Quran.com API and save them locally.

### Prerequisites

- Active internet connection
- About 50-100 MB of disk space
- 5-10 minutes of time

### Step 1: Run Offline Bundle Script

```bash
npm run offline:bundle
```

What happens:
- Script fetches all 114 surahs
- For 8 translations (4 Bengali + 4 English)
- Saves as JSON files in `src/public/assets/data/translations/`
- Creates 8 files (~1-2 MB each)

### Step 2: Watch the Progress

```
🚀 Starting offline translation bundle creation...

📁 Created directory: D:\...\src\public\assets\data\translations

📖 Fetching surah metadata...
✅ Got metadata for 114 surahs

📥 Fetching Sheikh Mujibur Rahman (mujibur)...
  ✓ Processed surah 10/114
  ✓ Processed surah 20/114
  ✓ Processed surah 30/114
  ...
✅ Saved mujibur.json (114 surahs, 0 failed)

[continues for all 8 translations...]

✨ Offline bundle creation complete!
```

### Step 3: Restart App

```bash
npm run dev
```

### Step 4: Test Offline Mode

1. **With Internet**: App uses offline files (much faster!)
2. **Without Internet**: App still works completely
3. **Check Console**: 
   ```
   ✓ Loaded surah 2 from offline bundle (278 ayahs)
   ✓ Loaded surah 3 from offline bundle (200 ayahs)
   ```

---

## File Structure After Setup

```
src/public/assets/data/translations/
├── mujibur.json         (114 surahs, Bengali)
├── rawai.json           (114 surahs, Bengali)
├── taisirul.json        (114 surahs, Bengali)
├── zakaria.json         (114 surahs, Bengali)
├── sahih.json           (114 surahs, English)
├── pickthall.json       (114 surahs, English)
├── yusufali.json        (114 surahs, English)
├── hilali.json          (114 surahs, English)
├── metadata.json        (translation metadata)
└── README.md            (documentation)
```

Each file is ~1-2 MB (8 files = ~10 MB total)

---

## How the System Works

```
User requests Surah 2
        ↓
getSurahById(2) checks:
        ↓
Is mujibur.json loaded? 
    YES → Load from disk (instant)
    NO  → Try API
        ↓
API success?
    YES → Use API data, display immediately
    NO  → Look for any offline files
        ↓
Return what we have
```

### Key Points

✅ **Fast**: Offline files load instantly (no network wait)
✅ **Reliable**: Works without internet
✅ **Automatic**: Script handles all fetching
✅ **Safe**: Original API still works as fallback
✅ **Multiple Translations**: All 8 translations included

---

## Troubleshooting

### Script Won't Run
```bash
# Make sure you have Node.js 18+
node --version

# If you get "npm not found", install Node.js first
```

### Script Fails Partway
```bash
# API might be rate limiting. Wait 5 minutes and try again:
npm run offline:bundle

# Script automatically retries failed surahs
```

### Offline Files Not Loading
```bash
# Check if files were created:
# Windows: Explorer → src/public/assets/data/translations/
# Mac/Linux: ls src/public/assets/data/translations/

# Should show 8 JSON files (mujibur.json, sahih.json, etc.)
```

### App Says "Offline not available"
```bash
# Make sure metadata.json is updated:
# It should list all translations after running the bundle script
```

### Very Slow File Creation
- This is normal for 114 surahs × 8 translations
- It's fetching ~900+ API calls
- Takes 5-15 minutes depending on internet speed
- Progress shows every 10 surahs

---

## Manual Alternative (If Script Fails)

### Create One Translation Manually

1. **Get Translation Data**
   - Visit: https://api.quran.com/api/v4/verses/by_chapter/1?translations=163
   - Replace `1` with surah ID (1-114)
   - Replace `163` with translation ID

2. **Extract Verses**
   - Look for `verses` array
   - Each verse has `verse_number` and `translations[0].text`

3. **Save as JSON**
   - Follow the format from Approach 1
   - Save to `src/public/assets/data/translations/{name}.json`

4. **Repeat** for all 114 surahs for each translation

*(This is why the script is recommended! 👍)*

---

## Performance Comparison

| Scenario | Speed | Internet | Works |
|----------|-------|----------|-------|
| API Only | ~2s per surah | Required | ✓ If online |
| Offline Only | ~0.1s per surah | Not needed | ✓ Always |
| Hybrid (API + Offline) | ~0.1s per surah | Optional | ✓ Always |

---

## What's Included

### 8 Translations

**Bengali (4):**
- Sheikh Mujibur Rahman
- Rawai Al-bayan
- Taisirul Quran
- Dr. Abu Bakr Muhammad Zakaria

**English (4):**
- Sahih International
- Pickthall
- Yusuf Ali
- Al-Hilali & Khan

### 114 Surahs

All chapters of the Quran with complete ayahs

### Full Metadata

Author info, version, year for each translation

---

## Next Steps After Setup

1. **Test**: Try loading different surahs
2. **Verify**: Open browser console, check for "Loaded from offline"
3. **Distribute**: ZIP the `src/public/assets/data/translations/` folder
4. **Share**: Users can extract to same location on their machine
5. **Deploy**: Include files in production build

---

## Tips

💡 **Run script once a month** to get latest translation updates
💡 **Script is idempotent** - safe to run multiple times
💡 **Files are plain JSON** - can edit manually if needed
💡 **Size is ~10 MB** - easy to bundle with app
💡 **No database needed** - just file storage

---

## Questions?

- Check logs: `npm run dev` and look for status messages
- Review: `src/server/helpers/translationLoader.ts`
- Debug: Check if files exist in `src/public/assets/data/translations/`

---

## Quick Reference

```bash
# Create offline bundle
npm run offline:bundle

# Start app (uses offline files automatically)
npm run dev

# Check if offline files exist
ls src/public/assets/data/translations/

# Clear offline files (to test API-only mode)
rm src/public/assets/data/translations/*.json
```

---

**Your app is now ready for offline use! 🚀**
