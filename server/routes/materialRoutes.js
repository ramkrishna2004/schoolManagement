const express = require('express');
const router = express.Router();
const {
  getMaterials,
  getMaterial,
  createMaterial,
  updateMaterial,
  deleteMaterial,
  downloadMaterial,
  getMaterialAnalytics
} = require('../controllers/materialController');
const { protect, authorize } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Routes accessible by all authenticated users
router.get('/', getMaterials);
router.get('/:id', getMaterial);
router.get('/:id/download', downloadMaterial);

// Routes accessible by admin and teacher only
router.post('/', authorize('admin', 'teacher'), createMaterial);
router.put('/:id', authorize('admin', 'teacher'), updateMaterial);
router.delete('/:id', authorize('admin', 'teacher'), deleteMaterial);

// Analytics route (admin and teacher only)
router.get('/:id/analytics', authorize('admin', 'teacher'), getMaterialAnalytics);

// Log material access (view/download)
router.post('/:id/access', protect, require('../controllers/materialController').logMaterialAccess);

module.exports = router; 