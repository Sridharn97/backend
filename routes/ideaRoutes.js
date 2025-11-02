import express from 'express';
import { 
  getIdeas,
  getIdeaById,
  createIdea,
  updateIdea,
  deleteIdea,
  voteIdea,
  getUserIdeas
} from '../controllers/ideaController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes (must come before /:id to avoid route conflicts)
router.get('/user/ideas', protect, getUserIdeas);

// Public routes (with optional auth to identify admins)
router.get('/', optionalAuth, getIdeas);
router.get('/:id', optionalAuth, getIdeaById);

// Protected routes
router.post('/', protect, createIdea);
router.put('/:id', protect, updateIdea);
router.delete('/:id', protect, deleteIdea);
router.post('/:id/vote', protect, voteIdea);

export default router;