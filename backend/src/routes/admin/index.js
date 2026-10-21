import { Router } from 'express';
import authRoutes from './auth.js';
import dashboardRoutes from './dashboard.js';
import profileRoutes from './profile.js';
import skillsRoutes from './skills.js';
import experiencesRoutes from './experiences.js';
import educationsRoutes from './educations.js';
import projectsRoutes from './projects.js';
import messagesRoutes from './messages.js';
import settingsRoutes from './settings.js';

const router = Router();

router.use('/', authRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/profile', profileRoutes);
router.use('/skills', skillsRoutes);
router.use('/experiences', experiencesRoutes);
router.use('/educations', educationsRoutes);
router.use('/projects', projectsRoutes);
router.use('/messages', messagesRoutes);
router.use('/settings', settingsRoutes);

export default router;
