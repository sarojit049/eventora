const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../models/Booking');
const Event = require('../models/Event');
const ApiError = require('../utils/ApiError');
const { generateBookingReference, calculateBookingTotal, validateAvailability } = require('../utils/bookingHelpers');

const createOrder = async (userId, { eventId, quantity }) => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new ApiError(500, 'Payment configuration is missing on server');
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

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

  if (event.price === 0) {
    throw new ApiError(400, 'Free events do not require a payment order. Use standard booking.');
  }

  const totalAmount = calculateBookingTotal(event.price, quantity);
  const amountInPaise = Math.round(totalAmount * 100);

  const options = {
    amount: amountInPaise,
    currency: 'INR',
    receipt: `receipt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
  };

  try {
    const order = await razorpay.orders.create(options);
    
    // Create a pending booking
    const booking = await Booking.create({
      user: userId,
      event: eventId,
      quantity,
      unitPrice: event.price,
      totalAmount,
      bookingReference: generateBookingReference(),
      bookingStatus: 'pending',
      paymentStatus: 'pending',
    });

    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      bookingId: booking._id,
      bookingReference: booking.bookingReference
    };
  } catch (error) {
    console.error('Razorpay Order Creation Error:', error);
    
    // Extract safe message from Razorpay error if available
    let safeMessage = 'Failed to create payment order';
    if (error.statusCode === 401) {
      safeMessage = 'Payment gateway authentication failed. Please check backend configuration.';
    } else if (error.error && error.error.description) {
      safeMessage = error.error.description;
    }
    
    throw new ApiError(500, safeMessage);
  }
};

const verifyPayment = async (userId, { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId }) => {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  
  if (!secret) {
    throw new ApiError(500, 'Payment configuration is missing on server');
  }

  const booking = await Booking.findById(bookingId).populate('event');
  if (!booking) {
    throw new ApiError(404, 'Booking not found');
  }

  if (booking.user.toString() !== userId.toString()) {
    throw new ApiError(403, 'Unauthorized');
  }

  if (booking.bookingStatus === 'confirmed') {
    throw new ApiError(400, 'Booking is already confirmed');
  }

  // Verify signature
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body.toString())
    .digest('hex');

  const expectedBuffer = Buffer.from(expectedSignature, 'hex');
  const signatureBuffer = Buffer.from(razorpay_signature, 'hex');

  if (expectedBuffer.length !== signatureBuffer.length || !crypto.timingSafeEqual(expectedBuffer, signatureBuffer)) {
    throw new ApiError(400, 'Invalid payment signature');
  }

  // Signature is valid. Proceed to confirm booking.
  // Validate seat availability again before confirming
  const event = booking.event;
  if (!validateAvailability(event.availableSeats, booking.quantity)) {
    // Edge case: seats filled up while payment was pending. Ideally we would refund here.
    booking.bookingStatus = 'cancelled';
    await booking.save();
    throw new ApiError(409, 'Seats sold out during payment process. Please contact support for a refund.');
  }

  // Atomic update to prevent overbooking
  const updatedEvent = await Event.findOneAndUpdate(
    { _id: event._id, availableSeats: { $gte: booking.quantity } },
    { $inc: { availableSeats: -booking.quantity } },
    { new: true }
  );

  if (!updatedEvent) {
    booking.bookingStatus = 'cancelled';
    await booking.save();
    throw new ApiError(409, 'Seats sold out during payment process. Please contact support for a refund.');
  }

  booking.paymentStatus = 'paid';
  booking.bookingStatus = 'confirmed';
  await booking.save();

  return booking;
};

module.exports = {
  createOrder,
  verifyPayment
};
