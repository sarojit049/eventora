const Joi = require('joi');

const createEventSchema = Joi.object({
  title: Joi.string().trim().max(120).required().messages({
    'any.required': 'Event title is required',
  }),
  shortDescription: Joi.string().trim().max(200).allow(''),
  description: Joi.string().required().messages({
    'any.required': 'Event description is required',
  }),
  category: Joi.string()
    .valid(
      'technology', 'music', 'business', 'workshop',
      'sports', 'community', 'arts', 'food', 'health', 'education'
    )
    .required()
    .messages({ 'any.required': 'Category is required' }),
  venue: Joi.string().trim().required().messages({
    'any.required': 'Venue is required',
  }),
  city: Joi.string().trim().required().messages({
    'any.required': 'City is required',
  }),
  address: Joi.string().trim().allow(''),
  startDate: Joi.date().iso().required().messages({
    'any.required': 'Start date is required',
  }),
  endDate: Joi.date().iso().min(Joi.ref('startDate')).allow(null, ''),
  startTime: Joi.string().allow(''),
  organizer: Joi.string().trim().required().messages({
    'any.required': 'Organizer is required',
  }),
  imageUrl: Joi.string().uri().allow(''),
  price: Joi.number().min(0).required().messages({
    'any.required': 'Price is required',
    'number.min': 'Price cannot be negative',
  }),
  capacity: Joi.number().integer().min(1).required().messages({
    'any.required': 'Capacity is required',
    'number.min': 'Capacity must be at least 1',
  }),
  status: Joi.string().valid('draft', 'published', 'cancelled'),
  featured: Joi.boolean(),
  tags: Joi.array().items(Joi.string().trim()),
});

const updateEventSchema = createEventSchema.fork(
  ['title', 'description', 'category', 'venue', 'city', 'startDate', 'organizer', 'price', 'capacity'],
  (schema) => schema.optional()
);

module.exports = { createEventSchema, updateEventSchema };
