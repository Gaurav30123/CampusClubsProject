const express = require('express');
const router = express.Router();
const {
  createClub,
  getClubs,
  getClubById,
  updateClub,
  deleteClub,
  joinClub,
  leaveClub,
} = require('../controllers/clubController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getClubs).post(protect, admin, createClub);
router.route('/:id').get(getClubById).patch(protect, admin, updateClub).delete(protect, admin, deleteClub);
router.route('/:id/join').post(protect, joinClub);
router.route('/:id/leave').post(protect, leaveClub);

module.exports = router;
