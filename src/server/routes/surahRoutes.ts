import express, { Request, Response } from 'express';
import { getAllSurahs, getSurahById, searchSurahs } from '../services/quranApi.js';
import { ApiResponse, Surah } from '../types/index.js';

const router = express.Router();

// Get all surahs
router.get('/', async (_req: Request, res: Response) => {
  try {
    const surahs = await getAllSurahs();
    const response: ApiResponse<Surah[]> = {
      success: true,
      data: surahs
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch surahs'
    };
    res.status(500).json(response);
  }
});

// Search surahs - must be before /:id route
router.get('/search/:query', async (req: Request, res: Response) => {
  try {
    const query = req.params.query;
    const results = await searchSurahs(query);
    const response: ApiResponse<Surah[]> = {
      success: true,
      data: results
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Search failed'
    };
    res.status(500).json(response);
  }
});

// Get specific surah with all ayahs
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    
    if (isNaN(id) || id < 1 || id > 114) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Invalid surah ID. Must be between 1 and 114.'
      };
      return res.status(400).json(response);
    }

    const surah = await getSurahById(id);
    
    if (!surah) {
      const response: ApiResponse<null> = {
        success: false,
        error: 'Surah not found'
      };
      return res.status(404).json(response);
    }
    
    const response: ApiResponse<Surah> = {
      success: true,
      data: surah
    };
    res.json(response);
  } catch (error) {
    const response: ApiResponse<null> = {
      success: false,
      error: 'Failed to fetch surah'
    };
    return res.status(500).json(response);
  }
});

export default router;