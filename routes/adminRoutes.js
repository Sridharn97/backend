import express from 'express';
import { 
  getAllIdeas,
  updateIdeaStatus,
  deleteIdea,
  deleteComment
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected and require admin access
router.use(protect, admin);

router.get('/ideas', getAllIdeas);
router.put('/ideas/:id/status', updateIdeaStatus);
router.delete('/ideas/:id', deleteIdea);
router.delete('/comments/:id', deleteComment);

export default router;