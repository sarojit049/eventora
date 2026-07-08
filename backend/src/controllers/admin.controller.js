const adminService = require('../services/admin.service');
const catchAsync = require('../utils/catchAsync');

/**
 * @desc    Get admin dashboard stats
 * @route   GET /api/v1/admin/dashboard
 * @access  Admin
 */
const getDashboardStats = catchAsync(async (req, res) => {
  const result = await adminService.getDashboardStats();

  res.status(200).json({
    success: true,
    data: result,
  });
});

module.exports = { getDashboardStats };
