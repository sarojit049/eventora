/**
 * Generates a unique human-readable booking reference
 * Format: EVT-YYYY-XXXXXX (e.g., EVT-2026-A3F9K2)
 */
const generateBookingReference = () => {
  const year = new Date().getFullYear();
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `EVT-${year}-${code}`;
};

/**
 * Calculates booking total amount
 */
const calculateBookingTotal = (unitPrice, quantity) => {
  if (typeof unitPrice !== 'number' || typeof quantity !== 'number') {
    throw new Error('unitPrice and quantity must be numbers');
  }
  if (unitPrice < 0 || quantity < 1) {
    throw new Error('Invalid unitPrice or quantity');
  }
  return Math.round(unitPrice * quantity * 100) / 100;
};

/**
 * Validates if enough seats are available
 */
const validateAvailability = (availableSeats, requestedQuantity) => {
  if (typeof availableSeats !== 'number' || typeof requestedQuantity !== 'number') {
    return false;
  }
  return availableSeats >= requestedQuantity && requestedQuantity > 0;
};

module.exports = {
  generateBookingReference,
  calculateBookingTotal,
  validateAvailability,
};
