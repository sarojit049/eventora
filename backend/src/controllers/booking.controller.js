const bookingService = require('../services/booking.service');
const catchAsync = require('../utils/catchAsync');

/**
 * @desc    Create a booking
 * @route   POST /api/v1/bookings
 * @access  Private
 */
const createBooking = catchAsync(async (req, res) => {
  const booking = await bookingService.createBooking(req.user._id, req.body);

  res.status(201).json({
    success: true,
    message: 'Booking confirmed successfully',
    data: { booking },
  });
});

/**
 * @desc    Get user's bookings
 * @route   GET /api/v1/bookings/me
 * @access  Private
 */
const getMyBookings = catchAsync(async (req, res) => {
  const bookings = await bookingService.getUserBookings(req.user._id);

  res.status(200).json({
    success: true,
    data: { bookings },
  });
});

/**
 * @desc    Cancel a booking
 * @route   PATCH /api/v1/bookings/:id/cancel
 * @access  Private
 */
const cancelBooking = catchAsync(async (req, res) => {
  const booking = await bookingService.cancelBooking(req.user._id, req.params.id);

  res.status(200).json({
    success: true,
    message: 'Booking cancelled successfully',
    data: { booking },
  });
});

/**
 * @desc    Get all bookings (admin)
 * @route   GET /api/v1/bookings
 * @access  Admin
 */
const getAllBookings = catchAsync(async (req, res) => {
  const result = await bookingService.getAllBookings(req.query);

  res.status(200).json({
    success: true,
    data: result,
  });
});

module.exports = { createBooking, getMyBookings, cancelBooking, getAllBookings };
