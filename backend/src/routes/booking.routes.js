const express = require('express');
const bookingController = require('../controllers/booking.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { createBookingSchema } = require('../validators/booking.validator');

const router = express.Router();

// All booking routes require authentication
router.use(protect);

/**
 * @swagger
 * /api/v1/bookings:
 *   post:
 *     summary: Create a booking
 *     tags: [Bookings]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [eventId, quantity]
 *             properties:
 *               eventId: { type: string }
 *               quantity: { type: integer, minimum: 1, maximum: 10 }
 *     responses:
 *       201: { description: Booking confirmed }
 *       400: { description: Validation error or no seats }
 */
router.post('/', validate(createBookingSchema), bookingController.createBooking);

/**
 * @swagger
 * /api/v1/bookings/me:
 *   get:
 *     summary: Get current user's bookings
 *     tags: [Bookings]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: User's bookings }
 */
router.get('/me', bookingController.getMyBookings);

/**
 * @swagger
 * /api/v1/bookings/{id}/cancel:
 *   patch:
 *     summary: Cancel a booking
 *     tags: [Bookings]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Booking cancelled }
 */
router.patch('/:id/cancel', bookingController.cancelBooking);

/**
 * @swagger
 * /api/v1/bookings:
 *   get:
 *     summary: Get all bookings (Admin only)
 *     tags: [Bookings]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: All bookings }
 */
router.get('/', authorize('admin'), bookingController.getAllBookings);

module.exports = router;
