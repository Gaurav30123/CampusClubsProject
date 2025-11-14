const express = require('express');
const router = express.Router();
const {
  createAnnouncement,
  getAnnouncementsByClub,
  deleteAnnouncement,
} = require('../controllers/announcementController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').post(protect, admin, createAnnouncement);
router.route('/club/:clubId').get(getAnnouncementsByClub);
router.route('/:id').delete(protect, admin, deleteAnnouncement);

module.exports = router;
