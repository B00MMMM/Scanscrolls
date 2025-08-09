const mongoose = require('mongoose');

const mangaSchema = new mongoose.Schema({
  // Basic manga info
  title: {
    type: String,
    required: true
  },
  alternativeTitles: [String],
  description: String,
  status: {
    type: String,
    enum: ['ongoing', 'completed', 'hiatus', 'cancelled'],
    default: 'ongoing'
  },
  
  // Source and IDs
  sources: {
    comick: String,
    mangadex: String,
    anilist: String,
    kitsu: String
  },
  
  // Content info
  image: String,
  banner: String,
  genres: [String],
  tags: [String],
  authors: [String],
  artists: [String],
  
  // Ratings and stats
  rating: {
    average: {
      type: Number,
      min: 0,
      max: 10,
      default: 0
    },
    count: {
      type: Number,
      default: 0
    }
  },
  
  popularity: {
    type: Number,
    default: 0
  },
  
  views: {
    type: Number,
    default: 0
  },
  
  // Publication info
  publicationYear: Number,
  lastChapterDate: Date,
  
  // Chapters
  chapterCount: {
    type: Number,
    default: 0
  },
  
  // Cache control
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  
  // Search optimization
  searchVector: String
}, {
  timestamps: true
});

// Text search index
mangaSchema.index({ 
  title: 'text', 
  alternativeTitles: 'text', 
  description: 'text',
  authors: 'text',
  genres: 'text'
});

// Popularity and rating indexes
mangaSchema.index({ popularity: -1 });
mangaSchema.index({ 'rating.average': -1 });
mangaSchema.index({ lastUpdated: -1 });
mangaSchema.index({ lastChapterDate: -1 });

module.exports = mongoose.model('Manga', mangaSchema);
