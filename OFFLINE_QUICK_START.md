# Offline Mode - Quick Start Guide

## 🚀 What's New

Your Quran Reader now supports **fully offline mode** with:
- ✅ Local translation files
- ✅ Local fonts (Uthmani, IndoPak, Tajweed)
- ✅ Smart API fallback
- ✅ Complete offline bundling capability

## 📂 New Folders Created

```
src/public/assets/
├── data/
│   ├── translations/          ← Add translation JSON files here
│   ├── metadata.json          ← Translation metadata
│   └── README.md             ← Detailed guide
└── fonts/
    ├── traditional/           ← Traditional Arabic font folder
    ├── uthmani/              ← Uthmani font folder
    ├── indopak/              ← IndoPak font folder
    ├── tajweed/              ← Tajweed font folder
    └── README.md             ← Detailed guide
```

## ⚡ 5-Minute Setup

### Option 1: Add an Offline Translation

1. **Create translation file**
   ```
   src/public/assets/data/translations/myjibur.json
   ```

2. **Add content** (format: array of surahs)
   ```json
   [
     {
       "surah_id": 1,
       "surah_name": "Al-Fatihah",
       "verses": [
         {
           "ayah_number": 1,
           "text": "Your translation text here..."
         }
       ]
     }
   ]
   ```

3. **Update metadata**
   Edit `src/public/assets/data/metadata.json`:
   ```json
   {
     "translations": {
       "myjibur": {
         "label": "My Translation",
         "language": "bengali",
         "author": "Your Name"
       }
     }
   }
   ```

4. **Restart app**
   - Server will auto-detect
   - Translation appears in UI
   - No API calls for this translation

### Option 2: Add a Font

1. **Download font file**
   - Format: TTF, OTF, WOFF, or WOFF2
   - Ensure it has Arabic characters
   - Examples: Scheherazade, IndoPak

2. **Place in folder**
   ```
   src/public/assets/fonts/uthmani/ScheharzadeNew.ttf
   src/public/assets/fonts/indopak/IndoPak.otf
   src/public/assets/fonts/tajweed/Tajweed.ttf
   ```

3. **Use in Settings**
   - Click settings button (⚙️) in navbar
   - Go to "Quran Font" section
   - Select your font
   - Changes apply instantly

## 🔄 How It Works

```
User views Surah
        ↓
Check: Is offline translation available?
    YES → Load from disk (fast, no internet needed)
    NO  → Load from API (uses internet)
        ↓
Display to user
```

## 📋 Complete Offline Bundle Checklist

- [ ] Create all translation JSON files (114 surahs each)
- [ ] Add fonts to folders
- [ ] Update metadata.json with all translations
- [ ] Test each translation loads correctly
- [ ] Test each font displays correctly
- [ ] Verify offline status shows complete
- [ ] Package for distribution

## 🎯 Use Cases

### Case 1: Add Bengali Translation
```
1. Create: translations/myBengali.json
2. Update: metadata.json with Bengali metadata
3. Restart app
4. Use immediately!
```

### Case 2: Create Offline Bundle
```
1. Add all 8+ translations to translations/ folder
2. Add all fonts to fonts/ folders
3. Update metadata.json
4. Run app in offline mode
5. Works 100% without internet!
```

### Case 3: Custom Author Translations
```
1. Create translation file
2. Add author metadata
3. User sees translation + author credit
4. Works offline when bundled
```

## 📊 Translation Metadata Fields

**Required:**
- `label` - Name shown in UI
- `language` - "bangla", "english", or "urdu"
- `author` - Who created/translated it

**Optional:**
- `translator` - Person who did translation
- `version` - Translation version (e.g., "1.0")
- `year` - Year published
- `lastUpdated` - Last update date

**Auto-set:**
- `isOffline` - Set automatically when detected
- `source` - Shows "Offline Bundle" or "API"

## 🔍 Verify It Works

1. **Check directories created**
   ```
   ✓ src/public/assets/data/translations/
   ✓ src/public/assets/fonts/traditional/
   ✓ src/public/assets/fonts/uthmani/
   ✓ src/public/assets/fonts/indopak/
   ✓ src/public/assets/fonts/tajweed/
   ```

2. **Check metadata exists**
   ```
   ✓ src/public/assets/data/metadata.json
   ```

3. **View server logs**
   - Look for: "Offline Manager:" message
   - Look for: "Fonts Manager:" message
   - Should show 0 translations initially

4. **Add sample translation**
   - Place in translations/ folder
   - Restart server
   - Logs should show "1 translation available"

## 🐛 Troubleshooting

**Translation doesn't appear?**
- [ ] File is in correct folder
- [ ] JSON syntax is valid
- [ ] metadata.json updated
- [ ] Server restarted
- [ ] Browser cache cleared

**Font doesn't work?**
- [ ] File in correct folder (e.g., uthmani/)
- [ ] Font file is valid
- [ ] Try different format (TTF → OTF)
- [ ] Clear browser cache
- [ ] Hard refresh (Ctrl+Shift+R)

**Offline not working?**
- [ ] Check server logs
- [ ] Verify file permissions
- [ ] Check directory exists
- [ ] Validate JSON files
- [ ] Try restarting app

## 📚 Full Documentation

For detailed information, see:
- [Offline Implementation Guide](OFFLINE_IMPLEMENTATION_GUIDE.md)
- [Translations README](src/public/assets/data/translations/README.md)
- [Fonts README](src/public/assets/fonts/README.md)
- [Offline Mode Plan](OFFLINE_MODE_PLAN.md)

## ✅ Key Points

✅ **Fully backward compatible** - Existing functionality unchanged
✅ **No internet required** - Works completely offline
✅ **Fast loading** - JSON files load faster than API
✅ **Easy to add** - Just drop files in folders
✅ **Smart fallback** - Uses API if offline unavailable
✅ **Author credit** - Translation metadata preserved

## 🚀 Next Steps

1. **Right now**: Explore the new folders
2. **Next**: Add sample translation or font
3. **Then**: Test offline functionality
4. **Finally**: Create full offline bundle for distribution

---

**Everything is ready to go! Start adding your offline translations and fonts today.**
