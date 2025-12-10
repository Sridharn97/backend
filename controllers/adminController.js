import Idea from '../models/Idea.js';
import Comment from '../models/Comment.js';

// @desc    Get all ideas (for admin)
// @route   GET /api/admin/ideas
// @access  Private/Admin
export const getAllIdeas = async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    // Filter by search query if provided
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const ideas = await Idea.find(query)
      .populate('user', 'username')
      .sort({ createdAt: -1 });

    res.json(ideas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update idea status
// @route   PUT /api/admin/ideas/:id/status
// @access  Private/Admin
export const updateIdeaStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({ message: 'Idea not found' });
    }

    idea.status = status;
    await idea.save();

    res.json({ message: `Idea marked as ${status}`, idea });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete an idea (admin)
// @route   DELETE /api/admin/ideas/:id
// @access  Private/Admin
export const deleteIdea = async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);

    if (!idea) {
      return res.status(404).json({ message: 'Idea not found' });
    }

    // Also delete all associated comments
    await Comment.deleteMany({ idea: req.params.id });
    
    await idea.deleteOne();

    res.json({ message: 'Idea and associated comments removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete a comment (admin)
// @route   DELETE /api/admin/comments/:id
// @access  Private/Admin
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    await comment.deleteOne();

    res.json({ message: 'Comment removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};