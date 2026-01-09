# Offline Mode Troubleshooting

## Problem: "Error fetching surah 2: TypeError: fetch failed"

### What This Means
The app tried to fetch surah data from Quran.com API but failed (no internet or API down), and there's no offline data to fall back to.

### Quick Fix: Create Offline Bundle

```bash
# This fetches all translations and saves them locally
npm run offline:bundle
```

Then restart the app:
```bash
npm run dev
```

---

## Problem: App Shows Empty Surahs

### Symptom
- Browser shows: "Surah name" but no ayahs visible
- Settings work, but translations are empty

### Causes & Solutions

**Cause 1: No Offline Files + No Internet**
```
Solution:
1. Run: npm run offline:bundle (requires internet)
2. Restart: npm run dev
```

**Cause 2: Offline Files Corrupted**
```
Solution:
1. Delete bad files: rm src/public/assets/data/translations/*.json
2. Run: npm run offline:bundle
3. Restart: npm run dev
```

**Cause 3: Wrong File Format**
```
Solution:
Check file format in src/public/assets/data/translations/
Should be:
[
  { "surah_id": 1, "surah_name": "...", "verses": [...] },
  { "surah_id": 2, "surah_name": "...", "verses": [...] }
]
```

---

## Problem: "Offline files not detected"

### Check If Files Exist

**Windows (PowerShell):**
```powershell
Get-ChildItem "src\public\assets\data\translations\" | Select Name
```

**Mac/Linux:**
```bash
ls src/public/assets/data/translations/
```

Should show:
```
mujibur.json
sahih.json
pickthall.json
[etc]
```

### If Files Don't Exist

```bash
# Create the directory
mkdir -p src/public/assets/data/translations

# Run the bundle script
npm run offline:bundle
```

### If Files Exist but Not Detected

1. Check file permissions:
   - Files should be readable
   - Not corrupted

2. Check file content:
   ```bash
   # See first 50 lines
   head -50 src/public/assets/data/translations/mujibur.json
   ```

3. Restart the server:
   ```bash
   npm run dev
   ```

---

## Problem: Script Error "Cannot find module"

### Error Message
```
Error: Cannot find module 'path'
or
Cannot find module 'fs'
```

### Solution
```bash
# Make sure Node.js is installed
node --version
# Should show: v18.0.0 or higher

# If not, install Node.js from: https://nodejs.org/
```

---

## Problem: Script Fails Halfway

### Error Message
```
⚠ API failed for surah 50: getaddrinfo ENOTFOUND api.quran.com
Failed to fetch surah 50 (mujibur): ...
```

### Causes

**Cause 1: Internet Disconnected**
```
Solution:
- Check internet connection
- Restart script when ready
- Script automatically resumes from where it failed
```

**Cause 2: API Rate Limited**
```
Solution:
- Wait 5 minutes
- Run again: npm run offline:bundle
- Script has built-in delays
```

**Cause 3: API Temporarily Down**
```
Solution:
- Try later
- Or manually add a few translations
- Run script again when API is up
```

### Prevention

- Run script at off-peak hours
- Ensure stable internet
- Don't interrupt the script (it's safe to restart)

---

## Problem: Very Slow Script Execution

### What's Normal
```
Fetching ~900 API calls (114 surahs × 8 translations)
Expected time: 5-15 minutes
Progress shown every 10 surahs
```

### Speed Optimization

**Option 1: Fetch Only Some Translations**
```
Edit src/server/scripts/createOfflineBundle.ts
Line 21, reduce TRANSLATIONS_TO_FETCH:

const TRANSLATIONS_TO_FETCH = [
  { id: 'mujibur', apiId: 163, label: 'Mujibur' },
  { id: 'sahih', apiId: 20, label: 'Sahih' },
  // Remove the rest temporarily
];
```

**Option 2: Run at Different Time**
- Quran.com API might be faster at certain hours
- Try running late at night or early morning

**Option 3: Run Twice Daily**
- Get one translation at a time
- Combine the files later

---

## Problem: "Offset 4 is out of bounds"

### What This Means
A JSON file is corrupted or incomplete.

### Solution
```bash
# Delete the corrupted file
rm src/public/assets/data/translations/mujibur.json

# Delete all and start fresh
rm src/public/assets/data/translations/*.json

# Run again
npm run offline:bundle
```

---

## Problem: Console Shows Wrong Logs

### Wrong Log #1
```
✗ Error fetching surah 2: API returned 429
```
**Meaning**: API is rate limiting
**Solution**: Wait 5 minutes, API will respond again

### Wrong Log #2
```
⚠ Offline not available
```
**Meaning**: No offline files found
**Solution**: Run `npm run offline:bundle`

### Wrong Log #3
```
✓ Loaded surah 2 from offline bundle
```
**Meaning**: Working! Using offline files (good!)
**Solution**: Nothing needed, system is working correctly

---

## Problem: Fonts Not Applying

### Check If Font Files Exist

```bash
ls src/public/assets/fonts/uthmani/
ls src/public/assets/fonts/indopak/
```

Should show font files:
```
Scheherazade.ttf
IndoPak.otf
[etc]
```

### If No Font Files

```bash
# Create directory
mkdir -p src/public/assets/fonts/uthmani
mkdir -p src/public/assets/fonts/indopak
mkdir -p src/public/assets/fonts/tajweed
mkdir -p src/public/assets/fonts/traditional

# Download fonts and place in folders
# Then restart app
npm run dev
```

### If Fonts Still Don't Apply

