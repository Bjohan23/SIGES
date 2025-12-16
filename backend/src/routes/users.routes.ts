import { Router } from 'express';
import { body, param } from 'express-validator';
import { UserController } from '@/controllers/UserController';
import { validateRequest } from '@/middleware/validation';

const router = Router();

// Get current user profile (authenticated user)
router.get('/me/profile', UserController.getCurrentUserProfile);

// Get user profile by user ID
router.get(
  '/profile/:userId',
  [
    param('userId').notEmpty().withMessage('User ID is required'),
  ],
  validateRequest,
  UserController.getUserProfileById
);

// Get user ID by auth user ID
router.get(
  '/id/:authUserId',
  [
    param('authUserId').notEmpty().withMessage('Auth user ID is required'),
  ],
  validateRequest,
  UserController.getUserIdByAuthId
);

// Get current user profile (alternative endpoint)
router.get(
  '/profile/:authUserId',
  [
    param('authUserId').notEmpty().withMessage('Auth user ID is required'),
  ],
  validateRequest,
  UserController.getUserProfile
);

export default router;