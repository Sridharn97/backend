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
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getIdeas);
router.get('/:id', getIdeaById);

// Protected routes
router.post('/', protect, createIdea);
router.put('/:id', protect, updateIdea);
router.delete('/:id', protect, deleteIdea);
router.post('/:id/vote', protect, voteIdea);
router.get('/user/ideas', protect, getUserIdeas);

export default router;