const User = require('../models/User');
const Event = require('../models/Event');
const Booking = require('../models/Booking');
const ApiError = require('../utils/ApiError');

/**
 * Get dashboard stats (admin)
 */
const getDashboardStats = async () => {
  const now = new Date();

  const [totalEvents, upcomingEvents, totalBookings, confirmedBookings, totalUsers, recentBookings, totalRevenue] =
    await Promise.all([
      Event.countDocuments(),
      Event.countDocuments({ startDate: { $gte: now }, status: 'published' }),
      Booking.countDocuments(),
      Booking.countDocuments({ bookingStatus: 'confirmed' }),
      User.countDocuments(),
      Booking.find()
        .populate('user', 'name email')
        .populate('event', 'title startDate venue city')
        .sort({ createdAt: -1 })
        .limit(10),
      Booking.aggregate([
        { $match: { bookingStatus: 'confirmed' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
    ]);

  return {
    stats: {
      totalEvents,
      upcomingEvents,
      totalBookings,
      confirmedBookings,
      cancelledBookings: totalBookings - confirmedBookings,
      totalUsers,
      totalRevenue: totalRevenue.length > 0 ? totalRevenue[0].total : 0,
    },
    recentBookings,
  };
};

module.exports = { getDashboardStats };
