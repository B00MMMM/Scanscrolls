const express = require('express');
const axios = require('axios');
const Manga = require('../models/Manga');
const mockMangaData = require('../data/mockManga');

const router = express.Router();

// API service class for handling different manga APIs
class MangaAPIService {
  constructor() {
    this.comickBaseURL = 'https://api.comick.fun';
    this.mangadexBaseURL = 'https://api.mangadx.org';
    this.jikanBaseURL = 'https://api.jikan.moe/v4';
  }

  // Fetch popular manga from Comick
  async getPopularManga(page = 1, limit = 30) {
    try {
      const response = await axios.get(`${this.comickBaseURL}/v1.0/search`, {
        params: {
          page,
          limit,
          order: 'follow_count',
          desc: true
        },
        timeout: 10000
      });
      
      return this.formatComickManga(response.data);
    } catch (error) {
      console.error('Comick API error:', error.message);
      return [];
    }
  }

  // Fetch latest manga from Comick
  async getLatestManga(page = 1, limit = 30) {
    try {
      const response = await axios.get(`${this.comickBaseURL}/v1.0/search`, {
        params: {
          page,
          limit,
          order: 'created_at',
          desc: true
        },
        timeout: 10000
      });
      
      return this.formatComickManga(response.data);
    } catch (error) {
      console.error('Comick API error:', error.message);
      return [];
    }
  }

  // Search manga from Comick
  async searchManga(query, page = 1, limit = 20) {
    try {
      const response = await axios.get(`${this.comickBaseURL}/v1.0/search`, {
        params: {
          q: query,
          page,
          limit
        },
        timeout: 10000
      });
      
      return this.formatComickManga(response.data);
    } catch (error) {
      console.error('Comick search API error:', error.message);
      return [];
    }
  }

  // Get manga details from Comick
  async getMangaDetails(mangaId) {
    try {
      const response = await axios.get(`${this.comickBaseURL}/comic/${mangaId}`, {
        timeout: 10000
      });
      
      return this.formatComickMangaDetails(response.data.comic);
    } catch (error) {
      console.error('Comick manga details API error:', error.message);
      return null;
    }
  }

  // Get manga chapters from Comick
  async getMangaChapters(mangaId, page = 1, limit = 100) {
    try {
      const response = await axios.get(`${this.comickBaseURL}/comic/${mangaId}/chapters`, {
        params: {
          page,
          limit,
          order: 'asc'
        },
        timeout: 10000
      });
      
      return this.formatComickChapters(response.data.chapters);
    } catch (error) {
      console.error('Comick chapters API error:', error.message);
      return [];
    }
  }

  // Get chapter pages from Comick
  async getChapterPages(chapterId) {
    try {
      const response = await axios.get(`${this.comickBaseURL}/chapter/${chapterId}`, {
        timeout: 10000
      });
      
      return this.formatComickPages(response.data.chapter);
    } catch (error) {
      console.error('Comick chapter pages API error:', error.message);
      return [];
    }
  }

  // Format Comick manga data to our schema
  formatComickManga(data) {
    if (!data || !Array.isArray(data)) return [];
    
    return data.map(manga => ({
      id: manga.slug || manga.id,
      title: manga.title || 'Unknown Title',
      image: manga.md_covers && manga.md_covers.length > 0 
        ? `https://meo.comick.pictures/${manga.md_covers[0].b2key}` 
        : 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop',
      status: this.mapStatus(manga.status),
      rating: manga.rating ? parseFloat(manga.rating) : 0,
      chapters: manga.last_chapter || 0,
      genre: manga.md_comic_md_genres ? manga.md_comic_md_genres.map(g => g.md_genres.name) : [],
      summary: manga.desc || 'No description available',
      author: manga.authors && manga.authors.length > 0 ? manga.authors[0].name : 'Unknown',
      year: manga.year || new Date().getFullYear(),
      category: 'popular',
      views: manga.view_count || 0,
      follows: manga.follow_count || 0
    }));
  }

