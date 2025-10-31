import Comment from '../models/Comment.js';

// @desc    Get comments for an idea
// @route   GET /api/comments/:ideaId
// @access  Public
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ idea: req.params.ideaId })
      .populate('user', 'username')
      .sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Add comment to an idea
// @route   POST /api/comments/:ideaId
// @access  Private
export const addComment = async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const newComment = await Comment.create({
      idea: req.params.ideaId,
      user: req.user._id,
      content
    });

    const comment = await Comment.findById(newComment._id)
      .populate('user', 'username');

    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is the author or an admin
    if (comment.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'User not authorized' });
    }

    await comment.deleteOne();

    res.json({ message: 'Comment removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};