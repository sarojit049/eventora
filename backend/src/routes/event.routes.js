const express = require('express');
const eventController = require('../controllers/event.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const { createEventSchema, updateEventSchema } = require('../validators/event.validator');

const router = express.Router();

/**
 * @swagger
 * /api/v1/events:
 *   get:
 *     summary: Get all events with filters
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 9 }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: city
 *         schema: { type: string }
 *       - in: query
 *         name: minPrice
 *         schema: { type: number }
 *       - in: query
 *         name: maxPrice
 *         schema: { type: number }
 *       - in: query
 *         name: sort
 *         schema: { type: string, enum: [date, -date, price, -price, title] }
 *     responses:
 *       200: { description: List of events with pagination }
 */
router.get('/', eventController.getEvents);

/**
 * @swagger
 * /api/v1/events/cities:
 *   get:
 *     summary: Get all distinct cities
 *     tags: [Events]
 *     responses:
 *       200: { description: List of cities }
 */
router.get('/cities', eventController.getCities);

/**
 * @swagger
 * /api/v1/events/categories:
 *   get:
 *     summary: Get all distinct categories
 *     tags: [Events]
 *     responses:
 *       200: { description: List of categories }
 */
router.get('/categories', eventController.getCategories);

/**
 * @swagger
 * /api/v1/events/{id}:
 *   get:
 *     summary: Get event by ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200: { description: Event details }
 *       404: { description: Event not found }
 */
router.get('/:id', eventController.getEvent);

/**
 * @swagger
 * /api/v1/events:
 *   post:
 *     summary: Create a new event (Admin only)
 *     tags: [Events]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Event created }
 *       403: { description: Unauthorized }
 */
router.post('/', protect, authorize('admin'), validate(createEventSchema), eventController.createEvent);

/**
 * @swagger
 * /api/v1/events/{id}:
 *   patch:
 *     summary: Update an event (Admin only)
 *     tags: [Events]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Event updated }
 */
router.patch('/:id', protect, authorize('admin'), validate(updateEventSchema), eventController.updateEvent);

/**
 * @swagger
 * /api/v1/events/{id}:
 *   delete:
 *     summary: Delete an event (Admin only)
 *     tags: [Events]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Event deleted }
 */
router.delete('/:id', protect, authorize('admin'), eventController.deleteEvent);

module.exports = router;
