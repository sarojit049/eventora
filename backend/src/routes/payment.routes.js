const express = require('express');
const paymentController = require('../controllers/payment.controller');
const { protect } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');
const Joi = require('joi');

const router = express.Router();

router.use(protect);

const createOrderSchema = Joi.object().keys({
  eventId: Joi.string().required(),
  quantity: Joi.number().integer().min(1).max(10).required(),
});

const verifyPaymentSchema = Joi.object().keys({
  razorpay_order_id: Joi.string().required(),
  razorpay_payment_id: Joi.string().required(),
  razorpay_signature: Joi.string().required(),
  bookingId: Joi.string().required(),
});

router.post('/create-order', validate(createOrderSchema), paymentController.createOrder);
router.post('/verify', validate(verifyPaymentSchema), paymentController.verifyPayment);

module.exports = router;
