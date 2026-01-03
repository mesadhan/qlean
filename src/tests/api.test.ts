import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../server/index.js';

describe('API Endpoints', () => {
  describe('GET /api/health', () => {
    it('should return health status', async () => {
      const response = await request(app).get('/api/health');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('GET /api/surahs', () => {
    it('should return list of surahs', async () => {
      const response = await request(app).get('/api/surahs');
      expect(response.status).toBe(200);
      expect(response.body. success).toBe(true);
      expect(Array.isArray(response.body. data)).toBe(true);
      expect(response.body.data. length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/surahs/:id', () => {
    it('should return specific surah with ayahs', async () => {
      const response = await request(app).get('/api/surahs/1');
      expect(response.status).toBe(200);
      expect(response.body. success).toBe(true);
      expect(response.body.data).toHaveProperty('id', 1);
      expect(response.body.data).toHaveProperty('ayahs');
      expect(Array.isArray(response.body. data.ayahs)).toBe(true);
    });

    it('should return 404 for non-existent surah', async () => {
      const response = await request(app).get('/api/surahs/999');
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/surahs/search/: query', () => {
    it('should search and return matching surahs', async () => {
      const response = await request(app).get('/api/surahs/search/Fatihah');
      expect(response. status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body. data)).toBe(true);
    });
  });
});