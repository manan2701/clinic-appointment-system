const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Clinic = require('../models/Clinic');

const JWT_SECRET = 'a_very_strong_and_secret_jwt_key_for_careysite_project_2025';
// FIX: Added the new license number to the set of valid licenses
const validLicenses = new Set(['CLINIC-12345','111111', 'CLINIC-67890', 'CLINIC-ABCDE', 'CLINIC-XYZ78', 'CLINIC-PQR12', 'CLINIC-NEW01']);

exports.registerUser = async (req, res) => {
    const { name, email, password, dob } = req.body;
    if (!name || !email || !password || !dob) return res.status(400).json({ message: 'All fields are required' });
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ message: 'Email already exists' });
    const hashedPassword = await bcrypt.hash(password, 10);
    await new User({ name, email, password: hashedPassword, dob }).save();
    res.status(201).json({ message: 'User registered successfully' });
};

exports.registerClinic = async (req, res) => {
    const { name, email, password, licenseNumber } = req.body;
    if (!name || !email || !password || !licenseNumber) return res.status(400).json({ message: 'All fields are required' });
    if (!validLicenses.has(licenseNumber)) return res.status(400).json({ message: 'Invalid license number' });
    const existingClinic = await Clinic.findOne({ email });
    if (existingClinic) return res.status(409).json({ message: 'Email already exists' });
    const existingLicense = await Clinic.findOne({ licenseNumber });
    if (existingLicense) return res.status(409).json({ message: 'License number already exists' });
    const hashedPassword = await bcrypt.hash(password, 10);
    await new Clinic({ name, email, password: hashedPassword, licenseNumber }).save();
    res.status(201).json({ message: 'Clinic registration request submitted. Awaiting admin approval.' });
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    let user = await User.findOne({ email }) || await Clinic.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.role === 'Clinic' && user.isApproved !== 'approved') {
        const message = user.isApproved === 'pending' ? 'Your clinic registration is still pending approval.' : 'Your clinic registration has been rejected.';
        return res.status(403).json({ message });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id, name: user.name, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
    const userDetails = user.toObject();
    delete userDetails.password;
    res.json({ token, user: userDetails });
};
