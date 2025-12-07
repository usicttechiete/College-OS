const express = require('express');
const { authenticate, optionalAuth } = require('../middleware/auth');
const { validateFoundItem, validateStatusUpdate, validatePagination } = require('../middleware/validation');
const {
  createFoundItem,
  getFoundItems,
  getFoundItemById,
  updateFoundItem,
  deleteFoundItem,
  getMyFoundItems,
  claimFoundItem,
  unclaimFoundItem,
  updateFoundItemStatus,
} = require('../controllers/foundController');

const router = express.Router();

/**
 * POST /found
 * Create a new found item
 * Auth: Required
 */
router.post('/', authenticate, validateFoundItem, createFoundItem);

/**
 * GET /found
 * Get all found items with filtering, pagination, and search
 * Auth: Optional (public can view available items)
 */
router.get('/', optionalAuth, validatePagination, getFoundItems);

/**
 * GET /found/:id
 * Get a specific found item by ID
 * Auth: Optional (public can view available items)
 */
router.get('/:id', optionalAuth, getFoundItemById);

/**
 * PATCH /found/:id
 * Update a found item (finder only)
 * Auth: Required
 */
router.patch('/:id', authenticate, validateFoundItem, updateFoundItem);

/**
 * DELETE /found/:id
 * Delete a found item (finder only)
 * Auth: Required
 */
router.delete('/:id', authenticate, deleteFoundItem);

/**
 * GET /found/my-items
 * Get current user's found items
 * Auth: Required
 */
router.get('/my-items', authenticate, validatePagination, getMyFoundItems);

/**
 * POST /found/:id/claim
 * Claim a found item
 * Auth: Required
 */
router.post('/:id/claim', authenticate, claimFoundItem);

/**
 * POST /found/:id/unclaim
 * Unclaim a found item (finder or claimer)
 * Auth: Required
 */
router.post('/:id/unclaim', authenticate, unclaimFoundItem);

/**
 * PATCH /found/:id/status
 * Update found item status (finder only)
 * Auth: Required
 */
router.patch('/:id/status', authenticate, validateStatusUpdate, updateFoundItemStatus);

module.exports = router;

