const express = require('express');
const Answer = require('../models/Answer');
const auth = require('../middleware/auth');

const router = express.Router();

// Get answers for a question
router.get('/question/:questionId', async (req, res) => {
  try {
    const { sortBy } = req.query;
    let sortOption = { createdAt: -1 };

    if (sortBy === 'votes') {
      sortOption = { votes: -1 };
    }

    const answers = await Answer.find({ questionId: req.params.questionId })
      .populate('userId', 'name avatar')
      .sort(sortOption);

    res.json(answers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create answer
router.post('/', auth, async (req, res) => {
  try {
    const { questionId, content } = req.body;

    const answer = new Answer({
      questionId,
      userId: req.user._id,
      content
    });

    await answer.save();
    await answer.populate('userId', 'name avatar');

    res.status(201).json(answer);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update answer
router.put('/:id', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    if (answer.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    answer.content = content || answer.content;
    await answer.save();
    await answer.populate('userId', 'name avatar');

    res.json(answer);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete answer
router.delete('/:id', auth, async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    if (answer.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Answer.findByIdAndDelete(req.params.id);
    res.json({ message: 'Answer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Vote on answer
router.post('/:id/vote', auth, async (req, res) => {
  try {
    const { voteType } = req.body; // 1 for upvote, -1 for downvote
    const answer = await Answer.findById(req.params.id);

    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }

    // Check if user already voted
    const existingVoteIndex = answer.votedUsers.findIndex(
      vote => vote.userId.toString() === req.user._id.toString()
    );

    if (existingVoteIndex > -1) {
      const existingVote = answer.votedUsers[existingVoteIndex];
      
      if (existingVote.voteType === voteType) {
        // Remove vote if same vote type
        answer.votes -= voteType;
        answer.votedUsers.splice(existingVoteIndex, 1);
      } else {
        // Change vote type
        answer.votes -= existingVote.voteType; // Remove old vote
        answer.votes += voteType; // Add new vote
        answer.votedUsers[existingVoteIndex].voteType = voteType;
      }
    } else {
      // Add new vote
      answer.votes += voteType;
      answer.votedUsers.push({
        userId: req.user._id,
        voteType
      });
    }

    await answer.save();
    await answer.populate('userId', 'name avatar');

    res.json(answer);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;