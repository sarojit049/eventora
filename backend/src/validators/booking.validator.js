const Joi = require('joi');

const createBookingSchema = Joi.object({
  eventId: Joi.string().required().messages({
    'any.required': 'Event ID is required',
  }),
  quantity: Joi.number().integer().min(1).max(10).required().messages({
    'any.required': 'Quantity is required',
    'number.min': 'Quantity must be at least 1',
    'number.max': 'Maximum 10 tickets per booking',
  }),
});

module.exports = { createBookingSchema };
