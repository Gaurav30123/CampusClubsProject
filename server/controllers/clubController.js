const Club = require('../models/Club');
const User = require('../models/User');

// @desc    Create a club
// @route   POST /api/clubs
// @access  Private/Admin
exports.createClub = async (req, res) => {
  const { name, description, category, banner } = req.body;

  try {
    const club = new Club({
      name,
      description,
      category,
      banner,
      adminId: req.user._id,
    });

    const createdClub = await club.save();
    res.status(201).json(createdClub);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all clubs
// @route   GET /api/clubs
// @access  Public
exports.getClubs = async (req, res) => {
  try {
    const clubs = await Club.find({}).populate('adminId', 'name');
    res.json(clubs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single club
// @route   GET /api/clubs/:id
// @access  Public
exports.getClubById = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id).populate('adminId', 'name').populate('members', 'name');
    if (club) {
      res.json(club);
    } else {
      res.status(404).json({ message: 'Club not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a club
// @route   PATCH /api/clubs/:id
// @access  Private/Admin
exports.updateClub = async (req, res) => {
  const { name, description, category, banner } = req.body;

  try {
    const club = await Club.findById(req.params.id);

    if (club) {
      // Check if user is the admin of the club
      if (club.adminId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'User not authorized' });
      }

      club.name = name || club.name;
      club.description = description || club.description;
      club.category = category || club.category;
      club.banner = banner || club.banner;

      const updatedClub = await club.save();
      res.json(updatedClub);
    } else {
      res.status(404).json({ message: 'Club not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a club
// @route   DELETE /api/clubs/:id
// @access  Private/Admin
exports.deleteClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);

    if (club) {
      // Check if user is the admin of the club
      if (club.adminId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'User not authorized' });
      }

      await club.remove();
      res.json({ message: 'Club removed' });
    } else {
      res.status(404).json({ message: 'Club not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Join a club
// @route   POST /api/clubs/:id/join
// @access  Private/Student
exports.joinClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    const user = await User.findById(req.user._id);

    if (club && user) {
      if (club.members.includes(user._id)) {
        return res.status(400).json({ message: 'User already a member of this club' });
      }
      club.members.push(user._id);
      user.joinedClubs.push(club._id);

      await club.save();
      await user.save();

      res.json({ message: 'Successfully joined club' });
    } else {
      res.status(404).json({ message: 'Club or user not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Leave a club
// @route   POST /api/clubs/:id/leave
// @access  Private/Student
exports.leaveClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    const user = await User.findById(req.user._id);

    if (club && user) {
      if (!club.members.includes(user._id)) {
        return res.status(400).json({ message: 'User is not a member of this club' });
      }

      club.members = club.members.filter(memberId => memberId.toString() !== user._id.toString());
      user.joinedClubs = user.joinedClubs.filter(clubId => clubId.toString() !== club._id.toString());

      await club.save();
      await user.save();

      res.json({ message: 'Successfully left club' });
    } else {
      res.status(404).json({ message: 'Club or user not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
