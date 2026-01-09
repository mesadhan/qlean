import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const FONTS_BASE_PATH = path.join(__dirname, '../../public/assets/fonts');

// Cache for font information
const fontsInfoCache: Record<string, any> = {};

// Font family mappings
export const FONT_MAPPINGS: Record<string, { name: string; fallback: string }> = {
  traditional: {
    name: "'Traditional Arabic', 'Scheherazade', serif",
    fallback: "'Traditional Arabic', serif"
  },
  uthmani: {
    name: "'Scheherazade New', 'Traditional Arabic', serif",
    fallback: "'Scheherazade New', serif"
  },
  indopak: {
    name: "'IndoPak', 'Traditional Arabic', serif",
    fallback: "'IndoPak', serif"
  },
  tajweed: {
    name: "'Tajweed', 'Traditional Arabic', serif",
    fallback: "'Tajweed', serif"
  }
};

// Initialize fonts paths
export function initializeFontsPaths() {
  // Create base fonts directory
  if (!fs.existsSync(FONTS_BASE_PATH)) {
    fs.mkdirSync(FONTS_BASE_PATH, { recursive: true });
    console.log(`Created fonts directory: ${FONTS_BASE_PATH}`);
  }

  // Create subdirectories for each font
  Object.keys(FONT_MAPPINGS).forEach(fontKey => {
    const fontPath = path.join(FONTS_BASE_PATH, fontKey);
    if (!fs.existsSync(fontPath)) {
      fs.mkdirSync(fontPath, { recursive: true });
    }
  });

  // Create README if not exists
  const readmePath = path.join(FONTS_BASE_PATH, 'README.md');
  if (!fs.existsSync(readmePath)) {
    createFontsReadme(readmePath);
  }
}

// Create fonts README
function createFontsReadme(readmePath: string) {
  const readme = `# Quran Fonts

This directory contains custom Quran fonts for offline use.

## Supported Fonts

### Traditional
- Directory: \`traditional/\`
- Font name in CSS: \`'Traditional Arabic'\`
- Place your TTF/OTF/WOFF files here

### Uthmani
- Directory: \`uthmani/\`
- Font name in CSS: \`'Scheherazade New'\`
- Place your TTF/OTF/WOFF files here

### IndoPak
- Directory: \`indopak/\`
- Font name in CSS: \`'IndoPak'\`
- Place your TTF/OTF/WOFF files here

### Tajweed
- Directory: \`tajweed/\`
- Font name in CSS: \`'Tajweed'\`
- Place your TTF/OTF/WOFF files here

## Installation

1. Download or prepare your font file (TTF, OTF, or WOFF format)
2. Place it in the appropriate subdirectory
3. Ensure the font filename matches the font name defined in the CSS

## Font File Format

Supported formats:
- .ttf (TrueType Font)
- .otf (OpenType Font)
- .woff (Web Open Font Format)
- .woff2 (Web Open Font Format 2)

## How to Add Custom Fonts

1. Choose your font file
2. Place it in the corresponding folder (e.g., \`uthmani/font.ttf\`)
3. The application will automatically detect and use it
4. Note: The font file should have the correct internal font family name

## Resources

- Download fonts from:
  - https://fonts.quran.com
  - https://github.com/aliftype/fonts
  - Other trusted Quran font sources
`;

  try {
    fs.writeFileSync(readmePath, readme);
    console.log('Created fonts README');
  } catch (error) {
    console.error('Error creating fonts README:', error);
  }
}

// Check if font files exist for a font type
export function isFontAvailableLocally(fontKey: string): boolean {
  const fontPath = path.join(FONTS_BASE_PATH, fontKey);
  
  if (!fs.existsSync(fontPath)) {
    return false;
  }

  try {
    const files = fs.readdirSync(fontPath);
    const fontFiles = files.filter(f => 
      /\.(ttf|otf|woff|woff2)$/i.test(f)
    );
    return fontFiles.length > 0;
  } catch (error) {
    console.error(`Error checking font availability for ${fontKey}:`, error);
    return false;
  }
}

// Get available local fonts
export function getAvailableLocalFonts(): string[] {
  const available: string[] = [];

  Object.keys(FONT_MAPPINGS).forEach(fontKey => {
    if (isFontAvailableLocally(fontKey)) {
      available.push(fontKey);
    }
  });

  return available;
}

// Get font file path
export function getFontFilePath(fontKey: string): string | null {
  const fontPath = path.join(FONTS_BASE_PATH, fontKey);

  if (!fs.existsSync(fontPath)) {
    return null;
  }

  try {
    const files = fs.readdirSync(fontPath);
    const fontFile = files.find(f => 
      /\.(ttf|otf|woff|woff2)$/i.test(f)
    );

    return fontFile ? path.join(fontPath, fontFile) : null;
  } catch (error) {
    console.error(`Error getting font file for ${fontKey}:`, error);
    return null;
  }
}

// Get font files list
export function getFontFiles(fontKey: string): string[] {
  const fontPath = path.join(FONTS_BASE_PATH, fontKey);

  if (!fs.existsSync(fontPath)) {
    return [];
  }

  try {
    const files = fs.readdirSync(fontPath);
    return files.filter(f => /\.(ttf|otf|woff|woff2)$/i.test(f));
  } catch (error) {
    console.error(`Error reading font files for ${fontKey}:`, error);
    return [];
  }
}

// Get font information
export function getFontInfo(fontKey: string): any {
  if (fontsInfoCache[fontKey]) {
    return fontsInfoCache[fontKey];
  }

  const mapping = FONT_MAPPINGS[fontKey];
  if (!mapping) {
    return null;
  }

  const info = {
    key: fontKey,
    name: mapping.name,
    fallback: mapping.fallback,
    available: isFontAvailableLocally(fontKey),
    files: getFontFiles(fontKey)
  };

  fontsInfoCache[fontKey] = info;
  return info;
}

// Get all fonts info
export function getAllFontsInfo(): any[] {
  return Object.keys(FONT_MAPPINGS).map(fontKey => getFontInfo(fontKey));
}

// Clear fonts cache
export function clearFontsCache() {
  Object.keys(fontsInfoCache).forEach(key => {
    delete fontsInfoCache[key];
  });
}

// Get fonts directory path
export function getFontsDirectoryPath(): string {
  return FONTS_BASE_PATH;
}

// Get fonts summary
export function getFontsSummary(): {
  available: string[];
  path: string;
  total: number;
} {
  return {
    available: getAvailableLocalFonts(),
    path: FONTS_BASE_PATH,
    total: getAvailableLocalFonts().length
  };
}
