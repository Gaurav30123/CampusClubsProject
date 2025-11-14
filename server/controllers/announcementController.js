const Announcement = require('../models/Announcement');
const Club = require('../models/Club');

// @desc    Create an announcement
// @route   POST /api/announcements
// @access  Private/Admin
exports.createAnnouncement = async (req, res) => {
  const { clubId, title, content } = req.body;

  try {
    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    // Check if user is the admin of the club
    if (club.adminId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized to create announcements for this club' });
    }

    const announcement = new Announcement({
      clubId,
      title,
      content,
      authorId: req.user._id,
    });

    const createdAnnouncement = await announcement.save();
    res.status(201).json(createdAnnouncement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all announcements for a club
// @route   GET /api/announcements/club/:clubId
// @access  Public
exports.getAnnouncementsByClub = async (req, res) => {
  try {
    const announcements = await Announcement.find({ clubId: req.params.clubId }).populate('authorId', 'name');
    res.json(announcements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an announcement
// @route   DELETE /api/announcements/:id
// @access  Private/Admin
exports.deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id).populate('clubId');

    if (announcement) {
      // Check if user is the admin of the club
      if (announcement.clubId.adminId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'User not authorized to delete this announcement' });
      }

      await announcement.remove();
      res.json({ message: 'Announcement removed' });
    } else {
      res.status(404).json({ message: 'Announcement not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
