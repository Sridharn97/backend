const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  topics: { // <-- Change from 'topic' to 'topics'
    type: [String],
    required: true,
    enum: ['DSA', 'Java', 'DBMS', 'HR']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Question', questionSchema);