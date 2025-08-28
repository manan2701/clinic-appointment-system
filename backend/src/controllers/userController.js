const Appointment = require('../models/Appointment');
const Review = require('../models/Review');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.getDashboard = async (req, res) => {
	const appointments = await Appointment.find({ userId: req.user.id }).populate('clinicId', 'name').sort({ date: -1 }).lean();
	const transformedAppointments = appointments.map(app => ({ ...app, clinicName: app.clinicId ? app.clinicId.name : 'Unknown Clinic', clinicId: app.clinicId ? app.clinicId._id : null }));
	const upcoming = transformedAppointments.filter(a => a.status === 'booked' && new Date(a.date) >= new Date());
	const past = transformedAppointments.filter(a => a.status !== 'booked' || new Date(a.date) < new Date());
	res.json({ upcoming, past });
};

exports.bookAppointment = async (req, res) => {
	const { clinicId, date, time, reason, doctorId, serviceId } = req.body;
	if (!clinicId || !date || !time || !reason) return res.status(400).json({ message: 'Missing required fields' });
	await new Appointment({ userId: req.user.id, clinicId, date, time, reason, doctorId, serviceId }).save();
	res.status(201).json({ message: 'Appointment booked successfully' });
};

exports.addReview = async (req, res) => {
	const { clinicId, rating, comment } = req.body;
	const hasCompletedAppointment = await Appointment.findOne({ userId: req.user.id, clinicId, status: 'completed' });
	if (!hasCompletedAppointment) return res.status(403).json({ message: 'You can only review after a completed appointment.' });
	await new Review({ userId: req.user.id, clinicId, rating, comment }).save();
	res.status(201).json({ message: 'Review submitted successfully' });
};

exports.cancelAppointment = async (req, res) => {
	const { id } = req.params;
	const appt = await Appointment.findOne({ _id: id, userId: req.user.id });
	if (!appt) return res.status(404).json({ message: 'Appointment not found' });
	if (appt.status !== 'booked') return res.status(400).json({ message: 'Only booked appointments can be cancelled' });
	appt.status = 'cancelled';
	await appt.save();
	return res.json({ message: 'Appointment cancelled' });
};

exports.rescheduleAppointment = async (req, res) => {
	const { id } = req.params;
	const { date, time, doctorId } = req.body || {};
	if (!date || !time) return res.status(400).json({ message: 'Date and time are required' });
	const appt = await Appointment.findOne({ _id: id, userId: req.user.id });
	if (!appt) return res.status(404).json({ message: 'Appointment not found' });
	if (appt.status !== 'booked') return res.status(400).json({ message: 'Only booked appointments can be rescheduled' });
	appt.date = date;
	appt.time = time;
	if (doctorId !== undefined) appt.doctorId = doctorId;
	await appt.save();
	return res.json({ message: 'Appointment rescheduled' });
};

// Get current user's profile (User role)
exports.getProfile = async (req, res) => {
    const user = await User.findById(req.user.id).select('-password').lean();
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
};

// Update current user's profile (name, dob, address, gender, photo). Optional password change
exports.updateProfile = async (req, res) => {
    const { name, dob, address, gender, photo, currentPassword, newPassword } = req.body || {};
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Update basic fields if provided
    if (typeof name === 'string' && name.trim()) user.name = name.trim();
    if (typeof dob === 'string' && dob.trim()) user.dob = dob.trim();
    if (typeof address === 'string') user.address = address;
    if (typeof gender === 'string') user.gender = gender;
    if (typeof photo === 'string') user.photo = photo;

    // Handle password change if requested
    if (newPassword) {
        if (!currentPassword) return res.status(400).json({ message: 'Current password is required to set a new password' });
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Current password is incorrect' });
        user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();
    const sanitized = user.toObject();
    delete sanitized.password;
    res.json({ message: 'Profile updated successfully', user: sanitized });
};