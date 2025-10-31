import express from 'express';
import { 
  getComments,
  addComment,
  deleteComment
} from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/:ideaId', getComments);

// Protected routes
router.post('/:ideaId', protect, addComment);
router.delete('/:id', protect, deleteComment);

export default router;