1. Hard refresh browser:
   - Windows: Ctrl + Shift + R
   - Mac: Cmd + Shift + R

2. Clear browser cache:
   - F12 → Storage → Clear All

3. Restart server:
   - npm run dev

---

## Problem: Metadata Missing

### Error
```
TypeError: Cannot read property 'translations' of null
```

### Solution

Check if `src/public/assets/data/metadata.json` exists:

```bash
cat src/public/assets/data/metadata.json
```

If missing, create it:

```json
{
  "translations": {
    "mujibur": {
      "label": "Sheikh Mujibur Rahman",
      "language": "bangla",
      "author": "Sheikh Mujibur Rahman"
    },
    "sahih": {
      "label": "Sahih International",
      "language": "english",
      "author": "Various Scholars"
    }
  }
}
```

---

## Diagnostic Checklist

When something doesn't work, check these in order:

### 1. Offline Files Exist
```bash
# Should show files
ls src/public/assets/data/translations/
```

### 2. Files Are Valid JSON
```bash
# Should not error
node -e "console.log(JSON.parse(require('fs').readFileSync('src/public/assets/data/translations/mujibur.json', 'utf8')))"
```

### 3. Metadata Exists
```bash
# Should show content
cat src/public/assets/data/metadata.json
```

### 4. Server Can Read Files
```bash
# Check permissions
ls -la src/public/assets/data/translations/
```

### 5. App Detects Files on Startup
```bash
npm run dev
# Look for: "Offline Manager: X translations available"
```

### 6. Browser Console Shows Status
```
Open browser
F12 → Console
Look for:
- "Loaded surah X from offline bundle"
- "API returned 200"
- or "API failed"
```

---

## Advanced Debugging

### Enable Extra Logging

Edit `src/server/services/quranApi.ts`, add before return:

```typescript
console.log('DEBUG: Surah loaded', {
  offline: availableOffline,
  hasAllOffline: hasAllOfflineTranslations,
  ayahCount: ayahs.length,
  hasArabic: ayahs[0]?.text ? 'yes' : 'no',
  translations: Object.keys(ayahs[0]?.translations || {})
});
```

Then:
```bash
npm run dev
```

### Check File Size

Large files might take longer to load:

```bash
# Show file sizes
ls -lh src/public/assets/data/translations/
```

Expected:
```
-rw-r--r--  1 user  staff  1.2M  Jan 9 14:00 mujibur.json
-rw-r--r--  1 user  staff  1.3M  Jan 9 14:05 sahih.json
```

If 0 bytes → File is empty (corrupted)

### Test Single Translation

Create minimal test file:

```bash
cat > src/public/assets/data/translations/test.json << 'EOF'
[
  {
    "surah_id": 1,
    "surah_name": "Al-Fatihah",
    "verses": [
      {"ayah_number": 1, "text": "Test verse"}
    ]
  }
]
EOF
```

Then access `/surah/1` in browser.

---

## Still Having Issues?

### Step-by-Step Recovery

1. **Reset everything**
   ```bash
   rm -rf src/public/assets/data/translations/*
   npm run offline:bundle
   npm run dev
   ```

2. **Check internet connection**
   ```bash
   ping api.quran.com
   ```

3. **Update Node.js**
   ```bash
   node --version  # Should be v18+
   npm install -g npm  # Update npm
   npm install      # Reinstall dependencies
   ```

4. **Clear and rebuild**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   npm run offline:bundle
   npm run dev
   ```

5. **Check firewall/VPN**
   - Ensure api.quran.com is not blocked
   - Try without VPN

---

## Testing Different Scenarios

### Test 1: Offline with Files
```bash
# 1. Create offline bundle
npm run offline:bundle

# 2. Disconnect internet

# 3. Start app
npm run dev

# 4. Open browser, view any surah
# 5. Should work! Console shows: "Loaded from offline bundle"
```

### Test 2: Offline without Files
```bash
# 1. Delete offline files
rm src/public/assets/data/translations/*.json

# 2. Disconnect internet

# 3. Start app
npm run dev

# 4. Open browser, view any surah
# 5. Will fail - shows empty surah (expected)
```

### Test 3: API Fallback
```bash
# 1. Delete some files (keep a few)
rm src/public/assets/data/translations/sahih.json

# 2. Start app (with internet)
npm run dev

# 3. View surah
# 4. Console shows mixed: some from offline, some from API
```

---

## Performance Profiling

### How to Find Slow Surahs

1. Open DevTools: F12
2. Go to Network tab
3. Refresh page and view surah
4. Look for slowest request

If request to `/surah/2` takes > 2 seconds:
- Check if offline files are large
- Check internet connection
- Check server CPU usage

### Check Server Load

```bash
# On Mac/Linux
top

# On Windows PowerShell
Get-Process | Where-Object {$_.Name -like "*node*"} | Select Name, CPU, Memory

# Should be using < 50% CPU
```

---

## When to Ask for Help

Include these details:

1. **What you did**
   ```
   I ran: npm run offline:bundle
   ```

2. **What happened**
   ```
   Error: getaddrinfo ENOTFOUND api.quran.com
   ```

3. **What you expected**
   ```
   Files should be created in src/public/assets/data/translations/
   ```

4. **Files present**
   ```bash
   ls src/public/assets/data/translations/
   # Output: (show what's there)
   ```

5. **Console output**
   ```
   npm run dev
   # Show the complete error message
   ```

---

**Most issues are solved by:** `npm run offline:bundle` + `npm run dev` restart! 🎯
