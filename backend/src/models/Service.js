const mongoose = require('mongoose');
const serviceSchema = new mongoose.Schema({
	clinicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic', required: true },
	name: { type: String, required: true },
	price: { type: Number, required: true, min: 0 },
	durationMinutes: { type: Number, required: true, min: 5 },
	description: String,
}, { timestamps: true });
module.exports = mongoose.model('Service', serviceSchema);