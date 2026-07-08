const eventService = require('../services/event.service');
const catchAsync = require('../utils/catchAsync');

/**
 * @desc    Get all events (with filtering, search, sort, pagination)
 * @route   GET /api/v1/events
 * @access  Public
 */
const getEvents = catchAsync(async (req, res) => {
  const result = await eventService.getEvents(req.query);

  res.status(200).json({
    success: true,
    data: result,
  });
});

/**
 * @desc    Get single event by ID
 * @route   GET /api/v1/events/:id
 * @access  Public
 */
const getEvent = catchAsync(async (req, res) => {
  const event = await eventService.getEventById(req.params.id);

  res.status(200).json({
    success: true,
    data: { event },
  });
});

/**
 * @desc    Create a new event
 * @route   POST /api/v1/events
 * @access  Admin
 */
const createEvent = catchAsync(async (req, res) => {
  const event = await eventService.createEvent(req.body, req.user._id);

  res.status(201).json({
    success: true,
    message: 'Event created successfully',
    data: { event },
  });
});

/**
 * @desc    Update an event
 * @route   PATCH /api/v1/events/:id
 * @access  Admin
 */
const updateEvent = catchAsync(async (req, res) => {
  const event = await eventService.updateEvent(req.params.id, req.body);

  res.status(200).json({
    success: true,
    message: 'Event updated successfully',
    data: { event },
  });
});

/**
 * @desc    Delete an event
 * @route   DELETE /api/v1/events/:id
 * @access  Admin
 */
const deleteEvent = catchAsync(async (req, res) => {
  await eventService.deleteEvent(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Event deleted successfully',
  });
});

/**
 * @desc    Get distinct cities
 * @route   GET /api/v1/events/cities
 * @access  Public
 */
const getCities = catchAsync(async (req, res) => {
  const cities = await eventService.getCities();

  res.status(200).json({
    success: true,
    data: { cities },
  });
});

/**
 * @desc    Get distinct categories
 * @route   GET /api/v1/events/categories
 * @access  Public
 */
const getCategories = catchAsync(async (req, res) => {
  const categories = await eventService.getCategories();

  res.status(200).json({
    success: true,
    data: { categories },
  });
});

module.exports = { getEvents, getEvent, createEvent, updateEvent, deleteEvent, getCities, getCategories };
