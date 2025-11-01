// ===== FILE: backend/controllers/billController.js =====
const Bill = require('../models/Bill');
const Appointment = require('../models/Appointment');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// @desc    Create bill
// @route   POST /api/bills
// @access  Private/Doctor/Admin
exports.createBill = async (req, res) => {
  try {
    const {
      patient,
      appointment,
      items,
      consultationFee,
      medicinesCost,
      testsCost,
      otherCharges,
      tax,
      discount,
    } = req.body;

    const subtotal =
      (consultationFee || 0) +
      (medicinesCost || 0) +
      (testsCost || 0) +
      (otherCharges || 0);

    const totalAmount = subtotal + (tax || 0) - (discount || 0);

    const bill = await Bill.create({
      patient,
      appointment,
      items,
      consultationFee,
      medicinesCost,
      testsCost,
      otherCharges,
      subtotal,
      tax,
      discount,
      totalAmount,
    });

    res.status(201).json({
      success: true,
      data: bill,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all bills
// @route   GET /api/bills
// @access  Private
exports.getBills = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'patient') {
      query.patient = req.user.id;
    }

    const bills = await Bill.find(query)
      .populate('patient', 'name email phone')
      .populate('appointment')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: bills.length,
      data: bills,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single bill
// @route   GET /api/bills/:id
// @access  Private
exports.getBill = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id)
      .populate('patient', 'name email phone address')
      .populate('appointment');

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found',
      });
    }

    res.status(200).json({
      success: true,
      data: bill,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create payment intent
// @route   POST /api/bills/:id/payment-intent
// @access  Private/Patient
exports.createPaymentIntent = async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found',
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(bill.totalAmount * 100), // Convert to cents
      currency: 'inr',
      metadata: {
        billId: bill._id.toString(),
      },
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update payment status
// @route   PUT /api/bills/:id/payment
// @access  Private/Patient
exports.updatePaymentStatus = async (req, res) => {
  try {
    const { paymentMethod, stripePaymentId } = req.body;

    const bill = await Bill.findById(req.params.id);

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: 'Bill not found',
      });
    }

    bill.paymentStatus = 'paid';
    bill.paymentMethod = paymentMethod;
    bill.paidAmount = bill.totalAmount;
    bill.stripePaymentId = stripePaymentId;

    await bill.save();

    // Update appointment payment status
    if (bill.appointment) {
      await Appointment.findByIdAndUpdate(bill.appointment, {
        paymentStatus: 'paid',
      });
    }

    res.status(200).json({
      success: true,
      data: bill,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};