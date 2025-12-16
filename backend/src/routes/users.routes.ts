import { Router } from 'express';
import { body, param } from 'express-validator';
import { UserController } from '@/controllers/UserController';
import { validateRequest } from '@/middleware/validation';

const router = Router();
const userController = new UserController();

// Get current user profile (authenticated user)
router.get('/me/profile', userController.getCurrentUserProfile);

// Get user profile by user ID
router.get(
  '/profile/:userId',
  [
    param('userId').notEmpty().withMessage('User ID is required'),
  ],
  validateRequest,
  userController.getUserProfileById
);

// Get user ID by auth user ID
router.get(
  '/id/:authUserId',
  [
    param('authUserId').notEmpty().withMessage('Auth user ID is required'),
  ],
  validateRequest,
  userController.getUserIdByAuthId
);

// Get current user profile (alternative endpoint)
router.get(
  '/profile/:authUserId',
  [
    param('authUserId').notEmpty().withMessage('Auth user ID is required'),
  ],
  validateRequest,
  userController.getUserProfile
);

export default router;