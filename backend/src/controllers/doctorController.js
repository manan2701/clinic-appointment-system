const Doctor = require('../models/Doctor');
const Clinic = require('../models/Clinic');

exports.listMyDoctors = async (req, res) => {
	const doctors = await Doctor.find({ clinicId: req.user.id }).lean();
	return res.json(doctors);
};

exports.createDoctor = async (req, res) => {
  try {
    const { name, specialization, bio, availability } = req.body;
    if (!name || !specialization) {
      return res.status(400).json({ message: "Name and specialization are required" });
    }
    if (req.file) {
      photo = `/assets/${req.file.filename}`; // uploaded file path
    }else{
	  photo = 'https://placehold.co/600x400/A8D5BA/FFFFFF?text=Doctor'; // default image
	}
    const doctor = await new Doctor({
      name,
      specialization,
      bio,
      availability,
      photo,
      clinicId: req.user.id, // from auth middleware
    }).save();

    return res.status(201).json({ message: "Doctor created", doctor });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Doctor creation failed", error: err });
  }
};

exports.updateDoctor = async (req, res) => {
	const { id } = req.params;
	const updates = req.body || {};
	const updated = await Doctor.findOneAndUpdate({ _id: id, clinicId: req.user.id }, updates, { new: true });
	if (!updated) return res.status(404).json({ message: 'Doctor not found' });
	return res.json({ message: 'Doctor updated', doctor: updated });
};

exports.deleteDoctor = async (req, res) => {
	const { id } = req.params;
	const deleted = await Doctor.findOneAndDelete({ _id: id, clinicId: req.user.id });
	if (!deleted) return res.status(404).json({ message: 'Doctor not found' });
	return res.json({ message: 'Doctor deleted' });
};

// Public
exports.getDoctorPublic = async (req, res) => {
	const doc = await Doctor.findById(req.params.id).lean();
	if (!doc) return res.status(404).json({ message: 'Doctor not found' });
	const clinic = await Clinic.findById(doc.clinicId).select('name address photo').lean();
	return res.json({ ...doc, clinic });
};

exports.getDoctorsByClinicPublic = async (req, res) => {
	const doctors = await Doctor.find({ clinicId: req.params.id }).lean();
	return res.json(doctors);
};