  // Format detailed manga data
  formatComickMangaDetails(manga) {
    if (!manga) return null;

    return {
      id: manga.slug || manga.id,
      title: manga.title || 'Unknown Title',
      alternativeTitles: manga.alt_titles || [],
      image: manga.md_covers && manga.md_covers.length > 0 
        ? `https://meo.comick.pictures/${manga.md_covers[0].b2key}` 
        : 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop',
      status: this.mapStatus(manga.status),
      rating: manga.rating ? parseFloat(manga.rating) : 0,
      summary: manga.desc || 'No description available',
      genres: manga.md_comic_md_genres ? manga.md_comic_md_genres.map(g => g.md_genres.name) : [],
      authors: manga.authors ? manga.authors.map(a => a.name) : [],
      year: manga.year || new Date().getFullYear(),
      views: manga.view_count || 0,
      follows: manga.follow_count || 0,
      lastChapter: manga.last_chapter || 0
    };
  }

  // Format chapter data
  formatComickChapters(chapters) {
    if (!chapters || !Array.isArray(chapters)) return [];
    
    return chapters.map(chapter => ({
      id: chapter.hid,
      number: parseFloat(chapter.chap) || 0,
      title: chapter.title || `Chapter ${chapter.chap}`,
      releaseDate: chapter.created_at,
      groupName: chapter.group_name || 'Unknown Group'
    }));
  }

  // Format page data
  formatComickPages(chapter) {
    if (!chapter || !chapter.md_images) return [];
    
    return chapter.md_images.map(image => 
      `https://meo.comick.pictures/${image.b2key}`
    );
  }

  // Map status to our enum
  mapStatus(status) {
    if (!status) return 'ongoing';
    
    const statusLower = status.toString().toLowerCase();
    if (statusLower.includes('completed') || statusLower.includes('finished')) return 'completed';
    if (statusLower.includes('hiatus')) return 'hiatus';
    if (statusLower.includes('cancelled') || statusLower.includes('dropped')) return 'cancelled';
    return 'ongoing';
  }

  // Fallback to MangaDex API (simplified implementation)
  async getMangaDexPopular(page = 1, limit = 20) {
    try {
      const response = await axios.get(`${this.mangadexBaseURL}/manga`, {
        params: {
          limit,
          offset: (page - 1) * limit,
          order: { followedCount: 'desc' },
          contentRating: ['safe', 'suggestive']
        },
        timeout: 10000
      });
      
      return this.formatMangaDexManga(response.data.data);
    } catch (error) {
      console.error('MangaDex API error:', error.message);
      return [];
    }
  }

  formatMangaDexManga(data) {
    if (!data || !Array.isArray(data)) return [];
    
    return data.map(manga => {
      const attributes = manga.attributes;
      const coverRelationship = manga.relationships.find(rel => rel.type === 'cover_art');
      const authorRelationship = manga.relationships.find(rel => rel.type === 'author');
      
      return {
        id: manga.id,
        title: attributes.title.en || attributes.title[Object.keys(attributes.title)[0]] || 'Unknown Title',
        image: coverRelationship 
          ? `https://uploads.mangadex.org/covers/${manga.id}/${coverRelationship.attributes.fileName}.256.jpg`
          : 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=400&fit=crop',
        status: this.mapStatus(attributes.status),
        rating: 0, // MangaDex doesn't provide ratings in this endpoint
        chapters: attributes.lastChapter ? parseInt(attributes.lastChapter) : 0,
        genre: attributes.tags.filter(tag => tag.attributes.group === 'genre').map(tag => tag.attributes.name.en),
        summary: attributes.description.en || 'No description available',
        author: authorRelationship ? authorRelationship.attributes.name : 'Unknown',
        year: attributes.year || new Date().getFullYear(),
        category: 'popular'
      };
    });
  }
}

const mangaAPI = new MangaAPIService();

