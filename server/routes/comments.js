const express = require('express');
const Comment = require('../models/Comment');
const auth = require('../middleware/auth');

const router = express.Router();

// Get comments for a manga
router.get('/manga/:mangaId', async (req, res) => {
  try {
    const { mangaId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const comments = await Comment.find({ 
      mangaId, 
      chapterId: null // Only manga comments, not chapter comments
    })
    .populate('user', 'username avatar')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

    const totalComments = await Comment.countDocuments({ 
      mangaId, 
      chapterId: null 
    });

    res.json({
      comments,
      totalComments,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalComments / parseInt(limit))
    });
  } catch (error) {
    console.error('Get comments error:', error);
    res.status(500).json({ message: 'Error fetching comments' });
  }
});

// Get comments for a chapter
router.get('/chapter/:chapterId', async (req, res) => {
  try {
    const { chapterId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const comments = await Comment.find({ chapterId })
    .populate('user', 'username avatar')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

    const totalComments = await Comment.countDocuments({ chapterId });

    res.json({
      comments,
      totalComments,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalComments / parseInt(limit))
    });
  } catch (error) {
    console.error('Get chapter comments error:', error);
    res.status(500).json({ message: 'Error fetching chapter comments' });
  }
});

// Create a comment
router.post('/', auth, async (req, res) => {
  try {
    const { mangaId, chapterId, content } = req.body;
    const userId = req.user.userId;

    if (!mangaId || !content) {
      return res.status(400).json({ message: 'Manga ID and content are required' });
    }

    if (content.length > 1000) {
      return res.status(400).json({ message: 'Comment is too long (max 1000 characters)' });
    }

    // Get user info
    const User = require('../models/User');
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const comment = new Comment({
      mangaId,
      chapterId: chapterId || null,
      user: userId,
      username: user.username,
      content
    });

    await comment.save();
    await comment.populate('user', 'username avatar');

    res.status(201).json({
      message: 'Comment created successfully',
      comment
    });
  } catch (error) {
    console.error('Create comment error:', error);
    res.status(500).json({ message: 'Error creating comment' });
  }
});

// Like/unlike a comment
router.post('/:commentId/like', auth, async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.userId;

    // Get user info
    const User = require('../models/User');
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user already liked this comment
    const existingLike = comment.likes.find(like => 
      like.user.toString() === userId
    );

    if (existingLike) {
      // Unlike the comment
      comment.likes = comment.likes.filter(like => 
        like.user.toString() !== userId
      );
    } else {
      // Like the comment
      comment.likes.push({
        user: userId,
        username: user.username
      });
    }

    await comment.save();

    res.json({
      message: existingLike ? 'Comment unliked' : 'Comment liked',
      likesCount: comment.likes.length,
      isLiked: !existingLike
    });
  } catch (error) {
    console.error('Like comment error:', error);
    res.status(500).json({ message: 'Error liking comment' });
  }
});

// Reply to a comment
router.post('/:commentId/reply', auth, async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user.userId;

    if (!content) {
      return res.status(400).json({ message: 'Reply content is required' });
    }

    if (content.length > 500) {
      return res.status(400).json({ message: 'Reply is too long (max 500 characters)' });
    }

    // Get user info
    const User = require('../models/User');
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    const reply = {
      user: userId,
      username: user.username,
      content,
      createdAt: new Date()
    };

    comment.replies.push(reply);
    await comment.save();

    res.status(201).json({
      message: 'Reply added successfully',
      reply
    });
  } catch (error) {
    console.error('Reply to comment error:', error);
    res.status(500).json({ message: 'Error adding reply' });
  }
});

// Delete a comment (only by comment author)
router.delete('/:commentId', auth, async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.userId;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is the author
    if (comment.user.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await Comment.findByIdAndDelete(commentId);

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: 'Error deleting comment' });
  }
});

module.exports = router;
