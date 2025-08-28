const Service = require('../models/Service');

exports.listMyServices = async (req, res) => {
	const services = await Service.find({ clinicId: req.user.id }).lean();
	return res.json(services);
};

exports.createService = async (req, res) => {
	const { name, price, durationMinutes, description } = req.body;
	if (!name || price == null || !durationMinutes) return res.status(400).json({ message: 'Name, price, and duration are required' });
	const service = await new Service({ clinicId: req.user.id, name, price, durationMinutes, description }).save();
	return res.status(201).json({ message: 'Service created', service });
};

exports.updateService = async (req, res) => {
	const { id } = req.params;
	const updates = req.body || {};
	const updated = await Service.findOneAndUpdate({ _id: id, clinicId: req.user.id }, updates, { new: true });
	if (!updated) return res.status(404).json({ message: 'Service not found' });
	return res.json({ message: 'Service updated', service: updated });
};

exports.deleteService = async (req, res) => {
	const { id } = req.params;
	const deleted = await Service.findOneAndDelete({ _id: id, clinicId: req.user.id });
	if (!deleted) return res.status(404).json({ message: 'Service not found' });
	return res.json({ message: 'Service deleted' });
};

// Public
exports.getServicesByClinicPublic = async (req, res) => {
	const services = await Service.find({ clinicId: req.params.id }).lean();
	return res.json(services);
};