// Get popular manga
router.get('/popular', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    
    // Try Comick first, fallback to MangaDx, then mock data
    let manga = await mangaAPI.getPopularManga(page, limit);
    
    if (manga.length === 0) {
      manga = await mangaAPI.getMangaDexPopular(page, limit);
    }

    // If both APIs fail, use mock data
    if (manga.length === 0) {
      console.log('Using mock data fallback for popular manga');
      const sortedMockData = mockMangaData
        .sort((a, b) => b.views - a.views) // Sort by popularity (views)
        .slice(startIndex, endIndex);
      
      manga = sortedMockData.map(item => ({
        id: item.id,
        title: item.title,
        image: item.image,
        status: item.status,
        rating: item.rating,
        chapters: item.chapters,
        genre: item.genres || [], // Make sure it's an array
        summary: item.summary,
        author: item.author,
        year: item.year,
        category: 'popular'
      }));
    }

    res.json({
      manga,
      page: parseInt(page),
      limit: parseInt(limit),
      total: manga.length === 0 ? 0 : mockMangaData.length
    });
  } catch (error) {
    console.error('Get popular manga error:', error);
    res.status(500).json({ message: 'Error fetching popular manga' });
  }
});

// Get latest manga
router.get('/latest', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    
    let manga = await mangaAPI.getLatestManga(page, limit);

    // If API fails, use mock data sorted by latest
    if (manga.length === 0) {
      console.log('Using mock data fallback for latest manga');
      const sortedMockData = mockMangaData
        .sort((a, b) => b.year - a.year) // Sort by year (latest first)
        .slice(startIndex, endIndex);
      
      manga = sortedMockData.map(item => ({
        id: item.id,
        title: item.title,
        image: item.image,
        status: item.status,
        rating: item.rating,
        chapters: item.chapters,
        genre: item.genres || [], // Make sure it's an array
        summary: item.summary,
        author: item.author,
        year: item.year,
        category: 'latest'
      }));
    }

    res.json({
      manga,
      page: parseInt(page),
      limit: parseInt(limit),
      total: manga.length === 0 ? 0 : mockMangaData.length
    });
  } catch (error) {
    console.error('Get latest manga error:', error);
    res.status(500).json({ message: 'Error fetching latest manga' });
  }
});

// Search manga
router.get('/search', async (req, res) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    
    if (!q) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    let manga = await mangaAPI.searchManga(q, page, limit);

    // If API fails, search in mock data
    if (manga.length === 0) {
      console.log('Using mock data fallback for search:', q);
      const searchResults = mockMangaData.filter(item =>
        item.title.toLowerCase().includes(q.toLowerCase()) ||
        item.author.toLowerCase().includes(q.toLowerCase()) ||
        item.genres.some(genre => genre.toLowerCase().includes(q.toLowerCase()))
      ).slice(startIndex, endIndex);
      
      manga = searchResults.map(item => ({
        id: item.id,
        title: item.title,
        image: item.image,
        status: item.status,
        rating: item.rating,
        chapters: item.chapters,
        genre: item.genres,
        summary: item.summary,
        author: item.author,
        year: item.year,
        category: 'search'
      }));
    }

    res.json({
      manga,
      query: q,
      page: parseInt(page),
      limit: parseInt(limit),
      total: manga.length
    });
  } catch (error) {
    console.error('Search manga error:', error);
    res.status(500).json({ message: 'Error searching manga' });
  }
});

// Get manga details
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const manga = await mangaAPI.getMangaDetails(id);
    
    if (!manga) {
      return res.status(404).json({ message: 'Manga not found' });
    }

    res.json({ manga });
  } catch (error) {
    console.error('Get manga details error:', error);
    res.status(500).json({ message: 'Error fetching manga details' });
  }
});

// Get manga chapters
router.get('/:id/chapters', async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 100 } = req.query;
    
    const chapters = await mangaAPI.getMangaChapters(id, page, limit);

    res.json({
      chapters,
      page: parseInt(page),
      limit: parseInt(limit),
      total: chapters.length
    });
  } catch (error) {
    console.error('Get manga chapters error:', error);
    res.status(500).json({ message: 'Error fetching manga chapters' });
  }
});

// Get chapter pages
router.get('/chapter/:chapterId/pages', async (req, res) => {
  try {
    const { chapterId } = req.params;
    
    const pages = await mangaAPI.getChapterPages(chapterId);

    res.json({
      pages,
      total: pages.length
    });
  } catch (error) {
    console.error('Get chapter pages error:', error);
    res.status(500).json({ message: 'Error fetching chapter pages' });
  }
});

module.exports = router;
