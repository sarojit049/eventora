const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const ApiError = require('../utils/ApiError');
const { generateBookingReference, calculateBookingTotal, validateAvailability } = require('../utils/bookingHelpers');

/**
 * Create a booking with atomic seat update
 */
const createBooking = async (userId, { eventId, quantity }) => {
  const event = await Event.findById(eventId);
  if (!event) {
    throw new ApiError(404, 'Event not found');
  }

  if (event.status !== 'published') {
    throw new ApiError(400, 'This event is not available for booking');
  }

  if (new Date(event.startDate) < new Date()) {
    throw new ApiError(400, 'Cannot book a past event');
  }

  if (!validateAvailability(event.availableSeats, quantity)) {
    throw new ApiError(400, `Not enough seats available. Only ${event.availableSeats} seats remaining.`);
  }

  if (event.price > 0) {
    throw new ApiError(400, 'Payment is required for this event');
  }

  // Atomic update to prevent overbooking
  const updatedEvent = await Event.findOneAndUpdate(
    { _id: eventId, availableSeats: { $gte: quantity } },
    { $inc: { availableSeats: -quantity } },
    { new: true }
  );

  if (!updatedEvent) {
    throw new ApiError(409, 'Seats are no longer available. Please try a smaller quantity.');
  }

  const booking = await Booking.create({
    user: userId,
    event: eventId,
    quantity,
    unitPrice: event.price,
    totalAmount: calculateBookingTotal(event.price, quantity),
    bookingReference: generateBookingReference(),
    bookingStatus: 'confirmed',
    paymentStatus: 'not_required',
  });

  return booking.populate('event', 'title startDate venue city imageUrl');
};

/**
 * Get bookings for a specific user
 */
const getUserBookings = async (userId) => {
  return Booking.find({ user: userId })
    .populate('event', 'title startDate endDate startTime venue city imageUrl category price')
    .sort({ createdAt: -1 });
};

/**
 * Cancel a booking
 */
const cancelBooking = async (userId, bookingId) => {
  const booking = await Booking.findById(bookingId);

  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  if (booking.user.toString() !== userId.toString()) {
    throw new ApiError(403, 'You can only cancel your own bookings');
  }

  if (booking.bookingStatus === 'cancelled') {
    throw new ApiError(400, 'This booking is already cancelled');
  }

  // Restore seats
  await Event.findByIdAndUpdate(booking.event, {
    $inc: { availableSeats: booking.quantity },
  });

  booking.bookingStatus = 'cancelled';
  await booking.save();

  return booking;
};

/**
 * Get all bookings (admin)
 */
const getAllBookings = async (query = {}) => {
  const { page = 1, limit = 20 } = query;
  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  const [bookings, total] = await Promise.all([
    Booking.find()
      .populate('user', 'name email')
      .populate('event', 'title startDate venue city')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Booking.countDocuments(),
  ]);

  return {
    bookings,
    pagination: {
      currentPage: pageNum,
      totalPages: Math.ceil(total / limitNum),
      totalItems: total,
      limit: limitNum,
    },
  };
};

module.exports = { createBooking, getUserBookings, cancelBooking, getAllBookings };
