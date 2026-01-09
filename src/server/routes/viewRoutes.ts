import express, { Request, Response } from 'express';
// @ts-ignore
import ejs from 'ejs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getAllSurahs, getSurahById, searchSurahs, searchAyahsByArabicWord, searchAyahsByArabicWordOffline, APP_CONFIG } from '../services/quranApi.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const viewsPath = path.join(__dirname, '../../views');

const router = express.Router();

// Helper to render with layout
const renderWithLayout = async (res: Response, view: string, data: Record<string, any>) => {
  try {
    const content = await ejs.renderFile(path.join(viewsPath, `${view}.ejs`), data);
    res.render('layout', { ...data, content });
  } catch (error) {
    console.error('Render error:', error);
    res.status(500).send('Render error');
  }
};

// Home page
router.get('/', async (_req: Request, res: Response) => {
  try {
    await renderWithLayout(res, 'index', {
      title: 'হোম',
      activePage: 'home'
    });
  } catch (error) {
    await renderWithLayout(res, 'error', {
      title: 'Error',
      activePage: '',
      error: { title: 'Failed to load', message: 'Could not load page. Please try again.' }
    });
  }
});

// Search surahs (redirect to quran page)
router.get('/search', async (req: Request, res: Response) => {
  const query = req.query.q as string || '';
  res.redirect(`/quran/search?q=${encodeURIComponent(query)}`);
});

// Quran page - List all surahs
router.get('/quran', async (_req: Request, res: Response) => {
  try {
    const surahs = await getAllSurahs();
    await renderWithLayout(res, 'quran', {
      title: 'পবিত্র কুরআন',
      activePage: 'quran',
      surahs,
      query: ''
    });
  } catch (error) {
    await renderWithLayout(res, 'error', {
      title: 'Error',
      activePage: '',
      error: { title: 'Failed to load', message: 'Could not load surahs. Please try again.' }
    });
  }
});

// Quran search
router.get('/quran/search', async (req: Request, res: Response) => {
  try {
    const query = (req.query.q as string || '');
    const results = query ? await searchSurahs(query) : await getAllSurahs();
    
    await renderWithLayout(res, 'quran', {
      title: query ? `অনুসন্ধান: ${query}` : 'পবিত্র কুরআন',
      activePage: 'quran',
      surahs: results,
      query
    });
  } catch (error) {
    await renderWithLayout(res, 'error', {
      title: 'Error',
      activePage: '',
      error: { title: 'Search Failed', message: 'Could not perform search. Please try again.' }
    });
  }
});

// View single surah
router.get('/surah/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id) || id < 1 || id > 114) {
      return await renderWithLayout(res, 'error', {
        title: 'Invalid Surah',
        activePage: '',
        error: { title: 'Invalid Surah ID', message: 'Surah ID must be between 1 and 114.' }
      });
    }

    const surah = await getSurahById(id);
    
    if (!surah) {
      return await renderWithLayout(res, 'error', {
        title: 'Not Found',
        activePage: '',
        error: { title: 'Surah Not Found', message: `Surah with ID ${id} does not exist.` }
      });
    }
    
    await renderWithLayout(res, 'surah', {
      title: surah.transliteration,
      activePage: 'surah',
      surah,
      config: APP_CONFIG
    });
  } catch (error) {
    await renderWithLayout(res, 'error', {
      title: 'Error',
      activePage: '',
      error: { title: 'Failed to Load Surah', message: 'Could not load surah. Please try again.' }
    });
  }
});

// Bookmarks page
router.get('/bookmarks', async (req: Request, res: Response) => {
  await renderWithLayout(res, 'bookmarks', {
    title: 'Bookmarks',
    activePage: 'bookmarks'
  });
});

// Arabic word search page
router.get('/search/word', async (req: Request, res: Response) => {
  try {
    const query = (req.query.q as string || '').trim();
    
    // If no query, show empty search page
    if (!query) {
      return await renderWithLayout(res, 'search', {
        title: 'শব্দ অনুসন্ধান - Word Search',
        activePage: 'search',
        query: '',
        results: [],
        totalResults: 0,
        config: APP_CONFIG
      });
    }
    
    // Try to use offline search first (faster, no internet needed)
    // If offline translations are available, use them
    let results = await searchAyahsByArabicWordOffline(query);
    
    // If offline search found results or we only have offline capability, use them
    if (results.length > 0) {
      console.log(`✓ Using offline word search results`);
    } else {
      // Offline search returned empty, try full search (uses API fallback)
      console.log(`ℹ Offline search empty, trying full search with API fallback`);
      results = await searchAyahsByArabicWord(query);
    }
    
    await renderWithLayout(res, 'search', {
      title: `অনুসন্ধান: ${query}`,
      activePage: 'search',
      query,
      results,
      totalResults: results.length,
      config: APP_CONFIG
    });
  } catch (error) {
    console.error('Search error:', error);
    await renderWithLayout(res, 'error', {
      title: 'Error',
      activePage: '',
      error: { title: 'Search Failed', message: 'Could not perform search. Please try again.' }
    });
  }
});

export default router;
