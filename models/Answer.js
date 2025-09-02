const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  votes: {
    type: Number,
    default: 0
  },
  votedUsers: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    voteType: {
      type: Number, // 1 for upvote, -1 for downvote
      enum: [1, -1]
    }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Answer', answerSchema);