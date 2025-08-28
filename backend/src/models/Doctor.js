const mongoose = require('mongoose');
const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    specialization: { type: String, required: true },
    bio: String,
    photo: { type: String, default: 'https://placehold.co/600x400/A8D5BA/FFFFFF?text=Doctor'},
    clinicId: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic', required: true },
}, { timestamps: true });
module.exports = mongoose.model('Doctor', doctorSchema);
