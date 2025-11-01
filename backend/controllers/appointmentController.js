
// ===== FILE: backend/controllers/appointmentController.js =====
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const sendEmail = require('../utils/sendEmail');

// @desc    Create appointment
// @route   POST /api/appointments
// @access  Private/Patient
exports.createAppointment = async (req, res) => {
  try {
    const {
      doctor,
      hospital,
      appointmentDate,
      timeSlot,
      reasonForVisit,
      symptoms,
    } = req.body;

    // Check if time slot is available
    const existingAppointment = await Appointment.findOne({
      doctor,
      appointmentDate,
      'timeSlot.startTime': timeSlot.startTime,
      status: { $in: ['scheduled', 'confirmed'] },
    });

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'Time slot not available',
      });
    }

    // Get doctor details
    const doctorDetails = await Doctor.findById(doctor).populate('user');

    const appointment = await Appointment.create({
      patient: req.user.id,
      doctor,
      hospital,
      appointmentDate,
      timeSlot,
      reasonForVisit,
      symptoms,
      amount: doctorDetails.consultationFee,
    });

    // Send confirmation email
    const patientUser = await User.findById(req.user.id);
    await sendEmail({
      email: patientUser.email,
      subject: 'Appointment Confirmation',
      html: `
        <h2>Appointment Confirmed</h2>
        <p>Dear ${patientUser.name},</p>
        <p>Your appointment has been scheduled with Dr. ${doctorDetails.user.name}</p>
        <p><strong>Date:</strong> ${new Date(appointmentDate).toLocaleDateString()}</p>
        <p><strong>Time:</strong> ${timeSlot.startTime} - ${timeSlot.endTime}</p>
        <p><strong>Consultation Fee:</strong> ₹${doctorDetails.consultationFee}</p>
        <p>Thank you for choosing our healthcare system.</p>
      `,
    });

    res.status(201).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all appointments
// @route   GET /api/appointments
// @access  Private
exports.getAppointments = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'patient') {
      query.patient = req.user.id;
    } else if (req.user.role === 'doctor') {
      const doctor = await Doctor.findOne({ user: req.user.id });
      query.doctor = doctor._id;
    }

    const appointments = await Appointment.find(query)
      .populate('patient', 'name email phone')
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name email phone' },
      })
      .populate('hospital', 'name address')
      .sort({ appointmentDate: -1 });

    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Private
exports.getAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email phone address')
      .populate({
        path: 'doctor',
        populate: { path: 'user', select: 'name email phone' },
      })
      .populate('hospital', 'name address phone');

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id
// @access  Private/Doctor
exports.updateAppointment = async (req, res) => {
  try {
    let appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Cancel appointment
// @route   DELETE /api/appointments/:id
// @access  Private
exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    appointment.status = 'cancelled';
    await appointment.save();

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Add prescription to appointment
// @route   POST /api/appointments/:id/prescription
// @access  Private/Doctor
exports.addPrescription = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    appointment.prescription = req.body;
    appointment.status = 'completed';
    await appointment.save();

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};