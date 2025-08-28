const User = require('../models/User');
const Clinic = require('../models/Clinic');
const Appointment = require('../models/Appointment');

exports.getDashboardStats = async (req, res) => {
    try {
        const [totalUsers, totalClinics, totalAppointments, pendingApprovals, appointments] = await Promise.all([
            User.countDocuments({ role: 'User' }),
            Clinic.countDocuments(),
            Appointment.countDocuments(),
            Clinic.countDocuments({ isApproved: 'pending' }),
            Appointment.find().sort({ createdAt: -1 }).limit(100).lean()
        ]);
        const weeklyAppointments = Array(7).fill(0).map((_, i) => ({ name: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][i], count: 0 }));
        appointments.forEach(app => {
            const appDate = new Date(app.date);
            if (app.date && !isNaN(appDate.getTime())) {
                const dayOfWeek = appDate.getDay();
                weeklyAppointments[dayOfWeek].count++;
            }
        });
        res.json({ totalUsers, totalClinics, totalAppointments, pendingApprovals, weeklyAppointments });
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        res.status(500).json({ message: "Failed to load dashboard statistics." });
    }
};

exports.getPendingClinics = async (req, res) => res.json(await Clinic.find({ isApproved: 'pending' }));
exports.approveClinic = async (req, res) => res.json(await Clinic.findByIdAndUpdate(req.params.id, { isApproved: 'approved' }, { new: true }));
exports.rejectClinic = async (req, res) => res.json(await Clinic.findByIdAndUpdate(req.params.id, { isApproved: 'rejected' }, { new: true }));
exports.getAllUsers = async (req, res) => res.json(await User.find({ role: 'User' }).select('-password'));
exports.getAllClinics = async (req, res) => res.json(await Clinic.find().select('-password'));
