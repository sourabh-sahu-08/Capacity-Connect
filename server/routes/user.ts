import express from 'express';
import { 
  getUserProfile, 
  toggleFollowUser, 
  toggleSkillEndorsement,
  getUserFollowers, 
  getUserFollowing, 
  getDiscoverUsers,
  getUserActivityHeatmap,
  getUserProjects,
  createUserProject,
  updateUserProject,
  deleteUserProject,
  getUserRecommendations,
  createRecommendation,
  respondToRecommendation,
  deleteRecommendation
} from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

// Public / Protected user routes
router.get('/discover', protect, getDiscoverUsers);
router.post('/projects', protect, createUserProject);
router.put('/projects/:projectId', protect, updateUserProject);
router.delete('/projects/:projectId', protect, deleteUserProject);

// Recommendations routes
router.put('/recommendations/:recommendationId/status', protect, respondToRecommendation);
router.delete('/recommendations/:recommendationId', protect, deleteRecommendation);

router.get('/:id', protect, getUserProfile);
router.get('/:id/activity', protect, getUserActivityHeatmap);
router.get('/:id/projects', protect, getUserProjects);
router.get('/:id/recommendations', protect, getUserRecommendations);
router.post('/:id/recommendations', protect, createRecommendation);
router.post('/:id/follow', protect, toggleFollowUser);
router.post('/:id/endorse', protect, toggleSkillEndorsement);
router.get('/:id/followers', protect, getUserFollowers);
router.get('/:id/following', protect, getUserFollowing);

export default router;
