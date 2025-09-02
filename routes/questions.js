const express = require('express');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all questions
router.get('/', async (req, res) => {
  try {
    const { topic, search, sortBy } = req.query;
    let query = {};

    // Filter by topic
    if (topic) {
      query.topic = topic;
    }

    // Search in title and description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let questions = await Question.find(query)
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 });

    // Get answer counts for each question
    const questionsWithCounts = await Promise.all(
      questions.map(async (question) => {
        const answerCount = await Answer.countDocuments({ questionId: question._id });
        return {
          ...question.toObject(),
          answerCount
        };
      })
    );

    // Sort by trending (most answers) if requested
    if (sortBy === 'trending') {
      questionsWithCounts.sort((a, b) => b.answerCount - a.answerCount);
    }

    res.json(questionsWithCounts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get question by ID
router.get('/:id', async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('userId', 'name avatar');
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json(question);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create question
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, topic } = req.body;

    const question = new Question({
      title,
      description,
      topic,
      userId: req.user._id
    });

    await question.save();
    await question.populate('userId', 'name avatar');

    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update question
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, topic } = req.body;
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    if (question.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    question.title = title || question.title;
    question.description = description || question.description;
    question.topic = topic || question.topic;

    await question.save();
    await question.populate('userId', 'name avatar');

    res.json(question);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete question
router.delete('/:id', auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    if (question.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Question.findByIdAndDelete(req.params.id);
    await Answer.deleteMany({ questionId: req.params.id });

    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;