const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  mangaId: {
    type: String,
    required: true
  },
  chapterId: {
    type: String,
    default: null // null for manga comments, specific chapter for chapter comments
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 1000
  },
  likes: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String
  }],
  replies: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    username: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true,
      maxlength: 500
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  isEdited: {
    type: Boolean,
    default: false
  },
  editedAt: Date
}, {
  timestamps: true
});

// Index for efficient querying
commentSchema.index({ mangaId: 1, createdAt: -1 });
commentSchema.index({ chapterId: 1, createdAt: -1 });

module.exports = mongoose.model('Comment', commentSchema);
