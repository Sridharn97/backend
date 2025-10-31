import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  idea: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Idea',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    trim: true,
    maxlength: 500
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Comment = mongoose.model('Comment', CommentSchema);

export default Comment;