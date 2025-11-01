// ===== FILE: backend/controllers/doctorController.js =====
const Doctor = require('../models/Doctor');
const User = require('../models/User');

// @desc    Get all doctors
// @route   GET /api/doctors
// @access  Public
exports.getDoctors = async (req, res) => {
  try {
    const { specialization, hospital, state, city } = req.query;
    
    let query = { isApproved: true };
    
    if (specialization) query.specialization = new RegExp(specialization, 'i');
    if (hospital) query.hospital = hospital;

    const doctors = await Doctor.find(query)
      .populate('user', 'name email phone profileImage')
      .populate('hospital', 'name address');

    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single doctor
// @route   GET /api/doctors/:id
// @access  Public
exports.getDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate('user', 'name email phone profileImage address')
      .populate('hospital', 'name address phone')
      .populate('reviews.patient', 'name profileImage');

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create doctor profile
// @route   POST /api/doctors
// @access  Private/Doctor
exports.createDoctorProfile = async (req, res) => {
  try {
    const {
      specialization,
      qualifications,
      experience,
      consultationFee,
      hospital,
      availability,
    } = req.body;

    // Check if doctor profile already exists
    const existingDoctor = await Doctor.findOne({ user: req.user.id });
    if (existingDoctor) {
      return res.status(400).json({
        success: false,
        message: 'Doctor profile already exists',
      });
    }

    const doctor = await Doctor.create({
      user: req.user.id,
      specialization,
      qualifications,
      experience,
      consultationFee,
      hospital,
      availability,
    });

    res.status(201).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update doctor profile
// @route   PUT /api/doctors/:id
// @access  Private/Doctor
exports.updateDoctorProfile = async (req, res) => {
  try {
    let doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    // Make sure user is doctor owner
    if (doctor.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(401).json({
        success: false,
        message: 'Not authorized',
      });
    }

    doctor = await Doctor.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: doctor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Add review to doctor
// @route   POST /api/doctors/:id/reviews
// @access  Private/Patient
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const doctor = await Doctor.findById(req.params.id);

    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }

    // Check if already reviewed
    const alreadyReviewed = doctor.reviews.find(
      (r) => r.patient.toString() === req.user.id
    );

    if (alreadyReviewed) {
      return res.status(400).json({
        success: false,
        message: 'Doctor already reviewed',
      });
    }

    const review = {
      patient: req.user.id,
      rating: Number(rating),
      comment,
    };

    doctor.reviews.push(review);

    // Calculate average rating
    doctor.rating =
      doctor.reviews.reduce((acc, item) => item.rating + acc, 0) /
      doctor.reviews.length;

    await doctor.save();

    res.status(201).json({
      success: true,
      message: 'Review added',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
