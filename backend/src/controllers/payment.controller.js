const paymentService = require('../services/payment.service');
const catchAsync = require('../utils/catchAsync');

const createOrder = catchAsync(async (req, res) => {
  const { eventId, quantity } = req.body;
  const result = await paymentService.createOrder(req.user.id, { eventId, quantity });
  
  res.status(200).json({
    success: true,
    message: 'Payment order created',
    data: result
  });
});

const verifyPayment = catchAsync(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;
  
  const result = await paymentService.verifyPayment(req.user.id, {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    bookingId
  });

  res.status(200).json({
    success: true,
    message: 'Payment verified and booking confirmed',
    data: {
      booking: result
    }
  });
});

module.exports = {
  createOrder,
  verifyPayment
};
