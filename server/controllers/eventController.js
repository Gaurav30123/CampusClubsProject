const Event = require('../models/Event');
const Club = require('../models/Club');

// @desc    Create an event
// @route   POST /api/events
// @access  Private/Admin
exports.createEvent = async (req, res) => {
  const { clubId, title, description, date, time, venue, banner } = req.body;

  try {
    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    // Check if user is the admin of the club
    if (club.adminId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'User not authorized to create events for this club' });
    }

    const event = new Event({
      clubId,
      title,
      description,
      date,
      time,
      venue,
      banner,
    });

    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all events for a club
// @route   GET /api/events/club/:clubId
// @access  Public
exports.getEventsByClub = async (req, res) => {
  try {
    const events = await Event.find({ clubId: req.params.clubId });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// @desc    Get all events
// @route   GET /api/events
// @access  Public
exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find({}).populate('clubId', 'name');
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Public
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('clubId', 'name adminId');
    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an event
// @route   PATCH /api/events/:id
// @access  Private/Admin
exports.updateEvent = async (req, res) => {
  const { title, description, date, time, venue, banner } = req.body;

  try {
    const event = await Event.findById(req.params.id).populate('clubId');

    if (event) {
      // Check if user is the admin of the club
      if (event.clubId.adminId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'User not authorized to update this event' });
      }

      event.title = title || event.title;
      event.description = description || event.description;
      event.date = date || event.date;
      event.time = time || event.time;
      event.venue = venue || event.venue;
      event.banner = banner || event.banner;

      const updatedEvent = await event.save();
      res.json(updatedEvent);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/Admin
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('clubId');

    if (event) {
      // Check if user is the admin of the club
      if (event.clubId.adminId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'User not authorized to delete this event' });
      }

      await event.remove();
      res.json({ message: 'Event removed' });
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
