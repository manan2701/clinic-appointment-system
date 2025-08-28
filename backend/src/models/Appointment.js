const mongoose = require('mongoose');
const appointmentSchema = new mongoose.Schema({
	userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
	clinicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic', required: true },
	doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
	serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
	date: { type: String, required: true },
	time: { type: String, required: true },
	reason: { type: String, required: true },
	status: { type: String, enum: ['booked', 'completed', 'cancelled'], default: 'booked' },
}, { timestamps: true });
module.exports = mongoose.model('Appointment', appointmentSchema);