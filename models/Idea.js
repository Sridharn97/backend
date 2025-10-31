import mongoose from 'mongoose';
import crypto from 'crypto';

const IdeaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: 2000
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  techStack: {
    type: [String],
    required: [true, 'Tech stack is required']
  },
 
  views: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  reports: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  votes: {
    up: {
      type: Number,
      default: 0
    },
    down: {
      type: Number,
      default: 0
    },
    voters: [{
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      voteType: {
        type: String,
        enum: ['up', 'down']
      }
    }]
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  verificationHash: {
    type: String,
    unique: true
  }
});

// Update updatedAt before update
IdeaSchema.pre('findOneAndUpdate', function () {
  this.set({ updatedAt: Date.now() });
});

// Generate verification hash before saving
IdeaSchema.pre('save', function (next) {
  if (!this.verificationHash) {
    this.verificationHash = crypto
      .createHash('sha256')
      .update(this._id.toString() + this.createdAt.getTime().toString())
      .digest('hex');
  }
  next();
});

const Idea = mongoose.model('Idea', IdeaSchema);

export default Idea;
