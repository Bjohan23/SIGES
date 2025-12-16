import { Router } from 'express';
import { DashboardController } from '@/controllers/DashboardController';

const router = Router();
const dashboardController = new DashboardController();

// Get dashboard statistics
router.get('/statistics', dashboardController.getStatistics);

// Get recent activity feed
router.get('/activity', dashboardController.getRecentActivity);

export default router;