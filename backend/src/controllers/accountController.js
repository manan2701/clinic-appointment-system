const User = require('../models/User');
const Clinic = require('../models/Clinic');
const Appointment = require('../models/Appointment');
const Review = require('../models/Review');
const Doctor = require('../models/Doctor');
const Service = require('../models/Service');

exports.deleteMyAccount = async (req, res) => {
	const { role, id } = req.user;
	if (role === 'User') {
		await Promise.all([
			Appointment.deleteMany({ userId: id }),
			Review.deleteMany({ userId: id }),
		]);
		await User.findByIdAndDelete(id);
		return res.json({ message: 'Your account and associated data have been deleted.' });
	}
	if (role === 'Clinic') {
		await Promise.all([
			Appointment.deleteMany({ clinicId: id }),
			Review.deleteMany({ clinicId: id }),
			Doctor.deleteMany({ clinicId: id }),
			Service.deleteMany({ clinicId: id }),
		]);
		await Clinic.findByIdAndDelete(id);
		return res.json({ message: 'Clinic account and all associated data have been deleted.' });
	}
	return res.status(400).json({ message: 'Unsupported role for account deletion' });
};