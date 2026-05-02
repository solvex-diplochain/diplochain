const Diploma = require('../models/Diploma');
const User = require('../models/User');
const Institution = require('../models/Institution');

// @desc    Obtenir les statistiques générales
// @route   GET /api/stats
// @access  Public
const getStats = async (req, res, next) => {
  try {
    const totalDiplomas = await Diploma.countDocuments({ status: { $ne: 'draft' } });
    const totalVerified = await Diploma.countDocuments({ status: 'verified' });
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalInstitutions = await Institution.countDocuments({ isActive: true });
    
    // Statistiques par niveau (Master, Bachelor, etc.)
    const statsByLevel = await Diploma.aggregate([
      { $match: { status: { $ne: 'draft' } } },
      { $group: { _id: '$level', count: { $sum: 1 } } }
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalDiplomas,
        totalVerified,
        totalStudents,
        totalInstitutions,
        statsByLevel
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStats
};
