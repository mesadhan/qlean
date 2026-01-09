# Quran Fonts

This directory contains custom Quran fonts for offline use.

## Directory Structure

```
fonts/
├── traditional/      - Traditional Arabic font (default)
├── uthmani/          - Uthmani/Scheherazade font style
├── indopak/          - IndoPak font style
└── tajweed/          - Tajweed font with color coding support
```

## How to Add Custom Fonts

### 1. Choose Your Font
Download a Quran font file in one of these formats:
- `.ttf` (TrueType Font)
- `.otf` (OpenType Font)
- `.woff` (Web Open Font Format)
- `.woff2` (Web Open Font Format 2)

### 2. Place in Correct Folder
Place your font file in the appropriate subdirectory:
- **Traditional** → `traditional/` folder
- **Uthmani** → `uthmani/` folder
- **IndoPak** → `indopak/` folder
- **Tajweed** → `tajweed/` folder

### 3. Font Naming
Ensure the font file has the correct internal font family name:
- Traditional: "Traditional Arabic"
- Uthmani: "Scheherazade New"
- IndoPak: "IndoPak"
- Tajweed: "Tajweed"

Example:
```
fonts/
├── uthmani/
│   └── SchehrazadeNew.ttf
├── indopak/
│   └── IndoPak.ttf
└── tajweed/
    └── Tajweed.otf
```

## Recommended Fonts

### Traditional Arabic
- Font: Traditional Arabic
- Format: System font (usually pre-installed)
- Fallback: Web-safe

### Uthmani
- Font: Scheherazade New
- Download: https://github.com/aliftype/scheherazade
- Author: SIL International & Aliftype

### IndoPak
- Font: IndoPak
- Download: https://github.com/Kamran-Saeed/Jameel-Noori-Nastaleeq
- Author: Kamran Saeed

### Tajweed
- Font: Tajweed
- Download: https://quranfont.com/
- Author: Various

## Font File Format Support

### Supported Formats
- TTF (TrueType Font) - Most compatible
- OTF (OpenType Font) - Professional quality
- WOFF (Web Open Font Format) - Optimized for web
- WOFF2 (Web Open Font Format 2) - Best compression

### Performance Tips
1. **Use WOFF2** for smallest file size
2. **Use TTF or OTF** for better compatibility
3. **Keep file size under 1MB** for faster loading
4. **Test on multiple devices** for compatibility

## Automatic Detection

The application automatically:
1. Detects fonts in each folder
2. Updates the font selector UI
3. Applies fonts without restart
4. Falls back to default if font not found

## Font Not Showing?

If your font doesn't appear:

1. **Check file location**: Ensure file is in the correct folder
2. **Check file format**: Verify file is a valid font format
3. **Check font name**: Ensure internal font name matches expected name
4. **Check file permissions**: Ensure file is readable
5. **Clear browser cache**: Hard refresh (Ctrl+Shift+R)
6. **Check console**: Look for error messages

## Offline Mode

When fonts are placed in these folders:
1. Application loads fonts from local directories
2. No internet connection needed for fonts
3. Fonts load faster than web fonts
4. Custom fonts can be bundled for distribution

## File Size Guidelines

| Format | Typical Size | Quality |
|--------|-------------|---------|
| TTF | 100-500 KB | Excellent |
| OTF | 150-600 KB | Excellent |
| WOFF | 50-250 KB | Excellent |
| WOFF2 | 30-150 KB | Excellent |

## License

Ensure your font has proper licensing for use in your project. Most Quran fonts are provided under:
- **OFL (Open Font License)** - Free for personal & commercial use
- **Apache 2.0** - Free with attribution
- **MIT License** - Free with attribution

Always credit the original font creators.

## Troubleshooting

### Font appears blurry
- Update to latest font version
- Try different font format (TTF → OTF)
- Check system font rendering settings

### Font doesn't support Quranic characters
- Ensure font includes Arabic Unicode range (U+0600 - U+06FF)
- Verify font has Quranic diacritics support

### Font application crashes
- Check file integrity (corrupted file)
- Try with different font file
- Check console for error messages

## Support Resources

- **Aliftype**: https://github.com/aliftype/
- **Islamic Typography**: https://github.com/Kamran-Saeed/
- **Font Resources**: https://quranfont.com/

## Questions?

Check the main README or contact the application developers.
