const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Update user preferences
router.patch('/preferences', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { theme, readingMode } = req.body;

    const updateData = {};
    if (theme) updateData['preferences.theme'] = theme;
    if (readingMode) updateData['preferences.readingMode'] = readingMode;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Preferences updated successfully',
      preferences: user.preferences
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ message: 'Error updating preferences' });
  }
});

// Add to reading history
router.post('/history', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { mangaId, title, image, chapterNumber, pageNumber = 1 } = req.body;

    if (!mangaId || !title) {
      return res.status(400).json({ message: 'Manga ID and title are required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove existing entry for this manga (to avoid duplicates)
    user.readingHistory = user.readingHistory.filter(
      item => item.mangaId !== mangaId
    );

    // Add new entry at the beginning
    user.readingHistory.unshift({
      mangaId,
      title,
      image,
      chapterNumber,
      pageNumber,
      lastRead: new Date()
    });

    // Keep only last 50 entries
    if (user.readingHistory.length > 50) {
      user.readingHistory = user.readingHistory.slice(0, 50);
    }

    await user.save();

    res.json({
      message: 'Reading history updated',
      history: user.readingHistory
    });
  } catch (error) {
    console.error('Update reading history error:', error);
    res.status(500).json({ message: 'Error updating reading history' });
  }
});

// Get reading history
router.get('/history', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 20 } = req.query;

    const user = await User.findById(userId).select('readingHistory');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    
    const paginatedHistory = user.readingHistory.slice(startIndex, endIndex);
    const totalItems = user.readingHistory.length;

    res.json({
      history: paginatedHistory,
      totalItems,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalItems / parseInt(limit))
    });
  } catch (error) {
    console.error('Get reading history error:', error);
    res.status(500).json({ message: 'Error fetching reading history' });
  }
});

// Add to favorites
router.post('/favorites', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { mangaId, title, image } = req.body;

    if (!mangaId || !title) {
      return res.status(400).json({ message: 'Manga ID and title are required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already in favorites
    const existingFavorite = user.favorites.find(
      item => item.mangaId === mangaId
    );

    if (existingFavorite) {
      return res.status(400).json({ message: 'Manga already in favorites' });
    }

    user.favorites.unshift({
      mangaId,
      title,
      image,
      addedAt: new Date()
    });

    await user.save();

    res.json({
      message: 'Added to favorites',
      favorites: user.favorites
    });
  } catch (error) {
    console.error('Add to favorites error:', error);
    res.status(500).json({ message: 'Error adding to favorites' });
  }
});

// Remove from favorites
router.delete('/favorites/:mangaId', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { mangaId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.favorites = user.favorites.filter(
      item => item.mangaId !== mangaId
    );

    await user.save();

    res.json({
      message: 'Removed from favorites',
      favorites: user.favorites
    });
  } catch (error) {
    console.error('Remove from favorites error:', error);
    res.status(500).json({ message: 'Error removing from favorites' });
  }
});

// Get favorites
router.get('/favorites', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 20 } = req.query;

    const user = await User.findById(userId).select('favorites');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const startIndex = (parseInt(page) - 1) * parseInt(limit);
    const endIndex = startIndex + parseInt(limit);
    
    const paginatedFavorites = user.favorites.slice(startIndex, endIndex);
    const totalItems = user.favorites.length;

    res.json({
      favorites: paginatedFavorites,
      totalItems,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalItems / parseInt(limit))
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ message: 'Error fetching favorites' });
  }
});

// Add to search history
router.post('/search-history', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const { query } = req.body;

    if (!query || query.trim().length === 0) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove existing entry for this query (to avoid duplicates)
    user.searchHistory = user.searchHistory.filter(
      item => item.query.toLowerCase() !== query.toLowerCase()
    );

    // Add new entry at the beginning
    user.searchHistory.unshift({
      query: query.trim(),
      searchedAt: new Date()
    });

    // Keep only last 20 entries
    if (user.searchHistory.length > 20) {
      user.searchHistory = user.searchHistory.slice(0, 20);
    }

    await user.save();

    res.json({
      message: 'Search history updated',
      searchHistory: user.searchHistory
    });
  } catch (error) {
    console.error('Update search history error:', error);
    res.status(500).json({ message: 'Error updating search history' });
  }
});

// Get search history
router.get('/search-history', auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId).select('searchHistory');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      searchHistory: user.searchHistory
    });
  } catch (error) {
    console.error('Get search history error:', error);
    res.status(500).json({ message: 'Error fetching search history' });
  }
});

module.exports = router;
