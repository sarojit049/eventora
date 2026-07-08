const Event = require('../models/Event');
const ApiError = require('../utils/ApiError');

/**
 * Get all events with filtering, searching, sorting, and pagination
 */
const getEvents = async (query) => {
  const {
    page = 1,
    limit = 9,
    search,
    category,
    city,
    minPrice,
    maxPrice,
    sort = '-startDate',
    status = 'published',
    featured,
  } = query;

  const filter = {};

  // Status filter
  if (status) {
    filter.status = status;
  }

  // Category filter
  if (category && category !== 'all') {
    filter.category = category.toLowerCase();
  }

  // City filter
  if (city && city !== 'all') {
    filter.city = { $regex: new RegExp(city, 'i') };
  }

  // Price filter
  if (minPrice !== undefined || maxPrice !== undefined) {
    filter.price = {};
    if (minPrice !== undefined) filter.price.$gte = Number(minPrice);
    if (maxPrice !== undefined) filter.price.$lte = Number(maxPrice);
  }

  // Featured filter
  if (featured === 'true') {
    filter.featured = true;
  }

  // Search filter
  if (search) {
    filter.$or = [
      { title: { $regex: new RegExp(search, 'i') } },
      { description: { $regex: new RegExp(search, 'i') } },
      { venue: { $regex: new RegExp(search, 'i') } },
    ];
  }

  // Sort mapping
  let sortOption = {};
  switch (sort) {
    case 'date':
    case 'startDate':
      sortOption = { startDate: 1 };
      break;
    case '-date':
    case '-startDate':
      sortOption = { startDate: -1 };
      break;
    case 'price':
      sortOption = { price: 1 };
      break;
    case '-price':
      sortOption = { price: -1 };
      break;
    case 'title':
      sortOption = { title: 1 };
      break;
    default:
      sortOption = { startDate: -1 };
  }

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  const [events, total] = await Promise.all([
    Event.find(filter).sort(sortOption).skip(skip).limit(limitNum).populate('createdBy', 'name'),
    Event.countDocuments(filter),
  ]);

  return {
    events,
    pagination: {
      currentPage: pageNum,
      totalPages: Math.ceil(total / limitNum),
      totalItems: total,
      limit: limitNum,
      hasNext: pageNum < Math.ceil(total / limitNum),
      hasPrev: pageNum > 1,
    },
  };
};

/**
 * Get single event by ID
 */
const getEventById = async (eventId) => {
  const event = await Event.findById(eventId).populate('createdBy', 'name');
  if (!event) {
    throw new ApiError(404, 'Event not found');
  }
  return event;
};

/**
 * Create a new event (admin only)
 */
const createEvent = async (eventData, userId) => {
  const event = await Event.create({
    ...eventData,
    availableSeats: eventData.capacity,
    createdBy: userId,
  });
  return event;
};

/**
 * Update an event (admin only)
 */
const updateEvent = async (eventId, updateData) => {
  const event = await Event.findById(eventId);
  if (!event) {
    throw new ApiError(404, 'Event not found');
  }

  // If capacity is being increased, add the difference to available seats
  if (updateData.capacity && updateData.capacity > event.capacity) {
    const diff = updateData.capacity - event.capacity;
    updateData.availableSeats = event.availableSeats + diff;
  }

  Object.assign(event, updateData);
  await event.save();
  return event;
};

/**
 * Delete an event (admin only)
 */
const deleteEvent = async (eventId) => {
  const event = await Event.findById(eventId);
  if (!event) {
    throw new ApiError(404, 'Event not found');
  }
  await Event.findByIdAndDelete(eventId);
  return { message: 'Event deleted successfully' };
};

/**
 * Get distinct cities from events
 */
const getCities = async () => {
  return Event.distinct('city', { status: 'published' });
};

/**
 * Get distinct categories used in events
 */
const getCategories = async () => {
  return Event.distinct('category', { status: 'published' });
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getCities,
  getCategories,
};
