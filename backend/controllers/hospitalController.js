// ===== FILE: backend/controllers/hospitalController.js =====
const Hospital = require('../models/Hospital');

// @desc    Get all hospitals
// @route   GET /api/hospitals
// @access  Public
exports.getHospitals = async (req, res) => {
  try {
    const { state, city, search } = req.query;
    
    let query = { isActive: true };
    
    if (state) query['address.state'] = new RegExp(state, 'i');
    if (city) query['address.city'] = new RegExp(city, 'i');
    if (search) query.name = new RegExp(search, 'i');

    const hospitals = await Hospital.find(query).sort({ rating: -1 });

    res.status(200).json({
      success: true,
      count: hospitals.length,
      data: hospitals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single hospital
// @route   GET /api/hospitals/:id
// @access  Public
exports.getHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: 'Hospital not found',
      });
    }

    res.status(200).json({
      success: true,
      data: hospital,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create hospital
// @route   POST /api/hospitals
// @access  Private/Admin
exports.createHospital = async (req, res) => {
  try {
    const hospital = await Hospital.create(req.body);

    res.status(201).json({
      success: true,
      data: hospital,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update hospital
// @route   PUT /api/hospitals/:id
// @access  Private/Admin
exports.updateHospital = async (req, res) => {
  try {
    let hospital = await Hospital.findById(req.params.id);

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: 'Hospital not found',
      });
    }

    hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: hospital,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete hospital
// @route   DELETE /api/hospitals/:id
// @access  Private/Admin
exports.deleteHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id);

    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: 'Hospital not found',
      });
    }

    await hospital.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Hospital deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get hospitals by state
// @route   GET /api/hospitals/states/:state
// @access  Public
exports.getHospitalsByState = async (req, res) => {
  try {
    const hospitals = await Hospital.find({
      'address.state': new RegExp(req.params.state, 'i'),
      isActive: true,
    });

    res.status(200).json({
      success: true,
      count: hospitals.length,
      data: hospitals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

