const mongoose = require('mongoose');
const Clinic = require('../models/Clinic');
const Review = require('../models/Review');
const Doctor = require('../models/Doctor');
const Service = require('../models/Service');

exports.getAllApprovedClinics = async (req, res) => {
	const { search } = req.query;
	let query = { isApproved: 'approved' };
	if (search) {
		const searchTerm = new RegExp(search, 'i');
		query.$or = [{ name: searchTerm }, { 'address.city': searchTerm }, { 'doctorDetails.name': searchTerm }, { 'doctorDetails.specialization': searchTerm }];
	}
	const clinics = await Clinic.find(query).select('-password').lean();
	const clinicsWithRatings = await Promise.all(clinics.map(async (clinic) => {
		const reviews = await Review.find({ clinicId: clinic._id });
		const avgRating = reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0;
		return { ...clinic, avgRating: avgRating.toFixed(1), reviewCount: reviews.length };
	}));
	res.json(clinicsWithRatings);
};

exports.getClinicById = async (req, res) => {
	try {
		if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(400).json({ message: 'Invalid Clinic ID format' });
		const clinic = await Clinic.findById(req.params.id).select('-password').lean();
		if (!clinic || clinic.isApproved !== 'approved') return res.status(404).json({ message: 'Clinic not found' });
		clinic.reviews = await Review.find({ clinicId: clinic._id }).populate('userId', 'name').lean();
		const avgRating = clinic.reviews.length > 0 ? clinic.reviews.reduce((acc, r) => acc + r.rating, 0) / clinic.reviews.length : 0;
		clinic.avgRating = avgRating.toFixed(1);
		clinic.reviewCount = clinic.reviews.length;
		clinic.reviews.forEach(r => {
			r.userName = r.userId ? r.userId.name : 'Anonymous';
			delete r.userId;
		});
		// Attach doctors and services
		clinic.doctors = await Doctor.find({ clinicId: clinic._id }).lean();
		clinic.services = await Service.find({ clinicId: clinic._id }).lean();

		res.json(clinic);
	} catch (error) {
		console.error("Error in getClinicById:", error);
		res.status(500).json({ message: "Server error while fetching clinic details." });
	}
};